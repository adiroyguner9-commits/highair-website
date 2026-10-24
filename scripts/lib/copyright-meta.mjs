/**
 * Copyright metadata for HighAir's own photos (owner, 23 Oct 2026).
 *
 * Writes the IPTC fields Google Images shows as "Credit" and "Copyright notice"
 * (XMP: dc:creator, dc:rights, photoshop:Credit, xmpRights:WebStatement) plus
 * EXIF Artist/Copyright, which operating systems show in file info.
 *
 * LOSSLESS on purpose: the image data is never decoded or re-encoded. For WebP
 * the RIFF chunks are rewritten (a simple VP8/VP8L file becomes the extended
 * VP8X layout with EXIF + XMP chunks); for JPEG two APP1 segments are inserted.
 * Re-stamping replaces our previous metadata, so it is safe to run repeatedly.
 * The format is read from the bytes, not the extension (one gallery "webp" is a
 * JPEG).
 */

const CREATOR = 'HighAir Expeditions';
const RIGHTS = '© HighAir Expeditions. All rights reserved.';
const RIGHTS_ASCII = 'Copyright HighAir Expeditions. All rights reserved.';   // EXIF is 7-bit ASCII
const WEB_STATEMENT = 'https://www.highair-expeditions.com/terms';
export const STAMP_MARK = 'HighAir Expeditions';

/* Photos HighAir owns (owner, 23 Oct 2026). Never add press, stock or partner
   images: the stamp is a claim of ownership. Folders are walked recursively;
   OWNED_FILES are single files picked from a mixed folder. */
export const OWNED_DIRS = [
  'public/images/gallery', 'public/images/summit', 'public/images/cards',
  'public/images/og', 'public/images/hero', 'public/images/donation', 'public/images/team',
];
export const OWNED_FILES = [
  { dir: 'public/images/blog', match: /^tomer-bassan-/ },        // the blog is mostly press photos
  { dir: 'public/images/blog/w800', match: /^tomer-bassan-/ },   // its 800px copies (gen-image-variants.mjs)
  { dir: 'public/videos', match: /-poster\.jpg$/ },
  { dir: 'public', match: /^(og-image|hero-poster)\.jpg$/ },
];
/* Unsplash / Pexels stock, not ours to claim:
   - the safari photos and the safari card + hero images (public/images/safari/SOURCES.md);
   - the Sinai gallery, card and hero (a curated Unsplash/Pexels set, 13 Jul 2026),
     stamped by mistake on 23 Oct and restored unstamped on 25 Oct. */
export const NOT_OURS = /safari|sinai/i;

const XMP = Buffer.from(
  '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>' +
  '<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">' +
  '<rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/"' +
  ' xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/">' +
  `<dc:creator><rdf:Seq><rdf:li>${CREATOR}</rdf:li></rdf:Seq></dc:creator>` +
  `<dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${RIGHTS}</rdf:li></rdf:Alt></dc:rights>` +
  `<photoshop:Credit>${CREATOR}</photoshop:Credit>` +
  '<xmpRights:Marked>True</xmpRights:Marked>' +
  `<xmpRights:WebStatement>${WEB_STATEMENT}</xmpRights:WebStatement>` +
  '</rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="r"?>',
  'utf8',
);

/* Minimal little-endian TIFF block: IFD0 with Artist (0x013B) and Copyright (0x8298). */
function tiffBlock() {
  const entries = [[0x013b, CREATOR], [0x8298, RIGHTS_ASCII]].map(([tag, s]) => [tag, Buffer.from(s + '\0', 'ascii')]);
  const ifdSize = 2 + entries.length * 12 + 4;
  let dataOff = 8 + ifdSize;
  const head = Buffer.alloc(8 + ifdSize);
  head.write('II', 0, 'ascii');
  head.writeUInt16LE(42, 2);
  head.writeUInt32LE(8, 4);
  head.writeUInt16LE(entries.length, 8);
  entries.forEach(([tag, val], i) => {
    const o = 10 + i * 12;
    head.writeUInt16LE(tag, o);
    head.writeUInt16LE(2, o + 2);                 // ASCII
    head.writeUInt32LE(val.length, o + 4);
    head.writeUInt32LE(dataOff, o + 8);
    dataOff += val.length;
  });
  head.writeUInt32LE(0, 10 + entries.length * 12); // no next IFD
  return Buffer.concat([head, ...entries.map(e => e[1])]);
}
const TIFF = tiffBlock();

