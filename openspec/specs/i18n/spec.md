## ADDED Requirements

### Requirement: Pre-built Chinese name mapping

系统 SHALL 包含一份预构建的 JSON 映射表（`name-map.json`），包含所有宝可梦的中文名 → 英文 slug 映射。该文件在开发时通过脚本生成，随 npm 包和编译二进制一起分发。

#### Scenario: Lookup Chinese name

- **WHEN** 用户输入 "喷火龙"
- **THEN** 从映射表中查找到 slug "charizard"

#### Scenario: Chinese name not found

- **WHEN** 用户输入不存在于映射表的中文文本
- **THEN** 系统输出 "找不到宝可梦：{input}"

### Requirement: Build name map script

项目 SHALL 提供 `scripts/build-name-map.ts` 脚本，调用 PokeAPI 批量获取所有 pokemon-species 的 zh-hans 名称，生成 `src/i18n/name-map.json`。

#### Scenario: Generate name map

- **WHEN** 开发者执行 `bun scripts/build-name-map.ts`
- **THEN** 生成 JSON 文件，格式为 `{"皮卡丘": "pikachu", "喷火龙": "charizard", ...}`，覆盖 Gen 1-9 全部宝可梦

### Requirement: Bilingual UI text

系统 SHALL 支持中文（默认）和英文两种 UI 语言，通过 `--lang` 参数或配置文件切换。UI 文本包括：标签（"基础信息"/"Base Info"）、属性名（"攻击"/"Attack"）、错误提示等。

#### Scenario: Default Chinese UI

- **WHEN** 用户执行 `pokecn get pikachu`（未指定 lang）
- **THEN** 所有 UI 标签显示中文："基础数值"、"进化链"、"图鉴描述" 等

#### Scenario: English UI

- **WHEN** 用户执行 `pokecn get pikachu --lang en`
- **THEN** 所有 UI 标签显示英文："Base Stats"、"Evolution Chain"、"Pokédex Entry" 等

### Requirement: Bilingual pokemon data

系统 SHALL 从 PokeAPI 提取对应语言的数据：名称、属种名、图鉴描述、特性名称/描述、属性名称。中文数据使用 `zh-hans` locale。

#### Scenario: Chinese pokemon data

- **WHEN** lang=zh 查询皮卡丘
- **THEN** 显示中文名 "皮卡丘"、属种名 "鼠宝可梦"、中文图鉴描述、特性名 "静电" 等

#### Scenario: English pokemon data

- **WHEN** lang=en 查询皮卡丘
- **THEN** 显示英文名 "Pikachu"、genus "Mouse Pokémon"、英文图鉴描述、ability "Static" 等
