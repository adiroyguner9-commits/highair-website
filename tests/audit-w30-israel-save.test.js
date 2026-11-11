/* Audit W30, second half (12 Nov 2026): the Israel sign-up form.

   When saving the details failed (a server error, or no answer at all) the
   form still sent the visitor on to payment, so a payment could arrive with no
   registration behind it. The form now goes on only after the server said the
   details were saved; otherwise it shows its own error line.

   The first half of the finding (a field the table may not have) is not
   changed here: the handler writes exactly the fields it wrote before, and
   this file pins that list so it can be checked against the live table. */
import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'node:fs';

process.env.AIRTABLE_BASE = 'appTEST';
process.env.AIRTABLE_TOKEN = 'tok';
delete process.env.RESEND_API_KEY;

const calls = [];
let answer = () => ({});
globalThis.fetch = async (url, init = {}) => {
  let body = null; try { body = init.body ? JSON.parse(init.body) : null; } catch { body = init.body; }
  calls.push({ u: String(url), method: init.method || 'GET', body });
  const out = await answer(String(url), body);
  if (out instanceof Response) return out;
  return new Response(JSON.stringify(out ?? {}), { status: 200, headers: { 'content-type': 'application/json' } });
};

const { default: israelLead } = await import('../api/israel-lead.js');
const { leadErrorKind, LEAD_ERROR_HE } = await import('../src/website/formRules.js');
const read = f => fs.readFileSync(f, 'utf8');

let ipN = 0;
async function post(body) {
  let status = 200, data;
  const res = { status(s) { status = s; return this; }, json(d) { data = d; return this; }, end() { return this; }, setHeader() { return this; } };
  await israelLead({ method: 'POST', headers: { 'x-vercel-forwarded-for': `10.30.${Math.floor(ipN / 250)}.${ipN++ % 250}` }, socket: {}, body }, res);
  return { status, data };
}
const SIGNUP = { name: 'דנה כהן', phone: '+972501234567', email: 'dana@example.com', tripName: 'רכס רמים', tripDate: '2026-11-21', packageId: 'day', participants: 2, free: false };
beforeEach(() => { calls.length = 0; answer = () => ({ id: 'recISR00000000001' }); });

describe('W30: the server says plainly whether the details were saved', () => {
  it('saved: 200 with the record id', async () => {
    const r = await post(SIGNUP);
    expect(r.status).toBe(200);
    expect(r.data).toEqual({ ok: true, id: 'recISR00000000001' });
  });
  it('Airtable refused the record: not ok, and nothing claims success', async () => {
    answer = () => new Response(JSON.stringify({ error: { type: 'UNKNOWN_FIELD_NAME' } }), { status: 422 });
    const r = await post(SIGNUP);
    expect(r.status).toBe(500);
    expect(r.data.ok).toBeUndefined();
    expect(r.data.error).toBe('Submission failed');
  });
  it('Airtable did not answer: not ok', async () => {
    answer = () => { throw new Error('socket hang up'); };
    const r = await post(SIGNUP);
    expect(r.status).toBe(500);
    expect(r.data.ok).toBeUndefined();
  });
  it('a failed save is the "could not send, try again" line, in Hebrew', () => {
    expect(leadErrorKind(500, 'Submission failed')).toBe('general');
    expect(leadErrorKind(500, 'Network error')).toBe('general');
    expect(leadErrorKind(503)).toBe('general');
    expect(LEAD_ERROR_HE.general).toBe('לא הצלחנו לשלוח את הפרטים. אפשר לנסות שוב בעוד רגע');
  });
});

