/* The day trips in Tanzania (/blog/tanzania-day-trips, owner, 24 Nov 2026). His feedback the same
   day: "כל האטרקציות צריכות לכלול הסעה, הדרכה, ארוחת צהריים ודמי כניסה, ותעשה שיהיה קולאז׳ של 6
   תמונות בכל טיול". These pin the four inclusions in every trip, in both languages, and the
   collage of six photos in every trip (BlogPost.jsx 'collage', its photos in blogData.js). */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { POSTS } from '../src/data/blogData.js';
import { blogText } from '../scripts/lib/text-layer.mjs';

const post = POSTS.find(p => p.slug === 'tanzania-day-trips');
const TRIPS = {
  he: ['מפלי מטרוני וחוות הקפה', 'המעיינות החמים של צ׳מקה', 'כפר המסאי אולפופונגי'],
  en: ['Materuni Falls and the coffee farm', 'The Chemka Hot Springs', 'The Olpopongi Maasai Village'],
};
/* the blocks of one trip: from its section to the next section */
const tripBlocks = (content, title) => {
  const at = content.findIndex(b => b.type === 'section' && b.value === title);
  const end = content.findIndex((b, k) => k > at && b.type === 'section');
  return at < 0 ? [] : content.slice(at + 1, end);
};
const INCLUDED = {
  he: [/^הסעה מהמלון במושי ובחזרה$/, /^הדרכה של מדריך מקומי/, /^ארוחת צהריים/, /^דמי הכניסה/],
  en: [/^Transfers from the hotel in Moshi and back$/, /^Guiding by a /, /Lunch|lunch/, /entry fee/],
};

describe('tanzania-day-trips', () => {
  it('every trip includes the transfer, a local guide, lunch and the entrance fees, in both languages', () => {
    for (const [lang, content] of [['he', post.content], ['en', post.contentEn]]) {
      for (const title of TRIPS[lang]) {
        const list = tripBlocks(content, title).find(b => b.type === 'list');
        expect(list, `${lang} ${title}`).toBeTruthy();
        for (const re of INCLUDED[lang]) expect(list.items.some(x => re.test(x)), `${lang} ${title}: ${re}`).toBe(true);
      }
    }
  });

  it('Materuni adds the coffee-farm tour; Olpopongi keeps its own guide, a local Maasai guide', () => {
    expect(tripBlocks(post.content, TRIPS.he[0]).find(b => b.type === 'list').items).toContain('סיור בחוות הקפה, קלייה וטעימה');
    expect(tripBlocks(post.content, TRIPS.he[2]).find(b => b.type === 'list').items).toContain('הדרכה של מדריך מקומי בן שבט המסאי');
    expect(tripBlocks(post.contentEn, TRIPS.en[2]).find(b => b.type === 'list').items).toContain('Guiding by a local Maasai guide');
  });

  it('each trip has one collage of six photo slots and no other photo; Hebrew and English share the slots', () => {
    const seen = new Set();
    TRIPS.he.forEach((title, k) => {
      const he = tripBlocks(post.content, title), en = tripBlocks(post.contentEn, TRIPS.en[k]);
      for (const blocks of [he, en]) {
        expect(blocks.filter(b => b.type === 'image'), title).toEqual([]);
        expect(blocks.filter(b => b.type === 'collage'), title).toHaveLength(1);
      }
      const a = he.find(b => b.type === 'collage').images, b = en.find(x => x.type === 'collage').images;
      expect(a).toHaveLength(6);
      expect(b).toBe(a);
      a.forEach((im, j) => {
        /* an empty slot waits at its own path; a filled one may be a photo the site already has */
        if (im.pending) expect(im.src).toBe(`/images/blog/tanzania-day-trips/${im.src.split('/').pop().split('-')[0]}-${j + 1}.webp`);
        expect(seen.has(im.src), im.src).toBe(false);
        expect(im.src, 'the cover is not shown twice').not.toBe(post.img);
        seen.add(im.src);
      });
    });
  });

  it('a filled slot is a real file with its alt text; an empty one is marked pending', () => {
    for (const b of post.content.filter(x => x.type === 'collage')) {
      for (const im of b.images) {
        if (im.pending) continue;
        expect(existsSync(`public${im.src}`), `${im.src}: the photo is not in public/`).toBe(true);
        expect(im.alt && im.altEn, `${im.src}: alt and altEn`).toBeTruthy();
      }
    }
  });

  it('the cover is the Materuni waterfall (owner: "עדיף את מטרוני"), with its phone slice and its share image', async () => {
    expect(post.img).toBe('/images/blog/tanzania-materuni-falls.webp');
    expect(existsSync(`public${post.img}`)).toBe(true);
    const PHONE = JSON.parse(readFileSync('src/website/phoneHeroes.json', 'utf8'));
    expect(existsSync(`public${PHONE.blog[post.img]}`), 'run node scripts/gen-phone-heroes.mjs').toBe(true);
    const { default: sharp } = await import('sharp');
    const og = await sharp(`public${post.ogImg}`).metadata();
    expect([og.width, og.height]).toEqual([1200, 630]);
  });

  it('Materuni slot 1 is the Materuni Falls photo, Chemka slot 1 the owner\'s pool photo', () => {
    const slots = Object.fromEntries(post.content.filter(b => b.type === 'collage').map(b => [b.alt, b.images]));
    expect(slots['מפלי מטרוני וחוות הקפה'][0]).toMatchObject({ src: '/images/safari/materuni.webp', alt: 'מפלי מטרוני', altEn: 'Materuni Falls' });
    expect(slots['המעיינות החמים של צ׳מקה'][0].src).toBe('/images/blog/tanzania-day-trips/chemka-1.webp');
    expect(slots['כפר המסאי אולפופונגי'].every(im => im.pending)).toBe(true);
  });

  it('the summit photo is gone from the Chemka section', () => {
    expect(JSON.stringify([...post.content, ...post.contentEn])).not.toContain('/images/gallery/kilimanjaro/5.webp');
  });

  it('BlogPost draws a collage 3 by 2 on a computer and 2 by 3 on a phone, a pending slot as an empty frame', () => {
    const src = readFileSync('src/components/web_v2/BlogPost.jsx', 'utf8');
    expect(src).toContain("if (block.type === 'collage') return (");
    expect(src).toContain('gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, minmax(0, 1fr))`');
    expect(src).toContain('if (im.pending || !im.src) return (');
  });

  it('the static page skips the empty collage and keeps the inclusions', () => {
    const html = blogText(post);
    expect(html).not.toContain('tanzania-day-trips/');
    expect(html).toContain('ארוחת צהריים');
    expect(html).toContain('דמי הכניסה למעיינות');
  });
});
