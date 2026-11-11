/**
 * POST /api/submit-lead
 * Dedicated endpoint for Website Lead form submissions.
 * Writes to Airtable AND sends email notification via Resend.
 */

export const config = { api: { bodyParser: true } };

import {
  escapeHtml,
  sanitiseFields,
  isValidEmail,
  isValidName,
  checkRateLimit,
  setSecurityHeaders,
} from './_security.js';
import { fetchActiveLead, tripKey, OPEN_STAGES } from './_lib/active-lead.js';
import { destKey, destEn, DEST } from './_lib/dest.js';
import { normalizePhone, phoneIsValid, phoneError } from './_lib/phone.js';
import { googleCampaignName } from './_lib/googleCampaigns.js';
import { emailShell, p, heading, details } from './_lib/email-shell.js';
import { withFlag } from './_lib/dest-flag.js';
import { israelStamp } from './_lib/iltime.js';

/* Fields that exist in the Airtable "Website Leads" table */
const AIRTABLE_FIELDS = new Set([
  'Name', 'Phone', 'Email', 'Expedition',
  'Preferred Month', 'Age', 'Group Size', 'Experience', 'Source',
  'Message', 'Created Time',
  'UTM Source', 'UTM Medium', 'UTM Campaign', 'UTM Content', 'UTM Term',
  'Attribution', 'Language',
]);

/* The language of the site the form was sent from (5 Nov 2026): the team
   answers in it. Read from the request's Origin / Referer, never trusted from
   the body: en. / de. / es. → English / German / Spanish, anything else on our
   domain → Hebrew. Unknown origin (previews, local) → left empty. */
export function leadLanguage(headers = {}) {
  const src = String(headers.origin || headers.referer || '');
  let host = '';
  try { host = new URL(src).hostname; } catch { return null; }
  if (!(host === 'highair-expeditions.com' || host.endsWith('.highair-expeditions.com'))) return null;
  return { en: 'English', de: 'German', es: 'Spanish' }[host.split('.')[0]] || 'Hebrew';
}

/* The company phone format, shared with the webapp: "+972501234567".
   This used to normalise to the LOCAL "0XXXXXXXXX" form, the exact opposite of
   what the rest of the system stores, so every website lead re-dirtied the base
   the moment it arrived (Aug 2 2026). Everything downstream here matches on the
   last 9 digits, so the switch is invisible to dedupe and to the blocklist. */
const canonPhone = normalizePhone;

/* Internal numbers that must NEVER become leads — every employee/agent plus any
   number the owner lists. Built from: every Agents-table Phone (staff) + the
   AppContent key `lead_blocklist_phones` (comma / space / newline separated).
   Matched on the last 9 digits. Cached 5 min; fails OPEN on read error so a
   real lead is never silently dropped. */
let _blk = { at: 0, set: null };
async function blockedLast9(BASE, TOKEN) {
  if (_blk.set && Date.now() - _blk.at < 5 * 60 * 1000) return _blk.set;
  const set = new Set();
  const add = p => { const l9 = String(p || '').replace(/\D/g, '').slice(-9); if (l9.length === 9) set.add(l9); };
  try {
    const H = { headers: { Authorization: `Bearer ${TOKEN}` } };
    const [ar, cr] = await Promise.all([
      fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Agents')}?maxRecords=100&fields[]=Phone`, H),
      fetch(`https://api.airtable.com/v0/${BASE}/${encodeURIComponent('AppContent')}?filterByFormula=${encodeURIComponent('{Key}="lead_blocklist_phones"')}&maxRecords=1&fields[]=Value`, H),
    ]);
    for (const rec of (await ar.json().catch(() => ({}))).records || []) add(rec.fields?.Phone);
    const cfg = (await cr.json().catch(() => ({}))).records?.[0]?.fields?.Value || '';
    String(cfg).split(/[\s,;]+/).forEach(add);
    _blk = { at: Date.now(), set };
  } catch (e) { console.warn('[submit-lead] blocklist read non-fatal:', e.message); }
  return set;
}

