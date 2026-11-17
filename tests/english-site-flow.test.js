/* The English site, sold like the Hebrew one (owner, 17 Nov 2026: "אני רוצה שבאתר באנגלית יהיה
   אותו מודל כמו באתר בעברית שליד מגיש טופס אז שיוכל לקבוע שיחה ואם לא אז שיקבל הודעה באנגלית כמו
   הפלואו בעברית", "ושהלידים באתר באנגלית יגיעו רק לתומר לן"; and his answers: WhatsApp in English,
   the English site only, the calendar in Israel time, the hours by the lead's own clock).
   The booking side is in tests/english-site-booking.test.js. */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { readFileSync } from 'node:fs';
import {
  leadTimeZone, inLeadWindow, minutesIn, formatDateEn, SITE_EN,
  msgNudgeEn, msgNudge2En, msgNoAnswerEn, msgFollowUpEn, msgDepositAEn, msgBookedEn, msgReminderEn, msgRescheduleEn,
} from '../api/_lib/lead-en.js';
import { ENGLISH_LEAD_AGENT, siteLanguageOf } from '../api/_lib/lead-channel.js';
import { fmtPhoneIntl } from '../api/_lib/no-answer.js';

const HEBREW = /[֐-׿]/;

describe('the lead\'s own clock, from the phone', () => {
  it('a time zone per country code, Israel when unknown or local', () => {
    expect(leadTimeZone('+1 212 555 1234')).toBe('America/New_York');
    expect(leadTimeZone('+447911123456')).toBe('Europe/London');
    expect(leadTimeZone('00447911123456')).toBe('Europe/London');
    expect(leadTimeZone('+61412345678')).toBe('Australia/Sydney');
    expect(leadTimeZone('+353871234567')).toBe('Europe/Dublin');      // the longer code wins over +35…
    expect(leadTimeZone('+971501234567')).toBe('Asia/Dubai');
    expect(leadTimeZone('+972501234567')).toBe('Asia/Jerusalem');
    expect(leadTimeZone('0501234567')).toBe('Asia/Jerusalem');
    expect(leadTimeZone('501234567')).toBe('Asia/Jerusalem');
    expect(leadTimeZone('+999123456789')).toBe('Asia/Jerusalem');
    expect(leadTimeZone('')).toBe('Asia/Jerusalem');
  });
  it('09:00-20:00 at that hour', () => {
    const t = new Date('2026-11-17T12:30:00Z');          // New York 07:30, London 12:30, Israel 14:30
    expect(minutesIn('America/New_York', t)).toBe(7 * 60 + 30);
    expect(inLeadWindow('+12125551234', t)).toBe(false);
    expect(inLeadWindow('+447911123456', t)).toBe(true);
    expect(inLeadWindow('+972501234567', t)).toBe(true);
    expect(inLeadWindow('+12125551234', new Date('2026-11-17T14:00:00Z'))).toBe(true);    // NY 09:00
    expect(inLeadWindow('+447911123456', new Date('2026-11-17T20:00:00Z'))).toBe(false);  // London 20:00
  });
});

describe('the texts, in English', () => {
  const all = [
    msgNudgeEn('John Smith', 'Kilimanjaro', 'k7m3qp'),
    msgNudge2En('John', 'Kilimanjaro', '+12125551234', new Date('2026-11-17T15:00:00Z')),
    msgNoAnswerEn('John', 'Kilimanjaro', 'Tomer', '+972 54-788-8245'),
    msgFollowUpEn('John', 'Kilimanjaro'),
    msgDepositAEn('John', 'https://app.highair-expeditions.com/register'),
    msgBookedEn('John', 'קילימנג׳רו', '2026-11-20', '10:30'),
    msgReminderEn('John', 'Kilimanjaro', '10:30'),
    msgRescheduleEn('John', 'Kilimanjaro', '2026-11-22', '12:00'),
  ];
  it('no Hebrew in any of them, the first name only', () => {
    for (const t of all) { expect(t).not.toMatch(HEBREW); expect(t).toMatch(/^Hi John\b/); expect(t).not.toContain('Smith'); }
  });
  it('the first one books on the English site, by the lead\'s own code', () => {
    expect(all[0]).toContain(`${SITE_EN}/book/kilimanjaro/k7m3qp`);
  });
  it('every hour we name is Israel\'s', () => {
    for (const t of [all[5], all[6], all[7]]) expect(t).toContain('(Israel time)');
    expect(all[5]).toContain('Friday 20 November');
    expect(formatDateEn('2026-11-22')).toBe('Sunday 22 November');
  });
  it('a Hebrew destination is named in English, an unknown one not at all', () => {
    expect(all[5]).toContain('Your call about Kilimanjaro is booked');
    expect(msgBookedEn('John', 'something odd http://x', '2026-11-20', '10:30')).toContain('Your call about our expeditions is booked');
    expect(msgRescheduleEn('John', 'whatever', '2026-11-22', '12:00')).toContain('our call has moved');
    expect(msgFollowUpEn('John', 'Kilimanjaro Kosher')).toContain('our Kilimanjaro Kosher groups');
  });
  it('nothing about our flight ticketing or our flight agents: they fly from home', () => {
    expect(all[3]).not.toMatch(/flight|ticket/i);
    expect(all[4]).not.toMatch(/flight|insurance agent/i);
    expect(all[4]).toContain('https://app.highair-expeditions.com/register');
  });
  it('the greeting follows the lead\'s hour', () => {
    expect(msgNudge2En('A', 'Kilimanjaro', '+12125551234', new Date('2026-11-17T15:00:00Z'))).toContain('good morning');    // NY 10:00
    expect(msgNudge2En('A', 'Kilimanjaro', '+12125551234', new Date('2026-11-17T19:00:00Z'))).toContain('good afternoon');  // NY 14:00
    expect(msgNudge2En('A', 'Kilimanjaro', '+447911123456', new Date('2026-11-17T19:00:00Z'))).toContain('good evening');   // London 19:00
  });
  it('the agent\'s number, dialable from abroad', () => {
    expect(fmtPhoneIntl('+972547888245')).toBe('+972 54-788-8245');
    expect(fmtPhoneIntl('0547888245')).toBe('+972 54-788-8245');
  });
});

