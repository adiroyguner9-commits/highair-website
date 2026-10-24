/* Each page's static shell preloads the image ITS hero paints first, and the
   trip-page video waits for the page to load (scripts/generate-html-shells.mjs,
   ExpeditionDetail.jsx). Measured 24 Oct 2026: every shell had inherited the
   homepage's 131KB poster at high priority, and the Kilimanjaro mp4 (1.8MB)
   downloaded beside the page's code on a phone. */
import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { EXPS } from '../src/data/mockData.js';
import { POSTS } from '../src/data/blogData.js';

const read = p => readFileSync(resolve(__dirname, '..', p), 'utf8');
const pub = p => existsSync(resolve(__dirname, '../public', p.replace(/^\//, '')));
const shells = read('scripts/generate-html-shells.mjs');
const detail = read('src/components/web_v2/ExpeditionDetail.jsx');

describe('hero preload per page', () => {
  it('index.html still has the home preload the shell generator swaps out', () => {
    expect(read('index.html')).toMatch(/<link rel="preload" href="\/videos\/hero-home-poster\.jpg"[^>]*>/);
  });

  it('the shells name the same trip-page poster the page shows', () => {
    const rule = "exp.heroVideo.replace('.mp4', '-poster.jpg')";
    expect(detail).toContain(`poster={${rule}}`);
    expect(shells).toContain(rule);
  });

  it('every trip poster and hero image a shell preloads exists', () => {
    for (const e of EXPS) {
      if (!e.slug || e.teaser || e.videoUrl) continue;
      const img = e.heroVideo ? e.heroVideo.replace('.mp4', '-poster.jpg') : (e.heroImg || e.img);
      if (!img || /^https?:/.test(img)) continue;
      expect(pub(img), `${e.slug}: ${img}`).toBe(true);
    }
    for (const p of POSTS) {
      if (p.slug && p.img && !/^https?:/.test(p.img)) expect(pub(p.img), `${p.slug}: ${p.img}`).toBe(true);
    }
  });

  it('Treks and Climbs preload the hero image their page draws', () => {
    const page = read('src/components/web_v2/WorldExpeditionsPage.jsx');
    for (const type of ['treks', 'climbs']) {
      const inPage = page.match(new RegExp(`${type}: \\{\\s*heroImg:\\s*'([^']+)'`))?.[1];
      const inShell = shells.match(new RegExp(`path:\\s*'${type}',\\s*heroImage:\\s*'([^']+)'`))?.[1];
      expect(inPage, `${type} hero in WorldExpeditionsPage`).toBeTruthy();
      expect(inShell, `${type} hero in the shell`).toBe(inPage);
    }
  });
});

describe('trip-page hero video', () => {
  it('gets its src only after the page has loaded', () => {
    expect(detail).toContain('src={heroVideoOn ? exp.heroVideo : undefined}');
    expect(detail).not.toContain('<source src={exp.heroVideo}');
    expect(detail).toMatch(/addEventListener\('load', start, \{ once: true \}\)/);
  });
});
