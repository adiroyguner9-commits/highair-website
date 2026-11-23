/* The training guide (owner, 20 Nov 2026): /blog/trek-training-guide is the owner's own page
   (src/website/trekTrainingGuide.js, TrekTrainingGuide.jsx) and an ordinary post in blogData.js,
   whose Hebrew text is what search engines and readers without JavaScript get (the static page,
   its FAQ data). These keep the two the same word for word, and pin what the site added. */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { POSTS } from '../src/data/blogData.js';
import { EXPS } from '../src/data/mockData.js';
import GALLERY from '../src/website/galleryManifest.json';
import { BLOG_LANGS } from '../src/website/blogLangs.js';
import {
  GUIDE_SLUG, MARKUP, PHOTOS, ZONES, EX, stairs,
  zonesHtml, mixHtml, typesHtml, hrHtml, weekHtml, exercisesHtml,
} from '../src/website/trekTrainingGuide.js';

const post = POSTS.find(p => p.slug === GUIDE_SLUG);
const css = readFileSync('src/components/web_v2/trekTrainingGuide.css', 'utf8');

/* Everything the page shows: its markup with the blocks its script draws, the counters at their
   final figures, the alt texts and labels, and the one label the CSS draws. */
const page = MARKUP + zonesHtml() + mixHtml() + typesHtml() + hrHtml() + weekHtml() + exercisesHtml();
const counted = page.replace(/<b data-count="(\d+)" data-suf="([^"]*)">[^<]*<\/b>/g, '<b>$1$2</b>');
const attrs = [...page.matchAll(/(?:alt|aria-label)="([^"]*)"/g)].map(m => m[1]);
const cssText = [...css.matchAll(/content:'([^']+)'/g)].map(m => m[1]);
const toText = html => html
  .replace(/<(\/?)(b|i|small|span|a|strong|em)\b[^>]*>/g, '')   // inline: no break
  .replace(/<[^>]+>/g, ' ')                                      // a block: a break
  .replace(/\s+/g, ' ');
const corpus = [toText(counted), ...attrs, ...cssText].join(' | ');

/* A line of the post is pieces of the page joined by " · " */
const lines = b => [b.value, b.title, b.alt, b.caption, b.text, ...(b.items || [])].filter(Boolean);
const missing = blocks => blocks.flatMap(lines).flatMap(s => s.split(' · ')).map(s => s.trim()).filter(s => !corpus.includes(s));

