/**
 * POST /api/submit-lead
 * Dedicated endpoint for Website Lead form submissions.
 * Writes to Airtable AND sends email notification via Resend.
 * Not intercepted by Vite dev proxy (which only catches /api/airtable/*).
 */

export const config = { api: { bodyParser: true } };

/* Fields that exist in the Airtable "Website Leads" table */
const AIRTABLE_FIELDS = new Set([
  'Name', 'Phone', 'Email', 'Expedition',
  'Preferred Month', 'Age', 'Group Size', 'Experience', 'Source',
]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;

  if (!TOKEN || !BASE) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const allFields = req.body?.fields || {};
  console.log('[submit-lead] Received lead:', allFields['Name'], '|', allFields['Expedition'] || allFields['Source']);

  // Strip fields that don't exist in Airtable (e.g. Message, Submitted from CTA form)
  const airtableFields = Object.fromEntries(
    Object.entries(allFields).filter(([k, v]) => AIRTABLE_FIELDS.has(k) && v !== undefined && v !== '')
  );

  // ── 1. Write to Airtable ─────────────────────────────────────────────
  try {
    const atRes = await fetch(`https://api.airtable.com/v0/${BASE}/Website%20Leads`, {
      method:  'POST',
      headers: {
        Authorization:  `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: airtableFields }),
    });
    const atData = await atRes.json();
    console.log('[submit-lead] Airtable status:', atRes.status);
    if (!atRes.ok) {
      const msg = atData?.error?.message || atData?.error || JSON.stringify(atData);
      console.error('[submit-lead] Airtable error:', msg);
      return res.status(500).json({ error: msg });
    }
  } catch (err) {
    console.error('[submit-lead] Airtable fetch error:', err.message);
    return res.status(500).json({ error: err.message });
  }

  // ── 2. Send email via Resend ─────────────────────────────────────────
  const RESEND_KEY = process.env.RESEND_API_KEY;

  if (RESEND_KEY) {
    const f = allFields; // use all fields including Message for email
    const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
  <span style="display:none;font-size:1px;color:#F5F0FF;max-height:0;overflow:hidden;opacity:0;">${f['Name'] || ''} שלח/ה את הטופס ${f['Expedition'] || f['Source'] || ''}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</span>
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
            <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#1e1b4b;">${f['Expedition']}</p>
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

          ${f['Message'] ? `
          <div style="margin-top:20px;background:#F9F8FF;border:1px solid #ECEAF8;border-radius:12px;padding:16px 20px;">
            <p style="margin:0 0 8px;font-size:12px;color:#9591B0;font-weight:600;">הודעה</p>
            <p style="margin:0;font-size:14px;color:#1e1b4b;line-height:1.6;">${f['Message']}</p>
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
          subject: `ליד חדש - ${f['Expedition'] || f['Source'] || 'לא צוין'} ✅`,
          html:    emailHtml,
        }),
      });
      const emailData = await emailRes.json();
      console.log('[submit-lead] Resend status:', emailRes.status, '| id:', emailData.id || emailData.message);
      if (!emailRes.ok) {
        console.error('[submit-lead] Resend error:', JSON.stringify(emailData));
      }
    } catch (emailErr) {
      console.warn('[submit-lead] Resend non-fatal error:', emailErr.message);
    }
  }

  return res.status(200).json({ ok: true });
}

function row(label, value) {
  if (!value && value !== 0) return '';
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #ECEAF8;background:#FAFAF8;font-size:12px;color:#6B6B8A;font-weight:600;width:35%;vertical-align:top;">${label}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #ECEAF8;font-size:14px;color:#1e1b4b;font-weight:500;">${value}</td>
    </tr>`;
}
