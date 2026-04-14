// 会在 name-map.json 生成后正式导入
// 先提供类型和逻辑框架

interface NameMapData {
  nameMap: Record<string, string>; // 中文名 → slug
  idMap: Record<string, string>; // 编号字符串 → slug
}

let mapData: NameMapData | null = null;

async function loadNameMap(): Promise<NameMapData> {
  if (mapData) return mapData;
  try {
    const data = await import("./name-map.json");
    mapData = data.default ?? data;
    return mapData;
  } catch {
    // name-map.json 尚未生成时的降级
    mapData = { nameMap: {}, idMap: {} };
    return mapData;
  }
}

export async function resolveNameToSlug(input: string): Promise<string> {
  const trimmed = input.trim();

  // 纯数字 → 编号查询
  if (/^\d+$/.test(trimmed)) {
    const map = await loadNameMap();
    const slug = map.idMap[trimmed];
    if (slug) return slug;
    // 编号直接作为 ID 用，PokeAPI 支持
    return trimmed;
  }

  // 含中文字符 → 查映射表
  if (/[\u4e00-\u9fff]/.test(trimmed)) {
    const map = await loadNameMap();
    const slug = map.nameMap[trimmed];
    if (!slug) {
      throw new Error(`找不到宝可梦：${trimmed}`);
    }
    return slug;
  }

  // 英文名 → 小写化
  return trimmed.toLowerCase();
}
