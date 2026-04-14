## ADDED Requirements

### Requirement: 实时模糊搜索列表
系统 SHALL 提供一个基于 ink 的交互式搜索界面，用户输入任意字符时列表实时更新，无需按 Enter 提交。搜索支持中文名、英文名、编号三个字段，使用 Fuse.js 进行容错模糊匹配（threshold: 0.4）。

#### Scenario: 实时过滤
- **WHEN** 用户在搜索框中输入字符
- **THEN** 宝可梦列表立即更新，显示所有匹配结果（最多 20 条），无需按 Enter

#### Scenario: 容错匹配
- **WHEN** 用户输入含 typo 的英文，如 `pikahu`
- **THEN** 列表仍显示 `皮卡丘 / Pikachu`，Fuse.js 模糊匹配兜底

#### Scenario: 中文搜索
- **WHEN** 用户输入中文关键词，如 `皮卡`
- **THEN** 列表显示所有中文名包含 `皮卡` 的宝可梦

#### Scenario: 编号搜索
- **WHEN** 用户输入纯数字，如 `25`
- **THEN** 列表优先精确匹配编号 `#0025 皮卡丘`

#### Scenario: 无结果
- **WHEN** 搜索词无任何匹配
- **THEN** 列表显示"没有找到匹配的宝可梦"提示，搜索框保持可用

#### Scenario: 空输入
- **WHEN** 搜索框为空
- **THEN** 显示前 20 条宝可梦（按编号排序）

### Requirement: 键盘导航
系统 SHALL 支持通过键盘在搜索列表中导航和操作，不依赖鼠标。

#### Scenario: 上下移动
- **WHEN** 用户按 ↑ / ↓ 方向键
- **THEN** 高亮选中行在列表中上下移动，循环到边界

#### Scenario: 查看详情
- **WHEN** 用户在选中行按 Enter
- **THEN** 界面切换到所选宝可梦的详情视图，搜索状态保留

#### Scenario: 退出
- **WHEN** 用户按 Esc 或 Q
- **THEN** 程序退出，exit code 0

### Requirement: 搜索结果展示格式
列表每行 SHALL 展示宝可梦的编号、中文名、英文名和属性徽章，高亮行用不同背景色或前景色标记。

#### Scenario: 列表行格式
- **WHEN** 搜索结果列表渲染
- **THEN** 每行格式为 `#0025 皮卡丘  Pikachu  ⚡ 电`，编号右对齐4位

#### Scenario: 选中行高亮
- **WHEN** 某行被选中
- **THEN** 该行以高亮颜色（cyan/bold）显示，与未选中行视觉区分明显
