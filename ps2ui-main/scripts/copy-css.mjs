// Copies every CSS file from src/ into dist/ at the same relative path, so the
// transpiled JS (which keeps its `import "./x.css"` statements) resolves them,
// and the package's exported entrypoints (styles.css, tokens.css) exist.
import { cp, readdir } from "node:fs/promises";
import { join, extname } from "node:path";

const SRC = "src";
const OUT = "dist";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (extname(e.name) === ".css") out.push(p);
  }
  return out;
}

const files = await walk(SRC);
for (const f of files) {
  const dest = f.replace(`${SRC}/`, `${OUT}/`);
  await cp(f, dest);
}
console.log(`copy-css: copied ${files.length} stylesheet(s) to ${OUT}/`);
