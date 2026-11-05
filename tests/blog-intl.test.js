/* The magazine on the foreign sites (6 Nov 2026): src/data/blog-intl/<lang>/<slug>.json,
   written for an international reader, loaded by scripts/lib/vite-blog-split.mjs. */
import { describe, it, expect } from 'vitest';
import { readIntl, postLangs, HEBREW_ONLY_POSTS } from '../scripts/lib/vite-blog-split.mjs';
import { POSTS } from '../src/data/blogData.js';
import { BLOG_LANGS } from '../src/website/blogLangs.js';

const intl = readIntl();
const BLOCKS = new Set(['text', 'section', 'image', 'list', 'callout', 'cta', 'subheading', 'heading', 'extlink', 'video']);
const ISRAELI = /[֐-׿]|\bIsrael|Tel Aviv|Ben Gurion|\bshekel|\bNIS\b|\bILS\b|in Hebrew|auf Hebräisch|en hebreo/i;

describe('international blog posts', () => {
  for (const [lng, posts] of Object.entries(intl)) {
    for (const [slug, post] of Object.entries(posts)) {
      it(`${lng}/${slug}: a real post, no Hebrew, nothing written for Israelis`, () => {
        expect(POSTS.some(p => p.slug === slug), 'no such post in blogData.js').toBe(true);
        expect(HEBREW_ONLY_POSTS.has(slug)).toBe(false);
        for (const k of ['title', 'excerpt', 'category']) expect(post[k], k).toBeTruthy();
        expect(post.content.length).toBeGreaterThan(5);
        for (const b of post.content) expect(BLOCKS.has(b.type), b.type).toBe(true);
        expect(JSON.stringify(post)).not.toMatch(ISRAELI);
      });
    }
  }
  it('German and Spanish only where the English adaptation exists too', () => {
    for (const l of ['de', 'es']) for (const slug of Object.keys(intl[l])) expect(intl.en[slug], `${l}/${slug}`).toBeTruthy();
  });
  it('posts about Israel stay on the Hebrew site', () => {
    for (const s of HEBREW_ONLY_POSTS) expect(postLangs(s, intl)).toEqual(['he']);
  });
  it('blogLangs.js is up to date (run scripts/generate-blog-langs.mjs)', () => {
    for (const p of POSTS) expect(BLOG_LANGS[p.slug], p.slug).toEqual(postLangs(p.slug, intl));
  });
});
