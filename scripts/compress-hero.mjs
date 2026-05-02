/**
 * compress-hero.mjs — Hero video optimisation, tuned for THIS source.
 *
 * The source `public/hero.mp4` is 1280×720, 30fps, H.264 (High 10), already
 * encoded efficiently at ~624 kb/s. The biggest win is therefore TRIMMING
 * THE DURATION — the hero plays in a muted loop, so the visitor only ever
 * sees the first ~10–15 seconds before they scroll past it. The full 2-min
 * file is mostly bytes nobody loads.
 *
 * Defaults — tuned for VISIBLE QUALITY first, file size second. The hero
 * is the very first impression on a premium-brand site; visible compression
 * artifacts (banding on the sky, blockiness on snow, blur on motion) are
 * unacceptable. CRF 20 is the sweet spot for "indistinguishable from source"
 * on mountain/outdoor footage. The trim-to-15s gives most of the savings.
 *
 *   - keep native 720p (no upscale)
 *   - cap to 30fps
 *   - drop 10-bit → 8-bit (browser-compatible) yuv420p
 *   - drop audio (the hero is muted anyway)
 *   - trim to first 15 seconds
 *   - CRF 20 + slow preset (visually lossless, ~2-3 MB)
 *
 * Override via env vars:
 *   HERO_TRIM_SECONDS=20 node scripts/compress-hero.mjs   ← longer loop
 *   HERO_CRF=18          node scripts/compress-hero.mjs   ← even higher quality
 *   HERO_CRF=24          node scripts/compress-hero.mjs   ← smaller, slight quality drop
 *   HERO_TRIM_SECONDS=0  node scripts/compress-hero.mjs   ← keep full duration
 *
 * Always re-encodes from the backed-up original, so running it multiple
 * times never compounds compression artifacts.
 */

import fs       from 'fs';
import path     from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.resolve(__dirname, '..');
const SRC       = path.join(ROOT, 'public', 'hero.mp4');
const BACKUP    = path.join(ROOT, 'public', 'hero.original.mp4');
const TMP       = path.join(ROOT, 'public', 'hero.compressed.mp4');

const TRIM_SECONDS = process.env.HERO_TRIM_SECONDS != null
  ? Number(process.env.HERO_TRIM_SECONDS)
  : 15;
const CRF = process.env.HERO_CRF || '20';

if (!fs.existsSync(SRC) && !fs.existsSync(BACKUP)) {
  console.error('hero.mp4 not found at', SRC);
  process.exit(1);
}

// Always back up the very first time we run, then always re-encode FROM the
// backup so a previous bad run never leaks into the next.
if (!fs.existsSync(BACKUP)) {
  console.log('Backing up original → public/hero.original.mp4');
  fs.copyFileSync(SRC, BACKUP);
}
const originalBytes = fs.statSync(BACKUP).size;
console.log(`Source size: ${(originalBytes / 1024 / 1024).toFixed(2)} MB`);
console.log(`Trim:        ${TRIM_SECONDS > 0 ? TRIM_SECONDS + 's' : 'full duration'}`);
console.log(`CRF:         ${CRF}`);

// Build ffmpeg args. Putting -t BEFORE -i would be faster (decode-only-N-secs)
// but slightly less accurate; -t after -i is fine here since the video is
// only a couple of minutes. -movflags +faststart puts the moov atom at the
// front so the browser can begin playback before the file fully downloads.
const args = ['-y', '-i', BACKUP];
if (TRIM_SECONDS > 0) args.push('-t', String(TRIM_SECONDS));
args.push(
  '-vf',        'fps=30',
  '-c:v',       'libx264',
  '-profile:v', 'high',
  '-preset',    'slow',          // takes longer to encode, smaller file at same quality
  '-crf',       String(CRF),
  '-tune',      'film',           // optimised for natural-light footage with motion
  '-pix_fmt',   'yuv420p',
  '-movflags',  '+faststart',
  '-an',
  TMP,
);

console.log('ffmpeg', args.join(' '));
const result = spawnSync(ffmpegInstaller.path, args, { stdio: 'inherit' });
if (result.status !== 0) {
  console.error('ffmpeg failed');
  process.exit(result.status ?? 1);
}

fs.renameSync(TMP, SRC);
const compressedBytes = fs.statSync(SRC).size;
const ratio = (compressedBytes / originalBytes * 100).toFixed(1);
console.log(`✓ Output:    ${(compressedBytes / 1024 / 1024).toFixed(2)} MB (${ratio}% of original)`);
