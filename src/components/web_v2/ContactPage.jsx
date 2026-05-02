/**
 * ContactPage.jsx — /contact
 *
 * Real company-information page. Customers paying $5–15k for an expedition
 * expect to see business details: address, phone, email, WhatsApp, hours,
 * registered company name. The booking form lives elsewhere; this page is
 * about TRUST first and a low-friction message-us channel second.
 *
 * Schema.org `ContactPage` + `Organization.contactPoint` is injected via
 * usePageMeta so search engines can surface a phone/email rich result.
 */
import { useTranslation } from 'react-i18next';
import LegalPageLayout, { SECTION, H2, P } from './LegalPageLayout.jsx';
import { Analytics } from '../../utils/analytics.js';

const COMPANY = {
  legalName:  'HighAir Expeditions',
  phone:      '+972 55-563-6975',
  phoneLink:  '+972555636975',
  email:      'info@highair-expeditions.com',
  whatsapp:   'https://wa.me/972555636975',
  hoursHe:    'ימים א׳–ה׳, 09:00–18:00 · ו׳ 09:00–13:00',
  hoursEn:    'Sun–Thu 09:00–18:00 · Fri 09:00–13:00',
  // Israeli business registry / corporation number — printed on receipts
  // and required for Schema.org `Organization.taxID` compliance.
  registrationHe: 'ח.פ. 558586087',
  registrationEn: 'Company reg. 558586087',
  // TODO: add the Ministry of Tourism license number once issued.
  licenseHe:      '',
  licenseEn:      '',
};

const CARD = {
  background:   '#FFFFFF',
  border:       '1px solid #ECEAF8',
  borderRadius: '16px',
  padding:      '24px',
  marginBottom: '14px',
  boxShadow:    '0 2px 12px rgba(15,15,40,0.04)',
};

const ROW_LABEL = {
  fontFamily: "'Ploni', sans-serif",
  fontSize:   '12px',
  fontWeight: 700,
  color:      '#7C3AED',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  marginBottom: '6px',
};

const ROW_VALUE = {
  fontFamily: "'Ploni', sans-serif",
  fontSize:   '17px',
  fontWeight: 600,
  color:      '#0A0818',
  margin:     0,
  lineHeight: 1.5,
};

const LINK = {
  color: '#7C3AED',
  textDecoration: 'none',
  fontWeight: 700,
};

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';

  const titleHe = 'יצירת קשר | HighAir Expeditions';
  const titleEn = 'Contact Us | HighAir Expeditions';
  const descHe  = 'דברו איתנו - טלפון, וואטסאפ, מייל, ושעות פעילות. צוות HighAir Expeditions זמין לכל שאלה לפני, במהלך ואחרי המשלחת.';
  const descEn  = 'Get in touch — phone, WhatsApp, email and business hours. The HighAir Expeditions team is available before, during and after every expedition.';

  const contactPageJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'ContactPage',
    name:       isRtl ? titleHe : titleEn,
    url:        'https://www.highair-expeditions.com/contact',
    mainEntity: {
      '@type': 'Organization',
      name:    COMPANY.legalName,
      url:     'https://www.highair-expeditions.com',
      logo:    'https://www.highair-expeditions.com/Logo.png',
      taxID:   '558586087',
      contactPoint: [{
        '@type':           'ContactPoint',
        telephone:         COMPANY.phone,
        contactType:       'customer service',
        availableLanguage: ['Hebrew', 'English'],
        email:             COMPANY.email,
      }],
    },
  };

  function trackChannel(channel) {
    Analytics.clickCTA(channel, 'contact_page');
  }

  return (
    <LegalPageLayout
      title={isRtl ? 'יצירת קשר' : 'Contact'}
      subtitle={isRtl
        ? 'אנחנו זמינים לכם לפני, במהלך ואחרי המשלחת. כל שאלה - אנחנו כאן.'
        : 'We are here before, during and after every expedition. Any question — reach out.'}
      pageMeta={{
        title:         isRtl ? titleHe : titleEn,
        description:   isRtl ? descHe  : descEn,
        canonicalPath: '/contact',
        jsonLd:        contactPageJsonLd,
      }}
    >
      {/* ── Primary contact channels ── */}
      <div style={SECTION}>
        <h2 style={H2}>{isRtl ? 'דברו איתנו' : 'Get in touch'}</h2>

        <div style={CARD}>
          <div style={ROW_LABEL}>{isRtl ? 'טלפון' : 'Phone'}</div>
          <p style={ROW_VALUE}>
            <a
              href={`tel:${COMPANY.phoneLink}`}
              style={LINK}
              onClick={() => trackChannel('phone')}
            >{COMPANY.phone}</a>
          </p>
        </div>

        <div style={CARD}>
          <div style={ROW_LABEL}>WhatsApp</div>
          <p style={ROW_VALUE}>
            <a
              href={COMPANY.whatsapp}
              target="_blank" rel="noopener"
              style={LINK}
              onClick={() => trackChannel('whatsapp')}
            >{isRtl ? 'שלחו הודעה ב-WhatsApp ←' : 'Message us on WhatsApp →'}</a>
          </p>
        </div>

        <div style={CARD}>
          <div style={ROW_LABEL}>{isRtl ? 'דוא״ל' : 'Email'}</div>
          <p style={ROW_VALUE}>
            <a
              href={`mailto:${COMPANY.email}`}
              style={LINK}
              onClick={() => trackChannel('email')}
            >{COMPANY.email}</a>
          </p>
        </div>

        <div style={CARD}>
          <div style={ROW_LABEL}>{isRtl ? 'שעות פעילות' : 'Business hours'}</div>
          <p style={ROW_VALUE}>{isRtl ? COMPANY.hoursHe : COMPANY.hoursEn}</p>
        </div>
      </div>

      {/* ── Company / legal details ── */}
      <div style={SECTION}>
        <h2 style={H2}>{isRtl ? 'פרטי החברה' : 'Company details'}</h2>
        <p style={P}>
          {COMPANY.legalName}<br />
          {isRtl ? COMPANY.registrationHe : COMPANY.registrationEn}
          {(isRtl ? COMPANY.licenseHe : COMPANY.licenseEn) && (
            <>
              <br />
              {isRtl ? COMPANY.licenseHe : COMPANY.licenseEn}
            </>
          )}
        </p>
        <p style={P}>
          {isRtl
            ? 'אנחנו פועלים תחת רישוי הרשויות הרלוונטיות בישראל ומבוטחים אצל חברת ביטוח מובילה. במקרה של אירוע חירום במהלך המשלחת, יש לנו צוות זמין 24/7.'
            : 'We operate under the relevant Israeli regulatory licenses and carry full operator liability insurance. A 24/7 emergency response team is on-call during every active expedition.'}
        </p>
      </div>

      {/* ── Quick form CTA ── */}
      <div style={SECTION}>
        <h2 style={H2}>{isRtl ? 'מעדיפים שניצור קשר אנחנו?' : 'Prefer that we reach out?'}</h2>
        <p style={P}>
          {isRtl
            ? 'מלאו את הטופס הקצר בעמוד הבית ואנחנו נחזור אליכם בתוך יום עסקים.'
            : 'Leave a short message on the home page and we will get back to you within one business day.'}
        </p>
        <p style={P}>
          <a href="/#contact" style={LINK} onClick={() => trackChannel('home_form')}>
            {isRtl ? 'אל הטופס בעמוד הבית ←' : 'Go to the home-page form →'}
          </a>
        </p>
      </div>
    </LegalPageLayout>
  );
}
