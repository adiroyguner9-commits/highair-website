/**
 * FounderSection.jsx — Homepage "מי אנחנו" block.
 * Title + Chen's story (intro) + Manaslu summit image + CTA to the About page.
 * Chen is a professional mountain climber (NOT a "guide").
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RADIUS, COLOR, FS, EASING } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { Analytics } from '../../utils/analytics.js';

const MANASLU_IMG = '/images/about-story.avif';

const STORY_HE = [
  'נעים להכיר, אני חן שקד, מטפס הרים מקצועי ומייסד HighAir. את עולם הטרקים וטיפוסי ההרים פגשתי לראשונה אחרי הצבא בנפאל, שם התאהבתי בנופים ובניתוק שרק ההרים יכולים לספק. מאז טיפסתי על הקזבק, הקילימנג׳רו, גראן פרדיסו, אמא דאבלם, לובוצ׳ה פיק ואיילנד פיק, ובספטמבר 2025 העפלתי אל פסגת המנסלו, ההר השמיני בגובהו בעולם.',
  'אבל המסע האמיתי שלי התחיל בבית. לפני חמש שנים אימי היקרה, קרול שקד ז״ל, נפטרה לאחר מאבק ממושך בסרטן, ומאותו הרגע החלטתי להקדיש את חיי להנצחתה. בכל פסגה אני מניף את דגלה, וככל שאני עולה גבוה יותר, אני מרגיש קרוב אליה יותר.',
  'בהשראת הנתינה של אמא, חלק מכל מסע שאנחנו מוציאים מוקדש לתמיכה בחולי סרטן בישראל ולהגשמת חלומות של ילדים שמתמודדים עם המחלה. ככה כל פסגה שאתם מטפסים הופכת גם לדרך לתת.',
];
const STORY_EN = [
  'Nice to meet you, I am Chen Shaked, a professional mountain climber and the founder of HighAir. I discovered trekking and mountaineering after the army, in Nepal, where I fell in love with the disconnection that only high mountains can provide. Since then I have climbed Kazbek, Kilimanjaro, Gran Paradiso, Ama Dablam, Lobuche Peak and Island Peak, and in September 2025 I reached the summit of Manaslu, the eighth highest mountain in the world.',
  'But my real journey started at home. Five years ago my dear mother, Carol Shaked, passed away after a long battle with cancer, and from that moment I decided to dedicate my life to honouring her memory. At every summit I raise her flag, and the higher I climb, the closer I feel to her.',
];

export default function FounderSection() {
  const { i18n } = useTranslation();
  const { isMobile } = useBreakpoint();
  const isEn = i18n.language === 'en';
  const dir = isEn ? 'ltr' : 'rtl';

  const story = isEn ? STORY_EN : STORY_HE;
  const [ctaHover, setCtaHover] = useState(false);

  return (
    <section style={{
      background: 'transparent',
      padding:    isMobile ? '44px 5%' : '72px 5%',
      boxSizing:  'border-box',
      direction:  dir,
    }}>
      <div style={{
        maxWidth:      '1180px',
        margin:        '0 auto',
        display:       'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap:           isMobile ? '28px' : '56px',
        alignItems:    'center',
      }}>

        {/* ── Image + caption ── */}
        <div style={{
          flex:          isMobile ? '0 0 auto' : '1 1 0',
          width:         isMobile ? '100%' : 'auto',
          display:       'flex',
          flexDirection: 'column',
          gap:           '10px',
        }}>
          <div style={{
            width:        '100%',
            height:       isMobile ? '300px' : '460px',
            borderRadius: RADIUS.xl,
            overflow:     'hidden',
            boxShadow:    '0 12px 44px rgba(109,40,217,0.16)',
            background:   '#1a0a3a',
            position:     'relative',
          }}>
            <img
              src={MANASLU_IMG}
              alt={isEn ? 'Chen Shaked at the summit of Manaslu, 8163m' : 'חן שקד בפסגת הר מנסלו, 8,163 מ׳'}
              loading="lazy"
              decoding="async"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   '13px',
            fontWeight: 400,
            color:      '#9896B0',
            margin:     0,
            textAlign:  'center',
          }}>
            {isEn ? 'Chen Shaked at the summit of Manaslu, 8,163m, the world\'s 8th highest peak' : 'חן שקד בפסגת המנסלו, 8,163 מ׳, ההר השמיני בגובהו בעולם'}
          </p>
        </div>

        {/* ── Text: title + intro + CTA ── */}
        <div style={{ flex: isMobile ? '0 0 auto' : '1 1 0', display: 'flex', flexDirection: 'column', gap: '18px' }}>

          {/* Section title */}
          <h2 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      FS.h2,
            fontWeight:    700,
            color:         '#0A0818',
            margin:        0,
            letterSpacing: '-0.02em',
            lineHeight:    1.15,
            textAlign:     'start',
          }}>
            {isEn ? 'Our Story' : 'הסיפור שלנו'}
          </h2>

          {/* Intro */}
          {story.map((para, i) => (
            <p key={i} style={{
              fontFamily: "'Ploni', sans-serif",
              fontSize:   isMobile ? '15px' : '16px',
              fontWeight: 300,
              color:      '#3D3B52',
              margin:     0,
              lineHeight: 1.8,
              textAlign:  'start',
            }}>
              {para}
            </p>
          ))}

          {/* CTA */}
          <a
            href="/about"
            onClick={() => Analytics?.clickCTA?.('founder_story', 'home_founder')}
            onMouseEnter={() => setCtaHover(true)}
            onMouseLeave={() => setCtaHover(false)}
            style={{
              alignSelf:     'center',
              display:       'inline-flex',
              alignItems:    'center',
              gap:           '8px',
              marginTop:     '6px',
              padding:       '13px 28px',
              borderRadius:  RADIUS.full,
              background:    ctaHover ? '#7C3AED' : COLOR.primary,
              color:         '#FFFFFF',
              fontFamily:    "'Ploni', sans-serif",
              fontSize:      FS.btn,
              fontWeight:    700,
              textDecoration:'none',
              boxShadow:     ctaHover ? '0 10px 28px rgba(109,40,217,0.45)' : '0 4px 16px rgba(109,40,217,0.3)',
              transform:     ctaHover ? 'translateY(-2px)' : 'none',
              transition:    `all 0.22s ${EASING.out}`,
            }}
          >
            {isEn ? 'Meet our team' : 'הכירו את הצוות שלנו'}
          </a>

        </div>
      </div>
    </section>
  );
}
