## Context

当前 pokecn-cli 使用 `@clack/prompts` 做交互提示，`picocolors` 拼接字符串做输出渲染。两套工具分别处理"交互"和"展示"，代码耦合在命令文件内，难以组件化复用。

ink 是 Shopify 开源的 React 终端渲染框架，用 Flexbox 布局模型替代手动字符串拼接，用 React 状态管理替代命令式流程控制，天然支持实时键盘响应。

## Goals / Non-Goals

**Goals:**
- 用 ink 完全替换 `@clack/prompts` + `src/render/` 的字符串拼接方案
- 实现实时模糊搜索（按键即更新列表，无需提交）
- 搜索 → 详情 → 返回搜索的无缝单进程视图切换
- 宝可梦详情卡片组件化、跟随终端宽度自适应
- `pokecn get` 和 `pokecn search` 共用同一套 ink 组件

**Non-Goals:**
- 不做多面板 / 分屏布局
- 不做滚动（卡片整体足够大即可）
- 不改变 API 层、缓存层、i18n 层
- 不新增宝可梦数据字段

## Decisions

### D1：单进程视图切换 vs 多次 render()

**选择**：单进程，用顶层 `<App>` 的 `mode` state 切换 `<SearchApp>` / `<DetailApp>`。

**理由**：搜索状态（输入词、滚动位置）可以在返回时保留；避免 unmount/remount 的闪烁；ink 的 `render()` 设计支持这种模式。

**备选**：每次切换 `unmount()` 再 `render()` ——简单但无法保留搜索状态，用户体验差。

---

### D2：Fuse.js 配置

```ts
new Fuse(allNames, {
  keys: [
    { name: 'zh', weight: 0.5 },
    { name: 'en', weight: 0.4 },
    { name: 'id', weight: 0.1 },
  ],
  threshold: 0.4,
  minMatchCharLength: 1,
  includeScore: true,
})
```

- `threshold: 0.4` — 容错适中，`pikahu` 能匹配 `pikachu`，但不会出现大量噪声
- id 字段权重低，精确编号匹配仍优先通过 `id === query` 短路处理
- 输入为空时不走 Fuse，直接展示前 N 条（按 id 排序）

---

### D3：`pokecn get` 的 ink 集成方式

**选择**：`render(<DetailApp pokemon={...} />)`，组件内数据加载完成后 `useApp().exit()` 自动退出。

**理由**：复用 `<DetailApp>` 组件；加载中状态可用 ink `<Spinner>` 展示；exit code 正常传递。

**备选**：保持 console.log 字符串输出——代码重复，与 search 模式的详情渲染不一致。

---

### D4：精灵图渲染在 ink 中的处理

`terminal-image` 输出的是带 ANSI 转义码的多行字符串。ink 的 `<Text>` 组件可以直接渲染 ANSI 字符串，但需要用 `<Static>` 或直接包在 `<Box>` 里。

**选择**：用 `<Text>{spriteAnsi}</Text>` 包裹，放在左侧 `<Box width="30%">` 中，与右侧基础信息 `flexDirection="row"` 并排。精灵图异步加载，加载中显示占位符 `<Text dimColor>Loading...</Text>`。

---

### D5：组件文件结构

```
src/ui/
├── App.tsx                  ← 顶层，持有 mode + selectedPokemon state
├── SearchApp.tsx            ← 搜索列表界面
├── DetailApp.tsx            ← 详情界面（get 命令直接用）
└── components/
    ├── PokemonList.tsx      ← 虚拟列表，高亮选中行
    ├── PokemonCard.tsx      ← 卡片容器，组合以下组件
    ├── StatsBar.tsx         ← 单条种族值行
    ├── TypeBadge.tsx        ← 属性徽章
    ├── EvolutionChain.tsx   ← 进化链
    └── SpriteBox.tsx        ← 精灵图异步加载
```

`App.tsx` 负责状态路由，两个命令的入口分别是：
- `pokecn search` → `render(<App initialMode="search" />)`
- `pokecn get` → `render(<DetailApp slug={slug} autoExit />)`

## Risks / Trade-offs

**ink 与 Bun 的兼容性** → ink 依赖 React，Bun 支持 JSX/TSX 且对 React 无特殊限制，已有社区验证可用。风险低。

**terminal-image ANSI 字符串在 ink Box 布局中的宽度计算** → ink 用 yoga-layout 计算宽度，ANSI 转义码可能导致宽度算错，导致布局错位。缓解方案：精灵图放在固定宽度的 `<Box>` 中，用 `overflow="hidden"` 兜底。

**Fuse.js 首次搜索延迟** → 1025 条数据量极小，Fuse 索引构建 < 5ms，不影响体验。

**ink 不支持原生滚动** → 详情卡片内容较多时超出终端高度。决策：接受此限制，卡片设计控制在 40-50 行内；用户可在终端手动滚动历史（ink Static 输出会留在终端历史中）。

## Migration Plan

1. 安装新依赖：`bun add ink react ink-text-input fuse.js` + `bun add -d @types/react`
2. 新建 `src/ui/` 目录，逐个实现组件
3. 修改 `src/commands/get.ts` 和 `src/commands/search.ts` 切换到 ink render
4. 删除 `src/render/layout.ts`, `stats.ts`, `evolution.ts`, `types.ts`（保留 `image.ts`）
5. 移除 `@clack/prompts` 依赖

**回滚**：git revert 即可，无数据库 migration，无外部服务变更。

## Open Questions

- 无，所有决策已在 explore 阶段确认。
