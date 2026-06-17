import { describe, it, expect } from 'vitest';
import { parsePageRange, parsePageGroups, chunkPages } from './pageRange';

describe('parsePageRange', () => {
  it('returns all pages (0-based) for empty input', () => {
    expect(parsePageRange('', 3)).toEqual([0, 1, 2]);
    expect(parsePageRange('   ', 3)).toEqual([0, 1, 2]);
  });
  it('parses single pages and converts 1-based → 0-based', () => {
    expect(parsePageRange('1', 5)).toEqual([0]);
    expect(parsePageRange('5', 5)).toEqual([4]);
  });
  it('parses ranges, mixes, sorts, and dedupes', () => {
    expect(parsePageRange('1-3, 5', 10)).toEqual([0, 1, 2, 4]);
    expect(parsePageRange('5, 1-2, 2', 10)).toEqual([0, 1, 4]); // out-of-order + dup
  });
  it('treats an open-ended range as "to the last page"', () => {
    expect(parsePageRange('8-', 10)).toEqual([7, 8, 9]);
  });
  it('returns [] when pageCount <= 0', () => {
    expect(parsePageRange('1-3', 0)).toEqual([]);
  });
  it('throws on out-of-range, reversed, and garbage input', () => {
    expect(() => parsePageRange('0', 5)).toThrow();
    expect(() => parsePageRange('6', 5)).toThrow();
    expect(() => parsePageRange('3-2', 5)).toThrow();
    expect(() => parsePageRange('1-99', 5)).toThrow();
    expect(() => parsePageRange('abc', 5)).toThrow();
  });
});

describe('parsePageGroups', () => {
  it('makes one group per comma part, preserving order', () => {
    expect(parsePageGroups('1-3, 5, 8-', 9)).toEqual([[0, 1, 2], [4], [7, 8]]);
  });
  it('drops duplicates within a group', () => {
    expect(parsePageGroups('1-2', 5)).toEqual([[0, 1]]);
  });
  it('throws on a reversed range', () => {
    expect(() => parsePageGroups('3-1', 5)).toThrow();
  });
  it('throws on empty input (split needs explicit groups)', () => {
    expect(() => parsePageGroups('', 5)).toThrow();
  });
  it('throws on invalid ranges', () => {
    expect(() => parsePageGroups('1-99', 5)).toThrow();
    expect(() => parsePageGroups('nope', 5)).toThrow();
  });
  it('returns [] when pageCount <= 0', () => {
    expect(parsePageGroups('1-2', 0)).toEqual([]);
  });
});

describe('chunkPages', () => {
  it('splits into fixed-size chunks in document order', () => {
    expect(chunkPages(5, 2)).toEqual([[0, 1], [2, 3], [4]]);
    expect(chunkPages(4, 2)).toEqual([[0, 1], [2, 3]]);
  });
  it('handles n >= pageCount as a single chunk', () => {
    expect(chunkPages(3, 10)).toEqual([[0, 1, 2]]);
  });
  it('returns [] when pageCount <= 0', () => {
    expect(chunkPages(0, 3)).toEqual([]);
  });
  it('throws on a non-positive or non-integer chunk size', () => {
    expect(() => chunkPages(5, 0)).toThrow();
    expect(() => chunkPages(5, -1)).toThrow();
    expect(() => chunkPages(5, 1.5)).toThrow();
  });
});
