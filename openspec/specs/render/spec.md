## ADDED Requirements

### Requirement: Info card layout

系统 SHALL 使用 Unicode box drawing 字符（┌─┐│└─┘├┤）构建卡片式布局，展示宝可梦完整信息。

#### Scenario: Full info card

- **WHEN** 查询皮卡丘（lang=zh）
- **THEN** 输出包含以下区域的卡片：头部（图片 + 编号 + 中英文名 + 属种名 + 属性 + 世代）、基础信息（身高/体重/捕获率/友好度/性别比/蛋组）、数值条形图、特性、进化链、图鉴描述

### Requirement: Stats bar chart

系统 SHALL 将六项基础数值（HP/攻击/防御/特攻/特防/速度）渲染为水平条形图，使用 █ 和 ░ 字符表示，带颜色区分。

#### Scenario: Render stats

- **WHEN** 皮卡丘 stats 为 HP=35, ATK=55, DEF=40, SPA=50, SPD=50, SPE=90
- **THEN** 渲染 6 行条形图，每行格式为 `标签  ████████░░░░░░░  数值`，并显示总计值 320

#### Scenario: Stats color coding

- **WHEN** 数值 < 50
- **THEN** 条形图使用红色
- **WHEN** 数值 50-99
- **THEN** 使用黄色
- **WHEN** 数值 >= 100
- **THEN** 使用绿色

### Requirement: Evolution chain rendering

系统 SHALL 将进化链渲染为可视化的链式展示，包含每步进化条件的中文描述。

#### Scenario: Linear chain

- **WHEN** 进化链为线性（皮丘 → 皮卡丘 → 雷丘）
- **THEN** 渲染为 `皮丘 ──[好感度]──▶ 皮卡丘 ──[雷之石]──▶ 雷丘`

#### Scenario: Branching chain

- **WHEN** 进化链有分支（伊布 → 8 条）
- **THEN** 渲染为树形结构，每条分支单独一行，显示进化条件

### Requirement: Type emoji mapping

系统 SHALL 将 18 种宝可梦属性映射为对应的 emoji + 中文/英文名称。

#### Scenario: Display type with emoji

- **WHEN** 属性为 "electric"，lang=zh
- **THEN** 显示为 "⚡ 电"

#### Scenario: Dual type display

- **WHEN** 宝可梦属性为 ["fire", "flying"]，lang=zh
- **THEN** 显示为 "🔥 火 / 🕊️ 飞行"

### Requirement: Evolution trigger localization

系统 SHALL 将进化触发条件翻译为中文/英文。包括：level-up（升级）、use-item（使用道具）、trade（通信交换）、shed（脱壳）等，以及具体道具/招式/亲密度的中文名。

#### Scenario: Item trigger in Chinese

- **WHEN** 进化条件为 `{"trigger": "use-item", "item": "thunder-stone"}`，lang=zh
- **THEN** 显示为 "雷之石"

#### Scenario: Happiness trigger

- **WHEN** 进化条件为 `{"trigger": "level-up", "min_happiness": 220}`，lang=zh
- **THEN** 显示为 "高好感度"
