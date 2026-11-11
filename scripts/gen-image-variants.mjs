/**
 * Generate 800px-wide copies of the photos the homepage and blog show small.
 *
 * PageSpeed (24 Oct 2026) found ~3.3MB of oversized images on the homepage:
 * the donation slider (1600x2133 shown ~550px wide), the home gallery
 * (1200px shown 373-480px) and the blog images (1200-1800px shown in ~400px
 * cards). The full files stay for the places that need them (blog heroes,
 * the gallery lightbox, retina screens); this writes a lighter copy next to
 * each one, in a w800/ folder, and src/website/imageVariants.json, which
 * srcSetOf() (src/website/imageVariants.js) reads so each browser picks the
 * size it needs. Nothing on screen changes.
 *
 * Re-run after adding or changing one of these photos:
 *   node scripts/gen-image-variants.mjs
 * Press photos keep their metadata (credits); our own photos are re-stamped
 * with the copyright metadata (scripts/stamp-copyright.mjs).
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { stampOwned } from './stamp-copyright.mjs';

const WIDTH = 800;
const DIRS = ['public/images/gallery/home', 'public/images/donation', 'public/images/blog'];
const MANIFEST = 'src/website/imageVariants.json';

/* Blog: the images posts use as their card / hero picture, and the photos INSIDE the posts
   (audit, 11 Nov 2026: a guide weighed 3.2MB on load, ten photos of 460-590KB with no lighter
   copy). The in-post photos are read from every language a post is written in. */
const { POSTS } = await import(path.resolve('src/data/blogData.js'));
const blogCardImages = new Set(POSTS.map(p => p.img).filter(Boolean));
const inPost = new Set();
const takeBlocks = blocks => { for (const b of blocks || []) if (b && b.type === 'image' && typeof b.src === 'string' && b.src.startsWith('/images/')) inPost.add(b.src); };
for (const p of POSTS) { takeBlocks(p.content); takeBlocks(p.contentEn); }
const INTL = 'src/data/blog-intl';
for (const lang of fs.existsSync(INTL) ? fs.readdirSync(INTL) : []) {
  const dir = path.join(INTL, lang);
  if (!fs.statSync(dir).isDirectory()) continue;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) takeBlocks(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).content);
}

const manifest = {};
let saved = 0;
for (const dir of DIRS) {
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(webp|jpe?g)$/i.test(f)) continue;
    const src = '/' + path.posix.join(dir.replace(/^public\//, ''), f);
    if (dir.endsWith('/blog') && !blogCardImages.has(src) && !inPost.has(src)) continue;
    const buf = fs.readFileSync(path.join(dir, f));
    const { width, height } = await sharp(buf).metadata();
    if (width <= WIDTH * 1.2) continue;   // already small: no copy needed
    /* Our own photos get a fresh copyright stamp below (the stamper cannot read
       metadata sharp copies over); a press photo keeps its own credits. */
    const owned = !dir.endsWith('/blog') || /^tomer-bassan-/.test(f);
    const img = sharp(buf).resize({ width: WIDTH, withoutEnlargement: true });
    const out = await (owned ? img : img.keepMetadata()).webp({ quality: 82, effort: 5 }).toBuffer();
    if (out.length >= buf.length * 0.8) continue;   // only when clearly lighter
    const name = f.replace(/\.(jpe?g)$/i, '.webp');
    fs.mkdirSync(path.join(dir, 'w800'), { recursive: true });
    fs.writeFileSync(path.join(dir, 'w800', name), out);
    manifest[src] = { w: width, h: height, s: '/' + path.posix.join(dir.replace(/^public\//, ''), 'w800', name) };
    saved += buf.length - out.length;
  }
}
/* A guide whose cover is an expedition card image (/images/cards/...) already
   has a 760px copy from scripts/gen-card-thumbs.mjs: point at it, no new file. */
/* Every expedition card image too: the detail page's intro photo on the
   foreign sites takes the 760px copy on a phone (PageSpeed, 6 Nov 2026). */
const cardImages = fs.readdirSync('public/images/cards').filter(f => /\.(webp|jpe?g)$/i.test(f)).map(f => `/images/cards/${f}`);
for (const src of new Set([...blogCardImages, ...cardImages])) {
  if (manifest[src] || !src.startsWith('/images/cards/')) continue;
  const thumb = src.replace('/images/cards/', '/images/cards/thumbs/');
  if (!fs.existsSync('public' + thumb) || !fs.existsSync('public' + src)) continue;
  const { width, height } = await sharp(fs.readFileSync('public' + src)).metadata();
  const sw = (await sharp(fs.readFileSync('public' + thumb)).metadata()).width;
  if (sw < width) manifest[src] = { w: width, h: height, s: thumb, sw };
}
/* A trip-gallery photo shown inside a post already has its grid copy from scripts/gen-gallery.mjs
   (1200px on the long side): point at it, no new file. */
const GALLERY = JSON.parse(fs.readFileSync('src/website/galleryManifest.json', 'utf8'));
const gridCopy = Object.fromEntries(Object.values(GALLERY).flat().map(x => [x.src, x]));
for (const src of new Set([...inPost, ...blogCardImages])) {   // a post's cover can be a gallery photo too
  const g = gridCopy[src];
  if (manifest[src] || !g || !g.thumb || g.thumb === src || !fs.existsSync('public' + g.thumb)) continue;
  const sw = (await sharp(fs.readFileSync('public' + g.thumb)).metadata()).width;
  if (sw < g.w) manifest[src] = { w: g.w, h: g.h, s: g.thumb, sw };
}
/* The logo: a 2000x2000 PNG shown at 60-72px in the header and the footer of every page, so
   each visit decoded four million pixels for a 72px circle (audit, 11 Nov 2026). The small copy is
   256px, sharp at 72px on a 3x phone, and lossless: flat colour, so it stays exact. /Logo.png
   itself stays for search engines, emails and anything that links to it by address. */
{
  const LOGO = 'public/Logo.png', OUT = 'public/images/logo-256.webp';
  const { width, height } = await sharp(LOGO).metadata();
  fs.writeFileSync(OUT, await sharp(LOGO).resize({ width: 256, height: 256 }).webp({ lossless: true, effort: 6 }).toBuffer());
  manifest['/Logo.png'] = { w: width, h: height, s: '/images/logo-256.webp', sw: 256 };
}
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
stampOwned({ quiet: true });
console.log(`image variants: ${Object.keys(manifest).length} written, ${(saved / 1024 / 1024).toFixed(1)} MB lighter in total`);
