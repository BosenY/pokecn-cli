## 1. 替换 Bun 专属 API

- [x] 1.1 修改 `src/cache/index.ts`：将 `Bun.file(cacheFile)` 替换为 `fs.stat` + `fs.readFile`，将 `Bun.write` 替换为 `fs.writeFile`，用 `stat.mtimeMs` 替代 `file.lastModified`，用 `ENOENT` 错误捕获替代 `file.exists()`
- [x] 1.2 修改 `src/config/index.ts`：将 `Bun.file(configPath)` 替换为 `fs.readFile`，用 `ENOENT` 错误捕获替代 `file.exists()`
- [x] 1.3 修改 `src/render/image.ts`：将 `Bun.file(localPath)` 替换为 `fs.readFile`，将 `Bun.write` 替换为 `fs.writeFile`，用 `ENOENT` 错误捕获替代 `file.exists()`

## 2. 新增 npm bundle 构建脚本

- [x] 2.1 新建 `scripts/build-npm.ts`：执行 `bun build --target=node ./src/cli.ts --outfile dist/cli.js`，并在输出文件头部注入 `#!/usr/bin/env node`，最后 `chmod +x dist/cli.js`
- [x] 2.2 在 `package.json` 中新增 `"build:npm": "bun scripts/build-npm.ts"` script

## 3. 更新 package.json 发布配置

- [x] 3.1 将 `bin.pokecn` 改为 `./dist/cli.js`
- [x] 3.2 将 `files` 改为 `["dist/", "README.md"]`

## 4. 更新 GitHub Actions

- [x] 4.1 在 `release.yml` 的 `release` job 中，`npm publish` 步骤前增加 `bun run build:npm`

## 5. 验证

- [x] 5.1 本地执行 `bun run build:npm`，确认 `dist/cli.js` 生成且头部有 shebang
- [x] 5.2 执行 `node dist/cli.js get pikachu`，确认输出正常
- [x] 5.3 执行 `npm pack --dry-run`，确认包含 `dist/cli.js`，不含 `src/`
- [x] 5.4 将 `dist/` 加入 `.gitignore`（构建产物不提交）
