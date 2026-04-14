## Context

这是一个全新的 CLI 项目（pokecn），从零构建。无现有代码，无迁移需求。

核心约束：
- **PokeAPI** 是唯一数据源，REST 只读，无需 API Key，但每次查询需要 2-3 个请求（pokemon + species + evolution-chain）
- **终端图片渲染**是核心体验，但不同终端协议支持差异大
- **中文名输入**需要一张 ~1000 条记录的映射表（中文名 → 英文 slug）
- **目标用户**：中文宝可梦爱好者 + 开发者，macOS/Linux 为主

## Goals / Non-Goals

**Goals:**
- 输入 `pokecn get 皮卡丘` 后 < 2 秒内展示完整信息（首次查询，含网络请求）
- 二次查询（命中缓存）< 200ms
- `bun build --compile` 产出的单文件二进制可直接运行，无需安装 Bun
- 终端图片在 iTerm2 / Kitty / WezTerm / Ghostty 下展示高清 PNG，其他终端降级为 ANSI 块字符

**Non-Goals:**
- 不做 TUI 交互界面（不用 bubbletea/ink 之类的框架）
- 不做 TCG 卡牌数据（poke-cli 的 TCG 功能）
- 不做离线数据库（不嵌入 SQLite，用文件缓存即可）
- 不做 Windows 首要支持（MVP 阶段）
- 不做动画 GIF 渲染（MVP 阶段只做静态 PNG）

## Decisions

### D1: CLI 框架选 citty 而非 commander/yargs

**选择：** citty (unjs)
**备选：** commander, yargs, clipanion

**理由：**
- 零依赖（commander 同样轻量，但 citty 有更好的 TypeScript 类型推导）
- 原生支持子命令 lazy import（`() => import("./commands/get")`），加速冷启动
- unjs 生态出品，Nuxt CLI 在用，质量可信赖
- 未来扩展子命令（random/search/compare）只需新增文件

### D2: 图片渲染选 terminal-image v4.3

**选择：** terminal-image v4.3
**备选：** 自实现协议 + pngjs, chafa-wasm, 调用外部 chafa 命令

**理由：**
- v4.3 已移除 sharp，完全基于 jimp（纯 JS），无 native addon
- 内置 iTerm2 协议（通过 term-img）+ ANSI 块字符降级
- 内置 `supports-terminal-graphics` 检测终端能力
- bun build --compile 兼容性高（纯 JS 依赖链）
- 风险：jimp 子包多（27个），编译产物体积较大。如果验证后发现 compile 有问题，降级方案是自实现 Kitty/iTerm2 协议（~70行）+ pngjs

### D3: 中文名映射用预构建静态 JSON

**选择：** 开发时生成 `name-map.json`，打包进产物
**备选：** 运行时首次构建（1000+ API 请求）、PokeAPI GraphQL 批量查询、惰性缓存

**理由：**
- 运行时构建需要 1000+ 请求，首次体验极差
- 静态 JSON 约 50KB（1000 条 {中文名: 英文slug}），可忽略
- 通过 `scripts/build-name-map.ts` 脚本生成，新世代发布时手动更新
- 支持中文名 → slug、编号 → slug 双向查找

### D4: 缓存策略 — API 缓存 TTL + 图片永久缓存

**选择：** 文件系统缓存，JSON 文件 + PNG 文件分离

```
~/.pokecn/
├── cache/              # API JSON 缓存（7天 TTL）
│   ├── pokemon_25.json
│   └── species_25.json
├── sprites/            # 精灵图片（永久缓存）
│   ├── normal/
│   │   └── 25.png
│   └── shiny/
│       └── 25.png
└── config.json         # 用户配置
```

**理由：**
- API 数据偶有更新（新世代、数据修正），7天 TTL 合理
- 精灵图片基本不变，永久缓存节省带宽
- 文件系统缓存比 SQLite 轻量，Bun.file() / Bun.write() 原生支持
- 按需下载：只缓存用户查过的宝可梦，不预下载全量

