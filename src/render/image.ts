import terminalImage from "terminal-image";
import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { dirs, ensureDirs } from "../cache/index.ts";

const SPRITES_BASE =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon";

function getSpriteUrls(id: number, shiny: boolean): string[] {
  if (shiny) {
    return [
      `${SPRITES_BASE}/other/official-artwork/shiny/${id}.png`,
      `${SPRITES_BASE}/other/home/shiny/${id}.png`,
      `${SPRITES_BASE}/shiny/${id}.png`,
    ];
  }
  return [
    `${SPRITES_BASE}/other/official-artwork/${id}.png`,
    `${SPRITES_BASE}/other/home/${id}.png`,
    `${SPRITES_BASE}/${id}.png`,
  ];
}

async function downloadWithFallback(
  urls: string[],
): Promise<Buffer | null> {
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return Buffer.from(await res.arrayBuffer());
      }
    } catch {
      // try next
    }
  }
  return null;
}

export async function getSpriteBuffer(
  id: number,
  shiny: boolean,
): Promise<Buffer | null> {
  await ensureDirs();

  const subDir = shiny ? "shiny" : "normal";
  const localPath = join(dirs.sprites, subDir, `${id}.png`);

  try {
    return await readFile(localPath);
  } catch {
    // 本地缓存不存在，继续下载
  }

  const urls = getSpriteUrls(id, shiny);
  const buffer = await downloadWithFallback(urls);

  if (buffer) {
    await writeFile(localPath, buffer);
  }

  return buffer;
}

export async function renderSprite(
  id: number,
  shiny: boolean,
): Promise<string> {
  const buffer = await getSpriteBuffer(id, shiny);
  if (!buffer) return "";

  return terminalImage.buffer(buffer, {
    width: "30%",
    preserveAspectRatio: true,
  });
}