export default async function handler(req, res) {
  setSecurityHeaders(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* ── Rate limiting ── */
  if (!checkRateLimit(req, 'submit-lead')) {
    return res.status(429).json({ error: 'Too many requests — please wait a moment' });
  }

  const TOKEN = process.env.AIRTABLE_TOKEN;
  const BASE  = process.env.AIRTABLE_BASE;
  if (!TOKEN || !BASE) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const rawFields = req.body?.fields || {};

  /* ── Extract and sanitise UTM params ── */
  const rawUtm = req.body?.utmParams || {};
  const utm = {
    source:   String(rawUtm.utm_source   || '').trim().slice(0, 100),
    medium:   String(rawUtm.utm_medium   || '').trim().slice(0, 100),
    campaign: String(rawUtm.utm_campaign || '').trim().slice(0, 200),
    content:  String(rawUtm.utm_content  || '').trim().slice(0, 200),
    term:     String(rawUtm.utm_term     || '').trim().slice(0, 200),
  };

  /* ── Input validation ── */
  const name  = (rawFields['Name']  || '').trim();
  const phone = (rawFields['Phone'] || '').trim();
  const email = (rawFields['Email'] || '').trim();

  if (!isValidName(name)) {
    return res.status(400).json({ error: 'Invalid name' });
  }
  /* The old check only counted digits (7-15), so a mobile missing a digit
     sailed through, got normalised, and became a lead nobody could ever reach.
     phoneIsValid knows the real Israeli shapes and leaves foreign numbers to
     their own country's rules (Aug 2 2026). */
  if (phone && !phoneIsValid(phone)) {
    return res.status(400).json({ error: phoneError(phone) || 'Invalid phone number' });
  }
  if (email && !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  /* ── Sanitise all fields (length limits) ── */
  const sanitised = sanitiseFields(rawFields);

  /* ── Honeypot: bots fill hidden fields humans don't see ── */
  if (rawFields['_hp']) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  /* ── Strip fields not in Airtable schema ── */
  const airtableFields = Object.fromEntries(
    Object.entries(sanitised).filter(([k, v]) =>
      AIRTABLE_FIELDS.has(k) && v !== undefined && v !== ''
    )
  );

  /* Store the phone in canonical "0XXXXXXXXX" format so every lead that
     enters the system is uniform for later matching + WhatsApp sending. */
  if (airtableFields['Phone']) {
    airtableFields['Phone'] = canonPhone(airtableFields['Phone']);
  }

  /* ONE canonical English value in {Expedition} — the web_v2 pages submit the
     Hebrew page title while every other source writes the English key, which
     left the Airtable column mixed. The exact page name survives verbatim
     inside {Source} ("Expedition Page - <Hebrew name>"), so nothing is lost —
     including which Kilimanjaro page (regular / kosher) the lead came from. */
  if (airtableFields['Expedition']) {
    const canonical = destKey(airtableFields['Expedition']);
    if (canonical) airtableFields['Expedition'] = canonical;
  }

  /* ── Timestamp in Israel time, ISO 8601 (sortable + uniform with the whole
        Website Leads table; +03:00 summer / +02:00 winter). The offset comes
        from the shared helper: the rule written here was an hour out on the
        Friday and Saturday before the last Sunday of March (W29). ── */
  const israelTime = israelStamp(new Date());
  airtableFields['Created Time'] = israelTime;

  /* Which site the lead came from, so the team answers in that language */
  const language = leadLanguage(req.headers);
  if (language) airtableFields['Language'] = language;
  else delete airtableFields['Language'];   // never from the form body

  /* ── Attach UTM fields to Airtable payload ── */
  if (utm.source)   airtableFields['UTM Source']   = utm.source;
  if (utm.medium)   airtableFields['UTM Medium']   = utm.medium;
  if (utm.campaign) airtableFields['UTM Campaign'] = utm.campaign;
  if (utm.content)  airtableFields['UTM Content']  = utm.content;
  if (utm.term)     airtableFields['UTM Term']      = utm.term;

  /* ── Where this person actually came from ──
     utm_* alone answers "which ad" and nothing else, and it is blank for anyone
     who arrived without campaign params — which was 185 of 326 leads in
     Jul–Aug 2026. This block keeps the click ids and the referrer too, so a
     lead is attributable even when the UTM template fails (two leads that month
     arrived carrying the literal text "{{campaign.name}}"), and it records the
     FIRST touch, which is the one the ad actually paid for. */
  const a = req.body?.attribution || {};
  const clean = v => String(v || '').trim().slice(0, 300);
  const lines = [];
  if (clean(a.firstSource))  lines.push(`מגע ראשון: ${clean(a.firstSource)}${clean(a.firstAt) ? ` (${clean(a.firstAt).slice(0, 10)})` : ''}`);
  if (clean(a.firstLanding)) lines.push(`דף נחיתה ראשון: ${clean(a.firstLanding)}`);
  if (clean(a.lastSource) && clean(a.lastSource) !== clean(a.firstSource))
                             lines.push(`מגע אחרון: ${clean(a.lastSource)}${clean(a.lastAt) ? ` (${clean(a.lastAt).slice(0, 10)})` : ''}`);
  if (clean(a.referrer))     lines.push(`הפניה: ${clean(a.referrer)}`);
  if (clean(a.fbclid))       lines.push(`fbclid: ${clean(a.fbclid)}`);
  if (clean(a.gclid))        lines.push(`gclid: ${clean(a.gclid)}`);
  if (lines.length) airtableFields['Attribution'] = lines.join('\n').slice(0, 2000);

  console.log('[submit-lead] Lead:', sanitised['Expedition'] || sanitised['Source']);

  const LEADS_URL = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent('Website Leads')}`;

  /* ── 0. Dedupe by phone. If this person is already a lead, APPEND this inquiry
        to their existing row instead of creating a duplicate — preserving their
        Stage + Assigned Agent so the pipeline isn't disturbed — then stop (no
        new-lead webhooks/email for a returning contact). ── */
  const last9 = String(airtableFields['Phone'] || '').replace(/\D/g, '').slice(-9);

  /* ── Blocklist: internal / employee numbers never become leads. Silently
        succeed (no create, no dedupe-append, no webhooks) so the form still
        shows a normal success to whoever submitted it. ── */
  if (last9.length === 9 && (await blockedLast9(BASE, TOKEN)).has(last9)) {
    console.log('[submit-lead] blocklisted number, ignored: …' + String(airtableFields['Phone'] || '').replace(/\D/g, '').slice(-3));
    return res.status(200).json({ ok: true, blocked: true });
  }

  if (last9.length === 9) {
    try {
      /* The ACTIVE card. A follow-up enquiry used to be appended to whichever
         row came back first, so a new Aconcagua enquiry could be filed on a
         returning customer's closed Kazbek card (Aug 13 2026). */
      const rec = await fetchActiveLead({
        base: BASE, token: TOKEN, phone: sanitised['Phone'], fields: ['Experience', 'Expedition'],
      });
      /* Append ONLY when it is the same trip. A returning climber asking about
         somewhere new is a new deal and needs its own card: Michael Schechter
         walked Peaks of Balkan in June and asked about Ethiopia on 28 Aug 2026,
         and the enquiry became a line of text on his closed Balkan card. No
         card, no agent, no alert, no funnel entry. 24 enquiries were lost that
         way between 10 Jul and 28 Aug, nine of them onto cards marked "Not
         Relevant" that nobody opens — including Eli Itzhak twice, the very
         customer the returning-lead rule was written for.

         The webapp already handles this correctly (api/_lib/returning.js opens
         a second card and gives it to the agent who knows them), but it never
         got the chance: the enquiry died here, one layer earlier. So this stops
         at "is it the same trip" and lets the card be created; the webapp then
         does the rest.

         When in doubt, CREATE. A duplicate card is visible and an agent can
         merge it in a second; a swallowed lead is invisible for ever. */
      const sameTrip = rec && tripKey(rec.fields?.Expedition) === tripKey(sanitised['Expedition'])
                           && !!tripKey(sanitised['Expedition']);
      /* And only onto a card that is still being worked. A closed deal is
         locked in the Lead Center (owner, 22 Oct 2026: it moves only to
         Cancelled), and a "Not Relevant" card is never opened, so a line of
         text there is a lost enquiry: the same trip again is a new deal and
         gets its own card. */
      const stillOpen = rec && OPEN_STAGES.includes(rec.fields?.Stage || 'New Lead');
      if (rec && sameTrip && stillOpen) {
        {
          const note = `\n---\n[פנייה נוספת ${israelTime.slice(0, 10)}] ${sanitised['Expedition'] || sanitised['Source'] || ''}${sanitised['Experience'] ? ': ' + sanitised['Experience'] : ''}`;
          const linked = await fetch(`${LEADS_URL}/${rec.id}`, {
            method: 'PATCH', headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ fields: { Experience: ((rec.fields?.Experience || '') + note).slice(0, 100000) } }),
            signal: AbortSignal.timeout(3500),
          });
          /* Only when the note really landed. This answered "ok" whatever Airtable
             said, so a refused update lost the enquiry with a thank-you on screen.
             If it did not land, fall through and create a card: when in doubt, CREATE. */
          if (linked.ok) {
            console.log('[submit-lead] returning contact, same trip → linked to existing lead', rec.id);
            return res.status(200).json({ ok: true, linked: true });
          }
          console.warn(`[submit-lead] could not add to the existing lead (${linked.status}) → new card`);
        }
      }
      if (rec && sameTrip) console.log(`[submit-lead] returning contact, same trip on a ${rec.fields?.Stage || '?'} card → new card`);
      else if (rec) console.log(`[submit-lead] returning contact, DIFFERENT trip (${rec.fields?.Expedition || '—'} → ${sanitised['Expedition'] || '—'}) → new card`);
    } catch (e) { console.warn('[submit-lead] dedupe check non-fatal:', e.message); }
  }

  /* ── 1. Write to Airtable (new contact) ──
     A lead that cannot be saved is NOT dropped here any more: the function goes
     on to the office email below, which then says so in its subject. The visitor
     only sees an error if the email could not leave either (11 Nov 2026: one
     busy answer from Airtable, or one value it refused, used to end in "500" with
     the enquiry stored nowhere). */
  let saved = { ok: false, why: '' };
  try {
    /* Stage is stamped HERE, at birth, and deliberately NOT left to the
       assignment cron. It used to arrive blank and stay blank for up to a
       minute until lead-notify filled it in, and that gap was a live race: a
       visitor who books a call inside it gets Stage 'Call Scheduled' from
       book-slot, then the cron — still holding a snapshot that read blank —
       writes 'New Lead' straight over it. It happened to Noga Ben Yaakov on
       16 Jul (booked 26s after submitting) and again to a lead on 7 Aug
       (booked 37s after, call an hour later, sitting in the wrong column).
       Guarding the cron's write with a staleness check was the first attempt
       and it does not work — the check reads the same stale snapshot. One
       writer at creation removes the race instead of narrowing it.

       NOT part of airtableFields on purpose: that object is built from client
       input, and Stage must never be settable from the request body. */
    saved = await saveLead(LEADS_URL, TOKEN, { ...airtableFields, Stage: 'New Lead' });
  } catch (err) {
    saved = { ok: false, why: err.message };
  }
  if (!saved.ok) console.error('[submit-lead] NOT SAVED to Airtable:', saved.why);
  else if (saved.partial) console.error('[submit-lead] saved with the core fields only:', saved.why);

  /* GoHighLevel is retired (owner, Jul 30 2026) — the outbound lead webhook that
     used to fire here was removed. Leads live in Airtable and are assigned by the
     webapp's own api/lead-notify cron. */

  /* The Make.com webhook that used to fire here was removed with GoHighLevel
     (owner, Jul 30 2026) — its only job was to push the lead into the GHL
     pipeline. Leads live in Airtable; the webapp's api/lead-notify cron owns
     assignment and alerts. */

    /* ── 4. Send email via Resend (HTML-escaped) ── */
  const RESEND_KEY = process.env.RESEND_API_KEY;
  let emailed = false;
  if (RESEND_KEY) {
    const f = sanitised;
    /* A lead from abroad: the whole email in English, the destination in the
       subject, and which site (so the reply goes out in that language). Leads
       from the Hebrew site keep the Hebrew email (owner, 6 Nov 2026). */
    const mail = FOREIGN_LANGS.includes(language) ? foreignLeadEmail(f, language, utm) : hebrewLeadEmail(f, utm);

    try {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization:  `Bearer ${RESEND_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from:    'HighAir Website <noreply@highair-expeditions.com>',
          to:      ['info@highair-expeditions.com'],
          subject: leadMailSubject(mail.subject, saved),
          html:    mail.html,
        }),
      });
      if (!emailRes.ok) {
        console.error('[submit-lead] Resend error:', emailRes.status);
      } else {
        emailed = true;
      }
    } catch (emailErr) {
      console.warn('[submit-lead] Resend non-fatal:', emailErr.message);
    }
  }

  /* Saved, or at least in the office inbox: the enquiry exists. Neither: say so,
     so the visitor tries again or writes on WhatsApp. */
  if (!saved.ok && !emailed) return res.status(500).json({ error: 'Submission failed' });
  return res.status(200).json({ ok: true });
}

