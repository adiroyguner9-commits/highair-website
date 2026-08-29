/**
 * POST /api/submit-lead
 * Dedicated endpoint for Website Lead form submissions.
 * Writes to Airtable AND sends email notification via Resend.
 */

export const config = { api: { bodyParser: true } };

import {
  escapeHtml,
  sanitiseFields,
  isValidEmail,
  isValidName,
  checkRateLimit,
  setSecurityHeaders,
} from './_security.js';
import { fetchActiveLead, tripKey } from './_lib/active-lead.js';
import { destKey } from './_lib/dest.js';
import { normalizePhone, phoneIsValid, phoneError } from './_lib/phone.js';

/* Fields that exist in the Airtable "Website Leads" table */
const AIRTABLE_FIELDS = new Set([
  'Name', 'Phone', 'Email', 'Expedition',
  'Preferred Month', 'Age', 'Group Size', 'Experience', 'Source',
  'Message', 'Created Time',
  'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'UTM Term',
  'Attribution',
]);

/* The company phone format, shared with the webapp: "+972501234567".
   This used to normalise to the LOCAL "0XXXXXXXXX" form, the exact opposite of
   what the rest of the system stores, so every website lead re-dirtied the base
   the moment it arrived (Aug 2 2026). Everything downstream here matches on the
   last 9 digits, so the switch is invisible to dedupe and to the blocklist. */
const canonPhone = normalizePhone;

/* Internal numbers that must NEVER become leads — every employee/agent plus any
   number the owner lists. Built from: every Agents-table Phone (staff) + the
   AppContent key `lead_blocklist_phones` (comma / space / newline separated).
   Matched on the last 9 digits. Cached 5 min; fails OPEN on read error so a
   real lead is never silently dropped. */
