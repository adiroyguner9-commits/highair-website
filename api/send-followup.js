/**
 * POST /api/send-followup   { leadId }
 *
 * Manual "send the follow-up now" button in the admin Lead Center — for leads the
 * automation never actually reached (Green used to fail silently and we'd still
 * tick "Sent"). Future ones go out on their own; this is the repair tool.
 *
 * Uses the SAME message as the cron (_lib/followup.js) and the same honest send:
 * we only tick "Follow-Up Sent" when Green really accepted the message.
 *
 * Deliberately NOT gated on the 4-day timer or "already sent" — the whole point is
 * to rescue leads whose flag is lying. It DOES honour the guards that protect the
 * customer: the global messaging pause, and the terminal stages where a
 * "how are you?" would be wrong.
 */
import { setSecurityHeaders } from './_security.js';
import { msgFollowUp, sendWhatsAppVerified } from './_lib/followup.js';

const SKIP_STAGES = new Set(['Deposit A Paid', 'Not Relevant', 'לקוח קיים', 'Awaiting Deposit A']);

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const BASE = process.env.AIRTABLE_BASE, TOKEN = process.env.AIRTABLE_TOKEN;
  if (!BASE || !TOKEN) return res.status(500).json({ ok: false, error: 'Missing env' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  const leadId = String(body.leadId || '').trim();
  if (!leadId) return res.status(400).json({ ok: false, error: 'leadId required' });

  const LEADS = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}`;
  const auth  = { Authorization: `Bearer ${TOKEN}` };

  try {
    // Same global pause the cron respects — never message while the owner is
    // restaging the pipeline.
    const pr = await fetch(`https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${encodeURIComponent('{Key}="lead_messaging_paused"')}&fields[]=Value&maxRecords=1`, { headers: auth });
    const pv = String((await pr.json()).records?.[0]?.fields?.Value || '').trim().toLowerCase();
    if (['1', 'true', 'yes', 'on'].includes(pv)) return res.status(200).json({ ok: false, error: 'המסרים מושהים כרגע (messaging paused)' });

    const r = await fetch(`${LEADS}/${leadId}`, { headers: auth });
    if (!r.ok) return res.status(200).json({ ok: false, error: 'הליד לא נמצא' });
    const f = (await r.json()).fields || {};

    if (SKIP_STAGES.has(String(f.Stage || ''))) {
      return res.status(200).json({ ok: false, error: `לא נשלח — הליד בשלב "${f.Stage}"` });
    }
    if (!f.Phone) return res.status(200).json({ ok: false, error: 'אין מספר טלפון לליד' });

    const sent = await sendWhatsAppVerified(f.Phone, msgFollowUp(f.Name, f.Expedition));
    if (!sent.ok) return res.status(200).json({ ok: false, error: sent.error });

    // Only now — a real idMessage came back — record it and land the card in
    // "Follow-Up Sent", exactly like the cron does.
    await fetch(`${LEADS}/${leadId}`, {
      method: 'PATCH', headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: { 'Follow-Up Sent': true, 'Stage': 'Follow-Up Sent' } }),
    });
    return res.status(200).json({ ok: true, id: sent.id, stage: 'Follow-Up Sent' });
  } catch (e) {
    console.error('[send-followup]', e.message);
    return res.status(200).json({ ok: false, error: e.message });
  }
}