### D5: 精灵图片来源与降级链

**选择：** PokeAPI/sprites 仓库的 GitHub raw CDN 直链

```
优先级降级链：
1. official-artwork/{id}.png    (475×475, Gen 1-9 全量)
2. other/home/{id}.png          (512×512, 部分)
3. {id}.png                     (96×96, 最全)
```

**理由：**
- URL 规律极简：`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/{id}.png`
- 无需 API Key，GitHub CDN 全球可达
- 降级链确保即使某种图片缺失也能展示

### D6: 数据获取流程 — 并发请求 + 流式渲染

**选择：** 并发发起所有 API 请求，数据到达即渲染对应区块

```
用户输入 pokecn get 皮卡丘
    │
    ├── 解析输入 → 查映射表 → slug = "pikachu"
    │
    ├── Promise.all 并发：
    │   ├── GET /pokemon/pikachu        → 基础数据
    │   ├── GET /pokemon-species/pikachu → 中文名/描述/进化链URL
    │   └── 下载精灵图片                 → PNG buffer
    │
    ├── 拿到 species → 提取进化链 URL → GET /evolution-chain/{id}
    │
    └── 全部完成 → 组装渲染
```

**理由：**
- pokemon 和 species 无依赖关系，可并发
- evolution-chain 依赖 species 返回的 URL，需串行
- 精灵图片下载与 API 请求并发，不阻塞

### D7: 输出布局 — Box Drawing 卡片式

**选择：** 用 Unicode box drawing 字符 + picocolors 构建卡片式布局

```
┌─────────────────────────────────────────────────┐
│  [图片]    #025 皮卡丘 / Pikachu                │
│  [图片]    鼠宝可梦 · ⚡ 电                      │
├─────────────────────────────────────────────────┤
│  身高: 0.4m   体重: 6.0kg   捕获率: 190         │
├─────────────────────────────────────────────────┤
│  HP     ████████░░░░░░░░░  35                   │
│  攻击   ██████████████░░░  55                   │
│  ...                                            │
├─────────────────────────────────────────────────┤
│  皮丘 ──[好感度]──▶ 皮卡丘 ──[雷之石]──▶ 雷丘  │
└─────────────────────────────────────────────────┘
```

**理由：**
- 纯文本，任何终端都能正确显示
- 不依赖 TUI 框架，自己拼字符串即可，完全可控
- picocolors 负责着色，体积极小

## Risks / Trade-offs

| 风险 | 影响 | 缓解 |
|------|------|------|
| terminal-image jimp 在 bun compile 后不工作 | 图片无法渲染 | 降级方案：自实现 iTerm2/Kitty 协议 + pngjs，已验证可行 |
| PokeAPI 限流或不可用 | 查询失败 | 本地缓存兜底，展示已缓存数据 + 友好错误提示 |
| GitHub raw CDN 在中国大陆较慢 | 图片加载慢 | 首次稍慢可接受（< 1s），后续永久缓存；可考虑未来加镜像 |
| 新世代宝可梦发布后中文名映射表过期 | 新宝可梦无法中文输入 | build-name-map 脚本 + GitHub Actions 定期更新 |
| bun compile 产物体积大（~60-80MB） | 分发不便 | 可接受，Go 版 poke-cli 也有类似体积；npm 全局安装是更轻量的替代 |

## Open Questions

1. **精灵图片在终端中的默认尺寸**应该设为多大？太大挤占信息空间，太小看不清。需要实际测试确定（初步考虑 `width: "30%"`）。
2. **中文名映射表是否需要包含繁体中文（zh-Hant）？** MVP 先只做简体，后续可扩展。
3. **是否需要 `--no-image` 模式？** SSH 远程终端或无图片协议支持时可能需要。建议 MVP 就加上，成本很低。