const FOREIGN_LANGS = ['English', 'German', 'Spanish'];

/* The staff email for a lead from the Hebrew site (unchanged wording). */
/* Save a new lead, and do not give up on the first refusal.
   - busy (429), a server error or no answer: once more after a short wait
   - a field or a value Airtable refuses (422, the "one unknown column loses the
     whole lead" trap): save the person with the fields that cannot fail, and put
     everything else in the Experience text so the agent still sees it
   Returns { ok, partial?, why? }. Never throws for an HTTP answer. */
const SAFE_LEAD_FIELDS = ['Name', 'Phone', 'Email', 'Stage'];
export async function saveLead(url, token, fields, { fetchImpl = fetch, wait = 350 } = {}) {
  const post = async f => {
    const r = await fetchImpl(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields: f }),
      signal: AbortSignal.timeout(3500),
    });
    let d = null;
    try { d = await r.json(); } catch { /* no body */ }
    return { ok: r.ok, status: r.status, msg: String(d?.error?.message || d?.error?.type || d?.error || '').slice(0, 200) };
  };
  let last = { ok: false, status: 0, msg: '' };
  for (let i = 0; i < 2; i++) {
    try { last = await post(fields); } catch (e) { last = { ok: false, status: 0, msg: e.message }; }
    if (last.ok) return { ok: true };
    if (last.status === 422) break;                 // the same body would be refused again
    if (i === 0) await new Promise(r => setTimeout(r, wait));
  }
  if (last.status === 422) {
    const rest = Object.entries(fields)
      .filter(([k, v]) => !SAFE_LEAD_FIELDS.includes(k) && k !== 'Experience' && v !== undefined && v !== '')
      .map(([k, v]) => `${k}: ${String(v).replace(/\s+/g, ' ').slice(0, 300)}`);
    const core = Object.fromEntries(SAFE_LEAD_FIELDS.filter(k => fields[k] !== undefined && fields[k] !== '').map(k => [k, fields[k]]));
    core.Experience = [fields.Experience, '[נשמר חלקית: איירטייבל דחה אחד השדות]', ...rest].filter(Boolean).join('\n').slice(0, 5000);
    try {
      const r = await post(core);
      if (r.ok) return { ok: true, partial: true, why: `422 ${last.msg}` };
      last = r;
    } catch (e) { last = { ok: false, status: 0, msg: e.message }; }
  }
  return { ok: false, why: `${last.status} ${last.msg}`.trim() };
}

