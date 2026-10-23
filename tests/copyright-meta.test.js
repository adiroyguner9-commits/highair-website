/* HighAir's own photos carry copyright metadata (owner, 23 Oct 2026): IPTC
   credit + copyright notice for Google Images, EXIF for file info. A photo
   added without running scripts/gen-gallery.mjs (or stamp-copyright.mjs)
   would go out unmarked. The stamp is lossless and must never overwrite
   someone else's metadata. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { ownedImages } from '../scripts/stamp-copyright.mjs';
import { stampBuffer, hasStamp, imageFormat } from '../scripts/lib/copyright-meta.mjs';

const files = ownedImages();

describe('copyright metadata on owned photos (run: node scripts/gen-gallery.mjs)', () => {
  it('every owned photo is stamped', () => {
    expect(files.length).toBeGreaterThan(500);
    const missing = files.filter(f => !hasStamp(readFileSync(f)));
    expect(missing).toEqual([]);
  });
  it('re-stamping changes nothing', () => {
    for (const f of [files.find(x => /thumbs/.test(x)), files.find(x => imageFormat(readFileSync(x)) === 'jpeg')]) {
      const buf = readFileSync(f);
      expect(stampBuffer(buf).equals(buf), f).toBe(true);
    }
  });
  it("refuses a file that carries someone else's credit", () => {
    const jpeg = readFileSync(files.find(x => imageFormat(readFileSync(x)) === 'jpeg'));
    // EXIF with one IFD0 entry: Copyright (0x8298), ASCII "X"
    const tiff = Buffer.from([0x49, 0x49, 0x2a, 0x00, 0x08, 0, 0, 0, 0x01, 0x00, 0x98, 0x82, 0x02, 0x00, 0x02, 0, 0, 0, 0x58, 0x00, 0, 0, 0, 0, 0, 0]);
    const seg = Buffer.concat([Buffer.from([0xff, 0xe1, 0x00, 2 + 6 + tiff.length]), Buffer.from('Exif\0\0', 'binary'), tiff]);
    const credited = Buffer.concat([jpeg.subarray(0, 2), seg, jpeg.subarray(2)]);
    expect(() => stampBuffer(credited)).toThrow(/credit/);
  });
});
