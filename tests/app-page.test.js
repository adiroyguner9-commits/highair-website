/* The /app page (the store app) and the footer's app block (4 Nov 2026).
   The copy lives in src/data/appData.js; the page, the footer and the static
   shell all read it, so these checks guard the one file. */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { APP_PAGE, APP_STORE_URL, PLAY_STORE_URL, APP_DOWNLOAD_URL, BADGES, APP_QR_SRC, APP_HERO_SCREEN, APP_SCREENS } from '../src/data/appData.js';
import { appText, esc } from '../scripts/lib/text-layer.mjs';

const src = f => readFileSync(f, 'utf8');
const allText = lang => JSON.stringify(APP_PAGE[lang]);

describe('app page data', () => {
  it('points at the real store listings and the smart download link', () => {
    expect(APP_STORE_URL).toBe('https://apps.apple.com/app/id6827936860');
    expect(PLAY_STORE_URL).toBe('https://play.google.com/store/apps/details?id=com.highairexpeditions.app');
    expect(APP_DOWNLOAD_URL).toBe('https://app.highair-expeditions.com/download');
  });

  it('Hebrew and English carry the same sections, with no em dash anywhere', () => {
    for (const lang of ['he', 'en']) {
      const t = APP_PAGE[lang];
      expect(t.features).toHaveLength(6);
      expect(t.steps).toHaveLength(3);
      expect(t.faq.length).toBeLessThanOrEqual(4);
      expect(allText(lang), lang).not.toContain(String.fromCharCode(0x2014));
      for (const f of t.faq) if (f.link) expect(f.a, f.q).toContain(f.link.text);
    }
  });

  it('every badge, the QR code and every screen exists', () => {
    const files = [APP_QR_SRC, APP_HERO_SCREEN, ...APP_SCREENS.map(s => s.src),
      ...Object.values(BADGES).flatMap(b => [b.he.src, b.en.src])];
    for (const f of files) expect(existsSync(`public${f}`), f).toBe(true);
  });
});

describe('app page wiring', () => {
  it('has a route, a static shell, a sitemap entry and a footer link', () => {
    expect(src('src/main.jsx')).toMatch(/<Route path="\/app"\s+element=\{<AppPage \/>\}/);
    expect(src('scripts/generate-html-shells.mjs')).toMatch(/path:\s+'app'/);
    expect(src('scripts/generate-sitemap.mjs')).toContain("path: '/app'");
    expect(src('src/components/web_v2/SiteFooter.jsx')).toContain("href: '/app'");
  });

  it('the shell text carries the whole page, from the data the page renders', () => {
    const t = APP_PAGE.he;
    const html = appText(t, { appStore: APP_STORE_URL, googlePlay: PLAY_STORE_URL });
    expect(html.match(/<h1>/g)).toHaveLength(1);
    for (const s of [t.h1, t.sub, ...t.features.flatMap(f => [f.title, f.text]), ...t.steps.map(s => s.title), ...t.faq.flatMap(f => [f.q, f.a])]) {
      expect(html).toContain(esc(s));
    }
    expect(html).toContain(`href="${esc(APP_STORE_URL)}"`);
    expect(src('src/components/web_v2/AppPage.jsx')).toContain("from '../../data/appData.js'");
  });
});
