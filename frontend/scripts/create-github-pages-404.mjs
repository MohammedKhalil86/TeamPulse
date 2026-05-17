import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const frontendRoot = join(scriptDirectory, '..');
const browserOutput = join(frontendRoot, 'dist', 'teampulse-frontend', 'browser');
const indexPath = join(browserOutput, 'index.html');
const fallbackPath = join(browserOutput, '404.html');
const noJekyllPath = join(browserOutput, '.nojekyll');

if (!existsSync(indexPath)) {
  throw new Error(`Cannot create GitHub Pages fallback because index.html was not found at ${indexPath}.`);
}

copyFileSync(indexPath, fallbackPath);
writeFileSync(noJekyllPath, '');

console.log(`Created ${fallbackPath}`);
console.log(`Created ${noJekyllPath}`);
