import { cachedFetch } from "../cache/index.ts";
import type { PokemonSpecies, AbilityDetail } from "./types.ts";

export async function getSpecies(slug: string): Promise<PokemonSpecies> {
  return cachedFetch<PokemonSpecies>(`pokemon-species/${slug}`);
}

export function getLocalizedName(
  species: PokemonSpecies,
  lang: string,
): { zhName: string; enName: string } {
  const locale = lang === "zh" ? "zh-hans" : "en";
  const zhEntry = species.names.find((n) => n.language.name === "zh-hans");
  const enEntry = species.names.find((n) => n.language.name === "en");
  return {
    zhName: zhEntry?.name ?? species.name,
    enName: enEntry?.name ?? species.name,
  };
}

export function getLocalizedGenus(
  species: PokemonSpecies,
  lang: string,
): string {
  const locale = lang === "zh" ? "zh-hans" : "en";
  return species.genera.find((g) => g.language.name === locale)?.genus ?? "";
}

export function getFlavorText(
  species: PokemonSpecies,
  lang: string,
): { text: string; version: string } | null {
  const locale = lang === "zh" ? "zh-hans" : "en";
  const entries = species.flavor_text_entries.filter(
    (e) => e.language.name === locale,
  );
  if (entries.length === 0) return null;
  // 取最新版本（数组最后一个）
  const entry = entries[entries.length - 1]!;
  return {
    text: entry.flavor_text.replace(/\n|\f/g, " "),
    version: entry.version.name,
  };
}

export async function getAbilityDetail(
  name: string,
): Promise<AbilityDetail> {
  return cachedFetch<AbilityDetail>(`ability/${name}`);
}
