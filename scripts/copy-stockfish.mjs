#!/usr/bin/env node

import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const sourceDir = join(root, "node_modules", "stockfish", "bin");
const targetDir = join(root, "public", "stockfish");

const files = [
  "stockfish-18-lite-single.js",
  "stockfish-18-lite-single.wasm",
];

mkdirSync(targetDir, { recursive: true });

for (const file of files) {
  copyFileSync(join(sourceDir, file), join(targetDir, file));
}

console.log(`Copied ${files.length} Stockfish files to public/stockfish/`);
