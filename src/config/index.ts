import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { dirs } from "../cache/index.ts";

export interface PokecnConfig {
  language: "zh" | "en";
  image: {
    protocol: "auto" | "kitty" | "iterm2" | "sixel" | "unicode" | "none";
    scale: number;
  };
  display: {
    showImage: boolean;
    showStats: boolean;
    showEvolution: boolean;
    showDexEntry: boolean;
  };
}

const DEFAULT_CONFIG: PokecnConfig = {
  language: "zh",
  image: {
    protocol: "auto",
    scale: 1.0,
  },
  display: {
    showImage: true,
    showStats: true,
    showEvolution: true,
    showDexEntry: true,
  },
};

export async function loadConfig(): Promise<PokecnConfig> {
  const configPath = join(dirs.root, "config.json");

  try {
    const userConfig = JSON.parse(await readFile(configPath, "utf8"));
    return deepMerge(DEFAULT_CONFIG, userConfig);
  } catch {
    return { ...DEFAULT_CONFIG };
  }
}

export function applyFlags(
  config: PokecnConfig,
  flags: { lang?: string; "no-image"?: boolean },
): PokecnConfig {
  const result = { ...config };
  if (flags.lang === "zh" || flags.lang === "en") {
    result.language = flags.lang;
  }
  if (flags["no-image"]) {
    result.display = { ...result.display, showImage: false };
  }
  return result;
}

function deepMerge<T extends Record<string, unknown>>(base: T, override: Partial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(override) as (keyof T)[]) {
    const val = override[key];
    if (val !== undefined && val !== null && typeof val === "object" && !Array.isArray(val)) {
      result[key] = deepMerge(
        base[key] as Record<string, unknown>,
        val as Record<string, unknown>,
      ) as T[keyof T];
    } else if (val !== undefined) {
      result[key] = val as T[keyof T];
    }
  }
  return result;
}