describe('who and where', () => {
  it('Tomer Lan, and the site a request came from', () => {
    expect(ENGLISH_LEAD_AGENT).toBe('Tomer Lan');
    expect(siteLanguageOf({ origin: 'https://en.highair-expeditions.com' })).toBe('English');
    expect(siteLanguageOf({ referer: 'https://en.highair-expeditions.com/book/kilimanjaro/abc123' })).toBe('English');
    expect(siteLanguageOf({ origin: 'https://www.highair-expeditions.com' })).toBe('Hebrew');
    expect(siteLanguageOf({ origin: 'https://app.highair-expeditions.com' })).toBe('Hebrew');
    expect(siteLanguageOf({ origin: 'https://evil.example' })).toBeNull();
    expect(siteLanguageOf({})).toBeNull();
  });
  it('the trip page shows the calendar on the English site; German and Spanish keep the thank-you', () => {
    const page = readFileSync('src/components/web_v2/ExpeditionDetail.jsx', 'utf8');
    expect(page).toContain("{!isRtl && (currentLang() !== 'en' || callSkipped) ? (");
    const widget = readFileSync('src/components/web_v2/BookingWidget.jsx', 'utf8');
    expect(widget).toContain('`${tx("Choose a time")} (${tx("Israel time")})`');
    for (const l of ['de', 'es']) expect(JSON.parse(readFileSync(`src/i18n/ui-${l}.json`, 'utf8'))['Israel time']).toBeTruthy();
  });
});

/* ── The lifecycle job ─────────────────────────────────────────────────────── */
process.env.CRON_SECRET = 'cron-secret';
process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.GREENAPI_INSTANCE = '7107596827';
process.env.GREENAPI_TOKEN = 'gtok';

let sent, rows, patches;
const NY = '+12125551234';
beforeEach(() => {
  sent = []; rows = {}; patches = [];
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.stubGlobal('fetch', async (url, init = {}) => {
    const u = String(url);
    if (/green-?api\.com/.test(u)) { const b = JSON.parse(init.body || '{}'); sent.push({ to: b.chatId, text: b.message }); return new Response('{"idMessage":"BAE5"}', { status: 200 }); }
    if (u.includes('Website%20Leads') && init.method === 'PATCH') { patches.push(JSON.parse(init.body || '{}').fields); return new Response('{}', { status: 200 }); }
    if (u.includes('Website%20Leads')) {
      const f = decodeURIComponent((u.split('filterByFormula=')[1] || '').split('&')[0]);
      if (f.includes('{Nudge Sent}!=TRUE()')) return new Response(JSON.stringify({ records: rows.nudge || [] }), { status: 200 });
      if (f.includes('{Nudge 2 Sent}!=TRUE()')) return new Response(JSON.stringify({ records: rows.nudge2 || [] }), { status: 200 });
      if (f.includes('IS_BEFORE({Call Done At},DATETIME_PARSE(')) return new Response(JSON.stringify({ records: rows.follow || [] }), { status: 200 });
      return new Response('{"records":[]}', { status: 200 });
    }
    if (u.includes('/Groups?')) return new Response(JSON.stringify({ records: [{ id: 'recG1', fields: { Event: 'Kilimanjaro', Departure: '2027-01-03' } }] }), { status: 200 });
    return new Response('{"records":[]}', { status: 200 });
  });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); vi.restoreAllMocks(); });

