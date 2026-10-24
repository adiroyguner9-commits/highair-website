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

/* Blog: only the images posts use as their card / hero picture. */
const { POSTS } = await import(path.resolve('src/data/blogData.js'));
const blogCardImages = new Set(POSTS.map(p => p.img).filter(Boolean));

const manifest = {};
let saved = 0;
for (const dir of DIRS) {
  for (const f of fs.readdirSync(dir)) {
    if (!/\.(webp|jpe?g)$/i.test(f)) continue;
    const src = '/' + path.posix.join(dir.replace(/^public\//, ''), f);
    if (dir.endsWith('/blog') && !blogCardImages.has(src)) continue;
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
fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 1) + '\n');
stampOwned({ quiet: true });
console.log(`image variants: ${Object.keys(manifest).length} written, ${(saved / 1024 / 1024).toFixed(1)} MB lighter in total`);
