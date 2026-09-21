/**
 * Generate small card thumbnails from the full-size card images.
 *
 * The homepage and the /israel /treks /climbs landing grids show these images
 * inside ~320-456px cards, but the source files are hero-sized (1400-1600px)
 * because the SAME file doubles as the full-bleed hero on each detail page.
 * Loading a 1400px hero into a 456px card wasted several MB on the homepage.
 *
 * This writes a ~760px copy of every card image into public/images/cards/thumbs/,
 * keeping the original filename and format. The card grids reference the thumb
 * (see cardThumb() in ExpeditionExplorer / IsraelTrips); the detail heroes keep
 * using the full-size original. Re-run after adding or changing a card image:
 *   node scripts/gen-card-thumbs.mjs
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const SRC = 'public/images/cards';
const OUT = 'public/images/cards/thumbs';
const WIDTH = 760;

fs.mkdirSync(OUT, { recursive: true });
const files = fs.readdirSync(SRC)
  .filter(f => /\.(webp|avif|jpe?g|png)$/i.test(f) && !/_original\./i.test(f));

let count = 0, total = 0, skipped = [];
for (const f of files) {
  const src = path.join(SRC, f);
  const buf = fs.readFileSync(src);
  const ext = f.split('.').pop().toLowerCase();
  let meta;
  try { meta = await sharp(buf).metadata(); } catch (e) { skipped.push(f); continue; }
  let pipe = sharp(buf).resize({ width: Math.min(WIDTH, meta.width), withoutEnlargement: true });
  if (ext === 'webp') pipe = pipe.webp({ quality: 78, effort: 5 });
  else if (ext === 'avif') pipe = pipe.avif({ quality: 55, effort: 4 });
  else if (ext === 'png') pipe = pipe.png({ compressionLevel: 9, palette: true });
  else pipe = pipe.jpeg({ quality: 78, mozjpeg: true });
  const out = await pipe.toBuffer();
  fs.writeFileSync(path.join(OUT, f), out);
  count++; total += out.length;
}
console.log(`card thumbs written: ${count} | total ${(total / 1024 / 1024).toFixed(2)}MB`);
if (skipped.length) console.log('skipped (unreadable):', skipped.join(', '));
