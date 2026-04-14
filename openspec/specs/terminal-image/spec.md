## ADDED Requirements

### Requirement: Auto-detect terminal image protocol

系统 SHALL 自动检测当前终端支持的图片协议，按以下优先级选择渲染方式：
1. iTerm2 Inline Images（iTerm2、WezTerm、Hyper）
2. Kitty Graphics Protocol（Kitty、Ghostty、Konsole）
3. ANSI 块字符降级（所有支持真彩色的终端）

#### Scenario: iTerm2 terminal

- **WHEN** 环境变量 TERM_PROGRAM=iTerm.app
- **THEN** 使用 iTerm2 inline image 协议渲染 PNG 原图

#### Scenario: Unsupported terminal

- **WHEN** 终端不支持任何图片协议
- **THEN** 使用 Unicode 半块字符（▀▄）+ 24-bit ANSI 色渲染低分辨率图像

### Requirement: Sprite download with fallback chain

系统 SHALL 按以下优先级下载精灵图片，每级失败自动降级：
1. `official-artwork/{id}.png`（475×475）
2. `other/home/{id}.png`（512×512）
3. `{id}.png`（96×96）

Base URL: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/`

#### Scenario: Download official artwork

- **WHEN** 查询 id=25 的精灵图片
- **THEN** 首先尝试下载 `official-artwork/25.png`，成功后缓存到 `~/.pokecn/sprites/normal/25.png`

#### Scenario: Fallback on 404

- **WHEN** official-artwork 返回 404
- **THEN** 自动尝试 `other/home/{id}.png`，再失败尝试 `{id}.png`

### Requirement: Shiny sprite support

系统 SHALL 在 `--shiny` 参数时下载异色版精灵图片。

#### Scenario: Shiny sprite download

- **WHEN** 用户执行 `pokecn get pikachu --shiny`
- **THEN** 下载 `official-artwork/shiny/25.png` 并缓存到 `~/.pokecn/sprites/shiny/25.png`

### Requirement: No-image mode

系统 SHALL 支持 `--no-image` 参数，完全跳过图片渲染，只展示文字信息。

#### Scenario: Disable image rendering

- **WHEN** 用户执行 `pokecn get pikachu --no-image`
- **THEN** 不下载精灵图片，不渲染图像，只展示文字信息卡片
