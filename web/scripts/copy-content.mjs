import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const webRoot = path.join(__dirname, '..');
const source = path.join(webRoot, '..', 'artificialjobs.dev', 'content');
const dest = path.join(webRoot, 'content');

if (!fs.existsSync(source)) {
  if (fs.existsSync(dest)) {
    console.log('copy-content: using existing web/content (source not found)');
    process.exit(0);
  }
  console.error('copy-content: no source or destination content directory found');
  process.exit(1);
}

fs.cpSync(source, dest, { recursive: true });
console.log(`copy-content: synced ${source} -> ${dest}`);
