import { defineConfig } from 'astro/config';

// DocLab Web — a static, 100% client-side PDF tool suite.
// There is no server and no SSR: every PDF is processed in the visitor's
// browser and nothing is ever uploaded. The host (Cloudflare Pages) only
// serves static files.
export default defineConfig({
  site: 'https://doclab.app',
  output: 'static',
  // Bundle Web Workers as ES modules — the PDF work (Comlink + @cantoo/pdf-lib)
  // runs off the main thread so the UI never freezes.
  vite: {
    worker: { format: 'es' },
  },
});
