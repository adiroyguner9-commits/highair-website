/**
 * The trip galleries' list and their grid copies (owner, 19 Oct 2026).
 *
 * ExpeditionDetail used to discover a gallery by loading /images/gallery/<slug>/
 * 1.webp to 50.webp with new Image(): every existing photo was DOWNLOADED in
 * full on page load, just to learn its orientation, before anyone scrolled to
 * the gallery (Kilimanjaro: 3.3 MB, 90% of the page's image weight, plus a
 * request for each missing number). This writes, once:
 *
 *   src/website/galleryManifest.json   { slug: [{ src, thumb, w, h }] },
 *                                       landscape first, then by number (the
 *                                       order the probe produced)
 *   public/images/gallery/<slug>/thumbs/N.webp
 *                                       the grid copy: 1200 px on the long side,
 *                                       sharp at the grid's size on a 3x phone.
 *                                       The lightbox keeps the ORIGINAL file.
 *
 * Re-run after adding, replacing or removing a gallery photo:
 *   node scripts/gen-gallery.mjs
 * tests/gallery-manifest.test.js fails when the folders and the list disagree.
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const ROOT = 'public/images/gallery';
const OUT = 'src/website/galleryManifest.json';
const LONG = 1200;
const MAX_N = 50;   // the probe looked at 1.webp to 50.webp

const manifest = {};
let made = 0, kept = 0, savedKB = 0;
for (const slug of fs.readdirSync(ROOT).sort()) {
  const dir = path.join(ROOT, slug);
  if (!fs.statSync(dir).isDirectory()) continue;
  const items = [];
  for (let n = 1; n <= MAX_N; n++) {
    const file = path.join(dir, `${n}.webp`);
    if (!fs.existsSync(file)) continue;
    const buf = fs.readFileSync(file);
    const { width: w, height: h } = await sharp(buf).metadata();
    const src = `/images/gallery/${slug}/${n}.webp`;
    let thumb = src;
    if (Math.max(w, h) > LONG) {
      const out = await sharp(buf).resize({ width: LONG, height: LONG, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 }).toBuffer();
      /* Only worth a second file when it is clearly lighter. */
      if (out.length < buf.length * 0.85) {
        fs.mkdirSync(path.join(dir, 'thumbs'), { recursive: true });
        fs.writeFileSync(path.join(dir, 'thumbs', `${n}.webp`), out);
        thumb = `/images/gallery/${slug}/thumbs/${n}.webp`;
        made++; savedKB += (buf.length - out.length) / 1024;
      } else kept++;
    } else kept++;
    items.push({ src, thumb, w, h, n });
  }
  if (!items.length) continue;
  items.sort((a, b) => ((a.w >= a.h ? 0 : 1) - (b.w >= b.h ? 0 : 1)) || a.n - b.n);
  manifest[slug] = items.map(({ src, thumb, w, h }) => ({ src, thumb, w, h }));
}
fs.writeFileSync(OUT, JSON.stringify(manifest, null, 1) + '\n');
console.log(`[gallery] ${Object.keys(manifest).length} galleries, ${made} grid copies (${(savedKB / 1024).toFixed(1)} MB lighter in the grid), ${kept} photos already small enough`);
