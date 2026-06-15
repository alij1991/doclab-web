# DocLab Web

Free, **100% client-side** PDF tools — a full visual editor plus single-task
tools — running entirely **in your browser**. Nothing is ever uploaded.

### ▶ Live: **https://doc-lab.net**

A companion to the [DocLab desktop app](https://apps.microsoft.com/detail/9MV6R84RVKCZ)
(OCR, true redaction, and text editing live there).

## Tools

- **[Edit PDF](https://doc-lab.net/edit-pdf)** — the all-in-one editor: a large page view + thumbnail rail with
  - reorder (drag), rotate, duplicate, delete, extract
  - **Add pages** — merge another PDF or insert JPG/PNG images
  - **Page numbers** and **watermark**
  - **Annotate** — draw, highlight, text, boxes, lines (baked into the PDF)
  - **PDF → images** (PNG/JPG, zipped)
- Focused single-task pages: **Merge**, **Split**, **Rotate**, **Delete pages**,
  **Extract pages**, **Organize**, **Images → PDF**, **PDF → JPG**.

## Why this exists
- **Private by design** — every PDF is processed on your device; there is no server and no upload.
- **Cross-platform** — works in any modern browser and installs as a PWA (the desktop app is Windows-first).
- **Funnel** — heavy features (OCR, true redaction, text editing) live in the free desktop app.

## Stack
- **Astro 5** (static output) — one route per tool.
- **@cantoo/pdf-lib** (MIT) — page operations + stamps, run in a **Web Worker** via Comlink.
- **pdf.js** (Apache-2.0) — page rendering (thumbnail rail + large view), assets served same-origin.
- **fflate** (MIT) — zipping for split / image export.
- **Cloudflare Workers** static assets — hosting with a strict CSP via `public/_headers`.

Full implementation plan lives in the app repo at `docs/web-tools-plan.md`.

## Develop

    npm install
    npm run dev       # http://localhost:4321
    npm run build     # static output -> dist/  (also copies pdf.js fonts/cmaps)
    npm run preview   # serve the production build
    npm run check     # astro type-check (kept at 0 errors)
    npm run licenses  # fails the build on AGPL/GPL deps (keeps copyleft engines out; needs Node >= 24)

Everything runs in the browser — there is no backend.

## License
MIT — see [LICENSE](LICENSE). The DocLab desktop app is a separate, proprietary product.
