/* The per-language trip files (scripts/split-trips.mjs) must match mockData.js,
   and each site gets every field it reads. */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { EXPS as ALL } from '../src/data/mockData.js';

const read = l => JSON.parse(fs.readFileSync(`src/data/trips/${l}.json`, 'utf8'));
const strip = (re) => JSON.parse(JSON.stringify(ALL.map(e => Object.fromEntries(Object.entries(e).filter(([k]) => !re.test(k))))));

describe('trip files per site language', () => {
  it('are up to date with mockData.js (run node scripts/split-trips.mjs)', () => {
    expect(read('base')).toEqual(strip(/(De|Es)$/));
    expect(read('de')).toEqual(strip(/Es$/));
    expect(read('es')).toEqual(strip(/De$/));
  });
  it('base keeps Hebrew and English, drops German and Spanish', () => {
    const k = read('base').find(e => e.slug === 'kilimanjaro');
    expect(k.nameHe).toBeTruthy(); expect(k.nameEn).toBeTruthy();
    expect(Object.keys(k).some(x => /(De|Es)$/.test(x))).toBe(false);
  });
  it('de has German, es has Spanish', () => {
    expect(read('de').find(e => e.slug === 'kilimanjaro').nameDe ?? read('de').find(e => e.slug === 'kilimanjaro').descDe).toBeTruthy();
    expect(Object.keys(read('es').find(e => e.slug === 'kilimanjaro')).some(x => /Es$/.test(x))).toBe(true);
  });
  it('the site picks its file by host', async () => {
    const src = fs.readFileSync('src/data/trips.js', 'utf8');
    expect(src).toContain("sub === 'de' ? import('./trips/de.json')");
    expect(src).toContain("!prod ? import('./mockData.js')");
  });
});
