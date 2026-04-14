## MODIFIED Requirements

### Requirement: 配置文件读取使用标准 Node.js API
配置模块 SHALL 使用 `node:fs/promises` 替代 `Bun.file`，行为保持不变。

#### Scenario: 配置文件存在时加载
- **WHEN** 调用 `loadConfig` 且 `~/.pokecn/config.json` 存在
- **THEN** 使用 `fs.readFile` 读取并解析，与默认配置深度合并后返回

#### Scenario: 配置文件不存在时返回默认值
- **WHEN** 调用 `loadConfig` 且配置文件不存在
- **THEN** 捕获 `ENOENT` 错误，返回默认配置，不抛出异常
