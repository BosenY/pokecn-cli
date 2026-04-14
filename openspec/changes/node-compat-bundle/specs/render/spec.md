## MODIFIED Requirements

### Requirement: 精灵图片缓存读写使用标准 Node.js API
渲染模块 SHALL 使用 `node:fs/promises` 替代 `Bun.file`/`Bun.write`，行为保持不变。

#### Scenario: 本地缓存精灵图片存在
- **WHEN** 请求精灵图片且本地缓存文件存在
- **THEN** 使用 `fs.readFile` 读取并返回 Buffer，不发起网络请求

#### Scenario: 精灵图片下载并缓存
- **WHEN** 请求精灵图片且本地缓存不存在
- **THEN** 从远程下载后使用 `fs.writeFile` 写入本地缓存，返回 Buffer
