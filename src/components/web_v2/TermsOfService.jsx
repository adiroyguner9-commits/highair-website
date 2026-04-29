/**
 * TermsOfService.jsx - תקנון ותנאי שימוש / Terms & Conditions
 */
import { useTranslation } from 'react-i18next';
import LegalPageLayout, { SECTION, H2, P, LI, UL, CONTACT_BOX, LINK } from './LegalPageLayout.jsx';

export default function TermsOfService() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';

  return (
    <LegalPageLayout title={isRtl ? 'תקנון ותנאי שימוש' : 'Terms & Conditions'}>
      {isRtl ? (
        <>
          <div style={SECTION}>
            <p style={P}>
              ברוכים הבאים לאתר HighAir Expeditions (להלן: "האתר").
              האתר מופעל ע"י חן שקד ואדיר אויגונר, ח.פ 558586087. האתר משמש כאתר תדמית ומסחר אלקטרוני ומציע, בין היתר, מידע ושירותים בנושאי טיולים, טרקים, טיפוסי הרים ומכירת מוצרים נלווים. HighAir Expeditions משמשת כמתווכת ומקשרת לכל אירועים או שירותים מאורגנים ומאושרים לטיפוס הרים, טיפוס צוקים, שהייה בגובה רב מעל פני המים, שהייה בתנאי קור קיצוני, הליכה מרובה, ריצה, טרקים על כל סוגיהם, שחייה, טיפוס, רכיבה, מחנאות, מעיינות חמים, פעילות תרבותית וכן שירותי שינוע ותחבורה ליעדים המבוקשים בארץ ובחו"ל.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>1. תנאים כלליים</h2>
            <ul style={UL}>
              {[
                'התקנון מתייחס באופן שווה לנשים וגברים; השימוש בלשון זכר מטעמי נוחות בלבד.',
                'הרשמה למסע תאושר רק לאחר חתימה על הסכם התקשרות.',
                'עצם ההתקשרות לשירות ו/או התוכן של החברה מהווים הסכמה לתנאי השימוש כמפורט להלן, לרבות תנאי מדיניות הפרטיות.',
                'תנאי השימוש ומדיניות הפרטיות מסדירים את היחסים בין הלקוח לבין החברה והם עשויים להשתנות מעת לעת, בהתאם לשיקול דעתה המלא והבלעדי של החברה.',
                'נוסח תנאי השימוש המחייב והקובע בכל מועד הוא זה המפורסם באתר החברה.',
                'HighAir עושה כמיטב יכולתה להציג את המידע השלם והמקיף ביותר לגבי המוצר; עם זאת, עלולים להופיע אי-דיוקים ו/או שגיאות ו/או השמטות בתום לב, והחברה לא תישא באחריות הנובעת מהם.',
                'תמונות המוצרים באתר מוצגות לצורכי המחשה בלבד.',
                'אין להעתיק ולהשתמש בתכנים מתוך האתר לכל מטרה אחרת ללא אישור מראש ובכתב.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>2. אחריות החברה</h2>
            <p style={P}>
              HighAir עושה כל שביכולתה על מנת לספק למשתמש חווית שימוש איכותית ובטוחה באתר. עם זאת, האתר אינו חסין מתקלות ועשויה שלא להיות גישה לאתר מעת לעת.
            </p>
            <p style={P}>
              HighAir ו/או מי מטעמה לא יהיו אחראים ולא יישאו בכל נזק ישיר, עקיף, תוצאתי או מיוחד שנגרם למשתמש או לצד שלישי כתוצאה משימוש או רכישה באמצעות האתר, לרבות הפסד הכנסה ו/או מניעת רווח.
            </p>
            <p style={P}>
              יובהר כי HighAir ומי מטעמה אינם אחראים לנזקים הנגרמים לנוסע כגון נזקי גוף, מחלות, נזק למטען, ו/או כל נזק ישיר או עקיף שעלול להיגרם לנוסע בקשר עם השירותים - לרבות במהלך הטיסה או שהייה בחו"ל או בארץ.
            </p>
            <p style={P}>
              HighAir מתחייבת לספק מדריכים מוסמכים אולם אינה אחראית לביצוע העבודה בפועל, לטיב השירותים שהתקבלו, להחלטות שהתקבלו במהלך המסע, ואין ולא יהיה בינה לבין אותם ספקים שום קשר ישיר זולת תיווך בינם לבין הלקוחות.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>3. פרטיות ושמירת מידע</h2>
            <p style={P}>
              כל פרטיו האישיים של הלקוח יישמרו במאגרי המידע של HighAir, וזו לא תעביר את פרטיו לאף גורם אחר, אלא במידת הצורך ולשם השלמת עסקה בלבד.
            </p>
            <p style={P}>
              במועד בקשה ליצירת קשר ע"י הלקוח, לרבות רישום לנסיעה ו/או מסירת כתובת מייל ו/או ביצוע הזמנה, הלקוח מסכים ומאשר לחברה לשלוח אליו הודעות שיווקיות ועדכונים בכל אמצעי תקשורת.
            </p>
            <p style={P}>
              במקרים שאינם בשליטת החברה ו/או הנובעים מכוח עליון, לא תהא החברה אחראית לכל נזק מכל סוג שהוא אם מידע זה יאבד ו/או יעשה בו שימוש לא מורשה.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>4. שימושים אסורים באתר</h2>
            <p style={P}>ללא הרשאה מהחברה מראש ובכתב, המשתמש אינו רשאי:</p>
            <ul style={UL}>
              {[
                'לעשות שימוש מסחרי באתר ו/או בתוכן האתר.',
                'להעתיק, לשחזר, לשנות, לעבד, לתרגם, לבצע הנדסה לאחור, להפיץ, לשדר, להציג, לשכפל, לפרסם ולאחסן את תוכן האתר.',
                'להפעיל כלי סריקה אוטומטיים כגון Crawlers, Robots וכדומה.',
                'להציג תוכן מהאתר בתוך מסגרת (iframe) גלויה או סמויה.',
                'לאסוף מידע אישי על המשתמשים ללא הסכמתם המפורשת בכתב.',
                'לפגוע בכבודו או בפרטיותו של משתמש אחר ו/או לפרסם דברי הסתה, הונאה, לשון הרע ו/או מידע שגוי.',
                'להשתמש באתר לשם יצירת מאגר מידע.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>5. זכויות יוצרים וקניין רוחני</h2>
            <p style={P}>
              האתר והמידע המופיעים בו - לרבות עיצוב האתר, תמונות, מפות, קטעי אודיו ווידאו, טקסט, גרפיקה, תוכנה וקוד מחשב - מוגנים על-ידי דיני זכויות יוצרים ושייכים לחברה ו/או לגורמים שלישיים שמסרו הסכמתם לשימוש.
            </p>
            <p style={P}>
              כל זכויות הקניין הרוחני בקשר עם האתר - לרבות שם המתחם, פטנטים, סימני מסחר, זכויות יוצרים, קוד המקור, לוגו ועיצוב האתר - הם רכושה הבלעדי של החברה.
            </p>
            <p style={P}>
              אין להעתיק, להפיץ, לשכפל, למכור, לתרגם ו/או לבצע פעולה אחרת בכל תוכן המופיע באתר, אלא אם התקבל אישור החברה לכך מראש ובכתב.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>6. רכישת מוצרים ושירותים</h2>
            <p style={P}>
              רכישת המוצרים תתבצע באמצעות הוספת מוצרים לסל הקניות. הלקוח יזין את פרטיו האישיים בטופס המקוון המיועד לכך.
            </p>
            <p style={P}>
              השדות המסומנים בכוכבית חובה למלאם; ללא מילויים לא תתאפשר השלמת ההזמנה. על מנת למנוע תקלות במשלוח, על המזמין למסור פרטים מדויקים ונכונים בלבד.
            </p>
            <p style={P}>
              לאחר השלמת ההזמנה תתבצע בדיקת פרטי כרטיס האשראי, ורק לאחר אישור חברת האשראי תאושר הפעולה ויצא אישור סופי של ההזמנה.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>7. השכרת ציוד</h2>
            <p style={P}>
              דמי השכירות עבור ציוד טרקים וציוד מקצועי ישולמו במקום יעד המשלחת או בתשלום מראש במועד ביצוע ההזמנה ולא יהיו ניתנים להחזר כספי לאחר מכן.
            </p>
            <p style={P}>
              על הנוסע לשמור על הציוד השכור במצב תקין ולהשיבו לחברת ההשכרה עם סיום המשלחת. בגין ציוד שאבד או ניזוק, תגבה החברה המקומית דמי החלפה או תיקון מפיקדון הלקוח.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>8. מדיניות ביטולים ושינויים</h2>
            <p style={P}>
              כל ביטול ו/או שינוי הזמנה ייעשה לאחר הודעה רשמית וכתובה של הנוסע באמצעות דואר אלקטרוני.
            </p>
            <p style={P}>
              הזמנה שתבוטל בתוך 14 ימים מביצועה - ולא בתוך 7 ימי עסקים לפני מועד היציאה - לא יחולו עליה דמי ביטול.
            </p>
            <p style={P}>הזמנה שתבוטל מחוץ לתנאים אלו, דמי הביטול הם:</p>
            <ul style={UL}>
              {[
                '60 יום לפני היציאה - החזר מקדמה בניכוי 15% מעלות הטיול.',
                'בין 1-59 יום לפני היציאה - אין החזר מקדמה.',
                'ניתן לשמור את המקדמה כקרדיט לשימוש עתידי ללא דמי ביטול.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>
              יובהר כי דמי הביטול אינם כוללים עמלת סליקה של חברת כרטיסי האשראי. במקרה של רכישה קבוצתית, דמי הביטול ייגבו עבור כל נוסע.
            </p>
            <p style={P}>
              HighAir שומרת לעצמה את הזכות לשנות ו/או לבטל כל טיסה, חבילה או שירות, בין היתר עקב מספר נוסעים בלתי מספיק, טעות קולמוס, תקלה טכנית או שינויים שאינם בשליטת החברה.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>9. מדיניות תשלום</h2>
            <p style={P}>
              על הנוסע להעביר מקדמה לשריון המקום בקבוצה, תשלום נוסף 45 ימים לפני היציאה, והיתרה לספק המקומי בהגעה ליעד - בהעברה בנקאית לפי פרטי החשבון שיימסרו ע"י נציג HighAir.
            </p>
            <p style={P}>
              תשלום באמצעות כרטיס אשראי יישא עמלת סליקה של 2%. אי השלמת התשלום אינה פוטרת את הנוסע מהתחייבויותיו כלפי HighAir לרבות חובת תשלום.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>10. כוח עליון</h2>
            <p style={P}>
              HighAir תהא פטורה מאחריות אם מילוי התחייבויותיה יימנע, באופן חלקי או מלא, כתוצאה מאירועי כוח עליון.
            </p>
            <p style={P}>
              "כוח עליון" - כל אירוע שמחוץ לתחום השליטה הסבירה של HighAir, לרבות: שביתות, הפרות סדר, שריפה, הצפה, מזג אוויר, מלחמה, מבצע צבאי, פלישה, מגיפה, מחלות, חרם, מעצרים, תקלות טכניות, החלטות רשויות לאומיות - בין אם צפוי ובין אם לאו.
            </p>
            <p style={P}>
              במקרה של ביטול עקב כוח עליון, הטיול יידחה למועד אחר והכספים יועברו למועד החדש ו/או ליעד שונה לבחירת הלקוח. HighAir שומרת לעצמה את הזכות לבחון כל מקרה לגופו.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>11. דין ושיפוט</h2>
            <p style={P}>
              על כל שימוש באתר ו/או כל טענה, דרישה או תביעה הנובעים ממנו - ובכל הקשור להזמנת מוצרי ושירותי HighAir - יחולו אך ורק דיני מדינת ישראל.
            </p>
          </div>
        </>
      ) : (
        <>
          <div style={SECTION}>
            <p style={P}>
              Welcome to the HighAir Expeditions website (hereinafter: "the Site").
              The site is operated by Chen Shaked and Adir Oigoner, C.N. 558586087. The site serves as a brand and e-commerce site offering, among other things, information and services relating to trips, treks, mountain climbing, and the sale of related products. HighAir Expeditions acts as an intermediary and connector for all organized and approved events or services including mountain climbing, rock climbing, high-altitude stays, extreme cold conditions, extensive walking, running, treks of all kinds, swimming, climbing, cycling, camping, hot springs, cultural activities, and transportation services to desired destinations in Israel and abroad.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>1. General Terms</h2>
            <ul style={UL}>
              {[
                'These terms apply equally to women and men; masculine language is used for convenience only.',
                'Registration for an expedition will be confirmed only after signing an engagement agreement.',
                'The act of engaging with the company\'s service and/or content constitutes acceptance of these terms of use, including the privacy policy.',
                'The terms of use and privacy policy govern the relationship between the customer and the company and may change from time to time at the company\'s sole and exclusive discretion.',
                'The binding and definitive version of the terms of use at any given time is the one published on the company\'s website.',
                'HighAir makes every effort to present the most complete and comprehensive information about the product; however, inaccuracies, errors, or good-faith omissions may appear, and the company shall bear no responsibility arising from them.',
                'Product images on the site are displayed for illustrative purposes only.',
                'It is prohibited to copy and use content from the site for any other purpose without prior written approval.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>2. Company Liability</h2>
            <p style={P}>
              HighAir does everything within its power to provide users with a high-quality and safe experience on the site. However, the site is not immune to malfunctions and access may not be available from time to time.
            </p>
            <p style={P}>
              HighAir and/or anyone on its behalf shall not be liable for any direct, indirect, consequential, or special damage caused to the user or a third party as a result of use or purchase through the site, including loss of income and/or loss of profit.
            </p>
            <p style={P}>
              It is clarified that HighAir and anyone on its behalf are not responsible for damages caused to the traveler such as bodily injury, illness, damage to baggage, and/or any direct or indirect damage that may be caused to the traveler in connection with the services - including during a flight or stay abroad or in Israel.
            </p>
            <p style={P}>
              HighAir undertakes to provide certified guides but is not responsible for the actual performance of the work, the quality of services received, or decisions made during the expedition, and there is and shall be no direct relationship between it and those suppliers other than intermediation between them and the customers.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>3. Privacy and Data Retention</h2>
            <p style={P}>
              All personal details of the customer will be stored in HighAir's databases, and HighAir will not transfer them to any other party, except as necessary and solely for the completion of a transaction.
            </p>
            <p style={P}>
              At the time of a contact request by the customer, including registration for a trip and/or providing an email address and/or placing an order, the customer agrees and authorizes the company to send marketing messages and updates to them by any means of communication.
            </p>
            <p style={P}>
              In cases beyond the company's control and/or resulting from force majeure, the company shall not be liable for any damage of any kind if this information is lost and/or used without authorization.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>4. Prohibited Uses of the Site</h2>
            <p style={P}>Without prior written permission from the company, the user may not:</p>
            <ul style={UL}>
              {[
                'Make commercial use of the site and/or its content.',
                'Copy, restore, modify, process, translate, reverse engineer, distribute, broadcast, display, duplicate, publish, or store the site\'s content.',
                'Operate automated scanning tools such as Crawlers, Robots, and the like.',
                'Display content from the site within a visible or hidden frame (iframe).',
                'Collect personal information about users without their explicit written consent.',
                'Harm the dignity or privacy of another user and/or publish incitement, fraud, defamation, and/or false information.',
                'Use the site for the purpose of creating a database.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>5. Copyright and Intellectual Property</h2>
            <p style={P}>
              The site and the information appearing on it - including site design, images, maps, audio and video clips, text, graphics, software, and computer code - are protected by copyright law and belong to the company and/or third parties who have given their consent for use.
            </p>
            <p style={P}>
              All intellectual property rights in connection with the site - including the domain name, patents, trademarks, copyrights, source code, logo, and site design - are the exclusive property of the company.
            </p>
            <p style={P}>
              It is prohibited to copy, distribute, duplicate, sell, translate, and/or perform any other action on any content appearing on the site, unless prior written approval has been obtained from the company.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>6. Purchase of Products and Services</h2>
            <p style={P}>
              Purchase of products will be carried out by adding items to the shopping cart. The customer will enter their personal details in the designated online form.
            </p>
            <p style={P}>
              Fields marked with an asterisk are mandatory; without completing them, the order cannot be finalized. To prevent delivery errors, the orderer must provide accurate and correct details only.
            </p>
            <p style={P}>
              After completing the order, credit card details will be verified, and only after approval by the credit card company will the transaction be confirmed and a final order confirmation sent.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>7. Equipment Rental</h2>
            <p style={P}>
              Rental fees for trekking and professional equipment will be paid at the expedition destination or prepaid at the time of booking and will not be refundable thereafter.
            </p>
            <p style={P}>
              The traveler must keep the rented equipment in good condition and return it to the rental company at the end of the expedition. For lost or damaged equipment, the local company will charge replacement or repair fees from the customer's deposit.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>8. Cancellation and Change Policy</h2>
            <p style={P}>
              Any cancellation and/or change of order will be made after official written notice from the traveler via email.
            </p>
            <p style={P}>
              An order cancelled within 14 days of placement - and not within 7 business days before the departure date - will not be subject to cancellation fees.
            </p>
            <p style={P}>For orders cancelled outside these conditions, the cancellation fees are:</p>
            <ul style={UL}>
              {[
                '60 days before departure - refund of advance payment minus 15% of the trip cost.',
                'Between 1-59 days before departure - no advance payment refund.',
                'You may keep the advance payment as credit for future use with no cancellation fee.',
              ].map((item, i) => <li key={i} style={LI}>{item}</li>)}
            </ul>
            <p style={P}>
              It is clarified that cancellation fees do not include the processing fee charged by the credit card company. In the case of a group purchase, cancellation fees will be charged per traveler.
            </p>
            <p style={P}>
              HighAir reserves the right to change and/or cancel any flight, package, or service, including due to insufficient passengers, clerical error, technical malfunction, or changes beyond the company's control.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>9. Payment Policy</h2>
            <p style={P}>
              The traveler must transfer a deposit to secure their place in the group, an additional payment 45 days before departure, and the balance to the local supplier upon arrival at the destination - by bank transfer according to the account details provided by the HighAir representative.
            </p>
            <p style={P}>
              Payment by credit card will incur a 2% processing fee. Failure to complete payment does not release the traveler from their obligations to HighAir, including the payment obligation.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>10. Force Majeure</h2>
            <p style={P}>
              HighAir shall be exempt from liability if the fulfillment of its obligations is prevented, partially or fully, as a result of force majeure events.
            </p>
            <p style={P}>
              "Force majeure" - any event beyond the reasonable control of HighAir, including: strikes, disorder, fire, flooding, weather, war, military operation, invasion, epidemic, diseases, boycott, arrests, technical malfunctions, decisions by national authorities - whether foreseeable or not.
            </p>
            <p style={P}>
              In the event of cancellation due to force majeure, the trip will be postponed to another date and payments will be transferred to the new date and/or a different destination of the customer's choice. HighAir reserves the right to review each case individually.
            </p>
          </div>

          <div style={SECTION}>
            <h2 style={H2}>11. Governing Law</h2>
            <p style={P}>
              All use of the site and/or any claim, demand, or lawsuit arising from it - and in everything related to ordering HighAir's products and services - shall be governed exclusively by the laws of the State of Israel.
            </p>
          </div>
        </>
      )}
    </LegalPageLayout>
  );
}