/* The office email's subject says when the lead is NOT (or only partly) in the
   Lead Center, so somebody enters it by hand instead of assuming it is there. */
export function leadMailSubject(subject, saved) {
  if (!saved?.ok) return `לא נשמר ב-Lead Center, להזין ידנית | ${subject}`;
  if (saved.partial) return `נשמר חלקית ב-Lead Center, לבדוק | ${subject}`;
  return subject;
}

export function hebrewLeadEmail(f, utm = {}) {
  const html = emailShell({
      title: 'ליד חדש מהאתר', subtitle: f['Expedition'] ? withFlag(escapeHtml(f['Expedition']), f['Expedition']) : '',
      body: [
        details(shown([
          ['שם מלא', f['Name']], ['טלפון', f['Phone']], ['מייל', f['Email']],
          ['חודש מועדף', f['Preferred Month']], ['גיל', f['Age']], ['גודל קבוצה', f['Group Size']],
          ['ניסיון', f['Experience']], ['מקור', f['Source']],
        ])),
        (utm.source || utm.campaign) ? heading('UTM, מקור המודעה') + details([
          ['Source', utm.source && escapeHtml(utm.source)],
          ['Medium', utm.medium && escapeHtml(utm.medium)],
          ['Campaign', utm.campaign && escapeHtml(googleCampaignName(utm.campaign))],
          ['Ad', utm.content && escapeHtml(utm.content)],
          ['Audience', utm.term && escapeHtml(utm.term)],
        ].filter(([, v]) => v)) : '',
        f['Message'] ? heading('הודעה') + p(escapeHtml(f['Message']), 0) : '',
      ].join(''),
    });
  return { subject: withFlag(`ליד חדש: ${escapeHtml(f['Expedition'] || f['Source'] || 'לא צוין')}`, f['Expedition']), html };
}

