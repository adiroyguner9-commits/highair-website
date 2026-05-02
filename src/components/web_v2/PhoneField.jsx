/**
 * PhoneField.jsx — Clean international phone input
 * Country-code dropdown + number input, no external flag images.
 */

import { useState } from 'react';

// max:  max characters allowed in local number field (including separators)
// ph:   placeholder example
// minD: minimum digit count for validation
// maxD: maximum digit count for validation
const COUNTRIES = [
  { code: 'IL', dial: '+972',  label: '🇮🇱 +972',  max: 11, ph: '050-000-0000',    minD: 9,  maxD: 10 },
  { code: 'US', dial: '+1',    label: '🇺🇸 +1',    max: 12, ph: '201-555-0123',    minD: 10, maxD: 10 },
  { code: 'GB', dial: '+44',   label: '🇬🇧 +44',   max: 12, ph: '07911 123456',    minD: 10, maxD: 11 },
  { code: 'DE', dial: '+49',   label: '🇩🇪 +49',   max: 12, ph: '0151 23456789',   minD: 10, maxD: 11 },
  { code: 'FR', dial: '+33',   label: '🇫🇷 +33',   max: 14, ph: '06 12 34 56 78',  minD: 10, maxD: 10 },
  { code: 'IT', dial: '+39',   label: '🇮🇹 +39',   max: 11, ph: '312 345 6789',    minD: 9,  maxD: 11 },
  { code: 'ES', dial: '+34',   label: '🇪🇸 +34',   max: 9,  ph: '612 345 678',     minD: 9,  maxD: 9  },
  { code: 'NL', dial: '+31',   label: '🇳🇱 +31',   max: 11, ph: '06 12345678',     minD: 9,  maxD: 10 },
  { code: 'AU', dial: '+61',   label: '🇦🇺 +61',   max: 11, ph: '0412 345 678',    minD: 9,  maxD: 10 },
  { code: 'CA', dial: '+1',    label: '🇨🇦 +1',    max: 12, ph: '416-555-0123',    minD: 10, maxD: 10 },
  { code: 'RU', dial: '+7',    label: '🇷🇺 +7',    max: 13, ph: '912 345-67-89',   minD: 10, maxD: 11 },
  { code: 'BR', dial: '+55',   label: '🇧🇷 +55',   max: 13, ph: '11 91234-5678',   minD: 10, maxD: 11 },
  { code: 'IN', dial: '+91',   label: '🇮🇳 +91',   max: 11, ph: '98765 43210',     minD: 10, maxD: 10 },
  { code: 'CN', dial: '+86',   label: '🇨🇳 +86',   max: 13, ph: '131 2345 6789',   minD: 11, maxD: 11 },
  { code: 'ZA', dial: '+27',   label: '🇿🇦 +27',   max: 12, ph: '071 234 5678',    minD: 9,  maxD: 10 },
  { code: 'NG', dial: '+234',  label: '🇳🇬 +234',  max: 13, ph: '0802 345 6789',   minD: 10, maxD: 11 },
  { code: 'KE', dial: '+254',  label: '🇰🇪 +254',  max: 12, ph: '0712 345678',     minD: 9,  maxD: 10 },
  { code: 'TZ', dial: '+255',  label: '🇹🇿 +255',  max: 12, ph: '0712 345678',     minD: 9,  maxD: 10 },
  { code: 'ET', dial: '+251',  label: '🇪🇹 +251',  max: 12, ph: '091 234 5678',    minD: 9,  maxD: 10 },
  { code: 'NP', dial: '+977',  label: '🇳🇵 +977',  max: 11, ph: '984-1234567',     minD: 9,  maxD: 10 },
  { code: 'GE', dial: '+995',  label: '🇬🇪 +995',  max: 11, ph: '555 12 34 56',    minD: 8,  maxD: 9  },
  { code: 'KG', dial: '+996',  label: '🇰🇬 +996',  max: 12, ph: '0700 123 456',    minD: 9,  maxD: 10 },
  { code: 'AR', dial: '+54',   label: '🇦🇷 +54',   max: 14, ph: '011 1234-5678',   minD: 10, maxD: 12 },
  { code: 'CL', dial: '+56',   label: '🇨🇱 +56',   max: 11, ph: '9 1234 5678',     minD: 8,  maxD: 9  },
  { code: 'MX', dial: '+52',   label: '🇲🇽 +52',   max: 12, ph: '55 1234 5678',    minD: 10, maxD: 10 },
  { code: 'SG', dial: '+65',   label: '🇸🇬 +65',   max: 9,  ph: '9123 4567',       minD: 8,  maxD: 8  },
  { code: 'JP', dial: '+81',   label: '🇯🇵 +81',   max: 13, ph: '090-1234-5678',   minD: 10, maxD: 11 },
  { code: 'KR', dial: '+82',   label: '🇰🇷 +82',   max: 13, ph: '010-1234-5678',   minD: 10, maxD: 11 },
  { code: 'TR', dial: '+90',   label: '🇹🇷 +90',   max: 13, ph: '0532 123 4567',   minD: 10, maxD: 11 },
  { code: 'PL', dial: '+48',   label: '🇵🇱 +48',   max: 11, ph: '512 345 678',     minD: 9,  maxD: 9  },
  { code: 'CH', dial: '+41',   label: '🇨🇭 +41',   max: 13, ph: '079 123 45 67',   minD: 9,  maxD: 10 },
  { code: 'AT', dial: '+43',   label: '🇦🇹 +43',   max: 13, ph: '0664 123456',     minD: 10, maxD: 11 },
  { code: 'SE', dial: '+46',   label: '🇸🇪 +46',   max: 13, ph: '070-123 45 67',   minD: 9,  maxD: 10 },
  { code: 'NO', dial: '+47',   label: '🇳🇴 +47',   max: 10, ph: '406 12 345',      minD: 8,  maxD: 8  },
  { code: 'DK', dial: '+45',   label: '🇩🇰 +45',   max: 10, ph: '20 12 34 56',     minD: 8,  maxD: 8  },
  { code: 'PT', dial: '+351',  label: '🇵🇹 +351',  max: 11, ph: '912 345 678',     minD: 9,  maxD: 9  },
  { code: 'GR', dial: '+30',   label: '🇬🇷 +30',   max: 12, ph: '694 123 4567',    minD: 10, maxD: 10 },
  { code: 'CZ', dial: '+420',  label: '🇨🇿 +420',  max: 11, ph: '601 123 456',     minD: 9,  maxD: 9  },
  { code: 'HU', dial: '+36',   label: '🇭🇺 +36',   max: 11, ph: '30 123 4567',     minD: 8,  maxD: 9  },
  { code: 'RO', dial: '+40',   label: '🇷🇴 +40',   max: 12, ph: '0721 234 567',    minD: 9,  maxD: 10 },
  { code: 'UA', dial: '+380',  label: '🇺🇦 +380',  max: 12, ph: '067 123 4567',    minD: 9,  maxD: 10 },
  { code: 'NZ', dial: '+64',   label: '🇳🇿 +64',   max: 12, ph: '021 123 4567',    minD: 9,  maxD: 10 },
  { code: 'TH', dial: '+66',   label: '🇹🇭 +66',   max: 12, ph: '081 234 5678',    minD: 9,  maxD: 10 },
  { code: 'ID', dial: '+62',   label: '🇮🇩 +62',   max: 14, ph: '0812-3456-7890',  minD: 9,  maxD: 12 },
  { code: 'PH', dial: '+63',   label: '🇵🇭 +63',   max: 13, ph: '0917 123 4567',   minD: 10, maxD: 11 },
  { code: 'VN', dial: '+84',   label: '🇻🇳 +84',   max: 13, ph: '090 123 4567',    minD: 9,  maxD: 11 },
  { code: 'MY', dial: '+60',   label: '🇲🇾 +60',   max: 13, ph: '012-345 6789',    minD: 9,  maxD: 11 },
];

