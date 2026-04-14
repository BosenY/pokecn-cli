#!/usr/bin/env bun

import { $ } from "bun";
import { readFile, writeFile, chmod } from "node:fs/promises";
import { mkdir } from "node:fs/promises";

await mkdir("dist", { recursive: true });

console.log("打包 Node.js bundle...");
await $`bun build --target=node ./src/cli.ts --outfile dist/cli.js`.quiet();

// 替换 shebang（bun build 会保留源文件的 #!/usr/bin/env bun）
const content = await readFile("dist/cli.js", "utf8");
const replaced = content.startsWith("#!")
  ? content.replace(/^#!.*\n/, "#!/usr/bin/env node\n")
  : `#!/usr/bin/env node\n${content}`;
await writeFile("dist/cli.js", replaced);
await chmod("dist/cli.js", 0o755);

console.log("完成：dist/cli.js");