export function imageFormat(buf) {
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg';
  return null;
}

/* ── WebP ── */
function webpChunks(buf) {
  const chunks = [];
  let o = 12;
  while (o + 8 <= buf.length) {
    const id = buf.toString('ascii', o, o + 4);
    const size = buf.readUInt32LE(o + 4);
    if (o + 8 + size > buf.length) throw new Error(`truncated ${id} chunk`);
    chunks.push({ id, data: buf.subarray(o + 8, o + 8 + size) });
    o += 8 + size + (size & 1);
  }
  return chunks;
}
const chunk = (id, data) => {
  const head = Buffer.alloc(8);
  head.write(id, 0, 'ascii');
  head.writeUInt32LE(data.length, 4);
  return Buffer.concat(data.length & 1 ? [head, data, Buffer.alloc(1)] : [head, data]);
};
function canvasOf(chunks) {
  const vp8 = chunks.find(c => c.id === 'VP8 ');
  if (vp8) {
    const d = vp8.data;
    if (d[3] !== 0x9d || d[4] !== 0x01 || d[5] !== 0x2a) throw new Error('bad VP8 start code');
    return { w: d.readUInt16LE(6) & 0x3fff, h: d.readUInt16LE(8) & 0x3fff, alpha: chunks.some(c => c.id === 'ALPH') };
  }
  const vp8l = chunks.find(c => c.id === 'VP8L');
  if (vp8l) {
    const d = vp8l.data;
    if (d[0] !== 0x2f) throw new Error('bad VP8L signature');
    const bits = d.readUInt32LE(1);
    return { w: (bits & 0x3fff) + 1, h: ((bits >> 14) & 0x3fff) + 1, alpha: Boolean((bits >> 28) & 1) };
  }
  throw new Error('no image chunk');
}
/* Tags in a TIFF block's first IFD (both byte orders). */
function ifd0Tags(tiff) {
  const le = tiff.toString('ascii', 0, 2) === 'II';
  const u16 = o => (le ? tiff.readUInt16LE(o) : tiff.readUInt16BE(o));
  const u32 = o => (le ? tiff.readUInt32LE(o) : tiff.readUInt32BE(o));
  const ifd = u32(4);
  const tags = [];
  for (let i = 0, n = u16(ifd); i < n; i++) tags.push(u16(ifd + 2 + i * 12));
  return tags;
}

/* Someone else's metadata is never overwritten. Camera EXIF (orientation,
   device, date) is kept as it is and only our XMP is added next to it. A file
   that already carries XMP, or EXIF naming an artist or a copyright holder, is
   refused and reported: that is a credit that isn't ours to replace. */
function foreignExif(found) {
  if (found.some(f => f.kind === 'xmp' && !f.data.equals(XMP))) throw new Error('has other XMP metadata, not overwritten');
  const exif = found.find(f => f.kind === 'exif' && !f.data.equals(TIFF));
  if (exif && ifd0Tags(exif.data).some(t => t === 0x013b || t === 0x8298)) throw new Error('has an artist/copyright credit, not overwritten');
  return exif || null;                            // camera EXIF to keep, or null
}

