import terminalImage from "terminal-image";
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
  const file = Bun.file(localPath);

  if (await file.exists()) {
    return Buffer.from(await file.arrayBuffer());
  }

  const urls = getSpriteUrls(id, shiny);
  const buffer = await downloadWithFallback(urls);

  if (buffer) {
    await Bun.write(localPath, buffer);
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
    width: "50%",
    preserveAspectRatio: true,
  });
}
