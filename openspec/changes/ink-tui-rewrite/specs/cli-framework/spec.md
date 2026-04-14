## MODIFIED Requirements

### Requirement: 命令执行模式
命令 run() 函数 SHALL 通过 ink 的 `render()` 启动 React 应用，而非直接调用 `console.log()`。`pokecn search` 渲染交互式应用并等待 `waitUntilExit()`；`pokecn get` 渲染详情组件，数据加载完成后组件内部调用 `useApp().exit()` 自动退出。

#### Scenario: search 命令启动
- **WHEN** 用户执行 `pokecn search`
- **THEN** ink 渲染 `<App initialMode="search">` 并阻塞等待，直到用户按 Q/Esc 退出

#### Scenario: get 命令启动
- **WHEN** 用户执行 `pokecn get 皮卡丘`
- **THEN** ink 渲染 `<DetailApp slug="pikachu" autoExit>`，卡片显示后自动退出，exit code 0

#### Scenario: get 命令错误处理
- **WHEN** `pokecn get` 查询的宝可梦不存在（404）
- **THEN** 显示错误信息后以 exit code 1 退出

## REMOVED Requirements

### Requirement: clack/prompts 交互流程
**Reason**: 被 ink 实时交互界面替代，`@clack/prompts` 的两步式"输入 → 提交 → 输出"流程废弃
**Migration**: 使用 `pokecn search` 的新 ink 交互界面，体验等价且更流畅
