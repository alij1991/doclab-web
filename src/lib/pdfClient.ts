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
    remote = Comlink.wrap<PdfApi>(worker);
  }
  return remote;
}
