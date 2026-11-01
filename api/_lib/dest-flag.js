/* The country flag of a destination, at the end of a lead or trip line in an email
   (owner, 1 Nov 2026). The same flags as the Lead Center cards (DEST_FLAG in
   src/data/leads.js), which is why a religious Kilimanjaro or Ethiopia carries the
   star. Takes anything an Expedition or Event can hold: the Hebrew page name, an
   English key, an Airtable event key. Unknown gives no flag. Identical in both repos. */
const FLAGS = [
  ['🇹🇿', 'קילימנ', 'kilimanjaro'],
  ['🇷🇺', 'אלברו', 'elbrus'],
  ['🇦🇷', 'אקונקגוא', 'aconcagua'],
  ['🇬🇪', 'קזבק', 'kazbek', 'מסטיה', 'mestia'],
  ['🇬🇷', 'אולימפוס', 'olympus'],
  ['🇦🇱', 'בלקן', 'balkan'],
  ['🇲🇰', 'סקארדוס', 'scardus'],
  ['🇳🇵', 'אנאפורנ', 'annapurna', 'מנסלו', 'מנאסלו', 'manaslu', 'אוורסט', 'everest', 'ebc', 'לובוצ', 'lobuche',
    'איילנד', 'island', 'מרה פיק', 'למרה', 'mera', 'אמא דאבלם', 'ama dablam', 'הימלונג', 'himlung'],
  ['🇰🇬', 'לנין', 'lenin'],
  ['🇪🇹', 'סימיאן', 'אתיופ', 'דנקיל', 'ethiopia'],
  ['🇰🇪', 'קניה', 'kenya'],
  ['🇺🇬', 'רוונזורי', 'rwenzori'],
  ['🇫🇷', 'מון בלאן', 'mont blanc'],
  ['🇲🇦', 'טובקאל', 'toubkal'],
  ['🇧🇬', 'פירין', 'pirin'],
  // After the destinations above, so "קילימנג׳רו וספארי" stays Kilimanjaro.
  ['🇪🇬', 'סיני', 'sinai'],
  ['🇮🇱', 'ישראל', 'israel'],
  ['🇹🇿', 'ספארי', 'safari'],
];
const RELIGIOUS = /שומרי מסורת|kosher|religious/i;

export function destFlag(destination) {
  const text = String(destination || '').toLowerCase();
  const found = text && FLAGS.find(([, ...words]) => words.some(w => text.includes(w)));
  if (!found) return '';
  const flag = found[0];
  return RELIGIOUS.test(text) && (flag === '🇹🇿' || flag === '🇪🇹') ? `${flag}✡️` : flag;
}

/* The line with the destination's flag at its end. `destination` when the line
   itself does not name it. */
export function withFlag(line, destination = line) {
  const flag = destFlag(destination);
  return flag ? `${line} ${flag}` : line;
}
