/* trip-price.mjs: a trip's "from" price for the agent's knowledge sheet, with
   the currency it is sold in (12 Nov 2026).

   The sheet wrote every price as `priceFromUsd`. Kazbek, Olympus and Peaks of
   the Balkans are sold in euros (their priceStr starts with €), so the agent
   that answers leads held "2300" under a name that says dollars, for a trip
   that costs 2,300 euros.

   - priceFrom:    { amount, currency }, currency 'USD' or 'EUR'. The field to read.
   - priceFromUsd: the amount for a dollar trip, null for a euro trip, so a
                   reader that still knows only the old field has nothing to
                   quote in dollars.

   The currency is read the way the trip page reads it: from the sign the
   price is written with. A priced trip written with any other sign stops the
   build: better no sheet than a price in the wrong currency.

   Plain functions with no imports, so tests/audit-agent-price.test.js runs them. */
export function priceCurrency(exp) {
  const shown = String(exp?.priceStr || '').trim();
  if (shown.startsWith('€')) return 'EUR';
  if (shown.startsWith('$')) return 'USD';
  throw new Error(`agent knowledge: ${exp?.slug || 'a trip'} is priced "${shown}", neither $ nor €`);
}

export function tripPrice(exp) {
  const amount = Number(exp?.price) > 0 ? Number(exp.price) : null;
  if (!amount) return { priceFrom: null, priceFromUsd: null };
  const currency = priceCurrency(exp);
  return { priceFrom: { amount, currency }, priceFromUsd: currency === 'USD' ? amount : null };
}
