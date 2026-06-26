const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else if (dirFile.endsWith('.ts')) {
      filelist.push(dirFile);
    }
  });
  return filelist;
}

const files = walkSync(path.join(__dirname, 'src', 'engine'));
for (const f of files) {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('input.archetypes.includes(')) {
    content = content.replace(/input\.archetypes\.includes\((['"][\w_]+['"])\)/g, 'input.archetypes.some(a => a.name === $1)');
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
  }
}
