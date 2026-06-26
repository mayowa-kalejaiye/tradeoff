import fs from 'node:fs';
import path from 'node:path';

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else if (exists) {
    fs.copyFileSync(src, dest);
  }
}

try {
  console.log('Copying public to standalone...');
  copyRecursiveSync('public', '.next/standalone/public');
  console.log('Copying static to standalone...');
  copyRecursiveSync('.next/static', '.next/standalone/.next/static');
  console.log('Copy complete!');
} catch (err) {
  console.error('FATAL ERROR DURING COPY:', err);
  process.exit(1);
}
