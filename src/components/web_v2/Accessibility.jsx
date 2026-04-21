/**
 * Accessibility.jsx — הצהרת נגישות
 */
import { useEffect } from 'react';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import { FS } from '../../website/theme.js';

const SECTION_STYLE = {
  marginBottom: '36px',
};

const H2_STYLE = {
  fontFamily:    "'Ploni', sans-serif",
  fontSize:      '22px',
  fontWeight:    700,
  color:         '#0A0818',
  margin:        '0 0 14px',
  letterSpacing: '-0.01em',
};

const P_STYLE = {
  fontFamily: "'Ploni', sans-serif",
  fontSize:   FS.body,
  color:      '#3D3B5A',
  lineHeight: 1.85,
  margin:     '0 0 12px',
};

const LI_STYLE = {
  fontFamily:  "'Ploni', sans-serif",
  fontSize:    FS.body,
  color:       '#3D3B5A',
  lineHeight:  1.85,
  marginBottom: '6px',
};

export default function Accessibility() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 5% 80px' }}>

        <h1 style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.h1, fontWeight: 700, color: '#0A0818', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          הצהרת נגישות
        </h1>
        <p style={{ ...P_STYLE, color: '#9591B0', marginBottom: '48px' }}>עודכן לאחרונה: אפריל 2025</p>

        <div style={SECTION_STYLE}>
          <p style={P_STYLE}>
            ברוכים הבאים לאתר HighAir Expeditions (להלן: "האתר").
            אנו מייחסים חשיבות רבה להתאמת שירותינו לאנשים עם מוגבלויות שונות, בין השאר מתוך תפיסת עולם לפיה יש לאפשר לכל בני האדם הזדמנות שווה ונגישות לשירות ולמידע. בהתאם לאמור, אנו משקיעים משאבים רבים בהנגשת אתר האינטרנט ועמודיו, תוך שאנו מוצאים חשיבות עליונה במתן שירות שוויוני לכלל גולשי האתר, לרבות לאנשים עם מוגבלויות.
          </p>
          <p style={P_STYLE}>
            אתר זה עומד בדרישות תקנות שיוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג 2013.
          </p>
          <p style={P_STYLE}>
            התאמות הנגישות בוצעו עפ"י המלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA ומסמך WCAG 2.0 הבינלאומי. תקן זה מתבסס על מסמך הקווים המנחים של הארגון הבינלאומי העוסק בתקינה ברשת – Web Content Accessibility Guidelines (WCAG) 2.0.
          </p>
          <p style={P_STYLE}>
            האתר תומך בכל הדפדפנים הפופולריים כגון: Internet Explorer 10 ומעלה, Google Chrome, Mozilla Firefox.
            האתר מותאם לגלישה מנייד. אתר זה נגיש ומותאם לצפייה גם לאנשים בעלי מוגבלות ומאפשר תמיכה בתוכנת קריאת מסך ובטכנולוגיות נוספות המאפשרות הנגשת תכנים.
          </p>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>התאמות שבוצעו באתר</h2>
          <p style={P_STYLE}>על מנת לעמוד בדרישות תקן הנגישות, בוצעו באתר מספר התאמות:</p>
          <ul style={{ paddingRight: '20px', margin: '0 0 12px' }}>
            {[
              'תווית כותרת - הצבת כותרת ראשית בכל עמוד המוגדרת H1',
              'תפעול באמצעות מקשי קיצור של תוכנות קריאת מסך',
              'שמירה על ניגודיות בין טקסט לרקע על פי התקן המבוקש, אפשרות לצפייה באתר בגווני שחור לבן',
              'שמירה על היררכיה ונראות ברורה',
              'אפשרות לקיצורי דרך ולחיפוש מהיר באתר',
              'אפשרות ל״מעקף בלוקים״ והגעה מקוצרת לתוכן מרכזי',
              'שימוש בטפסים ברורים וקלים למילוי + הודעות שגיאה ברורות',
              'שימוש בפונטים ברורים וקלים לקריאה',
              'שימוש בלינקים עם הסבר לגבי מהות הלינק',
              'שמירה על תפריט נקי וברור, קל לניווט',
              'הגדרת שפת האתר - האתר מעובד באופן אוטומטי ע"י הדפדפנים לשפה הנכונה כדי שקוראי המסך יוכלו להבין את התוכן',
              'סדר DOM - מאפשר ניווט באתר בשימוש מקלדת וקוראי מסך',
              'תכונות ARIA - תכונות aria מובנות המספקות חוויית משתמש נגישה ומועשרת',
              'שתי אפשרויות ניווט באתר - תפריט וחיפוש',
              'Alt טקסט - תיאורים טקסטואליים של תמונות המסייעים למשתמשים לקויי ראייה',
              'פונקציונליות מלאה של גלישה באמצעות המקלדת - קביעת ניווט והפעלה עם מקלדת בלבד עפ"י המלצות הארגון הבינלאומי (W3C)',
            ].map((item, i) => (
              <li key={i} style={LI_STYLE}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>ניווט באמצעות מקלדת</h2>
          <p style={P_STYLE}>כל הפעולות באתר ניתנות לביצוע באמצעות המקלדת:</p>
          <ul style={{ paddingRight: '20px', margin: '0 0 12px' }}>
            {[
              'העברה לקישור הבא בדף — TAB',
              'הפעלת קישור — ENTER',
              'חזרה לקישור קודם — SHIFT + TAB',
              'הגדלת הגופן — Ctrl +',
              'הקטנת הגופן — Ctrl −',
            ].map((item, i) => (
              <li key={i} style={LI_STYLE}>{item}</li>
            ))}
          </ul>
        </div>

        <div style={{ ...SECTION_STYLE, background: '#F8F6FF', borderRadius: '16px', padding: '28px 32px' }}>
          <h2 style={{ ...H2_STYLE, marginBottom: '16px' }}>יצירת קשר בנושא נגישות</h2>
          <p style={P_STYLE}>
            במידה ונתקלתם בנושאים הדורשים הנגשה נוספת, מוזמנים לפנות אלינו:
          </p>
          <p style={{ ...P_STYLE, margin: 0 }}>
            <strong>שם החברה:</strong> HighAir Expeditions<br />
            <strong>דוא"ל:</strong>{' '}
            <a href="mailto:info@highair-expeditions.com" style={{ color: '#6D28D9', textDecoration: 'none' }}>
              info@highair-expeditions.com
            </a><br />
            <strong>טלפון:</strong>{' '}
            <a href="tel:+972555636975" style={{ color: '#6D28D9', textDecoration: 'none' }}>
              055-563-6975
            </a>
          </p>
        </div>

      </div>
      <SiteFooter />
    </div>
  );
}
