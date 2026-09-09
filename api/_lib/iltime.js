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

/* ── Jewish festival days ────────────────────────────────────────────────────
 * The days the office is shut and nobody is taking calls (owner, 10 Sep 2026:
 * "לחסום מספר תאריכים לקביעת שיחה בגלל חגים ומועדים"). Israel keeps ONE day of
 * each festival, so this is exactly eight days a year:
 *   1–2 Tishrei  ראש השנה
 *   10 Tishrei   יום כיפור
 *   15 Tishrei   סוכות א׳
 *   22 Tishrei   שמיני עצרת / שמחת תורה
 *   15 Nisan     פסח א׳
 *   21 Nisan     שביעי של פסח
 *   6 Sivan      שבועות
 * Erev chag, chol hamoed and the civil memorial days are deliberately NOT here
 * — the owner chose festival days only; anything else goes in the admin's own
 * blackout list, which still works alongside this.
 *
 * Derived from the date rather than typed into that list, so it holds for every
 * year with nobody maintaining it. The Hebrew date comes from Intl's own hebrew
 * calendar: no library, and the identical answer in the browser and on the
 * server. Noon UTC is deliberate — a Hebrew day begins the evening before, and
 * midday sits safely inside the civil day being asked about whatever the zone.
 *
 * Fails OPEN. If a runtime cannot produce a Hebrew date (a Node built without
 * full ICU), the day stays bookable: a missed closure costs one rescheduled
 * call, a calendar that silently offers nothing costs every call.
 *
 * MIRRORED in the webapp repo at src/utils/time.js — the customer books through
 * /api/slots here and the team books through computeAvailableSlots there, and
 * the two must never disagree about whether a day is open.
 */
const YOM_TOV = {
  'Tishri-1':  'Rosh Hashana',
  'Tishri-2':  'Rosh Hashana',
  'Tishri-10': 'Yom Kippur',
  'Tishri-15': 'Sukkot',
  'Tishri-22': 'Simchat Torah',
  'Nisan-15':  'Passover',
  'Nisan-21':  'Passover (7th day)',
  'Sivan-6':   'Shavuot',
};
let _hebrewFmt = null;
/** 'Tishri-10' for a civil date, or '' when the runtime cannot say. One reader
    for every Hebrew-calendar rule below, so they cannot disagree. */
function hebrewKey(dateStr) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(dateStr || ''))) return '';
  try {
    _hebrewFmt = _hebrewFmt || new Intl.DateTimeFormat('en-u-ca-hebrew', {
      timeZone: 'Asia/Jerusalem', month: 'long', day: 'numeric',
    });
    const p = _hebrewFmt.formatToParts(new Date(`${dateStr}T12:00:00Z`))
      .reduce((o, x) => (o[x.type] = x.value, o), {});
    return (p.month && p.day) ? `${p.month}-${Number(p.day)}` : '';
  } catch { return ''; }
}
/** The festival falling on this date, or '' — the name is what a closed picker
    shows, so a blank day explains itself instead of looking broken. */
export function yomTovName(dateStr) {
  return YOM_TOV[hebrewKey(dateStr)] || '';
}
export const isYomTov = dateStr => !!yomTovName(dateStr);


/* ── Half days: the two eves we close early ─────────────────────────────────
 * Erev Rosh Hashana (29 Elul) and erev Yom Kippur (9 Tishrei) are working days
 * that end at 14:00 (owner, 10 Sep 2026: "ערב יום כיפור וראש השנה אנחנו עובדים
 * חצי יום עד שעה 14:00"). The day stays OPEN and bookable — only the last slot
 * moves, so 13:30 is the last call and it ends at 14:00, exactly how the Friday
 * close already works.
 *
 * Only these two. The other eves — Sukkot, Pesach, Shavuot — are still full
 * days here, which is what the owner asked for; they can join by adding their
 * Hebrew date below.
 *
 * MIRRORED, like isYomTov above and for the same reason.
 */
export const HALF_DAY_END = '14:00';
const HALF_DAYS = {
  'Elul-29':   'Erev Rosh Hashana',
  'Tishri-9':  'Erev Yom Kippur',
};
/** The half day falling on this date, or '' — the name is what the picker
    shows, so a short day explains itself rather than looking under-booked. */
export function halfDayName(dateStr) {
  return HALF_DAYS[hebrewKey(dateStr)] || '';
}
