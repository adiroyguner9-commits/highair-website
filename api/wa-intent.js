/**
 * "Someone just tapped the WhatsApp button, and here is where they came from."
 * POST /api/wa-intent  { attribution, landing, campaign }
 *
 * THE PROBLEM
 * Our WhatsApp button is on the website, not in an ad. So the journey is
 * ad → site → button → WhatsApp, and the last hop drops everything: the
 * message that reaches us carries no trace of the visit that produced it. In
 * August that was 40 leads with no origin at all, the single biggest hole in
 * the attribution.
 *
 * By the time they tap, we already know exactly where they came from — the site
 * has kept it for 90 days (utils/attribution.js). This endpoint parks that
 * knowledge for a few minutes so the incoming message can be joined back to it.
 *
 * NO CODE IN THE MESSAGE, deliberately (owner, Aug 15 2026: "אני לא רוצה שהוא
 * יראה קוד"). A short reference in the prefilled text would be exact, but the
 * customer sees it, and he would rather have a slightly softer number than put
 * a machine artefact in front of a person about to say hello.
 *
 * So the join is by TIME, and the matching rule is deliberately strict: the
 * claimer (api/agent.js in the webapp) attributes only when EXACTLY ONE
 * unmatched intent sits in the window. Two people tapping in the same few
 * minutes leaves both unattributed, because an attribution you cannot trust is
 * worse than an honest "not tracked" — it would quietly credit one person's ad
 * with another person's lead.
 *
 * Writes nothing about WHO tapped: no phone (we do not have one yet), no name,
 * no cookie id. Just when, from where, and which campaign.
 */
import { setSecurityHeaders } from './_security.js';

export default async function handler(req, res) {
  setSecurityHeaders(req, res);   /* (req, res) — it reads the Origin header */
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const BASE = process.env.AIRTABLE_BASE, TOKEN = process.env.AIRTABLE_TOKEN;
  if (!BASE || !TOKEN) return res.status(200).json({ ok: true, skipped: 'no base' });

  const b = typeof req.body === 'object' && req.body ? req.body : {};
  const clean = (v, n) => String(v || '').trim().slice(0, n);
  const attribution = clean(b.attribution, 2000);
  const landing     = clean(b.landing, 200);
  const campaign    = clean(b.campaign, 200);

  /* A tap with nothing to say is not worth a row — and worse, it would sit in
     the window as a second candidate and spoil a real one's match. */
  if (!attribution && !campaign) return res.status(200).json({ ok: true, skipped: 'nothing to record' });

  try {
    const r = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('WA Intents')}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: {
        'At': new Date().toISOString(),
        'Attribution': attribution,
        'Landing': landing,
        'Campaign': campaign,
      } }),
    });
    if (!r.ok) console.error('[wa-intent] airtable', r.status);
  } catch (e) {
    console.error('[wa-intent]', e.message);
  }
  /* Always 200. This is a side note on the way to WhatsApp; it must never
     delay the tap or show the visitor an error. */
  return res.status(200).json({ ok: true });
}
