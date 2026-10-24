/* When the 5-minute safety net in api/lead-messaging.js sends a closing welcome
   or a "we tried to reach you" notice, the Lead Center's instant send did not
   happen: the card moved, and nothing went out until the cron caught it. That
   is how two days of late closing messages went unseen in October 2026 (the
   customers got them, minutes late, and nothing told us why). Each such send now
   emails info@ the same day, so a broken instant path is found by us, the first
   time, whatever broke it. Expected exceptions are named in the email: a card
   moved directly in Airtable also lands here. */

const LABEL = { deposit: 'הודעת הסגירה (שילם מקדמה)', noAnswer: 'ההודעה "ניסינו להשיג אותך"' };
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/* items: [{ kind: 'deposit' | 'noAnswer', name, expedition, minutes }] */
export function backupAlert(items) {
  if (!items?.length) return null;
  const rows = items.map(i => `<li>${LABEL[i.kind] || i.kind} ל${esc(i.name || 'ליד')}${i.expedition ? ` (${esc(i.expedition)})` : ''}`
    + `${Number.isFinite(i.minutes) ? `, ${i.minutes} דקות אחרי שהכרטיס הועבר` : ''}</li>`).join('');
  return {
    subject: `HighAir - הודעה ללקוח יצאה רק דרך הגיבוי (${items.length})`,
    html: `<div dir="rtl" style="font-family:Arial,sans-serif;font-size:15px;line-height:1.7">`
      + `<p>ההודעות האלה היו אמורות לצאת ברגע שהכרטיס הועבר במערכת הלידים, ויצאו רק דרך הגיבוי שרץ כל 5 דקות:</p>`
      + `<ul>${rows}</ul>`
      + `<p>אם הכרטיס הועבר ממערכת הלידים, השליחה המיידית לא עבדה וצריך לבדוק למה. אם הוא שונה ישירות ב-Airtable, זה צפוי ואין מה לעשות.</p>`
      + `<p style="color:#666;font-size:13px">הלקוח קיבל את ההודעה. המייל הזה נועד רק כדי שתקלה כזו תתגלה מיד.</p></div>`,
  };
}

export async function sendBackupAlert(items) {
  const mail = backupAlert(items);
  const key = process.env.RESEND_API_KEY;
  if (!mail || !key) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: 'HighAir Website <noreply@highair-expeditions.com>', to: ['info@highair-expeditions.com'], ...mail }),
    });
    return r.ok;
  } catch (e) { console.warn('[backup-alert] non-fatal:', e.message); return false; }
}
