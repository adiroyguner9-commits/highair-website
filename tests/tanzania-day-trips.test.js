/* The day trips in Tanzania (/blog/tanzania-day-trips, owner, 24 Nov 2026). His feedback the same
   day: "כל האטרקציות צריכות לכלול הסעה, הדרכה, ארוחת צהריים ודמי כניסה, ותעשה שיהיה קולאז׳ של 6
   תמונות בכל טיול", then "בשאר הטיולים תשאיר תמונה אחת פשוט". These pin the four inclusions in
   every trip, in both languages, the Materuni collage of his own six photos (BlogPost.jsx
   'collage'), and one photo each for Chemka and Olpopongi. */
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

  const MATERUNI = [
    ['מפלי מטרוני מבעד לעמק הירוק', 'Materuni Falls seen across the green valley'],
    ['המפל של מטרוני מקרוב', 'Materuni Falls up close'],
    ['הליכה בשביל העפר בכפר מטרוני', 'Walking the dirt path through Materuni village'],
    ['חלקת בננות בכפר', 'A banana grove in the village'],
    ['פולי קפה בשלבים השונים, מהפרי ועד הפול הקלוי', 'Coffee at every stage, from the cherry to the roasted bean'],
    ['קליית פולי הקפה על האש', 'Roasting the coffee beans over the fire'],
  ];

  it('Materuni: one collage of the owner\'s six photos, in his order, and no other photo; Hebrew and English share them', async () => {
    const VARIANTS = JSON.parse(readFileSync('src/website/imageVariants.json', 'utf8'));
    const he = tripBlocks(post.content, TRIPS.he[0]), en = tripBlocks(post.contentEn, TRIPS.en[0]);
    for (const blocks of [he, en]) {
      expect(blocks.filter(b => b.type === 'image')).toEqual([]);
      expect(blocks.filter(b => b.type === 'collage')).toHaveLength(1);
    }
    const images = he.find(b => b.type === 'collage').images;
    expect(en.find(b => b.type === 'collage').images).toBe(images);
    expect(images.map(im => [im.src, im.alt, im.altEn])).toEqual(
      MATERUNI.map(([alt, altEn], j) => [`/images/blog/tanzania-day-trips/materuni-${j + 1}.webp`, alt, altEn]));
    for (const im of images) {
      expect(im.pending, im.src).toBeFalsy();
      expect(existsSync(`public${im.src}`), im.src).toBe(true);
      expect(VARIANTS[im.src]?.s, `${im.src}: run node scripts/gen-image-variants.mjs`).toBeTruthy();
      expect(im.src, 'the cover is not shown twice').not.toBe(post.img);
    }
  });

  it('Chemka and Olpopongi: one photo each, no collage; Olpopongi\'s still to come', () => {
    const [chemkaHe, olpoHe] = [1, 2].map(k => tripBlocks(post.content, TRIPS.he[k]));
    const [chemkaEn, olpoEn] = [1, 2].map(k => tripBlocks(post.contentEn, TRIPS.en[k]));
    for (const blocks of [chemkaHe, olpoHe, chemkaEn, olpoEn]) {
      expect(blocks.filter(b => b.type === 'collage')).toEqual([]);
      expect(blocks.filter(b => b.type === 'image')).toHaveLength(1);
    }
    for (const blocks of [chemkaHe, chemkaEn]) {
      const img = blocks.find(b => b.type === 'image');
      expect(img.src).toBe('/images/blog/tanzania-day-trips/chemka-1.webp');
      expect(img.pending).toBeFalsy();
      expect(img.alt && img.caption).toBeTruthy();
      expect(existsSync(`public${img.src}`)).toBe(true);
    }
    for (const blocks of [olpoHe, olpoEn]) {
      expect(blocks.find(b => b.type === 'image')).toMatchObject({ src: '/images/blog/tanzania-day-trips/olpopongi-1.webp', pending: true });
    }
  });

  it('the stock waterfall is out of the post', () => {
    expect(JSON.stringify([...post.content, ...post.contentEn])).not.toContain('/images/safari/materuni.webp');
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

  it('the summit photo is gone from the Chemka section', () => {
    expect(JSON.stringify([...post.content, ...post.contentEn])).not.toContain('/images/gallery/kilimanjaro/5.webp');
  });

  it('BlogPost draws a collage 3 by 2 on a computer and 2 by 3 on a phone; a photo still to come is an empty frame', () => {
    const src = readFileSync('src/components/web_v2/BlogPost.jsx', 'utf8');
    expect(src).toContain("if (block.type === 'collage') return (");
    expect(src).toContain('gridTemplateColumns: `repeat(${isMobile ? 2 : 3}, minmax(0, 1fr))`');
    expect(src).toContain('if (im.pending || !im.src) return <EmptyPhoto');
    expect(src).toMatch(/\{block\.pending \? \(\s*<EmptyPhoto/);
  });

  it('the static page says nothing for the photo still to come, and keeps the inclusions', () => {
    const html = blogText(post);
    expect(html).not.toContain('tanzania-day-trips/');
    expect(html).not.toContain('<figcaption>כפר המסאי אולפופונגי</figcaption>');
    expect(html).toContain('<figcaption>הבריכה הטבעית של המעיינות החמים בצ׳מקה</figcaption>');
    expect(html).toContain('ארוחת צהריים');
    expect(html).toContain('דמי הכניסה למעיינות');
  });
});
