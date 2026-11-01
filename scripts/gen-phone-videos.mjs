/**
 * The phone copies of the trip hero videos (owner, 1 Nov 2026).
 *
 * A phone shows a trip hero 65% of the screen high, about 3:4, so more than half
 * of each frame is cut off the sides and still downloaded (Kilimanjaro: 1.8MB on
 * a page of 4.8MB). This writes the middle 3:4 of the first 14 seconds, same
 * height, so object-fit: cover draws the same picture at the same scale and it
 * still lines up with the poster:
 *
 *   public/videos/phone/<name>.mp4   no sound, fast start
 *   src/website/phoneVideos.json     { '/videos/<name>.mp4': '/videos/phone/<name>.mp4' }
 *
 * Re-run after adding or replacing a trip hero video:
 *   node scripts/gen-phone-videos.mjs
 * tests/phone-videos.test.js fails when a trip video has no phone copy.
 */
import { execFileSync } from 'child_process';
import fs from 'fs';
import ffmpeg from '@ffmpeg-installer/ffmpeg';
import { EXPS } from '../src/data/mockData.js';

const OUT = 'public/videos/phone';
const SECONDS = '14';
const CRF = '30';

fs.mkdirSync(OUT, { recursive: true });
const videos = [...new Set(EXPS.map(e => e.heroVideo).filter(Boolean))].sort();
const manifest = {};
for (const src of videos) {
  const name = src.split('/').pop();
  const from = `public${src}`;
  const to = `${OUT}/${name}`;
  execFileSync(ffmpeg.path, ['-y', '-loglevel', 'error', '-i', from, '-t', SECONDS,
    '-vf', 'crop=trunc(ih*3/8)*2:ih,scale=-2:540',
    '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'veryslow', '-crf', CRF,
    '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', to]);
  manifest[src] = `/videos/phone/${name}`;
  console.log(`${name}: ${Math.round(fs.statSync(from).size / 1024)}KB -> ${Math.round(fs.statSync(to).size / 1024)}KB`);
}
fs.writeFileSync('src/website/phoneVideos.json', `${JSON.stringify(manifest, null, 1)}\n`);
