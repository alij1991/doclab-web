// Thumbnail rendering via pdf.js (pdfjs-dist). Runs on the MAIN thread (it
// spawns its own worker for parsing); canvas 2D rendering must be on-thread.
//
// Privacy + CSP: pdf.js fetches its worker, standard fonts, and CMaps from the
// SAME ORIGIN only (assets staged into public/pdfjs by scripts/copy-pdfjs-assets.mjs).
// `isEvalSupported: false` keeps us off 'unsafe-eval'. Nothing is uploaded.
//
// Thumbnails are best-effort: if a page fails to render, the caller shows a
// numbered placeholder. The actual page edits are done by pdf-lib (full
// fidelity), so a missing thumbnail never affects output.
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface ThumbDoc {
  pageCount: number;
  /** Render page `pageIndex` (0-based) into `canvas`, fit to `maxPx` on the long
   *  edge, with `extraRotation` degrees added to the page's intrinsic rotation. */
  render(pageIndex: number, canvas: HTMLCanvasElement, maxPx: number, extraRotation: number): Promise<void>;
  destroy(): void;
}

export async function openForThumbs(bytes: ArrayBuffer): Promise<ThumbDoc> {
  const task = pdfjsLib.getDocument({
    data: bytes,
    // isEvalSupported is a valid runtime option; cast past v6 .d.ts gaps so we
    // can keep CSP off 'unsafe-eval'.
    isEvalSupported: false,
    cMapUrl: '/pdfjs/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
  } as Parameters<typeof pdfjsLib.getDocument>[0]);
  const doc = await task.promise;

  return {
    pageCount: doc.numPages,

    async render(pageIndex, canvas, maxPx, extraRotation) {
      const page = await doc.getPage(pageIndex + 1);
      try {
        const rotation = (((page.rotate + extraRotation) % 360) + 360) % 360;
        const unit = page.getViewport({ scale: 1, rotation });
        const scale = maxPx / Math.max(unit.width, unit.height);
        const viewport = page.getViewport({ scale, rotation });
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('no 2d canvas context');
        canvas.width = Math.max(1, Math.ceil(viewport.width));
        canvas.height = Math.max(1, Math.ceil(viewport.height));
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      } finally {
        page.cleanup();
      }
    },

    destroy() {
      // Destroying the loading task tears down the document + its worker.
      task.destroy();
    },
  };
}
