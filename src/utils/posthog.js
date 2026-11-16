/* PostHog: how visitors move through the site, the funnel to the lead form, and session replays
   (owner, 16 Nov 2026: of the free tools, the one we chose; project 353463, EU Cloud).

   Rules, all of them on purpose:
   - Only after the visitor ACCEPTED cookies (CookieBanner, key 'highair_cookie_consent'). A visitor
     who declines, or never answers, sends nothing. Declining later stops it.
   - Only on the live website hosts. Never in tests, local runs, previews or the customers' app.
   - Never for bots and automated browsers (search engines, Lighthouse, our own checks).
   - Loaded when the browser is idle, as a separate chunk: nothing of it is in the first page load.
   - Every form field is masked in the recordings: a lead's name, phone or email never reaches PostHog.
   The key is the project's public write-only token, made to live in client code. */
const TOKEN    = 'phc_BkxHG8KSveYuagiuXTkVApGeFdTuAU3VGbfEU9g7vKmX';
const API_HOST = 'https://eu.i.posthog.com';
const CONSENT_KEY = 'highair_cookie_consent';

export const LIVE_HOST = /^(www\.|en\.|de\.|es\.)?highair-expeditions\.com$/i;
const BOT = /bot|crawl|spider|slurp|lighthouse|headless|pagespeed|prerender|preview/i;

let started = false;
let ph = null;

const consented = () => { try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch { return false; } };

/** Whether this visit may be measured at all. */
export function mayTrack(w = typeof window !== 'undefined' ? window : null) {
  if (!w) return false;
  if (!LIVE_HOST.test(w.location?.hostname || '')) return false;
  const nav = w.navigator || {};
  if (nav.webdriver || BOT.test(nav.userAgent || '')) return false;
  return true;
}

export const POSTHOG_CONFIG = {
  api_host: API_HOST,
  ui_host: 'https://eu.posthog.com',
  person_profiles: 'identified_only',   // anonymous visitors, no profiles
  capture_pageview: 'history_change',   // the site is one page app: count every route
  capture_pageleave: true,
  autocapture: true,
  disable_surveys: true,                // no extra scripts we do not use
  session_recording: { maskAllInputs: true },
};

/** Start PostHog when allowed: called once on load and again when the visitor accepts cookies. */
export function startPostHog() {
  if (started || !mayTrack() || !consented()) return;
  started = true;
  const go = () => import('posthog-js')
    .then(({ default: posthog }) => { ph = posthog; posthog.init(TOKEN, POSTHOG_CONFIG); })
    .catch(() => { started = false; });
  if ('requestIdleCallback' in window) window.requestIdleCallback(go, { timeout: 4000 });
  else setTimeout(go, 1500);
}

/** The visitor declined after accepting: stop at once. */
export function stopPostHog() {
  try { ph?.opt_out_capturing(); ph?.stopSessionRecording?.(); } catch { /* nothing to stop */ }
}

/* The site's own events (utils/analytics.js) reach PostHog too, so a funnel can end at the lead
   itself (owner, 16 Nov 2026: "תעשה את כל מה שצריך"). Only once PostHog runs, i.e. after consent;
   before that nothing is queued. None of these events carries a visitor's name, phone or email. */
export function capturePostHog(event, props = {}) {
  try { if (ph && started) ph.capture(event, props); } catch { /* never break the page */ }
}
