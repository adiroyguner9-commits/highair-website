/* A lead from the English, German or Spanish site is sold by EMAIL ONLY: no
   automatic WhatsApp, ever (owner, 10 Nov 2026, the first English-site lead got
   the Hebrew "book a call" nudge: "זה באג חמור מאוד, הוא אמור לקבל רק מייל בלבד
   בלי הודעות ווצאפ"). The webapp's email agent (api/_lib/intl-agent.js) writes
   to them in their language; every WhatsApp this repo sends a lead checks here.

   Who is "from abroad" is the webapp's rule (src/data/leadLanguage.js), kept in
   step by hand: the form's {Language} (submit-lead writes it from the site the
   form was sent from), or a WhatsApp lead whose first message is the foreign
   site's pre-filled greeting. */
export const FOREIGN_LANGS = ['English', 'German', 'Spanish'];

/* The English site is sold like the Hebrew one since 17 Nov 2026 (owner: "אני רוצה
   שבאתר באנגלית יהיה אותו מודל כמו באתר בעברית שליד מגיש טופס אז שיוכל לקבוע שיחה ואם
   לא אז שיקבל הודעה באנגלית כמו הפלואו בעברית", and "ושהלידים באתר באנגלית יגיעו רק
   לתומר לן"): the calendar after the form, the same WhatsApps in English (./lead-en.js),
   and the call and the lead are Tomer Lan's. He answered that this is for English
   only, so the German and Spanish sites stay email only, as above. */
export const EMAIL_ONLY_LANGS = ['German', 'Spanish'];
export const ENGLISH_LEAD_AGENT = 'Tomer Lan';

const WA_OPENERS = {
  English: /^hi!? i['’]d love to hear more about/i,
  German:  /^hallo!? ich würde gern mehr über/i,
  Spanish: /^¡?hola!? me gustaría saber más sobre/i,
};

/** The foreign site a lead (Airtable fields) came from: 'English' | 'German' | 'Spanish' | ''. */
export function foreignLangOf(f = {}) {
  const lang = String(f.Language || '').trim().toLowerCase();
  const byForm = FOREIGN_LANGS.find(l => l.toLowerCase() === lang);
  if (byForm) return byForm;
  if (/whatsapp/i.test(String(f.Source || ''))) {
    const t = String(f.Experience || '').trim();
    return FOREIGN_LANGS.find(l => WA_OPENERS[l].test(t)) || '';
  }
  return '';
}

/** True for a lead from one of the foreign sites. */
export const isForeignLead   = (f = {}) => !!foreignLangOf(f);
/** The English site's leads: WhatsApp in English, Tomer Lan. */
export const isEnglishLead   = (f = {}) => foreignLangOf(f) === 'English';
/** The German and Spanish sites' leads: email only, no WhatsApp. */
export const isEmailOnlyLead = (f = {}) => EMAIL_ONLY_LANGS.includes(foreignLangOf(f));

/** The email-only rule inside an Airtable formula (the form leads; the WhatsApp
    opener is checked in code), to keep those leads out of the queries at all. */
export const NOT_EMAIL_ONLY_FORMULA = `NOT(OR(${EMAIL_ONLY_LANGS.map(l => `{Language}='${l}'`).join(',')})),`;

/* ── One question before any automatic WhatsApp to a lead ───────────────────
   The rule above was asked by the lifecycle job only. Three other senders never
   asked it (11 Nov 2026): the booking confirmation, the call reminder and the
   "your call moved" notice all wrote in Hebrew on WhatsApp to leads from the
   English, German and Spanish sites, and the last one also ignored the pause
   switch. They now ask here, so the rule has one home. */

/** The pause switch (AppContent "lead_messaging_paused"), as the job reads it. */
export const pauseIsOn = value => ['1', 'true', 'yes', 'on'].includes(String(value ?? '').trim().toLowerCase());

/** Is the global pause on? false when it cannot be read: a hiccup must not
 *  silence a confirmation (the same choice the lifecycle job makes). */
export async function messagingPaused({ base, token }) {
  try {
    const r = await fetch(`https://api.airtable.com/v0/${base}/AppContent?filterByFormula=${encodeURIComponent('{Key}="lead_messaging_paused"')}&fields[]=Value&maxRecords=1`,
      { headers: { Authorization: `Bearer ${token}` } });
    if (!r.ok) return false;
    return pauseIsOn((await r.json()).records?.[0]?.fields?.Value);
  } catch { return false; }
}

/** May an automatic WhatsApp go to this lead now? (English leads: yes, in English.)
 *  `lead` is the lead's Airtable fields (or null when the phone has no card:
 *  then nothing says "from abroad" and the message goes).
 *  → { send, why }  why: '' | 'foreign' | 'paused' */
export function whatsappVerdict({ lead = null, paused = false } = {}) {
  if (lead && isEmailOnlyLead(lead)) return { send: false, why: 'foreign' };
  if (paused) return { send: false, why: 'paused' };
  return { send: true, why: '' };
}

/** The site a request came from, by its Origin / Referer, never the body:
 *  en. / de. / es. → 'English' / 'German' / 'Spanish', anything else on our
 *  domain → 'Hebrew', an unknown origin (previews, local) → null.
 *  submit-lead writes it on the lead; the calendar asks it for a visitor who has
 *  no card yet (a bare /book on the English site). */
export function siteLanguageOf(headers = {}) {
  const src = String(headers.origin || headers.referer || '');
  let host = '';
  try { host = new URL(src).hostname; } catch { return null; }
  if (!(host === 'highair-expeditions.com' || host.endsWith('.highair-expeditions.com'))) return null;
  return { en: 'English', de: 'German', es: 'Spanish' }[host.split('.')[0]] || 'Hebrew';
}

/** The lead fields the rule reads, for a projection. */
export const CHANNEL_FIELDS = ['Language', 'Source', 'Experience'];

