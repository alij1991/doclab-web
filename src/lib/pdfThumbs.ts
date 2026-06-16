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
  /** Big main view: fit the WHOLE page inside the available box (availW x availH)
   *  times `zoom`, rendered at device resolution (DPR-aware) and sized via canvas.style.
   *  Returns the displayed size plus screen<->PDF coordinate converters
   *  (CSS px in the displayed page <-> PDF user-space points), which account
   *  for rotation and zoom — used by the annotation layer. */
  renderFit(
    pageIndex: number,
    canvas: HTMLCanvasElement,
    availW: number,
    availH: number,
    zoom: number,
    extraRotation: number,
    dpr: number,
  ): Promise<PageView>;
  destroy(): void;
}

export interface PageView {
  cssWidth: number;
  cssHeight: number;
  /** CSS px per PDF point (for converting stroke widths). */
  scale: number;
  /** displayed CSS px (top-left origin) -> PDF user-space point (bottom-left). */
  toPdf(xCss: number, yCss: number): [number, number];
  /** PDF user-space point -> displayed CSS px. */
  toView(px: number, py: number): [number, number];
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

    async renderFit(pageIndex, canvas, availW, availH, zoom, extraRotation, dpr) {
      const page = await doc.getPage(pageIndex + 1);
      try {
        const rotation = rotationOf(page.rotate, extraRotation);
        const unit = page.getViewport({ scale: 1, rotation });
        // Fit the WHOLE page inside the available box (contain), then apply zoom.
        const fit = Math.min(availW / unit.width, availH / unit.height);
        const cssScale = Math.max(0.02, fit * zoom);
        const dispW = unit.width * cssScale;
        const dispH = unit.height * cssScale;
        const renderScale = cssScale * Math.min(Math.max(dpr, 1), 2);
        const viewport = page.getViewport({ scale: renderScale, rotation });
        // CSS-space viewport for screen<->PDF coordinate conversion (annotations).
        const cssViewport = page.getViewport({ scale: cssScale, rotation });
        canvas.width = Math.max(1, Math.ceil(viewport.width));
        canvas.height = Math.max(1, Math.ceil(viewport.height));
        canvas.style.width = Math.round(dispW) + 'px';
        canvas.style.height = Math.round(dispH) + 'px';
        await page.render({ canvas, viewport }).promise;
        return {
          cssWidth: dispW,
          cssHeight: dispH,
          scale: cssScale,
          toPdf: (x: number, y: number) => {
            const [px, py] = cssViewport.convertToPdfPoint(x, y);
            return [px, py] as [number, number];
          },
          toView: (px: number, py: number) => {
            const [x, y] = cssViewport.convertToViewportPoint(px, py);
            return [x, y] as [number, number];
          },
        };
      } finally {
        page.cleanup();
      }
    },

    destroy() {
      task.destroy();
    },
  };
}
