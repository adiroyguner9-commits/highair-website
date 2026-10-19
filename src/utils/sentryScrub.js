/**
 * What the website's error reports may carry (Sentry, src/main.jsx).
 *
 * The same rule as the app's (HighAir-webapp src/utils/monitoring.js, scrub /
 * scrubEvent / scrubBreadcrumb): change one, change both. The owner asked for
 * the website to scrub like the app (19 Oct 2026); the lead forms here take
 * names, phones and emails, and a URL can carry a booking or a ?ref=.
 *
 * - Emails, booking references (two capitals and four digits) and any number
 *   of six digits or more (phones, ids, codes) are masked in messages,
 *   exception values and breadcrumbs.
 * - Every URL loses its query string and fragment.
 * - Console breadcrumbs are dropped; click breadcrumbs keep the category but
 *   lose the element text.
 * - No user object, no cookies.
 */
const EMAIL   = /[\w.+-]+@[\w-]+\.[\w.-]+/g;
const NUMBER  = /\+?\d(?:[\s-]?\d){5,}/g;
const BOOKING = /\b[A-Z]{2}\d{4}\b/g;

export const scrub = s => (typeof s === 'string'
  ? s.replace(EMAIL, '[email]').replace(BOOKING, '[booking]').replace(NUMBER, '[number]')
  : s);
export const noQuery = u => (typeof u === 'string' ? u.split(/[?#]/)[0] : u);

export function scrubEvent(event) {
  if (event.request?.url) event.request.url = noQuery(event.request.url);
  if (event.request) { delete event.request.query_string; delete event.request.cookies; }
  if (event.message) event.message = scrub(event.message);
  for (const ex of event.exception?.values || []) ex.value = scrub(ex.value);
  if (typeof event.transaction === 'string') event.transaction = noQuery(event.transaction);
  delete event.user;
  return event;
}

export function scrubBreadcrumb(b) {
  if (b.category === 'console') return null;
  if (b.category?.startsWith('ui.')) return { ...b, message: undefined };
  const out = { ...b, message: scrub(b.message) };
  if (out.data) {
    out.data = { ...out.data };
    for (const k of ['url', 'from', 'to']) if (out.data[k]) out.data[k] = noQuery(out.data[k]);
  }
  return out;
}

/* Performance transactions (10% of page loads) carry the page URL and the
   URLs of the requests made: same rule. */
export function scrubTransaction(event) {
  scrubEvent(event);
  for (const span of event.spans || []) {
    if (typeof span.description === 'string') span.description = noQuery(span.description);
    for (const k of ['url', 'http.url', 'http.query']) {
      if (span.data?.[k] !== undefined) span.data[k] = k === 'http.query' ? undefined : noQuery(span.data[k]);
    }
  }
  return event;
}
