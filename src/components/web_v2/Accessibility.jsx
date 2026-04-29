/**
 * Accessibility.jsx - הצהרת נגישות / Accessibility Statement
 */
import { useTranslation } from 'react-i18next';
import LegalPageLayout, { SECTION, H2, P, LI, UL, CONTACT_BOX, LINK } from './LegalPageLayout.jsx';

export default function Accessibility() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';

  return (
    <LegalPageLayout title={isRtl ? 'הצהרת נגישות' : 'Accessibility Statement'}>
      {isRtl ? (
        <>
          <div style={SECTION}>
            <p style={P}>
              ברוכים הבאים לאתר HighAir Expeditions (להלן: "האתר").
              אנו מייחסים חשיבות רבה להתאמת שירותינו לאנשים עם מוגבלויות שונות, בין השאר מתוך תפיסת עולם לפיה יש לאפשר לכל בני האדם הזדמנות שווה ונגישות לשירות ולמידע. בהתאם לאמור, אנו משקיעים משאבים רבים בהנגשת אתר האינטרנט ועמודיו, תוך שאנו מוצאים חשיבות עליונה במתן שירות שוויוני לכלל גולשי האתר, לרבות לאנשים עם מוגבלויות.
            </p>
            <p style={P}>
              אתר זה עומד בדרישות תקנות שיוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג 2013.
            </p>
            <p style={P}>
              התאמות הנגישות בוצעו עפ"י המלצות התקן הישראלי (ת"י 5568) לנגישות תכנים באינטרנט ברמת AA ומסמך WCAG 2.0 הבינלאומי. תקן זה מתבסס על מסמך הקווים המנחים של הארגון הבינלאומי העוסק בתקינה ברשת - Web Content Accessibility Guidelines (WCAG) 2.0.
            </p>
            <p style={P}>
              האתר תומך בכל הדפדפנים הפופולריים כגון: Internet Explorer 10 ומעלה, Google Chrome, Mozilla Firefox.
              האתר מותאם לגלישה מנייד. אתר זה נגיש ומותאם לצפייה גם לאנשים בעלי מוגבלות ומאפשר תמיכה בתוכנת קריאת מסך ובטכנולוגיות נוספות המאפשרות הנגשת תכנים.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>1. התאמות שבוצעו באתר</h2>
            <p style={P}>על מנת לעמוד בדרישות תקן הנגישות, בוצעו באתר מספר התאמות:</p>
            <ul style={UL}>
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
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>2. ניווט באמצעות מקלדת</h2>
            <p style={P}>כל הפעולות באתר ניתנות לביצוע באמצעות המקלדת:</p>
            <ul style={UL}>
              {[
                'העברה לקישור הבא בדף - TAB',
                'הפעלת קישור - ENTER',
                'חזרה לקישור קודם - SHIFT + TAB',
                'הגדלת הגופן - Ctrl +',
                'הקטנת הגופן - Ctrl -',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={CONTACT_BOX}>
            <h2 style={{ ...H2, marginBottom: '16px' }}>3. יצירת קשר בנושא נגישות</h2>
            <p style={P}>
              במידה ונתקלתם בנושאים הדורשים הנגשה נוספת, מוזמנים לפנות אלינו:
            </p>
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
              We attach great importance to adapting our services to people with various disabilities, partly from a worldview that all people should be afforded equal opportunity and access to services and information. Accordingly, we invest significant resources in making the website and its pages accessible, placing paramount importance on providing equal service to all site visitors, including people with disabilities.
            </p>
            <p style={P}>
              This site complies with the requirements of the Equal Rights for Persons with Disabilities Regulations (Accessibility Adjustments for Services), 5773-2013.
            </p>
            <p style={P}>
              The accessibility adjustments were carried out in accordance with the recommendations of the Israeli Standard (IS 5568) for web content accessibility at the AA level and the international WCAG 2.0 document. This standard is based on the Web Content Accessibility Guidelines (WCAG) 2.0 of the international standards organization for the web.
            </p>
            <p style={P}>
              The site supports all popular browsers such as: Internet Explorer 10 and above, Google Chrome, Mozilla Firefox.
              The site is adapted for mobile browsing. This site is accessible and adapted for viewing by people with disabilities and supports screen reader software and additional technologies that enable content accessibility.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>1. Adjustments Made to the Site</h2>
            <p style={P}>In order to meet accessibility standard requirements, several adjustments have been made to the site:</p>
            <ul style={UL}>
              {[
                'Heading label - placement of a primary heading on each page defined as H1',
                'Operation via keyboard shortcuts of screen reader software',
                'Maintaining contrast between text and background according to the required standard, option to view the site in black and white',
                'Maintaining clear hierarchy and visibility',
                'Option for shortcuts and quick search on the site',
                'Option for "skip blocks" and quick access to main content',
                'Use of clear and easy-to-fill forms + clear error messages',
                'Use of clear and easy-to-read fonts',
                'Use of links with explanations about the nature of the link',
                'Maintaining a clean and clear menu, easy to navigate',
                'Site language definition - the site is automatically processed by browsers in the correct language so screen readers can understand the content',
                'DOM order - enables site navigation using keyboard and screen readers',
                'ARIA attributes - built-in aria attributes providing an accessible and enriched user experience',
                'Two navigation options on the site - menu and search',
                'Alt text - textual descriptions of images that assist visually impaired users',
                'Full keyboard browsing functionality - defining navigation and operation with keyboard only in accordance with the recommendations of the international organization (W3C)',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>2. Keyboard Navigation</h2>
            <p style={P}>All actions on the site can be performed via keyboard:</p>
            <ul style={UL}>
              {[
                'Move to next link on page - TAB',
                'Activate a link - ENTER',
                'Return to previous link - SHIFT + TAB',
                'Increase font size - Ctrl +',
                'Decrease font size - Ctrl -',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={CONTACT_BOX}>
            <h2 style={{ ...H2, marginBottom: '16px' }}>3. Contact Us Regarding Accessibility</h2>
            <p style={P}>
              If you encounter issues that require further accessibility, you are welcome to contact us:
            </p>
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
