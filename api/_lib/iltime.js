/* Israel wall-clock "now" for serverless code.
 *
 * Vercel functions run in UTC, so a bare `new Date().getHours()` is Israel
 * minus 2-3 hours depending on DST. That exact trap made the booking flow's
 * "2 hours ahead" buffer act as ONE HOUR INTO THE PAST in summer — a customer
 * booked today's 10:30 slot at 10:35 (July 16, 2026) because the server
 * thought it was 07:35. Intl with an explicit timeZone is DST-safe: it returns
 * +3 in summer and +2 in winter without us encoding the switch dates.
 */
export function israelNow() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jerusalem', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit',
  }).formatToParts(new Date());
  const get = t => parts.find(p => p.type === t)?.value || '00';
  return {
    ymd:     `${get('year')}-${get('month')}-${get('day')}`,   // Israel calendar date
    minutes: Number(get('hour')) * 60 + Number(get('minute')), // minutes since Israel midnight
  };
}

/* The company weekend: no automated message reaches a customer from Friday
 * 15:00 until Sunday 09:00 Israel time (owner, Aug 14 2026 — "זה סופש ואנחנו
 * לא עובדים"). The point is not politeness about the hour, it is that a message
 * invites a reply and nobody is here to answer it until Sunday.
 *
 * The weekday is derived from `ymd`, which is already the ISRAEL calendar date,
 * rather than from a locale-formatted weekday name (en-CA renders "Fri." with a
 * period, en-US without — a difference that would silently disable this). Read
 * as UTC because ymd carries no zone of its own.
 *
 * Callers must be sure their send can WAIT up to 42 hours. A message whose
 * eligibility window is narrower than that is not delayed by this, it is lost.
 */
export function israelWeekendHold(now = israelNow()) {
  const dow = new Date(`${now.ymd}T00:00:00Z`).getUTCDay();   // 0 Sun … 5 Fri, 6 Sat
  if (dow === 5) return now.minutes >= 15 * 60;   // Friday, from 15:00
  if (dow === 6) return true;                     // all of Saturday
  if (dow === 0) return now.minutes < 9 * 60;     // Sunday, until 09:00
  return false;
}
