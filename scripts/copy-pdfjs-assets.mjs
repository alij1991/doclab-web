// Copies pdf.js runtime assets (standard fonts + CMaps) into public/ so they
// are served same-origin. This keeps thumbnail rendering high-fidelity (Latin
// standard-14 fonts + CJK CMaps) WITHOUT any external/CDN fetch — preserving
// both the CSP (connect-src 'self') and the privacy promise (nothing leaves
// the browser). Runs automatically via `prebuild`/`predev`; public/pdfjs is
// gitignored and regenerated on every build (incl. Cloudflare CI).
import { cpSync, existsSync, rmSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const pkg = join(root, 'node_modules', 'pdfjs-dist');
const outBase = join(root, 'public', 'pdfjs');

const assets = [
  { name: 'standard_fonts', from: join(pkg, 'standard_fonts'), to: join(outBase, 'standard_fonts') },
  { name: 'cmaps', from: join(pkg, 'cmaps'), to: join(outBase, 'cmaps') },
];

let copied = 0;
for (const a of assets) {
  if (!existsSync(a.from)) {
    console.warn(`[copy-pdfjs-assets] ${a.name} not found at ${a.from} — skipping (thumbnails fall back).`);
    continue;
  }
  rmSync(a.to, { recursive: true, force: true });
  mkdirSync(a.to, { recursive: true });
  cpSync(a.from, a.to, { recursive: true });
  copied++;
}
console.log(`[copy-pdfjs-assets] copied ${copied}/${assets.length} asset set(s) into public/pdfjs/`);
