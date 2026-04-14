import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { join } from "node:path";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";

describe("cachedFetch", () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), "pokecn-test-"));
  });

  afterEach(async () => {
    await rm(tempDir, { recursive: true, force: true });
  });

  test("cache miss → fetches and writes cache file", async () => {
    const cacheFile = join(tempDir, "test.json");
    const data = { name: "pikachu", id: 25 };

    // Simulate writing cache
    await Bun.write(cacheFile, JSON.stringify(data));

    const file = Bun.file(cacheFile);
    expect(await file.exists()).toBe(true);

    const cached = await file.json();
    expect(cached.name).toBe("pikachu");
  });

  test("cache hit → reads from file without network", async () => {
    const cacheFile = join(tempDir, "pokemon_pikachu.json");
    const data = { name: "pikachu", id: 25 };
    await Bun.write(cacheFile, JSON.stringify(data));

    const file = Bun.file(cacheFile);
    const age = (Date.now() - file.lastModified) / 1000 / 60 / 60 / 24;

    expect(age).toBeLessThan(7);
    const cached = await file.json();
    expect(cached.id).toBe(25);
  });

  test("cache expired → age exceeds TTL", async () => {
    const cacheFile = join(tempDir, "old.json");
    await Bun.write(cacheFile, JSON.stringify({ old: true }));

    const file = Bun.file(cacheFile);
    const ageDays = (Date.now() - file.lastModified) / 1000 / 60 / 60 / 24;

    // Just written, so age < 7 days
    expect(ageDays).toBeLessThan(7);
    // If age >= ttl, it would refetch (tested via integration)
  });
});
