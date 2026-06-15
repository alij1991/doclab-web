import * as Comlink from 'comlink';
import { PDFDocument, PDFName, degrees } from '@cantoo/pdf-lib';
import { zipSync } from 'fflate';

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

export interface ImageItem {
  name: string;
  bytes: ArrayBuffer;
  kind: 'jpg' | 'png';
}

export interface SplitResult {
  /** 'pdf' when a single group (one file); 'zip' when many. */
  kind: 'pdf' | 'zip';
  filename: string;
  bytes: Uint8Array;
  parts: number;
}

export interface ComposeSource {
  id: string;
  bytes: ArrayBuffer;
}

export interface ComposePage {
  /** Which source the page comes from. */
  sourceId: string;
  /** 0-based page index within that source (may repeat = duplicate). */
  index: number;
  /** Extra clockwise rotation in degrees, added to the page's own rotation. */
  rotate: number;
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

  /** Build a PDF from images, one image per page. Each page is sized so its
   *  long edge is `longEdgePt` (default 792pt = US Letter long edge),
   *  preserving the image's aspect ratio; the image fills the page. */
  async imagesToPdf(images: ImageItem[], longEdgePt = 792): Promise<Uint8Array> {
    if (images.length === 0) throw new Error('No images to convert.');
    const out = await PDFDocument.create();
    out.setCreator('DocLab Web');
    out.setProducer(PRODUCER);
    for (const img of images) {
      const embedded = img.kind === 'png' ? await out.embedPng(img.bytes) : await out.embedJpg(img.bytes);
      const { width: iw, height: ih } = embedded.scale(1);
      const longest = Math.max(iw, ih) || 1;
      const scale = longEdgePt / longest;
      const w = iw * scale;
      const h = ih * scale;
      const page = out.addPage([w, h]);
      page.drawImage(embedded, { x: 0, y: 0, width: w, height: h });
    }
    return out.save();
  },

  /** Split a PDF into one output file per group of 0-based page indices.
   *  One group -> a single PDF; many groups -> a .zip of PDFs. `baseName` is
   *  the original filename without extension, used to name the outputs. */
  async splitPdf(bytes: ArrayBuffer, groups: number[][], baseName: string): Promise<SplitResult> {
    const src = await PDFDocument.load(bytes);
    const total = src.getPageCount();
    const valid = groups
      .map((g) => g.filter((i) => i >= 0 && i < total))
      .filter((g) => g.length > 0);
    if (valid.length === 0) throw new Error('No valid pages to split.');

    const base = baseName || 'document';
    const pad = String(valid.length).length;

    const buildPdf = async (indices: number[]): Promise<Uint8Array> => {
      const out = await PDFDocument.create();
      out.setCreator('DocLab Web');
      out.setProducer(PRODUCER);
      const copied = await out.copyPages(src, indices);
      for (const page of copied) out.addPage(page);
      return out.save();
    };

    if (valid.length === 1) {
      return { kind: 'pdf', filename: `${base}-split.pdf`, bytes: await buildPdf(valid[0]!), parts: 1 };
    }

    const files: Record<string, Uint8Array> = {};
    for (let i = 0; i < valid.length; i++) {
      const part = String(i + 1).padStart(pad, '0');
      files[`${base}-part-${part}.pdf`] = await buildPdf(valid[i]!);
    }
    const zipped = zipSync(files, { level: 0 }); // PDFs are already compressed; store-only is fast
    return { kind: 'zip', filename: `${base}-split.zip`, bytes: zipped, parts: valid.length };
  },

  /** Compose a PDF from an explicit ordered page list drawn from one OR MORE
   *  source PDFs: reorder, per-page rotation, deletions (pages omitted),
   *  duplicates (a page appearing twice), and merge/insert (pages from other
   *  sources). Refuses to produce an empty document. */
  async compose(sources: ComposeSource[], pages: ComposePage[]): Promise<Uint8Array> {
    const docs = new Map<string, PDFDocument>();
    for (const s of sources) docs.set(s.id, await PDFDocument.load(s.bytes));

    const valid = pages.filter((p) => {
      const d = docs.get(p.sourceId);
      return d != null && p.index >= 0 && p.index < d.getPageCount();
    });
    if (valid.length === 0) throw new Error('Keep at least one page.');

    const out = await PDFDocument.create();
    out.setCreator('DocLab Web');
    out.setProducer(PRODUCER);

    // Copy in order. Batch consecutive pages from the same source so pdf-lib
    // can share its copy context, while still honoring arbitrary interleaving.
    let i = 0;
    while (i < valid.length) {
      const sourceId = valid[i]!.sourceId;
      let j = i;
      while (j < valid.length && valid[j]!.sourceId === sourceId) j++;
      const run = valid.slice(i, j);
      const copied = await out.copyPages(docs.get(sourceId)!, run.map((p) => p.index));
      copied.forEach((page, k) => {
        const extra = (((run[k]!.rotate % 360) + 360) % 360);
        if (extra) page.setRotation(degrees(((page.getRotation().angle + extra) % 360 + 360) % 360));
        out.addPage(page);
      });
      i = j;
    }
    return out.save();
  },
};

export type PdfApi = typeof api;

Comlink.expose(api);
