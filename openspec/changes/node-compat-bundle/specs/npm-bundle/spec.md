## ADDED Requirements

### Requirement: Node.js 兼容 bundle 构建
构建系统 SHALL 将 TypeScript 源码打包为单文件 `dist/cli.js`，该文件 SHALL 在 Node.js >= 18 环境下无需 Bun 即可运行。

#### Scenario: 构建成功
- **WHEN** 执行 `bun run build:npm`
- **THEN** 生成 `dist/cli.js`，文件头部包含 `#!/usr/bin/env node`，且文件具有可执行权限

#### Scenario: Node.js 直接运行
- **WHEN** 用户在安装了 Node.js（>=18）但未安装 Bun 的环境中执行 `node dist/cli.js get pikachu`
- **THEN** 命令正常执行，输出皮卡丘信息，无任何报错

### Requirement: npm 包发布产物为 bundle
npm 发布的包 SHALL 只包含 `dist/cli.js` 和 `README.md`，不包含 TypeScript 源码。

#### Scenario: npm 安装后可用
- **WHEN** 用户执行 `npm install -g pokecn` 后运行 `pokecn get pikachu`
- **THEN** 命令正常执行，无需安装 Bun 或其他运行时

#### Scenario: 发布内容验证
- **WHEN** 执行 `npm pack --dry-run`
- **THEN** 文件列表中包含 `dist/cli.js`，不包含 `src/` 目录下的任何文件
