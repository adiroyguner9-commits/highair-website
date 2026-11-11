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

/* ── An Israel wall-clock time as the instant it is ──────────────────────────
 * Three files each carried their own daylight-saving rule: "summer time from
 * the last Sunday of March". Israel moves its clocks on the FRIDAY before that
 * Sunday, so on that Friday and Saturday the rule said UTC+2 while Israel was
 * already on UTC+3: a call booked for 10:00 went into the calendars at 11:00,
 * and a lead that arrived at 10:00 was stamped an hour late (audit W29, 12 Nov
 * 2026). No rule is written here. Intl is asked what the offset is at that
 * moment, so the switch days are whatever Israel's law says they are.
 *
 * israelWallTimeToISO is the same function as the webapp's api/_lib/time.js,
 * which writes the reschedule and cancel invites for the same calls: the two
 * must give one answer or a moved call lands at a different hour.
 */
function israelParts(date) {
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jerusalem', hourCycle: 'h23',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).formatToParts(date).reduce((a, x) => ((a[x.type] = x.value), a), {});
  return { ...p, hour: p.hour === '24' ? '00' : p.hour };
}
/** Minutes Israel is ahead of UTC at this instant: 120 in winter, 180 in summer. */
export function israelOffsetMinutes(date = new Date()) {
  const p = israelParts(date);
  const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
  return Math.round((asUTC - Math.floor(date.getTime() / 1000) * 1000) / 60000);
}
/** Israel wall clock ('YYYY-MM-DD', 'HH:mm') → the UTC ISO instant. */
export function israelWallTimeToISO(dateStr, timeStr = '00:00') {
  if (!dateStr) return '';
  const [y, mo, d] = String(dateStr).slice(0, 10).split('-').map(Number);
  const [h, mi] = String(timeStr || '00:00').split(':').map(Number);
  const guess = Date.UTC(y, mo - 1, d, h || 0, mi || 0);
  const off = israelOffsetMinutes(new Date(guess));
  let utc = guess - off * 60000;
  const off2 = israelOffsetMinutes(new Date(utc));
  if (off2 !== off) utc = guess - off2 * 60000;
  return new Date(utc).toISOString();
}
/** A call's start and end as the UTC stamps a calendar file takes
    ('20270326T070000Z'). A call is half an hour. */
export function israelCallStamps(dateStr, timeStr, minutes = 30) {
  const start = new Date(israelWallTimeToISO(dateStr, timeStr));
  const stamp = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  return { dtStart: stamp(start), dtEnd: stamp(new Date(start.getTime() + minutes * 60000)) };
}
/** An instant written the way Israel reads it, with its own offset:
    '2027-03-26T10:00:00+03:00'. Sortable, and the same instant in any reader. */
export function israelStamp(date = new Date()) {
  const p = israelParts(date);
  const off = israelOffsetMinutes(date);
  const pad = n => String(n).padStart(2, '0');
  const sign = off < 0 ? '-' : '+';
  const abs = Math.abs(off);
  return `${p.year}-${p.month}-${p.day}T${p.hour}:${p.minute}:${p.second}${sign}${pad(Math.floor(abs / 60))}:${pad(abs % 60)}`;
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

/* The weekend hold, plus the festivals (owner, 22 Oct 2026: "כולל בחגים"):
   all of a festival day, from 15:00 on its eve (the half days and the evening
   before any festival), and until 09:00 the morning after, the same shape as
   Friday to Sunday. Nudge 2 and the 4-day follow-up went out on Rosh Hashana
   and Yom Kippur 2026. */
export function israelClosedHold(now = israelNow()) {
  if (israelWeekendHold(now)) return true;
  if (isYomTov(now.ymd)) return true;
  const shift = days => { const d = new Date(`${now.ymd}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + days); return d.toISOString().slice(0, 10); };
  if (now.minutes >= 15 * 60 && (isYomTov(shift(1)) || halfDayName(now.ymd))) return true;   // erev chag
  if (now.minutes < 9 * 60 && isYomTov(shift(-1))) return true;                                // the morning after
  return false;
}
