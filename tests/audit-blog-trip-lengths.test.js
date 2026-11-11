/* The night of 12 Nov 2026: the Kazbek guide said "Our Kilimanjaro expedition
   lasts 9 days, and our Elbrus expedition 8 days, like Kazbek". Elbrus is 10
   days (Kilimanjaro 9, Kazbek 8). Both the Hebrew and the English sentence
   were rewritten to state the three lengths.

   The rule, for the whole magazine: wherever a post says how long one of our
   expeditions lasts, it is that trip's own `days`. */
import { describe, it, expect } from 'vitest';
import { POSTS } from '../src/data/blogData.js';
import { EXPS } from '../src/data/mockData.js';
import { readIntl } from '../scripts/lib/vite-blog-split.mjs';

const INTL = readIntl();
const days = slug => parseInt(EXPS.find(e => e.slug === slug).days, 10);
const flat = content => (content || []).flatMap(b => [b.value, b.text, b.caption, ...(b.items || [])]).filter(x => typeof x === 'string').join('\n');
const post = POSTS.find(p => p.slug === 'kazbek-climbing-guide');

describe('the Kazbek guide: Kazbek, Elbrus or Kilimanjaro', () => {
  it('the trips themselves: Kilimanjaro 9 days, Elbrus 10, Kazbek 8', () => {
    expect([days('kilimanjaro'), days('elbrus'), days('kazbek')]).toEqual([9, 10, 8]);
  });
  it('Hebrew states the three lengths', () => {
    const he = flat(post.content);
    expect(he).toContain(`המשלחת שלנו לקילימנג׳רו נמשכת ${days('kilimanjaro')} ימים, לאלברוס ${days('elbrus')} ימים ולקזבק ${days('kazbek')} ימים.`);
    expect(he).not.toContain('ולאלברוס 8 ימים');
    expect(he).not.toContain('כמו לקזבק');
  });
  it('English states the three lengths', () => {
    const en = flat(post.contentEn);
    expect(en).toContain(`Our Kilimanjaro expedition lasts ${days('kilimanjaro')} days, our Elbrus expedition ${days('elbrus')} days and our Kazbek expedition ${days('kazbek')} days.`);
    expect(en).not.toContain('our Elbrus expedition 8 days');
    expect(en).not.toContain('like Kazbek');
  });
  it('the new sentences carry no dash', () => {
    for (const t of [flat(post.content), flat(post.contentEn)]) {
      const s = t.split('\n').find(x => /לאלברוס 10 ימים|our Elbrus expedition 10 days/.test(x));
      expect(s).toBeTruthy();
      expect(s).not.toMatch(/[—–־]/);
    }
  });
  it('the versions written for the foreign sites give Kilimanjaro 9 and Kazbek 8, and no length for Elbrus', () => {
    const says = {
      en: 'Our Kilimanjaro expedition lasts 9 days and Kazbek 8,',
      de: 'Unsere Kilimandscharo-Expedition dauert 9 Tage, der Kasbek 8,',
      es: 'Nuestra expedición al Kilimanjaro dura 9 días y la del Kazbek 8,',
    };
    for (const [l, sentence] of Object.entries(says)) {
      const t = flat(INTL[l]['kazbek-climbing-guide'].content);
      expect(t, l).toContain(sentence);
      expect(t, l).not.toMatch(/Elbrus[^.]{0,80}\b\d+ (days|Tage|días)\b/);
      expect(t, l).not.toMatch(/Elbrus-Expedition|Elbrus expedition|expedición al Elbrus/);
    }
  });
});

describe('the magazine: an expedition\'s length is the trip\'s own', () => {
  /* The name a post uses for each trip, in the two shapes the guides write:
     "המשלחת שלנו ל<הר> נמשכת N ימים" / "Our <Mountain> expedition lasts N days". */
  const TRIPS = {
    kilimanjaro: ['קילימנג׳רו', 'Kilimanjaro'], elbrus: ['אלברוס', 'Elbrus'], kazbek: ['קזבק', 'Kazbek'],
    aconcagua: ['אקונקגואה', 'Aconcagua'], 'lenin-peak': ['לנין פיק', 'Lenin Peak'], 'lobuche-peak': ['לובוצ׳ה פיק', 'Lobuche Peak'],
    'mera-peak': ['מרה פיק', 'Mera Peak'], 'island-peak': ['איילנד פיק', 'Island Peak'], manaslu: ['מנסלו', 'Manaslu'],
    'ama-dablam': ['אמא דאבלם', 'Ama Dablam'], 'himlung-himal': ['הימלונג', 'Himlung'],
  };
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  it('every "our expedition lasts N days" in every post and language', () => {
    const wrong = [];
    let seen = 0;
    for (const p of POSTS) {
      const texts = { he: flat(p.content), en: flat(p.contentEn), ...Object.fromEntries(['en', 'de', 'es'].filter(l => INTL[l][p.slug]).map(l => [`intl ${l}`, flat(INTL[l][p.slug].content)])) };
      for (const [where, t] of Object.entries(texts)) {
        for (const [slug, [he, en]] of Object.entries(TRIPS)) {
          const rules = [
            new RegExp(`המשלחת (?:שלנו|של HighAir) ל${esc(he)} נמשכת (\\d+) ימים`, 'g'),
            new RegExp(`(?:Our|The HighAir) ${esc(en)} expedition lasts (\\d+) days`, 'g'),
          ];
          for (const r of rules) for (const m of t.matchAll(r)) {
            seen++;
            if (Number(m[1]) !== days(slug)) wrong.push(`${p.slug} (${where}): "${m[0]}", the trip is ${days(slug)} days`);
          }
        }
      }
    }
    expect(wrong).toEqual([]);
    expect(seen, 'the patterns still find sentences to check').toBeGreaterThan(20);
  });
});
