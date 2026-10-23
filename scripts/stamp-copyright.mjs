/**
 * Stamp HighAir's copyright metadata into every photo HighAir owns (OWNED_DIRS
 * and OWNED_FILES, minus documented stock)
 * (scripts/lib/copyright-meta.mjs explains what is written and why it is
 * lossless). gen-gallery.mjs runs it after making grid copies; run it by hand
 * after adding photos anywhere else in those folders:
 *   node scripts/stamp-copyright.mjs            stamp
 *   node scripts/stamp-copyright.mjs --verify   stamp, then prove every
 *                                               changed file decodes to the
 *                                               exact same pixels
 * tests/copyright-meta.test.js fails when an owned photo is missing the stamp.
 */
import fs from 'fs';
import path from 'path';
import { OWNED_DIRS, OWNED_FILES, NOT_OURS, imageFormat, stampBuffer, hasStamp } from './lib/copyright-meta.mjs';

/* WebP and JPEG only: AVIF and PNG can't be stamped without re-encoding */
const STAMPABLE = /\.(webp|jpe?g)$/i;

export function ownedImages() {
  const out = [];
  const walk = d => {
    for (const f of fs.readdirSync(d)) {
      const p = path.join(d, f);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (STAMPABLE.test(f)) out.push(p);
    }
  };
  OWNED_DIRS.forEach(d => fs.existsSync(d) && walk(d));
  for (const { dir, match } of OWNED_FILES) {
    for (const f of fs.readdirSync(dir)) if (match.test(f) && STAMPABLE.test(f)) out.push(path.join(dir, f));
  }
  return out.filter(p => !NOT_OURS.test(p)).sort();
}

export function stampOwned({ quiet = false } = {}) {
  let stamped = 0, already = 0, added = 0;
  const refused = [], changed = [];
  for (const file of ownedImages()) {
    const buf = fs.readFileSync(file);
    if (!imageFormat(buf)) { refused.push(`${file}: not a WebP or JPEG`); continue; }
    try {
      const out = stampBuffer(buf);
      if (out.equals(buf)) { already++; continue; }
      fs.writeFileSync(file, out);
      changed.push({ file, before: buf });
      stamped++; added += out.length - buf.length;
    } catch (e) {
      refused.push(`${file}: ${e.message}`);
    }
  }
  if (!quiet || stamped || refused.length) {
    console.log(`[copyright] ${stamped} stamped (+${(added / 1024).toFixed(1)} KB total), ${already} already stamped, ${refused.length} refused`);
    refused.forEach(r => console.log(`  refused ${r}`));
  }
  return { stamped, already, refused, changed };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { changed, refused } = stampOwned();
  if (process.argv.includes('--verify')) {
    const sharp = (await import('sharp')).default;
    let same = 0;
    const diff = [];
    for (const { file, before } of changed) {
      const after = fs.readFileSync(file);
      const [a, b] = await Promise.all([before, after].map(x => sharp(x).raw().toBuffer({ resolveWithObject: true })));
      const ok = a.data.equals(b.data) && a.info.width === b.info.width && a.info.height === b.info.height;
      const meta = await sharp(after).metadata();
      if (ok && meta.exif && meta.xmp && hasStamp(after)) same++;
      else diff.push(file);
    }
    console.log(`[copyright] verify: ${same}/${changed.length} identical pixels with EXIF + XMP present${diff.length ? `; FAILED: ${diff.join(', ')}` : ''}`);
    if (diff.length) process.exitCode = 1;
  }
  if (refused.length) process.exitCode = 1;
}
