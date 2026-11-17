/* Leads from the English site, the same way as the Hebrew ones (owner, 17 Nov 2026: "אני רוצה שבאתר
   באנגלית יהיה אותו מודל כמו באתר בעברית שליד מגיש טופס אז שיוכל לקבוע שיחה ואם לא אז שיקבל הודעה
   באנגלית כמו הפלואו בעברית", then "ושהלידים באתר באנגלית יגיעו רק לתומר לן", and his answers the same
   day: WhatsApp in English like the Hebrew flow, the English site only (German and Spanish stay email
   only), the calendar in Israel time, and the messages we start inside 09:00-20:00 at the LEAD's hour).

   What an English lead gets, like a Hebrew one: the calendar right after the form; the first message
   with the booking link (10 minutes), the second one (24 hours), the booking confirmation, the reminder
   before the call, the moved-call notice, "we tried to reach you", the follow-up after the call, and the
   welcome after the deposit. Their call is always Tomer Lan's.

   Kept in step by hand with the webapp (api/_lib/assign.js ENGLISH_LEAD_AGENT, src/data/leadLanguage.js). */
import { destInfo, destEn } from './dest.js';
import { firstName } from './name.js';
export { isEnglishLead, ENGLISH_LEAD_AGENT } from './lead-channel.js';   // who is an English lead: one rule, there

export const SITE_EN = 'https://en.highair-expeditions.com';

/* ── The lead's own hour, from the phone's country code ─────────────────────
   A time zone per prefix, the main one where a country has several (the USA and Canada take New York,
   Australia Sydney, Russia Moscow, Brazil São Paulo). Longest prefix first; unknown, Israel. */
const TZ_BY_CODE = [
  ['1', 'America/New_York'], ['7', 'Europe/Moscow'], ['20', 'Africa/Cairo'], ['27', 'Africa/Johannesburg'],
  ['30', 'Europe/Athens'], ['31', 'Europe/Amsterdam'], ['32', 'Europe/Brussels'], ['33', 'Europe/Paris'],
  ['34', 'Europe/Madrid'], ['36', 'Europe/Budapest'], ['39', 'Europe/Rome'], ['40', 'Europe/Bucharest'],
  ['41', 'Europe/Zurich'], ['43', 'Europe/Vienna'], ['44', 'Europe/London'], ['45', 'Europe/Copenhagen'],
  ['46', 'Europe/Stockholm'], ['47', 'Europe/Oslo'], ['48', 'Europe/Warsaw'], ['49', 'Europe/Berlin'],
  ['51', 'America/Lima'], ['52', 'America/Mexico_City'], ['54', 'America/Argentina/Buenos_Aires'],
  ['55', 'America/Sao_Paulo'], ['56', 'America/Santiago'], ['57', 'America/Bogota'], ['60', 'Asia/Kuala_Lumpur'],
  ['61', 'Australia/Sydney'], ['62', 'Asia/Jakarta'], ['63', 'Asia/Manila'], ['64', 'Pacific/Auckland'],
  ['65', 'Asia/Singapore'], ['66', 'Asia/Bangkok'], ['81', 'Asia/Tokyo'], ['82', 'Asia/Seoul'],
  ['84', 'Asia/Ho_Chi_Minh'], ['86', 'Asia/Shanghai'], ['90', 'Europe/Istanbul'], ['91', 'Asia/Kolkata'],
  ['351', 'Europe/Lisbon'], ['352', 'Europe/Luxembourg'], ['353', 'Europe/Dublin'], ['354', 'Atlantic/Reykjavik'],
  ['357', 'Asia/Nicosia'], ['358', 'Europe/Helsinki'], ['359', 'Europe/Sofia'], ['370', 'Europe/Vilnius'],
  ['371', 'Europe/Riga'], ['372', 'Europe/Tallinn'], ['380', 'Europe/Kyiv'], ['381', 'Europe/Belgrade'],
  ['385', 'Europe/Zagreb'], ['386', 'Europe/Ljubljana'], ['420', 'Europe/Prague'], ['421', 'Europe/Bratislava'],
  ['852', 'Asia/Hong_Kong'], ['886', 'Asia/Taipei'], ['971', 'Asia/Dubai'], ['972', 'Asia/Jerusalem'],
  ['974', 'Asia/Qatar'], ['966', 'Asia/Riyadh'], ['962', 'Asia/Amman'], ['995', 'Asia/Tbilisi'],
].sort((a, b) => b[0].length - a[0].length);

/** The lead's time zone from an international phone (+44 7…, 0044…, 447…). Israeli and unknown: Israel. */
export function leadTimeZone(phone) {
  let d = String(phone || '').replace(/\D/g, '');
  if (d.startsWith('00')) d = d.slice(2);
  if (!d || d.startsWith('0') || (d.length === 9 && d.startsWith('5'))) return 'Asia/Jerusalem';
  const hit = TZ_BY_CODE.find(([code]) => d.startsWith(code));
  return hit ? hit[1] : 'Asia/Jerusalem';
}

