/* trekTrainingGuide.js: the owner's guide "אימונים לטרק ולטיפוס הרים: המדריך המלא להכנה גופנית"
   (20 Nov 2026), the page as his preview shows it (claude.ai artifact Dx43LFng5Qrq9oZ4Lr3EP6).
   TrekTrainingGuide.jsx renders MARKUP inside the site's header and footer and runs initGuide()
   on it; its styles are trekTrainingGuide.css, every rule scoped to .tg.

   Every word, number, caption and alt text is the owner's, as he wrote it. What changed from the
   preview: the photos are the trip galleries' own copies (the same photos), each with its lighter
   grid copy for a small screen; the trip links are the site's own paths; Mont Blanc is still a
   teaser with no public page, so its pill is the same pill without a link (link it at launch).

   The post's text for search engines and readers without JavaScript (the static page, its FAQ
   data) is blogData.js's POSTS entry for this slug; tests/trek-training-guide.test.js checks that
   every line of it is on this page, word for word. Pure module: nothing here runs on import. */

export const GUIDE_SLUG = 'trek-training-guide';

/* [the photo's width, its grid copy's width (scripts/gen-gallery.mjs), 0 when it has none] */
export const PHOTOS = {
  'kilimanjaro/1':        [1080, 0],
  'kilimanjaro/9':        [1600, 1200],
  'kilimanjaro/11':       [1600, 1200],
  'elbrus/10':            [1600, 1200],
  'elbrus/17':            [1200, 900],
  'elbrus/20':            [1200, 900],
  'mera-peak/7':          [1536, 900],
  'mera-peak/11':         [1153, 676],
  'mera-peak/20':         [1280, 960],
  'manaslu/7':            [1279, 959],
  'everest-base-camp/10': [1600, 1200],
  'peaks-of-balkan/5':    [1920, 1200],
};

/* src, and with a grid copy srcset + sizes, so each screen downloads the size it shows */
export function pic(key, sizes) {
  const [dest, n] = key.split('/');
  const [w, tw] = PHOTOS[key];
  const src = `/images/gallery/${dest}/${n}.webp`;
  if (!tw) return `src="${src}"`;
  const thumb = `/images/gallery/${dest}/thumbs/${n}.webp`;
  return `src="${thumb}" srcset="${thumb} ${tw}w, ${src} ${w}w" sizes="${sizes}"`;
}

/* The width each photo is drawn at (object-fit: cover fills its box, so a landscape photo in an
   upright box is drawn wider than the box). */
const SPLIT        = '(max-width: 820px) 100vw, 560px';
const SPLIT_WIDE   = '(max-width: 820px) 100vw, 940px';
const SIDE         = '(max-width: 860px) 100vw, 560px';
const GALLERY_MAIN = '(max-width: 700px) 100vw, 600px';
const GALLERY      = '(max-width: 700px) 50vw, 300px';
const GALLERY_WIDE = '(max-width: 700px) 60vw, 380px';
const CTA          = '(max-width: 1240px) 100vw, 1180px';
const ZONE         = '(max-width: 700px) 84vw, 340px';

