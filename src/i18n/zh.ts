export const zh = {
  // 基础标签
  baseInfo: "基础信息",
  baseStats: "基础数值",
  abilities: "特性",
  evolutionChain: "进化链",
  dexEntry: "图鉴描述",
  total: "总计",

  // 属性标签
  height: "身高",
  weight: "体重",
  captureRate: "捕获率",
  baseHappiness: "基础友好度",
  genderRatio: "性别比例",
  growthRate: "成长速度",
  eggGroups: "蛋组",
  generation: "世代",

  // 六维
  hp: "HP",
  attack: "攻击",
  defense: "防御",
  specialAttack: "特攻",
  specialDefense: "特防",
  speed: "速度",

  // 特性
  hiddenAbility: "隐藏",

  // 进化
  noEvolution: "无进化",

  // 错误
  notFound: (name: string) => `找不到宝可梦：${name}`,
  networkError: "网络请求失败，请检查网络连接",

  // 分类
  legendary: "传说",
  mythical: "幻之",

  // 性别
  genderless: "无性别",
  male: "♂",
  female: "♀",

  // 成长速度
  growthRates: {
    slow: "慢速",
    medium: "中速",
    fast: "快速",
    "medium-slow": "较慢",
    "slow-then-very-fast": "先慢后快",
    "fast-then-very-slow": "先快后慢",
  } as Record<string, string>,

  // 蛋组
  eggGroupNames: {
    monster: "怪兽",
    water1: "水中1",
    water2: "水中2",
    water3: "水中3",
    bug: "虫",
    flying: "飞行",
    ground: "陆地",
    fairy: "妖精",
    plant: "植物",
    humanshape: "人形",
    mineral: "矿物",
    ditto: "百变怪",
    dragon: "龙",
    "no-eggs": "未发现",
    indeterminate: "不定形",
  } as Record<string, string>,

  // 世代
  generations: {
    "generation-i": "第一世代",
    "generation-ii": "第二世代",
    "generation-iii": "第三世代",
    "generation-iv": "第四世代",
    "generation-v": "第五世代",
    "generation-vi": "第六世代",
    "generation-vii": "第七世代",
    "generation-viii": "第八世代",
    "generation-ix": "第九世代",
  } as Record<string, string>,
} as const;
