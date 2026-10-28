/**
 * Generate the phone copy of every page's hero image.
 *
 * A phone shows only a slice of each hero: the home poster (1280x720) fills a
 * 90vh upright box, so about a third of its width is on screen, and the trip,
 * list and blog heroes are cropped the same way by background-size: cover. Yet
 * every phone downloaded the whole file, 100-700KB, as the first thing on the
 * page, beside the page's code. On PageSpeed's mobile profile that image was
 * the slowest part of the first screen (28 Oct 2026, real 4G throttling: the
 * Treks hero took 4.8s to arrive; the Kilimanjaro page, whose poster is 19KB,
 * was the only page in the green).
 *
 * For each hero and each kind of box it fills (home, trip, list, blog,
 * backdrop), this writes the part a phone can show: the widest box of that
 * kind on a phone up to 440px wide, around the same focus as the page's
 * background-position, at the original resolution (no phone needs more of
 * these images than the file has). Under each hero's dark overlay the copy is
 * saved at a quality the overlay hides; tests/phone-heroes.test.js measures
 * that. Copies go to public/images/phone/<kind>/, mirroring the source path,
 * and src/website/phoneHeroes.json maps kind -> source -> copy for
 * usePhoneHero() (src/website/phoneHero.js) and the page shells
 * (scripts/generate-html-shells.mjs). A hero whose copy would not be clearly
 * lighter keeps its original.
 *
 * Re-run after adding or changing a hero image, a trip, or a post cover:
 *   node scripts/gen-phone-heroes.mjs
 * A copy of one of our photos gets the copyright stamp (scripts/lib/copyright-meta.mjs);
 * a press or stock photo keeps its own metadata, unstamped.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { stampBuffer, hasStamp } from './lib/copyright-meta.mjs';

const OUT = 'public/images/phone';
const MANIFEST = 'src/website/phoneHeroes.json';

/* The widest box each kind of hero fills on a phone (up to 440px wide, upright),
   as width / height, and the WebP quality its overlay hides. Sizes from the
   components: HeroSection 90vh under a 72% dark overlay, ExpeditionDetail 65dvh
   (min 480px) under 35-65%, WorldExpeditionsPage min 340px under 55-78%,
   BlogPost 300px under 45%, MountainBackdrop the whole screen under a 90-93%
   white wash. 640px is the shortest upright phone screen counted. */
export const PHONE_WIDTH = 440;
export const BOX = {
  home:     { aspect: PHONE_WIDTH / (0.9 * 640), quality: 62 },
  trip:     { aspect: PHONE_WIDTH / 480,         quality: 74 },
  list:     { aspect: PHONE_WIDTH / 340,         quality: 64 },
  blog:     { aspect: PHONE_WIDTH / 300,         quality: 80 },
  backdrop: { aspect: PHONE_WIDTH / 640,         quality: 50 },
};

/* CSS background-position -> [x, y] fractions ('center 40%', 'center top', ...). */
export function parsePos(pos = 'center') {
  const word = { left: 0, center: 0.5, right: 1, top: 0, bottom: 1 };
  const val = t => (t.endsWith('%') ? parseFloat(t) / 100 : word[t] ?? 0.5);
  const [a = 'center', b = 'center'] = String(pos || 'center').trim().split(/\s+/);
  if (a === 'top' || a === 'bottom' || b === 'left' || b === 'right') return [val(b), val(a)];
  return [val(a), val(b)];
}

/* The slice of a W x H image a box of `aspect` shows at background-size: cover,
   placed at the [x, y] focus the way the browser places it. */
export function phoneCrop(W, H, aspect, [x, y]) {
  if (W / H > aspect) { const width = Math.round(H * aspect); return { left: Math.round((W - width) * x), top: 0, width, height: H }; }
  const height = Math.round(W / aspect);
  return { left: 0, top: Math.round((H - height) * y), width: W, height };
}

/* Every hero the site draws: its kind of box and its focus. */
export async function heroUses() {
  const { EXPS } = await import(path.resolve('src/data/mockData.js'));
  const { POSTS } = await import(path.resolve('src/data/blogData.js'));
  const list = [];
  const add = (src, kind, pos) => { if (src && !/^https?:/.test(src)) list.push({ src, kind, pos: pos || 'center' }); };
  add('/videos/hero-home-poster.jpg', 'home');                 // HeroSection POSTER_SRC
  add('/images/mountain-bw-bg.webp', 'backdrop', 'center top'); // MountainBackdrop
  add('/images/cards/annapurna.webp', 'list');                 // WorldExpeditionsPage CONFIG.treks.heroImg
  add('/images/cards/kilimanjaro.webp', 'list');               // WorldExpeditionsPage CONFIG.climbs.heroImg
  for (const e of EXPS) {
    if (!e.slug || e.teaser || e.videoUrl) continue;
    add(e.heroVideo ? e.heroVideo.replace('.mp4', '-poster.jpg') : (e.heroImg || e.img), 'trip');
  }
  for (const p of POSTS) if (p.slug) add(p.img, 'blog', p.imgPosition);
  return list;
}

if (import.meta.url === `file://${path.resolve(process.argv[1])}`) {
  const manifest = Object.fromEntries(Object.keys(BOX).map(k => [k, {}]));
  const seen = new Set();
  let before = 0, after = 0;
  fs.rmSync(OUT, { recursive: true, force: true });
  for (const { src, kind, pos } of await heroUses()) {
    const key = `${kind} ${src} ${pos}`;
    if (seen.has(key)) continue;
    seen.add(key);
    if (src in manifest[kind]) { console.warn(`${kind}: two focus points for ${src}, the first kept`); continue; }
    /* null = no copy, the page keeps the original (listed so the test can tell
       a hero kept whole from one added after the last run) */
    manifest[kind][src] = null;
    const file = 'public' + src;
    if (!fs.existsSync(file)) { console.warn('missing:', src); continue; }
    const buf = fs.readFileSync(file);
    let meta;
    try { meta = await sharp(buf).metadata(); await sharp(buf).resize(8).raw().toBuffer(); }
    catch { console.warn('unreadable, kept whole:', src); continue; }
    const crop = phoneCrop(meta.width, meta.height, BOX[kind].aspect, parsePos(pos));
    const owned = hasStamp(buf);
    const img = sharp(buf).extract(crop);
    let out = await (owned ? img : img.keepMetadata()).webp({ quality: BOX[kind].quality, effort: 6 }).toBuffer();
    if (owned) out = stampBuffer(out);
    if (out.length >= buf.length * 0.8) continue;   // only when clearly lighter
    const dest = path.posix.join('/images/phone', kind, src.replace(/^\/(images\/)?/, '').replace(/\.(jpe?g|webp|avif|png)$/i, '.webp'));
    fs.mkdirSync(path.dirname('public' + dest), { recursive: true });
    fs.writeFileSync('public' + dest, out);
    manifest[kind][src] = dest;
    before += buf.length; after += out.length;
  }
  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
  const n = Object.values(manifest).reduce((s, m) => s + Object.values(m).filter(Boolean).length, 0);
  console.log(`phone heroes: ${n} copies | ${(before / 1024).toFixed(0)}KB -> ${(after / 1024).toFixed(0)}KB`);
}