export const MARKUP = `
<div class="tg">

<header class="band hero">
  <div class="wrap">
    <div class="kick">מדריכים · הכנה גופנית</div>
    <h1>אימונים לטרק ולטיפוס הרים: המדריך המלא להכנה גופנית</h1>
    <p class="lede">איך מתאמנים לטרק, כמה זמן לפני מתחילים ומה עושים בכל שבוע. כל מה שלמדנו מהמשלחות שלנו על הכנה גופנית לקילימנג׳רו, לבסיס האוורסט, לטרקים בנפאל ולפסגות של 6,000 ו־8,000 מטרים.</p>
    <div class="meta"><span>צוות HighAir</span><span>20 בנובמבר 2026</span><span>14 דקות קריאה</span></div>
    <figure class="photo heroImg rv"><img ${pic('kilimanjaro/1')} alt="קבוצת מטיילים של HighAir בטרק לפסגת הקילימנג׳רו, אחרי חודשים של אימונים לטרק" fetchpriority="high" decoding="async"><figcaption>בדרך לפסגת הקילימנג׳רו, משלחת HighAir</figcaption></figure>
  </div>
</header>

<section class="band" style="padding-bottom:0"><div class="wrap">
  <div class="tldr rv">
    <h2>בקצרה: איך מתאמנים לטרק?</h2>
    <ul>
      <li><b>מתחילים בזמן:</b> חודשיים עד שלושה לטרק בגובה בינוני, 3 עד 6 חודשים לקילימנג׳רו או לבסיס האוורסט, וחצי שנה ויותר לפסגות של 6,000 מטרים.</li>
      <li><b>הליכה ארוכה עם תיק פעם בשבוע</b>, 3 עד 6 שעות עם עליות וירידות. זה האימון הכי חשוב.</li>
      <li><b>מדרגות עם תיק</b> פעם או פעמיים בשבוע, כדי לצבור מטרים בעלייה גם בעיר.</li>
      <li><b>אירובי קל</b> 2 עד 3 פעמים בשבוע, כמו ריצה, אופניים או שחייה, בקצב שבו אפשר לדבר.</li>
      <li><b>כוח רגליים וליבה</b> פעמיים בשבוע, ושבועיים של מנוחה יחסית לפני הטיסה.</li>
    </ul>
  </div>
  <nav class="toc" aria-label="תוכן המדריך"><a href="#when">כמה זמן לפני</a><a href="#fitness">כמה כושר צריך</a><a href="#must">האימונים החשובים</a><a href="#stairs">אימון מדרגות</a><a href="#types">סוגי אימונים</a><a href="#plan">תוכנית 16 שבועות</a><a href="#nepal">נפאל והימלאיה</a><a href="#exercises">תרגילים</a><a href="#mistakes">טעויות נפוצות</a><a href="#faq">שאלות נפוצות</a></nav>
</div></section>

<section class="band"><div class="wrap split">
  <div class="read rv">
    <p style="font-size:20px;color:var(--ink);line-height:1.7">השעה קצת לפני חצות, מחנה בראפו בקילימנג׳רו, 4,673 מטרים. קר, חושך, והפנסים כבר דולקים. בעוד כמה דקות יוצאים לפסגה.</p>
    <p>ליד כל אוהל יש מישהו שבודק את התיק בפעם העשירית, אבל הרגע הזה לא נקבע עכשיו. הוא נקבע בחצי השנה שלפני הטיסה, בבקרים שבהם קמתם להליכה עם תיק, ובערבים שבהם עליתם מדרגות במקום לשבת מול הטלוויזיה.</p>
    <p>אנחנו מלווים מטפסים כבר שנים, ורואים את זה שוב ושוב: מי שהתכונן נכון נהנה מהדרך. לא צריך להיות ספורטאים. צריך תוכנית פשוטה, להתמיד בה, ולהתחיל בזמן.</p>
  </div>
  <figure class="photo rv"><img ${pic('kilimanjaro/9', SPLIT_WIDE)} alt="מטפסים עם תיקים ומקלות בשעת זריחה מעל העננים בקילימנג׳רו" loading="lazy" decoding="async"><figcaption>זריחה בדרך לפסגה, אחרי לילה של הליכה</figcaption></figure>
</div></section>

<section class="band soft" id="when"><div class="wrap">
  <div class="read rv">
    <h2>כמה זמן לפני טרק צריך להתחיל להתאמן?</h2>
    <p>תלוי לאן אתם הולכים. ככל שעולים גבוה יותר, בכל נשימה יש פחות חמצן, והימים ארוכים יותר. בפסגת הקילימנג׳רו נכנס לריאות בערך חצי מהחמצן שיש בתל אביב, ובפסגת האוורסט רק כשליש. לכן גם זמן ההכנה גדל.</p>
  </div>
  <div class="zones" id="tgZones"></div>
  <div class="swipe">החליקו הצידה לעוד אזורי גובה ←</div>
  <p class="small" style="margin-top:12px">אחוז החמצן הוא ערך משוער ביחס לגובה פני הים.</p>
</div></section>

<section class="band" id="fitness"><div class="wrap read rv">
  <h2>כמה כושר צריך לקילימנג׳רו או לטרק בנפאל?</h2>
  <p>זו כנראה השאלה שאנחנו שומעים הכי הרבה, והתשובה מרגיעה: לא צריך להיות ספורטאים, וגם לא צריך לרוץ מרתון. מה שכן צריך זה להיות מסוגלים ללכת הרבה שעות, כמה ימים ברצף, בעלייה ועם תיק.</p>
  <p>מבחן פשוט שאנחנו נותנים למשתתפים: אם אתם יכולים ללכת 4 עד 5 שעות בשטח עם עליות ותיק של 6 עד 8 קילו, ולקום למחרת בלי להרגיש מפורקים, אתם בכיוון הנכון לקילימנג׳רו או לבסיס האוורסט. אם זה עדיין רחוק, זה בדיוק מה שהתוכנית כאן נועדה לבנות.</p>
  <p><b>מתחילים מאפס?</b> זה בסדר גמור. הרבה מהמשתתפים שלנו הגיעו בלי שום רקע. פשוט תתחילו מוקדם יותר, עם חצי מהנפח שמופיע כאן, ותעלו בהדרגה.</p>
</div></section>

<section class="band"><div class="wrap">
  <h2 class="rv">עקרונות האימון לטרק: חמישה דברים שחשוב להבין</h2>
  <div class="stats rv">
    <div class="stat"><b data-count="80" data-suf="%">0%</b><span>מהאימון האירובי צריך להיות קל, בקצב שבו אפשר לדבר</span></div>
    <div class="stat"><b data-count="10" data-suf="%">0%</b><span>זו התוספת המקסימלית לנפח האימונים משבוע לשבוע</span></div>
    <div class="stat"><b>1 מ־4</b><span>שבוע קל אחד בכל 3 עד 4 שבועות, כדי שהגוף יספיק להתחזק</span></div>
    <div class="stat"><b data-count="2" data-suf=" שב׳">0</b><span>לפני הטיסה מורידים עומס, ומגיעים להר רעננים</span></div>
  </div>
  <div class="read rv">
    <p><b>מתאמנים למה שמחכה לכם.</b> ההר הוא שעות של עלייה וירידה עם תיק על הגב. ריצות מהירות על מישור נחמדות, אבל הן לא יכינו אתכם לזה. הליכות, עליות ומדרגות כן.</p>
    <p><b>קודם כל סיבולת.</b> טרק הוא לא ספרינט, הוא כמה ימים רצופים של מאמץ בינוני. מי שבנה בסיס אירובי טוב הולך בנחת, ישן טוב יותר וקם בבוקר מוכן ליום הבא.</p>
    <p><b>לאט ובהדרגה.</b> עוד קילו בתיק, עוד חצי שעה בשטח. רוב הפציעות שאנחנו רואים לפני משלחות מגיעות ממי שניסה להשלים חודשיים של אימונים בשבועיים.</p>
    <p><b>להתמיד, לא להתאבד.</b> ארבעה אימונים סבירים בשבוע לאורך חצי שנה שווים הרבה יותר מאימון אחד מטורף שמשבית אתכם לשבוע.</p>
    <p><b>לנוח זה חלק מהעבודה.</b> הגוף מתחזק בזמן השינה ובימי המנוחה, לא באמצע האימון. אל תוותרו עליהם.</p>
  </div>
</div></section>

<section class="band soft" id="must"><div class="wrap split">
  <div class="rv">
    <h2>האימונים הכי חשובים לפני טרק</h2>
    <p class="lede">אם יש לכם זמן רק לחמישה אימונים, אלה האימונים שנותנים הכי הרבה על ההר. בשבוע עמוס, תתחילו מהם.</p>
    <ul class="must">
      <li><b class="n">1</b><div><h3>הליכה ארוכה עם תיק</h3><p>פעם בשבוע, 3 עד 6 שעות בשטח, עם עליות וירידות. זה הכי קרוב ליום אמיתי על ההר.</p></div></li>
      <li><b class="n">2</b><div><h3>מדרגות עם תיק</h3><p>פעם או פעמיים בשבוע. בעיר זו הדרך הכי טובה לצבור מטרים בעלייה.</p></div></li>
      <li><b class="n">3</b><div><h3>אירובי קל ורציף</h3><p>2 עד 3 פעמים בשבוע, 45 עד 90 דקות בקצב שבו אפשר לדבר. ככה בונים את המנוע.</p></div></li>
      <li><b class="n">4</b><div><h3>כוח רגליים וירידות</h3><p>פעמיים בשבוע. רגליים חזקות עייפות פחות, וברכיים מאומנות סובלות פחות בירידה.</p></div></li>
      <li><b class="n">5</b><div><h3>ליבה</h3><p>רבע שעה, 3 פעמים בשבוע. היא מחזיקה את התיק ושומרת על הגב.</p></div></li>
    </ul>
  </div>
  <figure class="photo rv"><img ${pic('elbrus/20', SPLIT)} alt="שורת מטפסים עם תיקים ומקלות עולה במדרון מושלג באלברוס" loading="lazy" decoding="async"><figcaption>שורת מטפסים במדרון של אלברוס</figcaption></figure>
</div></section>

<section class="band" id="stairs"><div class="wrap">
  <div class="stairs">
    <div class="rv">
      <div class="kick">האימון שהכי עוזר על ההר</div>
      <h2>אימון מדרגות לטרק: ההר שיש לכם בבניין</h2>
      <p>תשאלו כל מי שחזר מהקילימנג׳רו מה הכי עזר לו בהכנה, ורוב הסיכויים שתשמעו "מדרגות". ביום הפסגה עולים כ־1,200 מטרים. בניין של 20 קומות נותן בערך 60 מטרים לכל עלייה. עשרים עליות כאלה, ועליתם הר.</p>
      <p>במישור קשה לחקות את מה שקורה בשביל. במדרגות זה קורה לבד: הנשימה, השרירים והקצב עובדים בדיוק כמו בעלייה בהר.</p>
      <div class="why">
        <div><svg viewBox="0 0 44 44"><rect width="44" height="44" rx="12" fill="#FAFAF8" stroke="#ECEAE4"/><path d="M10 32h7v-6h7v-6h7v-6h4" fill="none" stroke="#6D28D9" stroke-width="3" stroke-linejoin="round"/></svg><div><h3>שיפוע כמו בשביל</h3><p>שביל הררי עולה בשיפוע של 15% עד 30%, בערך כמו חדר מדרגות. השרירים לומדים בדיוק את התנועה הנכונה.</p></div></div>
        <div><svg viewBox="0 0 44 44"><rect width="44" height="44" rx="12" fill="#FAFAF8" stroke="#ECEAE4"/><path d="M14 12v20M14 32l-4-4M14 32l4-4M30 32V12M30 12l-4 4M30 12l4 4" fill="none" stroke="#6D28D9" stroke-width="3" stroke-linecap="round"/></svg><div><h3>גם הירידה חשובה</h3><p>הרבה כאבי ברכיים מגיעים דווקא בירידה מהפסגה. ירידה במדרגות מלמדת את השרירים לבלום ומגינה על הברכיים.</p></div></div>
        <div><svg viewBox="0 0 44 44"><rect width="44" height="44" rx="12" fill="#FAFAF8" stroke="#ECEAE4"/><circle cx="22" cy="22" r="10" fill="none" stroke="#6D28D9" stroke-width="3"/><path d="M22 16v6l4 3" fill="none" stroke="#6D28D9" stroke-width="3" stroke-linecap="round"/></svg><div><h3>אין תירוצים</h3><p>לא צריך לנסוע לשום מקום. חדר המדרגות בבית או בעבודה זמין בכל שעה, גם בחורף. אין בניין גבוה? מכשיר מדרגות (סטפר) בחדר הכושר או הליכון בשיפוע של 12% עד 15% עושים עבודה דומה.</p></div></div>
        <div><svg viewBox="0 0 44 44"><rect width="44" height="44" rx="12" fill="#FAFAF8" stroke="#ECEAE4"/><path d="M11 31l7-8 6 5 9-12" fill="none" stroke="#6D28D9" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg><div><h3>רואים התקדמות</h3><p>סופרים קומות. אם בשבוע הראשון עליתם 5 פעמים ובחודש השלישי 15, אתם יודעים בדיוק כמה התקדמתם.</p></div></div>
      </div>
      <h3 style="margin-top:28px">ככה מתקדמים לאורך השבועות</h3>
      <table class="stack">
        <thead><tr><th>שבועות</th><th>משך</th><th>משקל בתיק</th><th>ירידה</th></tr></thead>
        <tbody>
          <tr><td data-l="שבועות">1 עד 4</td><td data-l="משך">20 עד 30 דק׳</td><td data-l="משקל בתיק">בלי תיק</td><td data-l="ירידה">במעלית</td></tr>
          <tr><td data-l="שבועות">5 עד 8</td><td data-l="משך">30 עד 45 דק׳</td><td data-l="משקל בתיק">5 עד 8 ק״ג</td><td data-l="ירידה">חצי ברגל</td></tr>
          <tr><td data-l="שבועות">9 עד 12</td><td data-l="משך">45 עד 60 דק׳</td><td data-l="משקל בתיק">8 עד 12 ק״ג</td><td data-l="ירידה">ברגל, לאט</td></tr>
          <tr><td data-l="שבועות">13 עד 14</td><td data-l="משך">60 עד 90 דק׳</td><td data-l="משקל בתיק">12 עד 15 ק״ג</td><td data-l="ירידה">ברגל, לאט</td></tr>
        </tbody>
      </table>
      <div class="note"><b>טיפ מהשטח</b>עולים בקצב שבו אפשר לדבר, דורכים עם כל כף הרגל על המדרגה ולא מושכים את המעקה. בהתחלה יורדים במעלית כדי לתת לברכיים להתרגל, ורק אחר כך מוסיפים ירידות ברגל.</div>
    </div>
    <div class="side">
      <figure class="photo rv"><img ${pic('mera-peak/7', SIDE)} alt="מטפס הולך בעקבות בשלג בדרך לפסגת מרה פיק" loading="lazy" decoding="async"><figcaption>צעד אחרי צעד, בדרך למרה פיק</figcaption></figure>
      <div class="calc rv" aria-label="מחשבון מדרגות">
        <h3>כמה הר יש בבניין שלכם?</h3>
        <div class="stairFig"><svg id="tgStair" aria-hidden="true"></svg></div>
        <label for="tgFloors">קומות בבניין <b id="tgFloorsV">15</b></label>
        <input id="tgFloors" type="range" min="3" max="40" value="15">
        <label for="tgReps">עליות באימון <b id="tgRepsV">8</b></label>
        <input id="tgReps" type="range" min="1" max="30" value="8">
        <div class="res">
          <div><b id="tgVert">360 מ'</b><span>מטרים בעלייה</span></div>
          <div><b id="tgSteps">2,040</b><span>מדרגות בערך</span></div>
        </div>
        <div class="kili"><span id="tgKiliT"></span><div class="bar"><i id="tgKiliB" style="width:30%"></i></div></div>
        <p class="small" style="margin:12px 0 0">לפי כ־3 מטרים ו־17 מדרגות לקומה.</p>
      </div>
    </div>
  </div>
</div></section>

<section class="band soft" id="types"><div class="wrap">
  <div class="read rv">
    <h2>איזה אימונים עושים לפני טרק?</h2>
    <p>תוכנית טובה מערבבת אירובי, כוח, ליבה וגמישות, ובמרכז שלה האימונים שהכי דומים להר. זו החלוקה שאנחנו ממליצים עליה למי שמתכונן לטרק גבוה:</p>
  </div>
  <div class="rv" id="tgMix" style="max-width:820px"></div>
  <div class="types" id="tgTypes"></div>
  <div class="read rv" style="margin-top:30px">
    <h3>על הדופק, בקצרה</h3>
    <p>הטעות הכי נפוצה שאנחנו רואים: כל אימון הופך לתחרות. כדי לבנות סיבולת להר, רוב האימונים צריכים להיות באזורים 1 ו־2. אם אתם יכולים לנהל שיחה תוך כדי, אתם בדיוק בקצב הנכון.</p>
  </div>
  <div class="hr rv" id="tgHr" style="max-width:820px"></div>
  <p class="small">באחוזים מהדופק המקסימלי. בדיקת מאמץ תיתן לכם את המספרים המדויקים.</p>
</div></section>

<section class="band" id="plan"><div class="wrap">
  <div class="read rv">
    <h2>תוכנית אימונים לטרק: 16 השבועות שלפני הטיסה</h2>
    <p>ככה בנינו תוכנית אימונים לדוגמה ליעד כמו קילימנג׳רו, בסיס האוורסט או סובב אנאפורנה. יוצאים לפסגות גבוהות יותר? מאריכים כל שלב.</p>
  </div>
  <div class="phases rv">
    <div style="flex:6"><i style="opacity:.35"></i><b>בסיס</b>שבועות 1 עד 6. בונים סיבולת וכוח כללי</div>
    <div style="flex:5"><i style="opacity:.6"></i><b>בנייה</b>שבועות 7 עד 11. יותר עליות, יותר משקל בתיק</div>
    <div style="flex:3"><i></i><b>שיא</b>12 עד 14. שני ימי הליכה ברצף</div>
    <div style="flex:2.4"><i style="background:#0A0818"></i><b>הורדה</b>15 עד 16. נחים ומגיעים רעננים</div>
  </div>
  <h3 class="rv" style="margin-top:34px">כמה משקל בתיק, שבוע אחרי שבוע</h3>
  <p class="small">נקודה ריקה היא שבוע קל.</p>
  <div class="fig rv"><svg id="tgPack" role="img" aria-label="משקל התיק עולה מ־4 ל־15 קילו לאורך 16 שבועות ויורד בשבועות האחרונים"></svg></div>
  <h3 class="rv" style="margin-top:40px">ושבוע אחד מתוכם, בשלב הבנייה</h3>
  <div id="tgWeek" class="rv"></div>
  <p class="small" style="margin-top:12px">זה בערך 9 עד 11 שעות בשבוע. רק מתחילים? תתחילו מחצי, זה מספיק.</p>
</div></section>

<section class="band soft" id="nepal"><div class="wrap split">
  <div class="read rv">
    <h2>אימונים לטרק בנפאל ובהימלאיה</h2>
    <p>טרק בנפאל, כמו בסיס האוורסט, סובב אנאפורנה או סובב מנאסלו, שונה מקילימנג׳רו בעיקר באורך. מדובר בשבועיים ויותר של הליכה, 5 עד 7 שעות ביום, ולא מעט ירידות. השבילים בהימלאיה מלאים במדרגות אבן, לפעמים מאות ברצף.</p>
    <p>לכן לפני נפאל אנחנו שמים עוד יותר דגש על שני דברים: ימי הליכה ארוכים ברצף, כדי שהגוף יתרגל להתאושש בין יום ליום, ואימוני מדרגות, גם בעלייה וגם בירידה.</p>
    <h3 style="margin-top:26px">ואיך מתאמנים לטרק בישראל, בלי הרים גבוהים?</h3>
    <p>את הגובה עצמו אי אפשר לאמן בארץ, ובשביל זה יש ימי התאקלמות במסלול. את כל השאר אפשר: מדרגות בבניין באמצע השבוע, ובסופי שבוע הליכות עם תיק בהרי ירושלים, בכרמל, בגליל או בשביל הנחש במצדה, שעולה כ־350 מטרים בקטע קצר ותלול.</p>
  </div>
  <figure class="photo rv"><img ${pic('everest-base-camp/10', SPLIT_WIDE)} alt="מטייל בשביל מעל אגם קרחוני באזור האוורסט בנפאל" loading="lazy" decoding="async"><figcaption>באזור האוורסט, נפאל</figcaption></figure>
</div></section>

<section class="band" id="exercises"><div class="wrap">
  <div class="read rv">
    <h2>תרגילי כוח לטרק ולטיפוס הרים</h2>
    <p>שמונה תרגילים, פעמיים בשבוע, בחדר כושר או בסלון עם תיק ובקבוקי מים במקום משקולות. בכל כרטיס יש הדמיה של התנועה, כדי שיהיה ברור איך עושים אותה.</p>
  </div>
  <div class="exs" id="tgEx"></div>
  <div class="swipe">החליקו הצידה לכל 8 התרגילים ←</div>
</div></section>

<section class="band soft" id="mistakes"><div class="wrap">
  <h2 class="rv">טעויות נפוצות בהכנה לטרק, ומה למדנו בדרך הקשה</h2>
  <div class="tips rv">
    <div><h3>קודם כל רופא</h3><p>לפני משלחת לגובה, ובטח מעל 5,000 מטרים, כדאי לעבור בדיקה ולספר לרופא לאן אתם נוסעים. מעל גיל 40 או עם רקע רפואי, תעשו גם בדיקת מאמץ.</p></div>
    <div><h3>כושר לא מגן ממחלת גבהים</h3><p>ראינו ספורטאים חזקים מאוד שהגובה הפיל. כושר עוזר להתאושש, אבל מה שבאמת שומר עליכם זו עלייה הדרגתית וימי התאקלמות, ולכן המסלולים שלנו בנויים ככה.</p></div>
    <div><h3>תתאמנו עם הנעליים של הטיול</h3><p>נעליים חדשות על ההר הן הדרך הכי מהירה לשלפוחיות. הנעליים, התיק והמקלות צריכים להיות איתכם באימונים כבר חודשים לפני.</p></div>
    <div><h3>שני ימים ברצף</h3><p>בשלב השיא, תעשו הליכה ארוכה בשישי וגם בשבת. ככה תלמדו ללכת על רגליים עייפות, וזה בדיוק מה שמרגישים ביום השלישי של טרק.</p></div>
    <div><h3>לא לשרוף את עצמכם בסוף</h3><p>יש נטייה להתאמן הכי חזק דווקא בשבועות האחרונים, מתוך לחץ. אל תעשו את זה. הכושר כבר שם, והשבועיים האחרונים הם בשביל להגיע רעננים.</p></div>
    <div><h3>לאכול ולישון כמו שצריך</h3><p>7 עד 9 שעות שינה ומספיק חלבון. ותתרגלו לאכול ולשתות תוך כדי הליכה, כי על ההר אין עצירות ארוכות.</p></div>
    <div><h3>כאב חד זה לא עייפות</h3><p>שרירים עייפים זה טבעי. כאב חד בברך, בקרסול או בגב זה סימן לעצור, לנוח ולהתייעץ עם פיזיותרפיסט.</p></div>
    <div><h3>גם הראש צריך אימון</h3><p>יום הפסגה מתחיל באמצע הלילה, בקור, אחרי שינה גרועה. אימון ארוך בגשם או בחושך מלמד אתכם שאתם מסוגלים להמשיך גם כשלא נוח.</p></div>
  </div>
  <div class="gallery rv">
    <figure class="photo"><img ${pic('elbrus/17', GALLERY_MAIN)} alt="מטפסים עם פנסי ראש בלילה במדרון מושלג באלברוס" loading="lazy" decoding="async"><figcaption>יציאה לפסגה באמצע הלילה, אלברוס</figcaption></figure>
    <figure class="photo"><img ${pic('mera-peak/11', GALLERY)} alt="מטפס עם תיק גדול ומקלות הולך בשלג" loading="lazy" decoding="async"><figcaption>מרה פיק</figcaption></figure>
    <figure class="photo"><img ${pic('peaks-of-balkan/5', GALLERY_WIDE)} alt="שלושה מטיילים ליד צלב על פסגה סלעית בבלקן" loading="lazy" decoding="async"><figcaption>פסגות הבלקן</figcaption></figure>
  </div>
  <div class="warn read">המדריך הזה הוא הכוונה כללית, לא ייעוץ רפואי ולא תוכנית אישית. כל גוף שונה, אז תתאימו את הנפח למצב ולניסיון שלכם.</div>
</div></section>

<section class="band soft"><div class="wrap center">
  <figure class="photo ctaImg rv"><img ${pic('elbrus/10', CTA)} alt="קבוצת מטפסים של HighAir חוגגת על השלג עם דגל החברה" loading="lazy" decoding="async"><figcaption>הקבוצה שלנו באלברוס</figcaption></figure>
  <h2 class="rv">ומה הלאה?</h2>
  <p class="lede rv">אצלנו אף אחד לא מתכונן לבד. כל מי שמצטרף למשלחת מקבל תוכנית הכנה ומדריכי הכנה, אפליקציית משתתפים, ליווי צמוד עד הטיסה וצוות מקומי מקצועי בכל יעד. יש לנו טרקים למתחילים וגם פסגות של 8,000 מטרים, ונשמח לעזור לכם למצוא את הבאה שלכם.</p>
  <div class="trips rv"><a href="/expedition/peaks-of-balkan">פסגות הבלקן</a><span>מון בלאן</span><a href="/expedition/elbrus">אלברוס</a><a href="/expedition/kilimanjaro">קילימנג׳רו</a><a href="/expedition/everest-base-camp">בסיס האוורסט</a><a href="/expedition/island-peak">איילנד פיק</a><a href="/expedition/aconcagua">אקונקגואה</a><a href="/expedition/manaslu">מנאסלו</a></div>
  <a class="btn" href="/treks">לכל המשלחות והטרקים ←</a>
</div></section>

<section class="band faq" id="faq"><div class="wrap read">
  <h2>שאלות נפוצות</h2>
  <details open><summary>כמה זמן לפני טרק צריך להתחיל להתאמן?</summary><p>לטרק בגובה 2,500 עד 4,000 מטרים מספיקים חודשיים או שלושה. לקילימנג׳רו או לבסיס האוורסט כדאי להתחיל 3 עד 6 חודשים לפני, ולפסגות של 6,000 מטרים ויותר חצי שנה עד שנה.</p></details>
  <details><summary>למה כולם מדברים על אימון מדרגות?</summary><p>כי זה הכי קרוב לשביל בהר שאפשר למצוא בעיר. המדרגות מאמנות את העלייה ואת הנשימה, והירידה בהן מכינה את הברכיים לירידה הארוכה מהפסגה.</p></details>
  <details><summary>קרוספיט מתאים כהכנה לטיפוס הרים?</summary><p>כן, כחלק מהתוכנית. הוא בונה כוח וליבה, אבל לא מחליף את האימונים הארוכים והקלים ואת ההליכות עם תיק. רק תשמרו על עצימות סבירה ואל תתאמנו קשה יום לפני הליכה ארוכה.</p></details>
  <details><summary>אם אני בכושר טוב, אני מוגן ממחלת גבהים?</summary><p>לא. כושר טוב עוזר להתמודד עם המאמץ ולהתאושש, אבל ההגנה מפני מחלת גבהים היא עלייה הדרגתית וימי התאקלמות. גם ספורטאים מצוינים חולים בה.</p></details>
  <details><summary>אני לא בכושר. אפשר לטפס לקילימנג׳רו?</summary><p>כן, אם מתחילים מספיק מוקדם. הרבה מהמשתתפים שלנו התחילו בלי שום רקע. עם 4 עד 6 חודשים של אימונים הדרגתיים, שכוללים הליכות עם תיק ומדרגות, רוב האנשים הבריאים מגיעים מוכנים.</p></details>
  <details><summary>מה עדיף לפני טרק, ריצה או הליכה?</summary><p>שתיהן טובות, אבל הליכה בעלייה עם תיק דומה הרבה יותר למה שקורה בהר. ריצה קלה מצוינת לבניית סיבולת, כל עוד רוב האימונים הם הליכות, עליות ומדרגות.</p></details>
  <details><summary>הליכון בשיפוע או מכשיר מדרגות יכולים להחליף הליכה בהר?</summary><p>באמצע השבוע כן, והם פתרון מצוין למי שגר בעיר. פעם בשבוע עדיין כדאי לצאת להליכה ארוכה בשטח, כדי להתרגל לשביל לא ישר, לירידות ולשעות ארוכות עם תיק.</p></details>
  <details><summary>אפשר להתאמן לגובה בישראל?</summary><p>את ההסתגלות לגובה עצמו אי אפשר לבנות בארץ. היא קורית במסלול, בזכות עלייה הדרגתית וימי התאקלמות. מה שכן אפשר לבנות בארץ זה סיבולת, כוח ורגליים חזקות, וזה מה שעושה את ההבדל.</p></details>
  <details><summary>כמה משקל לשים בתיק באימונים?</summary><p>מתחילים מ־4 או 5 קילו ומוסיפים לאט, עד 12 עד 15 קילו בשלב השיא. בשבועיים האחרונים לפני הטיסה מורידים שוב.</p></details>
</div></section>
</div>
`;

