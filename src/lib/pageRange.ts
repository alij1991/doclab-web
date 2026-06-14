/**
 * Parse a human page-range string into sorted, unique, 0-based page indices,
 * validated against `pageCount`. 1-based input (what users type), 0-based output
 * (what pdf-lib wants).
 *
 * Accepts: "1-3, 5, 8-10", open-ended "8-" (to the last page), single pages "5".
 * Empty / whitespace-only input means "all pages".
 * Throws an Error with a friendly message on anything invalid.
 *
 * Pure + dependency-free so it's unit-testable in Node and reusable across tools.
 */
export function parsePageRange(input: string, pageCount: number): number[] {
  const s = (input ?? '').trim();
  if (pageCount <= 0) return [];
  if (s === '') return Array.from({ length: pageCount }, (_, i) => i);

  const out = new Set<number>();
  for (const rawPart of s.split(',')) {
    const part = rawPart.trim();
    if (part === '') continue;

    const range = part.match(/^(\d+)\s*-\s*(\d*)$/);
    if (range) {
      const start = parseInt(range[1]!, 10);
      const end = range[2] === '' ? pageCount : parseInt(range[2]!, 10);
      if (start < 1 || end > pageCount || start > end) {
        throw new Error(`Invalid range "${part}" — the document has ${pageCount} page${pageCount === 1 ? '' : 's'}.`);
      }
      for (let p = start; p <= end; p++) out.add(p - 1);
    } else if (/^\d+$/.test(part)) {
      const p = parseInt(part, 10);
      if (p < 1 || p > pageCount) {
        throw new Error(`Page ${p} is out of range (1–${pageCount}).`);
      }
      out.add(p - 1);
    } else {
      throw new Error(`Couldn't understand "${part}". Use formats like 1-3, 5, 8-.`);
    }
  }

  if (out.size === 0) throw new Error('No pages selected.');
  return [...out].sort((a, b) => a - b);
}

/**
 * Parse a page-range string into GROUPS for splitting — each comma-separated
 * part becomes its own group (output file), preserving the user's order.
 * 1-based input, 0-based output. "1-3, 5, 8-" -> [[0,1,2], [4], [7,8,...]].
 * Within a group, pages keep the order written and duplicates are dropped.
 * Throws a friendly Error on anything invalid. Pure + dependency-free.
 */
export function parsePageGroups(input: string, pageCount: number): number[][] {
  const s = (input ?? '').trim();
  if (pageCount <= 0) return [];
  if (s === '') throw new Error('Enter at least one page range, e.g. 1-3, 4-8.');

  const groups: number[][] = [];
  for (const rawPart of s.split(',')) {
    const part = rawPart.trim();
    if (part === '') continue;

    const seen = new Set<number>();
    const group: number[] = [];
    const push = (p: number) => {
      if (!seen.has(p)) { seen.add(p); group.push(p); }
    };

    const range = part.match(/^(\d+)\s*-\s*(\d*)$/);
    if (range) {
      const start = parseInt(range[1]!, 10);
      const end = range[2] === '' ? pageCount : parseInt(range[2]!, 10);
      if (start < 1 || end > pageCount || start > end) {
        throw new Error(`Invalid range "${part}" — the document has ${pageCount} page${pageCount === 1 ? '' : 's'}.`);
      }
      for (let p = start; p <= end; p++) push(p - 1);
    } else if (/^\d+$/.test(part)) {
      const p = parseInt(part, 10);
      if (p < 1 || p > pageCount) throw new Error(`Page ${p} is out of range (1–${pageCount}).`);
      push(p - 1);
    } else {
      throw new Error(`Couldn't understand "${part}". Use formats like 1-3, 5, 8-.`);
    }
    if (group.length) groups.push(group);
  }

  if (groups.length === 0) throw new Error('No pages selected.');
  return groups;
}

/** Group indices into fixed-size chunks of `n` (in document order). */
export function chunkPages(pageCount: number, n: number): number[][] {
  if (pageCount <= 0) return [];
  if (!Number.isInteger(n) || n < 1) throw new Error('Pages per file must be a whole number ≥ 1.');
  const groups: number[][] = [];
  for (let start = 0; start < pageCount; start += n) {
    const group: number[] = [];
    for (let i = start; i < Math.min(start + n, pageCount); i++) group.push(i);
    groups.push(group);
  }
  return groups;
}
