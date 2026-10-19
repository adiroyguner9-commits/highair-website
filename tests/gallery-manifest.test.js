/* The trip galleries' list (src/website/galleryManifest.json, made by
   scripts/gen-gallery.mjs) must match the folders: a photo added without
   re-running the script would never show, and a removed one would be a broken
   tile. The trip page no longer discovers photos by downloading them. */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = 'public/images/gallery';
const GALLERY = JSON.parse(readFileSync('src/website/galleryManifest.json', 'utf8'));
const onDisk = slug => readdirSync(join(ROOT, slug)).filter(f => /^\d+\.webp$/.test(f) && Number(f.split('.')[0]) <= 50);

describe('the gallery list matches the folders (re-run: node scripts/gen-gallery.mjs)', () => {
  it('every gallery photo on disk is in the list, and nothing else is', () => {
    for (const slug of readdirSync(ROOT).filter(d => statSync(join(ROOT, d)).isDirectory())) {
      const disk = onDisk(slug).map(f => `/images/gallery/${slug}/${f}`).sort();
      const listed = (GALLERY[slug] || []).map(x => x.src).sort();
      expect(listed, slug).toEqual(disk);
    }
  });
  it('every grid copy exists and is lighter than its original', () => {
    for (const items of Object.values(GALLERY)) {
      for (const x of items) {
        expect(existsSync(join('public', x.thumb)), x.thumb).toBe(true);
        if (x.thumb !== x.src) expect(statSync(join('public', x.thumb)).size).toBeLessThan(statSync(join('public', x.src)).size);
      }
    }
  });
  it('landscape photos come first, as the old probe ordered them', () => {
    for (const items of Object.values(GALLERY)) {
      const firstPortrait = items.findIndex(x => x.w < x.h);
      if (firstPortrait >= 0) expect(items.slice(firstPortrait).every(x => x.w < x.h)).toBe(true);
    }
  });
});
