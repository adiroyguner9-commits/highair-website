/**
 * CancellationPolicy.jsx - מדיניות ביטול / Cancellation Policy
 */
import { useTranslation } from 'react-i18next';
import LegalPageLayout, { SECTION, H2, P, LI, UL } from './LegalPageLayout.jsx';

export default function CancellationPolicy() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';

  return (
    <LegalPageLayout title={isRtl ? 'מדיניות ביטולים' : 'Cancellation Policy'}>
      {isRtl ? (
        <>
          <div style={SECTION}>
            <p style={P}>
              בשל הנסיבות המיוחדות עקב המצב הביטחוני, אנו נאפשר ביטולים חריגים תוך התחשבות מרבית במצבם של הלקוחות.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>1. מדיניות ביטולים מצד הלקוח</h2>
            <ul style={UL}>
              {[
                '60 יום לפני היציאה - החזר מקדמה בניכוי 15% מעלות הטיול.',
                'בין 1-59 יום לפני היציאה - אין החזר מקדמה.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>
              ניתן לשמור את המקדמה ששולמה כקרדיט לשימוש עתידי ללא דמי ביטול!
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>2. מדיניות ביטולים מהצד שלנו</h2>
            <ul style={UL}>
              {[
                'במקרה של ביטול עקב כוח עליון כגון מניעה לצאת מהארץ בעקבות הסלמה ביטחונית או סגירת השמיים - הטיול יידחה למועד אחר, והכספים ששולמו יועברו במלואם למועד החדש או ליעד חלופי לבחירת הלקוח, ללא הגבלת זמן.',
                'במקרה של ביטול מכל סיבה אחרת שאינה כוח עליון - יבוצע החזר מקדמה מלא ללקוח.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>3. מקרי קיצון ושכול בעקבות המצב הביטחוני</h2>
            <p style={P}>
              במקרים קיצוניים אלו, נפעל תוך התחשבות ברורה בנסיבות ו/או דחייה למועד אחר, ו/או החזר כספי מלא.
            </p>
          </div>
        </>
      ) : (
        <>
          <div style={SECTION}>
            <p style={P}>
              Due to the special circumstances arising from the security situation, we will allow exceptional cancellations with maximum consideration for our customers' situation.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>1. Customer Cancellation Policy</h2>
            <ul style={UL}>
              {[
                '60 days before departure - refund of advance payment minus 15% of the trip cost.',
                'Between 1-59 days before departure - no advance payment refund.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>
              You may keep your advance payment as credit for future use with no cancellation fee!
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>2. Cancellation by HighAir</h2>
            <ul style={UL}>
              {[
                'In the event of cancellation due to force majeure such as being prevented from leaving the country following a security escalation or airspace closure - the trip will be postponed to another date, and all payments made will be transferred in full to the new date or an alternative destination of the customer\'s choice, with no time limit.',
                'In the event of cancellation for any other reason that is not force majeure - a full advance payment refund will be issued to the customer.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>3. Extreme Cases and Bereavement Due to the Security Situation</h2>
            <p style={P}>
              In such extreme cases, we will act with clear consideration of the circumstances, and/or postponement to another date, and/or a full refund.
            </p>
          </div>
        </>
      )}
    </LegalPageLayout>
  );
}
