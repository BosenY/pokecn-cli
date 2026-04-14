import React from "react";
import { Box, Text } from "ink";

const TYPE_EMOJI: Record<string, string> = {
  normal: "⬜", fire: "🔥", water: "🌊", electric: "⚡",
  grass: "🌿", ice: "🧊", fighting: "🥊", poison: "☠️",
  ground: "🌍", flying: "🕊️", psychic: "🔮", bug: "🐛",
  rock: "🪨", ghost: "👻", dragon: "🐲", dark: "🌑",
  steel: "⚙️", fairy: "🧚",
};

const TYPE_ZH: Record<string, string> = {
  normal: "一般", fire: "火", water: "水", electric: "电",
  grass: "草", ice: "冰", fighting: "格斗", poison: "毒",
  ground: "地面", flying: "飞行", psychic: "超能力", bug: "虫",
  rock: "岩石", ghost: "幽灵", dragon: "龙", dark: "恶",
  steel: "钢", fairy: "妖精",
};

export interface PokemonEntry {
  id: string;
  zh: string;
  en: string;
  types?: string[];
}

interface Props {
  items: PokemonEntry[];
  selectedIndex: number;
  lang: string;
}

export function PokemonList({ items, selectedIndex, lang }: Props) {
  if (items.length === 0) {
    return (
      <Box paddingX={1}>
        <Text dimColor>{lang === "zh" ? "没有找到匹配的宝可梦" : "No Pokémon found"}</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      {items.map((item, i) => {
        const isSelected = i === selectedIndex;
        const idStr = `#${item.id.padStart(4, "0")}`;
        const typeStr = item.types
          ? item.types.map((t) => {
              const emoji = TYPE_EMOJI[t] ?? "";
              const label = lang === "zh" ? (TYPE_ZH[t] ?? t) : t;
              return `${emoji} ${label}`;
            }).join("  ")
          : "";

        return (
          <Box key={item.en} paddingX={1}>
            {isSelected ? (
              <Text backgroundColor="cyan" color="black" bold>
                {` ${idStr}  ${item.zh}  ${item.en}  ${typeStr} `}
              </Text>
            ) : (
              <Text>
                <Text dimColor>{idStr}  </Text>
                <Text>{item.zh}  </Text>
                <Text dimColor>{item.en}  </Text>
                <Text dimColor>{typeStr}</Text>
              </Text>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