function stampWebp(buf) {
  const all = webpChunks(buf);
  const camera = foreignExif(all.filter(c => c.id === 'EXIF' || c.id === 'XMP ').map(c => ({ kind: c.id === 'EXIF' ? 'exif' : 'xmp', data: c.data })));
  // Drop our own previous stamp (and any XMP, already checked to be ours); keep camera EXIF in place
  const chunks = all.filter(c => c.id !== 'XMP ' && !(c.id === 'EXIF' && !camera));
  let vp8x = chunks.find(c => c.id === 'VP8X');
  let body;
  if (vp8x) {
    const d = Buffer.from(vp8x.data);
    d[0] |= 0x08 | 0x04;                          // EXIF + XMP flags
    body = chunks.map(c => (c === vp8x ? chunk('VP8X', d) : chunk(c.id, c.data)));
  } else {
    const { w, h, alpha } = canvasOf(chunks);
    const d = Buffer.alloc(10);
    d[0] = 0x08 | 0x04 | (alpha ? 0x10 : 0);
    d.writeUIntLE(w - 1, 4, 3);
    d.writeUIntLE(h - 1, 7, 3);
    body = [chunk('VP8X', d), ...chunks.map(c => chunk(c.id, c.data))];
  }
  if (!camera) body.push(chunk('EXIF', TIFF));
  body.push(chunk('XMP ', XMP));
  const payload = Buffer.concat(body);
  const head = Buffer.alloc(12);
  head.write('RIFF', 0, 'ascii');
  head.writeUInt32LE(4 + payload.length, 4);
  head.write('WEBP', 8, 'ascii');
  return Buffer.concat([head, payload]);
}

/* ── JPEG ── */
const XMP_NS = Buffer.from('http://ns.adobe.com/xap/1.0/\0', 'ascii');
const EXIF_NS = Buffer.from('Exif\0\0', 'ascii');
const app1 = data => {
  const head = Buffer.from([0xff, 0xe1, 0, 0]);
  head.writeUInt16BE(data.length + 2, 2);
  return Buffer.concat([head, data]);
};
function stampJpeg(buf) {
  const segs = [];
  const found = [];
  let o = 2;
  // Walk the header segments up to the scan, noting any APP1 Exif/XMP
  while (o + 4 <= buf.length && buf[o] === 0xff) {
    const marker = buf[o + 1];
    if (marker === 0xda) break;                   // start of scan: the rest is image data
    const len = buf.readUInt16BE(o + 2);
    const seg = buf.subarray(o, o + 2 + len);
    let kind = null;
    if (marker === 0xe1 && seg.subarray(4, 4 + EXIF_NS.length).equals(EXIF_NS)) kind = 'exif';
    else if (marker === 0xe1 && seg.subarray(4, 4 + XMP_NS.length).equals(XMP_NS)) kind = 'xmp';
    if (kind) found.push({ kind, seg, data: seg.subarray(4 + (kind === 'exif' ? EXIF_NS : XMP_NS).length) });
    segs.push(seg);
    o += 2 + len;
  }
  const camera = foreignExif(found);
  // Remove our previous stamp (any XMP is ours by now); camera EXIF stays where it is
  const keep = segs.filter(seg => !found.some(f => f.seg === seg && (f.kind === 'xmp' || f !== camera)));
  const ours = app1(Buffer.concat([XMP_NS, XMP]));
  if (camera) {
    // our XMP right after the camera EXIF, which keeps its place (and its orientation)
    const at = keep.indexOf(camera.seg) + 1;
    return Buffer.concat([buf.subarray(0, 2), ...keep.slice(0, at), ours, ...keep.slice(at), buf.subarray(o)]);
  }
  // JFIF APP0 must stay first; our APP1s go right after it
  const app0 = keep.length && keep[0][1] === 0xe0 ? [keep.shift()] : [];
  return Buffer.concat([buf.subarray(0, 2), ...app0, app1(Buffer.concat([EXIF_NS, TIFF])), ours, ...keep, buf.subarray(o)]);
}

export function stampBuffer(buf) {
  const fmt = imageFormat(buf);
  if (fmt === 'webp') return stampWebp(buf);
  if (fmt === 'jpeg') return stampJpeg(buf);
  throw new Error('unsupported image format');
}

export const hasStamp = buf => buf.includes(XMP);
