import { defineCommand } from "citty";
import React from "react";
import { render } from "ink";
import { resolveNameToSlug } from "../i18n/name-lookup.ts";
import { loadConfig, applyFlags } from "../config/index.ts";
import { DetailApp } from "../ui/DetailApp.tsx";

export default defineCommand({
  meta: {
    name: "get",
    description: "查询宝可梦详细信息",
  },
  args: {
    name: {
      type: "positional",
      required: true,
      description: "宝可梦名称或编号（支持中文）",
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
    "no-image": {
      type: "boolean",
      default: false,
      alias: "T",
      description: "不显示精灵图片",
    },
  },
  async run({ args }) {
    const config = await loadConfig();
    // citty boolean flags: check raw process.argv as workaround
    const rawArgv = process.argv;
    const noImage = rawArgv.includes("--no-image") || rawArgv.includes("-T");
    const effectiveConfig = applyFlags(config, {
      lang: args.lang,
      "no-image": noImage,
    });
    const lang = effectiveConfig.language;
    const showImage = effectiveConfig.display.showImage;

    let slug: string;
    try {
      slug = await resolveNameToSlug(args.name);
    } catch (err: any) {
      console.error(err.message);
      process.exit(1);
    }

    const { waitUntilExit } = render(
      React.createElement(DetailApp, {
        slug,
        lang,
        shiny: args.shiny,
        showImage,
        autoExit: true,
      }),
      { exitOnCtrlC: true },
    );

    try {
      await waitUntilExit();
    } catch {
      process.exit(1);
    }
  },
});
