/**
 * POST /api/book-slot
 * Books a 30-min call slot, saves to Airtable "Appointments",
 * sends confirmation email (+ .ics attachment) to client,
 * sends admin notification with WhatsApp link + Google Calendar button.
 */

export const config = { api: { bodyParser: true } };

const HE_MONTHS = ['ינואר','פברואר','מרץ','אפריל','מאי','יוני',
                   'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר'];
const HE_DAYS   = ['ראשון','שני','שלישי','רביעי','חמישי','שישי','שבת'];

function formatDateHe(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return `יום ${HE_DAYS[d.getDay()]}, ${d.getDate()} ב${HE_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ── ICS helpers ── */
function icsDateTimes(date, time) {
  const pad = n => String(n).padStart(2, '0');
  const [h, m]       = time.split(':').map(Number);
  const [yr, mo, dy] = date.split('-').map(Number);
  const d0           = new Date(yr, mo - 1, dy);
  const lastSunMar   = new Date(yr, 2, 31 - new Date(yr, 2, 31).getDay());
  const lastSunOct   = new Date(yr, 9, 31 - new Date(yr, 9, 31).getDay());
  const offset       = (d0 >= lastSunMar && d0 < lastSunOct) ? 3 : 2;
  const startUTC     = h * 60 + m - offset * 60;
  const endUTC       = startUTC + 30;
  const toHHMM = min => `${pad(Math.floor(min / 60))}${pad(min % 60)}`;
  const ds = `${yr}${pad(mo)}${pad(dy)}`;
  return {
    dtStart: `${ds}T${toHHMM(startUTC)}00Z`,
    dtEnd:   `${ds}T${toHHMM(endUTC)}00Z`,
    uid:     `${date}T${time.replace(':', '')}@highair-expeditions.com`,
  };
}

/* Client ICS — METHOD:PUBLISH */
function generateICS({ date, time, name, expedition }) {
  const { dtStart, dtEnd, uid } = icsDateTimes(date, time);
  const desc = expedition ? `שיחה לגבי משלחת: ${expedition}` : 'שיחה עם HighAir Expeditions';
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HighAir Expeditions//IL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    'SUMMARY:שיחה עם HighAir Expeditions',
    `DESCRIPTION:${desc}`,
    `UID:${uid}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/* Admin ICS — METHOD:REQUEST → iOS Mail shows Accept/Decline banner automatically */
function generateAdminICS({ date, time, name, expedition }) {
  const { dtStart, dtEnd, uid } = icsDateTimes(date, time);
  const desc = [`לקוח: ${name}`, expedition ? `משלחת: ${expedition}` : ''].filter(Boolean).join('\\n');
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HighAir Expeditions//IL',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:שיחה עם ${name}`,
    `DESCRIPTION:${desc}`,
    'ORGANIZER;CN=HighAir Expeditions:mailto:noreply@highair-expeditions.com',
    'ATTENDEE;CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;PARTSTAT=NEEDS-ACTION;RSVP=TRUE;CN=HighAir Admin:mailto:info@highair-expeditions.com',
    `UID:${uid}`,
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

/* ── Google Calendar URL ── */
function googleCalUrl({ date, time, name, expedition }) {
  const pad = n => String(n).padStart(2, '0');
  const [h, m] = time.split(':').map(Number);
  const [yr, mo, dy] = date.split('-').map(Number);

  const dtStart = `${yr}${pad(mo)}${pad(dy)}T${pad(h)}${pad(m)}00`;
  const endTotalMin = h * 60 + m + 30;
  const dtEnd = `${yr}${pad(mo)}${pad(dy)}T${pad(Math.floor(endTotalMin / 60))}${pad(endTotalMin % 60)}00`;

  const params = new URLSearchParams({
    action:  'TEMPLATE',
    text:    `שיחה עם ${name} — HighAir Expeditions`,
    dates:   `${dtStart}/${dtEnd}`,
    ctz:     'Asia/Jerusalem',
    details: expedition ? `משלחת: ${expedition}` : 'HighAir Expeditions',
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}

/* ── Send email via Resend ── */
async function sendEmail(key, { to, subject, html, attachments }) {
  try {
    const body = {
      from:    'HighAir Expeditions <noreply@highair-expeditions.com>',
      to:      [to],
      subject,
      html,
    };
    if (attachments?.length) body.attachments = attachments;

    const r = await fetch('https://api.resend.com/emails', {
      method:  'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    });
    if (!r.ok) console.error('[book-slot] email error:', await r.text());
  } catch (e) { console.warn('[book-slot] email non-fatal:', e.message); }
}

/* ════════════════════════════════════════════ */
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { date, time, name, phone, email, expedition } = req.body || {};
  if (!date || !time || !name || !phone) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) return res.status(500).json({ error: 'Server config error' });

  // 1. Race-condition guard
  try {
    const formula = encodeURIComponent(`AND({Date}="${date}",{Time}="${time}",{Status}="confirmed")`);
    const chk     = await fetch(
      `https://api.airtable.com/v0/${BASE}/Appointments?filterByFormula=${formula}&fields[]=Time`,
      { headers: { Authorization: `Bearer ${TOKEN}` } }
    );
    const chkData = await chk.json();
    if ((chkData.records?.length || 0) > 0) {
      return res.status(409).json({ error: 'slot_taken' });
    }
  } catch (e) { console.warn('[book-slot] availability check failed:', e.message); }

  // 2. Write to Airtable
  const atRes = await fetch(`https://api.airtable.com/v0/${BASE}/Appointments`, {
    method:  'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fields: {
        Date:       date,
        Time:       time,
        Name:       name,
        Phone:      phone,
        Email:      email      || '',
        Expedition: expedition || '',
        Status:     'confirmed',
      },
    }),
  });
  if (!atRes.ok) {
    const err = await atRes.json();
    console.error('[book-slot] Airtable error:', err);
    return res.status(500).json({ error: err.error?.message || 'Booking failed' });
  }

  // 3. WhatsApp confirmation to client via Green API
  const GA_INSTANCE = process.env.GREENAPI_INSTANCE;
  const GA_TOKEN    = process.env.GREENAPI_TOKEN;
  if (GA_INSTANCE && GA_TOKEN && phone) {
    try {
      const clientNum = phone.replace(/^0/, '972').replace(/-/g, '').replace(/\s/g, '');
      const waMessage = `היי ${name} 👋🏼\n\nהשיחה שלך לגבי ${expedition || 'HighAir Expeditions'} שוריינה בהצלחה! 🏔️\n\n🗓️ מתי? ${formatDateHe(date)}\n⏰ שעה: ${time}\n\nאנחנו נתקשר אליך בזמן שנקבע. מצפים לשוחח איתך! 😁`;
      const gaRes = await fetch(
        `https://api.green-api.com/waInstance${GA_INSTANCE}/sendMessage/${GA_TOKEN}`,
        {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chatId: `${clientNum}@c.us`, message: waMessage }),
        }
      );
      const gaData = await gaRes.json();
      console.log('[book-slot] WhatsApp status:', gaRes.status, gaData?.idMessage || gaData);
    } catch (e) {
      console.warn('[book-slot] WhatsApp non-fatal:', e.message);
    }
  }

  // 4. Build shared assets
  const RESEND_KEY = process.env.RESEND_API_KEY;
  const dateHe     = formatDateHe(date);
  const clientNum  = phone.replace(/^0/, '972').replace(/-/g, '');
  const waText     = encodeURIComponent(
    `שלום ${name}!\nהשיחה שלך עם HighAir Expeditions אושרה 🏔️\n📅 ${dateHe}\n🕐 ${time}\nנשמח לדבר איתך בקרוב!`
  );
  const waLink  = `https://wa.me/${clientNum}?text=${waText}`;
  const gcalUrl = googleCalUrl({ date, time, name, expedition });

  // ICS for client — PUBLISH format (regular event)
  const icsContent = generateICS({ date, time, name, expedition });
  const icsBase64  = Buffer.from(icsContent, 'utf-8').toString('base64');
  const icsAttachment = [{
    filename:     'highair-meeting.ics',
    content:      icsBase64,
    content_type: 'text/calendar; charset=utf-8; method=PUBLISH',
  }];

  // ICS for admin — REQUEST format (iOS shows Accept/Decline banner automatically)
  const adminIcsContent = generateAdminICS({ date, time, name, expedition });
  const adminIcsBase64  = Buffer.from(adminIcsContent, 'utf-8').toString('base64');
  const adminIcsAttachment = [{
    filename:     'highair-meeting.ics',
    content:      adminIcsBase64,
    content_type: 'text/calendar; charset=utf-8; method=REQUEST',
  }];

  // Direct ICS link — for iOS/macOS (opens Calendar app directly)
  const icsParams  = new URLSearchParams({ date, time, name: name || '', expedition: expedition || '' });
  const icsLink    = `https://highair-website.vercel.app/api/calendar-invite?${icsParams}`;

  if (RESEND_KEY) {

    // ── Client email ─────────────────────────────────────────────────────
    if (email) {
      await sendEmail(RESEND_KEY, {
        to:          email,
        subject:     `השיחה שלך נקבעה ל-${dateHe} ✅`,
        attachments: icsAttachment,
        html: `
<!DOCTYPE html><html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0"
      style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(109,40,217,0.10);max-width:600px;width:100%;">

      <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:28px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">השיחה נקבעה!</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions</p>
      </td></tr>

      <tr><td style="padding:36px;text-align:center;">
        <p style="margin:0 0 4px;font-size:14px;color:#9591B0;">שלום ${name},</p>
        <p style="margin:0 0 28px;font-size:15px;color:#1e1b4b;line-height:1.6;">קבענו לך שיחה עם הצוות שלנו.</p>

        <div style="background:#F5F0FF;border-radius:12px;padding:20px 32px;margin-bottom:28px;">
          <p style="margin:0 0 6px;font-size:14px;color:#7c3aed;font-weight:700;">${dateHe}</p>
          <p style="margin:0;font-size:36px;color:#1e1b4b;font-weight:800;letter-spacing:-1px;">${time}</p>
          ${expedition ? `<p style="margin:8px 0 0;font-size:13px;color:#9591B0;">משלחת: ${expedition}</p>` : ''}
        </div>

        <table cellpadding="0" cellspacing="0" style="margin:0 auto 24px;">
          <tr>
            <td style="padding:4px;" align="center">
              <a href="${gcalUrl}"
                style="display:inline-block;background:#4285F4;color:#fff;text-decoration:none;
                       padding:12px 22px;border-radius:50px;font-size:14px;font-weight:700;">
                הוסף ל-Google Calendar
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 4px 0;" align="center">
              <a href="${icsLink}"
                style="display:inline-block;background:#1C1C1E;color:#fff;text-decoration:none;
                       padding:12px 22px;border-radius:50px;font-size:14px;font-weight:700;">
                הוסף ל-Apple Calendar
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 4px 0;" align="center">
              <p style="margin:0;font-size:12px;color:#9591B0;">או פתח את הקובץ המצורף לכל יומן אחר</p>
            </td>
          </tr>
        </table>

        <p style="margin:0;font-size:13px;color:#9591B0;line-height:1.7;">
          נשמח לדבר איתך!<br>
          לכל שאלה: <a href="mailto:info@highair-expeditions.com" style="color:#7c3aed;">info@highair-expeditions.com</a>
        </p>
      </td></tr>

      <tr><td style="background:#FAFAF8;padding:20px 32px;text-align:center;border-top:1px solid #ECEAF8;">
        <p style="margin:0;font-size:12px;color:#9591B0;">הודעה זו נשלחה אוטומטית מאתר HighAir Expeditions</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
      });
    }

    // ── Admin email ───────────────────────────────────────────────────────
    await sendEmail(RESEND_KEY, {
      to:          'info@highair-expeditions.com',
      subject:     `נקבעה שיחה חדשה - ${name} 📅`,
      attachments: adminIcsAttachment,
      html: `
<!DOCTYPE html><html dir="rtl" lang="he">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#F5F0FF;font-family:Arial,sans-serif;direction:rtl;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0FF;padding:32px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0"
      style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(109,40,217,0.10);max-width:600px;width:100%;">

      <tr><td style="background:linear-gradient(135deg,#4338ca,#7c3aed);padding:28px 32px;text-align:center;">
        <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">שיחה חדשה נקבעה</h1>
        <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:14px;">HighAir Expeditions</p>
      </td></tr>

      <tr><td style="padding:32px;">
        <table width="100%" style="border:1px solid #ECEAF8;border-radius:12px;overflow:hidden;margin-bottom:24px;">
          ${row('שם',    name)}
          ${row('טלפון', phone)}
          ${email      ? row('מייל',   email)      : ''}
          ${expedition ? row('משלחת', expedition) : ''}
          ${row2('תאריך', dateHe)}
          ${row2('שעה',   time)}
        </table>

        <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:12px;">
          <tr>
            <td style="padding:4px;" align="center">
              <a href="${gcalUrl}"
                style="display:inline-block;background:#4285F4;color:#fff;text-decoration:none;
                       padding:13px 28px;border-radius:50px;font-size:14px;font-weight:700;">
                הוסף ל-Google Calendar
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:6px 4px 4px;" align="center">
              <a href="${icsLink}"
                style="display:inline-block;background:#1C1C1E;color:#fff;text-decoration:none;
                       padding:13px 28px;border-radius:50px;font-size:14px;font-weight:700;">
                הוסף ל-Apple Calendar
              </a>
            </td>
          </tr>
        </table>
        <p style="text-align:center;margin:0;font-size:12px;color:#9591B0;">
          ב-iPhone: המייל אמור להציג כפתור "קבל" ישירות בראש ההודעה
        </p>
      </td></tr>

      <tr><td style="background:#FAFAF8;padding:20px 32px;text-align:center;border-top:1px solid #ECEAF8;">
        <p style="margin:0;font-size:12px;color:#9591B0;">הודעה זו נשלחה אוטומטית מאתר HighAir Expeditions</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
    });
  }

  return res.json({ ok: true });
}

function row(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:12px 16px;background:#FAFAF8;font-size:12px;color:#6B6B8A;font-weight:600;width:35%;border-bottom:1px solid #ECEAF8;">${label}</td>
    <td style="padding:12px 16px;font-size:14px;color:#1e1b4b;font-weight:500;border-bottom:1px solid #ECEAF8;">${value}</td>
  </tr>`;
}
function row2(label, value) {
  if (!value) return '';
  return `<tr>
    <td style="padding:12px 16px;background:#F5F0FF;font-size:12px;color:#6B6B8A;font-weight:600;width:35%;border-bottom:1px solid #ECEAF8;">${label}</td>
    <td style="padding:12px 16px;font-size:16px;color:#7c3aed;font-weight:700;border-bottom:1px solid #ECEAF8;">${value}</td>
  </tr>`;
}
