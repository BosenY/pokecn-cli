## Why

pokecn 目前发布到 npm 的是 TypeScript 源码，用户必须安装 Bun 才能运行，大幅限制了受众。通过将项目打包为 Node.js 兼容的单文件 bundle 发布，任何安装了 Node.js（>=18）的用户都可以直接 `npm install -g pokecn` 使用。

## What Changes

- 将 `src/cache/index.ts`、`src/config/index.ts`、`src/render/image.ts` 中的 `Bun.file` / `Bun.write` 等 Bun 专属 API 替换为标准 `node:fs/promises`
- 新增 `scripts/build-npm.ts` 构建脚本，使用 `bun build --target=node` 打包为单文件 `dist/cli.js`
- `dist/cli.js` 头部注入 `#!/usr/bin/env node` shebang
- `package.json` 的 `bin` 改为指向 `dist/cli.js`，`files` 改为包含 `dist/`
- `.github/workflows/release.yml` 发布 npm 前先执行 `bun run build:npm`

## Capabilities

### New Capabilities

- `npm-bundle`: 将 TypeScript 源码打包为 Node.js 可执行的单文件 dist/cli.js，作为 npm 发布产物

### Modified Capabilities

- `cache`: `Bun.file`/`Bun.write` 替换为 `node:fs/promises`，行为不变
- `config`: 同上
- `render`: 同上

## Impact

- `src/cache/index.ts`：替换 Bun 文件 API
- `src/config/index.ts`：替换 Bun 文件 API
- `src/render/image.ts`：替换 Bun 文件 API
- `scripts/build-npm.ts`：新增
- `package.json`：bin、files 字段变更
- `.github/workflows/release.yml`：发布前增加构建步骤
- 不影响二进制分发（GitHub Releases）流程
- 不引入新的 npm 依赖
