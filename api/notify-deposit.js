/**
 * POST /api/notify-deposit   { leadId }
 *
 * Instant deposit-welcome: the admin Lead Center calls this the moment a lead is
 * dropped into Stage "Deposit A Paid", so the customer's WhatsApp goes out in
 * real time instead of waiting up to 5 min for the lead-messaging cron.
 *
 * Cross-origin from app.highair-expeditions.com (CORS via setSecurityHeaders,
 * same as book-slot.js). IDEMPOTENT + guarded: it only fires for a lead actually
 * in "Deposit A Paid" that hasn't been notified, and sendDepositWelcome claims
 * the flag first — so this and the cron can never double-send.
 */
import { setSecurityHeaders } from './_security.js';
import { sendDepositWelcome } from './_lib/deposit-welcome.js';

export default async function handler(req, res) {
  setSecurityHeaders(req, res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const BASE = process.env.AIRTABLE_BASE, TOKEN = process.env.AIRTABLE_TOKEN;
  if (!BASE || !TOKEN) return res.status(500).json({ error: 'Missing env' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  const leadId = String(body.leadId || '').trim();
  if (!leadId) return res.status(400).json({ error: 'leadId required' });

  try {
    // Global messaging pause (owner restaging the pipeline) — skip the instant send,
    // so dragging leads into "Deposit A Paid" doesn't blast welcome messages.
    const pr = await fetch(`https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${encodeURIComponent('{Key}="lead_messaging_paused"')}&fields[]=Value&maxRecords=1`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const pv = String((await pr.json()).records?.[0]?.fields?.Value || '').trim().toLowerCase();
    if (pv === '1' || pv === 'true' || pv === 'yes' || pv === 'on') return res.status(200).json({ skipped: 'messaging paused' });   // match the cron's truthiness

    const r = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}/${leadId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!r.ok) return res.status(200).json({ skipped: 'lead not found' });
    const rec = await r.json();
    const f = rec.fields || {};

    if (f.Stage !== 'Deposit A Paid')      return res.status(200).json({ skipped: 'not a closing' });
    if (f['Deposit A Notified'] === true)  return res.status(200).json({ skipped: 'already sent' });

    const out = await sendDepositWelcome(rec);
    return res.status(200).json({ sent: true, ...out });
  } catch (e) {
    console.error('[notify-deposit]', e.message);
    return res.status(200).json({ error: e.message });
  }
}
