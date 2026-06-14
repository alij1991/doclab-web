import * as Comlink from 'comlink';
import { PDFDocument } from '@cantoo/pdf-lib';

// This runs in a Web Worker — OFF the main thread, so a big merge never
// freezes the UI. It is also where the privacy guarantee lives: bytes are
// processed here in the browser and never sent anywhere.

export interface MergeFile {
  name: string;
  bytes: ArrayBuffer;
}

const api = {
  /**
   * Page count for one PDF — used to label files in the UI.
   * Throws on encrypted or invalid PDFs (the UI surfaces that).
   */
  async pageCount(bytes: ArrayBuffer): Promise<number> {
    const doc = await PDFDocument.load(bytes);
    return doc.getPageCount();
  },

  /**
   * Merge the given PDFs, in order, into one — entirely in this worker.
   * Returns the new PDF's bytes.
   *
   * NOTE (tracked in docs/web-tools-plan.md §4): pdf-lib does a full-document
   * rewrite on save, which can drop a tagged PDF's accessibility tree / PDF-A
   * conformance. The fidelity harness + an in-UI warning on tagged/PDF-A/form
   * inputs land before this ships publicly.
   */
  async merge(files: MergeFile[]): Promise<Uint8Array> {
    const out = await PDFDocument.create();
    out.setCreator('DocLab Web');
    out.setProducer('DocLab Web — https://doc-lab.net');
    for (const f of files) {
      const src = await PDFDocument.load(f.bytes);
      const copied = await out.copyPages(src, src.getPageIndices());
      for (const page of copied) out.addPage(page);
    }
    return out.save();
  },
};

export type PdfApi = typeof api;

Comlink.expose(api);
