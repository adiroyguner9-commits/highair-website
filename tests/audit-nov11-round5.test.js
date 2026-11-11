/* The 11 Nov 2026 audit, the fifth round on the website:
   W10  every refused lead was "the phone number is not valid", or the server's own English
   W11  a failed load of the call times read "no times"; a button on /book did nothing
   W12  booking a call: a number without its country, a call off the grid, a second booking
   W13  the same trip had two keys, so a second enquiry opened a second card
   W14  the four-day follow-up ran on an old clock and pulled cards out of "Call Scheduled"
   W15  three WhatsApps went to leads from the foreign sites; one ignored the pause
   W17  three English posts had no page; a made-up magazine address answered 200 abroad
   W18  the shared 404 document carried a Hebrew title on every host
   W33  the Safari page and the home page fetched photos nobody had scrolled to */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'node:fs';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
process.env.PUSH_HOOK_SECRET = 'shared-secret';
process.env.GREENAPI_INSTANCE = '7100000000';
process.env.GREENAPI_TOKEN = 'green';

/* One stand-in for the network, in place before any module is imported. Each
   test swaps what it answers; every call is kept so a test can ask what left. */
const calls = [];
let answer = () => ({});
globalThis.fetch = async (url, init = {}) => {
  const u = String(url), method = init.method || 'GET';
  let body = null; try { body = init.body ? JSON.parse(init.body) : null; } catch { body = init.body; }
  calls.push({ u, method, body });
  const out = await answer(u, method, body);
  if (out instanceof Response) return out;
  return new Response(typeof out === 'string' ? out : JSON.stringify(out ?? {}), { status: 200, headers: { 'content-type': 'application/json' } });
};
const table = u => decodeURIComponent((/\/v0\/appTEST\/([^/?]+)/.exec(u) || [])[1] || '');
const green = () => calls.filter(c => /greenapi|green-api/.test(c.u) && /sendMessage/.test(c.u));

const { tripKey } = await import('../api/_lib/active-lead.js');
const { DEST } = await import('../api/_lib/dest.js');
const { FOLLOW_UP_SKIP_STAGES, callDoneNeedsStamp, callDoneStamp, followUpDue } = await import('../api/lead-messaging.js');
const { isForeignLead, pauseIsOn, whatsappVerdict, messagingPaused } = await import('../api/_lib/lead-channel.js');
const { callsOverlap, busyByTime, someoneFreeAt, timeToMin } = await import('../api/_lib/callAgents.js');
const { default: bookSlot, bookingPhone, callsToReplace } = await import('../api/book-slot.js');
const { default: slots } = await import('../api/slots.js');
const { default: notifyReschedule } = await import('../api/notify-reschedule.js');
const { isYomTov } = await import('../api/_lib/iltime.js');
const { leadErrorKind, LEAD_ERROR_HE, LEAD_ERROR_EN } = await import('../src/website/formRules.js');
const { postTexts, readIntl, postLangs } = await import('../scripts/lib/vite-blog-split.mjs');
const { POSTS } = await import('../src/data/blogData.js');
const { BLOG_LANGS } = await import('../src/website/blogLangs.js');
const { default: middleware, blogNotFound, englishShellPath } = await import('../middleware.js');
const VARIANTS = JSON.parse(fs.readFileSync('src/website/imageVariants.json', 'utf8'));
const read = f => fs.readFileSync(f, 'utf8');

let ipN = 0;
async function run(handler, { method = 'POST', body, query, headers = {} } = {}) {
  let status = 200, data;
  const res = { status(s) { status = s; return this; }, json(d) { data = d; return this; }, end() { return this; }, setHeader() { return this; } };
  await handler({ method, headers: { 'x-vercel-forwarded-for': `10.5.${Math.floor(ipN / 250)}.${ipN++ % 250}`, ...headers }, socket: {}, body, query }, res);
  return { status, data };
}
/* A working day comfortably ahead: not Friday or Saturday, not a festival. */
const openDay = (() => {
  const d = new Date(Date.now() + 40 * 86400000);
  for (;;) { const ymd = d.toISOString().slice(0, 10); if (![5, 6].includes(new Date(`${ymd}T00:00:00`).getDay()) && !isYomTov(ymd)) return ymd; d.setUTCDate(d.getUTCDate() + 1); }
})();
const AGENTS = { records: [
  { id: 'recAGENT000000001', fields: { Name: 'Tomer', 'Last Name': 'Lan', Destinations: ['Kilimanjaro'] } },
  { id: 'recAGENT000000002', fields: { Name: 'Dana', 'Last Name': 'Levi', Destinations: ['Annapurna'] } },
] };
beforeEach(() => { calls.length = 0; answer = () => ({ records: [] }); });

