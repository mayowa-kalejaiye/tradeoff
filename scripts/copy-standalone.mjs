import fs from 'node:fs/promises';
import path from 'node:path';

async function copyDir(src, dest) {
  try {
    await fs.cp(src, dest, { recursive: true });
    console.log(`Copied ${src} to ${dest}`);
  } catch (err) {
    if (err.code !== 'ENOENT') console.error(`Error copying ${src}:`, err);
  }
}

async function main() {
  await copyDir('public', '.next/standalone/public');
  await copyDir('.next/static', '.next/standalone/.next/static');
}

main();
