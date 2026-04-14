import React from "react";
import { Box, Text, useStdout } from "ink";
import type { Pokemon, PokemonSpecies, EvolutionStep } from "../../api/types.ts";
import { getLocalizedName, getLocalizedGenus, getFlavorText } from "../../api/species.ts";
import { t } from "../../i18n/index.ts";
import { TypeBadges } from "./TypeBadge.tsx";
import { StatsBar, StatsTotalRow } from "./StatsBar.tsx";
import { EvolutionChain } from "./EvolutionChain.tsx";
import { SpriteBox } from "./SpriteBox.tsx";

const STAT_KEYS = [
  { key: "hp",              labelKey: "hp"            },
  { key: "attack",          labelKey: "attack"        },
  { key: "defense",         labelKey: "defense"       },
  { key: "special-attack",  labelKey: "specialAttack" },
  { key: "special-defense", labelKey: "specialDefense"},
  { key: "speed",           labelKey: "speed"         },
] as const;

interface Props {
  pokemon: Pokemon;
  species: PokemonSpecies;
  evolutionSteps: EvolutionStep[];
  lang: string;
  shiny: boolean;
  showImage: boolean;
  abilityNames: Map<string, { zh: string; en: string; desc: string }>;
  slugToZh?: Map<string, string>;
  spriteAnsi?: string; // 预加载好的精灵图 ANSI，传入时跳过 SpriteBox 内部异步
}

function Divider({ width }: { width: number }) {
  return <Text dimColor>{"─".repeat(width)}</Text>;
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Box marginTop={1}>
      <Text bold color="cyan">{title}</Text>
    </Box>
  );
}

export function PokemonCard({
  pokemon,
  species,
  evolutionSteps,
  lang,
  shiny,
  showImage,
  abilityNames,
  slugToZh,
  spriteAnsi,
}: Props) {
  const { stdout } = useStdout();
  const termWidth = stdout?.columns ?? 80;
  const cardWidth = Math.min(termWidth - 2, 90);
  const barWidth = Math.max(20, cardWidth - 20);

  const i18n = t(lang);
  const { zhName, enName } = getLocalizedName(species, lang);
  const genus = getLocalizedGenus(species, lang);
  const types = pokemon.types.map((t) => t.type.name);
  const genName = i18n.generations[species.generation.name] ?? species.generation.name;

  const idStr = `#${String(pokemon.id).padStart(3, "0")}`;
  const primaryName = lang === "zh" ? zhName : enName;
  const secondaryName = lang === "zh" ? enName : zhName;

  // 进化链 nameResolver：优先查 slugToZh，再格式化 slug
  const nameResolver = (slug: string): string => {
    if (slug === species.name) return lang === "zh" ? zhName : enName;
    if (lang === "zh" && slugToZh?.has(slug)) return slugToZh.get(slug)!;
    return slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  };

  const h = (pokemon.height / 10).toFixed(1);
  const w = (pokemon.weight / 10).toFixed(1);

  let genderStr: string;
  if (species.gender_rate === -1) {
    genderStr = i18n.genderless;
  } else {
    const femalePercent = (species.gender_rate / 8) * 100;
    const malePercent = 100 - femalePercent;
    genderStr = `${i18n.male} ${malePercent}% ${i18n.female} ${femalePercent}%`;
  }

  const growthStr = i18n.growthRates[species.growth_rate.name] ?? species.growth_rate.name;
  const eggStr = species.egg_groups
    .map((eg) => i18n.eggGroupNames[eg.name] ?? eg.name)
    .join(lang === "zh" ? "、" : " / ");

  const total = pokemon.stats.reduce((s, st) => s + st.base_stat, 0);
  const flavor = getFlavorText(species, lang);

  return (
    <Box flexDirection="column" width={cardWidth} borderStyle="round" borderColor="cyan" paddingX={1}>

      {/* 头部：名称 + 属性 */}
      <Box flexDirection="row" justifyContent="space-between">
        <Box>
          <Text bold color="white">{idStr} {primaryName}</Text>
          <Text dimColor> / {secondaryName}</Text>
        </Box>
        <TypeBadges typeNames={types} lang={lang} />
      </Box>

      <Box flexDirection="row" gap={2}>
        <Text dimColor>{genus}</Text>
        <Text dimColor>·</Text>
        <Text>{genName}</Text>
        {species.is_legendary && <Text color="yellow"> · {i18n.legendary}</Text>}
        {species.is_mythical && <Text color="magenta"> · {i18n.mythical}</Text>}
      </Box>

      <Divider width={cardWidth - 4} />

      {/* 精灵图：独占一行，不约束宽度避免 ANSI 条纹 */}
      {showImage && (
        <SpriteBox pokemonId={pokemon.id} shiny={shiny} preloaded={spriteAnsi} />
      )}

      {/* 基础信息 */}
      <SectionTitle title={i18n.baseInfo} />
      <Text>  {i18n.height}: <Text bold>{h}m</Text>   {i18n.weight}: <Text bold>{w}kg</Text>   {i18n.captureRate}: <Text bold>{species.capture_rate}</Text></Text>
      <Text>  {i18n.genderRatio}: <Text bold>{genderStr}</Text>   {i18n.baseHappiness}: <Text bold>{species.base_happiness ?? "?"}</Text></Text>
      <Text>  {i18n.growthRate}: <Text bold>{growthStr}</Text>   {i18n.eggGroups}: <Text bold>{eggStr}</Text></Text>

      <Divider width={cardWidth - 4} />

      {/* 种族值 */}
      <SectionTitle title={i18n.baseStats} />
      {STAT_KEYS.map(({ key, labelKey }) => {
        const stat = pokemon.stats.find((s) => s.stat.name === key);
        const value = stat?.base_stat ?? 0;
        return (
          <StatsBar
            key={key}
            label={String(i18n[labelKey])}
            value={value}
            barWidth={barWidth}
          />
        );
      })}
      <StatsTotalRow
        total={total}
        label={lang === "zh" ? "总计" : "Total"}
        barWidth={barWidth}
      />

      <Divider width={cardWidth - 4} />

      {/* 特性 */}
      <SectionTitle title={i18n.abilities} />
      {pokemon.abilities.map((ab) => {
        const info = abilityNames.get(ab.ability.name);
        const displayName = info
          ? (lang === "zh" ? info.zh : info.en)
          : ab.ability.name.replace(/-/g, " ");
        const desc = info?.desc ?? "";
        return (
          <Box key={ab.ability.name}>
            <Text color={ab.is_hidden ? "magenta" : "cyan"}>
              {ab.is_hidden ? "◆ " : "● "}
            </Text>
            <Text bold>{displayName}</Text>
            {ab.is_hidden && (
              <Text dimColor> [{i18n.hiddenAbility}]</Text>
            )}
            {desc && <Text dimColor>  {desc}</Text>}
          </Box>
        );
      })}

      <Divider width={cardWidth - 4} />

      {/* 进化链 */}
      <SectionTitle title={i18n.evolutionChain} />
      <EvolutionChain steps={evolutionSteps} nameResolver={nameResolver} lang={lang} />

      {/* 图鉴描述 */}
      {flavor && (
        <>
          <Divider width={cardWidth - 4} />
          <SectionTitle title={`${i18n.dexEntry}（${flavor.version}）`} />
          <Text wrap="wrap">{flavor.text}</Text>
        </>
      )}

    </Box>
  );
}
