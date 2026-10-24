/* Lighter 800px copies for photos shown small (PageSpeed, 24 Oct 2026: ~3.3MB
   of oversized images on the homepage). A photo added without re-running
   scripts/gen-image-variants.mjs would silently go back to the full file. */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import VARIANTS from '../src/website/imageVariants.json';
import { srcSetOf, smallOf } from '../src/website/imageVariants.js';

describe('image variants', () => {
  it('every listed copy exists and is narrower than its original', () => {
    for (const [src, v] of Object.entries(VARIANTS)) {
      expect(existsSync(`public${v.s}`), v.s).toBe(true);
      expect(existsSync(`public${src}`), src).toBe(true);
      expect(v.w, src).toBeGreaterThan(v.sw || 800);
    }
  });
  it('the donation slider and the home gallery photos all have a copy', () => {
    for (const dir of ['donation', 'gallery/home']) {
      for (const f of readdirSync(`public/images/${dir}`).filter(x => x.endsWith('.webp'))) {
        expect(VARIANTS[`/images/${dir}/${f}`], `${dir}/${f}: run node scripts/gen-image-variants.mjs`).toBeTruthy();
      }
    }
  });
  it('srcset offers both sizes; an unknown photo falls back to itself', () => {
    const [src, v] = Object.entries(VARIANTS)[0];
    expect(srcSetOf(src)).toBe(`${v.s} ${v.sw || 800}w, ${src} ${v.w}w`);
    expect(srcSetOf('/images/nope.webp')).toBeUndefined();
    expect(smallOf('/images/nope.webp')).toBe('/images/nope.webp');
  });
  it('the components that show these photos use the copies', () => {
    for (const f of ['ImpactSection.jsx', 'GallerySection.jsx', 'BlogPreview.jsx']) {
      expect(readFileSync(`src/components/web_v2/${f}`, 'utf8'), f).toContain('srcSetOf(');
    }
    expect(readFileSync('src/components/web_v2/Blog.jsx', 'utf8')).toContain('smallOf(post.img)');
  });
});
