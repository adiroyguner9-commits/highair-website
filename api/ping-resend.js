/**
 * GET /api/ping-resend
 * Quick diagnostic: attempts to send a test email via Resend and returns the result.
 * Remove this file once email delivery is confirmed working.
 */
export default async function handler(req, res) {
  const KEY = process.env.RESEND_API_KEY;

  if (!KEY) {
    return res.status(500).json({
      ok: false,
      stage: 'env',
      error: 'RESEND_API_KEY is not set in this environment',
    });
  }

  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'HighAir Website <noreply@highair-expeditions.com>',
        to:      ['info@highair-expeditions.com'],
        subject: '✅ בדיקת חיבור Resend — HighAir',
        html:    '<p dir="rtl">אם קיבלת את המייל הזה — Resend עובד תקין מהאתר 🎉</p>',
      }),
    });

    const body = await r.json();

    return res.status(200).json({
      ok:          r.ok,
      resendStatus: r.status,
      keyPrefix:   KEY.slice(0, 8) + '…',
      response:    body,
    });
  } catch (err) {
    return res.status(500).json({
      ok:    false,
      stage: 'fetch',
      error: err.message,
    });
  }
}
