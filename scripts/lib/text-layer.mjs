/* text-layer.mjs: each static shell's page TEXT, for readers that do not run
   JavaScript.

   The site renders in the browser. Measured 24 Oct 2026: GPTBot, ClaudeBot and
   PerplexityBot fetching /expedition/kilimanjaro got the title, one JSON-LD
   block and 6 visible words. AI answer engines had nothing to read or cite.
   Google renders the JavaScript and was fine; nobody else was.

   So every shell now carries the page's own text as plain semantic HTML
   (h1, h2, p, ul) inside #root, built from the SAME data files the React page
   renders: mockData, faqData, blogData. Nothing here is written for robots and
   nothing differs from what a visitor reads. It is visually hidden with the
   standard screen-reader-only pattern (not display:none, which many text
   extractors skip), takes no space, and React replaces it on its first render,
   so no visitor ever sees it and nothing on screen moves.

   Pure functions only: generate-html-shells.mjs does the file writing, and
   tests/text-layer.test.js checks the output. */

export const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const p  = s => (s ? `<p>${esc(s)}</p>` : '');
const h2 = s => (s ? `<h2>${esc(s)}</h2>` : '');
const ul = items => {
  const li = (items || []).filter(Boolean).map(x => `<li>${esc(typeof x === 'string' ? x : (x.text || x.value || ''))}</li>`).join('');
  return li ? `<ul>${li}</ul>` : '';
};

/* Off-screen but present: the sr-only pattern. Absolute, so it never takes
   space next to the pre-hero (#ha-pre) or shifts anything. */
export function wrapText(inner) {
  if (!inner) return '';
  return '<div id="ha-text" style="position:absolute;width:1px;height:1px;margin:-1px;padding:0;'
    + 'overflow:hidden;clip:rect(0,0,0,0);white-space:normal;border:0">' + inner + '</div>';
}

const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;

/* A trip page, in the order the page shows it. faq = the list the page uses
   (FAQ_BY_SLUG[slug].he, else makeDefaultFaq). */
export function expeditionText(exp, faq = []) {
  if (!exp) return '';
  const facts = [
    exp.countryHe && `מדינה: ${exp.countryHe}`,
    exp.elev && `גובה הפסגה: ${exp.elev}`,
    exp.days && `משך: ${exp.days}`,
    exp.diffHe && `רמת קושי: ${exp.diffHe}`,
    exp.priceStr && `מחיר: החל מ-${exp.priceStr}`,
    Number.isFinite(exp.successRate) && `אחוזי הצלחה: ${exp.successRate}%`,
    exp.seasons?.length && `עונות מומלצות: ${exp.seasons.join(', ')}`,
  ].filter(Boolean);
  const days = (exp.itinerary || []).map(d =>
    `<h3>${esc(`יום ${d.day}: ${d.title || ''}`)}</h3>${p(d.desc)}${d.accommodation ? p(`לינה: ${d.accommodation}`) : ''}`).join('');
  const safari = (exp.safariItinerary || []).map(d =>
    `<h3>${esc(`ספארי, יום ${d.day}: ${d.title || ''}`)}</h3>${p(d.desc)}`).join('');
  const qa = (faq || []).filter(f => f?.q && f?.a).map(f => `<h3>${esc(f.q)}</h3>${p(f.a)}`).join('');
  const reviews = (exp.reviews || []).map(r => `<blockquote>${p(r.text)}<p>${esc(r.name)}${r.date ? `, ${esc(r.date)}` : ''}</p></blockquote>`).join('');
  return '<article>'
    + `<h1>${esc(exp.nameHe || exp.name)}</h1>`
    + p(exp.tagline) + p(exp.desc)
    + (facts.length ? h2('פרטי המסע') + ul(facts) : '')
    + (exp.highlights?.length ? h2('נקודות שיא') + ul(exp.highlights) : '')
    + (days ? h2('תוכנית המסע יום אחר יום') + days : '')
    + (safari ? h2('תוכנית הספארי') + safari : '')
    + (exp.included?.length ? h2('מה כלול') + ul(exp.included) : '')
    + (exp.notIncluded?.length ? h2('מה לא כלול') + ul(exp.notIncluded) : '')
    + (exp.safety?.length ? h2('בטיחות') + ul(exp.safety) : '')
    + (exp.importantToNote?.length ? h2('חשוב לדעת') + ul(exp.importantToNote) : '')
    + (qa ? h2('שאלות נפוצות') + qa : '')
    + (reviews ? h2('מה אומרים המטיילים') + reviews : '')
    + `<p>${link(`/book/${exp.slug}`, 'לתיאום שיחת ייעוץ על המסע')}</p>`
    + '</article>';
}

/* A blog post, block by block, as BlogPost.jsx renders them. */
export function blogText(post) {
  if (!post) return '';
  const blocks = (post.content || []).map(b => {
    switch (b.type) {
      case 'text':       return p(b.value);
      case 'section':    return h2(b.value);
      case 'heading':    return `<h3>${esc(b.value)}</h3>`;
      case 'subheading': return `<h3>${esc(b.value)}</h3>`;
      case 'list':       return ul(b.items);
      case 'callout':    return `<aside>${b.title ? `<p><strong>${esc(b.title)}</strong></p>` : ''}${p(b.value)}${ul(b.items)}</aside>`;
      case 'image':      return b.caption || b.alt ? `<figure><figcaption>${esc(b.caption || b.alt)}</figcaption></figure>` : '';
      case 'cta':        return b.href ? `<p>${link(b.href, b.text || b.href)}</p>` : '';
      case 'extlink':    return b.href ? `<p>${link(b.href, b.text || b.title || b.href)}</p>` : '';
      default:           return '';
    }
  }).join('');
  return '<article>'
    + `<h1>${esc(post.title)}</h1>`
    + (post.dateHe || post.author ? p([post.author, post.dateHe].filter(Boolean).join(', ')) : '')
    + p(post.excerpt)
    + blocks
    + '</article>';
}

/* A listing page (/treks, /climbs): what it is, then every trip with its facts. */
export function listingText({ h1, sub, exps = [] }) {
  const items = exps.map(e => `<li>${link(`/expedition/${e.slug}`, e.nameHe || e.name)}`
    + `${[e.countryHe, e.elev, e.days, e.priceStr && `החל מ-${e.priceStr}`].filter(Boolean).map(x => `, ${esc(x)}`).join('')}</li>`).join('');
  return `<article><h1>${esc(h1)}</h1>${p(sub)}${items ? `<ul>${items}</ul>` : ''}</article>`;
}

/* The homepage: who we are, every trip, and the guides. */
export function homeText({ description, exps = [], posts = [] }) {
  const group = (title, list) => list.length ? h2(title) + `<ul>${list.map(e =>
    `<li>${link(`/expedition/${e.slug}`, e.nameHe || e.name)}${[e.countryHe, e.elev, e.days].filter(Boolean).map(x => `, ${esc(x)}`).join('')}</li>`).join('')}</ul>` : '';
  const guides = posts.length ? h2('מדריכים וכתבות') + `<ul>${posts.map(x => `<li>${link(`/blog/${x.slug}`, x.title)}</li>`).join('')}</ul>` : '';
  return '<article><h1>HighAir Expeditions</h1>' + p(description)
    + group('טיפוסי הרים', exps.filter(e => /climb/i.test(e.type || '')))
    + group('טרקים', exps.filter(e => /trek/i.test(e.type || '')))
    + group('ספארי', exps.filter(e => /safari/i.test(e.type || '')))
    + guides + '</article>';
}
