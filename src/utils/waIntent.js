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
    reportWaIntent();
  }, true);
}
