/* The Everest diary (owner, 23 Nov 2026): /blog/everest-base-camp-gokyo-diary is a post on the
   diaries' design (diary/DiaryPage.jsx, EverestDiary.jsx), its words in src/data/everestDiary.js.
   These hold it to its route, its post, its photos, its map data and its two languages. */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { POSTS } from '../src/data/blogData.js';
import { DIARY_ICONS } from '../src/data/diaryIcons.js';
import {
  EVEREST, EVEREST_SLUG, PHOTO_SIZE, PHOTO_POS, PHOTO_RATIO, CROP_OK, PLACES, MAP_LABELS, ROUTE_POINTS,
  everestImg, everestBlocks, HERO_PHOTO, CTA_PHOTO, TRIP_PATH, GUIDE_PATH,
} from '../src/data/everestDiary.js';
import { BLOG_LANGS } from '../src/website/blogLangs.js';
import VARIANTS from '../src/website/imageVariants.json';
import { EXPS } from '../src/data/mockData.js';
import { blogText, esc } from '../scripts/lib/text-layer.mjs';

const read = p => readFileSync(resolve(__dirname, '..', p), 'utf8');
const strings = v => (typeof v === 'string' ? [v] : Array.isArray(v) ? v.flatMap(strings) : v && typeof v === 'object' ? Object.values(v).flatMap(strings) : []);
const post = POSTS.find(p => p.slug === EVEREST_SLUG);
const { he: HE, en: EN } = EVEREST;

describe('the Everest diary: route and post', () => {
  it('its own route, ranked above /blog/:slug', () => {
    const main = read('src/main.jsx');
    expect(main).toContain("const EverestDiary       = lazy(() => import('./components/web_v2/EverestDiary.jsx'));");
    const own = main.indexOf(`<Route path="/blog/${EVEREST_SLUG}" element={<EverestDiary />} />`);
    expect(own).toBeGreaterThan(-1);
    expect(own).toBeLessThan(main.indexOf('<Route path="/blog/:slug"'));
  });
  it('is one of the newest posts, a news story with its own page and text, in Hebrew and English', () => {
    expect(POSTS.indexOf(post)).toBeLessThan(3);   // among the newest (the day trips guide came after it)
    expect(post).toMatchObject({ customPage: true, ownText: true, heroKind: 'diary-ev', category: 'חדשות' });
    expect(BLOG_LANGS[EVEREST_SLUG]).toEqual(['he', 'en']);
  });
  it('the static page says what the page says, Eli is its author', () => {
    expect(post.headline).toBe(HE.hero.h1);
    expect(post.seoDescription).toBe(HE.description);
    expect(post.img).toBe(everestImg(HERO_PHOTO));
    expect(post.content).toEqual(everestBlocks('he'));
    expect(post.contentEn).toEqual(everestBlocks('en'));
    expect(post.guestAuthor).toEqual({ nameHe: 'אלי יצחק', nameEn: 'Eli Yitzhak' });
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

describe('the Everest diary: two languages, one page', () => {
  it('the English has the Hebrew\'s shape', () => {
    const shape = T => ({
      days: T.days.map(d => [d.d, d.loc, d.sleep, d.max, !!d.star, d.photos.map(p => p[0]), d.facts.map(f => f[0]), d.body.length, !!d.know, !!d.quote]),
      places: Object.keys(T.places),
      tiles: T.glance.tiles.map(t => [t[0], t[1]]),
      peaks: T.glance.peaks.map(p => [p[0], p[2], p[3]]),
      cards: T.cards.items.map(c => c[0]),
      expect: T.expect.items.map(x => x[0]),
      people: T.prologue.group.people.length,
      steps: T.prologue.prep.steps.map(x => x[0]),
      routes: T.prologue.geo.routes.map(r => r[2]),
      marks: T.profile.marks.map(m => [m[0], m[1]]),
      labels: Object.keys(T.map.labels),
      calls: T.vibe.calls.length,
    });
    expect(shape(EN)).toEqual(shape(HE));
    expect(Object.keys(HE.places).sort()).toEqual(Object.keys(PLACES).sort());
  });
  it('every place a day ends in, and every landmark, is on the map', () => {
    for (const d of HE.days) expect(PLACES[d.loc], d.loc).toBeTruthy();
    for (const [, ll] of MAP_LABELS) expect(ll).toHaveLength(2);
    expect(ROUTE_POINTS.length).toBeGreaterThan(20);
  });
  it('every icon the page names is drawn', () => {
    for (const T of [HE, EN]) {
      const names = [...T.days.flatMap(d => d.facts.map(f => f[0])), ...T.glance.tiles.map(t => t[0]), ...T.cards.items.map(c => c[0]),
        ...T.expect.items.map(x => x[0]), ...T.prologue.thanks.map(x => x[0]), ...T.prologue.prep.steps.map(x => x[0]), 'users', 'compass'];
      for (const n of names) expect(DIARY_ICONS[n], n).toBeTruthy();
    }
  });
  it('no dash in either language, no raised maqaf, and the English has no Hebrew left', () => {
    expect(strings(EVEREST).filter(s => /[–—־]/.test(s))).toEqual([]);
    expect(strings(EN).filter(s => /[֐-׿]/.test(s))).toEqual([]);
  });
  it('the component writes no words of its own', () => {
    const code = read('src/components/web_v2/EverestDiary.jsx').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
    expect(code.match(/[֐-׿]+/g)).toBeNull();
  });
});

describe('the Everest diary: photos', () => {
  it('every photo is in public/, with the size the page gives it; focus, proportion and crop lists name only its photos', async () => {
    const ids = [...new Set([HERO_PHOTO, CTA_PHOTO, HE.prologue.letter.photo, HE.prologue.geo.photo, ...HE.days.flatMap(d => d.photos.map(p => p[0]))])];
    expect(Object.keys(PHOTO_SIZE).sort()).toEqual(ids.sort());
    for (const id of ids) {
      const file = resolve(__dirname, '../public', everestImg(id).slice(1));
      expect(existsSync(file), id).toBe(true);
      const { width, height } = await sharp(file).metadata();
      expect([width, height], id).toEqual(PHOTO_SIZE[id]);
      expect(Math.abs(width / height - (PHOTO_RATIO[id] || 1.33)), `${id} proportion`).toBeLessThan(0.06);
    }
    /* most of these photos are 850px or less, and need no lighter copy; the few that do have one
       (gen-image-variants.mjs makes a copy only when it is clearly lighter) */
    expect(ids.filter(id => VARIANTS[everestImg(id)]).length, 'run node scripts/gen-image-variants.mjs').toBeGreaterThanOrEqual(3);
    for (const id of [...Object.keys(PHOTO_POS), ...Object.keys(PHOTO_RATIO), ...CROP_OK]) expect(PHOTO_SIZE[id], id).toBeTruthy();
    expect(PHOTO_POS[HERO_PHOTO]).toBe(post.imgPosition);
  });
});
