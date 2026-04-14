## ADDED Requirements

### Requirement: Fetch pokemon basic data

系统 SHALL 调用 PokeAPI `/api/v2/pokemon/{name}` 获取基础数据，提取以下字段：id、name、height、weight、base_experience、types、stats、abilities、sprites。

#### Scenario: Fetch pikachu basic data

- **WHEN** 查询 slug 为 "pikachu"
- **THEN** 返回结构化数据，包含 id=25、height=4（0.4m）、weight=60（6.0kg）、types=["electric"]、6 项 base stats

### Requirement: Fetch pokemon species data

系统 SHALL 调用 PokeAPI `/api/v2/pokemon-species/{name}` 获取种类数据，提取：names（多语言）、genera（属种名）、flavor_text_entries（图鉴描述）、evolution_chain URL、capture_rate、base_happiness、gender_rate、is_legendary、is_mythical、generation、growth_rate、egg_groups。

#### Scenario: Extract Chinese name from species

- **WHEN** 查询 species "pikachu"
- **THEN** 从 names 数组中提取 language.name === "zh-hans" 的 name 字段，得到 "皮卡丘"

#### Scenario: Extract flavor text

- **WHEN** 查询 species "pikachu"，语言为 zh
- **THEN** 从 flavor_text_entries 中提取最新版本的 zh-hans 图鉴描述文本

### Requirement: Fetch evolution chain

系统 SHALL 根据 species 返回的 evolution_chain URL 调用 `/api/v2/evolution-chain/{id}`，解析完整进化树。

#### Scenario: Linear evolution chain

- **WHEN** 查询皮卡丘的进化链
- **THEN** 返回 皮丘 → 皮卡丘 → 雷丘，每个进化步骤包含触发条件（level-up/use-item/trade 等）

#### Scenario: Branching evolution chain

- **WHEN** 查询伊布的进化链
- **THEN** 返回伊布 → 8 个分支进化，每个分支包含各自的进化条件

### Requirement: Concurrent API requests

系统 SHALL 并发请求 pokemon 和 species 端点（以及精灵图片下载），仅 evolution-chain 在获取到 species 后串行请求。

#### Scenario: Parallel fetch

- **WHEN** 执行 `pokecn get pikachu`
- **THEN** pokemon、species、sprite 下载三个请求并发发出，总耗时接近单个最慢请求的耗时而非三者之和

### Requirement: Input resolution

系统 SHALL 支持三种输入格式：中文名、英文名、图鉴编号。

#### Scenario: Chinese name input

- **WHEN** 输入为 "皮卡丘"（含中文字符）
- **THEN** 查预构建映射表，解析为 slug "pikachu"

#### Scenario: English name input

- **WHEN** 输入为 "pikachu"（纯英文）
- **THEN** 转小写后直接作为 slug 使用

#### Scenario: Numeric ID input

- **WHEN** 输入为 "25"（纯数字）
- **THEN** 直接作为 ID 使用查询 `/api/v2/pokemon/25`
