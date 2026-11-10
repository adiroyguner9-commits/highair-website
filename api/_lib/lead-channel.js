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
