/* Audit W29 (12 Nov 2026): one Israel clock, and the invite link on our domain.

   book-slot.js, calendar-invite.js and submit-lead.js each carried the rule
   "summer time starts on the last Sunday of March". Israel moves its clocks on
   the Friday before it, so on that Friday and Saturday a call booked for 10:00
   went into the calendars at 11:00 and a lead was stamped an hour late. All
   three now ask the shared helper (api/_lib/iltime.js). The "add to Apple
   Calendar" link in the booking email pointed at the hosting address. */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';

const { israelWallTimeToISO, israelOffsetMinutes, israelCallStamps, israelStamp } = await import('../api/_lib/iltime.js');
const { icsDateTimes } = await import('../api/book-slot.js');
const { default: calendarInvite } = await import('../api/calendar-invite.js');
const { SITE } = await import('../api/_lib/email-shell.js');
const read = f => fs.readFileSync(f, 'utf8');

/* The clock changes, by Israel's own law: forward on the Friday before the
   last Sunday of March, back on the last Sunday of October.
   2026: Fri 27 Mar / Sun 25 Oct.   2027: Fri 26 Mar / Sun 31 Oct. */
const WINTER = 120, SUMMER = 180;

describe('W29: Israel wall clock to UTC', () => {
  it('the Friday and Saturday before the last Sunday of March are already summer time', () => {
    expect(israelWallTimeToISO('2027-03-25', '10:00')).toBe('2027-03-25T08:00:00.000Z');   // Thursday, winter
    expect(israelWallTimeToISO('2027-03-26', '10:00')).toBe('2027-03-26T07:00:00.000Z');   // Friday: the old rule said 08:00
    expect(israelWallTimeToISO('2027-03-27', '10:00')).toBe('2027-03-27T07:00:00.000Z');   // Saturday: the old rule said 08:00
    expect(israelWallTimeToISO('2027-03-28', '10:00')).toBe('2027-03-28T07:00:00.000Z');   // the Sunday itself
    expect(israelWallTimeToISO('2026-03-26', '13:30')).toBe('2026-03-26T11:30:00.000Z');
    expect(israelWallTimeToISO('2026-03-27', '13:30')).toBe('2026-03-27T10:30:00.000Z');
    expect(israelWallTimeToISO('2026-03-28', '13:30')).toBe('2026-03-28T10:30:00.000Z');
  });
  it('autumn: summer time until the last Sunday of October, winter from that morning', () => {
    expect(israelWallTimeToISO('2027-10-30', '10:00')).toBe('2027-10-30T07:00:00.000Z');
    expect(israelWallTimeToISO('2027-10-31', '10:00')).toBe('2027-10-31T08:00:00.000Z');
    expect(israelWallTimeToISO('2026-10-24', '09:00')).toBe('2026-10-24T06:00:00.000Z');
    expect(israelWallTimeToISO('2026-10-25', '09:00')).toBe('2026-10-25T07:00:00.000Z');
  });
  it('plain summer and plain winter', () => {
    expect(israelWallTimeToISO('2026-07-15', '18:00')).toBe('2026-07-15T15:00:00.000Z');
    expect(israelWallTimeToISO('2026-12-15', '18:00')).toBe('2026-12-15T16:00:00.000Z');
    expect(israelOffsetMinutes(new Date('2026-07-15T12:00:00Z'))).toBe(SUMMER);
    expect(israelOffsetMinutes(new Date('2026-12-15T12:00:00Z'))).toBe(WINTER);
  });
  it('the answer does not depend on the clock of the machine it runs on', () => {
    const TZ0 = process.env.TZ;
    try {
      for (const zone of ['UTC', 'America/New_York', 'Asia/Tokyo', 'Asia/Jerusalem']) {
        process.env.TZ = zone;
        expect(israelWallTimeToISO('2027-03-26', '10:00'), zone).toBe('2027-03-26T07:00:00.000Z');
        expect(israelStamp(new Date('2027-03-26T07:00:00Z')), zone).toBe('2027-03-26T10:00:00+03:00');
      }
    } finally { if (TZ0 === undefined) delete process.env.TZ; else process.env.TZ = TZ0; }
  });
  it('for every day of two years it agrees with the calendar itself, read back in Israel time', () => {
    const back = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
    for (let t = Date.UTC(2026, 0, 1, 12); t < Date.UTC(2028, 0, 1); t += 86400000) {
      const ymd = new Date(t).toISOString().slice(0, 10);
      for (const time of ['09:00', '13:30', '18:00']) {
        const p = back.formatToParts(new Date(israelWallTimeToISO(ymd, time))).reduce((o, x) => (o[x.type] = x.value, o), {});
        expect(`${p.year}-${p.month}-${p.day} ${p.hour}:${p.minute}`, `${ymd} ${time}`).toBe(`${ymd} ${time}`);
      }
    }
  });
});

