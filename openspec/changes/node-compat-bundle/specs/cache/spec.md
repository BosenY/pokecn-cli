## MODIFIED Requirements

### Requirement: 文件读写使用标准 Node.js API
缓存模块 SHALL 使用 `node:fs/promises` 替代 `Bun.file`/`Bun.write`，行为保持不变。

#### Scenario: 缓存文件读取
- **WHEN** 调用 `cachedFetch` 且本地缓存文件存在且未过期
- **THEN** 使用 `fs.readFile` 读取文件内容并返回，不发起网络请求

#### Scenario: 缓存文件写入
- **WHEN** 调用 `cachedFetch` 且缓存不存在或已过期
- **THEN** 请求 API 后使用 `fs.writeFile` 将结果写入缓存文件

#### Scenario: 缓存过期判断
- **WHEN** 缓存文件存在
- **THEN** 使用 `fs.stat().mtimeMs` 获取文件修改时间，替代 `Bun.file.lastModified`
