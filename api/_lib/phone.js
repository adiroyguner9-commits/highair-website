/**
 * phone.js — one phone format for the whole company.
 *
 * Canonical form: `+` then the country code then the number, with nothing else
 * in it. No spaces, no dashes, no brackets, no invisible marks. `+972501234567`.
 *
 * Written Aug 2 2026 after a survey of all 2,700 numbers across the base found
 * 591 with spaces, 216 with dashes, 223 carrying invisible bidi marks (what you
 * get pasting a number out of WhatsApp), and 375 stored as a local `05...`.
 * Every screen then re-derived its own key from that mess, which is how the
 * WhatsApp button and the send path could end up pointing at two different
 * people for the same lead.
 *
 * NOT every customer is Israeli. 38 numbers in the base are American, German or
 * Ghanaian, and forcing +972 onto them would make them unreachable — eleven of
 * them have already paid. So a number that already carries its own country code
 * keeps it; only a local Israeli `0...` gains +972.
 *
 * Shared by the client and the serverless functions (api/_lib/commissions-report.js
 * already imports from src/, so this is one implementation, not two copies).
 */

/* Direction marks and isolates. Pasting a phone number from WhatsApp or iOS in
   an RTL context wraps it in these; they are invisible, so nobody notices until
   a comparison fails. */
const BIDI = /[‎‏‪-‮⁦-⁩]/g;

const IL = '972';

/**
 * Canonical `+<country><number>`, or '' when there is nothing usable.
 * Never throws, never guesses a country for a number that already has one.
 */
export function normalizePhone(raw) {
  let s = String(raw ?? '').replace(BIDI, '').trim();
  if (!s) return '';

  const hadPlus = s.startsWith('+');
  let d = s.replace(/\D/g, '');
  if (!d) return '';

  // 00 is the old international access prefix — 0097250... means +97250...
  if (!hadPlus && d.startsWith('00')) d = d.slice(2);

  if (d.startsWith(IL + '0')) {
    /* "+972" typed in front of the LOCAL form, zero and all: +9720544934124.
       285 records in the base looked like this. Unambiguous to repair — no
       Israeli subscriber number starts with 0 after the country code. */
    d = IL + d.slice(IL.length).replace(/^0+/, '');
  } else if (d.startsWith('0')) {
    // Local Israeli: 05X / 03 / 08 …
    d = IL + d.replace(/^0+/, '');
  } else if (!d.startsWith(IL) && d.length === 9 && d.startsWith('5')) {
    // An Israeli mobile that lost its leading zero somewhere.
    d = IL + d;
  }
  // Anything else already carries a country code. Leave it alone.

  return d.length >= 9 ? `+${d}` : '';
}

/** Digits only — the key every lookup and comparison should use. */
export function phoneDigits(raw) {
  return normalizePhone(raw).replace(/\D/g, '');
}

/**
 * Filler, not a phone number: 0555555555, 0123456789, 0987654321.
 *
 * These pass every structural test — 055 is a real Israeli mobile prefix and
 * the length is right — so nothing else catches them. Someone testing the
 * Israel trek form with 555555555 got a lead record, which is what prompted
 * this. Checked against all 2,747 numbers in the base: it rejects exactly the
 * two test rows and no real customer.
 */
function isFillerNumber(d) {
  const n = d.startsWith(IL) ? d.slice(IL.length) : d;
  if (/^(\d)\1+$/.test(n)) return true;                       // one digit repeated
  const step = k => [...n].every((c, i, a) => i === 0 || +c === (+a[i - 1] + k) % 10);
  return step(1) || step(9);                                  // 1234567 / 7654321
}

/**
 * Is this a number we can actually reach? Country code plus a national number
 * lands between 10 and 15 digits (E.164 caps at 15).
 */
export function phoneIsValid(raw) {
  const d = phoneDigits(raw);
  if (d.length < 10 || d.length > 15) return false;
  if (isFillerNumber(d)) return false;
  /* Israel has two shapes and they must be told apart, not merged: a MOBILE
     national number starts with 5 and is 9 digits (972 + 9 = 12); a LANDLINE
     starts with an area digit (2/3/4/8/9) and is 8 (972 + 8 = 11). Accepting
     "11 or 12" for both let a mobile with a digit missing through as if it
     were an office number. */
  if (d.startsWith(IL)) {
    const national = d.slice(IL.length);
    /* 05X mobiles and 07X (VoIP / non-geographic, e.g. 077) both carry 9
       digits; geographic area codes 2/3/4/8/9 carry 8. Lumping 07X in with the
       landlines rejected real numbers already in the base. */
    return /^[57]/.test(national) ? national.length === 9 : national.length === 8;
  }
  return true;
}

/** What to tell the user when it fails, in the portal's own language. */
export function phoneError(raw) {
  const s = String(raw ?? '').replace(BIDI, '').trim();
  if (!s) return 'Phone is required';
  const d = phoneDigits(s);
  if (!d) return 'That does not look like a phone number';
  if (isFillerNumber(d)) return 'Please enter a real phone number';
  if (d.startsWith(IL)) {
    const n = d.slice(3);
    if (/^[57]/.test(n) && n.length !== 9) {
      return n.length < 9 ? 'An Israeli mobile needs 10 digits (05X-XXXXXXX)' : 'That mobile number has too many digits';
    }
    if (!/^[57]/.test(n) && n.length !== 8) {
      return n.length < 8 ? 'An Israeli landline needs 9 digits (0X-XXXXXXX)' : 'That number has too many digits';
    }
  }
  if (d.length < 10) return 'Too short for an international number';
  if (d.length > 15) return 'Too long — a phone number tops out at 15 digits';
  return '';
}

/** wa.me wants bare digits with the country code and no plus. */
export function phoneWaLink(raw) {
  const d = phoneDigits(raw);
  return d ? `https://wa.me/${d}` : '';
}

/** For display: +972 50-123-4567, grouped only when we know the shape. */
export function phoneDisplay(raw) {
  const d = phoneDigits(raw);
  if (!d) return '';
  if (d.startsWith(IL) && d.length === 12) {
    const n = d.slice(3);                       // 501234567
    return `+${IL} ${n.slice(0, 2)}-${n.slice(2, 5)}-${n.slice(5)}`;
  }
  return `+${d}`;
}
