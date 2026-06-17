import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// DocLab Web — a static, 100% client-side PDF tool suite.
// There is no server and no SSR: every PDF is processed in the visitor's
// browser and nothing is ever uploaded. The host (Cloudflare Pages) only
// serves static files.
export default defineConfig({
  site: 'https://doc-lab.net',
  output: 'static',
  // /organize-pdf rendered the same editor as /edit-pdf (duplicate content) —
  // 301 it to the canonical editor route.
  redirects: { '/organize-pdf': '/edit-pdf' },
  // Emit /sitemap-index.xml + /sitemap-0.xml at build (referenced from robots.txt)
  // so search engines discover every tool route.
  integrations: [sitemap()],
  // Bundle Web Workers as ES modules — the PDF work (Comlink + @cantoo/pdf-lib)
  // runs off the main thread so the UI never freezes.
  vite: {
    worker: { format: 'es' },
  },
});
