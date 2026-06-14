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
