/**
 * CTASection.jsx - סקשן סגירה + טופס יצירת קשר
 * שולח לטבלת "Website Leads" ב-Airtable → התראה לאדמין
 */

import { useState } from 'react';
import { RADIUS, EASING, FS, COLOR } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

/* ── Submit lead to Airtable "Website Leads" table ── */
async function submitLead({ name, phone, message }) {
  const res = await fetch(`/api/at?table=${encodeURIComponent('Website Leads')}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({
      fields: {
        'Name':      name,
        'Phone':     phone,
        'Message':   message,
        'Submitted': new Date().toISOString(),
      },
    }),
  });
  if (!res.ok) throw new Error(`Airtable error ${res.status}`);
  return res.json();
}

const INPUT_STYLE = {
  width:        '100%',
  padding:      '13px 16px',
  borderRadius: RADIUS.md,
  background:   'rgba(255,255,255,0.07)',
  border:       '1px solid rgba(255,255,255,0.15)',
  color:        '#FFFFFF',
  fontFamily:   'Ploni, sans-serif',
  fontSize:     FS.body,
  fontWeight:   400,
  outline:      'none',
  boxSizing:    'border-box',
  direction:    'rtl',
  transition:   'border-color 0.2s ease',
};

const LABEL_STYLE = {
  display:      'block',
  fontFamily:   'Ploni, sans-serif',
  fontSize:     '13px',
  fontWeight:   600,
  color:        'rgba(255,255,255,0.55)',
  marginBottom: '6px',
};

export default function CTASection() {
  const { isMobile } = useBreakpoint();
  const [form,       setForm]       = useState({ name: '', phone: '', message: '', privacy: false });
  const [focused,    setFocused]    = useState(null);
  const [submitted,  setSubmitted]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [submitErr,  setSubmitErr]  = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const PHONE_REGEX = /^\d{3}-\d{7}$/;

  function handleChange(field, value) {
    if (field === 'phone') {
      const digits    = value.replace(/\D/g, '').slice(0, 10);
      const formatted = digits.length > 3
        ? `${digits.slice(0, 3)}-${digits.slice(3)}`
        : digits;
      setForm(prev => ({ ...prev, phone: formatted }));
      return;
    }
    if (field === 'name') {
      const letters = value.replace(/[^א-תa-zA-Z\s]/g, '');
      setForm(prev => ({ ...prev, name: letters }));
      return;
    }
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    if (!PHONE_REGEX.test(form.phone)) { setPhoneError(true); return; }
    if (!form.message.trim()) return;
    if (!form.privacy) return;

    setPhoneError(false);
    setSubmitErr(false);
    setLoading(true);

    try {
      await submitLead(form);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitErr(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="contact"
      style={{
        background: 'linear-gradient(160deg, #0A0818 0%, #1E1B4B 55%, #4C1D95 100%)',
        padding:    '80px 5%',
        boxSizing:  'border-box',
        direction:  'rtl',
        textAlign:  'center',
      }}
    >
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Heading */}
        <h2 style={{
          fontFamily:    'Ploni, sans-serif',
          fontSize:      FS.h2,
          fontWeight:    700,
          color:         '#FFFFFF',
          margin:        '0 0 12px',
          letterSpacing: '-0.02em',
          lineHeight:    1.15,
        }}>
          הפסגה הבאה שלכם מתחילה כאן!
        </h2>

        <p style={{
          fontFamily: 'Ploni, sans-serif',
          fontSize:   FS.body,
          fontWeight: 300,
          color:      'rgba(255,255,255,0.50)',
          margin:     '0 0 48px',
          lineHeight: 1.7,
        }}>
          השאירו פרטים ונחזור אליכם בהקדם
        </p>

        {/* ── Form ── */}
        {!submitted ? (
          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'right' }}
          >

            {/* Name */}
            <div>
              <label style={LABEL_STYLE}>שם מלא *</label>
              <input
                type="text"
                placeholder="ישראל ישראלי"
                value={form.name}
                required
                onChange={e => handleChange('name', e.target.value)}
                onMouseEnter={e => { e.target.style.borderColor = 'rgba(167,139,250,0.6)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                style={{ ...INPUT_STYLE }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={LABEL_STYLE}>טלפון *</label>
              <input
                type="tel"
                inputMode="numeric"
                placeholder="050-0000000"
                value={form.phone}
                required
                maxLength={11}
                onChange={e => { handleChange('phone', e.target.value); setPhoneError(false); }}
                onMouseEnter={e => { e.target.style.borderColor = phoneError ? 'rgba(248,113,113,0.8)' : 'rgba(167,139,250,0.6)'; }}
                onMouseLeave={e => { e.target.style.borderColor = phoneError ? 'rgba(248,113,113,0.8)' : 'rgba(255,255,255,0.15)'; }}
                style={{
                  ...INPUT_STYLE,
                  borderColor: phoneError ? 'rgba(248,113,113,0.8)' : 'rgba(255,255,255,0.15)',
                  direction:  'ltr',
                  textAlign:  'right',
                }}
              />
              {phoneError && (
                <div style={{
                  fontFamily: 'Ploni, sans-serif',
                  fontSize:   '12px',
                  color:      'rgba(248,113,113,0.9)',
                  marginTop:  '6px',
                  textAlign:  'right',
                }}>
                  נא להזין מספר בפורמט תקין, למשל: 050-1234567
                </div>
              )}
            </div>

            {/* Message - required */}
            <div>
              <label style={LABEL_STYLE}>מה תרצו לרשום לנו? *</label>
              <textarea
                placeholder="ספרו לנו על החלום שלכם"
                value={form.message}
                rows={3}
                required
                onChange={e => handleChange('message', e.target.value)}
                onMouseEnter={e => { e.target.style.borderColor = 'rgba(167,139,250,0.6)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'rgba(255,255,255,0.15)'; }}
                style={{
                  ...INPUT_STYLE,
                  resize:      'none',
                  lineHeight:  1.6,
                }}
              />
            </div>

            {/* Submit error */}
            {submitErr && (
              <div style={{
                fontFamily: 'Ploni, sans-serif',
                fontSize:   '13px',
                color:      'rgba(248,113,113,0.9)',
                textAlign:  'center',
              }}>
                שגיאה בשליחה, נסו שוב או צרו קשר ישירות
              </div>
            )}

            {/* צ'קבוקס הסכמה */}
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              cursor: 'pointer', direction: 'rtl',
            }}>
              <input
                type="checkbox"
                required
                checked={form.privacy}
                onChange={e => setForm(f => ({ ...f, privacy: e.target.checked }))}
                style={{ marginTop: '3px', width: '16px', height: '16px', flexShrink: 0, accentColor: '#a78bfa', cursor: 'pointer' }}
              />
              <span style={{ fontFamily: 'Ploni, sans-serif', fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>
                אני מסכימ/ה למדיניות הפרטיות ולקבלת דיוור שיווקי&nbsp;·&nbsp;
                <a href="/privacy" target="_blank" rel="noopener noreferrer"
                  style={{ color: '#a78bfa', textDecoration: 'underline', fontWeight: 600 }}
                  onClick={e => e.stopPropagation()}>
                  לצפייה במדיניות פרטיות
                </a>
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !form.privacy}
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                justifyContent: 'center',
                gap:            '8px',
                padding:        '15px 36px',
                borderRadius:   RADIUS.full,
                background:     (loading || !form.privacy) ? 'rgba(109,40,217,0.4)' : COLOR.primary,
                color:          '#FFFFFF',
                fontFamily:     'Ploni, sans-serif',
                fontSize:       FS.body,
                fontWeight:     700,
                border:         'none',
                cursor:         (loading || !form.privacy) ? 'not-allowed' : 'pointer',
                marginTop:      '8px',
                letterSpacing:  '0.01em',
                boxShadow:      loading ? 'none' : '0 4px 18px rgba(109,40,217,0.4)',
                transition:     `all 0.22s ${EASING.out}`,
                width:          '100%',
              }}
              onMouseEnter={e => {
                if (loading || !form.privacy) return;
                e.currentTarget.style.background  = '#5b21b6';
                e.currentTarget.style.boxShadow   = '0 10px 32px rgba(109,40,217,0.55)';
                e.currentTarget.style.transform   = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                if (loading || !form.privacy) return;
                e.currentTarget.style.background  = COLOR.primary;
                e.currentTarget.style.boxShadow   = '0 4px 18px rgba(109,40,217,0.4)';
                e.currentTarget.style.transform   = 'translateY(0)';
              }}
            >
              {loading ? 'שולח' : 'שלח'}
            </button>

          </form>

        ) : (
          /* ── Success state ── */
          <div style={{
            padding:      '40px 32px',
            borderRadius: RADIUS.xl,
            background:   'rgba(255,255,255,0.06)',
            border:       '1px solid rgba(255,255,255,0.12)',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏔️</div>
            <h3 style={{
              fontFamily:    'Ploni, sans-serif',
              fontSize:      FS.h3,
              fontWeight:    700,
              color:         '#FFFFFF',
              margin:        '0 0 10px',
            }}>
              תודה {form.name}!
            </h3>
            <p style={{
              fontFamily: 'Ploni, sans-serif',
              fontSize:   FS.body,
              fontWeight: 300,
              color:      'rgba(255,255,255,0.55)',
              margin:     0,
              lineHeight: 1.7,
            }}>
              פנייתכם התקבלה - נחזור אליכם בהקדם 🙌
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: '', phone: '', message: '' }); }}
              style={{
                marginTop:    '24px',
                padding:      '10px 24px',
                borderRadius: RADIUS.full,
                background:   'transparent',
                border:       '1px solid rgba(255,255,255,0.25)',
                color:        'rgba(255,255,255,0.7)',
                fontFamily:   'Ploni, sans-serif',
                fontSize:     FS.btn,
                cursor:       'pointer',
              }}
            >
              שלח פנייה נוספת
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
