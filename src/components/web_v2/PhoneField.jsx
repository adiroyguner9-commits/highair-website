/**
 * PhoneField.jsx — Clean international phone input
 * Country-code dropdown + number input, no external flag images.
 */

import { useState } from 'react';
/* The same module the lead endpoints validate with, so the field can never
   accept a number the server will refuse (or the other way round). */
import { phoneIsValid } from '../../../api/_lib/phone.js';

/* max: characters the field accepts, separators included. MUST be at least as
   long as that country's own placeholder — Israel used to cap at 11 while
   showing "050-000-0000" (12), so a customer typing the format we asked for had
   the last digit silently eaten, passed the loose 9-digit check, and became a
   lead nobody could ever call (Aug 2 2026). */
// ph:   placeholder example
// minD: minimum digit count for validation
// maxD: maximum digit count for validation
const COUNTRIES = [
  { code: 'IL', dial: '+972',  label: 'IL +972',  max: 14, ph: '050-0000000',     minD: 9,  maxD: 10, il: true },
  { code: 'US', dial: '+1',    label: 'US +1',    max: 12, ph: '201-555-0123',    minD: 10, maxD: 10 },
  { code: 'GB', dial: '+44',   label: 'GB +44',   max: 12, ph: '07911 123456',    minD: 10, maxD: 11 },
  { code: 'DE', dial: '+49',   label: 'DE +49',   max: 15, ph: '0151 23456789',   minD: 10, maxD: 11 },
  { code: 'FR', dial: '+33',   label: 'FR +33',   max: 14, ph: '06 12 34 56 78',  minD: 10, maxD: 10 },
  { code: 'IT', dial: '+39',   label: 'IT +39',   max: 14, ph: '312 345 6789',    minD: 9,  maxD: 11 },
  { code: 'ES', dial: '+34',   label: 'ES +34',   max: 13, ph: '612 345 678',     minD: 9,  maxD: 9  },
  { code: 'NL', dial: '+31',   label: 'NL +31',   max: 11, ph: '06 12345678',     minD: 9,  maxD: 10 },
  { code: 'AU', dial: '+61',   label: 'AU +61',   max: 14, ph: '0412 345 678',    minD: 9,  maxD: 10 },
  { code: 'CA', dial: '+1',    label: 'CA +1',    max: 12, ph: '416-555-0123',    minD: 10, maxD: 10 },
  { code: 'RU', dial: '+7',    label: 'RU +7',    max: 13, ph: '912 345-67-89',   minD: 10, maxD: 11 },
  { code: 'BR', dial: '+55',   label: 'BR +55',   max: 13, ph: '11 91234-5678',   minD: 10, maxD: 11 },
  { code: 'IN', dial: '+91',   label: 'IN +91',   max: 11, ph: '98765 43210',     minD: 10, maxD: 10 },
  { code: 'CN', dial: '+86',   label: 'CN +86',   max: 13, ph: '131 2345 6789',   minD: 11, maxD: 11 },
  { code: 'ZA', dial: '+27',   label: 'ZA +27',   max: 12, ph: '071 234 5678',    minD: 9,  maxD: 10 },
  { code: 'NG', dial: '+234',  label: 'NG +234',  max: 13, ph: '0802 345 6789',   minD: 10, maxD: 11 },
  { code: 'KE', dial: '+254',  label: 'KE +254',  max: 12, ph: '0712 345678',     minD: 9,  maxD: 10 },
  { code: 'TZ', dial: '+255',  label: 'TZ +255',  max: 12, ph: '0712 345678',     minD: 9,  maxD: 10 },
  { code: 'ET', dial: '+251',  label: 'ET +251',  max: 12, ph: '091 234 5678',    minD: 9,  maxD: 10 },
  { code: 'NP', dial: '+977',  label: 'NP +977',  max: 11, ph: '984-1234567',     minD: 9,  maxD: 10 },
  { code: 'GE', dial: '+995',  label: 'GE +995',  max: 11, ph: '555 12 34 56',    minD: 8,  maxD: 9  },
  { code: 'KG', dial: '+996',  label: 'KG +996',  max: 12, ph: '0700 123 456',    minD: 9,  maxD: 10 },
  { code: 'AR', dial: '+54',   label: 'AR +54',   max: 14, ph: '011 1234-5678',   minD: 10, maxD: 12 },
  { code: 'CL', dial: '+56',   label: 'CL +56',   max: 11, ph: '9 1234 5678',     minD: 8,  maxD: 9  },
  { code: 'MX', dial: '+52',   label: 'MX +52',   max: 12, ph: '55 1234 5678',    minD: 10, maxD: 10 },
  { code: 'SG', dial: '+65',   label: 'SG +65',   max: 9,  ph: '9123 4567',       minD: 8,  maxD: 8  },
  { code: 'JP', dial: '+81',   label: 'JP +81',   max: 13, ph: '090-1234-5678',   minD: 10, maxD: 11 },
  { code: 'KR', dial: '+82',   label: 'KR +82',   max: 13, ph: '010-1234-5678',   minD: 10, maxD: 11 },
  { code: 'TR', dial: '+90',   label: 'TR +90',   max: 13, ph: '0532 123 4567',   minD: 10, maxD: 11 },
  { code: 'PL', dial: '+48',   label: 'PL +48',   max: 11, ph: '512 345 678',     minD: 9,  maxD: 9  },
  { code: 'CH', dial: '+41',   label: 'CH +41',   max: 13, ph: '079 123 45 67',   minD: 9,  maxD: 10 },
  { code: 'AT', dial: '+43',   label: 'AT +43',   max: 13, ph: '0664 123456',     minD: 10, maxD: 11 },
  { code: 'SE', dial: '+46',   label: 'SE +46',   max: 13, ph: '070-123 45 67',   minD: 9,  maxD: 10 },
  { code: 'NO', dial: '+47',   label: 'NO +47',   max: 10, ph: '406 12 345',      minD: 8,  maxD: 8  },
  { code: 'DK', dial: '+45',   label: 'DK +45',   max: 10, ph: '20 12 34 56',     minD: 8,  maxD: 8  },
  { code: 'PT', dial: '+351',  label: 'PT +351',  max: 11, ph: '912 345 678',     minD: 9,  maxD: 9  },
  { code: 'GR', dial: '+30',   label: 'GR +30',   max: 12, ph: '694 123 4567',    minD: 10, maxD: 10 },
  { code: 'CZ', dial: '+420',  label: 'CZ +420',  max: 11, ph: '601 123 456',     minD: 9,  maxD: 9  },
  { code: 'HU', dial: '+36',   label: 'HU +36',   max: 11, ph: '30 123 4567',     minD: 8,  maxD: 9  },
  { code: 'RO', dial: '+40',   label: 'RO +40',   max: 12, ph: '0721 234 567',    minD: 9,  maxD: 10 },
  { code: 'UA', dial: '+380',  label: 'UA +380',  max: 12, ph: '067 123 4567',    minD: 9,  maxD: 10 },
  { code: 'NZ', dial: '+64',   label: 'NZ +64',   max: 12, ph: '021 123 4567',    minD: 9,  maxD: 10 },
  { code: 'TH', dial: '+66',   label: 'TH +66',   max: 12, ph: '081 234 5678',    minD: 9,  maxD: 10 },
  { code: 'ID', dial: '+62',   label: 'ID +62',   max: 14, ph: '0812-3456-7890',  minD: 9,  maxD: 12 },
  { code: 'PH', dial: '+63',   label: 'PH +63',   max: 13, ph: '0917 123 4567',   minD: 10, maxD: 11 },
  { code: 'VN', dial: '+84',   label: 'VN +84',   max: 13, ph: '090 123 4567',    minD: 9,  maxD: 11 },
  { code: 'MY', dial: '+60',   label: 'MY +60',   max: 13, ph: '012-345 6789',    minD: 9,  maxD: 11 },
];

