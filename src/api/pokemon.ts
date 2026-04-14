import { cachedFetch } from "../cache/index.ts";
import type { Pokemon } from "./types.ts";

export async function getPokemon(slug: string): Promise<Pokemon> {
  return cachedFetch<Pokemon>(`pokemon/${slug}`);
}