describe('W29: the call in the calendar', () => {
  it('a call is half an hour, stamped in UTC', () => {
    expect(israelCallStamps('2027-03-26', '10:00')).toEqual({ dtStart: '20270326T070000Z', dtEnd: '20270326T073000Z' });
    expect(israelCallStamps('2027-01-12', '09:30')).toEqual({ dtStart: '20270112T073000Z', dtEnd: '20270112T080000Z' });
  });
  it('the booking invite (book-slot) on the two days that were an hour late', () => {
    expect(icsDateTimes('2027-03-26', '10:00')).toEqual({ dtStart: '20270326T070000Z', dtEnd: '20270326T073000Z', uid: '2027-03-26T1000@highair-expeditions.com' });
    expect(icsDateTimes('2026-03-27', '11:30')).toMatchObject({ dtStart: '20260327T083000Z', dtEnd: '20260327T090000Z' });
    /* and an ordinary day is what it always was */
    expect(icsDateTimes('2026-11-12', '10:00')).toMatchObject({ dtStart: '20261112T080000Z', dtEnd: '20261112T083000Z' });
    expect(icsDateTimes('2026-08-12', '10:00')).toMatchObject({ dtStart: '20260812T070000Z', dtEnd: '20260812T073000Z' });
  });
  const invite = query => {
    const out = { headers: {} };
    const res = { setHeader(k, v) { out.headers[k.toLowerCase()] = v; return res; }, status(c) { out.code = c; return res; }, send(b) { out.body = b; return res; }, end() { return res; } };
    calendarInvite({ method: 'GET', query, headers: {} }, res);
    return out;
  };
  it('the downloaded invite (calendar-invite) gives the same hour as the booking invite', () => {
    for (const [date, time] of [['2027-03-26', '10:00'], ['2027-03-27', '09:00'], ['2027-03-25', '10:00'], ['2026-08-12', '16:30'], ['2027-10-31', '10:00']]) {
      const r = invite({ date, time, name: 'דנה', expedition: 'קילימנג׳רו' });
      const { dtStart, dtEnd } = icsDateTimes(date, time);
      expect(r.code).toBe(200);
      expect(r.body, `${date} ${time}`).toContain(`DTSTART:${dtStart}\r\n`);
      expect(r.body, `${date} ${time}`).toContain(`DTEND:${dtEnd}\r\n`);
    }
    expect(invite({ date: '2027-03-26', time: '10:00' }).body).toContain('DTSTART:20270326T070000Z');
  });
  it('it still refuses a date or a time that is not one', () => {
    expect(invite({ date: '26/03/2027', time: '10:00' }).code).toBe(400);
    expect(invite({ date: '2027-03-26', time: '10' }).code).toBe(400);
    expect(invite({ time: '10:00' }).code).toBe(400);
  });
});

describe('W29: the lead stamp (submit-lead)', () => {
  it('is Israel wall clock with the offset Israel really has', () => {
    expect(israelStamp(new Date('2027-03-25T08:00:00Z'))).toBe('2027-03-25T10:00:00+02:00');
    expect(israelStamp(new Date('2027-03-26T07:00:00Z'))).toBe('2027-03-26T10:00:00+03:00');   // was written +02:00: an hour late
    expect(israelStamp(new Date('2027-03-27T20:59:59Z'))).toBe('2027-03-27T23:59:59+03:00');
    expect(israelStamp(new Date('2027-10-31T08:00:00Z'))).toBe('2027-10-31T10:00:00+02:00');
    expect(israelStamp(new Date('2026-12-31T22:30:15.900Z'))).toBe('2027-01-01T00:30:15+02:00');
  });
  it('read back, the stamp is the very instant it was made', () => {
    for (const iso of ['2027-03-26T07:00:00Z', '2027-03-27T12:34:56Z', '2026-11-12T01:02:03Z', '2026-07-01T21:30:00Z']) {
      expect(new Date(israelStamp(new Date(iso))).toISOString()).toBe(new Date(iso).toISOString());
    }
  });
});

describe('W29: nobody keeps a summer-time rule of their own, and the link is ours', () => {
  it('the three files ask the shared helper', () => {
    for (const f of ['api/book-slot.js', 'api/calendar-invite.js', 'api/submit-lead.js']) {
      const src = read(f);
      expect(src, f).not.toMatch(/lastSun(Mar|Oct)/);
      expect(src, f).not.toMatch(/\?\s*3\s*:\s*2/);
      expect(src, f).toMatch(/from '\.\/_lib\/iltime\.js'/);
    }
    expect(read('api/book-slot.js')).toContain('israelCallStamps(date, time)');
    expect(read('api/calendar-invite.js')).toContain('israelCallStamps(String(date), String(time))');
    expect(read('api/submit-lead.js')).toContain("const israelTime = israelStamp(new Date());");
  });
  it('the calendar link in the booking email is on the site domain', () => {
    const book = read('api/book-slot.js');
    expect(SITE).toBe('https://www.highair-expeditions.com');
    expect(book).toContain('const icsLink    = `${SITE}/api/calendar-invite?${icsParams}`;');
    expect(book).not.toMatch(/https?:\/\/[^\s'"`]*vercel\.app/);
  });
});
