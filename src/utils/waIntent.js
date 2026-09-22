/**
 * Tell the server where this visitor came from, the instant they tap WhatsApp.
 *
 * The message they are about to send carries nothing about the visit that
 * produced it, so this is the only moment the two are still connected. See
 * api/wa-intent.js for why the join is by time and why the customer never sees
 * a reference code.
 *
 * sendBeacon, not fetch: the tab is about to be replaced by WhatsApp, and a
 * normal request in flight when that happens is cancelled. A beacon is handed
 * to the browser to deliver whatever happens to this page, which is exactly the
 * guarantee needed here. fetch with keepalive is the fallback for the few
 * browsers without it.
 *
 * Never awaited and never throws. Nothing about this may delay a person getting
 * to WhatsApp, and a lost attribution is a smaller problem than a slow tap.
 */
import { getAttribution } from './attribution.js';
import { NAV_EXPS } from '../data/navData.js';

/* One tap must produce exactly ONE intent row. Two rows for one visitor would
   sit in the match window as two candidates and, by the strict rule in
   api/agent.js, cancel each other out — the attribution would be lost by the
   very mechanism meant to protect it. This guard makes a double-fire (a
   delegated listener plus a stray per-component call) harmless. */
let lastFire = 0;
export function reportWaIntent() {
  const now = Date.now();
  if (now - lastFire < 3000) return;
  lastFire = now;
  try {
    const { utmParams, attribution } = getAttribution();
    const lines = [];
    if (attribution.firstSource)  lines.push(`מגע ראשון: ${attribution.firstSource}${attribution.firstAt ? ` (${attribution.firstAt.slice(0, 10)})` : ''}`);
    if (attribution.firstLanding) lines.push(`דף נחיתה ראשון: ${attribution.firstLanding}`);
    if (attribution.lastSource && attribution.lastSource !== attribution.firstSource)
                                  lines.push(`מגע אחרון: ${attribution.lastSource}${attribution.lastAt ? ` (${attribution.lastAt.slice(0, 10)})` : ''}`);
    if (attribution.referrer)     lines.push(`הפניה: ${attribution.referrer}`);
    if (attribution.fbclid)       lines.push(`fbclid: ${attribution.fbclid}`);
    if (attribution.gclid)        lines.push(`gclid: ${attribution.gclid}`);
    lines.push('דרך: כפתור וואטסאפ באתר');

    const payload = JSON.stringify({
      attribution: lines.join('\n'),
      landing: window.location.pathname.slice(0, 200),
      campaign: utmParams.utm_campaign || '',
    });

    const url = '/api/wa-intent';
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([payload], { type: 'application/json' }));
      return;
    }
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, keepalive: true })
      .catch(() => {});
  } catch { /* attribution is never worth breaking a tap on WhatsApp */ }
}

/**
 * The first message names the trip the visitor was reading about.
 *
 * Owner, 22 Sep 2026: "לדעת מאיפה הגיע הליד ווצאפ לפי הודעה שתשלח לפי דף האתר
 * שבה הוא שהה". Every button used to open the same generic text (or none), so
 * a WhatsApp lead arrived with no destination, and the time join in
 * api/wa-intent.js places only about half of them. A trip named IN the message
 * travels with the message itself: the webapp's lead-notify reads it to put a
 * Kilimanjaro lead straight into the Kilimanjaro queue, and the agent sees it on
 * the first line.
 *
 * Only on a trip's own pages (/expedition/<slug>, /book/<slug>). Elsewhere every
 * link keeps exactly what it had.
 */
const WA_OUR_NUMBER = '972555636975';
const WA_GENERIC = [
  'היי! אני מעוניין/ת לשמוע עוד על המשלחות של HighAir 🏔️',
  "Hi! I'd love to hear more about HighAir expeditions 🏔️",
];

export function waTripMessage(pathname, lang = 'he') {
  const m = String(pathname || '').match(/^\/(?:expedition|book)\/([^/?#]+)/);
  const exp = m ? NAV_EXPS.find(e => e.slug === m[1]) : null;
  if (!exp) return '';
  return lang === 'en'
    ? `Hi! I'd love to hear more about ${exp.nameEn || exp.nameHe} with HighAir 🏔️`
    : `היי! אני מעוניין/ת לשמוע עוד על ${exp.nameHe} 🏔️`;
}

/* Put the trip into a link to OUR number, unless the link already carries a
   text of its own that is not the generic one. Runs in the click's capture
   phase, before the browser follows the link, so the tap opens WhatsApp with
   the new text. Every click starts again from the link as the page rendered it
   (kept in data-wa-orig): the header survives moving between pages without a
   reload, and must not carry the last trip's name onto the home page. */
function decorateWaLink(a) {
  try {
    const orig = a.dataset.waOrig || a.getAttribute('href');
    const text = waTripMessage(window.location.pathname, document.documentElement.lang === 'en' ? 'en' : 'he');
    if (!text) { if (a.dataset.waOrig) a.setAttribute('href', a.dataset.waOrig); return; }
    const url = new URL(orig, window.location.href);
    const isWaMe = url.hostname === 'wa.me';
    const phone = isWaMe ? url.pathname.replace(/\D/g, '') : (url.searchParams.get('phone') || '').replace(/\D/g, '');
    if (phone !== WA_OUR_NUMBER) return;
    const current = url.searchParams.get('text') || '';
    if (current && !WA_GENERIC.includes(current)) return;
    a.dataset.waOrig = orig;
    /* Built by hand: URLSearchParams writes a space as "+", which WhatsApp
       does not always read back as a space. */
    const keep = [...url.searchParams].filter(([k]) => k !== 'text').map(([k, v]) => `${k}=${encodeURIComponent(v)}`);
    a.setAttribute('href', `${url.origin}${url.pathname}?${[...keep, `text=${encodeURIComponent(text)}`].join('&')}`);
  } catch { /* a link we cannot read is left exactly as it was */ }
}

/**
 * Catch every WhatsApp link on the site, including ones added later.
 *
 * The buttons live in five components in four different shapes — a bare anchor,
 * an entry in a link array, a config object. Wiring each one is four chances to
 * miss one today and a certainty of missing the next one added. A single
 * delegated listener covers them all and cannot drift.
 *
 * Capture phase, so it still runs if a handler further down stops propagation.
 */
export function installWaIntentListener() {
  if (typeof document === 'undefined') return;
  document.addEventListener('click', e => {
    const a = e.target?.closest?.('a[href]');
    if (!a) return;
    const href = a.getAttribute('href') || '';
    if (!/wa\.me\/|whatsapp\.com\/send|api\.whatsapp\.com/.test(href)) return;
    /* Sharing a blog post opens wa.me with no phone — that is the visitor
       sending OUR page to a friend, not the visitor contacting us. */
    if (/wa\.me\/\?/.test(href)) return;
    decorateWaLink(a);
    reportWaIntent();
  }, true);
}