const { default: handler } = await import('../api/lead-messaging.js');
const runAt = iso => new Promise(resolve => {
  vi.setSystemTime(new Date(iso));
  const out = {};
  const res = { setHeader() {}, status(c) { out.code = c; return res; }, json(b) { out.body = b; resolve(out); return res; }, end() { resolve(out); return res; } };
  handler({ method: 'GET', headers: { authorization: 'Bearer cron-secret' } }, res);
});
const followLead = (id, phone, extra = {}) => ({ id, fields: { Name: extra.Name || 'John Smith', Phone: phone, Stage: 'Call Done', Expedition: 'Kilimanjaro',
  'Call Done At': '2026-11-01T09:00:00.000Z', 'Last Modified': '2026-11-02T08:00:00.000Z', ...extra } });

describe('the lifecycle job, for an English lead', () => {
  it('the first message: in English, with the English site\'s link', async () => {
    rows.nudge = [{ id: 'recEN1', fields: { Name: 'John Smith', Phone: NY, Stage: 'New Lead', Expedition: 'Kilimanjaro', Language: 'English', 'Created Time': '2026-11-10T07:40:00.000Z', 'Book Code': 'abc234' } }];
    const { body } = await runAt('2026-11-10T08:00:00Z');   // Tuesday, Israel 10:00
    expect(body.nudge).toBe(1);
    expect(sent).toHaveLength(1);
    expect(sent[0].to).toBe('12125551234@c.us');
    expect(sent[0].text).toContain('https://en.highair-expeditions.com/book/kilimanjaro/abc234');
    expect(sent[0].text).not.toMatch(HEBREW);
  });
  it('the follow-up waits for the lead\'s own morning, while the Hebrew one goes', async () => {
    rows.follow = [followLead('recEN2', NY, { Language: 'English' }), followLead('recHE2', '+972501234567', { Name: 'דנה כהן' })];
    const { body } = await runAt('2026-11-10T08:00:00Z');   // Israel 10:00 = New York 03:00
    expect(body.followUp).toBe(1);
    expect(sent.map(s => s.to)).toEqual(['972501234567@c.us']);
    expect(sent[0].text).toMatch(HEBREW);
  });
  it('...and goes in the lead\'s afternoon, after Israel\'s window has closed', async () => {
    rows.follow = [followLead('recEN3', NY, { Language: 'English' }), followLead('recHE3', '+972501234567', { Name: 'דנה כהן' })];
    const { body } = await runAt('2026-11-10T19:00:00Z');   // Israel 21:00 = New York 14:00
    expect(body.followUpHeldForNight).toBe(true);
    expect(body.followUp).toBe(1);
    expect(sent.map(s => s.to)).toEqual(['12125551234@c.us']);
    expect(sent[0].text).toContain('our Kilimanjaro groups are filling up fast');
    expect(patches.some(p => p.Stage === 'Follow-Up Sent')).toBe(true);
  });
  it('the second message, at the lead\'s hour, with the lead\'s greeting', async () => {
    rows.nudge2 = [{ id: 'recEN4', fields: { Name: 'John Smith', Phone: NY, Stage: 'New Lead', Expedition: 'Kilimanjaro', Language: 'English', 'Nudge Sent': true, 'Created Time': '2026-11-09T10:00:00.000Z' } }];
    let r = await runAt('2026-11-10T12:00:00Z');            // Israel 14:00 = New York 07:00: waits
    expect(r.body.nudge2).toBe(0);
    expect(sent).toEqual([]);
    r = await runAt('2026-11-10T19:00:00Z');                // Israel 21:00 = New York 14:00: goes
    expect(r.body.nudge2).toBe(1);
    expect(sent[0].text).toBe('Hi John, good afternoon 🙂\nWhen would be a good time for us to talk about Kilimanjaro?');
  });
  it('a German lead still gets nothing', async () => {
    rows.follow = [followLead('recDE5', '+4915112345678', { Language: 'German' })];
    rows.nudge = [{ id: 'recDE6', fields: { Name: 'Jonas', Phone: '+4915112345678', Stage: 'New Lead', Expedition: 'Kilimanjaro', Language: 'German', 'Created Time': '2026-11-10T07:40:00.000Z' } }];
    await runAt('2026-11-10T10:00:00Z');
    expect(sent).toEqual([]);
  });
});

describe('the booking link opens the booking page on the English site', () => {
  it('/book is the calendar in Hebrew and English; German and Spanish still go to /contact', () => {
    const main = readFileSync('src/main.jsx', 'utf8');
    expect(main).toContain("return ['he', 'en'].includes(i18nInstance.language) ? <BookCall /> : <Navigate to=\"/contact\" replace />;");
  });
});
