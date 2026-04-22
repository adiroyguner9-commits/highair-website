/**
 * Flat Airtable proxy — replaces the broken subdirectory catch-all.
 *
 * Vercel does not reliably route subdirectory catch-all functions
 * (api/airtable/[...path].js) — requests fall through to the SPA rewrite.
 * This flat file at /api/at always works.
 *
 * vercel.json rewrites forward:
 *   /api/airtable/:table     → /api/at?table=:table
 *   /api/airtable/:table/:id → /api/at?table=:table&id=:id
 *
 * Query params set by the rewrite:
 *   table  — Airtable table name (e.g. "Customers")
 *   id     — optional record ID (e.g. "rec1234")
 *   (all other query params are forwarded verbatim to Airtable)
 */

export const config = { api: { bodyParser: true } };

const ALLOWED_METHODS = new Set(['GET', 'POST', 'PATCH']);

/* ── Table allowlist — only these tables may be accessed via this proxy ── */
const READ_TABLES = new Set([
  'Customers', 'Groups', 'Suppliers', 'FlightAgents',
  'InsuranceAgents', 'SalesAgents', 'Documents', 'AppContent',
  'Website Leads',
]);
const WRITE_TABLES = new Set([
  'Customers', 'Groups', 'Documents', 'AppContent',
  'Website Leads',
]);

export default async function handler(req, res) {
  try {
    if (!ALLOWED_METHODS.has(req.method)) {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    // SECURITY: Never use VITE_-prefixed env vars here — those are compiled into
    // the browser bundle by Vite.  Only non-VITE_ vars are server-only.
    const TOKEN = process.env.AIRTABLE_TOKEN;
    const BASE  = process.env.AIRTABLE_BASE;

    if (!TOKEN || !BASE) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Table name and optional record ID injected by vercel.json rewrite
    const table    = (req.query.table    || '').trim();
    const recordId = (req.query.id       || '').trim();

    if (!table) {
      return res.status(400).json({ error: 'Missing "table" query parameter' });
    }

    // ── Table allowlist check ─────────────────────────────────────────
    if (!READ_TABLES.has(table)) {
      console.warn(`[at] BLOCKED request to unlisted table "${table}"`);
      return res.status(403).json({ error: 'Access denied' });
    }
    if ((req.method === 'POST' || req.method === 'PATCH') && !WRITE_TABLES.has(table)) {
      console.warn(`[at] BLOCKED write to read-only table "${table}"`);
      return res.status(403).json({ error: 'Access denied' });
    }

    console.log(`[at] ${req.method} table="${table}" id="${recordId || '-'}"`);


    // ── Rebuild forwarded query string (strip proxy-only params) ──────
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(req.query)) {
      if (key === 'table' || key === 'id') continue;
      const values = Array.isArray(val) ? val : [val];
      values.forEach(v => params.append(key, v));
    }
    const qs = params.toString();

    // ── Build Airtable target URL ─────────────────────────────────────
    const basePath = recordId
      ? `https://api.airtable.com/v0/${BASE}/${table}/${recordId}`
      : `https://api.airtable.com/v0/${BASE}/${table}`;
    const url = `${basePath}${qs ? '?' + qs : ''}`;

    console.log(`[at] → ${url.replace(BASE, BASE.slice(0,10) + '…')}`);

    const upstream = await fetch(url, {
      method:  req.method,
      headers: {
        Authorization:  `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: ['POST', 'PATCH'].includes(req.method) ? JSON.stringify(req.body) : undefined,
    });

    const data = await upstream.json();
    console.log(`[at] Airtable responded HTTP ${upstream.status}`);

    // ── Email notification for new Website Leads ──────────────────────
    if (req.method === 'POST' && table === 'Website Leads' && upstream.status === 200) {
      const RESEND_KEY = process.env.RESEND_API_KEY;
      if (RESEND_KEY) {
        const f = req.body?.fields || {};
        const emailHtml = `
<!DOCTYPE html>
<html dir="rtl" lang="he">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(109,40,217,0.10);max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">🏔️ ליד חדש מהאתר</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <table width="100%" cellpadding="0" cellspacing="0">

            ${f['Expedition'] ? `
            <tr><td style="padding-bottom:20px;">
              <div style="background:#F5F0FF;border-right:4px solid #7c3aed;border-radius:8px;padding:16px 20px;">
                <p style="margin:0;font-size:12px;color:#9591B0;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">משלחת</p>
                <p style="margin:6px 0 0;font-size:18px;font-weight:700;color:#1e1b4b;">${f['Expedition']}</p>
              </div>
            </td></tr>` : ''}

            <tr><td style="padding-bottom:24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ECEAF8;border-radius:12px;overflow:hidden;">
                ${row('👤 שם מלא', f['Name'])}
                ${row('📱 טלפון', f['Phone'])}
                ${row('📧 מייל', f['Email'])}
                ${row('📅 חודש מועדף', f['Preferred Month'])}
                ${row('🎂 גיל', f['Age'])}
                ${row('👥 גודל קבוצה', f['Group Size'])}
                ${row('🏔️ ניסיון', f['Experience'])}
                ${row('📍 מקור', f['Source'])}
              </table>
            </td></tr>

            <tr><td style="text-align:center;padding-top:8px;">
              <a href="https://airtable.com" style="display:inline-block;background:linear-gradient(135deg,#4338ca,#7c3aed);color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:50px;font-size:15px;font-weight:700;">פתח ב-Airtable →</a>
            </td></tr>

          </table>
        </td></tr>

        <!-- Footer -->
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
              subject: `🏔️ ליד חדש: ${f['Name'] || 'לא צוין'} — ${f['Expedition'] || 'לא צוין'}`,
              html:    emailHtml,
            }),
          });
          const emailData = await emailRes.json();
          if (!emailRes.ok) {
            console.warn('[at] Resend warning:', JSON.stringify(emailData));
          } else {
            console.log('[at] Email sent via Resend, id:', emailData.id);
          }
        } catch (emailErr) {
          // Never block the response — email failure is non-critical
          console.warn('[at] Resend error (non-fatal):', emailErr.message);
        }
      } else {
        console.log('[at] RESEND_API_KEY not set — email notification skipped');
      }
    }

    return res.status(upstream.status).json(data);

  } catch (err) {
    console.error('[at] error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}

/* ── Email row helper ──────────────────────────────────────────────── */
function row(label, value) {
  if (!value && value !== 0) return '';
  return `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #ECEAF8;background:#FAFAF8;font-size:12px;color:#6B6B8A;font-weight:600;width:35%;vertical-align:top;">${label}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #ECEAF8;font-size:14px;color:#1e1b4b;font-weight:500;">${value}</td>
    </tr>`;
}
