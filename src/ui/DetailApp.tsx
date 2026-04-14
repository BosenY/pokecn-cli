import React, { useEffect, useState } from "react";
import { Box, Text, useApp, useInput } from "ink";
import { renderSprite } from "../render/image.ts";
import { getPokemon } from "../api/pokemon.ts";
import { getSpecies, getAbilityDetail } from "../api/species.ts";
import { getEvolutionChain } from "../api/evolution.ts";
import type { Pokemon, PokemonSpecies, EvolutionStep } from "../api/types.ts";
import { t } from "../i18n/index.ts";
import { PokemonCard } from "./components/PokemonCard.tsx";

// 构建 slug→中文名 的查找表
async function buildSlugToZh(): Promise<Map<string, string>> {
  try {
    const data: { nameMap: Record<string, string> } = await import("../i18n/name-map.json");
    const map = data.nameMap ?? (data as any).default?.nameMap;
    const result = new Map<string, string>();
    for (const [zh, en] of Object.entries(map)) {
      result.set(en, zh);
    }
    return result;
  } catch {
    return new Map();
  }
}

interface Props {
  slug: string;
  lang: string;
  shiny?: boolean;
  showImage?: boolean;
  autoExit?: boolean;          // pokecn get 模式：渲染完自动退出
  onBack?: () => void;         // pokecn search 模式：返回搜索列表
}

type State =
  | { status: "loading" }
  | { status: "error"; message: string; code: number }
  | {
      status: "done";
      pokemon: Pokemon;
      species: PokemonSpecies;
      evolutionSteps: EvolutionStep[];
      abilityNames: Map<string, { zh: string; en: string; desc: string }>;
      slugToZh: Map<string, string>;
      spriteAnsi: string | undefined;
    };

export function DetailApp({
  slug,
  lang,
  shiny: initialShiny = false,
  showImage = true,
  autoExit = false,
  onBack,
}: Props) {
  const { exit } = useApp();
  const i18n = t(lang);

  const [state, setState] = useState<State>({ status: "loading" });
  const [shiny, setShiny] = useState(initialShiny);
  const [ready, setReady] = useState(false);
  const [spriteOverride, setSpriteOverride] = useState<string | undefined>(undefined);

  useEffect(() => {
    setState({ status: "loading" });
    setReady(false);

    async function load() {
      try {
        const [pokemon, species] = await Promise.all([
          getPokemon(slug),
          getSpecies(slug),
        ]);
        const [evolutionSteps, slugToZh] = await Promise.all([
          getEvolutionChain(species.evolution_chain.url),
          buildSlugToZh(),
        ]);

        const abilityNames = new Map<string, { zh: string; en: string; desc: string }>();
        await Promise.all(
          pokemon.abilities.map(async (ab) => {
            try {
              const detail = await getAbilityDetail(ab.ability.name);
              const zhName = detail.names.find((n) => n.language.name === "zh-hans")?.name ?? ab.ability.name;
              const enName = detail.names.find((n) => n.language.name === "en")?.name ?? ab.ability.name;
              const locale = lang === "zh" ? "zh-hans" : "en";
              const descEntries = detail.flavor_text_entries.filter((e) => e.language.name === locale);
              const desc = descEntries.length > 0
                ? descEntries[descEntries.length - 1]!.flavor_text.replace(/\n|\f/g, " ")
                : "";
              abilityNames.set(ab.ability.name, { zh: zhName, en: enName, desc });
            } catch {}
          }),
        );

        // 精灵图也在这里加载，确保 autoExit 时图片已就绪
        let spriteAnsi: string | undefined;
        if (showImage) {
          try {
            const result = await renderSprite(pokemon.id, shiny);
            spriteAnsi = result || undefined;
          } catch {}
        }

        setState({ status: "done", pokemon, species, evolutionSteps, abilityNames, slugToZh, spriteAnsi });
        setReady(true);
      } catch (err: any) {
        const is404 = err.message?.includes("404");
        setState({
          status: "error",
          message: is404
            ? (lang === "zh" ? i18n.notFound(slug) : `Pokémon not found: ${slug}`)
            : (lang === "zh" ? i18n.networkError : "Network error. Please check your connection."),
          code: is404 ? 1 : 1,
        });
      }
    }

    load();
  }, [slug]);

  // autoExit：数据加载完且卡片已渲染后退出
  useEffect(() => {
    if (autoExit && ready) {
      // 给 ink 一帧完成渲染
      const timer = setTimeout(() => exit(), 80);
      return () => clearTimeout(timer);
    }
  }, [autoExit, ready]);

  // 错误时 exit(1)
  useEffect(() => {
    if (state.status === "error") {
      const timer = setTimeout(() => exit(new Error(state.message)), 80);
      return () => clearTimeout(timer);
    }
  }, [state]);

  useInput(
    (input, key) => {
      if (input === "q" || input === "Q" || key.escape) {
        exit();
      }
      if ((input === "b" || input === "B") && onBack) {
        onBack();
      }
      if ((input === "s" || input === "S") && state.status === "done") {
        const nextShiny = !shiny;
        setShiny(nextShiny);
        setSpriteOverride(undefined); // 先清空，触发 SpriteBox 内部异步加载
      }
    },
    { isActive: !autoExit },
  );

  if (state.status === "loading") {
    return (
      <Box padding={1}>
        <Text color="cyan">Loading...</Text>
      </Box>
    );
  }

  if (state.status === "error") {
    return (
      <Box padding={1}>
        <Text color="red">{state.message}</Text>
      </Box>
    );
  }

  const { pokemon, species, evolutionSteps, abilityNames, slugToZh, spriteAnsi } = state;
  // S 键切换后用 SpriteBox 内部异步（spriteOverride=undefined），否则用预加载
  const effectiveSprite = spriteOverride !== undefined ? spriteOverride : spriteAnsi;

  return (
    <Box flexDirection="column">
      <PokemonCard
        pokemon={pokemon}
        species={species}
        evolutionSteps={evolutionSteps}
        lang={lang}
        shiny={shiny}
        showImage={showImage}
        abilityNames={abilityNames}
        slugToZh={slugToZh}
        spriteAnsi={effectiveSprite}
      />
      {!autoExit && (
        <Box marginTop={1} gap={3}>
          {onBack && <Text dimColor>[B] 返回搜索</Text>}
          <Text dimColor>[S] {shiny ? "普通形态" : "闪光形态"}</Text>
          <Text dimColor>[Q] 退出</Text>
        </Box>
      )}
    </Box>
  );
}
