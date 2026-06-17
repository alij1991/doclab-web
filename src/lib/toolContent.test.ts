import { describe, it, expect } from 'vitest';
import { TOOLS } from './toolContent';

const entries = Object.entries(TOOLS);

describe('toolContent (SEO landing data integrity)', () => {
  it('has the expected tools', () => {
    expect(entries.length).toBeGreaterThanOrEqual(12);
  });

  it('every entry has the required fields populated', () => {
    for (const [key, t] of entries) {
      expect(t.name, key).toBeTruthy();
      expect(t.slug.startsWith('/'), key).toBe(true);
      expect(t.title.length, key).toBeGreaterThan(10);
      expect(t.description.length, key).toBeGreaterThan(50);
      expect(t.h1, key).toBeTruthy();
      expect(t.lead.length, key).toBeGreaterThan(40);
      expect(t.steps.length, key).toBeGreaterThanOrEqual(3);
      expect(t.why.length, key).toBeGreaterThanOrEqual(4);
      expect(t.privacy.length, key).toBeGreaterThan(80);
      expect(t.faqs.length, key).toBeGreaterThanOrEqual(4);
      expect(typeof t.wide, key).toBe('boolean');
    }
  });

  it('slugs are unique', () => {
    const slugs = entries.map(([, t]) => t.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('meta descriptions stay within a sensible length for SERPs (<=170)', () => {
    for (const [key, t] of entries) {
      expect(t.description.length, `${key} description too long`).toBeLessThanOrEqual(170);
    }
  });

  it('steps and faqs are well-formed', () => {
    for (const [key, t] of entries) {
      for (const s of t.steps) { expect(s.name, key).toBeTruthy(); expect(s.text, key).toBeTruthy(); }
      for (const f of t.faqs) { expect(f.q, key).toBeTruthy(); expect(f.a, key).toBeTruthy(); }
    }
  });

  it('related links point at real tool slugs', () => {
    const slugs = new Set(entries.map(([, t]) => t.slug));
    for (const [key, t] of entries) {
      for (const r of t.related) {
        expect(slugs.has(r.href), `${key} → ${r.href}`).toBe(true);
        expect(r.label, key).toBeTruthy();
      }
    }
  });

  it('leads with the privacy/no-upload angle somewhere in the copy', () => {
    for (const [key, t] of entries) {
      const blob = (t.lead + ' ' + t.privacy).toLowerCase();
      expect(/upload|browser|device|private/.test(blob), key).toBe(true);
    }
  });
});
