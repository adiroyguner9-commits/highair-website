/* Small rules the lead forms share. Pure, so the rule tests can run them. */

/* What the "number of people" field holds after a keystroke: '' while empty,
   otherwise 1 to 10. The field opens holding "1"; a value past 10 keeps the
   digit just typed, so "1" then "2" is 2 (it used to become 12, then 10) and
   "1" then "0" is 10. */
export function groupSizeTyped(value) {
  const raw = String(value ?? '').replace(/\D/g, '').slice(0, 3);
  if (raw === '' || Number(raw) === 0) return '';
  if (Number(raw) <= 10) return String(Number(raw));
  return raw.endsWith('0') ? '10' : raw.slice(-1);
}
