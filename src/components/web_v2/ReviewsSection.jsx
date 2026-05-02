/**
 * ReviewsSection.jsx - Dream Site (web_v2)
 * גריד ביקורות גוגל · RTL Hebrew · רקע לבן
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { RADIUS, COLOR, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

const REVIEWS = [
  {
    name:     'יובל כהן',
    nameEn:   'Yuval Cohen',
    initials: 'י',
    initialsEn: 'Y',
    rating:   5,
    date:     'לפני חודש',
    dateEn:   '1 month ago',
    text:     "חוויה מדהימה מהרגע הראשון ועד האחרון. הצוות של HighAir היה מקצועי, קשוב ואכפתי. הטרק לקילימנג'רו היה חלום שהפך למציאות.",
    textEn:   "An incredible experience from start to finish. The HighAir team was professional, attentive and caring. The Kilimanjaro trek was a dream come true.",
  },
  {
    name:     'מיכל לוי',
    nameEn:   'Michal Levy',
    initials: 'מ',
    initialsEn: 'M',
    rating:   5,
    date:     'לפני חודשיים',
    dateEn:   '2 months ago',
    text:     'לא האמנתי שאגיע לפסגה אבל עם המדריכים של HighAir הכל נראה אפשרי. שירות אישי, ליווי צמוד ותשומת לב לכל פרט.',
    textEn:   "I never believed I'd reach the summit, but with HighAir's guides everything felt possible. Personal service, close support and attention to every detail.",
  },
  {
    name:     'אורן שמיר',
    nameEn:   'Oren Shamir',
    initials: 'א',
    initialsEn: 'O',
    rating:   5,
    date:     'לפני 3 חודשים',
    dateEn:   '3 months ago',
    text:     'HighAir זה לא רק טרק - זו קהילה שלמה. יצאתי עם חברים לכל החיים ועם זיכרונות שלא ישכחו לעולם. ממליץ בחום!',
    textEn:   "HighAir is not just a trek - it's a whole community. I left with lifelong friends and memories that will never fade. Highly recommended!",
  },
  {
    name:     'דנה ברק',
    nameEn:   'Dana Barak',
    initials: 'ד',
    initialsEn: 'D',
    rating:   5,
    date:     'לפני 4 חודשים',
    dateEn:   '4 months ago',
    text:     'הארגון המושלם לטיולי הרים. כל הלוגיסטיקה מסודרת, הציוד מעולה והמדריכים - ברמה אחרת לגמרי. 10 מתוך 10.',
    textEn:   'The perfect organization for mountain trips. All logistics sorted, top-notch gear and guides on a completely different level. 10 out of 10.',
  },
  {
    name:     'רן אברהם',
    nameEn:   'Ran Avraham',
    initials: 'ר',
    initialsEn: 'R',
    rating:   5,
    date:     'לפני 5 חודשים',
    dateEn:   '5 months ago',
    text:     'עשינו את טרק האנפורנה עם HighAir - מסע שינה אותי. בטיחות מקסימלית, אווירה משפחתית וידיעה שיש מי שדואג לך בכל רגע.',
    textEn:   "We did the Annapurna trek with HighAir - a journey that changed me. Maximum safety, a family atmosphere and the knowledge that someone is looking out for you at every moment.",
  },
  {
    name:     'שיר נוי',
    nameEn:   'Shir Noy',
    initials: 'ש',
    initialsEn: 'S',
    rating:   5,
    date:     'לפני 6 חודשים',
    dateEn:   '6 months ago',
    text:     'הכי טוב שעשיתי לעצמי. הטרק בפטגוניה היה פנטסטי ופגשתי אנשים מדהימים. HighAir יודעים לבנות חוויה שלמה.',
    textEn:   "The best thing I ever did for myself. The Patagonia trek was fantastic and I met amazing people. HighAir knows how to build a complete experience.",
  },
];

/* Avatar colors */
const AVATAR_COLORS = [
  '#6D28D9', '#7C3AED', '#4C1D95', '#5B21B6', '#8B5CF6', '#7C3AED',
];

