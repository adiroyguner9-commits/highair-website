/**
 * ReviewsSection.jsx - Dream Site (web_v2)
 * גריד ביקורות גוגל · RTL Hebrew · רקע לבן
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { currentLang } from '../../website/lang.js';
import { RADIUS, COLOR, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

/* The real reviews (Airtable "Reviews", 7 May 2026), used when the live
   fetch fails. The old fallback was six generic placeholder reviews with
   frozen "1 month ago" dates (one about a Patagonia trek we don't run);
   replaced 6 Nov 2026 so nothing invented can ever show. */
const REVIEWS = [
  { id: 'recP8AdwnpVvWjstb', name: 'שירה בן שושן', nameEn: 'Shira Ben Shushan', initials: 'ש.ב', initialsEn: 'S.B.', rating: 5, date: 'פברואר 2026', dateEn: 'February 2026',
    text: 'לפני כשבוע חזרתי מטיפוס על הקילימנג׳רו, הליווי של חן ואדיר לכל אורך תקופת ההכנה ולאורך המסע עצמו היו מדוייקים ותרמו לחוויה להיות חיובית ומשמעותית.\nלכל שאלה הם ענו בסבלנות ומקצועיות, הירידה לפרטים הקטנים עשתה את המסע לכל כך מוצלח. המדריכים והצוות בטנזניה היו קשובים ובעלי נסיון רב בטיפוס על ההר דבר שמאוד הקל על ההתנהלות.\nממליצה מאוד, חוויה של פעם בחיים!!!',
    textEn: 'About a week ago I returned from climbing Kilimanjaro. The guidance of Chen and Adir throughout the preparation period and the trip itself was precise and made the experience positive and meaningful.\nEvery question was answered with patience and professionalism, the attention to small details made the trip so successful. The guides and staff in Tanzania were attentive and highly experienced in climbing the mountain, which made everything run smoothly.\nHighly recommend, a once-in-a-lifetime experience!!!' },
  { id: 'recsQ8946JQdIobN3', name: 'שירלי אביר', nameEn: 'Shirly Abir', initials: 'ש.א', initialsEn: 'S.A.', rating: 5, date: 'ינואר 2026', dateEn: 'January 2026',
    text: 'חוויה מאתגרת ועוצמתית!\nתודה להיי אייר - חן ואדיר - על ארגון מקצועי, מתוקתק, עם חשיבה לפרטים והמון אכפתיות.\nהארגון וההכנה היו מצויינים - החל מרמת הטפסים הנדרשים, דרך האימונים והחיסונים ועד לרמת הציוד הנדרשת.\nחייבת לציין לטובה גם את ליעד, סוכן הנסיעות המקצועי והשירותי, ואת קורל - סוכנת הביטוח.\nהמקצועיות והאכפתיות הורגשו בכל שלב במסע, הצוות המקומי התנהל ברוח היי אייר, ועטף אותנו בפינוקים, בהרבה שמחה ובסיוע מתמיד.\nתודה לכם!',
    textEn: 'A challenging and powerful experience!\nThank you to HighAir - Chen and Adir - for professional, meticulous organization with attention to detail and so much care.\nThe organization and preparation were excellent - from the required forms, through the training and vaccinations, to the required gear level.\nI must also mention Liad, the professional and service-oriented travel agent, and Coral - the insurance agent.\nThe professionalism and care were felt at every stage of the journey. The local team operated in the spirit of HighAir, and wrapped us in treats, lots of joy and constant support.\nThank you!' },
  { id: 'recNXJz3CKXbRLiFY', name: 'מוטי פאר', nameEn: 'Moti Peer', initials: 'מ.פ', initialsEn: 'M.P.', rating: 5, date: 'ינואר 2026', dateEn: 'January 2026',
    text: 'טיפסתי את הקילימנג׳רו עם קבוצה של היי אייר. עברתי חוויה חיובית מאוד שתחרת אצלי עד יומי האחרון. המעטפת שסיפקה לנו החברה בהכנות לנסיעה לא תסולה בפז. הרכב הקבוצה שבנו חן ואדיר, היה נפלא. זכיתי בחברים לכל החיים. אני ממליץ בחום לכל מי שרוצה לטפס את הקילימנג׳רו ולדעת שהכל מטופל לעילה ולעילה. גם בארץ וגם באפריקה.',
    textEn: 'I climbed Kilimanjaro with a HighAir group. It was an incredibly positive experience that will stay with me for the rest of my life. The support the company provided during the preparations was invaluable. The group that Chen and Adir put together was wonderful. I made friends for life. I highly recommend it to anyone who wants to climb Kilimanjaro and know that everything is taken care of to the highest standard, both in Israel and in Africa.' },
];

/* German and Spanish translations of the real reviews, by Airtable record id.
   A review without one shows its English translation. */
