/* The trek matching tool, a hidden page at /trek-match (owner, 10 Nov 2026). Its quiz is the
   artifact's own code; these pin what the site added: every trip is one of our expedition pages,
   the lead the Lead Center gets, the page stays hidden, and its styles stay on the page. */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { TRIPS, Q, createQuiz, parsePeaks, ASSETS } from '../src/website/trekMatch.js';
import { EXPS } from '../src/data/mockData.js';

const answer = (quiz, a, lead = {}) => { Object.assign(quiz.A, a); Object.assign(quiz.lead, lead); return quiz; };
const KILI_FAN = { type: 'summit', region: ['af'], mot: 'summit', stay: 'any', cold: 1, fit: 3, alt: 1, tech: 0, days: 12, season: ['w'], budget: 3000, donePick: [], doneText: '' };

describe('every trip is one of our expedition pages', () => {
  it('19 trips, each slug an expedition on the site, each with its photo', () => {
    expect(TRIPS).toHaveLength(19);
    for (const t of TRIPS) {
      expect(EXPS.find(e => e.slug === t.id), t.id).toBeTruthy();
      expect(existsSync(`public${ASSETS}c/${t.id}.webp`), t.id).toBe(true);
    }
  });
  it('12 questions, as on the page', () => {
    expect(Q).toHaveLength(12);
    expect(readFileSync('src/components/web_v2/TrekMatchPage.jsx', 'utf8')).toMatch(/עונים על 12 שאלות/);
  });
  it('every photo and the video the page asks for are on the site', () => {
    const src = readFileSync('src/website/trekMatch.js', 'utf8') + readFileSync('src/components/web_v2/TrekMatchPage.jsx', 'utf8');
    const paths = [...src.matchAll(/["'`(]((?:[cqg])\/[a-z0-9-]+\.webp)/g)].map(m => m[1]).filter(p => !p.includes('$'));
    for (const p of new Set(paths)) expect(existsSync(`public${ASSETS}${p}`), p).toBe(true);
    for (const f of ['logo.png', 'logo-white.png', 'hero-poster.webp']) expect(existsSync(`public${ASSETS}${f}`), f).toBe(true);
    expect(existsSync('public/videos/trek-match-hero.mp4')).toBe(true);
  });
});

describe('the quiz, as the artifact wrote it', () => {
  it('a kosher traveller never gets the regular Kilimanjaro, and does get the kosher one', () => {
    const q = answer(createQuiz(), KILI_FAN, { kosher: true });
    const ids = q.getResults().rs.map(r => r.t.id);
    expect(ids).not.toContain('kilimanjaro');
    expect(ids).toContain('kilimanjaro-kosher');
  });
  it('a mountain already climbed is never recommended', () => {
    const q = answer(createQuiz(), { ...KILI_FAN, donePick: ['kilimanjaro'] });
    q.syncDone();
    expect(q.getResults().rs.map(r => r.t.id)).not.toContain('kilimanjaro');
  });
  it('free text is read: Mont Blanc and Kilimanjaro', () => {
    const p = parsePeaks('מון בלאן, קילימנג׳רו');
    expect(p.ids).toContain('kilimanjaro');
    expect(p.others.map(o => o.alt)).toContain(4808);
  });
});

describe('the lead for the Lead Center', () => {
  const q = answer(createQuiz(), KILI_FAN, { name: 'דנה', phone: '054-6789123', email: 'dana@example.com', with: 'בזוג' });
  const { rs } = q.getResults();
  const nameHe = id => EXPS.find(e => e.slug === id).nameHe;
  const f = q.leadFields(rs, nameHe);
  it('the first recommendation, by the site name the expedition forms send', () => {
    expect(rs.length).toBeGreaterThan(0);
    expect(f.Expedition).toBe(nameHe(rs[0].t.id));
  });
  it('the answers and the three recommendations in the message, the experience apart', () => {
    expect(f.Source).toBe('Trek Match Quiz');
    expect(f.Message).toMatch(/^שאלון התאמה, ההמלצות: 1\. /);
    for (const r of rs) expect(f.Message).toContain(`${r.t.name} (${r.score}%)`);
    expect(f.Message).toMatch(/אזור: אפריקה/);
    expect(f.Message).toMatch(/יוצאים: בזוג/);
    expect(f.Experience).toMatch(/כושר: מטיילים חזקים · גובה מקסימלי: עד 3,500 מ' · ציוד טיפוס: אין/);
    expect(f['Group Size']).toBe(2);
    expect(f.Name).toBe('דנה');
    expect(f.Email).toBe('dana@example.com');
  });
  it('only fields the Website Leads table has (one unknown name loses the whole lead)', () => {
    const api = readFileSync('api/submit-lead.js', 'utf8');
    const known = new Set([...api.match(/const AIRTABLE_FIELDS = new Set\(\[([\s\S]*?)\]\)/)[1].matchAll(/'([^']+)'/g)].map(m => m[1]));
    for (const k of Object.keys(f)) expect(known.has(k), k).toBe(true);
  });
  it('the page sends it the way every form does, with the consent line, and never waits on it', () => {
    const page = readFileSync('src/components/web_v2/TrekMatchPage.jsx', 'utf8');
    expect(page).toMatch(/fetch\('\/api\/submit-lead'/);
    expect(page).toMatch(/\.\.\.getAttribution\(\)/);
    const eng = readFileSync('src/website/trekMatch.js', 'utf8');
    expect(eng).toMatch(/אני מסכימ\/ה למדיניות הפרטיות ולקבלת דיוור שיווקי/);
    expect(eng).toMatch(/if\(!lead\.consent\) return/);
    expect(eng).toMatch(/try\{onLead\(quiz,quiz\.getResults\(\)\.rs\)\}catch/);
  });
});

describe('the page stays hidden, and its styles stay on it', () => {
  it('a route on the Hebrew site only, noindex, served the app shell with X-Robots-Tag', () => {
    const main = readFileSync('src/main.jsx', 'utf8');
    expect(main).toMatch(/<Route path="\/trek-match"\s+element=\{<TrekMatchRoute \/>\} \/>/);
    expect(main).toMatch(/function TrekMatchRoute\(\) \{\s*return i18nInstance\.language !== 'he' \? <Navigate to="\/" replace \/>/);
    expect(readFileSync('src/components/web_v2/TrekMatchPage.jsx', 'utf8')).toMatch(/noIndex: true/);
    const v = JSON.parse(readFileSync('vercel.json', 'utf8'));
    const h = v.headers.find(x => x.source.includes('trek-match'));
    expect(h.headers.find(x => x.key === 'X-Robots-Tag').value).toMatch(/noindex/);
    expect(v.rewrites.find(x => x.source.includes('trek-match')).destination).toBe('/spa.html');
  });
  it('not in the sitemap, the menu or the shells', () => {
    expect(readFileSync('public/sitemap.xml', 'utf8')).not.toMatch(/trek-match/);
    expect(readFileSync('scripts/generate-html-shells.mjs', 'utf8')).not.toMatch(/trek-match/);
    expect(readFileSync('src/components/web_v2/Header.jsx', 'utf8')).not.toMatch(/trek-match/);
  });
  it('every style rule is scoped to the page (.tm), so the cookie banner and the WhatsApp button keep theirs', () => {
    const css = readFileSync('src/components/web_v2/trekMatch.css', 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
    const heads = [];
    const walk = s => { let i = 0; while (i < s.length) { const j = s.indexOf('{', i); if (j < 0) break; const head = s.slice(i, j).trim(); let d = 1, k = j + 1; while (d && k < s.length) { if (s[k] === '{') d++; else if (s[k] === '}') d--; k++; } const body = s.slice(j + 1, k - 1); if (head.startsWith('@media')) walk(body); else if (!head.startsWith('@keyframes')) heads.push(head); i = k; } };
    walk(css);
    expect(heads.length).toBeGreaterThan(150);
    for (const h of heads) for (const sel of h.split(',')) expect(sel.trim().startsWith('.tm'), sel).toBe(true);
    expect(css).not.toMatch(/@font-face|fonts\.googleapis/);
    expect(css).toMatch(/\.tm \[hidden\]/);   // the lightbox and the first "חזרה" hide by the attribute
  });
});
