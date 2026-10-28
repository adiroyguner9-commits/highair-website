/* A phone gets the slice of each hero it can show (scripts/gen-phone-heroes.mjs,
   src/website/phoneHero.js, 28 Oct 2026). This checks that every hero has been
   through the script, that each copy really is the slice the page shows and
   looks the same under the page's overlay, and that the page and its shell
   ask for the copy under the same media query. */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import sharp from 'sharp';
import { heroUses, BOX, PHONE_WIDTH, phoneCrop, parsePos } from '../scripts/gen-phone-heroes.mjs';
import { hasStamp } from '../scripts/lib/copyright-meta.mjs';
import { PHONE_MEDIA } from '../src/website/phoneHero.js';

const read = p => readFileSync(resolve(__dirname, '..', p), 'utf8');
const pub = p => resolve(__dirname, '../public', p.replace(/^\//, ''));
const MANIFEST = JSON.parse(read('src/website/phoneHeroes.json'));
const uses = await heroUses();
const copies = uses.filter(u => MANIFEST[u.kind]?.[u.src]);

/* Each hero's overlay, as in its component (tests/pre-hero.test.js ties the
   pre-hero to the same ones): rgb, opacity at the top, at the bottom. */
const OVERLAY = {
  home:     [[10, 8, 24], 0.72, 0.72],
  trip:     [[0, 0, 0], 0.35, 0.65],
  list:     [[10, 8, 24], 0.55, 0.78],
  blog:     [[0, 0, 0], 0.45, 0.45],
  backdrop: [[255, 255, 255], 0.90, 0.93],
};

describe('phone heroes', () => {
  it('every hero has been through the script (re-run it after a new trip, post cover or hero)', () => {
    const missing = uses.filter(u => !(u.src in (MANIFEST[u.kind] || {}))).map(u => `${u.kind} ${u.src}`);
    expect(missing).toEqual([]);
  });

  it('each copy exists and is clearly lighter than the original', () => {
    expect(copies.length).toBeGreaterThan(20);
    for (const { src, kind } of copies) {
      const copy = MANIFEST[kind][src];
      expect(existsSync(pub(copy)), copy).toBe(true);
      expect(readFileSync(pub(copy)).length, copy).toBeLessThan(readFileSync(pub(src)).length * 0.8);
    }
  });

  it('a copy is the slice the phone shows, and looks the same under the overlay (40dB or more)', async () => {
    for (const { src, kind, pos } of copies) {
      const orig = readFileSync(pub(src));
      const { width, height } = await sharp(orig).metadata();
      const crop = phoneCrop(width, height, BOX[kind].aspect, parsePos(pos));
      const copy = sharp(readFileSync(pub(MANIFEST[kind][src])));
      expect((await copy.metadata()).width / (await copy.metadata()).height, src).toBeCloseTo(crop.width / crop.height, 1);
      const a = await sharp(orig).extract(crop).removeAlpha().raw().toBuffer();
      const b = await copy.resize(crop.width, crop.height).removeAlpha().raw().toBuffer();
      const [, top, bottom] = OVERLAY[kind];
      let se = 0;
      for (let y = 0; y < crop.height; y++) {
        const keep = 1 - (top + (bottom - top) * y / (crop.height - 1));   // what the overlay lets through
        for (let i = y * crop.width * 3; i < (y + 1) * crop.width * 3; i++) { const d = keep * (a[i] - b[i]); se += d * d; }
      }
      const psnr = 10 * Math.log10(255 * 255 / (se / a.length));
      expect(psnr, `${kind} ${src}`).toBeGreaterThanOrEqual(40);
    }
  }, 60000);

  it('a copy of our photo carries the copyright stamp, a press or stock photo never does', () => {
    for (const { src, kind } of copies) {
      expect(hasStamp(readFileSync(pub(MANIFEST[kind][src]))), src).toBe(hasStamp(readFileSync(pub(src))));
    }
  });

  it('the boxes and the media query are the same phone width', () => {
    expect(PHONE_MEDIA).toBe(`(max-width: ${PHONE_WIDTH}px)`);
    expect(read('scripts/generate-html-shells.mjs')).toContain(`const PHONE_MEDIA = '${PHONE_MEDIA}';`);
  });

  it('every hero asks for its copy, by its own kind', () => {
    const page = (file, ...needles) => { const s = read(file); for (const n of needles) expect(s, `${file}: ${n}`).toContain(n); };
    page('src/components/web_v2/HeroSection.jsx', "usePhoneHero(POSTER_SRC, 'home')", 'backgroundImage: `url(${poster})`');
    page('src/components/web_v2/ExpeditionDetail.jsx', "exp.heroVideo.replace('.mp4', '-poster.jpg') : (exp?.heroImg || exp?.img), 'trip')", 'poster={heroImage}', 'backgroundImage: `url(${heroImage})`');
    page('src/components/web_v2/WorldExpeditionsPage.jsx', "usePhoneHero(cfg.heroImg, 'list')", 'url(${heroImg}) ${cfg.heroPos}/cover');
    page('src/components/web_v2/BlogPost.jsx', "usePhoneHero(post?.img, 'blog')", 'url(${heroImg}) ${post.imgPosition');
    page('src/components/web_v2/MountainBackdrop.jsx', "usePhoneHero(BACKDROP, 'backdrop')", "const BACKDROP = '/images/mountain-bw-bg.webp'");
    page('src/components/web_v2/HeroSection.jsx', "const POSTER_SRC = '/videos/hero-home-poster.jpg'");
  });

  it('the shells preload the copy on a phone and the original everywhere else', () => {
    const shells = read('scripts/generate-html-shells.mjs');
    expect(shells).toContain('preloadLink(phone, PHONE_MEDIA) + preloadLink(src, `not all and ${PHONE_MEDIA}`)');
    expect(shells).toContain("heroPreload('/videos/hero-home-poster.jpg', 'home')");
    for (const kind of ['trip', 'blog', 'list']) expect(shells).toContain(`heroKind:      '${kind}'`);
    expect(shells).toContain('@media ${PHONE_MEDIA}{#ha-pre .h{background:');
  });
});
