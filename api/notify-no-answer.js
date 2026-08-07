/**
 * POST /api/notify-no-answer   { leadId }
 *
 * Instant no-answer notice: the Lead Center calls this the moment a CONFIRMED
 * "No Answer" move lands (the board asks "are you sure" first), so the lead's
 * WhatsApp goes out in real time instead of waiting up to 5 min for the cron.
 *
 * Cross-origin from app.highair-expeditions.com (CORS via setSecurityHeaders).
 * IDEMPOTENT + guarded: sendNoAnswerNotice only fires for a lead actually in
 * "No Answer" that hasn't been notified, claims the flag first, and defers to
 * the cron outside 09:00-21:00 Israel — so this and the cron can never
 * double-send or message at night.
 */
import { setSecurityHeaders } from './_security.js';
import { sendNoAnswerNotice } from './_lib/no-answer.js';

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
    // Global messaging pause — the instant path honours it exactly like the cron.
    const pr = await fetch(`https://api.airtable.com/v0/${BASE}/AppContent?filterByFormula=${encodeURIComponent('{Key}="lead_messaging_paused"')}&fields[]=Value&maxRecords=1`, { headers: { Authorization: `Bearer ${TOKEN}` } });
    const pv = String((await pr.json()).records?.[0]?.fields?.Value || '').trim().toLowerCase();
    if (pv === '1' || pv === 'true' || pv === 'yes' || pv === 'on') return res.status(200).json({ skipped: 'messaging paused' });

    const r = await fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}/${leadId}`, {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    if (!r.ok) return res.status(200).json({ skipped: 'lead not found' });

    const out = await sendNoAnswerNotice(await r.json());
    return res.status(200).json({ ok: true, ...out });
  } catch (e) {
    console.error('[notify-no-answer]', e.message);
    return res.status(200).json({ ok: false, error: e.message });
  }
}
