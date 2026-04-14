## Why

现有宝可梦终端工具（pokescript、pokemon-icat、poke-cli）均不支持中文，且缺乏完整的百科式信息展示（进化链、图鉴描述、多语言）。中文宝可梦社区缺少一个可以直接在终端查询宝可梦信息的工具。`pokecn` 要做**第一个中英双语的宝可梦终端百科**。

## What Changes

这是一个全新项目，从零构建 MVP（v0.1）：

- **核心命令 `pokecn get <name>`**：支持中文名 / 英文名 / 图鉴编号输入，展示精灵图片 + 基础信息 + 六维数值条形图 + 属性 + 特性 + 进化链 + 图鉴描述
- **中英双语**：默认中文，`--lang en` 切换英文，所有 UI 文本和数据均支持双语
- **终端精灵图片渲染**：自动检测终端协议（iTerm2 / Kitty → ANSI 块字符降级），展示高清官方美术图
- **中文名输入解析**：预构建中文名 → 英文 slug 静态映射表，打包进产物，零运行时开销
- **本地缓存系统**：PokeAPI JSON 响应缓存（7天 TTL）+ 精灵图片永久缓存，按需下载
- **配置系统**：`~/.pokecn/config.json`，支持语言、图片协议、显示偏好等配置

## Capabilities

### New Capabilities

- `cli-framework`: CLI 入口与命令体系（基于 citty），子命令 lazy 加载，参数解析
- `pokemon-query`: 宝可梦数据查询核心逻辑 — 调用 PokeAPI 获取基础信息、种类信息、进化链，中英双语数据提取
- `i18n`: 中英双语支持 — 中文名输入解析（预构建映射表）、UI 文本国际化、PokeAPI 多语言数据提取
- `terminal-image`: 终端图片渲染 — 协议自动检测与降级（iTerm2 → Kitty → ANSI 块字符），精灵图片下载与缓存
- `cache`: 本地缓存系统 — API JSON 缓存（TTL）+ 精灵图片永久缓存，基于 `~/.pokecn/cache/` 和 `~/.pokecn/sprites/`
- `render`: 终端 UI 渲染 — 六维数值条形图、进化链树形图、属性 emoji、信息卡片布局（box drawing）
- `config`: 用户配置系统 — `~/.pokecn/config.json` 读写，支持语言/图片协议/显示偏好

### Modified Capabilities

（无，全新项目）

## Impact

- **新增依赖**：`citty`（CLI 框架）、`terminal-image` v4.3（终端图片，纯 JS）、`picocolors`（颜色）、`@clack/prompts`（交互组件）
- **运行时**：Bun，使用 `bun build --compile` 生成多平台独立二进制
- **外部 API**：PokeAPI v2（REST，无需 API Key，只读）
- **文件系统**：写入 `~/.pokecn/`（缓存、配置、精灵图片）

## Tech Stack

| 组件 | 选型 | 理由 |
|------|------|------|
| 运行时 | Bun | 极速启动、原生 TS、`--compile` 单文件二进制 |
| 语言 | TypeScript | 类型安全 |
| CLI 框架 | citty (unjs) | 零依赖、类型安全、lazy 子命令加载 |
| 图片渲染 | terminal-image v4.3 | 纯 JS（jimp 替代 sharp）、自动协议检测、bun compile 兼容 |
| 颜色 | picocolors | 最轻量 |
| 交互 | @clack/prompts | 美观的终端交互组件 |
| HTTP | Bun 内置 fetch | 零依赖 |
| 测试 | bun test | 内置 Jest 兼容 |
| 构建 | bun build --compile | 多平台交叉编译 |

## MVP Scope (v0.1)

聚焦单一命令 `pokecn get <name>`，做到完整可用：

```
pokecn get 皮卡丘
pokecn get pikachu
pokecn get 25
pokecn get 皮卡丘 --lang en
pokecn get 皮卡丘 --shiny
```

**不在 MVP 范围内：** random / search / compare / evo / types / config 子命令，Homebrew 发布，文档网站。这些留给 v0.2+。

## Project Structure

```
pokecn/
├── src/
│   ├── cli.ts                 # 入口（citty 根命令）
│   ├── commands/
│   │   └── get.ts             # pokecn get <name>
│   ├── api/
│   │   ├── client.ts          # PokeAPI 封装 + 缓存
│   │   ├── pokemon.ts         # /pokemon 端点
│   │   ├── species.ts         # /pokemon-species 端点
│   │   ├── evolution.ts       # /evolution-chain 端点
│   │   └── types.ts           # TypeScript 类型定义
│   ├── i18n/
│   │   ├── name-map.json      # 预构建：中文名 → 英文 slug
│   │   ├── zh.ts              # 中文 UI 文本
│   │   └── en.ts              # 英文 UI 文本
│   ├── render/
│   │   ├── image.ts           # 图片渲染（terminal-image）
│   │   ├── stats.ts           # 六维数值条形图
│   │   ├── evolution.ts       # 进化树渲染
│   │   ├── types.ts           # 属性 emoji 映射
│   │   └── layout.ts          # 整体布局
│   ├── cache/
│   │   └── index.ts           # 缓存读写
│   └── config/
│       └── index.ts           # 配置读写
├── scripts/
│   ├── build-name-map.ts      # 生成中文名映射表
│   └── build.ts               # 多平台编译脚本
├── tests/
├── package.json
└── tsconfig.json
```