/**
 * Returns "+972 050-1234567" style string for Airtable/email.
 */
export function formatFullPhone(dial, local) {
  return `${dial} ${local}`.trim();
}

/**
 * Live mask for the Israeli box: 050-1234567 for a mobile (05X / 07X),
 * 03-1234567 for a landline. Same shape the customer app now uses, so the
 * number looks identical wherever someone types it. Other countries keep
 * whatever separators they are used to.
 */
function maskIsraeli(raw) {
  let d = String(raw ?? '').replace(/\D/g, '');
  if (!d) return '';
  if (!d.startsWith('0')) d = '0' + d;          // they skipped the leading zero
  const split = /^0[57]/.test(d) ? 3 : 2;
  d = d.slice(0, split + 7);
  return d.length > split ? `${d.slice(0, split)}-${d.slice(split)}` : d;
}

/**
 * Validates that the local number has the correct digit count for the dial code.
 * Returns true if valid, false otherwise.
 */
export function validatePhone(dial, local) {
  if (!local || !local.trim()) return false;
  const country = COUNTRIES.find(c => c.dial === dial) || COUNTRIES[0];
  const d = local.replace(/\D/g, '');
  /* Filler like 0555555555 or 1234567890 passes every digit-count rule — 055 is
     a real prefix and the length is right. One customer test with 555555555
     became a real lead record, so the shared rule runs here too. */
  if (!phoneIsValid(dial + d.replace(/^0+/, ''))) return false;
  /* Israel has two exact shapes, and "between 9 and 10 digits" cannot tell a
     landline from a mobile missing a digit. 05X/07X carry 10 with the leading
     zero; geographic 02/03/04/08/09 carry 9. Same rule the server enforces. */
  if (country.il) {
    const n = d.replace(/^0+/, '');
    return /^[57]/.test(n) ? n.length === 9 : n.length === 8;
  }
  return d.length >= country.minD && d.length <= country.maxD;
}

