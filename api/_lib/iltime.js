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
