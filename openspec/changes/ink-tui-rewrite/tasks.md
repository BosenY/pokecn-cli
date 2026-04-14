## 1. 依赖安装与项目配置

- [x] 1.1 安装 ink、react、ink-text-input、fuse.js：`bun add ink react ink-text-input fuse.js`
- [x] 1.2 安装类型声明：`bun add -d @types/react`
- [x] 1.3 确认 tsconfig.json 中 `jsx` 设为 `react-jsx`，`moduleResolution` 兼容 bundler 模式
- [x] 1.4 移除 `@clack/prompts` 依赖：`bun remove @clack/prompts`

## 2. 基础 UI 组件

- [x] 2.1 新建 `src/ui/components/TypeBadge.tsx`：属性徽章组件，接收 typeName + lang，渲染 emoji + 颜色文字
- [x] 2.2 新建 `src/ui/components/StatsBar.tsx`：单条种族值行，接收 label/value/barWidth，颜色按区间（<50红/50-99黄/≥100绿）
- [x] 2.3 新建 `src/ui/components/SpriteBox.tsx`：精灵图异步加载组件，加载中显示 dimColor 占位符，加载失败静默隐藏
- [x] 2.4 新建 `src/ui/components/EvolutionChain.tsx`：进化链组件，线性链单行 `A──[条件]──▶B`，分支链树状格式

## 3. 详情卡片组件

- [x] 3.1 新建 `src/ui/components/PokemonCard.tsx`：卡片容器，组合 SpriteBox + 基础信息左右 row 布局（flexDirection="row"）
- [x] 3.2 在 PokemonCard 中实现基础信息区块：编号/名称/属性/世代/传说标签/身高/体重/性别/捕捉率/亲密度/成长速度/孵化组
- [x] 3.3 在 PokemonCard 中实现种族值区块：遍历六项调用 StatsBar，末行显示 bold 总计
- [x] 3.4 在 PokemonCard 中实现特性区块：普通 `●`、隐藏 `◆ [隐藏特性]`，附带当前语言描述
- [x] 3.5 在 PokemonCard 中实现进化链区块：调用 EvolutionChain 组件，传入 nameResolver
- [x] 3.6 在 PokemonCard 中实现图鉴描述区块：显示最新版本的 flavor text

## 4. 详情应用视图

- [x] 4.1 新建 `src/ui/DetailApp.tsx`：接收 slug/lang/shiny/autoExit props，内部并发请求 pokemon + species 数据
- [x] 4.2 DetailApp 实现加载状态：数据请求中显示 `<Text>Loading...</Text>` 占位
- [x] 4.3 DetailApp 实现错误状态：404 显示"找不到宝可梦"，网络错误显示提示，均以 exit(1) 退出
- [x] 4.4 DetailApp 实现 `S` 键切换闪光形态（重新请求精灵图）
- [x] 4.5 DetailApp 实现 `Q`/`Esc` 退出，`B` 键回调（供 App.tsx 切换视图用）
- [x] 4.6 DetailApp 在 autoExit 模式下（pokecn get）卡片渲染完成后调用 `useApp().exit()`

## 5. 搜索应用视图

- [x] 5.1 新建 `src/ui/SearchApp.tsx`：加载 name-map.json，初始化 Fuse 实例
- [x] 5.2 SearchApp 实现搜索输入框：使用 ink-text-input，onChange 实时过滤列表
- [x] 5.3 SearchApp 实现 Fuse.js 过滤逻辑：空输入显示前 20 条（按 id 排序），有输入时走 Fuse 搜索，最多显示 20 条
- [x] 5.4 新建 `src/ui/components/PokemonList.tsx`：列表渲染，高亮选中行（cyan + bold），每行格式 `#0025 皮卡丘  Pikachu  ⚡ 电`
- [x] 5.5 SearchApp 实现 ↑/↓ 键盘导航，循环移动，边界回绕
- [x] 5.6 SearchApp 实现 Enter 键进入详情（调用 onSelect 回调）
- [x] 5.7 SearchApp 实现 Q/Esc 退出
- [x] 5.8 SearchApp 底部显示状态栏：`N 个结果  ↑↓ 移动  Enter 查看  Q 退出`

## 6. 顶层应用与视图路由

- [x] 6.1 新建 `src/ui/App.tsx`：持有 `mode: "search" | "detail"` 和 `selectedSlug` state
- [x] 6.2 App.tsx 根据 mode 渲染 SearchApp 或 DetailApp，SearchApp 的 onSelect 更新 mode+slug
- [x] 6.3 DetailApp 的 onBack 回调将 App mode 切回 "search"，保留搜索状态

## 7. 命令层接入

- [x] 7.1 修改 `src/commands/search.ts`：移除 @clack/prompts 代码，改为 `render(<App initialMode="search" lang={lang} />)` 并 `await waitUntilExit()`
- [x] 7.2 修改 `src/commands/get.ts`：移除字符串渲染代码，改为 `render(<DetailApp slug={slug} lang={lang} shiny={shiny} showImage={showImage} autoExit />)` 并 `await waitUntilExit()`

## 8. 清理旧代码

- [x] 8.1 删除 `src/render/layout.ts`
- [x] 8.2 删除 `src/render/stats.ts`
- [x] 8.3 删除 `src/render/evolution.ts`
- [x] 8.4 删除 `src/render/types.ts`
- [x] 8.5 确认 `src/render/image.ts` 保留（SpriteBox 依赖它）
- [x] 8.6 检查并清理 `package.json` 中残留的 `@clack/prompts`

## 9. 验证测试

- [x] 9.1 `bun run dev search` 验证搜索界面正常渲染，实时过滤生效
- [x] 9.2 `bun run dev search` 验证 ↑/↓ 导航、Enter 进入详情、B 返回搜索
- [x] 9.3 `bun run dev get 皮卡丘` 验证详情卡片渲染后自动退出
- [x] 9.4 `bun run dev get 皮卡丘 --shiny` 验证闪光精灵图显示
- [x] 9.5 `bun run dev get 不存在的宝可梦` 验证错误提示和 exit code 1
- [x] 9.6 `bun run dev search` 输入 `pikahu` 验证 Fuse.js 容错匹配
- [x] 9.7 调整终端宽度，验证卡片布局自适应
