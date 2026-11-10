/* /trek-match: the trek matching tool, "מה הפסגה הבאה שלכם?" (owner, 10 Nov 2026), a hidden page:
   not in the menu, the sitemap or the static shells, noindex (usePageMeta here, X-Robots-Tag in
   vercel.json), Hebrew site only (main.jsx). The page is the artifact's own landing, as it was
   designed; the quiz runs from src/website/trekMatch.js. The form at its end is a real lead in the
   Lead Center, sent the way every form on the site sends one (Source "Trek Match Quiz"). */
import { useEffect, useRef } from 'react';
import { usePageMeta } from '../../website/usePageMeta.js';
import { contactFor } from '../../website/contact.js';
import { getAttribution } from '../../utils/attribution.js';
import { Analytics, trackLead } from '../../utils/analytics.js';
import { EXPS } from '../../data/trips.js';
import { formatFullPhone, validatePhone, splitInternational } from './PhoneField.jsx';
import { mountTrekMatch, ASSETS } from '../../website/trekMatch.js';
import './trekMatch.css';

const IL = '+972';
/* The quiz has one phone box, Israeli by default; a number typed with its country code keeps it. */
export function phoneParts(raw) {
  const s = String(raw || '').trim();
  return splitInternational(s, IL) || { dial: IL, local: s };
}
export function phoneOk(raw) {
  const { dial, local } = phoneParts(raw);
  return validatePhone(dial, local);
}

const WA = contactFor('he');

const MARKUP = `
<header class="top"><div class="in">
  <img class="logo logo-d" src="${ASSETS}logo.png" alt="HighAir Expeditions"><img class="logo logo-w" src="${ASSETS}logo-white.png" alt="HighAir Expeditions">
  <a href="#quiz" class="btn primary" data-start>לשאלון</a>
</div></header>

<section class="herob">
  <video id="herovid" autoplay muted loop playsinline preload="metadata" poster="${ASSETS}hero-poster.webp" aria-hidden="true"><source src="/videos/trek-match-hero.mp4" type="video/mp4"></video>
  <div class="in">
    <h1>מה הפסגה הבאה שלכם?</h1>
    <p class="sub">ספרו לנו קצת על עצמכם, ונמליץ לכם על המסעות שהכי מתאימים לכם. מטרק של שבוע בסיני ועד פסגות בהימלאיה.</p>
    <div class="cta-row"><a href="#quiz" class="btn primary big" data-start>להתחלת השאלון</a><a href="#ladder-sec" class="btn light big">לכל המסעות</a></div>
    <div class="stats">
      <div class="stat"><b>19</b><span>מסעות ב־4 יבשות</span></div>
      <div class="stat"><b>94%</b><span>הגיעו לפסגת קילימנג'רו</span></div>
      <div class="stat"><b>15</b><span>מטיילים לכל היותר בקבוצה</span></div>
      <div class="stat"><b>8,163</b><span>מטר, הפסגה הגבוהה שלנו</span></div>
    </div>
  </div>
</section>

<section class="quizband" id="quiz"><div class="in">
  <div class="quiz-grid">
    <aside class="quiz-side">
      <div class="eyebrow">שאלון התאמה · כשתי דקות</div>
      <h2>בואו נכיר קצת</h2>
      <p>כמה שאלות על הכושר, הניסיון ומה שאתם מחפשים. בסוף תקבלו שלוש המלצות מתוך המסעות שאנחנו מובילים.</p>
      <ol class="mini-steps">
        <li><b>עונים על 12 שאלות</b><span>כושר, ניסיון, תקציב ומתי נוח לכם</span></li>
        <li><b>מקבלים המלצות</b><span>שלושה מסעות, עם הסבר למה הם מתאימים</span></li>
        <li><b>ממשיכים בוואטסאפ</b><span>אם תרצו, נענה על שאלות ונעזור לבחור תאריך</span></li>
      </ol>
    </aside>
    <main id="app" class="card" aria-live="polite"></main>
  </div>
</div></section>

<section class="band"><div class="in">
  <div class="sh"><h2>קצת מהדרך</h2><p class="lead">תמונות של מטיילים שיצאו איתנו בשנים האחרונות.</p></div>
  <div class="mosaic" id="mosaic"></div>
</div></section>

<section class="band alt" id="ladder-sec"><div class="in">
  <div class="sh"><h2>כל המסעות שלנו</h2><p class="lead">מסודרים מהנמוך לגבוה, מ־2,642 מ' ועד 8,163 מ'.</p></div>
  <div class="ladder-wrap"><div class="ladder" id="ladder"></div></div>
  <p class="ladder-hint">גללו הצידה לעוד מסעות ←</p>
  <p style="margin-top:18px">לא בטוחים במה לבחור? <a href="#quiz" data-start style="color:var(--accent);font-weight:600">השאלון יעזור</a></p>
</div></section>

<section class="band"><div class="in">
  <div class="sh"><h2>מה מספרים מי שיצאו איתנו</h2></div>
  <div class="quotes">
    <figure class="quote"><blockquote>הליווי של חן ואדיר לכל אורך תקופת ההכנה ולאורך המסע עצמו היו מדוייקים ותרמו לחוויה להיות חיובית ומשמעותית. לכל שאלה הם ענו בסבלנות ומקצועיות.</blockquote><figcaption><b>שירה בן שושן</b> · קילימנג'רו, פברואר 2026</figcaption></figure>
    <figure class="quote"><blockquote>בלעדיכם לא היינו עושים כלום!! תודה רבה על הליווי המקצועי והלוגיסטי!! 💜</blockquote><figcaption><b>משלחת למרה פיק, נפאל</b> · אוקטובר 2026 · תגובה בפייסבוק</figcaption></figure>
    <figure class="quote"><blockquote>היתה חוויה מדהימה. הגשמת חלום שמתבשל לו כ־5 שנים. והנה יצא לפועל! […] הכי הכי שלא אפשרנו לרוח לשבור אותנו. אפילו שלרגע היה נדמה שנעוף איתה!</blockquote><figcaption><b>טרק לפסגת החרמון</b> · מאי 2026 · תגובה בפייסבוק</figcaption></figure>
    <figure class="quote"><blockquote>היה מושלם, מאורגן לעילא ולעילא. סידרתם לנו אחלה מזג אוויר ונוף מרהיב ואפילו ארוחה נפלאה. מומלץ בחום, מצפה בכליון עיניים לאתגר הקרוב הבא…</blockquote><figcaption><b>טרק בקרן הכרמל והמוחרקה</b> · מרץ 2026 · תגובה בפייסבוק</figcaption></figure>
    <figure class="quote"><blockquote>טרק מדהים, מאתגר וכייף. אנשים מקסימים. חוויה מעצימה עם HighAir Expeditions, חן וגיא האלופים.</blockquote><figcaption><b>טרק במעלה צאלים ונחל צאלים</b> · דצמבר 2025 · תגובה בפייסבוק</figcaption></figure>
    <figure class="quote"><blockquote>הרכב הקבוצה שבנו חן ואדיר היה נפלא. זכיתי בחברים לכל החיים. אני ממליץ בחום לכל מי שרוצה לדעת שהכל מטופל לעילה ולעילה, גם בארץ וגם באפריקה.</blockquote><figcaption><b>מוטי פאר</b> · קילימנג'רו, ינואר 2026</figcaption></figure>
  </div>
</div></section>

<section class="band alt"><div class="in">
  <div class="sh"><h2>איך זה עובד אצלנו</h2></div>
  <div class="why-grid">
    <div class="why-item"><h3>קבוצות קטנות</h3><p>עד 15 מטיילים, ובטיפוסים הטכניים עד 10.</p></div>
    <div class="why-item"><h3>הכנה מהארץ</h3><p>מפגש ציוד, טרק הכנה עם הקבוצה ותוכנית אימונים לפני היציאה.</p></div>
    <div class="why-item"><h3>עדכונים למשפחה</h3><p>המשפחות מקבלות עדכונים בוואטסאפ לאורך המסע.</p></div>
    <div class="why-item"><h3>בטיחות קודם</h3><p>מדריכים מקומיים מנוסים, חמצן לחירום ומכשיר לוויני בכל קבוצה.</p></div>
    <div class="why-item"><h3>הכל באפליקציה</h3><p>רשימת ציוד, לו״ז ומסמכים, באזור אישי באפליקציה של HighAir.</p></div>
    <div class="why-item"><h3>תרומה מכל מסע</h3><p>חלק מכל מסע נתרם למאבק במחלת הסרטן.</p></div>
  </div>
</div></section>

<section class="band final-soft"><div class="in">
  <h2>רוצים לדבר על זה?</h2>
  <p class="lead">אפשר לענות על השאלון, או פשוט לכתוב לנו.</p>
  <div class="cta-row"><a href="#quiz" class="btn primary" data-start>לשאלון</a><a href="https://wa.me/${WA.wa}" target="_blank" rel="noopener" class="btn ghost">לשיחה בוואטסאפ</a></div>
</div></section>

<footer><div class="in">
  <img class="logo logo-d" src="${ASSETS}logo.png" alt="HighAir Expeditions"><img class="logo logo-w" src="${ASSETS}logo-white.png" alt="HighAir Expeditions">
  <span>וואטסאפ: <span class="phone">${WA.display}</span> · <a href="/">highair-expeditions.com</a></span>
</div></footer>

<div class="lb" id="lb" hidden role="dialog" aria-label="גלריית תמונות"><img id="lbimg" alt=""><button class="x" id="lbx" aria-label="סגירה">✕</button><button class="nx" id="lbn" aria-label="התמונה הבאה">‹</button><button class="pv" id="lbp" aria-label="התמונה הקודמת">›</button><div class="cap" id="lbc"></div></div>
`;

