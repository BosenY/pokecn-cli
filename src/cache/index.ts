import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
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

  try {
    const fileStat = await stat(cacheFile);
    const age = (Date.now() - fileStat.mtimeMs) / 1000 / 60 / 60 / 24;
    if (age < ttlDays) {
      return JSON.parse(await readFile(cacheFile, "utf8")) as T;
    }
  } catch {
    // 缓存不存在或读取失败，继续请求
  }

  const url = endpoint.startsWith("http")
    ? endpoint
    : `${API_BASE}/${endpoint}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`API 请求失败: ${res.status} ${url}`);
  }

  const data = (await res.json()) as T;
  await writeFile(cacheFile, JSON.stringify(data));
  return data;
}
