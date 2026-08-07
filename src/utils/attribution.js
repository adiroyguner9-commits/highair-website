/**
 * Where every visitor came from — captured once per visit, kept for 90 days.
 *
 * The old version stored only utm_* and only in sessionStorage. Two holes came
 * out of that, both measured on the 1 Jul – 6 Aug 2026 leads:
 *
 *   1. sessionStorage dies with the tab. Somebody who clicks an ad on Monday,
 *      thinks it over, and enquires on Thursday arrived with no utm in that
 *      second session and was recorded as organic. For a $4,000 expedition that
 *      gap of days is the normal path, not the exception.
 *   2. A visitor arriving WITHOUT utm had nothing stored at all — no referrer,
 *      no landing page. So "no campaign" was one blind bucket holding Google,
 *      Instagram bio links, WhatsApp forwards and direct traffic together.
 *
 * So: localStorage, 90 days, and we record something for EVERY visit — utm when
 * present, and otherwise the click ids and the referrer, which still say where
 * the person came from. fbclid alone proves Meta even when the utm template
 * fails, and it does fail: two leads in that period arrived carrying the literal
 * text "{{campaign.name}}".
 *
 * First touch AND last touch are kept. First touch is what earned the lead;
 * last touch is what brought them back to convert. Reporting on only one of
 * them always flatters the wrong channel.
 */

const KEY = 'ha_attr_v1';
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
const CLICK_IDS = ['fbclid', 'gclid', 'ttclid', 'msclkid'];

function read() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!raw || typeof raw !== 'object') return null;
    if (raw.first?.at && Date.now() - Date.parse(raw.first.at) > MAX_AGE_MS) return null;
    return raw;
  } catch { return null; }
}

/** The visit happening right now, as far as the URL and the referrer reveal it. */
function currentTouch() {
  const p = new URLSearchParams(window.location.search);
  const t = { at: new Date().toISOString(), landing: window.location.pathname.slice(0, 200) };

  for (const k of UTM_KEYS) { const v = p.get(k); if (v) t[k] = v.slice(0, 200); }
  for (const k of CLICK_IDS) { const v = p.get(k); if (v) t[k] = v.slice(0, 300); }

  /* Referrer, but only when it is someone ELSE. An internal navigation would
     otherwise overwrite a real source with our own domain. */
  const ref = document.referrer || '';
  if (ref) {
    try {
      const h = new URL(ref).hostname.replace(/^www\./, '');
      if (h && h !== window.location.hostname.replace(/^www\./, '')) { t.referrer = h; t.referrerUrl = ref.slice(0, 300); }
    } catch { /* malformed referrer — ignore */ }
  }
  return t;
}

/** True when the touch says anything at all about origin. */
function isMeaningful(t) {
  return UTM_KEYS.some(k => t[k]) || CLICK_IDS.some(k => t[k]) || !!t.referrer;
}

/**
 * Call once, as early as possible on load. Records the first meaningful touch
 * forever (within the window) and refreshes the last one on every new visit.
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return;
  try {
    const t = currentTouch();
    if (!isMeaningful(t)) return;             // a plain internal page view tells us nothing
    const store = read() || {};
    if (!store.first) store.first = t;        // first touch is written once and never overwritten
    store.last = t;
    localStorage.setItem(KEY, JSON.stringify(store));
  } catch { /* private mode / storage full — attribution is not worth an exception */ }
}

/**
 * What to send with a lead. `utmParams` keeps the exact shape the API already
 * expects, so nothing downstream has to change; `attribution` is the new detail.
 */
export function getAttribution() {
  const store = read() || {};
  const first = store.first || {};
  const last  = store.last  || {};
  /* Prefer the campaign that is live in the URL right now, then last touch,
     then first. A person mid-click on an ad is on that ad's campaign. */
  const live = typeof window !== 'undefined' ? currentTouch() : {};
  const pick = k => live[k] || last[k] || first[k] || '';

  const utmParams = {};
  for (const k of UTM_KEYS) { const v = pick(k); if (v) utmParams[k] = v; }

  return {
    utmParams,
    attribution: {
      firstAt:       first.at || '',
      firstSource:   describe(first),
      firstLanding:  first.landing || '',
      lastAt:        last.at || '',
      lastSource:    describe(last),
      fbclid:        pick('fbclid'),
      gclid:         pick('gclid'),
      referrer:      live.referrer || last.referrer || first.referrer || '',
    },
  };
}

/** A one-line, human-readable origin for a touch — what a person would say. */
function describe(t) {
  if (!t || !Object.keys(t).length) return '';
  if (t.utm_campaign) return `${t.utm_source || 'campaign'} · ${t.utm_campaign}`;
  if (t.fbclid) return 'Meta (click id, no UTM)';
  if (t.gclid)  return 'Google Ads (click id, no UTM)';
  if (t.referrer) return t.referrer;
  return '';
}