describe('W13: one key for a trip, whichever language named it', () => {
  it('every trip the site knows has the same key from its stored name and from its Hebrew page name', () => {
    for (const [key, v] of Object.entries(DEST)) {
      expect(tripKey(key), key).toBeTruthy();
      expect(tripKey(v.he), `${key} / ${v.he}`).toBe(tripKey(key));
    }
  });
  it('no two different trips share a key', () => {
    const seen = {};
    for (const key of Object.keys(DEST)) (seen[tripKey(key)] ||= []).push(key);
    expect(Object.values(seen).filter(v => v.length > 1)).toEqual([]);
  });
  it('the religious Kilimanjaro is one trip in all three spellings, and not the regular one', () => {
    const k = tripKey('Kilimanjaro (Religious)');
    expect(tripKey('Kilimanjaro Kosher')).toBe(k);
    expect(tripKey('קילימנג׳רו לשומרי מסורת')).toBe(k);
    expect(tripKey('Kilimanjaro')).not.toBe(k);
  });
  it('the Manaslu climb is not the Manaslu circuit', () => {
    expect(tripKey('טיפוס למנסלו')).toBe(tripKey('Manaslu Climb'));
    expect(tripKey('טיפוס מנסלו')).toBe(tripKey('Manaslu Climb'));
    expect(tripKey('טרק סובב מנסלו')).toBe(tripKey('Manaslu'));
    expect(tripKey('Manaslu Climb')).not.toBe(tripKey('Manaslu'));
  });
  it('the trip that used to have two keys has one', () => {
    expect(tripKey('Everest Base Camp')).toBe(tripKey('טרק אוורסט בייס קמפ וגוקיו'));
    expect(tripKey('Scardus')).toBe(tripKey('טרק רכס הסקארדוס'));
  });
  it('a name nobody knows is never "the same trip"', () => {
    expect(tripKey('')).toBe('');
    expect(tripKey('סיור פרטי במקום אחר')).toBe('');
  });
});

describe('W14: the four-day follow-up', () => {
  const now = Date.parse('2026-11-11T10:00:00Z');
  const ago = d => new Date(now - d * 86400000).toISOString();
  it('goes four days after the call, to a card still in "Call Done"', () => {
    expect(followUpDue({ Stage: 'Call Done', 'Call Done At': ago(5), 'Stage Changed At': ago(5.01) }, now)).toBe(true);
    expect(followUpDue({ Stage: 'Call Done', 'Call Done At': ago(3) }, now)).toBe(false);
  });
  it('waits while a call is still ahead, instead of pulling the card out of its stage', () => {
    for (const Stage of ['Call Scheduled', 'No Answer', 'New Lead']) {
      expect(followUpDue({ Stage, 'Call Done At': ago(9), 'Stage Changed At': ago(1) }, now), Stage).toBe(false);
      expect(FOLLOW_UP_SKIP_STAGES).toContain(Stage);
    }
  });
  it('still skips the closed, the lost and the already asked to pay', () => {
    for (const Stage of ['Deposit A Paid', 'Cancelled', 'Not Relevant', 'Awaiting Deposit A', 'לקוח קיים', 'לקוח רשום']) {
      expect(followUpDue({ Stage, 'Call Done At': ago(9) }, now), Stage).toBe(false);
    }
  });
  it('a card moved by hand to "Follow-Up Sent" still gets it, counted from the call', () => {
    expect(followUpDue({ Stage: 'Follow-Up Sent', 'Call Done At': ago(5), 'Stage Changed At': ago(1) }, now)).toBe(true);
  });
  it('never twice', () => {
    expect(followUpDue({ Stage: 'Call Done', 'Call Done At': ago(9), 'Follow-Up Sent': true }, now)).toBe(false);
  });
  it('a card that came back to "Call Done" after a second call restarts the clock from that move', () => {
    const f = { Stage: 'Call Done', 'Call Done At': ago(20), 'Stage Changed At': ago(1) };
    expect(callDoneNeedsStamp(f)).toBe(true);
    expect(followUpDue(f, now)).toBe(false);                      // not on the old call's date
    expect(callDoneStamp(f, now)).toBe(ago(1));                   // the move itself, not "now"
    const restamped = { ...f, 'Call Done At': callDoneStamp(f, now) };
    expect(callDoneNeedsStamp(restamped)).toBe(false);
    expect(followUpDue(restamped, now)).toBe(false);
    expect(followUpDue(restamped, now + 3.1 * 86400000)).toBe(true);
  });
  it('a first stamp is "now", and a card whose follow-up already went is left as it is', () => {
    expect(callDoneNeedsStamp({ Stage: 'Call Done' })).toBe(true);
    expect(callDoneStamp({ Stage: 'Call Done' }, now)).toBe(new Date(now).toISOString());
    expect(callDoneNeedsStamp({ Stage: 'Call Done', 'Call Done At': ago(40), 'Stage Changed At': ago(2), 'Follow-Up Sent': true })).toBe(false);
    expect(callDoneNeedsStamp({ Stage: 'Call Scheduled', 'Call Done At': ago(40), 'Stage Changed At': ago(2) })).toBe(false);
  });
  it('the job asks Airtable with the same list, and decides each row with the same rule', () => {
    const src = read('api/lead-messaging.js');
    expect(src).toContain("${FOLLOW_UP_SKIP_STAGES.map(st => `{Stage}!='${st}'`).join(',')}");
    expect(src).toContain('if (!followUpDue(f, nowMs)) continue;');
    expect(src).toContain("await patchLead(rec.id, { 'Call Done At': callDoneStamp(rec.fields, nowMs) });");
  });
});

