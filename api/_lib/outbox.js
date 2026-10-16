/**
 * outbox.js — every message we send a customer, and what the provider answered.
 *
 * TWIN FILE: byte-identical in HighAir-webapp/api/_lib/outbox.js and
 * HighAir-website/api/_lib/outbox.js. Change one, copy it to the other.
 *
 * Why it exists (owner, 15-16 Oct 2026). In one week four customer messages
 * failed or were silenced, and the system reported every one of them as fine:
 * the deposit welcome set waSent=true without reading Green's reply, a reused
 * lead card skipped its closing message on a stale flag, and the reschedule
 * notice still answers "sent" whatever Green says. Each was found by the owner,
 * never by us. A sender's own conclusion cannot be trusted, so this records the
 * PROVIDER's answer instead, at the one place every WhatsApp leaves through:
 * greenFetch, in both repos. Nothing that sends has to remember to call it.
 *
 * It is an index, never a reason to fail a send: every write is fail-soft and
 * bounded by a short timeout. Rows feed the daily failure digest in the cron and
 * are removed after 45 days, so the table stays small.
 */

const TABLE      = 'Outbox';
const TIMEOUT_MS = 2500;
/* The Green methods that put a message in front of a customer. Everything else
   greenFetch carries (state checks, chat reads) is not a send and not logged. */
export const GREEN_SEND_METHODS = new Set(['sendMessage', 'sendFileByUrl']);

/** One row. Never throws. */
export async function recordOutbox({ channel, to, preview, ok, providerId, error, kind, recordId, source }) {
  const base = process.env.AIRTABLE_BASE, token = process.env.AIRTABLE_TOKEN;
  if (!base || !token) return false;
  const ctrl  = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const r = await fetch(`https://api.airtable.com/v0/${base}/${encodeURIComponent(TABLE)}`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ typecast: true, records: [{ fields: {
        Preview:       String(preview || '').replace(/\s+/g, ' ').trim().slice(0, 100) || '(no text)',
        At:            new Date().toISOString(),
        Channel:       channel,
        Status:        ok ? 'Sent' : 'Failed',
        To:            String(to || ''),
        Kind:          String(kind || ''),
        Record:        String(recordId || ''),   // the lead or customer it is about
        Source:        String(source || ''),
        'Provider Id': String(providerId || ''),
        Error:         String(error || '').slice(0, 500),
      } }] }),
    });
    return r.ok;
  } catch { return false; }
  finally { clearTimeout(timer); }
}

/**
 * Turn one Green send into a row.
 *   res   — Green's Response, when Green answered at all. Read through a CLONE,
 *           so the caller still gets the body it is about to parse.
 *   error — what was thrown, when Green could not be reached.
 *   meta  — optional { kind, recordId (or leadId), source } from the caller.
 * "Sent" means exactly what it means in api/_lib/followup.js: HTTP ok AND an
 * idMessage. Anything else is a failure, with Green's own words kept.
 */
export async function recordGreenSend({ method, init, res = null, error = null, meta = null }) {
  let body = {};
  try { body = JSON.parse(init?.body || '{}'); } catch { /* not JSON, keep {} */ }
  const to      = String(body.chatId || '').replace(/@c\.us$/i, '');
  const preview = body.message || body.caption || body.fileName || (method === 'sendFileByUrl' ? '(file)' : '');
  let ok = false, providerId = '', err = '';
  if (res) {
    const d = await res.clone().json().catch(() => ({}));
    providerId = d?.idMessage || '';
    ok = res.ok && !!providerId;
    if (!ok) err = `green ${res.status} ${JSON.stringify(d).slice(0, 300)}`;
  } else {
    err = 'green request failed: ' + (error?.message || 'unknown');
  }
  return recordOutbox({
    channel: 'WhatsApp', to, preview, ok, providerId, error: err,
    kind: meta?.kind, recordId: meta?.recordId || meta?.leadId, source: meta?.source,
  });
}
