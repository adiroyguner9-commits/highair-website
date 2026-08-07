/**
 * BookCall.jsx
 * Standalone "book a call" page (highair-expeditions.com/book).
 * One clean URL used by the WhatsApp nudge, the call reminder, and agent links.
 * Step 1 collects the client's details (nothing comes from the URL — no PII in
 * query strings), Step 2 shows the shared BookingWidget calendar.
 */

import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../../website/usePageMeta.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { COLOR, RADIUS, EASING } from '../../website/theme.js';
import { NAV_EXPS } from '../../data/navData.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import PhoneField, { formatFullPhone, validatePhone as checkPhone } from './PhoneField.jsx';
import BookingWidget from './BookingWidget.jsx';

function Field({ label, id, type = 'text', value, onChange, placeholder, required, error, errorMsg }) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? '#DC2626' : focused ? COLOR.primary : '#DDD9F3';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label htmlFor={id} style={{
        fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 600,
        color: '#4B4869', letterSpacing: '0.02em',
      }}>
        {label}{required && <span style={{ color: COLOR.primary }}> *</span>}
      </label>
      <input
        id={id} type={type} value={value} onChange={onChange} placeholder={placeholder}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{
          width: '100%', fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 400,
          color: '#0A0818', background: '#FFFFFF', border: `1.5px solid ${borderColor}`,
          borderRadius: '12px', padding: '13px 16px', outline: 'none', boxSizing: 'border-box',
          transition: `border-color 0.18s ${EASING.out}`,
        }}
      />
      {error && errorMsg && (
        <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '12px', color: '#DC2626', margin: 0 }}>
          {errorMsg}
        </p>
      )}
    </div>
  );
}

