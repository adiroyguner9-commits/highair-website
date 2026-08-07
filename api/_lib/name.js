/* First name only for friendly WhatsApp greetings — never the surname.
   Names on the website are typed by the customer on our Hebrew forms, so the
   first word is already the Hebrew first name. */
export function firstName(full) {
  return String(full || '').trim().split(/\s+/)[0] || '';
}
