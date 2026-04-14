## 1. 项目初始化

- [x] 1.1 初始化 Bun 项目：`bun init`，配置 package.json（name=pokecn, bin 字段指向 src/cli.ts）
- [x] 1.2 配置 tsconfig.json（strict mode, target ESNext, module resolution bundler）
- [x] 1.3 安装核心依赖：citty, picocolors, terminal-image, @clack/prompts
- [x] 1.4 创建目录结构：src/{commands,api,i18n,render,cache,config}, scripts, tests

## 2. CLI 框架

- [x] 2.1 实现 src/cli.ts 入口文件：citty defineCommand + runMain，meta 信息（name/version/description）
- [x] 2.2 实现 get 子命令骨架（src/commands/get.ts）：positional arg `name`，options: `--lang`, `--shiny`, `--no-image`
- [x] 2.3 验证 `bun src/cli.ts --version` 和 `bun src/cli.ts --help` 正常输出

## 3. 缓存与配置基础设施

- [x] 3.1 实现 src/cache/index.ts：cachedFetch 函数（文件系统 JSON 缓存 + TTL 检查），自动创建 ~/.pokecn/cache/ 目录
- [x] 3.2 实现 src/config/index.ts：loadConfig 函数（读取 ~/.pokecn/config.json + 合并默认值），CLI flags 覆盖逻辑
- [x] 3.3 编写 cache 单元测试：验证 cache hit / cache miss / cache expired 行为

## 4. PokeAPI 客户端

- [x] 4.1 定义 TypeScript 类型（src/api/types.ts）：Pokemon, PokemonSpecies, EvolutionChain 接口
- [x] 4.2 实现 src/api/pokemon.ts：getPokemon(slug) 封装，使用 cachedFetch
- [x] 4.3 实现 src/api/species.ts：getSpecies(slug) 封装，提取多语言名称/描述/属种名
- [x] 4.4 实现 src/api/evolution.ts：getEvolutionChain(url) 封装，解析递归进化树为扁平结构
- [x] 4.5 编写 API 客户端测试：mock fetch 验证数据提取逻辑

## 5. 中英双语（i18n）

- [x] 5.1 编写 scripts/build-name-map.ts：批量请求 PokeAPI 生成中文名 → 英文 slug 映射 JSON
- [x] 5.2 执行脚本生成 src/i18n/name-map.json（覆盖 Gen 1-9）
- [x] 5.3 实现 src/i18n/name-lookup.ts：resolveNameToSlug 函数（中文名/英文名/编号 → slug）
- [x] 5.4 实现 src/i18n/zh.ts 和 src/i18n/en.ts：UI 文本常量（标签、错误提示、属性名等）
- [x] 5.5 编写 name-lookup 测试：验证中文输入、英文输入、数字输入、无效输入

## 6. 终端图片渲染

- [x] 6.1 实现 src/render/image.ts：使用 terminal-image 渲染精灵图片，支持 --shiny 和 --no-image
- [x] 6.2 实现精灵图片下载逻辑：按优先级降级链下载（official-artwork → home → default），缓存到 ~/.pokecn/sprites/
- [x] 6.3 验证 terminal-image 在 iTerm2 / 普通终端下的渲染效果
- [x] 6.4 验证 `bun build --compile` 后 terminal-image 是否正常工作

## 7. 终端 UI 渲染

- [x] 7.1 实现 src/render/types.ts：18 种属性 emoji 映射表（中英双语）
- [x] 7.2 实现 src/render/stats.ts：六维数值条形图渲染（█░ + 颜色分级）
- [x] 7.3 实现 src/render/evolution.ts：进化链渲染（线性 + 分支），进化条件中文翻译
- [x] 7.4 实现 src/render/layout.ts：完整信息卡片布局（box drawing 边框 + 各区块组装）
- [x] 7.5 编写 render 测试：验证 stats 条形图输出、evolution chain 格式

## 8. get 命令集成

- [x] 8.1 在 src/commands/get.ts 中串联完整流程：输入解析 → 并发请求 → 渲染输出
- [x] 8.2 实现错误处理：找不到宝可梦、网络错误、缓存降级的友好提示
- [x] 8.3 端到端测试：`bun src/cli.ts get 皮卡丘` / `get pikachu` / `get 25` 全流程验证

## 9. 构建与发布准备

- [x] 9.1 编写 scripts/build.ts：多平台交叉编译脚本（darwin-arm64, darwin-x64, linux-x64, linux-arm64）
- [x] 9.2 验证 `bun build --compile` 产物可独立运行
- [x] 9.3 配置 package.json 的 bin 字段，确保 `bunx pokecn` 和 `bun add -g pokecn` 可用
- [x] 9.4 编写 README.md：安装方式、使用示例、截图
