import { describe, test, expect } from "bun:test";
import { renderStats } from "../src/render/stats.ts";
import { renderEvolution } from "../src/render/evolution.ts";
import { formatTypes } from "../src/render/types.ts";
import { zh } from "../src/i18n/zh.ts";
import type { PokemonStat, EvolutionStep } from "../src/api/types.ts";

describe("renderStats", () => {
  const stats: PokemonStat[] = [
    { base_stat: 35, stat: { name: "hp", url: "" } },
    { base_stat: 55, stat: { name: "attack", url: "" } },
    { base_stat: 40, stat: { name: "defense", url: "" } },
    { base_stat: 50, stat: { name: "special-attack", url: "" } },
    { base_stat: 50, stat: { name: "special-defense", url: "" } },
    { base_stat: 90, stat: { name: "speed", url: "" } },
  ];

  test("renders 6 stat lines + total", () => {
    const output = renderStats(stats, zh as any);
    const lines = output.split("\n");
    expect(lines.length).toBe(7); // 6 stats + total
  });

  test("contains stat values", () => {
    const output = renderStats(stats, zh as any);
    expect(output).toContain("35");
    expect(output).toContain("90");
    expect(output).toContain("320"); // total
  });
});

describe("renderEvolution", () => {
  test("linear chain", () => {
    const steps: EvolutionStep[] = [
      {
        from: "pichu",
        to: "pikachu",
        details: [{
          trigger: { name: "level-up" },
          min_happiness: 220,
          min_level: null, min_beauty: null, min_affection: null,
          item: null, held_item: null, known_move: null,
          known_move_type: null, time_of_day: "",
          location: null, needs_overworld_rain: false,
          party_species: null, party_type: null,
          trade_species: null, turn_upside_down: false,
          gender: null,
        }],
      },
      {
        from: "pikachu",
        to: "raichu",
        details: [{
          trigger: { name: "use-item" },
          item: { name: "thunder-stone" },
          min_level: null, min_happiness: null, min_beauty: null,
          min_affection: null, held_item: null, known_move: null,
          known_move_type: null, time_of_day: "",
          location: null, needs_overworld_rain: false,
          party_species: null, party_type: null,
          trade_species: null, turn_upside_down: false,
          gender: null,
        }],
      },
    ];

    const output = renderEvolution(
      { steps, nameResolver: (s) => s },
      "zh",
    );
    expect(output).toContain("pichu");
    expect(output).toContain("pikachu");
    expect(output).toContain("raichu");
    expect(output).toContain("好感度");
    expect(output).toContain("雷之石");
  });
});

describe("formatTypes", () => {
  test("single type zh", () => {
    expect(formatTypes(["electric"], "zh")).toContain("电");
    expect(formatTypes(["electric"], "zh")).toContain("⚡");
  });

  test("dual type zh", () => {
    const result = formatTypes(["fire", "flying"], "zh");
    expect(result).toContain("火");
    expect(result).toContain("飞行");
    expect(result).toContain("/");
  });
});
