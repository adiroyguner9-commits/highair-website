/* The German and Spanish sites (de. / es., 5 Nov 2026): core pages only,
   served from dist/de and dist/es by middleware.js, text from ui-de.json /
   ui-es.json and src/data/tripI18n.js. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { englishShellPath } from '../middleware.js';
import { CORE_PATHS, CORE_TRIPS, PARTIAL_LANGS, LEGAL_PATHS } from '../src/website/sites.js';
import { EXPS } from '../src/data/mockData.js';
import { FAQ_I18N, defaultFaqI18n } from '../src/data/tripI18n.js';
import { APP_PAGE } from '../src/data/appData.js';
import { ABOUT_I18N, TEAM_EN, STORY_EN } from '../src/data/aboutData.js';

const DICT = {
  de: JSON.parse(readFileSync('src/i18n/ui-de.json', 'utf8')),
  es: JSON.parse(readFileSync('src/i18n/ui-es.json', 'utf8')),
};
const HEBREW = /[֐-׿]/;

describe('de. / es. routing', () => {
  it('serves core pages from their own shells', () => {
    for (const l of ['de', 'es']) {
      const host = `${l}.highair-expeditions.com`;
      expect(englishShellPath(host, '/')).toBe(`/${l}/index.html`);
      expect(englishShellPath(host, '/expedition/kilimanjaro')).toBe(`/${l}/expedition/kilimanjaro/index.html`);
      expect(englishShellPath(host, '/expedition/kilimanjaro-kosher/')).toBe(`/${l}/expedition/kilimanjaro-kosher/index.html`);
      expect(englishShellPath(host, '/about')).toBe(`/${l}/about/index.html`);
      expect(englishShellPath(host, '/annual-plan/')).toBe(`/${l}/annual-plan/index.html`);
    }
  });

  it('other pages fall back to the English shell, never the Hebrew one', () => {
    expect(englishShellPath('de.highair-expeditions.com', '/expedition/sinai')).toBe('/en/expedition/sinai/index.html');
    expect(englishShellPath('es.highair-expeditions.com', '/blog')).toBe('/en/blog/index.html');
    expect(englishShellPath('de.highair-expeditions.com', '/api/submit-lead')).toBeNull();
  });

  it('every core page with a shell routes to it', () => {
    for (const p of CORE_PATHS.filter(x => !LEGAL_PATHS.includes(x))) {
      expect(englishShellPath('de.highair-expeditions.com', p), p).toBe(p === '/' ? '/de/index.html' : `/de${p}/index.html`);
    }
  });

  it('each foreign host serves its own sitemap and robots.txt', () => {
    for (const l of ['en', 'de', 'es']) {
      expect(englishShellPath(`${l}.highair-expeditions.com`, '/sitemap.xml')).toBe(`/sitemap-${l}.xml`);
      expect(englishShellPath(`${l}.highair-expeditions.com`, '/robots.txt')).toBe(`/robots-${l}.txt`);
    }
    expect(englishShellPath('www.highair-expeditions.com', '/sitemap.xml')).toBeNull();
  });

  it('German and Spanish are allowed API origins', () => {
    const sec = readFileSync('api/_security.js', 'utf8');
    for (const l of PARTIAL_LANGS) expect(sec).toContain(`'https://${l}.highair-expeditions.com'`);
  });
});

describe('language of each host', () => {
  it('the address decides on the real domain; a stored choice only on previews', async () => {
    const { langForHost } = await import('../src/website/sites.js');
    expect(langForHost('www.highair-expeditions.com', 'de')).toBe('he');
    expect(langForHost('highair-expeditions.com', 'en')).toBe('he');
    expect(langForHost('de.highair-expeditions.com', 'he')).toBe('de');
    expect(langForHost('es.highair-expeditions.com', null)).toBe('es');
    expect(langForHost('en.highair-expeditions.com', 'es')).toBe('en');
    expect(langForHost('highair-website-abc.vercel.app', 'es')).toBe('es');
    expect(langForHost('localhost', null)).toBe('he');
  });
});

describe('German and Spanish text', () => {
  it('every UI string is translated, keeps its placeholders, and has no Hebrew', () => {
    const keys = Object.keys(DICT.de);
    expect(Object.keys(DICT.es).sort()).toEqual(keys.sort());
    for (const l of ['de', 'es']) {
      for (const k of keys) {
        const v = DICT[l][k];
        expect(v, `${l}: ${k}`).toBeTruthy();
        expect(HEBREW.test(v), `${l}: ${k}`).toBe(false);
        for (const ph of k.match(/\{\d\}/g) || []) expect(v, `${l}: ${k}`).toContain(ph);
      }
    }
  });

  it('the core trips have full German and Spanish copy, line for line with English', () => {
    for (const slug of CORE_TRIPS) {
      const e = EXPS.find(x => x.slug === slug);
      for (const S of ['De', 'Es']) {
        for (const k of ['name', 'days', 'seoTitle', 'seoDescription', 'desc']) expect(e[k + S], `${slug} ${k}${S}`).toBeTruthy();
        for (const k of ['included', 'notIncluded', 'itinerary', 'safariItinerary', 'highlights', 'importantToNote']) {
          expect((e[k + S] || []).length, `${slug} ${k}${S}`).toBe((e[k + 'En'] || []).length);
        }
        expect(JSON.stringify([e['included' + S], e['notIncluded' + S], e['itinerary' + S]])).not.toMatch(HEBREW);
        for (const k of ['included', 'notIncluded']) expect(e[k + S] || [], `${slug} ${k}${S}`).not.toContain(undefined);
        e['itinerary' + S].forEach((d, i) => expect(d.title, `${slug} day ${i + 1}`).toBeTruthy());
        expect(e['country' + S], `${slug} country${S}`).toBeTruthy();
        e['itinerary' + S].forEach((d, i) => expect(d.day).toBe(e.itineraryEn[i].day));
      }
    }
  });

  it('trip FAQs, app page and about page exist in both languages', () => {
    for (const l of ['de', 'es']) {
      expect(FAQ_I18N.kilimanjaro[l]).toHaveLength(6);
      for (const s of ['everest-base-camp', 'annapurna', 'peaks-of-balkan', 'aconcagua']) expect(FAQ_I18N[s][l].length, s).toBeGreaterThan(3);
      expect(defaultFaqI18n(l, 12)[1].a).toContain('12');
      expect(APP_PAGE[l].faq).toHaveLength(APP_PAGE.en.faq.length);
      expect(APP_PAGE[l].features).toHaveLength(APP_PAGE.en.features.length);
      expect(ABOUT_I18N[l].team).toHaveLength(TEAM_EN.length);
      expect(ABOUT_I18N[l].story).toHaveLength(STORY_EN.length);
    }
    expect(defaultFaqI18n('en')).toBeNull();
  });
});
