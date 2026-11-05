/* Altitude in feet for the English site (US readers think in feet; owner,
   6 Nov 2026). Hebrew, German and Spanish keep meters only. Pure, so the
   callers pass the language (currentLang()). */
export const toFeet = m => Math.round(Number(m) * 3.28084);
/** "19,341 ft" on the English site, '' elsewhere. */
export const feetText = (m, lang) => (Number(m) > 0 && lang === 'en') ? `${toFeet(m).toLocaleString('en-US')} ft` : '';
