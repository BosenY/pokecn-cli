export const en = {
  baseInfo: "Base Info",
  baseStats: "Base Stats",
  abilities: "Abilities",
  evolutionChain: "Evolution Chain",
  dexEntry: "Pokédex Entry",
  total: "Total",

  height: "Height",
  weight: "Weight",
  captureRate: "Catch Rate",
  baseHappiness: "Base Happiness",
  genderRatio: "Gender Ratio",
  growthRate: "Growth Rate",
  eggGroups: "Egg Groups",
  generation: "Generation",

  hp: "HP",
  attack: "Attack",
  defense: "Defense",
  specialAttack: "Sp.Atk",
  specialDefense: "Sp.Def",
  speed: "Speed",

  hiddenAbility: "Hidden",

  noEvolution: "No evolution",

  notFound: (name: string) => `Pokémon not found: ${name}`,
  networkError: "Network error. Please check your connection.",

  legendary: "Legendary",
  mythical: "Mythical",

  genderless: "Genderless",
  male: "♂",
  female: "♀",

  growthRates: {
    slow: "Slow",
    medium: "Medium",
    fast: "Fast",
    "medium-slow": "Medium Slow",
    "slow-then-very-fast": "Erratic",
    "fast-then-very-slow": "Fluctuating",
  } as Record<string, string>,

  eggGroupNames: {
    monster: "Monster",
    water1: "Water 1",
    water2: "Water 2",
    water3: "Water 3",
    bug: "Bug",
    flying: "Flying",
    ground: "Field",
    fairy: "Fairy",
    plant: "Grass",
    humanshape: "Human-Like",
    mineral: "Mineral",
    ditto: "Ditto",
    dragon: "Dragon",
    "no-eggs": "No Eggs",
    indeterminate: "Amorphous",
  } as Record<string, string>,

  generations: {
    "generation-i": "Generation I",
    "generation-ii": "Generation II",
    "generation-iii": "Generation III",
    "generation-iv": "Generation IV",
    "generation-v": "Generation V",
    "generation-vi": "Generation VI",
    "generation-vii": "Generation VII",
    "generation-viii": "Generation VIII",
    "generation-ix": "Generation IX",
  } as Record<string, string>,
} as const;