/**
 * Returns "+972 050-1234567" style string for Airtable/email.
 */
export function formatFullPhone(dial, local) {
  return `${dial} ${local}`.trim();
}

/**
 * Validates that the local number has the correct digit count for the dial code.
 * Returns true if valid, false otherwise.
 */
export function validatePhone(dial, local) {
  if (!local || !local.trim()) return false;
  const country = COUNTRIES.find(c => c.dial === dial) || COUNTRIES[0];
  const digits = local.replace(/\D/g, '').length;
  return digits >= country.minD && digits <= country.maxD;
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
  const textCol = dark ? '#fff' : '#1e1b4b';
  const phCol   = dark ? 'rgba(255,255,255,0.3)' : '#C4C2D6';

  const sharedBorder = `1.5px solid ${borderColor}`;
  const radius = '10px';
  const h = '48px';

  return (
    <div style={{ direction: 'ltr' }}>
      {label && (
        <label style={{
          display: 'block',
          fontFamily: 'Ploni, sans-serif',
          fontSize: '13px',
          fontWeight: 500,
          color: dark ? 'rgba(255,255,255,0.65)' : '#6B6B8A',
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
              fontFamily: 'Ploni, sans-serif',
              fontSize: '14px',
              fontWeight: 500,
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
            onLocalChange(raw);
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
            fontFamily: 'Ploni, sans-serif',
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
