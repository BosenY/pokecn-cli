## ADDED Requirements

### Requirement: API response caching with TTL

系统 SHALL 将 PokeAPI 的 JSON 响应缓存到 `~/.pokecn/cache/` 目录，默认 TTL 为 7 天。

#### Scenario: Cache hit within TTL

- **WHEN** 查询 pikachu 且 `~/.pokecn/cache/pokemon_pikachu.json` 存在且修改时间 < 7 天
- **THEN** 直接读取本地缓存，不发起网络请求

#### Scenario: Cache expired

- **WHEN** 缓存文件修改时间 > 7 天
- **THEN** 重新请求 API 并覆盖缓存文件

#### Scenario: Cache miss

- **WHEN** 缓存文件不存在
- **THEN** 请求 API，将响应写入缓存文件

### Requirement: Sprite permanent caching

系统 SHALL 将下载的精灵图片永久缓存到 `~/.pokecn/sprites/{normal|shiny}/` 目录。

#### Scenario: Sprite cache hit

- **WHEN** 查询 id=25 且 `~/.pokecn/sprites/normal/25.png` 存在
- **THEN** 直接读取本地图片，不发起下载请求

#### Scenario: First time sprite download

- **WHEN** 精灵图片不在本地缓存
- **THEN** 下载图片并保存到对应目录

### Requirement: Cache directory auto-creation

系统 SHALL 在首次运行时自动创建 `~/.pokecn/` 及其子目录（cache、sprites/normal、sprites/shiny）。

#### Scenario: First run

- **WHEN** `~/.pokecn/` 目录不存在
- **THEN** 自动创建完整目录结构，不报错