/* The forms on the foreign sites still send a few fixed Hebrew values: the
   trip's Hebrew name inside {Source}, "flexible", the women's-group suffix,
   the safari page's own message, Hebrew month names. The English email shows
   them in English; anything the customer typed is left as written. */
const HE_MONTHS = { 'ינואר': 'January', 'פברואר': 'February', 'מרץ': 'March', 'אפריל': 'April', 'מאי': 'May', 'יוני': 'June', 'יולי': 'July', 'אוגוסט': 'August', 'ספטמבר': 'September', 'אוקטובר': 'October', 'נובמבר': 'November', 'דצמבר': 'December' };
export function heFixedToEn(v) {
  if (v === undefined || v === null || v === '') return v;
  let t = String(v)
    .replace(/ספארי, עוד לא הוחלט על מספר הימים/g, 'Safari, number of days not decided yet')
    .replace(/ספארי (\d+) ימים/g, 'Safari, $1 days')
    .replace(/גמיש \/ טרם החלטתי/g, 'Flexible / not decided yet')
    .replace(/קבוצת נשים \(עדי טנא\)/g, "women's group (Adi Tene)")
    .replace(/\(נשים\)/g, '(women)');
  /* Longest Hebrew trip names first, so "קילימנג׳רו לשומרי מסורת" is not cut
     short by a shorter name inside it. */
  for (const d of Object.values(DEST).sort((a, b) => b.he.length - a.he.length)) t = t.split(d.he).join(d.en);
  for (const [he, en] of Object.entries(HE_MONTHS)) t = t.split(he).join(en);
  return t;
}

