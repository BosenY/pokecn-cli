## ADDED Requirements

### Requirement: Config file location

系统 SHALL 使用 `~/.pokecn/config.json` 作为用户配置文件。

#### Scenario: Config file exists

- **WHEN** `~/.pokecn/config.json` 存在
- **THEN** 读取并合并到默认配置

#### Scenario: Config file missing

- **WHEN** 配置文件不存在
- **THEN** 使用默认配置，不报错

### Requirement: Default configuration

系统 SHALL 提供以下默认配置：

```json
{
  "language": "zh",
  "image": {
    "protocol": "auto",
    "scale": 1.0
  },
  "display": {
    "showImage": true,
    "showStats": true,
    "showEvolution": true,
    "showDexEntry": true
  }
}
```

#### Scenario: Apply defaults

- **WHEN** 配置文件为空或部分缺失
- **THEN** 缺失字段使用默认值填充

### Requirement: CLI flags override config

命令行参数 SHALL 优先于配置文件设置。优先级：CLI flags > config.json > defaults。

#### Scenario: Lang flag overrides config

- **WHEN** config.json 中 language="zh"，但用户执行 `pokecn get pikachu --lang en`
- **THEN** 使用 en 作为语言
