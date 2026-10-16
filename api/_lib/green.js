/* ── Where Green (the WhatsApp API) is reached ──────────────────────────────
   22 Sep 2026, from about 11:35 Israel time: sends failed from both Vercel
   projects with "fetch failed" / UND_ERR_CONNECT_TIMEOUT on api.green-api.com,
   while the same host answered in 0.1s from Israel. api.green-api.com resolves
   to Yandex Cloud (51.250.8.4) and our functions run in AWS us-east-1, which
   stopped reaching it. Green also serves every instance from its own host,
   <first 4 digits of the instance>.api.greenapi.com (DigitalOcean), plus a
   general api.greenapi.com; all three answer for instance 7107596827.

   So the instance's own host goes first, then the others. A host is skipped
   only when the CONNECTION failed (nothing reached Green, so nothing can be
   sent twice); any other error is thrown as before. The host that worked is
   remembered for the rest of the warm instance. GREENAPI_URL, if set, goes
   first of all. The webapp has the same list in api/_lib/wa.js. */
import { GREEN_SEND_METHODS, recordGreenSend } from './outbox.js';

const CONNECT_FAILURES = new Set(['UND_ERR_CONNECT_TIMEOUT', 'ENOTFOUND', 'EAI_AGAIN', 'ECONNREFUSED', 'EHOSTUNREACH', 'ENETUNREACH']);
let greenHost = '';

function greenHosts() {
  const inst = String(process.env.GREENAPI_INSTANCE || '');
  return [...new Set([
    process.env.GREENAPI_URL,
    /^\d{4}/.test(inst) ? `https://${inst.slice(0, 4)}.api.greenapi.com` : '',
    'https://api.greenapi.com',
    'https://api.green-api.com',
  ].filter(Boolean).map(h => String(h).replace(/\/+$/, '')))];
}

/* Every send leaves a row in the Outbox with Green's real answer (./outbox.js).
   Awaited here, unlike the webapp: this repo has no waitUntil, and none of its
   sends has a person waiting on the far side (crons, and the Lead Center's
   fire-and-forget notices), so a bounded log write costs nobody anything and
   cannot be frozen half-written when the function ends. */
async function logSend(args) {
  if (!GREEN_SEND_METHODS.has(args.method)) return;
  await recordGreenSend(args).catch(() => {});
}

/* `meta` is optional { kind, leadId, source } and only labels the Outbox row. */
export async function greenFetch(method, init, query = '', meta = null) {
  const hosts = greenHosts();
  const first = hosts.includes(greenHost) ? greenHost : hosts[0];
  const tag = { source: 'website', ...(meta || {}) };
  let last;
  for (const host of [first, ...hosts.filter(h => h !== first)]) {
    /* Only the request itself sits in the try. The log is written outside it,
       so nothing about logging can ever look like a connection failure and send
       the same message again through the next host. */
    let res;
    try {
      res = await fetch(`${host}/waInstance${process.env.GREENAPI_INSTANCE}/${method}/${process.env.GREENAPI_TOKEN}${query}`, init);
    } catch (e) {
      last = e;
      const code = e?.cause?.code || e?.code;
      if (!CONNECT_FAILURES.has(code)) {             // it may have reached Green: never send twice
        await logSend({ method, init, error: e, meta: tag });
        throw e;
      }
      console.warn(`[green] ${host} unreachable (${code}), trying the next Green host`);
      continue;
    }
    greenHost = host;
    await logSend({ method, init, res, meta: tag });
    return res;
  }
  await logSend({ method, init, error: last, meta: tag });
  throw last;
}
