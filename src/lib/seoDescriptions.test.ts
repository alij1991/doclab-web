import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

// Meta descriptions outside toolContent.ts (homepage, desktop, guides hub,
// guide articles, prose pages) — the ones Bing flagged as over-length.
// SERP limit: Bing/Google show ~150-160 chars; enforce 25-160.
const ROOT = join(__dirname, '..');

function astroDescription(file: string): string {
  const src = readFileSync(join(ROOT, file), 'utf8');
  const m = src.match(/description="([^"]+)"/);
  expect(m, `${file}: no description= found`).toBeTruthy();
  return m![1]!;
}

function frontmatterDescription(file: string): string {
  const src = readFileSync(file, 'utf8');
  const m = src.match(/^description:\s*"([^"]+)"/m);
  expect(m, `${file}: no frontmatter description found`).toBeTruthy();
  return m![1]!;
}

describe('meta descriptions outside toolContent (SERP length 25-160)', () => {
  it('astro pages with literal descriptions are within limits', () => {
    for (const file of ['pages/index.astro', 'pages/desktop.astro', 'pages/guides/index.astro']) {
      const d = astroDescription(file);
      expect([...d].length, `${file} too long: ${[...d].length}`).toBeLessThanOrEqual(160);
      expect([...d].length, `${file} too short`).toBeGreaterThanOrEqual(25);
    }
  });

  it('guide article frontmatter descriptions are within limits', () => {
    const dir = join(ROOT, 'content', 'guides');
    const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
    expect(files.length).toBeGreaterThanOrEqual(5);
    for (const f of files) {
      const d = frontmatterDescription(join(dir, f));
      expect([...d].length, `guides/${f} too long: ${[...d].length}`).toBeLessThanOrEqual(160);
      expect([...d].length, `guides/${f} too short`).toBeGreaterThanOrEqual(25);
    }
  });

  it('prose pages (privacy, getting-started) are within limits', () => {
    for (const f of ['pages/privacy.md', 'pages/getting-started.md']) {
      const d = frontmatterDescription(join(ROOT, f));
      expect([...d].length, `${f} too long`).toBeLessThanOrEqual(160);
      expect([...d].length, `${f} too short`).toBeGreaterThanOrEqual(25);
    }
  });
});
