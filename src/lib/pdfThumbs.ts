// pdf.js rendering for the editor: small rail thumbnails + the large main page
// view. Runs on the MAIN thread (pdf.js spawns its own worker for parsing;
// canvas 2D rendering must be on-thread).
//
// Privacy + CSP: pdf.js fetches its worker, standard fonts, and CMaps from the
// SAME ORIGIN only (assets staged into public/pdfjs by scripts/copy-pdfjs-assets.mjs).
// `isEvalSupported: false` keeps us off 'unsafe-eval'. Nothing is uploaded.
//
// Rendering is best-effort: a failed page leaves a placeholder; the actual page
// edits are done by pdf-lib (full fidelity), so a missing render never affects
// output. NOTE: pdf.js paints via requestAnimationFrame, so renders only
// complete in a VISIBLE tab (see memory: gotcha-pdfjs-raf-hidden-tab).
import * as pdfjsLib from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface ThumbDoc {
  pageCount: number;
  /** Rail thumbnail: render page `pageIndex` (0-based) into `canvas`, fit to
   *  `maxPx` on the long edge, with `extraRotation` added to intrinsic rotation. */
  render(pageIndex: number, canvas: HTMLCanvasElement, maxPx: number, extraRotation: number): Promise<void>;
  /** Big main view: fit the page to `cssWidth` CSS px times `zoom`, rendered at
   *  device resolution (DPR-aware) and sized via canvas.style for crispness. */
  renderWidth(
    pageIndex: number,
    canvas: HTMLCanvasElement,
    cssWidth: number,
    zoom: number,
    extraRotation: number,
    dpr: number,
  ): Promise<{ cssWidth: number; cssHeight: number }>;
  destroy(): void;
}

export async function openForThumbs(bytes: ArrayBuffer): Promise<ThumbDoc> {
  const task = pdfjsLib.getDocument({
    data: bytes,
    isEvalSupported: false,
    cMapUrl: '/pdfjs/cmaps/',
    cMapPacked: true,
    standardFontDataUrl: '/pdfjs/standard_fonts/',
  } as Parameters<typeof pdfjsLib.getDocument>[0]);
  const doc = await task.promise;

  const rotationOf = (intrinsic: number, extra: number) => (((intrinsic + extra) % 360) + 360) % 360;

  return {
    pageCount: doc.numPages,

    async render(pageIndex, canvas, maxPx, extraRotation) {
      const page = await doc.getPage(pageIndex + 1);
      try {
        const rotation = rotationOf(page.rotate, extraRotation);
        const unit = page.getViewport({ scale: 1, rotation });
        const scale = maxPx / Math.max(unit.width, unit.height);
        const viewport = page.getViewport({ scale, rotation });
        canvas.width = Math.max(1, Math.ceil(viewport.width));
        canvas.height = Math.max(1, Math.ceil(viewport.height));
        await page.render({ canvas, viewport }).promise;
      } finally {
        page.cleanup();
      }
    },

    async renderWidth(pageIndex, canvas, cssWidth, zoom, extraRotation, dpr) {
      const page = await doc.getPage(pageIndex + 1);
      try {
        const rotation = rotationOf(page.rotate, extraRotation);
        const unit = page.getViewport({ scale: 1, rotation });
        const cssScale = (cssWidth / unit.width) * zoom;
        const dispW = unit.width * cssScale;
        const dispH = unit.height * cssScale;
        const renderScale = cssScale * Math.min(Math.max(dpr, 1), 2);
        const viewport = page.getViewport({ scale: renderScale, rotation });
        canvas.width = Math.max(1, Math.ceil(viewport.width));
        canvas.height = Math.max(1, Math.ceil(viewport.height));
        canvas.style.width = Math.round(dispW) + 'px';
        canvas.style.height = Math.round(dispH) + 'px';
        await page.render({ canvas, viewport }).promise;
        return { cssWidth: dispW, cssHeight: dispH };
      } finally {
        page.cleanup();
      }
    },

    destroy() {
      task.destroy();
    },
  };
}
