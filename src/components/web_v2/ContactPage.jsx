/**
 * ContactPage.jsx — /contact
 * Layout matches Blog / AboutUs: full-width hero header, #FAFAF8 body,
 * 1280px content column, Header + SiteFooter.
 */
import { useTranslation }   from 'react-i18next';
import { usePageMeta }      from '../../website/usePageMeta.js';
import { useBreakpoint }    from '../../website/useBreakpoint.js';
import { COLOR, RADIUS, FS, EASING } from '../../website/theme.js';
import Header               from './Header.jsx';
import SiteFooter           from './SiteFooter.jsx';

/* ── Company data ── */
const COMPANY = {
  phone:     '+972 55-563-6975',
  phoneLink: '+972555636975',
  email:     'info@highair-expeditions.com',
  whatsapp:  'https://wa.me/972555636975',
  hoursHe:   'ימים א׳–ה׳ 09:00–18:00 · ו׳ 09:00–13:00',
  hoursEn:   'Sun–Thu 09:00–18:00 · Fri 09:00–13:00',
  regHe:     'ח.פ. 558586087',
  regEn:     'Company reg. 558586087',
};

/* ── SVG icons ── */
function IconPhone() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke={COLOR.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.06 6.06l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
function IconWA() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke={COLOR.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke={COLOR.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function IconClock() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
      stroke={COLOR.primary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}

/* ── Single contact card ── */
function ContactCard({ icon, label, value, href, external }) {
  const { isMobile } = useBreakpoint();
  const inner = (
    <div style={{
      background:   '#FFFFFF',
      border:       '1px solid #ECEAF8',
      borderRadius: RADIUS.xl,
      padding:      isMobile ? '24px 20px' : '28px 28px',
      display:      'flex',
      flexDirection:'column',
      gap:          '14px',
      boxShadow:    '0 2px 12px rgba(15,15,40,0.04)',
      height:       '100%',
      boxSizing:    'border-box',
      transition:   `box-shadow 0.22s ${EASING.out}, transform 0.22s ${EASING.out}`,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(109,40,217,0.13)';
        e.currentTarget.style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(15,15,40,0.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Icon circle */}
      <div style={{
        width:          '52px',
        height:         '52px',
        borderRadius:   '14px',
        background:     '#F3F0FF',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        flexShrink:     0,
      }}>
        {icon}
      </div>

      <div>
        <p style={{
          fontFamily:    "'Ploni', sans-serif",
          fontSize:      '12px',
          fontWeight:    700,
          color:         '#9591B0',
          margin:        '0 0 6px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {label}
        </p>
        <p style={{
          fontFamily: "'Ploni', sans-serif",
          fontSize:   isMobile ? '16px' : '18px',
          fontWeight: 600,
          color:      href ? COLOR.primary : '#0A0818',
          margin:     0,
          lineHeight: 1.45,
        }}>
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) return inner;

  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      style={{ textDecoration: 'none', display: 'block', height: '100%' }}
    >
      {inner}
    </a>
  );
}

/* ══════════════════════════════════════════════
   Page
══════════════════════════════════════════════ */
export default function ContactPage() {
  const { i18n }   = useTranslation();
  const isEn       = i18n.language === 'en';
  const isRtl      = !isEn;
  const dir        = isEn ? 'ltr' : 'rtl';
  const { isMobile, isTablet } = useBreakpoint();

  usePageMeta({
    title:         isEn
      ? 'Contact Us | HighAir Expeditions'
      : 'יצירת קשר | HighAir Expeditions',
    description:   isEn
      ? 'Get in touch — phone, WhatsApp, email and business hours. The HighAir Expeditions team is available before, during and after every expedition.'
      : 'דברו איתנו — טלפון, וואטסאפ, מייל ושעות פעילות. צוות HighAir Expeditions זמין לכם לפני, במהלך ואחרי כל משלחת.',
    canonicalPath: '/contact',
  });

  const cols = isMobile ? 1 : isTablet ? 2 : 4;

  const CARDS = [
    {
      icon:     <IconPhone />,
      label:    isRtl ? 'טלפון' : 'Phone',
      value:    COMPANY.phone,
      href:     `tel:${COMPANY.phoneLink}`,
      external: false,
    },
    {
      icon:     <IconWA />,
      label:    'WhatsApp',
      value:    isRtl ? 'שלחו הודעה' : 'Send a message',
      href:     COMPANY.whatsapp,
      external: true,
    },
    {
      icon:     <IconMail />,
      label:    isRtl ? 'דוא״ל' : 'Email',
      value:    COMPANY.email,
      href:     `mailto:${COMPANY.email}`,
      external: false,
    },
    {
      icon:     <IconClock />,
      label:    isRtl ? 'שעות פעילות' : 'Business hours',
      value:    isRtl ? COMPANY.hoursHe : COMPANY.hoursEn,
      href:     null,
      external: false,
    },
  ];

  return (
    <>
      <Header />
      <main
        id="main-content"
        style={{
          background:  '#FAFAF8',
          minHeight:   '100vh',
          paddingTop:  '80px',
          direction:   dir,
        }}
      >

        {/* ── Page header ── */}
        <div style={{
          background:   '#FFFFFF',
          borderBottom: '1px solid #ECEAF8',
          padding:      isMobile ? '36px 5% 28px' : '52px 5% 36px',
          textAlign:    'center',
        }}>
          <h1 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      isMobile ? '28px' : '42px',
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
          }}>
            {isRtl ? 'יצירת קשר' : 'Contact Us'}
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
            maxWidth:   '560px',
            marginLeft: 'auto',
            marginRight:'auto',
          }}>
            {isRtl
              ? 'אנחנו זמינים לכם לפני, במהלך ואחרי המשלחת. כל שאלה — אנחנו כאן.'
              : 'We are here before, during and after every expedition. Any question — reach out.'}
          </p>
        </div>

        {/* ── Content ── */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '32px 5% 64px' : '52px 5% 80px' }}>

          {/* ── Contact cards grid ── */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap:                 isMobile ? '14px' : '20px',
            marginBottom:        isMobile ? '48px' : '64px',
          }}>
            {CARDS.map((c, i) => (
              <ContactCard key={i} {...c} />
            ))}
          </div>

          {/* ── Response time badge ── */}
          <div style={{
            background:    '#F3F0FF',
            border:        '1px solid #E0D9FF',
            borderRadius:  RADIUS.xl,
            padding:       isMobile ? '20px 20px' : '24px 32px',
            display:       'flex',
            alignItems:    'center',
            gap:           '16px',
            marginBottom:  isMobile ? '48px' : '64px',
            direction:     dir,
          }}>
            <div style={{
              width:          '44px',
              height:         '44px',
              borderRadius:   '12px',
              background:     COLOR.primary,
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              flexShrink:     0,
              fontSize:       '22px',
            }}>
              ⚡
            </div>
            <div>
              <p style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize:   '15px',
                fontWeight: 700,
                color:      '#0A0818',
                margin:     '0 0 2px',
              }}>
                {isRtl ? 'זמן מענה עד 24 שעות' : 'Response within 24 hours'}
              </p>
              <p style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize:   '14px',
                fontWeight: 400,
                color:      '#6B6B8A',
                margin:     0,
              }}>
                {isRtl
                  ? 'פניות שמגיעות בשעות העסקים מקבלות מענה ממוצע של שעה בלבד'
                  : 'Inquiries received during business hours are typically answered within an hour'}
              </p>
            </div>
          </div>

          {/* ── Two-column: company details + reach out form CTA ── */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
            gap:                 isMobile ? '20px' : '28px',
          }}>

            {/* Company details */}
            <div style={{
              background:   '#FFFFFF',
              border:       '1px solid #ECEAF8',
              borderRadius: RADIUS.xl,
              padding:      isMobile ? '24px 20px' : '32px',
              boxShadow:    '0 2px 12px rgba(15,15,40,0.04)',
            }}>
              <h2 style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      '20px',
                fontWeight:    700,
                color:         '#0A0818',
                margin:        '0 0 20px',
                letterSpacing: '-0.01em',
              }}>
                {isRtl ? 'פרטי החברה' : 'Company details'}
              </h2>

              {[
                { label: isRtl ? 'שם החברה' : 'Legal name', value: 'HighAir Expeditions' },
                { label: isRtl ? 'מספר חברה' : 'Registration', value: isRtl ? COMPANY.regHe : COMPANY.regEn },
              ].map((row, i) => (
                <div key={i} style={{
                  borderBottom: i === 0 ? '1px solid #F0EDF8' : 'none',
                  paddingBottom: i === 0 ? '16px' : 0,
                  marginBottom:  i === 0 ? '16px' : 0,
                }}>
                  <p style={{
                    fontFamily: "'Ploni', sans-serif",
                    fontSize:   '12px',
                    fontWeight: 700,
                    color:      '#9591B0',
                    margin:     '0 0 4px',
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                  }}>
                    {row.label}
                  </p>
                  <p style={{
                    fontFamily: "'Ploni', sans-serif",
                    fontSize:   '15px',
                    fontWeight: 600,
                    color:      '#0A0818',
                    margin:     0,
                  }}>
                    {row.value}
                  </p>
                </div>
              ))}

              <p style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize:   '14px',
                fontWeight: 400,
                color:      '#6B6B8A',
                lineHeight: 1.75,
                margin:     '20px 0 0',
              }}>
                {isRtl
                  ? 'אנחנו פועלים תחת רישוי הרשויות הרלוונטיות בישראל ומבוטחים אצל חברת ביטוח מובילה. במקרה חירום במהלך המשלחת — צוות 24/7 זמין.'
                  : 'We operate under the relevant Israeli regulatory licenses and carry full operator liability insurance. A 24/7 emergency response team is on-call during every active expedition.'}
              </p>
            </div>

            {/* CTA — form */}
            <div style={{
              background:    'linear-gradient(135deg, #1e1b4b 0%, #2d1b69 100%)',
              borderRadius:  RADIUS.xl,
              padding:       isMobile ? '24px 20px' : '32px',
              display:       'flex',
              flexDirection: 'column',
              justifyContent:'space-between',
              gap:           '24px',
            }}>
              <div>
                <p style={{ fontSize: '32px', margin: '0 0 14px' }}>🏔️</p>
                <h2 style={{
                  fontFamily:    "'Ploni', sans-serif",
                  fontSize:      '20px',
                  fontWeight:    700,
                  color:         '#FFFFFF',
                  margin:        '0 0 12px',
                  letterSpacing: '-0.01em',
                  lineHeight:    1.3,
                }}>
                  {isRtl ? 'מעדיפים שניצור קשר אנחנו?' : 'Prefer that we reach out?'}
                </h2>
                <p style={{
                  fontFamily: "'Ploni', sans-serif",
                  fontSize:   '15px',
                  fontWeight: 400,
                  color:      'rgba(255,255,255,0.65)',
                  margin:     0,
                  lineHeight: 1.7,
                }}>
                  {isRtl
                    ? 'מלאו את הטופס הקצר בעמוד הבית ואנחנו נחזור אליכם תוך 24 שעות.'
                    : 'Leave a short message on the home page and we will get back to you within 24 hours.'}
                </p>
              </div>
              <a
                href="/#contact"
                style={{
                  display:        'inline-flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  padding:        '14px 28px',
                  borderRadius:   RADIUS.full,
                  background:     '#FFFFFF',
                  color:          COLOR.primary,
                  fontFamily:     "'Ploni', sans-serif",
                  fontSize:       '15px',
                  fontWeight:     700,
                  textDecoration: 'none',
                  transition:     `opacity 0.18s ${EASING.out}`,
                  alignSelf:      'flex-start',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                {isRtl ? 'אל הטופס ←' : 'Go to the form →'}
              </a>
            </div>

          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