describe('the training guide', () => {
  it('is a guide post with its own page, in Hebrew and English', () => {
    expect(post).toBeTruthy();
    expect(post.customPage).toBe(true);
    expect(post.category).toBe('מדריכים');
    expect(post.headline).toBe('אימונים לטרק ולטיפוס הרים: המדריך המלא להכנה גופנית');
    expect(MARKUP).toContain(`<h1>${post.headline}</h1>`);
    expect(BLOG_LANGS[GUIDE_SLUG]).toEqual(['he', 'en']);
  });

  it('its own route comes before /blog/:slug, and the English site gets the post through BlogPost', () => {
    const main = readFileSync('src/main.jsx', 'utf8');
    const own = main.indexOf('<Route path="/blog/trek-training-guide" element={<TrekTrainingGuide />} />');
    expect(own).toBeGreaterThan(0);
    expect(own).toBeLessThan(main.indexOf('<Route path="/blog/:slug"'));
    const page = readFileSync('src/components/web_v2/TrekTrainingGuide.jsx', 'utf8');
    expect(page).toContain("blogLang(i18n.language) === 'he' ? <Guide /> : <BlogPost slug={GUIDE_SLUG} />");
    expect(page).toContain('return () => {');   // the page's cleanup runs on the way out
    expect(readFileSync('src/components/web_v2/BlogPost.jsx', 'utf8')).toContain('const slug       = fixedSlug || params.slug;');
  });

  it('every line of the post\'s Hebrew text is on the page, word for word', () => {
    expect(missing(post.content)).toEqual([]);
  });

  it('every heading of the page is in the post\'s text', () => {
    const sections = post.content.filter(b => b.type === 'section').map(b => b.value);
    const h2 = [...MARKUP.matchAll(/<h2[^>]*>([^<]+)<\/h2>/g)].map(m => m[1]);
    expect(h2.filter(h => !sections.includes(h))).toEqual([]);
    const subs = post.content.filter(b => b.type === 'subheading').map(b => b.value);
    const h3 = [...(MARKUP + typesHtml() + exercisesHtml()).matchAll(/<h3[^>]*>([^<]+)<\/h3>/g)].map(m => m[1]);
    expect(h3.filter(h => !subs.includes(h))).toEqual([]);
    const all = JSON.stringify(post.content);
    for (const z of ZONES) expect(all, z.n).toContain(z.n);
  });

  it('the FAQ data is the page\'s FAQ, question by question', () => {
    const onPage = [...MARKUP.matchAll(/<details(?: open)?><summary>([^<]+)<\/summary><p>([^<]+)<\/p><\/details>/g)].map(m => [m[1], m[2]]);
    const at = post.content.findIndex(b => b.type === 'section' && b.value === 'שאלות נפוצות');
    const rest = post.content.slice(at + 1);
    const inPost = rest.filter(b => b.type === 'heading').map((b, i) => [b.value, rest[rest.indexOf(b) + 1].value]);
    expect(onPage).toHaveLength(9);
    expect(inPost).toEqual(onPage);
    const en = post.contentEn.slice(post.contentEn.findIndex(b => b.type === 'section' && b.value === 'Frequently asked questions') + 1);
    expect(en.filter(b => b.type === 'heading')).toHaveLength(9);
    expect(post.contentEn.filter(b => b.type === 'section')).toHaveLength(post.content.filter(b => b.type === 'section').length);
  });

  it('links only public trip pages; Mont Blanc (a teaser) is a pill without a link', () => {
    const publicSlugs = new Set(EXPS.filter(e => !e.teaser && e.live !== false).map(e => e.slug));
    const linked = [...MARKUP.matchAll(/href="\/expedition\/([a-z0-9-]+)"/g)].map(m => m[1]);
    expect(linked).toEqual(['peaks-of-balkan', 'elbrus', 'kilimanjaro', 'everest-base-camp', 'island-peak', 'aconcagua', 'manaslu']);
    expect(linked.filter(s => !publicSlugs.has(s))).toEqual([]);
    expect(EXPS.find(e => e.slug === 'mont-blanc')?.teaser, 'Mont Blanc launched: link its pill in MARKUP').toBe(true);
    expect(MARKUP).toContain('<span>מון בלאן</span>');
    expect(MARKUP).toContain('<a class="btn" href="/treks">');
    expect(MARKUP).not.toContain('highair-expeditions.com');
  });

  it('every photo is a trip-gallery photo on the site, with the widths of its two copies', () => {
    const items = Object.fromEntries(Object.values(GALLERY).flat().map(x => [x.src, x]));
    for (const [key, [w, tw]] of Object.entries(PHOTOS)) {
      const src = `/images/gallery/${key}.webp`;
      expect(items[src], src).toBeTruthy();
      expect(items[src].w, src).toBe(w);
      if (tw) expect(items[src].thumb, src).toBe(`/images/gallery/${key.replace('/', '/thumbs/')}.webp`);
      else expect(items[src].thumb, src).toBe(src);
      expect(existsSync(`public${src}`), src).toBe(true);
    }
    const used = [...(MARKUP + zonesHtml()).matchAll(/src="([^"]+)"/g)].map(m => m[1]);
    expect(used).toHaveLength(13);
    for (const s of used) expect(existsSync(`public${s}`), s).toBe(true);
    for (const b of [...post.content, ...post.contentEn].filter(x => x.type === 'image')) {
      expect(PHOTOS[b.src.replace('/images/gallery/', '').replace('.webp', '')], b.src).toBeTruthy();
    }
    expect(post.img).toBe('/images/gallery/kilimanjaro/1.webp');   // the page's own hero photo, the one its static page preloads
  });

  it('only the hero photo loads with the page; the rest wait until the reader is near', () => {
    const imgs = [...(MARKUP + zonesHtml()).matchAll(/<img [^>]*>/g)].map(m => m[0]);
    expect(imgs.filter(i => !i.includes('loading="lazy"'))).toEqual([expect.stringContaining('kilimanjaro/1.webp')]);
    expect(imgs[0]).toContain('fetchpriority="high"');
  });

  it('the stairs calculator starts at the figures the page shows', () => {
    expect(MARKUP).toContain('value="15"');
    expect(MARKUP).toContain('value="8"');
    const r = stairs(15, 8);
    expect(MARKUP).toContain(`<b id="tgVert">${r.vert}</b>`);
    expect(MARKUP).toContain(`<b id="tgSteps">${r.steps}</b>`);
    expect(r.kili).toBe('30% מיום הפסגה בקילימנג׳רו (1,200 מ\')');
    expect(stairs(20, 20).kili).toBe('עליתם יום פסגה שלם בקילימנג׳רו (1,200 מ\') ועוד 0 מ\'');
    expect(stairs(40, 30)).toMatchObject({ vert: '3,600 מ\'', steps: '20,400', pct: 100 });
    expect(EX).toHaveLength(8);
  });

  it('its static page has no blog hero to paint first (the page has none)', async () => {
    const shells = readFileSync('scripts/generate-html-shells.mjs', 'utf8');
    expect(shells).toContain(": { preHero: '', heroKind: '' };");
    expect(shells).toContain('...ownHero(post),');
    const guide = (await import('../src/data/blogData.js')).POSTS.find(p => p.slug === 'trek-training-guide');
    expect(guide.ownText).toBeFalsy();   // its English is BlogPost's: its text must load (src/data/blogContent.js)
  });

  it('house rules: no dashes, no emoji in the text; styles stay on the page', () => {
    const text = JSON.stringify([post.title, post.titleEn, post.headline, post.headlineEn, post.excerpt, post.excerptEn, post.content, post.contentEn]);
    expect(text).not.toMatch(/[\u2013\u2014]/);
    expect(text).not.toMatch(/\p{Extended_Pictographic}/u);
    expect(MARKUP).not.toMatch(/[\u2013\u2014]/);
    const rules = css.replace(/\/\*[\s\S]*?\*\//g, '').split('}').filter(r => r.includes('{'));
    expect(rules.length).toBeGreaterThan(150);
    for (const r of rules) {
      const selectors = r.split('{').slice(-2)[0];   // the rule's own selectors, after any @media (
      for (const s of selectors.split(',')) expect(s.trim(), r).toMatch(/^\.tg\b/);
    }
  });
});
