/* German and Spanish safari pages (owner, 6 Nov 2026): every English string
   of the safari content has a translation, and nothing Israeli-only is left in
   the English the foreign sites show. */
import { describe, it, expect } from 'vitest';
import * as SD from '../src/data/safariData.js';
import * as SDD from '../src/data/safariDetailData.js';
import { EXPS } from '../src/data/mockData.js';
import DE from '../src/i18n/safari-de.js';
import ES from '../src/i18n/safari-es.js';
import { TRANSLATE, tr } from '../src/data/safariI18n.js';

const heb = /[֐-׿]/;
function strings(v, out = []) {
  if (typeof v === 'string') { if (!heb.test(v) && /[A-Za-z]{2}/.test(v) && !/^\/|^http|^\[TO FILL/.test(v)) out.push(v); }
  else if (Array.isArray(v)) v.forEach(x => strings(x, out));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { if (/(De|Es)$/.test(k)) continue; if (k.endsWith('En')) strings(x, out); else if (typeof x === 'object') strings(x, out); }
  return out;
}
const english = [
  ...Object.entries({ ...SD, ...SDD }).filter(([k]) => k !== 'SAFARI_COLOR').flatMap(([k, v]) => k.endsWith('_EN') ? strings(v) : strings(v)),
  ...EXPS.filter(e => String(e.slug).startsWith('safari')).flatMap(e => strings(Object.fromEntries(Object.entries(e).filter(([k]) => k.endsWith('En'))))),
];
const NAMES = new Set(['Arusha', 'Karatu', 'Serengeti', 'Tarangire', 'Baobab Mara Luxury Camp', 'Heritage Luxury Tented Camp', 'Kudu Lodge Karatu', 'Farm of Dream Karatu']);

describe('safari translations', () => {
  it('every English safari string has German and Spanish', () => {
    const missing = [...new Set(english)].filter(s => !NAMES.has(s) && !(s in DE && s in ES));
    expect(missing).toEqual([]);
  });
  it('the safari pages get De / Es fields', () => {
    const e = EXPS.find(x => x.slug === 'safari-3-days');
    expect(e.descDe).toBeTruthy(); expect(e.descDe).not.toBe(e.descEn);
    /* Safari content is marked and translated when the German page reads it
       (lang.js loc); the dictionaries load with the de./es. site only. */
    expect(SD.SAFARI_SEASONS[0][TRANSLATE]).toBe(true);
    expect(tr(DE, SD.SAFARI_SEASONS[0].monthEn)).toBe('Januar');
    expect(tr(ES, SD.SAFARI_SEASONS[0].monthEn)).not.toBe(SD.SAFARI_SEASONS[0].monthEn);
    expect(JSON.stringify(tr(DE, SDD.SAFARI_VISA.items.map(i => i.titleEn)))).toContain('Reisepass');
    expect(SDD.SAFARI_VISA.items[0][TRANSLATE]).toBe(true);   // nested items are marked too
  });
  it('the English for abroad speaks to every traveler, not only Israelis', () => {
    expect([...new Set(english)].filter(s => /Israel/.test(s))).toEqual([]);
  });
});

describe('German and Spanish texts load with their own site only', () => {
  it('nothing in the main bundle imports them statically', async () => {
    const fs = await import('fs');
    for (const f of ['src/website/lang.js', 'src/i18n.js', 'src/data/safariI18n.js', 'src/data/safariData.js', 'src/data/safariDetailData.js']) {
      const src = fs.readFileSync(f, 'utf8');
      expect(src, f).not.toMatch(/^import .*(safari-(de|es)|ui-(de|es)|res-(de|es))/m);
    }
  });
  it('main.jsx waits for them on de./es. only', async () => {
    const src = (await import('fs')).readFileSync('src/main.jsx', 'utf8');
    expect(src).toContain("prod ? ['de', 'es'].filter(l => l === i18nInstance.language) : ['de', 'es']");
  });
});

describe('the translate mark', () => {
  it('survives a spread copy (the route map copies its nodes)', () => {
    const node = { ...SDD.SAFARI_MAP_NODES.seronera, day: 1 };
    expect(node[TRANSLATE]).toBe(true);
    expect(Object.keys(node)).not.toContain(String(TRANSLATE));
  });
});
