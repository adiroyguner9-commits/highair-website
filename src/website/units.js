/* Altitude in feet for the English site (US readers think in feet; owner,
   6 Nov 2026). Hebrew, German and Spanish keep meters only. Pure, so the
   callers pass the language (currentLang()). */
export const toFeet = m => Math.round(Number(m) * 3.28084);
/** "19,341 ft" on the English site, '' elsewhere. */
export const feetText = (m, lang) => (Number(m) > 0 && lang === 'en') ? `${toFeet(m).toLocaleString('en-US')} ft` : '';

/* Metres as each site writes them (owner, 8 Nov 2026: "בלי פסיק"). Hebrew
   writes "5895 מ׳", like the trip texts and the altitude filter; the other
   sites keep "5895m". Accepts a number or the data's "5895m" string. */
export const metresText = (m, lang) => {
  const n = Number(String(m ?? '').replace(/[^\d.]/g, ''));
  if (!(n > 0)) return '';
  return lang === 'he' ? `${n} מ׳` : `${n}m`;
};
