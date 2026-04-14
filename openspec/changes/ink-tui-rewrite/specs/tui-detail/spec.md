## ADDED Requirements

### Requirement: 宝可梦详情卡片布局
系统 SHALL 用 ink Box 组件渲染宝可梦详情卡片，布局跟随终端宽度自适应，精灵图与基础信息左右并排，其余区块垂直排列。

#### Scenario: 精灵图与基础信息并排
- **WHEN** 详情卡片渲染且图片加载完成
- **THEN** 精灵图占卡片左侧约 30% 宽，右侧显示身高/体重/性别/捕捉率/成长速度/孵化组

#### Scenario: 精灵图加载中
- **WHEN** 精灵图正在异步下载
- **THEN** 左侧区域显示 `Loading...` dimColor 占位符，其余内容正常显示

#### Scenario: 精灵图不可用
- **WHEN** 精灵图下载失败或用户传入 --no-image
- **THEN** 基础信息区域全宽展示，不显示占位框

#### Scenario: 终端宽度自适应
- **WHEN** 终端宽度变化（resize）
- **THEN** 卡片宽度自动跟随 `process.stdout.columns`，种族值进度条长度同步调整

### Requirement: 种族值进度条
系统 SHALL 为每条种族值渲染彩色进度条，条长基于当前终端宽度动态计算，颜色根据数值区间区分。

#### Scenario: 颜色区间
- **WHEN** 种族值 < 50
- **THEN** 进度条显示红色

#### Scenario: 颜色区间中等
- **WHEN** 种族值 50–99
- **THEN** 进度条显示黄色

#### Scenario: 颜色区间高
- **WHEN** 种族值 ≥ 100
- **THEN** 进度条显示绿色

#### Scenario: 总计行
- **WHEN** 六条种族值渲染完毕
- **THEN** 最后一行显示 bold 总计数值和 `总计` / `Total` 标签

### Requirement: 特性展示
系统 SHALL 展示宝可梦全部特性，区分普通特性和隐藏特性，并显示当前语言的特性描述。

#### Scenario: 普通特性
- **WHEN** 特性非隐藏
- **THEN** 显示 `● 特性名  描述文本`

#### Scenario: 隐藏特性
- **WHEN** 特性为隐藏特性
- **THEN** 显示 `◆ 特性名 [隐藏特性]  描述文本`，以 dim 颜色标注隐藏标签

### Requirement: 进化链展示
系统 SHALL 展示完整进化链，包含进化条件，分支进化用树状结构渲染。

#### Scenario: 线性进化链
- **WHEN** 进化链无分支
- **THEN** 显示 `A ──[条件]──▶ B ──[条件]──▶ C` 单行格式

#### Scenario: 分支进化链
- **WHEN** 同一宝可梦有多个进化方向
- **THEN** 用 `├──` / `└──` 树状格式展示各分支，每分支独占一行

#### Scenario: 无进化
- **WHEN** 宝可梦无进化链
- **THEN** 显示 `无进化` / `No evolution`

### Requirement: 详情页键盘操作
系统 SHALL 支持在详情页通过键盘操作切换状态或返回搜索。

#### Scenario: 返回搜索（search 命令下）
- **WHEN** 用户在详情页按 B 键，且当前是从 search 命令进入
- **THEN** 界面返回搜索列表，保留之前的搜索词和选中位置

#### Scenario: 切换闪光形态
- **WHEN** 用户按 S 键
- **THEN** 精灵图切换为闪光/普通版本，重新异步加载图片

#### Scenario: get 命令自动退出
- **WHEN** `pokecn get` 命令渲染完成（数据加载成功，卡片已显示）
- **THEN** 程序自动调用 `useApp().exit()`，终端恢复正常，exit code 0

#### Scenario: 退出
- **WHEN** 用户按 Q 或 Esc
- **THEN** 程序退出，exit code 0
