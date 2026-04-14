#!/usr/bin/env bun

import { $ } from "bun";

const targets = [
  "bun-darwin-arm64",
  "bun-darwin-x64",
  "bun-linux-x64",
  "bun-linux-arm64",
];

console.log("开始构建多平台二进制...\n");

for (const target of targets) {
  const ext = target.includes("windows") ? ".exe" : "";
  const outfile = `bin/pokecn-${target}${ext}`;
  console.log(`构建 ${target}...`);
  try {
    await $`bun build --compile --target=${target} ./src/cli.ts --outfile ${outfile}`.quiet();
    console.log(`  完成: ${outfile}`);
  } catch (err: any) {
    console.error(`  失败: ${err.message}`);
  }
}

console.log("\n构建完成！");
