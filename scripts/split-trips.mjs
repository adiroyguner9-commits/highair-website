/* split-trips.mjs: the trip records, one file per site language.

   mockData.js holds every trip in every language: about 690 KB, the heaviest
   file on a trip page (PageSpeed, 6 Nov 2026). The German fields (…De) are
   only read on de., the Spanish ones (…Es) only on es. This writes:
     src/data/trips/base.json  Hebrew + English fields (www and en.)
     src/data/trips/de.json    base + German
     src/data/trips/es.json    base + Spanish
   src/data/trips.js loads the one the host needs. Run by prebuild; re-run
   after changing mockData.js or src/data/trip-i18n (a test checks they agree). */
import fs from 'fs';
import path from 'path';

const { EXPS } = await import(path.resolve('src/data/mockData.js'));
const OUT = 'src/data/trips';

export const DROP = { base: /(De|Es)$/, de: /Es$/, es: /De$/ };
export function tripsFor(lang, exps) {
  return exps.map(e => Object.fromEntries(Object.entries(e).filter(([k]) => !DROP[lang].test(k))));
}

fs.mkdirSync(OUT, { recursive: true });
for (const lang of Object.keys(DROP)) {
  const json = JSON.stringify(tripsFor(lang, EXPS));
  fs.writeFileSync(`${OUT}/${lang}.json`, json + '\n');
  console.log(`trips ${lang}: ${(json.length / 1024).toFixed(0)} KB`);
}