/**
 * @param {object}   props
 * @param {string}   props.dial        - selected dial code e.g. "+972"
 * @param {function} props.onDialChange
 * @param {string}   props.local       - local number string
 * @param {function} props.onLocalChange
 * @param {boolean}  [props.error]
 * @param {string}   [props.errorMsg]
 * @param {boolean}  [props.dark]
 * @param {string}   [props.label]
 */
export default function PhoneField({
  dial, onDialChange,
  local, onLocalChange,
  error, errorMsg,
  dark = false,
  label,
}) {
  const [focused, setFocused] = useState(false);
  const country = COUNTRIES.find(c => c.dial === dial) || COUNTRIES[0];

  const borderColor = error
    ? (dark ? 'rgba(248,113,113,0.8)' : '#DC2626')
    : focused
      ? (dark ? 'rgba(167,139,250,0.7)' : '#7c3aed')
      : (dark ? 'rgba(255,255,255,0.15)' : '#E5E3F0');

  const bg      = dark ? 'rgba(255,255,255,0.07)' : '#fff';
  const textCol = dark ? '#fff' : '#3D3B5A';
  const phCol   = dark ? 'rgba(255,255,255,0.3)' : '#9CA3AF';

  const sharedBorder = `1.5px solid ${borderColor}`;
  const radius = '10px';
  const h = '48px';

  return (
    <div style={{ direction: 'ltr' }}>
      {label && (
        <label style={{
          display: 'block',
          fontFamily: "'Ploni', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          color: dark ? 'rgba(255,255,255,0.65)' : '#3D3B5A',
          marginBottom: '6px',
          direction: 'inherit',
          textAlign: 'start',
          unicodeBidi: 'plaintext',
        }}>
          {label}
        </label>
      )}

      <div style={{ display: 'flex', alignItems: 'stretch', height: h, direction: 'ltr' }}>
        {/* Country select */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <select
            value={dial}
            onChange={e => onDialChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Country code"
            style={{
              height: '100%',
              padding: '0 28px 0 12px',
              background: bg,
              border: sharedBorder,
              borderRight: 'none',
              borderRadius: `${radius} 0 0 ${radius}`,
              color: textCol,
              fontFamily: "'Ploni', sans-serif",
              fontSize: '15px',
              fontWeight: 400,
              cursor: 'pointer',
              outline: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              minWidth: '90px',
              transition: 'border-color 0.18s',
              boxSizing: 'border-box',
            }}
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.dial}>{c.label}</option>
            ))}
          </select>
          {/* chevron */}
          <span style={{
            position: 'absolute',
            right: '8px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            fontSize: '10px',
            color: dark ? 'rgba(255,255,255,0.5)' : '#9591B0',
          }}>▾</span>
        </div>

        {/* Number input */}
        <input
          type="tel"
          inputMode="numeric"
          maxLength={country.max}
          aria-label={`Phone number (${country.dial})`}
          value={local}
          onChange={e => {
            const raw = e.target.value.replace(/[^\d\s\-]/g, '');
            const digitCount = raw.replace(/\D/g, '').length;
            if (digitCount > country.maxD) return;
            onLocalChange(country.il ? maskIsraeli(raw) : raw);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={country.ph}
          style={{
            flex: 1,
            height: '100%',
            padding: '0 16px',
            background: bg,
            border: sharedBorder,
            borderLeft: `1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#E5E3F0'}`,
            borderRadius: `0 ${radius} ${radius} 0`,
            color: textCol,
            fontFamily: "'Ploni', sans-serif",
            fontSize: '15px',
            outline: 'none',
            direction: 'ltr',
            textAlign: 'left',
            boxSizing: 'border-box',
            transition: 'border-color 0.18s',
          }}
        />
      </div>

      {error && errorMsg && (
        <p style={{
          fontFamily: 'Ploni, sans-serif',
          fontSize: '12px',
          color: dark ? 'rgba(248,113,113,0.9)' : '#DC2626',
          margin: '6px 0 0',
          textAlign: 'start',
          direction: 'inherit',
          unicodeBidi: 'plaintext',
        }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}
