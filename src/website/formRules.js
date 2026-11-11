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

/* What a name field keeps while the visitor types: letters of ANY alphabet,
   spaces, a hyphen and an apostrophe. It used to keep Hebrew and A to Z only,
   so "Jörg Müller-O'Brien" was saved as "Jrg MllerOBrien" and "בן-דוד" lost its
   hyphen, on sites written for German and Spanish speakers (11 Nov 2026). Digits
   and symbols still go: a name field is not a place for a phone number. */
export function nameTyped(value) {
  return String(value ?? '').replace(/[^\p{L}\p{M}\s'’׳״־-]/gu, '');
}

/* An address someone could be answered at: something@something.tld. */
export function emailLooksRight(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? '').trim());
}

/* What to tell the visitor when the server will not take a lead. The Israel
   trek form called every refusal "the phone number is not valid", whatever was
   wrong; the trip form showed the server's own English ("Invalid submission",
   "Too many requests") to a Hebrew reader (11 Nov 2026). The server's wording
   is read here only to tell WHICH field it means, and is never shown.
   → 'phone' | 'email' | 'name' | 'busy' | 'general' */
export function leadErrorKind(status, serverError = '') {
  const said = String(serverError || '').toLowerCase();
  if (Number(status) === 429) return 'busy';
  if (Number(status) === 400) {
    if (/phone|mobile|landline|digits|number/.test(said)) return 'phone';
    if (/email/.test(said)) return 'email';
    if (/name/.test(said)) return 'name';
  }
  return 'general';
}
export const LEAD_ERROR_HE = {
  phone:   'מספר הטלפון לא תקין. יש להזין מספר אמיתי',
  email:   'כתובת המייל אינה תקינה. כדאי לבדוק אותה ולנסות שוב',
  name:    'השם שהוזן אינו תקין. יש להזין שם מלא באותיות',
  busy:    'התקבלו כמה פניות ברצף. אפשר לנסות שוב בעוד דקה',
  general: 'לא הצלחנו לשלוח את הפרטים. אפשר לנסות שוב בעוד רגע',
};
/* English keys for tx(): German and Spanish come from src/i18n/ui-*.json. */
export const LEAD_ERROR_EN = {
  phone:   'Please enter a valid phone number.',
  email:   'Please check the email address and try again.',
  name:    'Please enter your full name, in letters.',
  busy:    'Too many requests in a row. Please try again in a minute.',
  general: 'Something went wrong. Please try again.',
};