/* The site name of each expedition, the value every expedition form sends as "Expedition" */
const nameHe = id => (EXPS.find(e => e.slug === id) || {}).nameHe || id;

async function sendLead(quiz, rs) {
  const fields = quiz.leadFields(rs, nameHe);
  const { dial, local } = phoneParts(quiz.lead.phone);
  fields.Phone = formatFullPhone(dial, local);
  try {
    const res = await fetch('/api/submit-lead', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fields, ...getAttribution() }),
    });
    if (res.ok) {
      const top = rs[0] && rs[0].t;
      Analytics.leadSubmit({ source: 'trek_match', expedition: fields.Expedition });
      trackLead({ source: 'trek_match', slug: top ? top.id : 'trek-match', name: fields.Expedition || 'Trek Match' });
    } else console.warn('[trek-match] lead', res.status);
  } catch (e) { console.warn('[trek-match] lead', e?.message); }
}

export default function TrekMatchPage() {
  usePageMeta({
    title: 'מה הפסגה הבאה שלכם? | HighAir Expeditions',
    description: 'שאלון התאמה קצר: ספרו לנו על הכושר, הניסיון ומה שאתם מחפשים, ונמליץ לכם על המסעות שהכי מתאימים לכם.',
    canonicalPath: '/trek-match',
    noIndex: true,
  });
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return undefined;
    return mountTrekMatch(ref.current, { wa: WA.wa, onLead: sendLead, checkPhone: raw => (phoneOk(raw) ? '' : 'bad') });
  }, []);
  return <div ref={ref} className="tm" dir="rtl" lang="he" dangerouslySetInnerHTML={{ __html: MARKUP }} />;
}
