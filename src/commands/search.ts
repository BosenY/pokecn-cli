import { defineCommand } from "citty";
import React from "react";
import { render } from "ink";
import { loadConfig, applyFlags } from "../config/index.ts";
import { App } from "../ui/App.tsx";

export default defineCommand({
  meta: {
    name: "search",
    description: "搜索并选择宝可梦",
  },
  args: {
    keyword: {
      type: "positional",
      required: false,
      description: "搜索关键词（可选）",
    },
    lang: {
      type: "string",
      description: "语言：zh | en",
    },
    shiny: {
      type: "boolean",
      default: false,
      description: "显示闪光版精灵",
    },
  },
  async run({ args }) {
    const config = await loadConfig();
    const effectiveConfig = applyFlags(config, { lang: args.lang });
    const lang = effectiveConfig.language;
    const showImage = effectiveConfig.display.showImage;

    const { waitUntilExit } = render(
      React.createElement(App, {
        initialMode: "search",
        lang,
        showImage,
        shiny: args.shiny,
      }),
    );

    await waitUntilExit();
  },
});