describe('W15: one channel rule for every automatic WhatsApp', () => {
  it('a lead from a foreign site never gets one; the pause silences the rest', () => {
    expect(whatsappVerdict({ lead: { Language: 'German' } })).toEqual({ send: false, why: 'foreign' });
    expect(whatsappVerdict({ lead: { Source: 'WhatsApp', Experience: "Hi! I'd love to hear more about Kilimanjaro" } }).send).toBe(false);
    expect(whatsappVerdict({ lead: { Language: 'Hebrew' }, paused: true })).toEqual({ send: false, why: 'paused' });
    expect(whatsappVerdict({ lead: { Language: 'Hebrew' } })).toEqual({ send: true, why: '' });
    expect(whatsappVerdict({ lead: null })).toEqual({ send: true, why: '' });     // a phone with no card: nothing says "from abroad"
    expect(isForeignLead({ Language: 'english' })).toBe(true);
  });
  it('the pause switch reads the same four words the job reads, and a failed read is "not paused"', async () => {
    for (const v of ['1', 'true', 'YES', ' on ']) expect(pauseIsOn(v), v).toBe(true);
    for (const v of ['', '0', 'off', undefined, null]) expect(pauseIsOn(v), String(v)).toBe(false);
    answer = () => ({ records: [{ id: 'recPAUSE000000001', fields: { Value: 'true' } }] });
    expect(await messagingPaused({ base: 'appTEST', token: 'tok' })).toBe(true);
    answer = () => new Response('{}', { status: 503 });
    expect(await messagingPaused({ base: 'appTEST', token: 'tok' })).toBe(false);
  });

  const reschedule = body => run(notifyReschedule, { body, headers: { 'x-hook-key': 'shared-secret' } });
  const moved = { phone: '+972501234567', name: 'דנה', expedition: 'Kilimanjaro', date: openDay, time: '10:00' };
  const withLead = (lead, paused = '') => (u) => {
    if (table(u) === 'Appointments') return { records: [{ id: 'recAPPT0000000001', fields: { Phone: '+972501234567' } }] };
    if (table(u) === 'Website Leads') return { records: lead ? [{ id: 'recLEAD0000000001', fields: { Stage: 'Call Scheduled', ...lead } }] : [] };
    if (table(u) === 'AppContent') return { records: paused ? [{ id: 'recPAUSE000000001', fields: { Value: paused } }] : [] };
    if (/greenapi|green-api/.test(u)) return { idMessage: 'MSG1' };
    return { records: [] };
  };
  it('"your call moved": a Hebrew-site lead gets it', async () => {
    answer = withLead({ Language: 'Hebrew' });
    const r = await reschedule(moved);
    expect(r.data).toMatchObject({ sent: true });
    expect(green()).toHaveLength(1);
  });
  it('"your call moved": a lead from the German site gets no WhatsApp', async () => {
    answer = withLead({ Language: 'German' });
    const r = await reschedule(moved);
    expect(r.data).toEqual({ skipped: 'lead from abroad: email only' });
    expect(green()).toHaveLength(0);
  });
  it('"your call moved": nothing goes while messaging is paused', async () => {
    answer = withLead({ Language: 'Hebrew' }, 'true');
    const r = await reschedule(moved);
    expect(r.data).toEqual({ skipped: 'messaging is paused' });
    expect(green()).toHaveLength(0);
  });
  it('the call reminder and the booking confirmation ask the same rule', () => {
    const rem = read('api/send-reminders.js');
    expect(rem).toContain("if (!whatsappVerdict({ lead: lead?.fields || null }).send) {");
    expect(rem.indexOf('whatsappVerdict({ lead')).toBeLessThan(rem.indexOf("'sendMessage'"));
    expect(rem).toContain('if (await messagingPaused({ base: BASE, token: TOKEN }))');
    const book = read('api/book-slot.js');
    expect(book).toContain('const waOk = whatsappVerdict({ lead: leadFields }).send;');
    expect(book).toContain('if (!silent && waOk && GA_INSTANCE && GA_TOKEN && phone) {');
  });
});

