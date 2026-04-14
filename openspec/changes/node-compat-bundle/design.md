## Context

当前 `package.json` 的 `bin` 指向 `./src/cli.ts`，shebang 为 `#!/usr/bin/env bun`，要求用户本地安装 Bun。实测 `bun build --target=node` 可以将 878 个模块打包成单文件（3.6MB），ink + react 在 Node.js 下运行正常，唯一障碍是 `Bun.file`/`Bun.write` 等 Bun 专属 API 在 Node.js 下报错 `ReferenceError: Bun is not defined`。

## Goals / Non-Goals

**Goals:**
- npm 安装后用户可直接用 `node` 运行，无需 Bun
- 保持 Bun 开发体验不变（`bun src/cli.ts` 仍可用）
- dist/cli.js 作为 npm 包的唯一发布产物
- GitHub Actions 发布 npm 前自动构建

**Non-Goals:**
- 不支持 Node.js 18 以下版本
- 不将二进制分发（GitHub Releases）改为基于 Node.js
- 不引入 esbuild、rollup 等额外打包工具

## Decisions

### 1. 用 `bun build --target=node` 打包，不用 tsc

tsc 只做类型擦除，不 bundle 依赖，用户安装后还需要 node_modules。
`bun build --target=node` 将所有依赖内联为单文件，用户 `npm install -g pokecn` 后直接可用，无需额外 node_modules。

### 2. Bun API 替换为 `node:fs/promises`，不做运行时 polyfill

方案对比：
- **运行时 polyfill**（`if (typeof Bun !== 'undefined')`）：代码分叉，维护成本高
- **直接替换为 node:fs**：Bun 完全兼容 Node.js API，替换后两端都能跑，代码更干净

选择直接替换。影响 3 个文件，约 15 行代码。

### 3. shebang 注入方式

`bun build` 不自动注入 shebang。通过构建脚本在输出文件头部 prepend `#!/usr/bin/env node\n`，再用 `chmod +x` 设置可执行权限。

### 4. 构建脚本放在 `scripts/build-npm.ts`

与现有 `scripts/build.ts`（二进制构建）分开，职责清晰。`package.json` 新增 `"build:npm"` script。

## Risks / Trade-offs

- **bundle 体积 3.6MB**：对 CLI 工具偏大，但可接受。用户只需安装一次，不影响启动速度。→ 可后续用 `--minify` 压缩
- **ink 的 Node.js 兼容性**：已本地验证通过，替换 Bun API 后即可正常运行
- **node_modules 不再随 npm 包安装**：所有依赖已内联进 bundle，如果某个依赖有 native addon 则无法 bundle（当前依赖均为纯 JS，无此风险）

## Migration Plan

1. 替换 Bun API → 本地用 `node dist/cli.js` 验证
2. 更新 `package.json` 的 bin/files
3. 更新 GitHub Actions workflow
4. 删旧 tag，重新打 tag 触发发布

回滚：将 `bin` 改回 `./src/cli.ts` 并重新发布即可。
