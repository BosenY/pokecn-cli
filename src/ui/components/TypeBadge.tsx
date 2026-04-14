import React from "react";
import { Text } from "ink";

interface TypeInfo {
  emoji: string;
  zh: string;
  en: string;
  color: string;
}

const TYPE_MAP: Record<string, TypeInfo> = {
  normal:   { emoji: "⬜", zh: "一般",   en: "Normal",   color: "white" },
  fire:     { emoji: "🔥", zh: "火",     en: "Fire",     color: "redBright" },
  water:    { emoji: "🌊", zh: "水",     en: "Water",    color: "blueBright" },
  electric: { emoji: "⚡", zh: "电",     en: "Electric", color: "yellowBright" },
  grass:    { emoji: "🌿", zh: "草",     en: "Grass",    color: "greenBright" },
  ice:      { emoji: "🧊", zh: "冰",     en: "Ice",      color: "cyanBright" },
  fighting: { emoji: "🥊", zh: "格斗",   en: "Fighting", color: "red" },
  poison:   { emoji: "☠️",  zh: "毒",     en: "Poison",   color: "magenta" },
  ground:   { emoji: "🌍", zh: "地面",   en: "Ground",   color: "yellow" },
  flying:   { emoji: "🕊️",  zh: "飞行",   en: "Flying",   color: "cyan" },
  psychic:  { emoji: "🔮", zh: "超能力", en: "Psychic",  color: "magentaBright" },
  bug:      { emoji: "🐛", zh: "虫",     en: "Bug",      color: "green" },
  rock:     { emoji: "🪨", zh: "岩石",   en: "Rock",     color: "yellow" },
  ghost:    { emoji: "👻", zh: "幽灵",   en: "Ghost",    color: "magenta" },
  dragon:   { emoji: "🐲", zh: "龙",     en: "Dragon",   color: "blueBright" },
  dark:     { emoji: "🌑", zh: "恶",     en: "Dark",     color: "gray" },
  steel:    { emoji: "⚙️",  zh: "钢",     en: "Steel",    color: "cyan" },
  fairy:    { emoji: "🧚", zh: "妖精",   en: "Fairy",    color: "magentaBright" },
};

interface Props {
  typeName: string;
  lang: string;
}

export function TypeBadge({ typeName, lang }: Props) {
  const info = TYPE_MAP[typeName];
  if (!info) return <Text>{typeName}</Text>;
  const label = lang === "zh" ? info.zh : info.en;
  return (
    <Text color={info.color as any}>
      {info.emoji} {label}
    </Text>
  );
}

export function TypeBadges({ typeNames, lang }: { typeNames: string[]; lang: string }) {
  return (
    <Text>
      {typeNames.map((t, i) => {
        const info = TYPE_MAP[t];
        if (!info) return <Text key={t}>{t}</Text>;
        const label = lang === "zh" ? info.zh : info.en;
        return (
          <Text key={t}>
            {i > 0 ? <Text dimColor> / </Text> : null}
            <Text color={info.color as any}>{info.emoji} {label}</Text>
          </Text>
        );
      })}
    </Text>
  );
}
