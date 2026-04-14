import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import { homedir } from "node:os";

const POKECN_DIR = join(homedir(), ".pokecn");
const CACHE_DIR = join(POKECN_DIR, "cache");
const SPRITES_DIR = join(POKECN_DIR, "sprites");

export const dirs = {
  root: POKECN_DIR,
  cache: CACHE_DIR,
  sprites: SPRITES_DIR,
  spritesNormal: join(SPRITES_DIR, "normal"),
  spritesShiny: join(SPRITES_DIR, "shiny"),
} as const;

let initialized = false;

export async function ensureDirs(): Promise<void> {
  if (initialized) return;
  await Promise.all([
    mkdir(dirs.cache, { recursive: true }),
    mkdir(dirs.spritesNormal, { recursive: true }),
    mkdir(dirs.spritesShiny, { recursive: true }),
  ]);
  initialized = true;
}

const API_BASE = "https://pokeapi.co/api/v2";

export async function cachedFetch<T>(
  endpoint: string,
  ttlDays = 7,
): Promise<T> {
  await ensureDirs();

  const cacheKey = endpoint.replace(/\//g, "_");
  const cacheFile = join(dirs.cache, `${cacheKey}.json`);
  const file = Bun.file(cacheFile);

  if (await file.exists()) {
    const age = (Date.now() - file.lastModified) / 1000 / 60 / 60 / 24;
    if (age < ttlDays) {
      return (await file.json()) as T;
    }
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}/${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API 请求失败: ${res.status} ${url}`);
  }

  const data = (await res.json()) as T;
  await Bun.write(cacheFile, JSON.stringify(data));
  return data;
}
