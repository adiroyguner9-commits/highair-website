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

export async function greenFetch(method, init, query = '') {
  const hosts = greenHosts();
  const first = hosts.includes(greenHost) ? greenHost : hosts[0];
  let last;
  for (const host of [first, ...hosts.filter(h => h !== first)]) {
    try {
      const res = await fetch(`${host}/waInstance${process.env.GREENAPI_INSTANCE}/${method}/${process.env.GREENAPI_TOKEN}${query}`, init);
      greenHost = host;
      return res;
    } catch (e) {
      last = e;
      const code = e?.cause?.code || e?.code;
      if (!CONNECT_FAILURES.has(code)) throw e;   // it may have reached Green: never send twice
      console.warn(`[green] ${host} unreachable (${code}), trying the next Green host`);
    }
  }
  throw last;
}
