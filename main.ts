import { chmodSync, copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Meme Sprint 3: AI Agent Goes Rogue — make.fun entry.
// The meme itself ships beside this file as meme.png (1024x1024 PNG,
// drawn procedurally for this bounty). This program hands it in: it
// copies meme.png to the output directory as entry.png, which is the
// one file the sealed gate checks (whole PNG or JPEG, at most
// 1,048,576 bytes, at most 1024x1024 pixels; this image is 73,304
// bytes). Outside the grader's container, MAKEFUN_OUTPUT_DIR stands
// in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outDir, "entry.png");

function writeEntry(): void {
  mkdirSync(outDir, { recursive: true });
  copyFileSync(join(here, "meme.png"), target);
  chmodSync(target, 0o644);
  const size = statSync(target).size;
  if (size === 0 || size > 1_048_576) {
    throw new Error(`entry.png size ${size} outside the gate`);
  }
}

try {
  writeEntry();
} catch (err) {
  console.error("failed to write entry:", err);
  process.exit(1);
}
