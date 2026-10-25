/* What a reader without JavaScript gets on each page (scripts/lib/text-layer.mjs):
   GPTBot, ClaudeBot and PerplexityBot read 6 words of the Kilimanjaro page before
   this (24 Oct 2026). The text comes from the same data the React page renders. */
import { describe, it, expect } from 'vitest';
import { EXPS } from '../src/data/mockData.js';
import { POSTS } from '../src/data/blogData.js';
import { FAQ_BY_SLUG } from '../src/data/faqData.js';
import { wrapText, expeditionText, blogText, listingText, blogListText, aboutText, homeText, esc } from '../scripts/lib/text-layer.mjs';
import { STORY_HE, TEAM_HE } from '../src/data/aboutData.js';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const words = html => html.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
const kili = EXPS.find(e => e.slug === 'kilimanjaro');

describe('text layer', () => {
  it('a trip page carries its title, facts, every itinerary day and its FAQ', () => {
    const html = expeditionText(kili, FAQ_BY_SLUG.kilimanjaro.he);
    expect(html).toContain(`<h1>${esc(kili.nameHe)}</h1>`);
    expect(html).toContain(esc(kili.elev));
    for (const d of kili.itinerary) expect(html).toContain(esc(d.title));
    for (const f of FAQ_BY_SLUG.kilimanjaro.he) expect(html).toContain(esc(f.q));
    expect(words(html)).toBeGreaterThan(800);
  });
  it('every live trip page has real text', () => {
    for (const e of EXPS.filter(x => x.slug && !x.teaser)) expect(words(expeditionText(e, [])), e.slug).toBeGreaterThan(150);
  });
  it('a blog post carries its whole body', () => {
    const post = POSTS[0];
    const html = blogText(post);
    expect(html).toContain(`<h1>${esc(post.title)}</h1>`);
    const firstText = post.content.find(b => b.type === 'text');
    expect(html).toContain(esc(firstText.value));
  });
  it('listing and home pages link every trip they list', () => {
    const list = EXPS.filter(e => e.slug && /trek/i.test(e.type || ''));
    const html = listingText({ h1: 'טרקים', sub: 'x', exps: list });
    for (const e of list) expect(html).toContain(`href="/expedition/${e.slug}"`);
    expect(homeText({ description: 'd', exps: EXPS.filter(e => e.slug), posts: POSTS })).toContain(`href="/blog/${POSTS[0].slug}"`);
  });
  it('is escaped, hidden without display:none, and takes no space', () => {
    expect(expeditionText({ nameHe: '<script>x</script>', slug: 's' })).not.toContain('<script>');
    const w = wrapText('<p>x</p>');
    expect(w).toContain('position:absolute');
    expect(w).toContain('clip:rect(0,0,0,0)');
    expect(w).not.toMatch(/display:\s*none|aria-hidden|\shidden[\s>]/);
  });
});

/* The static pages' headings are copied into the shell generator (the React
   pages read them from JSX or i18n.js, which cannot run in the build script).
   If a page's heading changes, the shell must change with it. */
describe('static page headings match the pages', () => {
  const shells = readFileSync(resolve(__dirname, '../scripts/generate-html-shells.mjs'), 'utf8');
  const src = f => readFileSync(resolve(__dirname, '..', f), 'utf8');
  const pairs = [
    ['src/components/web_v2/AboutUs.jsx',     ['הסיפור שלנו', 'מי אנחנו ולמה אנחנו עושים את זה?', 'חן שקד בפסגת הר מנסלו 8163 מ׳ - ההר השמיני בגובהו בעולם', 'הכירו את הצוות שלנו', 'כי כל ילד ראוי לחגוג', 'ילד שנלחם בסרטן לא צריך לוותר על יום ההולדת שלו. כל חודש אנחנו מקבלים משאלות ישירות מהילדים ומוודאים שכל אחד מקבל בדיוק את מה שחלם עליו.']],
    ['src/i18n.js',                            ['המגזין של HighAir', 'מדריכים מלאים לכל היעדים שלנו, וחדשות מעולם טיפוס ההרים והטרקים', 'התכנית השנתית', 'כל הטיולים שלנו - מהתאריך הקרוב ועד סוף העונה']],
    ['src/components/web_v2/ContactPage.jsx', ['דברו איתנו', 'בין אם אתם מתכננים את הפסגה הראשונה שלכם ובין אם העשירית, אנחנו כאן לכל שאלה, גדולה כקטנה.']],
    ['src/components/web_v2/Shop.jsx',        ['החנות שלנו', 'ציוד מוכח בשטח. לכל טרק ולכל מסע.']],
  ];
  it('every copied heading exists in its page and in the shell generator', () => {
    for (const [file, strings] of pairs) for (const s of strings) {
      expect(src(file), `${file}: ${s}`).toContain(s);
      expect(shells, `generator: ${s}`).toContain(`'${s}'`);
    }
  });
  it('the blog index lists every post', () => {
    const html = blogListText({ h1: 'h', sub: 's', posts: [{ slug: 'a', title: 'A', excerpt: 'x' }, { slug: 'b', title: 'B' }] });
    expect(html).toContain('<h1>h</h1>');
    expect(html).toContain('<a href="/blog/a">A</a>: x');
    expect(html).toContain('<a href="/blog/b">B</a></li>');
  });
});

describe('about page text', () => {
  const html = aboutText({ h1: 'הסיפור שלנו', story: STORY_HE, sign: 'a\nb', teamTitle: 'הצוות', team: TEAM_HE, givingTitle: 'g', givingText: 'gt' });
  it('carries the whole story and every team member, from the data the page renders', () => {
    expect(html.match(/<h1>/g)).toHaveLength(1);
    for (const para of STORY_HE) expect(html).toContain(esc(para));
    for (const m of TEAM_HE) { expect(html).toContain(esc(m.name)); expect(html).toContain(esc(m.bio)); }
    expect(html).toContain('<p>a b</p>');
  });
  it('AboutUs.jsx reads the story and team from the data file', () => {
    const page = readFileSync(resolve(__dirname, '../src/components/web_v2/AboutUs.jsx'), 'utf8');
    expect(page).toContain("from '../../data/aboutData.js'");
    expect(page).not.toMatch(/const (STORY_HE|TEAM_HE) =/);
  });
});
