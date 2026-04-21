/**
 * PressSection.jsx - Dream Site (web_v2)
 * Press & media coverage · RTL Hebrew · inline YouTube embed
 */

import { useState } from 'react';
import { RADIUS, COLOR, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';

/* ── Extract YouTube video ID from watch URL ── */
function getYouTubeId(href) {
  try {
    const url = new URL(href);
    return url.searchParams.get('v') ?? null;
  } catch {
    return null;
  }
}

/* ── Press items ── */
const PRESS_ITEMS = [
  {
    outlet:  'N12',
    color:   '#0057A8',
    date:    '2024',
    headline: 'בוריס, קטוע רגל מלחמת חרבות ברזל, כבש את הקילימנג\'רו',
    excerpt: 'לוחם פצוע שאיבד את רגלו מעל הברך יצא עם HighAir למסע מרגש לפסגה הגבוהה באפריקה - סיפור על אמונה, אומץ, וכוח מנטלי.',
    href:    'https://www.youtube.com/watch?v=tuxv0s1zzbk',
    isVideo: true,
  },
  {
    outlet:  'ערוץ 13',
    color:   '#E31E24',
    date:    '2024',
    headline: 'חן שקד: "מתוך אובדן אישי בניתי את HighAir"',
    excerpt: 'מייסד HighAir סיפר בתכנית הבוקר כיצד מסעות טיפוס הפכו לדרך חיים - ועל הכוח שטמון בהתמודדות עם אתגרים אמיתיים.',
    href:    'https://www.youtube.com/watch?v=8fE5LqCGG2M&t=1s',
    isVideo: true,
  },
  {
    outlet:  'פודקאסט',
    color:   '#7C3AED',
    date:    '2024',
    headline: '"מאובדן לפסגות הגבוהות בעולם" - פודקאסט עם חן שקד',
    excerpt: 'ראיון מעמיק עם מייסד HighAir על החיים, ההרים, ואיך הפך חלום לעסק שמשנה חיים.',
    href:    'https://www.youtube.com/watch?v=3wV2ckjnnKc',
    isVideo: true,
  },
];

/* ── Press Card ── */
function PressCard({ item, isMobile }) {
  const { outlet, color, date, headline, excerpt, href, isVideo } = item;
  const [hovered, setHovered] = useState(false);
  const videoId = isVideo ? getYouTubeId(href) : null;
  const embedSrc = videoId
    ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`
    : null;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:       'flex',
        flexDirection: 'column',
        background:    '#FFFFFF',
        border:        '1px solid #ECEAF8',
        borderRadius:  RADIUS.xl,
        overflow:      'hidden',
        boxShadow:     hovered ? '0 8px 28px rgba(0,0,0,0.10)' : '0 2px 12px rgba(0,0,0,0.06)',
        transform:     hovered ? 'translateY(-3px)' : 'none',
        transition:    'all 0.22s ease',
        direction:     'rtl',
      }}
    >
      {/* ── Embedded video ── */}
      {embedSrc && (
        <div style={{ width: '100%', aspectRatio: '16/9', flexShrink: 0 }}>
          <iframe
            src={embedSrc}
            title={headline}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            style={{
              display: 'block',
              width:   '100%',
              height:  '100%',
              border:  'none',
            }}
          />
        </div>
      )}

      {/* ── Card body ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px 24px 24px' }}>

        {/* Outlet badge + date */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{
            display:       'inline-flex',
            alignItems:    'center',
            padding:       '4px 12px',
            borderRadius:  RADIUS.full,
            background:    color,
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      FS.sm,
            fontWeight:    700,
            color:         '#FFFFFF',
            letterSpacing: '0.03em',
          }}>
            {outlet}
          </div>
          <span style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   FS.sm,
            fontWeight: 300,
            color:      '#9591B0',
          }}>
            {date}
          </span>
        </div>

        {/* Headline */}
        <h3 style={{
          fontFamily:    "'Ploni', sans-serif",
          fontSize:      FS.h3,
          fontWeight:    700,
          color:         '#0A0818',
          margin:        0,
          lineHeight:    1.4,
          letterSpacing: '-0.01em',
        }}>
          {headline}
        </h3>

        {/* Excerpt */}
        <p style={{
          fontFamily: "'Ploni', sans-serif",
          fontSize:   FS.body,
          fontWeight: 300,
          color:      '#6B6B8A',
          margin:     0,
          lineHeight: 1.65,
        }}>
          {excerpt}
        </p>

      </div>
    </div>
  );
}

/* ── Main Section ── */
export default function PressSection() {
  const { isMobile } = useBreakpoint();

  return (
    <section style={{
      background: '#FFFFFF',
      padding:    isMobile ? '36px 5%' : '60px 5%',
      boxSizing:  'border-box',
      direction:  'rtl',
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%' }}>

        {/* Header */}
        <div style={{ marginBottom: '52px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      FS.h2,
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.02em',
            lineHeight:    1.1,
            textAlign:     'center',
          }}>
            HighAir בתקשורת
          </h2>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
            textAlign:  'center',
          }}>
            כתבות ומדיה שסיפרו את הסיפור שלנו
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display:             'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap:                 '20px',
        }}>
          {PRESS_ITEMS.map((item, i) => (
            <PressCard key={i} item={item} isMobile={isMobile} />
          ))}
        </div>

      </div>
    </section>
  );
}
