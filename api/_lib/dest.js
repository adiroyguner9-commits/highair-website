/**
 * Single source of truth for destination → Hebrew name + booking slug.
 *
 * Everything customer-facing (booking confirmation, nudge, follow-up, deposit)
 * MUST show the destination in Hebrew (e.g. "טיפוס לקילימנג׳רו", never
 * "Kilimanjaro"). Import destHe()/destInfo() from here so the wording can never
 * drift between messages again.
 */
export const DEST = {
  'Kilimanjaro':       { he: 'טיפוס לקילימנג׳רו',            slug: 'kilimanjaro' },
  'Elbrus':            { he: 'טיפוס לאלברוס',                slug: 'elbrus' },
  'Aconcagua':         { he: 'טיפוס לאקונקגואה',             slug: 'aconcagua' },
  'Kazbek':            { he: 'טיפוס לקזבק',                  slug: 'kazbek' },
  'Olympus':           { he: 'טרק לפסגת האולימפוס',          slug: 'olympus' },
  'Peaks of Balkan':   { he: 'טרק פסגות הבלקן',              slug: 'peaks-of-balkan' },
  'Annapurna':         { he: 'טרק סובב אנאפורנה',            slug: 'annapurna' },
  'Manaslu':           { he: 'טרק סובב מנסלו',               slug: 'manaslu' },
  'Everest Base Camp': { he: 'טרק אוורסט בייס קמפ וגוקיו',   slug: 'everest-base-camp' },
  'Lobuche Peak':      { he: 'טיפוס ללובוצ׳ה פיק',           slug: 'lobuche-peak' },
  'Island Peak':       { he: 'טיפוס לאיילנד פיק',            slug: 'island-peak' },
  'Mera Peak':         { he: 'טיפוס למרה פיק',               slug: 'mera-peak' },
  'Lenin Peak':        { he: 'טיפוס ללנין פיק',              slug: 'lenin-peak' },
  'Ethiopia':          { he: 'טרק הרי סימיאן ומדבר דנקיל',   slug: 'ethiopia' },
  // Canonical destinations without a classic expedition page — mapped so the
  // customer messages + staff pushes always show Hebrew, never "Sinai"/"Israel".
  // /book/sinai is a real pinned booking page (navData has the slug); the other
  // three slugs fall back to the generic /book behavior, same as before.
  'Sinai':             { he: 'טרק להר הגבוה בסיני',          slug: 'sinai' },
  'Israel':            { he: 'טיולים בישראל',                slug: 'israel' },
  'Safari':            { he: 'ספארי בטנזניה',                slug: 'safari' },
  'Safari 7 Days':     { he: 'ספארי 7 ימים בטנזניה',         slug: 'safari-7-days' },
};

// Keyword fallback shared by destKey/destInfo (e.g. "Climb to Kilimanjaro", "קילימנג׳רו קיץ").
const KW = [
  ['קילימנ', 'Kilimanjaro'], ['kilimanjaro', 'Kilimanjaro'], ['אלברו', 'Elbrus'], ['elbrus', 'Elbrus'],
  ['אקונקגוא', 'Aconcagua'], ['aconcagua', 'Aconcagua'], ['קזבק', 'Kazbek'], ['kazbek', 'Kazbek'],
  ['אולימפוס', 'Olympus'], ['olympus', 'Olympus'], ['בלקן', 'Peaks of Balkan'], ['balkan', 'Peaks of Balkan'],
  ['אנאפורנ', 'Annapurna'], ['annapurna', 'Annapurna'], ['מנסלו', 'Manaslu'], ['מנאסלו', 'Manaslu'], ['manaslu', 'Manaslu'],
  ['אוורסט', 'Everest Base Camp'], ['everest', 'Everest Base Camp'], ['לובוצ', 'Lobuche Peak'], ['lobuche', 'Lobuche Peak'],
  ['איילנד', 'Island Peak'], ['island', 'Island Peak'], ['מרה', 'Mera Peak'], ['mera', 'Mera Peak'],
  ['לנין', 'Lenin Peak'], ['lenin', 'Lenin Peak'], ['סימיאן', 'Ethiopia'], ['אתיופ', 'Ethiopia'], ['ethiopia', 'Ethiopia'],
  // AFTER the multi-word destinations above, so "קילימנג׳רו וספארי" stays Kilimanjaro.
  ['סיני', 'Sinai'], ['sinai', 'Sinai'], ['ישראל', 'Israel'], ['israel', 'Israel'], ['ספארי', 'Safari'], ['safari', 'Safari'],
];

/* Canonical ENGLISH key for any Expedition value — an English key, the Hebrew
   page name, or a fragment all resolve; '' when truly unknown. submit-lead.js
   normalises through this so the Airtable {Expedition} column holds ONE form
   (the web_v2 pages used to store the Hebrew page title, every other source
   wrote English keys, and the column ended up mixed). */
export function destKey(expedition) {
  const exp = String(expedition || '').trim();
  if (!exp) return '';
  if (DEST[exp]) return exp;
  // Reverse-match against the Hebrew names (form leads store the Hebrew name).
  for (const [key, v] of Object.entries(DEST)) {
    if (v.he === exp || exp.includes(v.he) || v.he.includes(exp)) return key;
  }
  const low = exp.toLowerCase();
  for (const [k, key] of KW) if (low.includes(k) || exp.includes(k)) return key;
  return '';
}

// A few common Hebrew/keyword variants the Expedition field can arrive as, so an
// English key, the canonical Hebrew name, or a fragment all resolve.
export function destInfo(expedition) {
  const d = DEST[destKey(expedition)];
  if (d) return { he: d.he, slug: d.slug };
  return { he: 'המשלחות שלנו', slug: 'call' };   // truly unknown → generic
}

/* The Hebrew name for display in a message. Falls back to whatever was passed
   (so an unmapped value shows as-is rather than the generic "המשלחות שלנו"). */
export function destHe(expedition) {
  const info = destInfo(expedition);
  return info.slug === 'call' ? (String(expedition || '').trim() || 'HighAir Expeditions') : info.he;
}
