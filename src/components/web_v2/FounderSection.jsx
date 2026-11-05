/**
 * FounderSection.jsx — Homepage "מי אנחנו" block.
 * Title + Chen's story (intro) + Manaslu summit image + CTA to the About page.
 * Chen is a professional mountain climber (NOT a "guide").
 */

import { tx, currentLang } from '../../website/lang.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RADIUS, COLOR, FS, EASING } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { Analytics } from '../../utils/analytics.js';

const MANASLU_IMG = '/images/about-story.avif';

const STORY_HE = [
  'נעים להכיר, אני חן שקד, מטפס הרים מקצועי ומייסד HighAir ביחד עם חבר ילדותי, אדיר אויגונר. את עולם הטרקים וטיפוסי ההרים פגשתי לראשונה אחרי הצבא בנפאל, שם התאהבתי בנופים ובניתוק שרק ההרים יכולים לספק. מאז טיפסתי על הקזבק, הקילימנג׳רו, גראן פרדיסו, אמא דאבלם, לובוצ׳ה פיק ואיילנד פיק, ובספטמבר 2025 העפלתי אל פסגת המנסלו, ההר השמיני בגובהו בעולם.',
  'אבל המסע האמיתי שלי התחיל בבית. לפני חמש שנים אימי היקרה, קרול שקד ז״ל, נפטרה לאחר מאבק ממושך בסרטן, ומאותו הרגע החלטתי להקדיש את חיי להנצחתה. בכל פסגה אני מניף את דגלה, וככל שאני עולה גבוה יותר, אני מרגיש קרוב אליה יותר.',
  'בהשראת הנתינה של אמא, חלק מכל מסע שאנחנו מוציאים מוקדש לתמיכה בחולי סרטן בישראל ולהגשמת חלומות של ילדים שמתמודדים עם המחלה. ככה כל פסגה שאתם מטפסים הופכת גם לדרך לתת.',
];
const STORY_EN = [
  'Nice to meet you, I am Chen Shaked, a professional mountain climber and the founder of HighAir together with my childhood friend, Adir Oyguner. I discovered trekking and mountaineering after the army, in Nepal, where I fell in love with the disconnection that only high mountains can provide. Since then I have climbed Kazbek, Kilimanjaro, Gran Paradiso, Ama Dablam, Lobuche Peak and Island Peak, and in September 2025 I reached the summit of Manaslu, the eighth highest mountain in the world.',
  'But my real journey started at home. Five years ago my dear mother, Carol Shaked, passed away after a long battle with cancer, and from that moment I decided to dedicate my life to honouring her memory. At every summit I raise her flag, and the higher I climb, the closer I feel to her.',
  'Inspired by my mother\'s spirit of giving, part of every trip we run is dedicated to supporting cancer patients and to making the dreams of children facing the illness come true. That way, every summit you climb also becomes a way to give.',
];

/* German and Spanish (de. / es., 5 Nov 2026) */
const STORY_I18N = {
  de: [
    'Schön, Sie kennenzulernen, ich bin Chen Shaked, professioneller Bergsteiger und Gründer von HighAir, zusammen mit meinem Freund aus Kindertagen, Adir Oyguner. Trekking und Bergsteigen habe ich nach dem Militärdienst in Nepal entdeckt, wo ich mich in das Abschalten verliebt habe, das nur hohe Berge schenken. Seitdem habe ich den Kasbek, den Kilimandscharo, den Gran Paradiso, die Ama Dablam, den Lobuche Peak und den Island Peak bestiegen, und im September 2025 stand ich auf dem Gipfel des Manaslu, des achthöchsten Bergs der Welt.',
    'Doch meine eigentliche Reise begann zu Hause. Vor fünf Jahren starb meine geliebte Mutter, Carol Shaked, nach langem Kampf gegen den Krebs, und von diesem Moment an habe ich beschlossen, mein Leben ihrem Andenken zu widmen. Auf jedem Gipfel hisse ich ihre Flagge, und je höher ich steige, desto näher fühle ich mich ihr.',
    'Inspiriert von der Großzügigkeit meiner Mutter widmen wir einen Teil jeder Reise der Unterstützung von Krebspatienten und der Erfüllung von Träumen krebskranker Kinder. So wird jeder Gipfel, den Sie besteigen, auch zu einer Möglichkeit zu geben.',
  ],
  es: [
    'Encantado de conocerte, soy Chen Shaked, montañero profesional y fundador de HighAir junto con mi amigo de la infancia, Adir Oyguner. Descubrí el trekking y el montañismo después del servicio militar, en Nepal, donde me enamoré de la desconexión que solo dan las grandes montañas. Desde entonces he subido el Kazbek, el Kilimanjaro, el Gran Paradiso, el Ama Dablam, el Lobuche Peak y el Island Peak, y en septiembre de 2025 llegué a la cumbre del Manaslu, la octava montaña más alta del mundo.',
    'Pero mi verdadero viaje empezó en casa. Hace cinco años, mi querida madre, Carol Shaked, falleció tras una larga lucha contra el cáncer, y desde ese momento decidí dedicar mi vida a honrar su memoria. En cada cumbre levanto su bandera, y cuanto más alto subo, más cerca me siento de ella.',
    'Inspirados por la generosidad de mi madre, parte de cada viaje que organizamos se dedica a apoyar a pacientes con cáncer y a cumplir los sueños de niños que se enfrentan a la enfermedad. Así, cada cumbre que subes se convierte también en una forma de dar.',
  ],
};

export default function FounderSection() {
  const { i18n } = useTranslation();
  const { isMobile } = useBreakpoint();
  const isEn = i18n.language !== 'he';
  const dir = isEn ? 'ltr' : 'rtl';

  const story = isEn ? (STORY_I18N[currentLang()] || STORY_EN) : STORY_HE;
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
              alt={isEn ? tx("Chen Shaked at the summit of Manaslu, 8163m") : 'חן שקד בפסגת הר מנסלו, 8,163 מ׳'}
              loading="lazy"
              decoding="async"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
            />
          </div>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   '13px',
            fontWeight: 400,
            color:      '#6B6B8A',
            margin:     0,
            textAlign:  'center',
          }}>
            {isEn ? tx(
              "Chen Shaked at the summit of Manaslu, 8,163m, the world's 8th highest peak"
            ) : 'חן שקד בפסגת המנסלו, 8,163 מ׳, ההר השמיני בגובהו בעולם'}
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
            {isEn ? tx("Our Story") : 'הסיפור שלנו'}
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
            {isEn ? tx("Meet our team") : 'הכירו את הצוות שלנו'}
          </a>

        </div>
      </div>
    </section>
  );
}