/* ── data blocks (the owner's, as in his page) ── */
export const ZONES = [
  { a: '2,500 עד 4,000', n: 'טרקים בגובה בינוני', o: 72, t: 'חודשיים עד שלושה', img: 'peaks-of-balkan/5', alt: 'מטיילים על פסגה סלעית בבלקן', e: 'אולימפוס, פסגות הבלקן, סקרדוס, הרי סיני' },
  { a: '4,000 עד 6,000', n: 'טרקים גבוהים ופסגות ראשונות', o: 52, t: '3 עד 6 חודשים', img: 'kilimanjaro/11', alt: 'קבוצת HighAir עם דגל ישראל ליד שלט הפסגה בקילימנג׳רו', e: 'קילימנג׳רו, אלברוס, קזבק, בסיס האוורסט, מון בלאן' },
  { a: '6,000 עד 8,000', n: 'טיפוס הרים', o: 45, t: '6 עד 9 חודשים', img: 'mera-peak/20', alt: 'מטפס במעיל כתום עם מקלות בשלג בזריחה במרה פיק', e: 'איילנד פיק, מרה פיק, אמה דבלם, אקונקגואה, פיק לנין' },
  { a: '8,000 ומעלה', n: 'הרי ה־8,000', o: 33, t: 'שנה ויותר, אחרי ניסיון בגובה', img: 'manaslu/7', alt: 'מטפס בחליפת גובה אדומה על רכס מושלג במנאסלו', e: 'מנאסלו' },
];
export const zonesHtml = () => ZONES.map(z => `<div class="zone rv"><figure class="photo"><img ${pic(z.img, ZONE)} alt="${z.alt}" loading="lazy" decoding="async"></figure><div class="in-z"><div class="alt">${z.a} מ'</div><h3>${z.n}</h3><div class="o2"><span>חמצן</span><div class="bar"><i style="width:${z.o}%"></i></div><b>כ־${z.o}%</b></div><div><b>זמן הכנה:</b> ${z.t}</div><div class="ex">${z.e}</div></div></div>`).join('');

