/**
 * PrivacyPolicy.jsx — מדיניות פרטיות
 */
import { useEffect } from 'react';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import { FS } from '../../website/theme.js';

const SECTION_STYLE = { marginBottom: '36px' };

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
  fontFamily:   "'Ploni', sans-serif",
  fontSize:     FS.body,
  color:        '#3D3B5A',
  lineHeight:   1.85,
  marginBottom: '6px',
};

export default function PrivacyPolicy() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '120px 5% 80px' }}>

        <h1 style={{ fontFamily: "'Ploni', sans-serif", fontSize: FS.h1, fontWeight: 700, color: '#0A0818', margin: '0 0 8px', letterSpacing: '-0.02em' }}>
          מדיניות פרטיות
        </h1>
        <p style={{ ...P_STYLE, color: '#9591B0', marginBottom: '48px' }}>עודכן לאחרונה: אפריל 2025</p>

        <div style={SECTION_STYLE}>
          <p style={P_STYLE}>
            ברוכים הבאים לאתר HighAir Expeditions (להלן: "האתר").
            הפרטיות שלכם חשובה לנו, ומסמך זה נועד להסביר אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם, ואילו זכויות עומדות לרשותכם.
          </p>
        </div>

        {/* 1 */}
        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>1. איסוף מידע אישי</h2>
          <p style={P_STYLE}>במסגרת השימוש באתר והשירותים שלנו נאסף מידע אישי שמסרתם מרצונכם, לרבות:</p>
          <ul style={{ paddingRight: '20px', margin: '0 0 16px' }}>
            {[
              'שם מלא',
              'כתובת דוא"ל',
              'מספר טלפון',
              'פרטי תשלום (באמצעות חברת סליקה חיצונית)',
              'מידע נוסף שמסרתם בטפסי הרשמה לטרקים/טיפוסים/טיולים',
            ].map((item, i) => <li key={i} style={LI_STYLE}>{item}</li>)}
          </ul>
          <p style={P_STYLE}>האיסוף מתבצע באמצעות:</p>
          <ul style={{ paddingRight: '20px', margin: '0 0 12px' }}>
            {[
              'טפסי הרשמה באתר',
              'מערכת צ\'אט / וואטסאפ עסקי',
              'חנות מקוונת ותשלום לטיולים',
              'אפליקציה/מערכת לקביעת פגישות',
              'קמפיינים פרסומיים (פייסבוק, אינסטגרם, גוגל וכד\')',
            ].map((item, i) => <li key={i} style={LI_STYLE}>{item}</li>)}
          </ul>
          <p style={P_STYLE}>בנוסף, האתר עושה שימוש בכלי ניתוח סטטיסטיים כגון Google Analytics ופלטפורמות פרסום נוספות.</p>
        </div>

        {/* 2 */}
        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>2. מטרות השימוש במידע</h2>
          <p style={P_STYLE}>המידע שנאסף משמש אותנו לצורך:</p>
          <ul style={{ paddingRight: '20px', margin: '0 0 12px' }}>
            {[
              'ניהול הרשמות לטרקים/טיפוסים/טיולים ותקשורת עם לקוחות',
              'טיפול בהזמנות ותשלומים',
              'מענה לפניות ובקשות',
              'מתן שירותים נוספים ותיאום מפגשי הכנה',
              'שליחת עדכונים, תוכן מקצועי, מידע על מסעות עתידיים ודיוור שיווקי – רק למי שנתן הסכמה מפורשת לכך!',
            ].map((item, i) => <li key={i} style={LI_STYLE}>{item}</li>)}
          </ul>
        </div>

        {/* 3 */}
        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>3. שיתוף מידע עם צדדים שלישיים</h2>
          <ul style={{ paddingRight: '20px', margin: '0 0 12px' }}>
            {[
              'פרטי תשלום מועברים לחברת סליקה חיצונית בלבד לצורך ביצוע העסקה.',
              'מידע סטטיסטי עשוי להישלח ל־Google Analytics ולמערכות פרסום לצורך שיפור חוויית המשתמש וקמפיינים.',
              'אנו לא נעביר מידע אישי לצדדים שלישיים נוספים ללא הסכמתכם המפורשת, אלא אם חלה עלינו חובה חוקית.',
            ].map((item, i) => <li key={i} style={LI_STYLE}>{item}</li>)}
          </ul>
        </div>

        {/* 4 */}
        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>4. שמירת מידע</h2>
          <p style={P_STYLE}>
            המידע האישי נשמר במערכות האתר ובמערכות CRM פנימיות לצורך ניהול הפעילות. ניתן לבקש מחיקה או עדכון של מידע אישי בכל עת.
          </p>
        </div>

        {/* 5 */}
        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>5. אבטחת מידע</h2>
          <ul style={{ paddingRight: '20px', margin: '0 0 12px' }}>
            {[
              'האתר מאובטח באמצעות פרוטוקול SSL.',
              'אנו נוקטים צעדים סבירים ומקובלים להגנה על המידע האישי ומניעת גישה לא מורשית.',
            ].map((item, i) => <li key={i} style={LI_STYLE}>{item}</li>)}
          </ul>
        </div>

        {/* 6 */}
        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>6. זכויות המשתמש</h2>
          <p style={P_STYLE}>
            בהתאם לחוק הגנת הפרטיות ולתיקון 13 החדש (בתוקף מאוגוסט 2025), עומדות לכם הזכויות הבאות:
          </p>
          <ul style={{ paddingRight: '20px', margin: '0 0 16px' }}>
            {[
              'לעיין במידע שנאסף עליכם',
              'לבקש תיקון/עדכון מידע שגוי',
              'לבקש מחיקה של מידע',
              'להסיר עצמכם מרשימת התפוצה בכל עת',
            ].map((item, i) => <li key={i} style={LI_STYLE}>{item}</li>)}
          </ul>
          <p style={P_STYLE}>למימוש זכויות אלו ניתן לפנות אלינו במייל או בטלפון המופיעים מטה.</p>
        </div>

        {/* 7 */}
        <div style={SECTION_STYLE}>
          <h2 style={H2_STYLE}>7. עדכונים במדיניות</h2>
          <p style={P_STYLE}>
            מדיניות זו עשויה להתעדכן מעת לעת, עדכון מהותי יפורסם באתר ויישלח למשתמשים הרלוונטיים.
          </p>
        </div>

        {/* 8 — Contact box */}
        <div style={{ ...SECTION_STYLE, background: '#F8F6FF', borderRadius: '16px', padding: '28px 32px' }}>
          <h2 style={{ ...H2_STYLE, marginBottom: '16px' }}>8. פרטי קשר</h2>
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