describe('W30: the form goes on to payment only after a saved registration', () => {
  const src = read('src/components/web_v2/IsraelDetail.jsx');
  const at = src.indexOf('async function handleSubmit(e)');
  const fn = src.slice(at, src.indexOf('/* ── Live groups from Airtable ── */', at));
  /* comments out, so only the code is read */
  const code = fn.replace(/\/\*[\s\S]*?\*\//g, '');

  it('the function was found whole', () => {
    expect(at).toBeGreaterThan(-1);
    expect(code).toContain("fetch('/api/israel-lead'");
    expect(code).toContain('window.location.href = payUrl;');
  });
  it('any answer that is not ok stops the form: a 5xx is no longer let through', () => {
    expect(code).toContain('if (!res.ok) {');
    expect(code).not.toMatch(/res\.status\s*>=\s*400\s*&&\s*res\.status\s*<\s*500/);
    expect(code).not.toContain('if (res.ok) {');
  });
  it('"saved" is set in one place, after the not-ok return, and nowhere else', () => {
    expect(code.match(/saved = true/g)).toHaveLength(1);
    expect(code).toContain('let saved = false;');
    const notOk = code.indexOf('if (!res.ok) {');
    const ret = code.indexOf('return;', notOk);
    expect(code.indexOf('saved = true')).toBeGreaterThan(ret);
  });
  it('no answer at all (the catch) leaves "saved" false, and that shows the error line and stops', () => {
    const guard = code.indexOf('if (!saved) {');
    expect(guard).toBeGreaterThan(code.indexOf('} catch (err) {'));
    const block = code.slice(guard, code.indexOf('}', guard) + 1);
    expect(block).toContain('setSubmitError(isRtl ? LEAD_ERROR_HE.general : LEAD_ERROR_EN.general);');
    expect(block).toContain('setSubmitting(false);');
    expect(block).toContain('return;');
  });
  it('both ways on (payment, and the WhatsApp group of a free trek) come after that guard', () => {
    const guard = code.indexOf('if (!saved) {');
    for (const go of ['window.location.href = trip.whatsappUrl;', 'window.location.href = payUrl;']) {
      expect(code.match(new RegExp(go.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')), go).toHaveLength(1);
      expect(code.indexOf(go), go).toBeGreaterThan(guard);
    }
    expect(code.match(/window\.location/g)).toHaveLength(2);
  });
  it('tracking after a good save cannot hold the customer back', () => {
    /* trackLead sits after saved = true, inside the try: if it throws, the
       catch only logs and "saved" is already true */
    expect(code.indexOf('await trackLead(')).toBeGreaterThan(code.indexOf('saved = true'));
    expect(code.indexOf('await trackLead(')).toBeLessThan(code.indexOf('} catch (err) {'));
  });
  it('the error line it uses is the one the form already had', () => {
    expect(src).toContain('{submitError && (');
    expect(src).toContain('<p role="alert"');
  });
});

describe('W30, first half: the fields the handler writes (for checking against the live IsraelCustomers table)', () => {
  /* Nothing was removed or added. */
  const F = {
    fullName:      'fldT1DxgwMYHIM5Mx',
    phone:         'fldKUy6EYV8bp8cGj',
    email:         'fldbFOqas3Ecr7psw',
    trip:          'fldTbZTU62LvmfOBN',
    tripDate:      'fldNF5703EdITvcRw',
    package:       'fldQktU5Y8F420QRe',
    pricePaid:     'fldaASxJJ6xBuiyja',
    paymentStatus: 'fldiz7jcYO3GwH7Nh',
    notes:         'flderzKj1hhTrja9E',
    participants:  'fldCrgHvTemf1ze4m',
  };
  const written = async body => { await post(body); return calls.find(c => c.method === 'POST' && /IsraelCustomers/.test(c.u)).body.fields; };

  it('the map in the file is these ten ids', () => {
    const file = read('api/israel-lead.js');
    const block = file.slice(file.indexOf('const F = {'), file.indexOf('};', file.indexOf('const F = {')));
    const ids = Object.fromEntries([...block.matchAll(/(\w+):\s*'(fld[A-Za-z0-9]{14})'/g)].map(m => [m[1], m[2]]));
    expect(ids).toEqual(F);
  });
  it('a paid sign-up with a dated trek', async () => {
    const f = await written(SIGNUP);
    expect(f).toEqual({
      [F.fullName]: 'דנה כהן', [F.phone]: '+972501234567', [F.trip]: 'רכס רמים', [F.paymentStatus]: 'ממתין לתשלום',
      [F.email]: 'dana@example.com', [F.package]: 'טרק יומי בארץ - ₪249', [F.pricePaid]: 498, [F.participants]: 2, [F.tripDate]: '2026-11-21',
    });
  });
  it('a free sign-up, and a date that is not a date goes to the notes', async () => {
    const f = await written({ name: 'דנה כהן', phone: '+972501234567', tripName: 'נחל כזיב', tripDate: 'נובמבר 2026', free: true });
    expect(f).toEqual({ [F.fullName]: 'דנה כהן', [F.phone]: '+972501234567', [F.trip]: 'נחל כזיב', [F.participants]: 1, [F.notes]: 'תאריך: נובמבר 2026' });
  });
  it('every key it ever sends is one of the ten', async () => {
    const all = new Set(Object.values(F));
    for (const body of [SIGNUP, { ...SIGNUP, free: true }, { ...SIGNUP, tripDate: 'בקרוב', packageId: 'with-stay' }, { ...SIGNUP, email: '', packageId: '' }]) {
      for (const k of Object.keys(await written(body))) expect(all.has(k), k).toBe(true);
      calls.length = 0;
    }
  });
});