let _blk = { at: 0, set: null };
async function blockedLast9(BASE, TOKEN) {
  if (_blk.set && Date.now() - _blk.at < 5 * 60 * 1000) return _blk.set;
  const set = new Set();
  const add = p => { const l9 = String(p || '').replace(/\D/g, '').slice(-9); if (l9.length === 9) set.add(l9); };
  try {
    const H = { headers: { Authorization: `Bearer ${TOKEN}` } };
    const [ar, cr] = await Promise.all([
      fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Agents')}?maxRecords=100&fields[]=Phone`, H),
      fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('AppContent')}?filterByFormula=${encodeURIComponent('{Key}="lead_blocklist_phones"')}&maxRecords=1&fields[]=Value`, H),
    ]);
    for (const rec of (await ar.json().catch(() => ({}))).records || []) add(rec.fields?.Phone);
    const cfg = (await cr.json().catch(() => ({}))).records?.[0]?.fields?.Value || '';
    String(cfg).split(/[\s,;]+/).forEach(add);
    _blk = { at: Date.now(), set };
  } catch (e) { console.warn('[submit-lead] blocklist read non-fatal:', e.message); }
  return set;
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* ── Rate limiting ── */
  if (!checkRateLimit(req, 'submit-lead')) {
    return res.status(429).json({ error: 'Too many requests — please wait a moment' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const rawFields = req.body?.fields || {};

  /* ── Extract and sanitise UTM params ── */
  const rawUtm = req.body?.utmParams || {};
  const utm = {
    source:   String(rawUtm.utm_source   || '').trim().slice(0, 100),
    medium:   String(rawUtm.utm_medium   || '').trim().slice(0, 100),
    campaign: String(rawUtm.utm_campaign || '').trim().slice(0, 200),
    content:  String(rawUtm.utm_content  || '').trim().slice(0, 200),
    term:     String(rawUtm.utm_term     || '').trim().slice(0, 200),
  };

  /* ── Input validation ── */
  const name  = (rawFields['Name']  || '').trim();
  const phone = (rawFields['Phone'] || '').trim();
  const email = (rawFields['Email'] || '').trim();

  if (!isValidName(name)) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  /* The old check only counted digits (7-15), so a mobile missing a digit
     sailed through, got normalised, and became a lead nobody could ever reach.
     phoneIsValid knows the real Israeli shapes and leaves foreign numbers to
     their own country's rules (Aug 2 2026). */
  if (phone && !phoneIsValid(phone)) {
    return res.status(400).json({ error: phoneError(phone) || 'Invalid phone number' });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  /* ── Sanitise all fields (length limits) ── */
  const sanitised = sanitiseFields(rawFields);

  /* ── Honeypot: bots fill hidden fields humans don't see ── */
  if (rawFields['_hp']) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  /* ── Strip fields not in Airtable schema ── */
  const airtableFields = Object.fromEntries(
    Object.entries(sanitised).filter(([k, v]) =>
      AIRTABLE_FIELDS.has(k) && v !== undefined && v !== ''
    )
  );

  /* Store the phone in canonical "0XXXXXXXXX" format so every lead that
     enters the system is uniform for later matching + WhatsApp sending. */
  if (airtableFields['Phone']) {
    airtableFields['Phone'] = canonPhone(airtableFields['Phone']);
  }

  /* ONE canonical English value in {Expedition} — the web_v2 pages submit the
     Hebrew page title while every other source writes the English key, which
     left the Airtable column mixed. The exact page name survives verbatim
     inside {Source} ("Expedition Page - <Hebrew name>"), so nothing is lost —
     including which Kilimanjaro page (regular / kosher) the lead came from. */
  if (airtableFields['Expedition']) {
    const canonical = destKey(airtableFields['Expedition']);
    if (canonical) airtableFields['Expedition'] = canonical;
  }

  /* ── Timestamp in Israel time, ISO 8601 (sortable + uniform with the whole
        Website Leads table; DST-aware +03:00 summer / +02:00 winter) ── */
  const now = new Date();
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
  }).formatToParts(now).reduce((o, x) => (o[x.type] = x.value, o), {});
  const yr = +parts.year, mo = +parts.month, dy = +parts.day;
  const lastSunMar = new Date(yr, 2, 31 - new Date(yr, 2, 31).getDay());
  const lastSunOct = new Date(yr, 9, 31 - new Date(yr, 9, 31).getDay());
  const off = (new Date(yr, mo - 1, dy) >= lastSunMar && new Date(yr, mo - 1, dy) < lastSunOct) ? 3 : 2;
  const hh = parts.hour === '24' ? '00' : parts.hour;
  const israelTime = `${parts.year}-${parts.month}-${parts.day}T${hh}:${parts.minute}:${parts.second}+0${off}:00`;
  airtableFields['Created Time'] = israelTime;

  /* ── Attach UTM fields to Airtable payload ── */
  if (utm.source)   airtableFields['UTM Source']   = utm.source;
  if (utm.medium)   airtableFields['UTM Medium']   = utm.medium;
  if (utm.campaign) airtableFields['UTM Campaign'] = utm.campaign;
  if (utm.content)  airtableFields['UTM Content']  = utm.content;
  if (utm.term)     airtableFields['UTM Term']      = utm.term;

  /* ── Where this person actually came from ──
     utm_* alone answers "which ad" and nothing else, and it is blank for anyone
     who arrived without campaign params — which was 185 of 326 leads in
     Jul–Aug 2026. This block keeps the click ids and the referrer too, so a
     lead is attributable even when the UTM template fails (two leads that month
     arrived carrying the literal text "{{campaign.name}}"), and it records the
     FIRST touch, which is the one the ad actually paid for. */
  const a = req.body?.attribution || {};
  const clean = v => String(v || '').trim().slice(0, 300);
  const lines = [];
  if (clean(a.firstSource))  lines.push(`מגע ראשון: ${clean(a.firstSource)}${clean(a.firstAt) ? ` (${clean(a.firstAt).slice(0, 10)})` : ''}`);
  if (clean(a.firstLanding)) lines.push(`דף נחיתה ראשון: ${clean(a.firstLanding)}`);
  if (clean(a.lastSource) && clean(a.lastSource) !== clean(a.firstSource))
                             lines.push(`מגע אחרון: ${clean(a.lastSource)}${clean(a.lastAt) ? ` (${clean(a.lastAt).slice(0, 10)})` : ''}`);
  if (clean(a.referrer))     lines.push(`הפניה: ${clean(a.referrer)}`);
  if (clean(a.fbclid))       lines.push(`fbclid: ${clean(a.fbclid)}`);
  if (clean(a.gclid))        lines.push(`gclid: ${clean(a.gclid)}`);
  if (lines.length) airtableFields['Attribution'] = lines.join('\n').slice(0, 2000);

  console.log('[submit-lead] Lead:', sanitised['Name'], '|', sanitised['Expedition'] || sanitised['Source']);

  const LEADS_URL = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}`;

  /* ── 0. Dedupe by phone. If this person is already a lead, APPEND this inquiry
        to their existing row instead of creating a duplicate — preserving their
        Stage + Assigned Agent so the pipeline isn't disturbed — then stop (no
        new-lead webhooks/email for a returning contact). ── */
  const last9 = String(airtableFields['Phone'] || '').replace(/\D/g, '').slice(-9);

  /* ── Blocklist: internal / employee numbers never become leads. Silently
        succeed (no create, no dedupe-append, no webhooks) so the form still
        shows a normal success to whoever submitted it. ── */
  if (last9.length === 9 && (await blockedLast9(BASE, TOKEN)).has(last9)) {
    console.log('[submit-lead] blocklisted number, ignored:', airtableFields['Phone']);
    return res.status(200).json({ ok: true, blocked: true });
  }

  if (last9.length === 9) {
    try {
      /* The ACTIVE card. A follow-up enquiry used to be appended to whichever
         row came back first, so a new Aconcagua enquiry could be filed on a
         returning customer's closed Kazbek card (Aug 13 2026). */
      const rec = await fetchActiveLead({
        base: BASE, token: TOKEN, phone: sanitised['Phone'], fields: ['Experience', 'Expedition'],
      });
      /* Append ONLY when it is the same trip. A returning climber asking about
         somewhere new is a new deal and needs its own card: Michael Schechter
         walked Peaks of Balkan in June and asked about Ethiopia on 28 Aug 2026,
         and the enquiry became a line of text on his closed Balkan card. No
         card, no agent, no alert, no funnel entry. 24 enquiries were lost that
         way between 10 Jul and 28 Aug, nine of them onto cards marked "Not
         Relevant" that nobody opens — including Eli Itzhak twice, the very
         customer the returning-lead rule was written for.

         The webapp already handles this correctly (api/_lib/returning.js opens
         a second card and gives it to the agent who knows them), but it never
         got the chance: the enquiry died here, one layer earlier. So this stops
         at "is it the same trip" and lets the card be created; the webapp then
         does the rest.

         When in doubt, CREATE. A duplicate card is visible and an agent can
         merge it in a second; a swallowed lead is invisible for ever. */
      const sameTrip = rec && tripKey(rec.fields?.Expedition) === tripKey(sanitised['Expedition'])
                           && !!tripKey(sanitised['Expedition']);
      if (rec && sameTrip) {
        {
          const note = `\n---\n[פנייה נוספת ${israelTime.slice(0, 10)}] ${sanitised['Expedition'] || sanitised['Source'] || ''}${sanitised['Experience'] ? ': ' + sanitised['Experience'] : ''}`;
          await fetch(`${LEADS_URL}/${rec.id}`, {
            method: 'PATCH', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: { Experience: ((rec.fields?.Experience || '') + note).slice(0, 100000) } }),
          });
          console.log('[submit-lead] returning contact, same trip → linked to existing lead', rec.id);
          return res.status(200).json({ ok: true, linked: true });
        }
      }
      if (rec) console.log(`[submit-lead] returning contact, DIFFERENT trip (${rec.fields?.Expedition || '—'} → ${sanitised['Expedition'] || '—'}) → new card`);
    } catch (e) { console.warn('[submit-lead] dedupe check non-fatal:', e.message); }
  }

  /* ── 1. Write to Airtable (new contact) ── */
  try {
    /* Stage is stamped HERE, at birth, and deliberately NOT left to the
       assignment cron. It used to arrive blank and stay blank for up to a
       minute until lead-notify filled it in, and that gap was a live race: a
       visitor who books a call inside it gets Stage 'Call Scheduled' from
       book-slot, then the cron — still holding a snapshot that read blank —
       writes 'New Lead' straight over it. It happened to Noga Ben Yaakov on
       16 Jul (booked 26s after submitting) and again to a lead on 7 Aug
       (booked 37s after, call an hour later, sitting in the wrong column).
       Guarding the cron's write with a staleness check was the first attempt
       and it does not work — the check reads the same stale snapshot. One
       writer at creation removes the race instead of narrowing it.

       NOT part of airtableFields on purpose: that object is built from client
       input, and Stage must never be settable from the request body. */
    const atRes = await fetch(LEADS_URL, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: { ...airtableFields, Stage: 'New Lead' } }),
    });
    const atData = await atRes.json();
    if (!atRes.ok) {
      const msg = atData?.error?.message || JSON.stringify(atData);
      console.error('[submit-lead] Airtable error:', msg);
      return res.status(500).json({ error: 'Submission failed' });
    }
  } catch (err) {
    console.error('[submit-lead] Airtable fetch error:', err.message);
    return res.status(500).json({ error: 'Submission failed' });
  }

  /* GoHighLevel is retired (owner, Jul 30 2026) — the outbound lead webhook that
     used to fire here was removed. Leads live in Airtable and are assigned by the
     webapp's own api/lead-notify cron. */

  /* The Make.com webhook that used to fire here was removed with GoHighLevel
     (owner, Jul 30 2026) — its only job was to push the lead into the GHL
     pipeline. Leads live in Airtable; the webapp's api/lead-notify cron owns
     assignment and alerts. */

    /* ── 4. Send email via Resend (HTML-escaped) ── */
  const RESEND_KEY = process.env.RESEND_API_KEY;
  if (RESEND_KEY) {
    const f = sanitised;
    // All values HTML-escaped before insertion into email template
    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(109,40,217,0.10);max-width:600px;width:100%;">

        <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">ליד חדש מהאתר</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions</p>
        </td></tr>

        <tr><td style="padding:32px;">
          ${f['Expedition'] ? `
          <div style="background:#F5F0FF;border-right:4px solid #7c3aed;border-radius:8px;padding:16px 20px;margin-bottom:20px;">
            <p style="margin:0;font-size:12px;color:#9591B0;font-weight:600;">משלחת</p>
            <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#1e1b4b;">${escapeHtml(f['Expedition'])}</p>
          </div>` : ''}

          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECEAF8;border-radius:12px;overflow:hidden;">
            ${row('שם מלא',      f['Name'])}
            ${row('טלפון',       f['Phone'])}
            ${row('מייל',        f['Email'])}
            ${row('חודש מועדף', f['Preferred Month'])}
            ${row('גיל',         f['Age'])}
            ${row('גודל קבוצה', f['Group Size'])}
            ${row('ניסיון',     f['Experience'])}
            ${row('מקור',        f['Source'])}
          </table>

          ${(utm.source || utm.campaign) ? `
          <div style="margin-top:16px;background:#FFF7ED;border:1px solid #FED7AA;border-radius:12px;padding:16px 20px;">
            <p style="margin:0 0 10px;font-size:12px;color:#9A3412;font-weight:700;">📊 UTM / מקור המודעה</p>
            <table width="100%" cellpadding="0" cellspacing="0">
              ${utm.source   ? `<tr><td style="font-size:12px;color:#6B6B8A;padding:3px 0;width:35%;">Source</td><td style="font-size:13px;font-weight:600;color:#1e1b4b;">${escapeHtml(utm.source)}</td></tr>` : ''}
              ${utm.medium   ? `<tr><td style="font-size:12px;color:#6B6B8A;padding:3px 0;">Medium</td><td style="font-size:13px;font-weight:600;color:#1e1b4b;">${escapeHtml(utm.medium)}</td></tr>` : ''}
              ${utm.campaign ? `<tr><td style="font-size:12px;color:#6B6B8A;padding:3px 0;">Campaign</td><td style="font-size:13px;font-weight:600;color:#1e1b4b;">${escapeHtml(utm.campaign)}</td></tr>` : ''}
              ${utm.content  ? `<tr><td style="font-size:12px;color:#6B6B8A;padding:3px 0;">Ad</td><td style="font-size:13px;font-weight:600;color:#1e1b4b;">${escapeHtml(utm.content)}</td></tr>` : ''}
              ${utm.term     ? `<tr><td style="font-size:12px;color:#6B6B8A;padding:3px 0;">Audience</td><td style="font-size:13px;font-weight:600;color:#1e1b4b;">${escapeHtml(utm.term)}</td></tr>` : ''}
            </table>
          </div>` : ''}


          ${f['Message'] ? `
          <div style="margin-top:20px;background:#F9F8FF;border:1px solid #ECEAF8;border-radius:12px;padding:16px 20px;">
            <p style="margin:0 0 8px;font-size:12px;color:#9591B0;font-weight:600;">הודעה</p>
            <p style="margin:0;font-size:14px;color:#1e1b4b;line-height:1.6;">${escapeHtml(f['Message'])}</p>
          </div>` : ''}
        </td></tr>

        <tr><td style="background:#FAFAF8;padding:20px 32px;text-align:center;border-top:1px solid #ECEAF8;">
          <p style="margin:0;font-size:12px;color:#9591B0;">הודעה זו נשלחה אוטומטית מאתר HighAir Expeditions</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:    'HighAir Website <noreply@highair-expeditions.com>',
          to:      ['info@highair-expeditions.com'],
          subject: `ליד חדש - ${escapeHtml(f['Expedition'] || f['Source'] || 'לא צוין')} ✅`,
          html:    emailHtml,
        }),
      });
      if (!emailRes.ok) {
        console.error('[submit-lead] Resend error:', emailRes.status);
      }
    } catch (emailErr) {
      console.warn('[submit-lead] Resend non-fatal:', emailErr.message);
    }
  }

  return res.status(200).json({ ok: true });
}

function row(label, value) {
  if (!value && value !== 0) return '';
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #ECEAF8;background:#FAFAF8;font-size:12px;color:#6B6B8A;font-weight:600;width:35%;vertical-align:top;">${escapeHtml(label)}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #ECEAF8;font-size:14px;color:#1e1b4b;font-weight:500;">${escapeHtml(String(value))}</td>
    </tr>`;
}
