#!/usr/bin/env bun

/**
 * 生成中文名 → 英文 slug 映射表
 * 调用 PokeAPI 批量获取所有 pokemon-species
 * 输出到 src/i18n/name-map.json
 */

const API_BASE = "https://pokeapi.co/api/v2";
const CONCURRENCY = 20;
const OUTPUT_PATH = "./src/i18n/name-map.json";

interface SpeciesListItem {
  name: string;
  url: string;
}

interface SpeciesDetail {
  name: string;
  id: number;
  names: { name: string; language: { name: string } }[];
}

async function main() {
  console.log("正在获取宝可梦物种列表...");
  const listRes = await fetch(`${API_BASE}/pokemon-species?limit=10000`);
  const list = (await listRes.json()) as { results: SpeciesListItem[] };
  console.log(`共 ${list.results.length} 个物种`);

  const nameMap: Record<string, string> = {};
  const idMap: Record<string, string> = {};
  let done = 0;

  // 并发控制
  async function processSpecies(item: SpeciesListItem) {
    try {
      const res = await fetch(item.url);
      const species = (await res.json()) as SpeciesDetail;
      const zhName = species.names.find(
        (n) => n.language.name === "zh-hans",
      )?.name;
      if (zhName) {
        nameMap[zhName] = species.name;
      }
      idMap[String(species.id)] = species.name;
      done++;
      if (done % 100 === 0) {
        console.log(`进度: ${done}/${list.results.length}`);
      }
    } catch (err) {
      console.error(`获取 ${item.name} 失败:`, err);
    }
  }

  // 批量并发
  for (let i = 0; i < list.results.length; i += CONCURRENCY) {
    const batch = list.results.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map(processSpecies));
  }

  const output = { nameMap, idMap };
  await Bun.write(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(
    `\n完成！共 ${Object.keys(nameMap).length} 个中文名映射，${Object.keys(idMap).length} 个编号映射`,
  );
  console.log(`已写入 ${OUTPUT_PATH}`);
}

main().catch(console.error);
