/**
 * PrivacyPolicy.jsx - מדיניות פרטיות / Privacy Policy
 */
import { useTranslation } from 'react-i18next';
import LegalPageLayout, { SECTION, H2, P, LI, UL, CONTACT_BOX, LINK } from './LegalPageLayout.jsx';

export default function PrivacyPolicy() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';

  return (
    <LegalPageLayout title={isRtl ? 'מדיניות פרטיות' : 'Privacy Policy'}>
      {isRtl ? (
        <>
          <div style={SECTION}>
            <p style={P}>
              ברוכים הבאים לאתר HighAir Expeditions (להלן: "האתר").
              הפרטיות שלכם חשובה לנו, ומסמך זה נועד להסביר אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם, ואילו זכויות עומדות לרשותכם.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>1. איסוף מידע אישי</h2>
            <p style={P}>במסגרת השימוש באתר והשירותים שלנו נאסף מידע אישי שמסרתם מרצונכם, לרבות:</p>
            <ul style={UL}>
              {[
                'שם מלא',
                'כתובת דוא"ל',
                'מספר טלפון',
                'פרטי תשלום (באמצעות חברת סליקה חיצונית)',
                'מידע נוסף שמסרתם בטפסי הרשמה לטרקים/טיפוסים/טיולים',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>האיסוף מתבצע באמצעות:</p>
            <ul style={UL}>
              {[
                'טפסי הרשמה באתר',
                "מערכת צ'אט / וואטסאפ עסקי",
                'חנות מקוונת ותשלום לטיולים',
                'אפליקציה/מערכת לקביעת פגישות',
                "קמפיינים פרסומיים (פייסבוק, אינסטגרם, גוגל וכד')",
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>בנוסף, האתר עושה שימוש בכלי ניתוח סטטיסטיים כגון Google Analytics ופלטפורמות פרסום נוספות.</p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>2. מטרות השימוש במידע</h2>
            <p style={P}>המידע שנאסף משמש אותנו לצורך:</p>
            <ul style={UL}>
              {[
                'ניהול הרשמות לטרקים/טיפוסים/טיולים ותקשורת עם לקוחות',
                'טיפול בהזמנות ותשלומים',
                'מענה לפניות ובקשות',
                'מתן שירותים נוספים ותיאום מפגשי הכנה',
                'שליחת עדכונים, תוכן מקצועי, מידע על מסעות עתידיים ודיוור שיווקי - רק למי שנתן הסכמה מפורשת לכך!',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>3. שיתוף מידע עם צדדים שלישיים</h2>
            <ul style={UL}>
              {[
                'פרטי תשלום מועברים לחברת סליקה חיצונית בלבד לצורך ביצוע העסקה.',
                'מידע סטטיסטי עשוי להישלח ל־Google Analytics ולמערכות פרסום לצורך שיפור חוויית המשתמש וקמפיינים.',
                'אנו לא נעביר מידע אישי לצדדים שלישיים נוספים ללא הסכמתכם המפורשת, אלא אם חלה עלינו חובה חוקית.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>4. שמירת מידע</h2>
            <p style={P}>
              המידע האישי נשמר במערכות האתר ובמערכות CRM פנימיות לצורך ניהול הפעילות. ניתן לבקש מחיקה או עדכון של מידע אישי בכל עת.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>5. אבטחת מידע</h2>
            <ul style={UL}>
              {[
                'האתר מאובטח באמצעות פרוטוקול SSL.',
                'אנו נוקטים צעדים סבירים ומקובלים להגנה על המידע האישי ומניעת גישה לא מורשית.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>6. זכויות המשתמש</h2>
            <p style={P}>
              בהתאם לחוק הגנת הפרטיות ולתיקון 13 החדש (בתוקף מאוגוסט 2025), עומדות לכם הזכויות הבאות:
            </p>
            <ul style={UL}>
              {[
                'לעיין במידע שנאסף עליכם',
                'לבקש תיקון/עדכון מידע שגוי',
                'לבקש מחיקה של מידע',
                'להסיר עצמכם מרשימת התפוצה בכל עת',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>למימוש זכויות אלו ניתן לפנות אלינו במייל או בטלפון המופיעים מטה.</p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>7. עדכונים במדיניות</h2>
            <p style={P}>
              מדיניות זו עשויה להתעדכן מעת לעת, עדכון מהותי יפורסם באתר ויישלח למשתמשים הרלוונטיים.
            </p>
          </div>

          <div style={CONTACT_BOX}>
            <h2 style={{ ...H2, marginBottom: '16px' }}>8. פרטי קשר</h2>
            <p style={{ ...P, margin: 0 }}>
              <strong>שם החברה:</strong> HighAir Expeditions<br />
              <strong>דוא"ל:</strong>{' '}
              <a href="mailto:info@highair-expeditions.com" style={LINK}>info@highair-expeditions.com</a><br />
              <strong>טלפון:</strong>{' '}
              <a href="tel:+972555636975" style={LINK}>055-563-6975</a>
            </p>
          </div>
        </>
      ) : (
        <>
          <div style={SECTION}>
            <p style={P}>
              Welcome to the HighAir Expeditions website (hereinafter: "the Site").
              Your privacy is important to us, and this document is intended to explain what data we collect, how we use it, and what rights are available to you.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>1. Collection of Personal Information</h2>
            <p style={P}>As part of using the site and our services, personal information that you have voluntarily provided is collected, including:</p>
            <ul style={UL}>
              {[
                'Full name',
                'Email address',
                'Phone number',
                'Payment details (via an external payment processor)',
                'Additional information provided in registration forms for treks/climbs/trips',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>Collection is carried out via:</p>
            <ul style={UL}>
              {[
                'Registration forms on the site',
                'Chat / WhatsApp Business system',
                'Online store and payment for trips',
                'Application/appointment scheduling system',
                'Advertising campaigns (Facebook, Instagram, Google, etc.)',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>In addition, the site uses statistical analysis tools such as Google Analytics and additional advertising platforms.</p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>2. Purposes of Use of Information</h2>
            <p style={P}>The information collected is used by us for:</p>
            <ul style={UL}>
              {[
                'Managing registrations for treks/climbs/trips and communicating with customers',
                'Processing orders and payments',
                'Responding to inquiries and requests',
                'Providing additional services and coordinating preparation meetings',
                'Sending updates, professional content, information about future expeditions, and marketing communications - only to those who have given explicit consent!',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>3. Sharing Information with Third Parties</h2>
            <ul style={UL}>
              {[
                'Payment details are transferred exclusively to an external payment processor for the purpose of completing the transaction.',
                'Statistical information may be sent to Google Analytics and advertising systems for the purpose of improving user experience and campaigns.',
                'We will not transfer personal information to additional third parties without your explicit consent, unless we are legally obligated to do so.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>4. Data Retention</h2>
            <p style={P}>
              Personal information is stored in the site's systems and in internal CRM systems for operational management. You may request deletion or update of personal information at any time.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>5. Information Security</h2>
            <ul style={UL}>
              {[
                'The site is secured using SSL protocol.',
                'We take reasonable and accepted measures to protect personal information and prevent unauthorized access.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>6. User Rights</h2>
            <p style={P}>
              In accordance with the Privacy Protection Law and Amendment 13 (effective August 2025), you have the following rights:
            </p>
            <ul style={UL}>
              {[
                'To review the information collected about you',
                'To request correction/update of incorrect information',
                'To request deletion of information',
                'To unsubscribe from the mailing list at any time',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>To exercise these rights, please contact us by email or phone listed below.</p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>7. Policy Updates</h2>
            <p style={P}>
              This policy may be updated from time to time. A material update will be published on the site and sent to relevant users.
            </p>
          </div>

          <div style={CONTACT_BOX}>
            <h2 style={{ ...H2, marginBottom: '16px' }}>8. Contact Details</h2>
            <p style={{ ...P, margin: 0 }}>
              <strong>Company Name:</strong> HighAir Expeditions<br />
              <strong>Email:</strong>{' '}
              <a href="mailto:info@highair-expeditions.com" style={LINK}>info@highair-expeditions.com</a><br />
              <strong>Phone:</strong>{' '}
              <a href="tel:+972555636975" style={LINK}>055-563-6975</a>
            </p>
          </div>
        </>
      )}
    </LegalPageLayout>
  );
}
