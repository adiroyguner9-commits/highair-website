import { describe, it, expect } from 'vitest';
import GALLERY from '../src/website/galleryManifest.json';
import { HIDDEN_ABROAD, galleryFor } from '../src/website/galleryAbroad.js';

describe('gallery photos hidden abroad', () => {
  it('every hidden photo exists in the manifest', () => {
    const all = new Set(Object.values(GALLERY).flat().map(x => x.src));
    for (const src of HIDDEN_ABROAD) expect(all.has(src), src).toBe(true);
  });
  it('the Hebrew site keeps every photo', () => {
    for (const list of Object.values(GALLERY)) expect(galleryFor(list, 'he')).toEqual(list);
  });
  it('foreign sites never get a hidden photo', () => {
    for (const lang of ['en', 'de', 'es'])
      for (const list of Object.values(GALLERY))
        expect(galleryFor(list, lang).some(x => HIDDEN_ABROAD.has(x.src))).toBe(false);
  });
});

import { readdirSync, readFileSync } from 'node:fs';
describe('foreign blog articles', () => {
  it('use no photo hidden abroad', () => {
    for (const lang of ['en', 'de', 'es'])
      for (const f of readdirSync(`src/data/blog-intl/${lang}`)) {
        const post = JSON.parse(readFileSync(`src/data/blog-intl/${lang}/${f}`, 'utf8'));
        for (const b of post.content) if (b.src) expect(HIDDEN_ABROAD.has(b.src), `${lang}/${f} ${b.src}`).toBe(false);
      }
  });
});