export const MIX = [['אירובי', 'ריצה, אופניים, שחייה', 40, '#6D28D9'], ['ספציפי להר', 'מדרגות, הליכה עם תיק', 25, '#8b5cf6'], ['כוח', 'חדר כושר, קרוספיט', 20, '#0A0818'], ['ליבה', 'פילאטיס, פלאנק', 10, '#8b5cf6'], ['גמישות', 'יוגה, מוביליטי', 5, '#c4b5fd']];
export const mixHtml = () => MIX.map(m => `<div class="row"><span><b>${m[0]}</b><small>${m[1]}</small></span><div class="bar"><i style="width:${m[2] / 40 * 100}%;background:${m[3]}"></i></div><span>${m[2]}%</span></div>`).join('');

export const TYPES = [
  { n: 'אירובי, המנוע של הטרק', w: 'בגובה יש פחות חמצן, ולב וריאות מאומנים פשוט מנצלים אותו טוב יותר. זה מה שמאפשר ללכת שש או שבע שעות ביום, כמה ימים ברצף, ועדיין לקום בבוקר עם חיוך.', ex: ['ריצה קלה', 'אופניים', 'וולודרום', 'שחייה', 'חתירה', 'הליכון בשיפוע'], h: ['2 עד 4 פעמים בשבוע, 45 עד 90 דקות', 'רוב הזמן בקצב שיחה', 'פעם בשבוע אפשר אינטרוולים קצרים בעלייה'] },
  { n: 'אימון להר, הכי קרוב לדבר האמיתי', w: 'כאן נכנסות המדרגות וההליכות הארוכות עם תיק. אלה האימונים שמלמדים את הרגליים, את הגב ואת הראש איך מרגיש יום אמיתי על ההר.', ex: ['מדרגות', 'הליכות שטח עם תיק', 'עליות', 'הליכון בשיפוע 15%'], h: ['פעם בשבוע הליכה ארוכה של 3 עד 6 שעות', 'פעם או פעמיים בשבוע מדרגות עם תיק', 'מעלים משקל לאט, עד 12 עד 15 ק״ג'] },
  { n: 'כוח, כדי שהרגליים לא יגמרו', w: 'רגליים וגב חזקים מתעייפים לאט יותר, סוחבים את התיק בקלות ומגינים על הברכיים והקרסוליים. ובירידה מהפסגה, שם הרבה אנשים סובלים, תודו לעצמכם על כל סקוואט.', ex: ['חדר כושר', 'קרוספיט', 'משקולות בבית', 'TRX'], h: ['פעמיים בשבוע, 45 עד 60 דקות', 'בעיקר רגליים, ישבן וגב', 'בקרוספיט: עצימות סבירה, ולא יום לפני הליכה ארוכה'] },
  { n: 'ליבה, מה שמחזיק את התיק', w: 'הליבה מחברת בין הרגליים לגב. כשהיא חזקה, התיק לא מושך אתכם אחורה, הגב לא כואב בסוף היום, והצעדים על סלעים ושלג יציבים יותר.', ex: ['פילאטיס', 'פלאנק', 'דד באג', 'הליכת חקלאי'], h: ['3 פעמים בשבוע, 10 עד 15 דקות', 'אפשר בסוף כל אימון אחר', 'שיעור פילאטיס שבועי זו תוספת מצוינת'] },
  { n: 'גמישות, בשביל להמשיך לזוז', w: 'ירכיים וקרסוליים גמישים מאפשרים צעדים גבוהים בלי להתאמץ, ומקצרים את ההתאוששות בין ימי הליכה. וכן, גם הנשימות מהיוגה עוזרות בגובה.', ex: ['יוגה', 'מתיחות', 'מוביליטי', 'רולר'], h: ['10 דקות מוביליטי כמעט כל יום', 'שיעור יוגה פעם בשבוע', 'מתיחות קלות בסוף כל אימון'] },
];
export const typesHtml = () => TYPES.map(t => `<div class="type rv"><div><h3>${t.n}</h3><p>${t.w}</p><div>${t.ex.map(x => `<span class="tag">${x}</span>`).join('')}</div></div><div class="how"><b>איך מתאמנים</b><ul>${t.h.map(x => `<li>${x}</li>`).join('')}</ul></div></div>`).join('');

