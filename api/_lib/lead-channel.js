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

const WA_OPENERS = [
  /^hi!? i['’]d love to hear more about/i,
  /^hallo!? ich würde gern mehr über/i,
  /^¡?hola!? me gustaría saber más sobre/i,
];

/** True for a lead (Airtable fields) from one of the foreign sites. */
export function isForeignLead(f = {}) {
  const lang = String(f.Language || '').trim().toLowerCase();
  if (FOREIGN_LANGS.some(l => l.toLowerCase() === lang)) return true;
  if (/whatsapp/i.test(String(f.Source || ''))) {
    const t = String(f.Experience || '').trim();
    return WA_OPENERS.some(re => re.test(t));
  }
  return false;
}

/** The same rule inside an Airtable formula (the form leads; the WhatsApp
    opener is checked in code), to keep those leads out of the queries at all. */
export const NOT_FOREIGN_FORMULA = `NOT(OR(${FOREIGN_LANGS.map(l => `{Language}='${l}'`).join(',')})),`;

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

/** May an automatic WhatsApp go to this lead now?
 *  `lead` is the lead's Airtable fields (or null when the phone has no card:
 *  then nothing says "from abroad" and the message goes).
 *  → { send, why }  why: '' | 'foreign' | 'paused' */
export function whatsappVerdict({ lead = null, paused = false } = {}) {
  if (lead && isForeignLead(lead)) return { send: false, why: 'foreign' };
  if (paused) return { send: false, why: 'paused' };
  return { send: true, why: '' };
}

/** The lead fields the rule reads, for a projection. */
export const CHANNEL_FIELDS = ['Language', 'Source', 'Experience'];

