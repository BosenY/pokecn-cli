## ADDED Requirements

### Requirement: CLI entry point with citty

系统 SHALL 提供 `pokecn` 命令作为入口，基于 citty 框架，支持子命令和全局选项。

#### Scenario: Show help when no arguments

- **WHEN** 用户执行 `pokecn`（无参数）
- **THEN** 显示帮助信息，包含工具名称、版本、描述和可用子命令列表

#### Scenario: Show version

- **WHEN** 用户执行 `pokecn --version`
- **THEN** 输出当前版本号（如 `0.1.0`）

### Requirement: get subcommand

系统 SHALL 提供 `pokecn get <name>` 子命令，作为 MVP 的核心命令。

#### Scenario: Basic get with positional argument

- **WHEN** 用户执行 `pokecn get pikachu`
- **THEN** 系统查询皮卡丘数据并展示完整信息卡片（图片 + 基础信息 + 数值 + 特性 + 进化链 + 图鉴描述）

#### Scenario: get with options

- **WHEN** 用户执行 `pokecn get pikachu --lang en --shiny --no-image`
- **THEN** 系统按照指定选项展示：英文模式、闪光版图片、或禁用图片

### Requirement: Subcommand lazy loading

子命令 SHALL 使用 lazy import（`() => import("./commands/get")`），仅在执行时加载，减少冷启动时间。

#### Scenario: Cold start performance

- **WHEN** 用户执行 `pokecn --version`
- **THEN** 不加载 get 命令的代码，响应时间 < 100ms

### Requirement: Graceful error handling

系统 SHALL 对用户输入错误和网络错误给出友好的中文提示。

#### Scenario: Unknown pokemon name

- **WHEN** 用户执行 `pokecn get 不存在的名字`
- **THEN** 输出 `找不到宝可梦：不存在的名字`，退出码为 1

#### Scenario: Network error

- **WHEN** PokeAPI 请求失败（网络不可达或超时）
- **THEN** 输出 `网络请求失败，请检查网络连接` 并提示是否有本地缓存可用
