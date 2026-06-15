const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'next-env.d.ts');

function stabilize() {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf8');
  // Filter out any lines that import from the .next directory (mode-dependent route types)
  const lines = content.split(/\r?\n/).filter(line => !line.includes('./.next/'));
  const newContent = lines.join('\n');

  if (content !== newContent) {
    console.log('Stabilizing next-env.d.ts: Removing mode-dependent imports.');
    fs.writeFileSync(filePath, newContent);
  }
}

if (require.main === module) {
  stabilize();
}

module.exports = stabilize;
