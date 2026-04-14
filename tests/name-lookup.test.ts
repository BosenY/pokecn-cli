import { describe, test, expect } from "bun:test";
import { resolveNameToSlug } from "../src/i18n/name-lookup.ts";

describe("resolveNameToSlug", () => {
  test("English name → lowercase slug", async () => {
    expect(await resolveNameToSlug("Pikachu")).toBe("pikachu");
    expect(await resolveNameToSlug("CHARIZARD")).toBe("charizard");
  });

  test("numeric ID → resolves to slug or passes through", async () => {
    // 如果 idMap 有映射，返回 slug；否则返回原数字
    const result25 = await resolveNameToSlug("25");
    expect(typeof result25).toBe("string");
    expect(result25.length).toBeGreaterThan(0);
    // 25 = pikachu (if name-map loaded)
  });

  test("trims whitespace", async () => {
    expect(await resolveNameToSlug("  pikachu  ")).toBe("pikachu");
  });

  test("Chinese name → throws if name-map not loaded", async () => {
    // name-map.json 可能尚未生成，此时应报错
    // 如果已生成则正常查找
    try {
      const result = await resolveNameToSlug("皮卡丘");
      // 如果 name-map.json 已存在，应返回 pikachu
      expect(result).toBe("pikachu");
    } catch (e: any) {
      // 如果 name-map.json 不存在，映射表为空，应抛错
      expect(e.message).toContain("找不到宝可梦");
    }
  });

  test("unknown Chinese name → throws error", async () => {
    expect(resolveNameToSlug("不存在的名字")).rejects.toThrow("找不到宝可梦");
  });
});
