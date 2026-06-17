import * as Comlink from 'comlink';
import type { PdfApi } from './pdf.worker';

let remote: Comlink.Remote<PdfApi> | null = null;

/**
 * Lazily start the PDF worker (one per tab) and return a Comlink proxy.
 * Calling `pdfApi().merge(...)` looks like a normal async call but runs
 * in the worker thread.
 */
export function pdfApi(): Comlink.Remote<PdfApi> {
  if (!remote) {
    const worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), {
      type: 'module',
    });
    // Surface worker-level failures (load error, OOM) that bypass Comlink's
    // per-call promise — otherwise they'd vanish silently.
    worker.addEventListener('error', (e) => {
      console.error('[pdf.worker] error:', e.message, e.filename + ':' + e.lineno);
    });
    worker.addEventListener('messageerror', () => {
      console.error('[pdf.worker] message could not be deserialized');
    });
    remote = Comlink.wrap<PdfApi>(worker);
  }
  return remote;
}
