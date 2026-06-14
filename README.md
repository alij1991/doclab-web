# DocLab Web

Free, **100% client-side** PDF tools — merge, split, rotate, and more — all running
**in your browser**. Nothing is ever uploaded. A companion to the
[DocLab desktop app](https://apps.microsoft.com/detail/9MV6R84RVKCZ).

## Why this exists
- **Private by design** — every PDF is processed on your device; there is no server and no upload.
- **Cross-platform** — works in any modern browser and installs as a PWA (the desktop app is Windows-first).
- **Funnel** — heavy features (OCR, true redaction, text editing) live in the free desktop app.

## Stack
- **Astro 5** (static output) — one route per tool.
- **@cantoo/pdf-lib** (MIT) — page operations, run in a **Web Worker** via Comlink.
- **pdf.js** (Apache-2.0) — rendering / preview (viewer, later phases).
- **Cloudflare Pages** — static hosting with custom `_headers` (CSP).

Full implementation plan lives in the app repo at `docs/web-tools-plan.md`.

## Develop

    npm install
    npm run dev       # http://localhost:4321
    npm run build     # static output -> dist/
    npm run preview   # serve the production build
    npm run check     # astro type-check
    npm run licenses  # fails the build on AGPL/GPL deps (keeps copyleft engines out)

## License
MIT — see [LICENSE](LICENSE). The DocLab desktop app is a separate, proprietary product.