function Stars() {
  return (
    <div style={{ display: 'flex', gap: '3px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="15" height="15" viewBox="0 0 24 24" fill="#FBBC04">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}

function ReviewCard({ name, nameEn, initials, initialsEn, date, dateEn, text, textEn, idx }) {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';
  const dir  = isEn ? 'ltr' : 'rtl';
  const displayName     = isEn ? (nameEn     || name)     : name;
  const displayInitials = isEn ? (initialsEn || initials) : initials;
  const displayDate     = isEn ? (dateEn     || date)     : date;
  const displayText     = isEn ? (textEn     || text)     : text;
  return (
    <div style={{
      background:    '#FFFFFF',
      borderRadius:  RADIUS.xl,
      padding:       '28px',
      border:        '1px solid #ECEAF8',
      boxShadow:     '0 2px 16px rgba(0,0,0,0.05)',
      direction:     dir,
      display:       'flex',
      flexDirection: 'column',
      gap:           '16px',
      transition:    `box-shadow 0.25s ${EASING.out}, transform 0.25s ${EASING.out}`,
    }}
    onMouseEnter={e => {
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(109,40,217,0.12)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    }}
    onMouseLeave={e => {
      e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.05)';
      e.currentTarget.style.transform = 'translateY(0)';
    }}
    >
      {/* Top: avatar + name + G logo */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width:          '44px',
            height:         '44px',
            borderRadius:   '50%',
            background:     AVATAR_COLORS[idx % AVATAR_COLORS.length],
            color:          '#FFFFFF',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            fontFamily:     'Ploni, sans-serif',
            fontSize:       FS.body,
            fontWeight:     700,
            flexShrink:     0,
          }}>
            {displayInitials}
          </div>
          <div>
            <div style={{
              fontFamily: 'Ploni, sans-serif',
              fontSize:   FS.body,
              fontWeight: 600,
              color:      '#0A0818',
            }}>
              {displayName}
            </div>
            <div style={{
              fontFamily: 'Ploni, sans-serif',
              fontSize:   FS.sm,
              color:      '#9591B0',
              marginTop:  '2px',
            }}>
              {displayDate}
            </div>
          </div>
        </div>
        <GoogleG />
      </div>

      {/* Stars */}
      <Stars />

      {/* Quote mark + text */}
      <div style={{ position: 'relative' }}>
        <div style={{
          position:   'absolute',
          top:        '-8px',
          right:      '-4px',
          fontSize:   '48px',
          lineHeight: 1,
          color:      'rgba(109,40,217,0.10)',
          fontFamily: 'Georgia, serif',
          userSelect: 'none',
        }}>
          "
        </div>
        <p style={{
          fontFamily: 'Ploni, sans-serif',
          fontSize:   FS.body,
          fontWeight: 300,
          color:      '#4B4869',
          margin:     0,
          lineHeight: 1.75,
          position:   'relative',
        }}>
          {displayText}
        </p>
      </div>
    </div>
  );
}

export default function ReviewsSection() {
  const { isMobile, isTablet } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  const [reviews, setReviews] = useState(REVIEWS);

  useEffect(() => {
    fetch('/api/airtable/Reviews')
      .then(r => r.json())
      .then(data => {
        const loaded = (data.records || [])
          .map(r => r.fields)
          .filter(f => f.Active)
          .map(f => ({
            name:       f.Name,
            nameEn:     f.Name_En,
            initials:   f.Initials,
            initialsEn: f.Initials_En,
            rating:     f.Rating ?? 5,
            date:       f.Date,
            dateEn:     f.Date_En,
            text:       f.Text,
            textEn:     f.Text_En,
          }));
        if (loaded.length) setReviews(loaded);
      })
      .catch(() => {}); // silently keep hardcoded fallback
  }, []);

  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <section style={{
      background:  '#FFFFFF',
      padding:     isMobile ? '36px 5%' : '60px 5%',
      boxSizing:   'border-box',
      direction:   dir,
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

        {/* ── Header ── */}
        <div style={{ marginBottom: '40px' }}>
          <h2 style={{
            fontFamily:    'Ploni, sans-serif',
            fontSize:      FS.h2,
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.02em',
            lineHeight:    1.1,
            textAlign:     'start',
          }}>
            {t('reviews.heading')}
          </h2>
          <p style={{
            fontFamily: 'Ploni, sans-serif',
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
            textAlign:  'start',
          }}>
            {t('reviews.subtitle')}
          </p>
        </div>

        {/* Rating bar - full width */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: isMobile ? 'space-between' : 'space-around',
          padding:        isMobile ? '18px 24px' : '22px 52px',
          borderRadius:   RADIUS.xl,
          background:     '#FFFFFF',
          border:         '1px solid #ECEAF8',
          boxShadow:      '0 2px 16px rgba(0,0,0,0.05)',
          marginBottom:   '40px',
          gap:            '16px',
          flexWrap:       'wrap',
        }}>
          {/* Google logo + label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <GoogleG />
            <span style={{
              fontFamily:    'Ploni, sans-serif',
              fontSize:      FS.sm,
              fontWeight:    600,
              color:         '#6B6B8A',
              letterSpacing: '0.02em',
            }}>
              Google Reviews
            </span>
          </div>

          {/* Divider */}
          {!isMobile && (
            <div style={{ width: '1px', height: '36px', background: '#ECEAF8', flexShrink: 0 }} />
          )}

          {/* Score */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              fontFamily:    "'Mazzard', sans-serif",
              fontSize:      isMobile ? '32px' : '40px',
              fontWeight:    900,
              color:         '#0A0818',
              lineHeight:    1,
              letterSpacing: '-0.03em',
            }}>
              5.0
            </span>
            <Stars />
          </div>

          {/* Divider */}
          {!isMobile && (
            <div style={{ width: '1px', height: '36px', background: '#ECEAF8', flexShrink: 0 }} />
          )}

          {/* Count */}
          <span style={{
            fontFamily: 'Ploni, sans-serif',
            fontSize:   FS.sm,
            color:      '#9591B0',
          }}>
            {t('reviews.basedOn')}
          </span>
        </div>

        {/* ── Grid - 3 reviews only ── */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
          gap:                 '20px',
          marginBottom:        '40px',
        }}>
          {reviews.slice(0, 3).map((r, i) => (
            <ReviewCard key={i} {...r} idx={i} />
          ))}
        </div>

        {/* ── CTA ── */}
        <div style={{ textAlign: 'center' }}>
          <a
            href="https://www.google.com/maps/place/%D7%98%D7%A8%D7%A7%D7%99%D7%9D+%D7%95%D7%9E%D7%A9%D7%9C%D7%97%D7%95%D7%AA+%D7%98%D7%99%D7%A4%D7%95%D7%A1+%D7%94%D7%A8%D7%99%D7%9D+-+HighAir+Expeditions%E2%80%AD/@31.9340141,34.828296,17z/data=!3m1!4b1!4m6!3m5!1s0x1502b71bd014c07b:0xbdb2b83af73fa260!8m2!3d31.9340141!4d34.8257211!16s%2Fg%2F11vjpz9vv_?entry=ttu"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              padding:        '13px 32px',
              borderRadius:   RADIUS.full,
              border:         `1.5px solid ${COLOR.primary}`,
              background:     'transparent',
              fontFamily:     'Ploni, sans-serif',
              fontSize:       FS.btn,
              fontWeight:     700,
              color:          COLOR.primary,
              textDecoration: 'none',
              letterSpacing:  '0.01em',
              transition:     `all 0.22s ${EASING.out}`,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = COLOR.primary;
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.boxShadow = '0 6px 22px rgba(109,40,217,0.30)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = COLOR.primary;
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {t('reviews.allReviews')}
          </a>
        </div>

      </div>
    </section>
  );
}
