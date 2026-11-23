/* The Balkan diary (owner, 23 Nov 2026): /blog/peaks-of-the-balkans-diary is a post with a page
   of its own design (BalkanDiary.jsx), its words in src/data/balkanDiary.js. These hold the page
   to its route, its post, its photos and its two languages. */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { POSTS } from '../src/data/blogData.js';
import { DIARY, DIARY_SLUG, PHOTO_SIZE, ICONS, COUNTRY_COLOR, MAP_STOPS, diaryImg, diaryBlocks, HERO_PHOTO, TRIP_PATH, GUIDE_PATH } from '../src/data/balkanDiary.js';
import { BLOG_LANGS } from '../src/website/blogLangs.js';
import VARIANTS from '../src/website/imageVariants.json';
import { EXPS } from '../src/data/mockData.js';
import { blogText, esc } from '../scripts/lib/text-layer.mjs';

const read = p => readFileSync(resolve(__dirname, '..', p), 'utf8');
const strings = v => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
const post = POSTS.find(p => p.slug === DIARY_SLUG);
const { he: HE, en: EN } = DIARY;

describe('the Balkan diary: route and post', () => {
  it('its own route, ranked above /blog/:slug', () => {
    const main = read('src/main.jsx');
    expect(main).toContain("const BalkanDiary        = lazy(() => import('./components/web_v2/BalkanDiary.jsx'));");
    const own = main.indexOf(`<Route path="/blog/${DIARY_SLUG}" element={<BalkanDiary />} />`);
    expect(own).toBeGreaterThan(-1);
    expect(own).toBeLessThan(main.indexOf('<Route path="/blog/:slug"'));
  });
  it('is the newest post, a news story, in Hebrew and English', () => {
    expect(POSTS[0]).toBe(post);
    expect(post.customPage).toBe(true);
    expect(post.category).toBe('חדשות');
    expect(BLOG_LANGS[DIARY_SLUG]).toEqual(['he', 'en']);
  });
  it('the card and the static page say what the page says', () => {
    expect(post.headline).toBe(HE.hero.h1);
    expect(post.headlineEn).toBe(EN.hero.h1);
    expect(post.excerpt).toBe(HE.hero.sub);
    expect(post.seoDescription).toBe(HE.description);
    expect(post.img).toBe(diaryImg(HERO_PHOTO));
    expect(post.content).toEqual(diaryBlocks('he'));
    expect(post.contentEn).toEqual(diaryBlocks('en'));
    expect(post.guestAuthor).toEqual({ nameHe: 'אלי יצחק', nameEn: 'Eli Yitzhak' });
  });
  it('the static page carries every day, word for word', () => {
    const html = blogText(post);
    expect(html).toContain(`<h1>${esc(HE.hero.h1)}</h1>`);
    for (const d of HE.days) {
      expect(html).toContain(esc(d.title));
      for (const p of d.body) expect(html).toContain(esc(p));
    }
  });
  it('links only pages that exist', () => {
    expect(EXPS.some(e => e.slug === TRIP_PATH.split('/').pop() && !e.teaser && e.live !== false)).toBe(true);
    expect(POSTS.some(p => `/blog/${p.slug}` === GUIDE_PATH)).toBe(true);
  });
});

describe('the Balkan diary: two languages, one page', () => {
  it('the English has the Hebrew\'s shape: the same days, photos, icons and paragraphs', () => {
    const shape = T => ({
      days: T.days.map(d => [d.d, d.country, d.photos.map(p => p[0]), d.facts.map(f => f[0]), d.body.length, !!d.know, !!d.quote]),
      tiles: T.glance.tiles.map(t => [t[0], t[1]]),
      flags: T.glance.triFlags.map(f => [f[0], f[2]]),
      cards: T.cards.items.map(c => c[0]),
      expect: T.expect.items.map(x => x[0]),
      crossings: Object.keys(T.crossings),
      countries: Object.keys(T.countries),
      calls: T.vibe.calls.length,
    });
    expect(shape(EN)).toEqual(shape(HE));
    expect(Object.keys(HE.countries)).toEqual(Object.keys(COUNTRY_COLOR));
    expect(HE.days).toHaveLength(MAP_STOPS.length);
  });
  it('every icon a day, tile, card or line names is drawn', () => {
    for (const T of [HE, EN]) {
      const names = [...T.days.flatMap(d => d.facts.map(f => f[0])), ...T.glance.tiles.map(t => t[0]), ...T.cards.items.map(c => c[0]), ...T.expect.items.map(x => x[0]), 'flag', 'compass'];
      for (const n of names) expect(ICONS[n], n).toBeTruthy();
    }
  });
  it('no dash in either language, and no raised maqaf', () => {
    expect(strings(DIARY).filter(s => /[–—־]/.test(s))).toEqual([]);
  });
  it('the English is English: no Hebrew left in it', () => {
    expect(strings(EN).filter(s => /[֐-׿]/.test(s))).toEqual([]);
  });
  it('the component writes no words of its own: every word comes from balkanDiary.js', () => {
    const code = read('src/components/web_v2/BalkanDiary.jsx').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(code.match(/[֐-׿]+/g)).toBeNull();
  });
});

describe('the Balkan diary: photos and styles', () => {
  it('every photo is in public/, with the size the page gives it, and a light copy when it is large', async () => {
    const ids = [...new Set([HERO_PHOTO, ...HE.days.flatMap(d => d.photos.map(p => p[0]))])];
    expect(Object.keys(PHOTO_SIZE).sort()).toEqual(ids.sort());
    for (const id of ids) {
      const file = resolve(__dirname, '../public', diaryImg(id).slice(1));
      expect(existsSync(file), id).toBe(true);
      const { width, height } = await sharp(file).metadata();
      expect([width, height], id).toEqual(PHOTO_SIZE[id]);
      /* over 1000px: the 800px copy (gen-image-variants.mjs keeps a 960-1000px photo whole when
         the copy would not be clearly lighter) */
      if (width > 1000) expect(VARIANTS[diaryImg(id)]?.s, `${id}: run node scripts/gen-image-variants.mjs`).toBeTruthy();
    }
    for (const f of ['al', 'xk', 'me']) expect(existsSync(resolve(__dirname, `../public/images/blog/balkan-diary/flag-${f}.webp`)), f).toBe(true);
  });
  it('every rule of its stylesheet stays inside the page (.bd)', () => {
    const css = read('src/components/web_v2/balkanDiary.css').replace(/\/\*[\s\S]*?\*\//g, '');
    const selectors = [...css.replace(/@keyframes[^{]*\{(?:[^{}]*\{[^}]*\})*[^}]*\}/g, '').matchAll(/([^{}@]+)\{[^{}]*\}/g)]
      .flatMap(m => m[1].split(',').map(s => s.trim())).filter(Boolean);
    expect(selectors.length).toBeGreaterThan(200);
    expect(selectors.filter(s => !/^\.bd(\b|-|\[)/.test(s))).toEqual([]);
  });
});