/* The staff email for a lead from the English, German or Spanish site: all in
   English, the destination named in the subject and the header, or "No
   destination given" when the form had none. */
export function foreignLeadEmail(f, language, utm = {}) {
  const dest = destEn(f['Expedition']) || 'No destination given';
  const name = f['Name'] || 'New lead';
  const html = emailShell({
    lang: 'en',
    title: `New lead from the ${language} site`,
    subtitle: f['Expedition'] ? withFlag(escapeHtml(dest), f['Expedition']) : escapeHtml(dest),
    preheader: escapeHtml(`${name} · ${dest} · reply in ${language}`),
    body: [
      details(shown([
        ['Reply in', language],
        ['Destination', dest],
        ['Full name', f['Name']], ['Phone', f['Phone']], ['Email', f['Email']],
        ['Preferred month', heFixedToEn(f['Preferred Month'])], ['Age', f['Age']], ['Group size', f['Group Size']],
        ['Experience', heFixedToEn(f['Experience'])], ['Source', heFixedToEn(f['Source'])],
      ])),
      (utm.source || utm.campaign) ? heading('UTM (ad source)') + details([
        ['Source', utm.source && escapeHtml(utm.source)],
        ['Medium', utm.medium && escapeHtml(utm.medium)],
        ['Campaign', utm.campaign && escapeHtml(googleCampaignName(utm.campaign))],
        ['Ad', utm.content && escapeHtml(utm.content)],
        ['Audience', utm.term && escapeHtml(utm.term)],
      ].filter(([, v]) => v)) : '',
      f['Message'] ? heading('Message') + p(escapeHtml(heFixedToEn(f['Message'])), 0) : '',
    ].join(''),
  });
  const subject = `${withFlag(`New lead: ${escapeHtml(dest)}`, f['Expedition'] || '')} · ${escapeHtml(name)} (${language} site)`;
  return { subject, html };
}

/* Label and value rows for the shell, without the empty ones. */
function shown(rows) {
  return rows.filter(([, v]) => v || v === 0).map(([label, v]) => [escapeHtml(label), escapeHtml(String(v))]);
}