export default function BookCall() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const isRtl = !isEn;
  const dir = isEn ? 'ltr' : 'rtl';
  const { isMobile } = useBreakpoint();

  // Per-destination page: /book/:slug pins the call to one expedition so the
  // booking is tagged to it. Bare /book is the generic consultation link.
  const { slug, code } = useParams();
  const exp = slug ? NAV_EXPS.find(e => e.slug === slug) : null;

  // Lead-specific link (?l=<recId>): we already have their details from the form
  // they filled, so skip straight to the slot picker. book-slot looks the lead
  // up server-side from this opaque token — no PII ever travels in the URL.
  const [sp] = useSearchParams();
  const rawTok = code || sp.get('l') || '';   // path code (clean) or legacy ?l= token
  const leadToken = /^(rec[A-Za-z0-9]{14}|[a-z0-9]{4,12})$/.test(rawTok) ? rawTok : '';
  const destHe = exp ? (isEn ? exp.nameEn || exp.name : exp.nameHe) : '';
  const bookingExpedition = exp ? (isEn ? exp.nameEn || exp.name : exp.nameHe)
                                : (isRtl ? 'שיחת ייעוץ' : 'Consultation call');

  const [form, setForm]           = useState({ name: '', dial: '+972', phone: '', email: '' });
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [step, setStep]           = useState(leadToken ? 'booking' : 'details'); // 'details' | 'booking'
  const [btnHov, setBtnHov]       = useState(false);

  usePageMeta({
    title: exp
      ? (isEn ? `Book a Call · ${destHe} | HighAir Expeditions` : `קביעת שיחה · ${destHe} | HighAir Expeditions`)
      : (isEn ? 'Book a Call | HighAir Expeditions' : 'קביעת שיחה | HighAir Expeditions'),
    description: isEn
      ? 'Pick a time that works for you and our team will call to answer every question about your expedition.'
      : 'בחרו זמן שנוח לכם והצוות שלנו יחזור אליכם בשיחה לענות על כל שאלה לגבי המשלחת.',
    canonicalPath: exp ? `/book/${exp.slug}` : '/book',
  });

  function toBooking(e) {
    e.preventDefault();
    const nameOk  = form.name.trim().length >= 2;
    const phoneOk = checkPhone(form.dial, form.phone);
    if (!nameOk)  setNameError(isEn ? 'Please enter your name' : 'נא להזין שם');
    if (!phoneOk) setPhoneError(isEn ? 'Invalid phone number. Israeli mobile: 10 digits, e.g. 050-1234567. Landline: 9 digits, e.g. 03-1234567' : 'מספר טלפון לא תקין. נייד: 10 ספרות, למשל 050-1234567. קו נייח: 9 ספרות, למשל 03-1234567');
    if (!nameOk || !phoneOk) return;
    setStep('booking');
  }

  const T = {
    heroTitle: isEn ? 'Book a Call' : 'בואו נקבע שיחה',
    heroSub: exp
      ? (isEn
          ? `Interested in ${destHe}? Pick a time and we'll call to answer every question and help you plan.`
          : `התעניינת ב${destHe}? בחרו זמן שנוח לכם, נחזור אליכם בשיחה לענות על כל שאלה ולעזור לתכנן.`)
      : (isEn
          ? "Pick a time that suits you. We'll call to answer every question and help you plan."
          : 'בחרו זמן שנוח לכם, נחזור אליכם בשיחה כדי לענות על כל שאלה ולעזור לתכנן.'),
    detailsTitle: isEn ? 'Your details' : 'הפרטים שלכם',
    detailsSub: isEn ? "First, who are we calling?" : 'קודם כל, למי אנחנו מתקשרים?',
    name: isEn ? 'Full name' : 'שם מלא',
    phone: isEn ? 'Phone number' : 'מספר טלפון',
    email: isEn ? 'Email address' : 'כתובת מייל',
    namePH: isEn ? 'Your name' : 'השם שלכם',
    emailPH: isEn ? 'you@example.com' : 'כתובת המייל שלכם',
    cont: isEn ? 'Choose a time →' : 'לבחירת מועד ←',
    back: isEn ? '← Edit details' : 'עריכת הפרטים →',
  };

  return (
    <>
      <Header />
      <main id="main-content" style={{ background: '#FAFAF8', minHeight: '100vh', paddingTop: isMobile ? '80px' : '124px', direction: dir }}>

        {/* hero */}
        <div style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #2d1b69 100%)',
          padding: isMobile ? '52px 6% 48px' : '72px 8% 64px',
          textAlign: 'center', position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position:'absolute', top:'-60px', left:'-60px', width:'280px', height:'280px',
            borderRadius:'50%', background:'rgba(109,40,217,0.18)', filter:'blur(60px)', pointerEvents:'none' }} />
          <div style={{ position:'absolute', bottom:'-40px', right:'-40px', width:'220px', height:'220px',
            borderRadius:'50%', background:'rgba(139,92,246,0.14)', filter:'blur(50px)', pointerEvents:'none' }} />
          <h1 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '36px' : '56px', fontWeight: 700,
            color: '#FFFFFF', margin: '0 0 16px', letterSpacing: '-0.03em', lineHeight: 1.1, position: 'relative',
          }}>
            {T.heroTitle}
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '16px' : '18px', fontWeight: 300,
            color: 'rgba(255,255,255,0.72)', margin: '0 auto', lineHeight: 1.75, maxWidth: '560px', position: 'relative',
          }}>
            {T.heroSub}
          </p>
        </div>

        <div style={{ maxWidth: '620px', margin: '0 auto', padding: isMobile ? '32px 5% 64px' : '52px 5% 80px' }}>
          {step === 'details' ? (
            <div style={{
              background: '#FFFFFF', border: '1px solid #ECEAF8', borderRadius: RADIUS.xl,
              padding: isMobile ? '28px 22px' : '40px 36px', boxShadow: '0 4px 24px rgba(15,15,40,0.06)',
            }}>
              <form onSubmit={toBooking} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '22px', fontWeight: 700,
                    color: '#0A0818', margin: '0 0 6px', letterSpacing: '-0.02em' }}>
                    {T.detailsTitle}
                  </h2>
                  <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 300,
                    color: '#9591B0', margin: 0 }}>
                    {T.detailsSub}
                  </p>
                </div>

                <Field id="name" label={T.name} value={form.name}
                  onChange={e => { setForm(f => ({ ...f, name: e.target.value.replace(/[^א-תa-zA-Z\s]/g, '') })); if (nameError) setNameError(''); }}
                  placeholder={T.namePH} required error={!!nameError} errorMsg={nameError} />

                <PhoneField
                  label={<>{T.phone}<span style={{ color: COLOR.primary }}> *</span></>}
                  dial={form.dial}
                  onDialChange={v => setForm(f => ({ ...f, dial: v }))}
                  local={form.phone}
                  onLocalChange={v => { setForm(f => ({ ...f, phone: v })); if (phoneError) setPhoneError(''); }}
                  error={!!phoneError}
                  errorMsg={phoneError}
                />

                <Field id="email" label={T.email} type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder={T.emailPH} />

                <button
                  type="submit"
                  onMouseEnter={() => setBtnHov(true)}
                  onMouseLeave={() => setBtnHov(false)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                    padding: '15px 28px', borderRadius: '999px',
                    background: btnHov ? '#5B21B6' : COLOR.primary, color: '#FFFFFF',
                    fontFamily: "'Ploni', sans-serif", fontSize: '16px', fontWeight: 700, border: 'none', cursor: 'pointer',
                    boxShadow: btnHov ? '0 8px 28px rgba(109,40,217,0.45)' : '0 4px 16px rgba(109,40,217,0.3)',
                    transform: btnHov ? 'translateY(-1px)' : 'none',
                    transition: `all 0.18s ${EASING.out}`,
                  }}
                >
                  {T.cont}
                </button>
              </form>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Tokenized links skip the details step, so there's nothing to go back to. */}
              {!leadToken && (
                <button
                  onClick={() => setStep('details')}
                  style={{
                    alignSelf: isRtl ? 'flex-end' : 'flex-start',
                    fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 600,
                    color: COLOR.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  {T.back}
                </button>
              )}
              <div style={{
                background: 'linear-gradient(160deg, #0A0818 0%, #1E1B4B 55%, #4C1D95 100%)',
                borderRadius: RADIUS.xl, padding: '28px 24px', border: '1px solid rgba(255,255,255,0.1)',
              }}>
                <BookingWidget
                  name={leadToken ? '' : form.name.trim()}
                  phone={leadToken ? '' : formatFullPhone(form.dial, form.phone)}
                  email={leadToken ? '' : form.email.trim()}
                  expedition={bookingExpedition}
                  expeditionSlug={exp?.slug}
                  leadToken={leadToken}
                />
              </div>
            </div>
          )}
        </div>

      </main>
      <SiteFooter />
    </>
  );
}