describe('W12: booking a call', () => {
  describe('the number', () => {
    it('an Israeli number is stored as before', () => {
      expect(bookingPhone('050-1234567')).toBe('+972501234567');
      expect(bookingPhone('+972 050-1234567')).toBe('+972501234567');
      expect(bookingPhone('0501234567', '+972')).toBe('+972501234567');
      expect(bookingPhone('509892562')).toBe('+972509892562');
    });
    it('a number from abroad keeps its country and loses the 0 it is written with at home', () => {
      expect(bookingPhone('+49 0151 23456789')).toBe('+4915123456789');      // as the phone field sends it
      expect(bookingPhone('0151 23456789', '+49')).toBe('+4915123456789');   // the country sent apart
      expect(bookingPhone('+44 07911 123456')).toBe('+447911123456');
      expect(bookingPhone('+1 202-555-0123')).toBe('+12025550123');
    });
    it('Italy keeps its 0, and a number typed whole is left as typed', () => {
      expect(bookingPhone('+39 06 1234567')).toBe('+39061234567');
      expect(bookingPhone('+4915123456789')).toBe('+4915123456789');
      expect(bookingPhone('', '+49')).toBe('');
    });
    it('the trip page hands the widget the number with its country', () => {
      const page = read('src/components/web_v2/ExpeditionDetail.jsx');
      expect(page).toContain('phone={formatFullPhone(form.dial, form.phone)}');
      expect(page).not.toMatch(/<BookingWidget[\s\S]{0,200}phone=\{form\.phone\}/);
    });
  });

  describe('a call off the half-hour grid', () => {
    it('overlap is "less than half an hour apart"', () => {
      expect(callsOverlap('09:55', '09:30')).toBe(true);
      expect(callsOverlap('09:55', '10:00')).toBe(true);
      expect(callsOverlap('09:55', '10:30')).toBe(false);
      expect(callsOverlap('09:30', '09:30')).toBe(true);
      expect(callsOverlap('09:30', '10:00')).toBe(false);      // on the grid a call touches its own slot only
      expect(callsOverlap('', '10:00')).toBe(false);
      expect(timeToMin('9:05')).toBe(545);
    });
    it('it counts at every offered time it overlaps', () => {
      const grid = ['09:00', '09:30', '10:00', '10:30'];
      const busy = busyByTime([{ fields: { Time: '09:55', Agent: 'Tomer Lan' } }], AGENTS.records.map(r => ({ name: `${r.fields.Name} ${r.fields['Last Name']}`, destinations: r.fields.Destinations })), { slots: grid });
      expect([...busy.keys()].sort()).toEqual(['09:30', '09:55', '10:00']);
      expect(busy.get('10:00').owners.has('tomer lan')).toBe(true);
      expect(busy.has('09:00')).toBe(false);
    });
    it('without the grid it is exactly as it was', () => {
      const busy = busyByTime([{ fields: { Time: '09:55', Agent: 'Tomer Lan' } }], []);
      expect([...busy.keys()]).toEqual(['09:55']);
    });
    const dayWith = appts => (u) => {
      if (table(u) === 'Appointments') return { records: appts };
      if (table(u) === 'Agents') return AGENTS;
      return { records: [] };
    };
    it('the list a customer sees leaves out both times a 09:55 call is in the way of', async () => {
      answer = dayWith([{ id: 'recAPPT0000000002', fields: { Time: '09:55', Agent: 'Tomer Lan', Expedition: 'Kilimanjaro' } }]);
      const r = await run(slots, { method: 'POST', body: { date: openDay, expedition: 'Kilimanjaro' } });
      expect(r.data.slots).toContain('09:00');
      expect(r.data.slots).not.toContain('09:30');
      expect(r.data.slots).not.toContain('10:00');
      expect(r.data.slots).toContain('10:30');
    });
    it('the same call does not close the time for a trip another agent covers', async () => {
      answer = dayWith([{ id: 'recAPPT0000000002', fields: { Time: '09:55', Agent: 'Tomer Lan', Expedition: 'Kilimanjaro' } }]);
      const r = await run(slots, { method: 'POST', body: { date: openDay, expedition: 'Annapurna' } });
      expect(r.data.slots).toContain('10:00');
    });
    it('with no trip named, any overlapping call closes the time', async () => {
      answer = dayWith([{ id: 'recAPPT0000000002', fields: { Time: '09:55', Agent: 'Tomer Lan' } }]);
      const r = await run(slots, { method: 'POST', body: { date: openDay } });
      expect(r.data.slots).not.toContain('09:30');
      expect(r.data.slots).not.toContain('10:00');
      expect(r.data.slots).toContain('11:00');
    });
    it('and the booking itself is refused for 10:00 while the only agent is on a 09:55 call', async () => {
      answer = dayWith([{ id: 'recAPPT0000000002', fields: { Time: '09:55', Agent: 'Tomer Lan', Expedition: 'Kilimanjaro' } }]);
      const r = await run(bookSlot, { body: { date: openDay, time: '10:00', name: 'דנה כהן', phone: '0501234567', expedition: 'Kilimanjaro' } });
      expect(r.status).toBe(409);
      expect(r.data).toEqual({ error: 'slot_taken' });
      expect(calls.filter(c => c.method === 'POST' && table(c.u) === 'Appointments')).toHaveLength(0);
    });
    it('someoneFreeAt reads the widened map', () => {
      const agents = [{ name: 'Tomer Lan', destinations: ['Kilimanjaro'] }];
      const busy = busyByTime([{ fields: { Time: '09:55', Agent: 'Tomer Lan' } }], agents, { slots: ['10:00'] });
      expect(someoneFreeAt({ time: '10:00', expedition: 'Kilimanjaro', agents, busy })).toBe(false);
    });
  });

  describe('booking again replaces the call that was open', () => {
    const today = '2026-11-11';
    const appt = (id, f) => ({ id, fields: { Status: 'confirmed', Phone: '+972501234567', Expedition: 'Kilimanjaro', Date: '2026-11-20', Time: '10:00', ...f } });
    it('the same phone, the same trip, still ahead', () => {
      const old = callsToReplace([appt('recAPPT0000000003', {})], { phone: '050-1234567', expedition: 'טיפוס לקילימנג׳רו', newId: 'recAPPT0000000009', todayYMD: today, nowMin: 600 });
      expect(old.map(r => r.id)).toEqual(['recAPPT0000000003']);
    });
    it('never the new call itself, a past call, a cancelled one, another person or another trip', () => {
      const list = [
        appt('recAPPT0000000009', {}),                                   // the booking just made
        appt('recAPPT0000000004', { Date: '2026-11-10' }),               // yesterday
        appt('recAPPT0000000005', { Date: today, Time: '09:00' }),       // earlier today
        appt('recAPPT0000000006', { Status: 'cancelled' }),
        appt('recAPPT0000000007', { Phone: '+972509999999' }),
        appt('recAPPT0000000008', { Expedition: 'Annapurna' }),
      ];
      expect(callsToReplace(list, { phone: '0501234567', expedition: 'Kilimanjaro', newId: 'recAPPT0000000009', todayYMD: today, nowMin: 600 })).toEqual([]);
    });
    it('a call later today counts as ahead; an unusable phone replaces nothing', () => {
      expect(callsToReplace([appt('recAPPT0000000003', { Date: today, Time: '16:00' })], { phone: '0501234567', expedition: 'Kilimanjaro', todayYMD: today, nowMin: 600 })).toHaveLength(1);
      expect(callsToReplace([appt('recAPPT0000000003', {})], { phone: '123', expedition: 'Kilimanjaro', todayYMD: today })).toEqual([]);
    });
    it('in the booking: the earlier call is cancelled, the other trip\'s call is not, and the customer is written to once', async () => {
      const earlier = { id: 'recAPPT0000000003', fields: { Status: 'confirmed', Phone: '+972501234567', Expedition: 'Kilimanjaro', Date: openDay, Time: '15:00', Agent: 'Tomer Lan' } };
      const other   = { id: 'recAPPT0000000008', fields: { Status: 'confirmed', Phone: '+972501234567', Expedition: 'Annapurna', Date: openDay, Time: '16:00' } };
      answer = (u, method) => {
        if (table(u) === 'Appointments' && method === 'POST') return { id: 'recAPPT0000000009', fields: {} };
        if (table(u) === 'Appointments' && method === 'GET' && /RIGHT\(/.test(decodeURIComponent(u))) return { records: [earlier, other, { id: 'recAPPT0000000009', fields: { Status: 'confirmed', Phone: '+972501234567', Expedition: 'Kilimanjaro', Date: openDay, Time: '11:00' } }] };
        if (table(u) === 'Agents') return AGENTS;
        if (/greenapi|green-api/.test(u)) return { idMessage: 'MSG1' };
        return { records: [] };
      };
      const r = await run(bookSlot, { body: { date: openDay, time: '11:00', name: 'דנה כהן', phone: '0501234567', expedition: 'Kilimanjaro' } });
      expect(r.data).toEqual({ ok: true });
      const cancelled = calls.filter(c => c.method === 'PATCH' && table(c.u) === 'Appointments' && c.body?.fields?.Status === 'cancelled').map(c => c.u.split('/').pop());
      expect(cancelled).toEqual(['recAPPT0000000003']);
      expect(green()).toHaveLength(1);                                   // the confirmation of the new call, nothing about the old one
      expect(green()[0].body.message).toContain('11:00');
    });
  });

  it('a lead from a foreign site books without a Hebrew WhatsApp', async () => {
    answer = (u, method) => {
      if (table(u) === 'Appointments' && method === 'POST') return { id: 'recAPPT0000000009', fields: {} };
      if (table(u) === 'Website Leads' && method === 'GET') return { records: [{ id: 'recLEAD0000000002', fields: { Stage: 'New Lead', Language: 'English', Expedition: 'Kilimanjaro' } }] };
      if (table(u) === 'Agents') return AGENTS;
      if (/greenapi|green-api/.test(u)) return { idMessage: 'MSG1' };
      return { records: [] };
    };
    const r = await run(bookSlot, { body: { date: openDay, time: '11:30', name: 'John Smith', phone: '+1 202-555-0123', expedition: 'Kilimanjaro' } });
    expect(r.data).toEqual({ ok: true });
    expect(green()).toHaveLength(0);
    const saved = calls.find(c => c.method === 'POST' && table(c.u) === 'Appointments');
    expect(saved.body.fields.Phone).toBe('+12025550123');
  });
});

describe('W10: what a refused lead tells the visitor', () => {
  it('only a refusal about the phone is a phone error', () => {
    expect(leadErrorKind(400, 'An Israeli mobile needs 10 digits (05X-XXXXXXX)')).toBe('phone');
    expect(leadErrorKind(400, 'Please enter a real phone number')).toBe('phone');
    expect(leadErrorKind(400, 'Invalid email address')).toBe('email');
    expect(leadErrorKind(400, 'Invalid name')).toBe('name');
    expect(leadErrorKind(400, 'Invalid submission')).toBe('general');
    expect(leadErrorKind(429, 'Too many requests — please wait a moment')).toBe('busy');
    expect(leadErrorKind(500, 'Submission failed')).toBe('general');
    expect(leadErrorKind(403)).toBe('general');
  });
  it('every kind has Hebrew and English words, and none is the server\'s own sentence', () => {
    for (const kind of ['phone', 'email', 'name', 'busy', 'general']) {
      expect(LEAD_ERROR_HE[kind]).toMatch(/[֐-׿]/);
      expect(LEAD_ERROR_HE[kind]).not.toMatch(/[A-Za-z—]/);
      expect(LEAD_ERROR_EN[kind]).toBeTruthy();
    }
  });
  it('German and Spanish have the new sentences', () => {
    for (const l of ['de', 'es']) {
      const dict = JSON.parse(read(`src/i18n/ui-${l}.json`));
      for (const k of [...Object.values(LEAD_ERROR_EN), "We couldn't load the available times.", 'Try again']) expect(dict[k], `${l}: ${k}`).toBeTruthy();
    }
  });
  it('the trip form never shows the server\'s text, and the Israel form keeps the phone box for phone errors', () => {
    const trip = read('src/components/web_v2/ExpeditionDetail.jsx');
    expect(trip).toContain('setErrorMsg(isRtl ? LEAD_ERROR_HE[kind] : tx(LEAD_ERROR_EN[kind]));');
    expect(trip).not.toContain('msg = d?.error || msg');
    expect(trip).not.toContain("err.message || 'שגיאה. נסו שוב.'");
    const israel = read('src/components/web_v2/IsraelDetail.jsx');
    expect(israel).toContain("if (kind === 'phone') setPhoneError(");
    expect(israel).toContain('else setSubmitError(isRtl ? LEAD_ERROR_HE[kind] : LEAD_ERROR_EN[kind]);');
    expect(israel).toContain('{submitError && (');
  });
});

describe('W11: the call picker', () => {
  const widget = read('src/components/web_v2/BookingWidget.jsx');
  it('a failed load is said, with a way to ask again, and is not "no times"', () => {
    expect(widget).toContain('.catch(() => { setSlots([]); setSlotsFailed(true); setSlotsLoad(false); });');
    expect(widget).toContain('}, [selDate, slotsTry]);');
    expect(widget.indexOf(') : slotsFailed ? (')).toBeGreaterThan(-1);
    expect(widget.indexOf(') : slotsFailed ? (')).toBeLessThan(widget.indexOf(') : slots.length === 0 ? ('));
    expect(widget).toContain('onClick={() => setSlotsTry(n => n + 1)}');
    expect(widget).toContain('לא הצלחנו לטעון את השעות הפנויות.');
  });
  it('"maybe later" is drawn only where it does something', () => {
    expect(widget).toMatch(/\{onSkip && <button\s+type="button"\s+onClick=\{onSkip\}/);
    expect(read('src/components/web_v2/BookCall.jsx')).not.toContain('onSkip=');
    expect(read('src/components/web_v2/ExpeditionDetail.jsx')).toContain('onSkip={() => setShowBooking(false)}');
  });
});

describe('W17: a magazine address is a page, or it is a 404', () => {
  const intl = readIntl();
  it('every language a post is listed in has its text, so its page gets built', () => {
    let pages = 0;
    for (const post of POSTS) for (const lng of (BLOG_LANGS[post.slug] || []).filter(l => l !== 'he')) {
      const t = postTexts(post, lng, intl);
      expect(t, `${post.slug} in ${lng}`).toBeTruthy();
      expect(t.title, `${post.slug} ${lng} title`).toBeTruthy();
      expect(t.content.length, `${post.slug} ${lng} content`).toBeGreaterThan(0);
      pages++;
    }
    expect(pages).toBeGreaterThan(70);
  });
  it('the three English posts that had no page have one: their own English', () => {
    for (const slug of ['nepal-visa-guide', 'kilimanjaro-routes-compared', 'kilimanjaro-climb-cost-guide']) {
      const post = POSTS.find(p => p.slug === slug);
      expect(intl.en[slug], slug).toBeUndefined();                 // no international file: the gap this closes
      expect(postLangs(slug, intl)).toContain('en');
      expect(postTexts(post, 'en', intl).title).toBe(post.titleEn);
      expect(postTexts(post, 'de', intl)).toBeNull();              // German only where a file exists
    }
  });
  it('an international file still wins over the post\'s own English', () => {
    const slug = Object.keys(intl.en)[0];
    expect(postTexts(POSTS.find(p => p.slug === slug), 'en', intl)).toBe(intl.en[slug]);
  });
  it('the page generator builds from the same answer', () => {
    const gen = read('scripts/generate-html-shells.mjs');
    expect(gen).toContain('const tr = postTexts(post, lng, INTL);');
    expect(gen).toContain("fs.writeFileSync(path.join(DIST, lng, '404.html')");
  });
  it('abroad, an address that is not a post there answers from the site\'s 404 page', () => {
    expect(blogNotFound('en.highair-expeditions.com', '/blog/no-such-post')).toBe('/en/404.html');
    expect(blogNotFound('de.highair-expeditions.com', '/blog/sinai-high-mountain-trek-guide')).toBe('/de/404.html');   // Hebrew only
    expect(blogNotFound('de.highair-expeditions.com', '/blog/nepal-visa-guide')).toBe('/de/404.html');                 // English, not German
    expect(blogNotFound('en.highair-expeditions.com', '/blog/nepal-visa-guide')).toBeNull();
    expect(blogNotFound('en.highair-expeditions.com', '/blog')).toBeNull();
    expect(blogNotFound('www.highair-expeditions.com', '/blog/no-such-post')).toBeNull();     // the Hebrew site: Vercel's own 404
    expect(blogNotFound('es.highair-expeditions.com', '/blog/UPPER_case.html')).toBe('/es/404.html');
  });
  it('the middleware answers 404, out of search, with that page as the body', async () => {
    answer = u => (u.endsWith('/en/404.html') ? new Response('<html lang="en">not found shell</html>', { status: 200 }) : new Response('', { status: 500 }));
    const res = await middleware(new Request('https://en.highair-expeditions.com/blog/no-such-post'));
    expect(res.status).toBe(404);
    expect(res.headers.get('x-robots-tag')).toBe('noindex');
    expect(await res.text()).toContain('not found shell');
    expect(calls.map(c => c.u)).toEqual(['https://en.highair-expeditions.com/en/404.html']);
  });
  it('a real post is still routed to its page, with no extra request', async () => {
    const res = await middleware(new Request('https://en.highair-expeditions.com/blog/nepal-visa-guide'));
    expect(res.headers.get('x-middleware-rewrite')).toBe('https://en.highair-expeditions.com/en/blog/nepal-visa-guide/index.html');
    expect(calls).toHaveLength(0);
    expect(englishShellPath('en.highair-expeditions.com', '/blog/nepal-visa-guide')).toBe('/en/blog/nepal-visa-guide/index.html');
  });
  it('if the 404 page cannot be fetched the answer is still a 404', async () => {
    answer = () => { throw new Error('network'); };
    const res = await middleware(new Request('https://es.highair-expeditions.com/blog/nada'));
    expect(res.status).toBe(404);
  });
});

describe('W18: the shared 404 document', () => {
  const gen = read('scripts/generate-html-shells.mjs');
  it('its title is in no language, since one file answers every host', () => {
    expect(gen).toContain("title: '404 | HighAir Expeditions'");
    expect(gen).not.toContain("title: '404 - הדף לא נמצא | HighAir Expeditions'");
  });
  it('an unknown address still lands on the home page, as the owner set on 5 Nov 2026', () => {
    expect(read('src/main.jsx')).toContain('<Route path="/*"                 element={<Navigate to="/" replace />} />');
  });
});

describe('W33: photos nobody has scrolled to', () => {
  it('the lazy attribute comes before the address on every picture', () => {
    /* React sets attributes in the order they are written. With the address first the browser
       started the download before it learned the picture was lazy: the home page fetched the
       donation, gallery and magazine photos with the page, 700KB that most visitors never reach. */
    const offenders = [];
    for (const f of fs.readdirSync('src/components/web_v2').filter(x => x.endsWith('.jsx'))) {
      const src = read(`src/components/web_v2/${f}`);
      for (const m of src.matchAll(/<img\b/g)) {
        let depth = 0, j = m.index + 4;
        for (; j < src.length; j++) { const c = src[j]; if (c === '{') depth++; else if (c === '}') depth--; else if (c === '>' && depth === 0) break; }
        const tag = src.slice(m.index, j + 1);
        const lazy = tag.search(/\bloading=/), addr = tag.search(/\bsrc(Set)?=/);
        if (lazy > -1 && addr > -1 && lazy > addr) offenders.push(`${f}:${src.slice(0, m.index).split('\n').length}`);
      }
    }
    expect(offenders).toEqual([]);
  });
  it('the Safari cards take the lighter copy, once the card is near', () => {
    const page = read('src/components/web_v2/SafariPage.jsx');
    expect(page).toContain('const [ref, near] = useNearView();');
    expect(page).toContain("...(near && img ? { backgroundImage: `url(${smallOf(img)})` } : null),");
    expect(page.match(/<CardPhoto img=/g)).toHaveLength(2);
    expect(page).not.toMatch(/backgroundImage: `url\(\$\{(d\.)?img\}\)`/);
  });
  it('every Safari photo has its lighter copy on disk, lighter than the original', () => {
    const safari = fs.readdirSync('public/images/safari').filter(f => f.endsWith('.webp'));
    expect(safari.length).toBeGreaterThanOrEqual(10);
    for (const f of safari) {
      const v = VARIANTS[`/images/safari/${f}`];
      expect(v, `${f}: run node scripts/gen-image-variants.mjs`).toBeTruthy();
      expect(fs.statSync(`public${v.s}`).size).toBeLessThan(fs.statSync(`public/images/safari/${f}`).size);
    }
  });
});