export const HR = [['אזור 1', 60, '#c4b5fd', '50% עד 60%, התאוששות'], ['אזור 2', 70, '#6D28D9', '60% עד 70%, בונה מנוע'], ['אזור 3', 80, '#8b5cf6', '70% עד 80%, קצב בינוני'], ['אזור 4', 90, '#4c1d95', '80% עד 90%, סף'], ['אזור 5', 100, '#0A0818', '90% עד 100%, מקסימום']];
export const hrHtml = () => HR.map(h => `<div class="row"><span><b>${h[0]}</b></span><div class="bar"><i style="width:${h[1]}%;background:${h[2]}"></i></div><span>${h[3]}</span></div>`).join('');

export const WEEK = [['א׳', 'מנוחה פעילה', 'יוגה או מוביליטי', '30 דק׳'], ['ב׳', 'כוח רגליים וליבה', 'עליות על ספסל, בולגרי, דדליפט רומני, פלאנק', '60 דק׳'], ['ג׳', 'אירובי אזור 2', 'ריצה קלה או אופניים בקצב שיחה', '60 דק׳'], ['ד׳', 'מדרגות עם תיק', '8 עד 10 ק״ג, עולים ברגל ויורדים לאט', '60 דק׳', 1], ['ה׳', 'כוח כללי', 'קרוספיט בעצימות מבוקרת או חדר כושר, גב וליבה', '45 דק׳'], ['ו׳', 'הליכה ארוכה בשטח', 'עליות וירידות עם תיק מלא', '3 עד 5 שע׳'], ['ש׳', 'אירובי ארוך וקל', 'אופניים, או יום הליכה שני ברצף בשלב השיא', '60 עד 90 דק׳']];
export const weekHtml = () => WEEK.map(d => `<div class="day${d[4] ? ' st' : ''}"><div class="d">${d[0]}</div><div><div class="t">${d[1]}</div><div class="m">${d[2]}</div></div><div class="dur">${d[3]}</div></div>`).join('');

