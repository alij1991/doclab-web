import * as Comlink from 'comlink';
import { PDFDocument, PDFName, degrees } from '@cantoo/pdf-lib';

// Runs in a Web Worker — OFF the main thread, so big jobs never freeze the
// UI. This is also where the privacy guarantee lives: bytes are processed
// here in the browser and never sent anywhere.
//
// NOTE (docs/web-tools-plan.md §4): pdf-lib does a full-document rewrite on
// save, which can drop a tagged PDF's accessibility tree / PDF-A conformance.
// `analyze()` flags tagged/encrypted inputs so each tool can warn the user and
// point them at the desktop app; the full fidelity harness lands later.

const PRODUCER = 'DocLab Web — https://doc-lab.net';

export interface MergeFile {
  name: string;
  bytes: ArrayBuffer;
}

export interface PdfInfo {
  pages: number;
  encrypted: boolean;
  tagged: boolean;
}

const api = {
  /** Page count for one PDF. Throws on encrypted/invalid (the UI surfaces it). */
  async pageCount(bytes: ArrayBuffer): Promise<number> {
    return (await PDFDocument.load(bytes)).getPageCount();
  },

  /** Inspect a PDF: page count, whether it's encrypted, whether it's tagged
   *  (has a structure tree / MarkInfo) so the tool can warn before editing. */
  async analyze(bytes: ArrayBuffer): Promise<PdfInfo> {
    try {
      const doc = await PDFDocument.load(bytes);
      const cat = doc.catalog;
      const tagged =
        cat.get(PDFName.of('StructTreeRoot')) != null ||
        cat.get(PDFName.of('MarkInfo')) != null;
      return { pages: doc.getPageCount(), encrypted: false, tagged };
    } catch {
      // pdf-lib throws on encrypted (and on truly broken) PDFs.
      return { pages: 0, encrypted: true, tagged: false };
    }
  },

  /** Merge PDFs, in order, into one. */
  async merge(files: MergeFile[]): Promise<Uint8Array> {
    const out = await PDFDocument.create();
    out.setCreator('DocLab Web');
    out.setProducer(PRODUCER);
    for (const f of files) {
      const src = await PDFDocument.load(f.bytes);
      const copied = await out.copyPages(src, src.getPageIndices());
      for (const page of copied) out.addPage(page);
    }
    return out.save();
  },

  /** Rotate the given 0-based page indices (or all pages) by a multiple of 90°,
   *  added to each page's current rotation. */
  async rotate(bytes: ArrayBuffer, clockwiseDegrees: number, indices: number[]): Promise<Uint8Array> {
    const doc = await PDFDocument.load(bytes);
    const pages = doc.getPages();
    const targets = indices.length ? indices : pages.map((_, i) => i);
    for (const i of targets) {
      const page = pages[i];
      if (!page) continue;
      const current = page.getRotation().angle;
      page.setRotation(degrees(((current + clockwiseDegrees) % 360 + 360) % 360));
    }
    return doc.save();
  },

  /** Delete the given 0-based page indices. Refuses to delete every page. */
  async deletePages(bytes: ArrayBuffer, indices: number[]): Promise<Uint8Array> {
    const doc = await PDFDocument.load(bytes);
    const total = doc.getPageCount();
    const remove = [...new Set(indices)]
      .filter((i) => i >= 0 && i < total)
      .sort((a, b) => b - a); // descending so earlier removals don't shift later indices
    if (remove.length === 0) throw new Error('No valid pages to delete.');
    if (remove.length >= total) throw new Error('That would delete every page.');
    for (const i of remove) doc.removePage(i);
    return doc.save();
  },

  /** Build a new PDF from just the given 0-based page indices, in order. */
  async extractPages(bytes: ArrayBuffer, indices: number[]): Promise<Uint8Array> {
    const src = await PDFDocument.load(bytes);
    const total = src.getPageCount();
    const keep = indices.filter((i) => i >= 0 && i < total);
    if (keep.length === 0) throw new Error('No valid pages selected.');
    const out = await PDFDocument.create();
    out.setCreator('DocLab Web');
    out.setProducer(PRODUCER);
    const copied = await out.copyPages(src, keep);
    for (const page of copied) out.addPage(page);
    return out.save();
  },
};

export type PdfApi = typeof api;

Comlink.expose(api);
