## Why

当前 CLI 使用 `@clack/prompts` + `picocolors` 拼接字符串输出，交互模式是"提交后处理"，无法实现实时响应的按键操作。用户体验欠佳：搜索需要先输入再提交才能看到结果，宝可梦详情卡片是纯字符串拼接，难以维护和扩展。引入 ink（React 终端渲染）可以实现实时模糊搜索、键盘导航、组件化卡片布局，大幅提升交互体验和代码可维护性。

## What Changes

- **BREAKING** 移除 `src/render/` 目录，改为 `src/ui/` 组件体系
- **BREAKING** 移除 `@clack/prompts` 依赖，改为 `ink` + `ink-text-input`
- 新增实时模糊搜索界面：输入即过滤，上下键导航，Enter 查看详情
- 新增 Fuse.js 模糊匹配（支持中/英文 typo 容错，如 `pikahu` → `pikachu`）
- 新增搜索 → 详情 → 返回搜索的无缝视图切换（同进程 React state 管理）
- `pokecn get` 命令改为用 ink 渲染详情卡片（`useApp().exit()` 自动退出）
- `pokecn search` 改为完整 ink 交互式搜索应用
- 宝可梦详情卡片重新设计：精灵图 + 基础信息左右并排，种族值进度条更宽，整体跟随终端宽度自适应
- 新增 `[S]` 切换闪光形态快捷键（在详情页）

## Capabilities

### New Capabilities

- `tui-search`: 基于 ink 的实时模糊搜索列表界面，支持键盘导航和 Fuse.js 容错匹配
- `tui-detail`: 基于 ink 的宝可梦详情卡片组件，支持精灵图并排布局、全宽种族值条、特性/进化链/图鉴描述

### Modified Capabilities

- `cli-framework`: 命令 run() 函数改为调用 `render()` 而非 `console.log()`，交互入口变更
- `render`: 完全替换为 ink 组件体系，旧的字符串拼接 API 废弃

## Impact

**依赖变化**
- 新增：`ink`, `react`, `@types/react`, `ink-text-input`, `fuse.js`
- 移除：`@clack/prompts`
- 保留：`picocolors`（部分 ANSI 兼容场景）、`terminal-image`、`citty`

**代码影响**
- 删除：`src/render/layout.ts`, `src/render/stats.ts`, `src/render/evolution.ts`, `src/render/types.ts`
- 保留：`src/render/image.ts`（sprite 下载逻辑复用）
- 修改：`src/commands/get.ts`, `src/commands/search.ts`
- 新建：`src/ui/` 目录下全部组件文件

**用户可见变化**
- `pokecn search` 变为实时交互界面，不再是两步式提示
- `pokecn get` 输出格式更丰富，布局自适应终端宽度
- 新增键盘快捷键：`B` 返回搜索，`S` 切换闪光，`Q` 退出
