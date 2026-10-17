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
              ברוכים הבאים לאתר ולאפליקציה של HighAir Expeditions (להלן: "האתר" ו"האפליקציה").
              הפרטיות שלכם חשובה לנו, ומסמך זה מסביר אילו נתונים אנו אוספים, כיצד אנו משתמשים בהם, עם מי הם משותפים ואילו זכויות עומדות לרשותכם.
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
            <p style={P}>לאחר ההרשמה למשלחת, ובאפליקציה, נאסף מידע הדרוש לקיום הטיול:</p>
            <ul style={UL}>
              {[
                'פרטים אישיים: שם מלא בעברית ובאנגלית (כפי שמופיע בדרכון), תאריך לידה, עיר מגורים, מידה לחולצה והעדפת מזון',
                'מידות לציוד, כשהטיול כולל השכרת ציוד (למשל גובה, משקל ומידת נעליים)',
                'פרטי איש קשר לחירום: שם וטלפון',
                'מסמכים שאתם מעלים: צילום דרכון, ויזה, כרטיס טיסה, פוליסת ביטוח נסיעות, אישור רפואי, תמונת פנים כשהיעד מחייב זאת, ותמונות מהטיול',
                'מידע רפואי: הצהרת בריאות, אלרגיות והערות רפואיות',
                'פרטי דרכון וחתימה: מספר דרכון, אזרחות ומקום מגורים בטפסים שהיעד מחייב (למשל באקונקגואה), ותמונת החתימה שלכם על הסכם ההשתתפות ועל טפסים אלה',
                'מצב התשלומים: מחיר הטיול והמקדמות ששולמו. פרטי אשראי אינם נאספים באפליקציה, והתשלום מתבצע בעמוד תשלום חיצוני',
                'מידע טכני על תקלות באפליקציה, ללא פרטים מזהים, כדי לאתר ולתקן שגיאות',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>האפליקציה אינה אוספת את מיקומכם, את אנשי הקשר בטלפון, היסטוריית גלישה או מזהי פרסום, ואינה כוללת כלי פרסום או מעקב.</p>
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
            <p style={P}>כדי לקיים את הטיול אנו משתפים מידע עם הגורמים הבאים, רק במידה הנדרשת:</p>
            <ul style={UL}>
              {[
                'המפעילים המקומיים ביעד (חברות הטרקים והטיפוס המקומיות): רשימת המשתתפים, פרטי דרכון ומידע רפואי הנחוץ לבטיחותכם בשטח',
                'סוכני הנסיעות שמנפיקים עבורכם כרטיס טיסה וביטוח נסיעות',
                'ספקי שירות שמפעילים עבורנו את המערכות: אחסון נתונים וקבצים (Airtable, Cloudinary), אירוח (Vercel), שליחת הודעות וואטסאפ ומיילים (Green API, Resend) וזיהוי תקלות (Sentry). ספקים אלה מעבדים את המידע עבורנו בלבד',
                'חברת סליקה חיצונית, לביצוע התשלום',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>מידע סטטיסטי מהאתר עשוי להישלח ל־Google Analytics ולמערכות פרסום לצורך שיפור חוויית המשתמש וקמפיינים.</p>
            <p style={P}>מלבד אלה, לא נעביר מידע אישי לצדדים שלישיים ללא הסכמתכם, אלא אם חלה עלינו חובה חוקית.</p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>4. שמירת מידע</h2>
            <p style={P}>
              המידע האישי נשמר במערכות האתר ובמערכות CRM פנימיות לצורך ניהול הפעילות. ניתן לבקש מחיקה או עדכון של מידע אישי בכל עת.
            </p>
            <p style={P}>
              ניתן להגיש בקשת מחיקה גם מתוך האפליקציה (Profile, Delete My Account) או בעמוד{' '}
              <a href="https://app.highair-expeditions.com/delete-account" style={LINK}>app.highair-expeditions.com/delete-account</a>.
              לאחר הבקשה נמחקים החשבון, הפרטים האישיים, המסמכים והמידע הרפואי. רשומות תשלום נשמרות כנדרש בחוק.
              אם הטיול שלכם עדיין לפניכם, הבקשה אינה מבטלת את ההזמנה: המידע הנחוץ לטיול נשמר עד סיומו, וצוות HighAir יצור עמכם קשר.
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
              <strong>שם החברה:</strong> היי אייר - טרקים וטיפוסי הרים בע״מ (HighAir Expeditions)<br />
              <strong>ח.פ.:</strong> 517393542<br />
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
              Welcome to the HighAir Expeditions website and app (hereinafter: "the Site" and "the App").
              Your privacy is important to us, and this document explains what data we collect, how we use it, who it is shared with, and what rights are available to you.
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
            <p style={P}>After you register for an expedition, and in the App, we collect the information needed to run the trip:</p>
            <ul style={UL}>
              {[
                'Personal details: full name in Hebrew and in English (as it appears in your passport), date of birth, city of residence, shirt size and food preference',
                'Equipment sizes, when the trip includes gear rental (for example height, weight and shoe size)',
                'Emergency contact: name and phone number',
                'Documents you upload: passport scan, visa, flight ticket, travel insurance policy, medical certificate, a face photo when the destination requires one, and photos from the trip',
                'Medical information: health declaration, allergies and medical notes',
                'Passport details and signature: passport number, nationality and place of residence on forms the destination requires (for example on Aconcagua), and the image of your signature on the participation agreement and on those forms',
                'Payment status: the trip price and the deposits paid. Card details are not collected in the App, and payment takes place on an external payment page',
                'Technical information about errors in the App, without identifying details, so we can find and fix faults',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>The App does not collect your location, the contacts on your phone, browsing history or advertising identifiers, and contains no advertising or tracking tools.</p>
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
            <p style={P}>To run the trip we share information with the following parties, only as far as needed:</p>
            <ul style={UL}>
              {[
                'The local operators at the destination (the local trekking and climbing companies): the participant list, passport details and the medical information needed for your safety in the field',
                'The travel agents who issue your flight ticket and travel insurance',
                'Service providers who run our systems for us: data and file storage (Airtable, Cloudinary), hosting (Vercel), sending WhatsApp messages and emails (Green API, Resend) and error tracking (Sentry). These providers process the information on our behalf only',
                'An external payment processor, to complete the payment',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>Statistical information from the Site may be sent to Google Analytics and advertising systems for the purpose of improving user experience and campaigns.</p>
            <p style={P}>Other than these, we will not transfer personal information to third parties without your consent, unless we are legally obligated to do so.</p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>4. Data Retention</h2>
            <p style={P}>
              Personal information is stored in the site's systems and in internal CRM systems for operational management. You may request deletion or update of personal information at any time.
            </p>
            <p style={P}>
              You can also request deletion from inside the App (Profile, Delete My Account) or on the page{' '}
              <a href="https://app.highair-expeditions.com/delete-account" style={LINK}>app.highair-expeditions.com/delete-account</a>.
              After the request, the account, personal details, documents and medical information are deleted. Payment records are kept as the law requires.
              If your trip is still ahead, the request does not cancel your booking: the information the trip needs is kept until it ends, and the HighAir team will contact you.
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
              <strong>Company Name:</strong> HighAir Expeditions (היי אייר - טרקים וטיפוסי הרים בע״מ)<br />
              <strong>Company No.:</strong> 517393542<br />
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
