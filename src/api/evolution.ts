import { cachedFetch } from "../cache/index.ts";
import type {
  EvolutionChainResponse,
  EvolutionNode,
  EvolutionStep,
} from "./types.ts";

export async function getEvolutionChain(
  url: string,
): Promise<EvolutionStep[]> {
  const data = await cachedFetch<EvolutionChainResponse>(url);
  return flattenChain(data.chain);
}

function flattenChain(node: EvolutionNode): EvolutionStep[] {
  const steps: EvolutionStep[] = [];

  function walk(current: EvolutionNode): void {
    for (const child of current.evolves_to) {
      steps.push({
        from: current.species.name,
        to: child.species.name,
        details: child.evolution_details,
      });
      walk(child);
    }
  }

  walk(node);
  return steps;
}

export function getBaseSpeciesName(
  url: string,
): string | null {
  // Evolution chain 的根节点 species 不在 steps 里
  // 但我们可以从 URL 获取 chain id
  return null;
}