const REVIEW_I18N = {
  recP8AdwnpVvWjstb: {
    de: 'Vor etwa einer Woche bin ich von der Kilimandscharo-Besteigung zurückgekommen. Die Begleitung durch Chen und Adir während der ganzen Vorbereitung und auf der Reise selbst war genau und hat das Erlebnis positiv und bedeutsam gemacht.\nJede Frage wurde geduldig und professionell beantwortet, und die Liebe zum Detail hat die Reise so erfolgreich gemacht. Die Guides und das Team in Tansania waren aufmerksam und sehr erfahren am Berg, was alles sehr erleichtert hat.\nSehr zu empfehlen, ein Erlebnis fürs Leben!!!',
    es: 'Hace una semana volví de subir el Kilimanjaro. El acompañamiento de Chen y Adir durante toda la preparación y durante el viaje fue preciso e hizo que la experiencia fuera positiva y significativa.\nRespondieron cada pregunta con paciencia y profesionalidad, y la atención a los pequeños detalles hizo que el viaje saliera tan bien. Los guías y el equipo en Tanzania fueron atentos y tenían mucha experiencia en la montaña, lo que facilitó mucho todo.\n¡Muy recomendable, una experiencia única en la vida!',
  },
  recsQ8946JQdIobN3: {
    de: 'Ein herausforderndes und kraftvolles Erlebnis!\nDanke an HighAir, Chen und Adir, für eine professionelle, perfekt durchdachte Organisation mit Blick fürs Detail und viel Fürsorge.\nOrganisation und Vorbereitung waren hervorragend, von den nötigen Formularen über Training und Impfungen bis zur richtigen Ausrüstung.\nBesonders erwähnen möchte ich auch Liad, den professionellen und hilfsbereiten Reiseagenten, und Coral, die Versicherungsagentin.\nProfessionalität und Fürsorge waren in jeder Phase der Reise spürbar. Das lokale Team arbeitete ganz im Sinne von HighAir und hat uns mit Verwöhnung, viel Freude und ständiger Unterstützung umsorgt.\nDanke!',
    es: '¡Una experiencia exigente y muy intensa!\nGracias a HighAir, a Chen y Adir, por una organización profesional y muy cuidada, con atención al detalle y mucho cariño.\nLa organización y la preparación fueron excelentes, desde los formularios necesarios, pasando por el entrenamiento y las vacunas, hasta el nivel de equipo necesario.\nTambién quiero destacar a Liad, el agente de viajes, profesional y muy servicial, y a Coral, la agente de seguros.\nLa profesionalidad y el cuidado se notaron en cada etapa del viaje. El equipo local trabajó con el espíritu de HighAir y nos llenó de mimos, alegría y apoyo constante.\n¡Gracias!',
  },
  recNXJz3CKXbRLiFY: {
    de: 'Ich habe den Kilimandscharo mit einer HighAir-Gruppe bestiegen. Es war ein sehr positives Erlebnis, das mir für den Rest meines Lebens bleiben wird. Die Unterstützung des Unternehmens bei der Vorbereitung war unbezahlbar. Die Gruppe, die Chen und Adir zusammengestellt haben, war wunderbar. Ich habe Freunde fürs Leben gewonnen. Ich empfehle es allen, die den Kilimandscharo besteigen und sicher sein wollen, dass alles bestens organisiert ist, in Israel wie in Afrika.',
    es: 'Subí el Kilimanjaro con un grupo de HighAir. Fue una experiencia muy positiva que me acompañará el resto de mi vida. El apoyo que nos dio la empresa durante la preparación no tiene precio. El grupo que formaron Chen y Adir fue maravilloso. Hice amigos para toda la vida. Lo recomiendo a cualquiera que quiera subir el Kilimanjaro y saber que todo está organizado al más alto nivel, tanto en Israel como en África.',
  },
};
export { REVIEW_I18N };

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

/* "3 months ago" in German / Spanish; the review text itself stays as written */
function relDate(str) {
  const lng = currentLang();
  /* "January 2026" -> "Januar 2026" / "enero de 2026" */
  const my = /^([A-Za-z]+)\s+(\d{4})$/.exec(String(str || '').trim());
  if (my && (lng === 'de' || lng === 'es')) {
    const d = new Date(`${my[1]} 1, ${my[2]}`);
    if (!isNaN(d)) return d.toLocaleDateString(lng === 'de' ? 'de-DE' : 'es-ES', { month: 'long', year: 'numeric' });
  }
  const m = /^(\d+|a|an)\s+(day|week|month|year)s?\s+ago$/i.exec(String(str || '').trim());
  if (!m || (lng !== 'de' && lng !== 'es')) return str;
  const n = /^\d+$/.test(m[1]) ? Number(m[1]) : 1;
  const W = { de: { day: ['Tag', 'Tagen'], week: ['Woche', 'Wochen'], month: ['Monat', 'Monaten'], year: ['Jahr', 'Jahren'] },
              es: { day: ['día', 'días'], week: ['semana', 'semanas'], month: ['mes', 'meses'], year: ['año', 'años'] } }[lng][m[2].toLowerCase()];
  const w = W[n === 1 ? 0 : 1];
  return lng === 'de' ? `vor ${n === 1 ? (m[2].toLowerCase() === 'week' ? 'einer' : 'einem') : n} ${w}` : `hace ${n === 1 ? (m[2].toLowerCase() === 'week' ? 'una' : 'un') : n} ${w}`;
}

function ReviewCard({ id, name, nameEn, initials, initialsEn, date, dateEn, text, textEn, idx }) {
  const { i18n } = useTranslation();
  const isEn = i18n.language !== 'he';
  const dir  = isEn ? 'ltr' : 'rtl';
  const displayName     = isEn ? (nameEn     || name)     : name;
  const displayInitials = isEn ? (initialsEn || initials) : initials;
  const displayDate     = isEn ? relDate(dateEn     || date)     : date;
  const displayText     = isEn ? (REVIEW_I18N[id]?.[currentLang()] || textEn || text) : text;
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
              color:      '#6B6B8A',
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
  const dir = i18n.language !== 'he' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';

  const [reviews, setReviews] = useState(REVIEWS);

  useEffect(() => {
    fetch('/api/airtable/Reviews')
      .then(r => r.json())
      .then(data => {
        const loaded = (data.records || [])
          .filter(r => r.fields?.Active)
          .map(({ id, fields: f }) => ({
            id,
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
      background:  'transparent',
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
            color:      '#6B6B8A',
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