/** Minutes since midnight in that zone, now. */
export function minutesIn(timeZone, now = new Date()) {
  const p = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(now);
  const get = t => Number(p.find(x => x.type === t)?.value || 0);
  return get('hour') * 60 + get('minute');
}

/** May a message WE start go to this phone now: 09:00-20:00 at its own hour (iltime.js SEND_FROM/UNTIL). */
export function inLeadWindow(phone, now = new Date(), from = 9 * 60, until = 20 * 60) {
  const m = minutesIn(leadTimeZone(phone), now);
  return m >= from && m < until;
}

/* ── The texts, the Hebrew ones in English ───────────────────────────────────
   Our own flights line is left out: a customer abroad flies from home, not with our ticketing. */
/* The site's own English name where the staff one differs (the 15 Nov 2026 uniformity: "Kilimanjaro Kosher"). */
const SITE_NAME = { 'kilimanjaro-kosher': 'Kilimanjaro Kosher' };
const tripEn = expedition => { const { slug } = destInfo(expedition); return slug !== 'call' ? (SITE_NAME[slug] || destEn(expedition) || '') : ''; };
const about  = expedition => tripEn(expedition) || 'our expeditions';

function greetEn(phone, now = new Date()) {
  const h = Math.floor(minutesIn(leadTimeZone(phone), now) / 60);
  return h < 12 ? 'good morning' : h < 18 ? 'good afternoon' : 'good evening';
}

/** "Thursday, 20 November" for a YYYY-MM-DD */
export function formatDateEn(ymd) {
  const d = new Date(`${String(ymd).slice(0, 10)}T12:00:00Z`);
  return Number.isNaN(d.getTime()) ? String(ymd || '') : new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' }).format(d);
}

export function msgNudgeEn(name, expedition, code) {
  const { slug } = destInfo(expedition);
  return `Hi ${firstName(name)}, we saw you're interested in ${about(expedition)} with HighAir 🏔️\n\n`
    + `To give you all the details and make sure it's the right fit, we'd love to set up a short call (no commitment).\n\n`
    + `Pick a day and time that suit you here 👇\n${SITE_EN}/book/${slug}/${code}`;
}

export function msgNudge2En(name, expedition, phone, now = new Date()) {
  return `Hi ${firstName(name)}, ${greetEn(phone, now)} 🙂\nWhen would be a good time for us to talk about ${about(expedition)}?`;
}

export function msgNoAnswerEn(name, expedition, agentFirst, agentPhone) {
  return `Hi ${firstName(name)} 🙂\n\n`
    + `${agentFirst || 'Someone'} from our team tried to call you about ${about(expedition)} but couldn't reach you.\n\n`
    + `You can call back directly on ${agentPhone}, or simply reply here and we'll get back to you.`;
}

export function msgFollowUpEn(name, expedition) {
  const trip = tripEn(expedition);
  return `Hi ${firstName(name)}, how are you? ✨\n\n`
    + `A quick update: our ${trip ? `${trip} groups are` : 'groups are'} filling up fast and the departure is already guaranteed! 🏔️\n\n`
    + `Let us know where you stand, so we can move ahead and hold your place in one of our groups 💪🏻`;
}

export function msgDepositAEn(name, personalArea) {
  return `Hi ${firstName(name)}, wonderful, your payment has been received! 🥳\n\n`
    + `From now on, everything you need for the trip is in one place, your personal area at HighAir: the full itinerary, the payment stages, the training plan, the gear list, and the options to upgrade your accommodation and rent gear.\n\n`
    + `To move ahead, sign in to your personal area here, choose the destination and dates you registered for, and upload a photo of a valid passport 👇\n${personalArea}`;
}

export function msgBookedEn(name, expedition, date, time) {
  return `Hi ${firstName(name)} 👋🏼\n\nYour call about ${about(expedition)} is booked! 🏔️\n\n`
    + `🗓️ When? ${formatDateEn(date)}\n⏰ Time: ${time} (Israel time)\n\n`
    + `We'll call you at that time. Looking forward to talking with you! 😁`;
}

export function msgReminderEn(name, expedition, time) {
  return `Hi ${firstName(name)}, how are you?\n\n`
    + `A quick reminder about our call today at ${time} (Israel time)${tripEn(expedition) ? ` about ${tripEn(expedition)} 🏔️` : ''}\n\n`
    + `A 👍🏼 to confirm would be great.`;
}

export function msgRescheduleEn(name, expedition, date, time) {
  return `Hi ${firstName(name)} 👋🏼\n\n`
    + `Just to let you know, our call${tripEn(expedition) ? ` about ${tripEn(expedition)}` : ''} has moved 🗓️\n\n`
    + `🗓️ When? ${formatDateEn(date)}\n⏰ Time: ${time} (Israel time)\n\n`
    + `We'll call you at the new time. Talk soon! 😁`;
}
