#!/usr/bin/env bun

import { defineCommand, runMain } from "citty";
import { version } from "../package.json";

const main = defineCommand({
  meta: {
    name: "pokecn",
    version,
    description: "宝可梦终端百科全书 · Pokémon Terminal Encyclopedia",
  },
  subCommands: {
    get: () => import("./commands/get").then((m) => m.default),
    search: () => import("./commands/search").then((m) => m.default),
  },
});

runMain(main);
