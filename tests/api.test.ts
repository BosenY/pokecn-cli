import { describe, test, expect } from "bun:test";
import {
  getLocalizedName,
  getLocalizedGenus,
  getFlavorText,
} from "../src/api/species.ts";
import type { PokemonSpecies } from "../src/api/types.ts";

const mockSpecies: PokemonSpecies = {
  id: 25,
  name: "pikachu",
  names: [
    { name: "Pikachu", language: { name: "en" } },
    { name: "皮卡丘", language: { name: "zh-hans" } },
  ],
  genera: [
    { genus: "Mouse Pokémon", language: { name: "en" } },
    { genus: "鼠宝可梦", language: { name: "zh-hans" } },
  ],
  flavor_text_entries: [
    {
      flavor_text: "It keeps its tail\nraised to monitor\nits surroundings.",
      language: { name: "en" },
      version: { name: "red" },
    },
    {
      flavor_text: "When several of\nthese POKéMON\ngather, their\nelectricity can\ncause lightning\nstorms.",
      language: { name: "en" },
      version: { name: "scarlet" },
    },
    {
      flavor_text: "它将雷电储存在\f颊袋中。",
      language: { name: "zh-hans" },
      version: { name: "scarlet" },
    },
  ],
  evolution_chain: { url: "https://pokeapi.co/api/v2/evolution-chain/10/" },
  capture_rate: 190,
  base_happiness: 70,
  gender_rate: 4,
  is_legendary: false,
  is_mythical: false,
  generation: { name: "generation-i", url: "" },
  growth_rate: { name: "medium" },
  egg_groups: [{ name: "ground" }, { name: "fairy" }],
};

describe("species data extraction", () => {
  test("getLocalizedName extracts zh/en names", () => {
    const { zhName, enName } = getLocalizedName(mockSpecies, "zh");
    expect(zhName).toBe("皮卡丘");
    expect(enName).toBe("Pikachu");
  });

  test("getLocalizedGenus returns zh genus", () => {
    expect(getLocalizedGenus(mockSpecies, "zh")).toBe("鼠宝可梦");
  });

  test("getLocalizedGenus returns en genus", () => {
    expect(getLocalizedGenus(mockSpecies, "en")).toBe("Mouse Pokémon");
  });

  test("getFlavorText returns latest zh entry with cleaned text", () => {
    const result = getFlavorText(mockSpecies, "zh");
    expect(result).not.toBeNull();
    expect(result!.text).toBe("它将雷电储存在 颊袋中。");
    expect(result!.version).toBe("scarlet");
  });

  test("getFlavorText returns latest en entry", () => {
    const result = getFlavorText(mockSpecies, "en");
    expect(result).not.toBeNull();
    expect(result!.version).toBe("scarlet");
    expect(result!.text).not.toContain("\n");
  });
});