/* ── exercise demos: two poses per exercise, eased back and forth ──
   joints: H S P K1 F1 K2 F2 E1 W1 E2 W2 (1 = near side, 2 = far side) */
const J = ['H', 'S', 'P', 'K1', 'F1', 'K2', 'F2', 'E1', 'W1', 'E2', 'W2'];
const pose = a => Object.fromEntries(J.map((k, i) => [k, [a[i * 2], a[i * 2 + 1]]]));
const plate = (w, r = 7) => `<circle cx="${w[0]}" cy="${w[1]}" r="${r}" fill="#6D28D9"/>`;
const bell = w => `<rect x="${w[0] - 7}" y="${w[1] - 4}" width="14" height="10" rx="3" fill="#6D28D9"/>`;
const pack = p => `<line x1="${p.S[0] - 9}" y1="${p.S[1] + 7}" x2="${p.P[0] - 9}" y2="${p.P[1] - 7}" stroke="#6D28D9" stroke-width="13" stroke-linecap="round"/>`;
const ground = '<line x1="10" y1="128" x2="210" y2="128" stroke="#E4DEF0" stroke-width="3"/>';
export const EX = [
  { id: 'step', name: 'עלייה על ספסל עם תיק', dose: '3 סטים של 12 לכל רגל', cue: 'עולים לאט', d: 'הכי קרוב לעלייה בהר שאפשר לעשות בבית. הרגל שלמעלה עושה את כל העבודה, והרגל שלמטה רק מלווה.', tips: ['ספסל בגובה הברך', 'גב זקוף, הברך מעל כף הרגל'],
    props: ground + '<rect x="108" y="100" width="64" height="28" rx="4" fill="#E9E3F7"/>',
    A: pose([98,35, 97,48, 94,78, 116,80, 124,100, 94,102, 92,128, 104,63, 106,80, 90,63, 92,80]),
    B: pose([121,9, 121,22, 120,52, 123,76, 124,100, 136,66, 132,90, 128,38, 130,55, 114,38, 116,55]),
    x: p => pack(p) },
  { id: 'split', name: 'סקוואט בולגרי', dose: '3 סטים של 8 עד 10 לכל רגל', cue: 'יורדים ישר למטה', d: 'קשה בהתחלה, ושווה כל רגע. בונה כוח בכל רגל לחוד ושיווי משקל לשבילים לא ישרים.', tips: ['הרגל האחורית על ספסל', 'הברך הקדמית לא קורסת פנימה'],
    props: ground + '<rect x="40" y="104" width="40" height="24" rx="4" fill="#E9E3F7"/>',
    A: pose([112,37, 112,50, 112,80, 126,102, 130,128, 96,102, 72,104, 114,66, 114,84, 110,66, 110,84]),
    B: pose([111,55, 110,68, 108,98, 132,106, 130,128, 98,122, 72,104, 112,84, 112,102, 108,84, 108,102]),
    x: p => bell(p.W1) },
  { id: 'rdl', name: 'דדליפט רומני', dose: '3 סטים של 10', cue: 'אגן אחורה', d: 'מחזק את הישבן, הירך האחורית והגב התחתון, השרירים שסוחבים אתכם ואת התיק בכל עלייה.', tips: ['גב ישר לאורך כל התנועה', 'המשקל צמוד לרגליים'],
    props: ground,
    A: pose([110,35, 110,48, 110,78, 112,103, 112,128, 108,103, 108,128, 112,63, 113,80, 108,63, 109,80]),
    B: pose([138,58, 126,64, 96,76, 114,102, 112,128, 110,102, 108,128, 126,82, 126,100, 122,82, 122,100]),
    x: p => plate(p.W1, 9) },
  { id: 'down', name: 'ירידה מבוקרת ממדרגה', dose: '3 סטים של 10, 3 שניות למטה', cue: 'לאט, 3 שניות', d: 'אם יש תרגיל אחד שחוסך כאבי ברכיים בירידה מהפסגה, זה הוא. כל הסוד הוא לרדת לאט.', tips: ['יורדים לאט ובשליטה', 'רק נוגעים ברצפה וחוזרים'],
    props: ground + '<rect x="60" y="104" width="60" height="24" rx="4" fill="#E9E3F7"/>',
    A: pose([95,13, 95,26, 95,56, 96,80, 96,104, 106,80, 124,96, 104,40, 116,46, 100,40, 112,46]),
    B: pose([106,38, 102,50, 94,78, 116,90, 96,104, 118,100, 136,124, 116,58, 132,58, 112,58, 128,58]) },
  { id: 'calf', name: 'הרמות עקב על מדרגה', dose: '3 סטים של 15 עד 20', cue: 'עד הסוף למעלה', d: 'שוקיים חזקות שומרות על הקרסוליים בעליות תלולות, בשלג ועם קרמפונים.', tips: ['ירידה מלאה מתחת לגובה המדרגה', 'אפשר לאחוז בקיר לאיזון'],
    props: ground + '<rect x="100" y="112" width="50" height="16" rx="3" fill="#E9E3F7"/>',
    A: pose([117,23, 117,36, 117,66, 118,90, 116,116, 116,90, 114,116, 120,52, 121,69, 114,52, 115,69]),
    B: pose([117,13, 117,26, 117,56, 118,80, 120,104, 116,80, 118,104, 120,42, 121,59, 114,42, 115,59]),
    toe: () => [132, 112] },
  { id: 'carry', name: 'הליכת חקלאי', dose: '4 פעמים 40 מטר', cue: 'כתפיים למטה', d: 'פשוט הולכים עם משקל כבד בידיים. נשמע קל, אבל זה בונה ליבה ויציבה זקופה, בדיוק כמו עם תיק כבד.', tips: ['גוף זקוף, בטן אסופה', 'צעדים קצרים ויציבים'],
    props: '',
    A: pose([110,33, 110,46, 110,76, 120,100, 128,126, 102,100, 94,126, 111,62, 112,80, 109,62, 108,80]),
    B: pose([110,31, 110,44, 110,74, 102,98, 94,126, 120,98, 128,126, 111,60, 112,78, 109,60, 108,78]),
    x: (p, t) => { const o = (t / 18) % 40; let g = ''; for (let i = -1; i < 7; i++) { const x = 220 - (i * 40 + o); g += `<line x1="${x}" y1="128" x2="${x - 20}" y2="128" stroke="#E4DEF0" stroke-width="3"/>`; } return g + bell(p.W2) + bell(p.W1); } },
  { id: 'plank', name: 'פלאנק', dose: '3 פעמים 30 עד 60 שניות', cue: 'גוף בקו ישר', d: 'הבסיס של הליבה. גוף ישר מהראש ועד העקבים, בטן אסופה, ולא לשכוח לנשום.', tips: ['האגן לא צונח ולא מתרומם', 'מרפקים מתחת לכתפיים'],
    props: ground, period: 6000,
    A: pose([48,96, 60,100, 110,104, 136,110, 162,122, 136,110, 162,122, 60,126, 82,126, 58,126, 80,126]),
    B: pose([48,95, 60,99, 110,103, 136,110, 162,122, 136,110, 162,122, 60,126, 82,126, 58,126, 80,126]),
    x: (p, t, ph) => { const sec = Math.floor(ph * 30); const a = ph * Math.PI * 2, cx = 30, cy = 30, r = 16; return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#EDE9F7" stroke-width="5"/><path d="M${cx} ${cy - r} A${r} ${r} 0 ${a > Math.PI ? 1 : 0} 1 ${cx + r * Math.sin(a)} ${cy - r * Math.cos(a)}" fill="none" stroke="#6D28D9" stroke-width="5" stroke-linecap="round"/><text x="${cx}" y="${cy + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#0A0818">${sec}</text>`; } },
  { id: 'deadbug', name: 'דד באג', dose: '3 סטים של 10 לכל צד', cue: 'גב צמוד לרצפה', d: 'נראה מצחיק, עובד מצוין. מלמד את הגב התחתון להישאר יציב בזמן שהידיים והרגליים זזות.', tips: ['יד ורגל נגדיות יחד', 'הגב התחתון לא מתרומם'],
    props: ground,
    A: pose([44,112, 58,118, 108,118, 110,94, 134,94, 106,94, 130,94, 58,100, 58,82, 56,100, 56,82]),
    B: pose([44,112, 58,118, 108,118, 110,94, 134,94, 132,112, 158,118, 40,114, 22,112, 56,100, 56,82]) },
];
export const exercisesHtml = () => EX.map(e => `<div class="exc rv"><div class="stage"><svg id="ex-${e.id}" viewBox="0 0 220 140" role="img" aria-label="הדמיה של ${e.name}"></svg><span class="cue">${e.cue}</span></div><h3>${e.name}</h3><div class="dose">${e.dose}</div><p>${e.d}</p><ul>${e.tips.map(t => `<li>${t}</li>`).join('')}</ul></div>`).join('');

const L = (a, b, w = 6, o = 1) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="currentColor" stroke-opacity="${o}" stroke-width="${w}" stroke-linecap="round"/>`;
function drawFigure(e, ph, t) {
  const k = (1 - Math.cos(ph * Math.PI * 2)) / 2;
  const p = {};
  J.forEach(j => { p[j] = [e.A[j][0] + (e.B[j][0] - e.A[j][0]) * k, e.A[j][1] + (e.B[j][1] - e.A[j][1]) * k]; });
  const toe = f => (e.toe ? e.toe(f) : [f[0] + 10, f[1]]);
  let s = e.props;
  s += L(p.P, p.K2, 6, .35) + L(p.K2, p.F2, 6, .35) + L(p.F2, toe(p.F2), 5, .35) + L(p.S, p.E2, 5, .35) + L(p.E2, p.W2, 5, .35);
  const extra = e.x ? e.x(p, t, ph) : '';
  s += L(p.S, p.P, 7) + L(p.P, p.K1) + L(p.K1, p.F1) + L(p.F1, toe(p.F1), 5) + extra + L(p.S, p.E1, 5) + L(p.E1, p.W1, 5);
  s += `<circle cx="${p.H[0]}" cy="${p.H[1]}" r="8" fill="currentColor"/>`;
  return s;
}

/* The stairs calculator's sums: 3 m and 17 steps a floor, against the 1,200 m of the
   Kilimanjaro summit day. */
export function stairs(floors, reps) {
  const v = floors * 3 * reps, st = floors * 17 * reps, pct = Math.min(100, Math.round(v / 1200 * 100));
  const kili = v >= 1200 ? `עליתם יום פסגה שלם בקילימנג׳רו (1,200 מ') ועוד ${(v - 1200).toLocaleString('en-US')} מ'` : `${pct}% מיום הפסגה בקילימנג׳רו (1,200 מ')`;
  return { vert: v.toLocaleString('en-US') + " מ'", steps: st.toLocaleString('en-US'), kili, pct };
}

/* The page's live parts, run on the element that holds MARKUP: renders the data blocks, the
   stairs calculator, the animated exercise demos, the pack chart and the scroll reveals.
   Returns the cleanup (observers, the animation frame, listeners). Animates only what is on
   screen, and nothing at all under prefers-reduced-motion. */
export function initGuide(root) {
  const $ = id => root.querySelector('#' + id);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cleanups = [];

  $('tgZones').innerHTML = zonesHtml();
  $('tgMix').innerHTML = mixHtml();
  $('tgTypes').innerHTML = typesHtml();
  $('tgHr').innerHTML = hrHtml();
  $('tgWeek').innerHTML = weekHtml();
  $('tgEx').innerHTML = exercisesHtml();

  const svgs = EX.map(e => ({ e, el: $('ex-' + e.id), vis: false }));
  svgs.forEach(o => { o.el.innerHTML = drawFigure(o.e, reduce ? .5 : 0, 0); });

  /* stair climber in the calculator */
  const stair = $('tgStair');
  function drawStair(t) {
    const W = stair.clientWidth || 300, H = stair.clientHeight || 150, n = 8, sw = (W - 40) / n, sh = (H - 30) / n;
    let d = `M20 ${H - 10}`;
    for (let i = 0; i < n; i++) d += ` h${sw} v${-sh}`;
    let s = `<path d="${d} V${H - 10} Z" fill="#FAFAF8"/><path d="${d}" fill="none" stroke="#6D28D9" stroke-width="2"/>`;
    const pos = reduce ? 4.5 : (t / 700) % n, i = Math.floor(pos), f = pos - i;
    const x = 20 + i * sw + sw * f + sw * .3, y = H - 10 - i * sh - (f > .6 ? sh * (f - .6) / .4 : 0);
    s += `<circle cx="${x}" cy="${y - 30}" r="6" fill="#0A0818"/><line x1="${x}" y1="${y - 24}" x2="${x}" y2="${y - 10}" stroke="#0A0818" stroke-width="4" stroke-linecap="round"/><line x1="${x}" y1="${y - 10}" x2="${x + 5 * Math.sin(f * 6.28)}" y2="${y}" stroke="#0A0818" stroke-width="4" stroke-linecap="round"/><line x1="${x}" y1="${y - 10}" x2="${x - 5 * Math.sin(f * 6.28)}" y2="${y}" stroke="#0A0818" stroke-width="4" stroke-linecap="round"/><rect x="${x - 9}" y="${y - 24}" width="6" height="11" rx="2" fill="#6D28D9"/>`;
    stair.innerHTML = s;
  }
  drawStair(0);
  let stairVis = false;

  /* ── stairs calculator ── */
  const floors = $('tgFloors'), reps = $('tgReps');
  function calc() {
    const f = +floors.value, r = +reps.value, out = stairs(f, r);
    $('tgFloorsV').textContent = f; $('tgRepsV').textContent = r;
    $('tgVert').textContent = out.vert;
    $('tgSteps').textContent = out.steps;
    $('tgKiliT').textContent = out.kili;
    $('tgKiliB').style.width = out.pct + '%';
  }
  floors.addEventListener('input', calc); reps.addEventListener('input', calc); calc();
  cleanups.push(() => { floors.removeEventListener('input', calc); reps.removeEventListener('input', calc); });

  /* ── pack chart ── */
  const packEl = $('tgPack');
  const kg = [4, 5, 6, 5, 7, 8, 9, 7, 10, 11, 12, 10, 13, 15, 10, 7], light = [3, 7, 11, 14, 15];
  let packShown = false;
  function drawPack() {
    const W = packEl.clientWidth, H = packEl.clientHeight; if (!W) return;
    const Lm = 36, R = 16, T = 22, B = 34, iw = W - Lm - R, ih = H - T - B, narrow = W < 520;
    const x = i => Lm + i * (iw / 15), y = v => T + ih - (v / 16) * ih;
    let s = '';
    [0, 4, 8, 12, 16].forEach(v => { s += `<line x1="${Lm}" x2="${W - R}" y1="${y(v)}" y2="${y(v)}" stroke="#ECE8F4"/><text x="${Lm - 8}" y="${y(v) + 4}" text-anchor="end" font-size="12" fill="#6B6B8A">${v}</text>`; });
    s += `<text x="${Lm}" y="12" font-size="12" fill="#6B6B8A">ק״ג</text>`;
    const line = kg.map((v, i) => `${x(i)},${y(v)}`).join(' ');
    s += `<polygon points="${Lm},${y(0)} ${line} ${x(15)},${y(0)}" fill="#6D28D9" fill-opacity=".12"/>`;
    s += `<polyline id="tgPackLine" points="${line}" fill="none" stroke="#6D28D9" stroke-width="3" pathLength="1" style="stroke-dasharray:1;stroke-dashoffset:${packShown || reduce ? 0 : 1};transition:stroke-dashoffset 1.6s ease"/>`;
    kg.forEach((v, i) => { const l = light.includes(i); s += `<circle cx="${x(i)}" cy="${y(v)}" r="${l ? 5 : 4}" fill="${l ? '#fff' : '#6D28D9'}" stroke="#6D28D9" stroke-width="2"/>`; if (!narrow || i % 3 === 0) s += `<text x="${x(i)}" y="${H - 12}" text-anchor="middle" font-size="12" fill="#6B6B8A">${i + 1}</text>`; });
    s += `<text x="${x(13)}" y="${y(15) - 12}" text-anchor="middle" font-size="13" font-weight="700" fill="#0A0818">15 ק״ג</text><text x="${W - R}" y="${H}" text-anchor="end" font-size="12" fill="#6B6B8A">שבוע</text>`;
    packEl.innerHTML = s;
  }
  const ro2 = new ResizeObserver(drawPack); ro2.observe(packEl); cleanups.push(() => ro2.disconnect());

  /* ── reveal on scroll, counters, chart draw ── */
  const counting = new Set();
  const count = el => {
    const end = +el.dataset.count, suf = el.dataset.suf || '', t0 = performance.now();
    const step = now => { counting.delete(id); const k = Math.min(1, (now - t0) / 1100); el.textContent = Math.round(end * (1 - Math.pow(1 - k, 3))) + suf; if (k < 1) { id = requestAnimationFrame(step); counting.add(id); } };
    let id = 0;
    if (reduce) el.textContent = end + suf;
    else { id = requestAnimationFrame(step); counting.add(id); }
  };
  cleanups.push(() => counting.forEach(id => cancelAnimationFrame(id)));
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target; el.classList.add('in');
    el.querySelectorAll('[data-count]').forEach(count);
    if (el.contains(packEl)) { packShown = true; const pl = root.querySelector('#tgPackLine'); if (pl) pl.style.strokeDashoffset = 0; }
    io.unobserve(el);
  }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
  root.querySelectorAll('.rv').forEach(el => io.observe(el));
  cleanups.push(() => io.disconnect());

  const vio = new IntersectionObserver(es => es.forEach(en => {
    const o = svgs.find(s => s.el === en.target); if (o) o.vis = en.isIntersecting;
    if (en.target === stair) stairVis = en.isIntersecting;
  }), { threshold: .1 });
  svgs.forEach(o => vio.observe(o.el)); vio.observe(stair);
  cleanups.push(() => vio.disconnect());

  /* ── animation loop (only what is on screen) ── */
  let raf = 0;
  if (!reduce) {
    const loop = t => {
      svgs.forEach(o => { if (o.vis) { const per = o.e.period || 2400; o.el.innerHTML = drawFigure(o.e, (t % per) / per, t); } });
      if (stairVis) drawStair(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
  }
  cleanups.push(() => cancelAnimationFrame(raf));

  return () => cleanups.forEach(f => f());
}
