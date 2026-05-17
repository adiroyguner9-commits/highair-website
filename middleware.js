/**
 * middleware.js — Vercel Edge Middleware for social-crawler meta injection
 *
 * Problem: React SPAs inject <title> / <meta> via JavaScript, but social
 * crawlers (WhatsApp, Facebook, Telegram, Twitter/X, LinkedIn, Slack, etc.)
 * never execute JS — they read only the raw HTML from index.html, which
 * contains only the homepage defaults.
 *
 * Solution: When a known social-crawler User-Agent hits an expedition URL,
 * return a minimal HTML shell with the correct Open Graph tags hard-coded
 * for that page. Real browsers continue to receive the normal SPA bundle.
 */

export const config = {
  // Only run on routes that have per-page meta
  matcher: ['/expedition/:slug*', '/blog/:slug*', '/israel/:slug*'],
};

/* ── Social-crawler user-agent detection ────────────────────────────── */
const BOT_RE = /whatsapp|facebookexternalhit|facebot|twitterbot|linkedinbot|slackbot|telegrambot|discordbot|applebot|googlebot|bingbot|yandexbot|duckduckbot|pinterest|vkshare|xing-contenttabreceiver/i;

const BASE_URL    = 'https://www.highair-expeditions.com';
const DEFAULT_IMG = `${BASE_URL}/og-image.jpg`;

/* ── Per-expedition SEO data (mirrors mockData.js seoTitle/seoDescription) ── */
const EXPEDITION_META = {
  'olympus':              { title: 'HighAir Expeditions | טרק לפסגת האולימפוס',           img: '/images/og/olympus.jpg',           description: 'טרק הר האולימפוס - הר האלים של יוון, 2918 מטר. 6 ימים, מסלול דרך יערות פריוניה, פסגת מיטיקאס ויום קניונינג בנהר האורליאס. קבוצה קטנה.' },
  'peaks-of-balkan':      { title: 'HighAir Expeditions | טרק פסגות הבלקן',               img: '/images/og/peaks-of-balkan.jpg',   description: 'טרק פסגות הבלקן - 2656 מטר. 10 ימים, 8 ימי הליכה דרך גבולות אלבניה, קוסובו ומונטנגרו עם לינה בגסטהאוסים ביתיים. קבוצה קטנה, נוף בלתי מוכר.' },
  'ethiopia':             { title: 'HighAir Expeditions | טרק סימיאן ומדבר דנקיל',        img: '/images/og/ethiopia.jpg',          description: 'טרק הרי סימיאן ומדבר דנקיל באתיופיה - 4550 מטר. 12 ימים, אגם לבה פעיל בארטה אלה, שקע דאלול הצבעוני, כנסיות חצובות בסלע וג׳לדות בסימיאן. ניגוד קיצוני בין מדבר להרים.' },
  'kazbek':               { title: 'HighAir Expeditions | טיפוס לקזבק',                   img: '/images/og/kazbek.jpg',            description: 'טיפוס לקזבק - הר געש כבוי בקווקז, 5054 מטר. 8 ימים בגאורגיה, מסלול דרך קרחון גרגטי ובייס קמפ ב-3650 מטר. מדריכי IFMGA, קבוצה קטנה.' },
  'manaslu':              { title: 'HighAir Expeditions | טרק סובב מנסלו',                 img: '/images/og/manaslu.jpg',           description: 'טרק סובב מנסלו - 5106 מטר בנפאל. 16 ימים, לולאה מסביב להר השמיני בגובהו בעולם דרך כפרי טיבט ומעבר לרקיה לה. פחות תיירים, נוף בלתי מוכר.' },
  'everest-base-camp':    { title: 'HighAir Expeditions | טרק אוורסט בייס קמפ',           img: '/images/og/everest-base-camp.jpg', description: 'טרק אוורסט בייס קמפ ואגמי גוקיו - 5364 מטר בנפאל. 19 ימים, בייס קמפ, קאלה פטאר, מעבר צ׳ו לה ואגמי גוקיו במסלול אחד. קבוצה עד 10 איש.' },
  'annapurna':            { title: 'HighAir Expeditions | טרק סובב אנאפורנה',              img: '/images/og/annapurna.jpg',         description: 'טרק סובב אנאפורנה - 5416 מטר בנפאל. 16 ימים, לולאה מלאה סביב אנאפורנה דרך כפרי גורקה, אגם טיליצ׳ו ומעבר תורונג לה. ירידה של 1600 מטר בצד השני.' },
  'elbrus':               { title: 'HighAir Expeditions | טיפוס לאלברוס',                 img: '/images/og/elbrus.jpg',            description: 'טיפוס לאלברוס - ההר הגבוה באירופה, 5642 מטר. 8 ימים ברוסיה, אחת מ-7 הפסגות. מסלול דרומי עם רכבל עד 3850 מטר, לינה בבקתות ויום פסגה של 10-14 שעות.' },
  'kilimanjaro':          { title: 'HighAir Expeditions | טיפוס לקילימנג׳רו',             img: '/images/og/kilimanjaro.jpg',       description: 'טיפוס לקילימנג׳רו - הפסגה הגבוהה באפריקה, 5895 מטר. מסלול מאצ׳מה 7 ימים, 5 אזורי אקלים, יציאה לפסגה בחצות. שיעור הצלחה 94%. ספארי אופציונלי.' },
  'kilimanjaro-kosher':   { title: 'HighAir Expeditions | קילימנג׳רו לשומרי מסורת',       img: '/images/og/kilimanjaro-kosher.jpg', description: 'טיפוס לקילימנג׳רו - הפסגה הגבוהה באפריקה, 5895 מטר - לשומרי מסורת. 10 ימים כולל שבת בארושה עם חב״ד, אוכל כשר מהדרין לאורך כל הטיפוס. שיעור הצלחה 94%.' },
  'lobuche-peak':         { title: 'HighAir Expeditions | טיפוס ללובוצ׳ה פיק',           img: '/images/og/lobuche-peak.jpg',      description: 'טיפוס ללובוצ׳ה פיק - 6119 מטר בנפאל. 19 ימים, פסגה ממול קרחון קומבו עם נוף ישיר על אוורסט. כולל בייס קמפ אוורסט וקאלה פטאר לפני יום הפסגה.' },
  'island-peak':          { title: 'HighAir Expeditions | טיפוס לאיילנד פיק',             img: '/images/og/island-peak.jpg',       description: 'טיפוס לאיילנד פיק - 6189 מטר בנפאל. 20 ימים, פסגה טכנית עם נוף על אוורסט, להוצה, מקאלו, צ׳ו אויו ואמה דבלאם בבת-אחת. כולל בייס קמפ אוורסט מלא.' },
  'mera-peak':            { title: 'HighAir Expeditions | טיפוס למרה פיק',                img: '/images/og/mera-peak.jpg',         description: 'טיפוס למרה פיק - הפסגה הגבוהה לטרקינג בנפאל, 6476 מטר. 19 ימים, מסלול דרך עמק הינקו, ללא טיפוס טכני. נוף על 5 שמיניות מהפסגה.' },
  'aconcagua':            { title: 'HighAir Expeditions | טיפוס לאקונקגואה',              img: '/images/og/aconcagua.jpg',         description: 'טיפוס לאקונקגואה - הפסגה הגבוהה בחצי הכדור המערבי, 6962 מטר. 20 ימים בארגנטינה, אחת מ-7 הפסגות. שלושה מחנות גובה, פרדות עד בייס קמפ. שיעור הצלחה 75%.' },
  'lenin-peak':           { title: 'HighAir Expeditions | טיפוס ללנין פיק',              img: '/images/og/lenin-peak.jpg',        description: 'טיפוס ללנין פיק - ההר הנגיש מעל 7000 מטר, 7134 מטר בקירגיזסטן. 20 ימים, שלושה מחנות גובה, בייס קמפ עם יורטות. נדרש ניסיון מעל 5500 מטר.' },
};

/* ── Israel trails ── */
const ISRAEL_META = {
  'hermon':           { title: 'HighAir Expeditions | טרק לפסגת החרמון',         img: '/images/og/hermon.jpg',   description: 'טרק לפסגת החרמון - הפסגה הגבוהה בישראל, 2040 מטר. 2 ימים כולל לינה, עלייה של 1040 מטר דרך מעלה גולני, ערב גיבוש עם ארוחה על האש וארוחת צהריים דרוזית.' },
  'yagur':            { title: 'HighAir Expeditions | טרק נחל יגור',              img: null,                      description: 'טרק נחל יגור בכרמל - יום אחד. מפלים, בריכות טבעיות ויערות אלה ואורן בנחל הציורי של הכרמל. מדריך מוסמך, ארוחת צהריים כלולה.' },
  'nimrod':           { title: 'HighAir Expeditions | טרק סובב מצודת נמרוד',     img: null,                      description: 'טרק סובב מצודת נמרוד בגולן - 815 מטר, יום אחד. מסלול מסביב לאחת ממצודות הצלבנים הגדולות בעולם עם נוף לחרמון, לגולן ולבקעת הירדן.' },
  'masada':           { title: 'HighAir Expeditions | טרק סובב מצדה',             img: null,                      description: 'טרק סובב מצדה - יום אחד. מסלול מסביב לסלע האגדי דרך נתיב הנחש ושביל הגמלים, עם נוף פנורמי לים המלח ולמדבר יהודה. מדריך מוסמך, ארוחת צהריים כלולה.' },
  'avnat':            { title: 'HighAir Expeditions | טרק מצוקי אבנת',            img: null,                      description: 'טרק מצוקי אבנת בנגב הגבוה - 1000 מטר, יום אחד מאתגר. שרשרת מצוקי גיר דרמטיים עם תצפיות פנורמיות למישורי הנגב. מדריך מוסמך, ארוחת צהריים כלולה.' },
  'great-fin':        { title: 'HighAir Expeditions | טרק הסנפיר הגדול',          img: null,                      description: 'טרק הסנפיר הגדול במכתש רמון - 2 ימים כולל לינה באוהלים. תצורת סלע ייחודית בתוך המכתש הגדול בעולם, ארוחה על האש וטרק מאתגר עם אור ראשון.' },
  'gilabon-ein-tina': { title: 'HighAir Expeditions | טרק גילבון ועין תינה',      img: null,                      description: 'טרק גילבון ועין תינה בהר הגלבוע - יום אחד. פריחת אירוסים סגולים, מעיין עין תינה ונוף לבקעת יזרעאל. עונה: פברואר-מאי. מדריך מוסמך, ארוחת צהריים כלולה.' },
  'kziv':             { title: 'HighAir Expeditions | טרק נחל כזיב',              img: null,                      description: 'טרק נחל כזיב בגליל המערבי - יום אחד. נחל רב-מים עם מפלים ובריכות רחצה, ומצודת מונפור הצלבנית. עונה: נובמבר-מרץ. מדריך מוסמך, ארוחת צהריים כלולה.' },
  'kelah':            { title: 'HighAir Expeditions | טרק נחל כלח ועין אלון',     img: null,                      description: 'טרק נחל כלח ועין אלון בגליל - יום אחד. נחל ציורי עם עצי אלון עתיקים ומעיין מפתיע בלב המסלול. מתאים לכל הגילאים. מדריך מוסמך, ארוחת צהריים כלולה.' },
  'arugot':           { title: 'HighAir Expeditions | טרק נחל ערוגות',            img: null,                      description: 'טרק נחל ערוגות במדבר יהודה - יום אחד. ערוץ ציורי עם מפלים, בריכות טבעיות ויעלים בדרך לבריכת השולמית. עונה: ספטמבר-מרץ. מדריך מוסמך.' },
  'sodom':            { title: 'HighAir Expeditions | טרק הר סדום ונחל פרצים',   img: null,                      description: 'טרק הר סדום ונחל פרצים ליד ים המלח - יום אחד. הר מורכב ממלח עם מחילות וצוקים לבנים, ונחל פרצים הדרמטי. עונה: ספטמבר-מרץ.' },
  'tzeelim-mishmar':  { title: 'HighAir Expeditions | טרק מעלה צאלים ונחל משמר', img: null,                      description: 'טרק מעלה צאלים ונחל משמר במדבר יהודה - יום אחד מאתגר. ירידה של 400 מטר בין מצוקים דרך ערוצי נחל צאלים הצרים עד לים המלח. מדריך מוסמך.' },
  'meron':            { title: 'HighAir Expeditions | טרק הר מירון',              img: null,                      description: 'טרק הר מירון - הפסגה הגבוהה בגליל, 1208 מטר. יום אחד, יערות אלה עתיקים ונוף פנורמי לכנרת, לבנון וחרמון. מדריך מוסמך, ארוחת צהריים כלולה.' },
};

function escape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHtml({ title, description, url, image, section = 'expedition', locale = 'he_IL' }) {
  const t    = escape(title);
  const d    = escape(description);
  const u    = escape(url);
  const i    = escape(image);
  const lang = locale === 'en_US' ? 'en' : 'he';
  const dir  = locale === 'en_US' ? 'ltr' : 'rtl';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <link rel="canonical" href="${u}" />

  <meta property="og:type"        content="${section === 'blog' ? 'article' : 'product'}" />
  <meta property="og:site_name"   content="HighAir Expeditions" />
  <meta property="og:title"       content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:url"         content="${u}" />
  <meta property="og:image"       content="${i}" />
  <meta property="og:locale"      content="${locale}" />

  <meta name="twitter:card"        content="summary_large_image" />
  <meta name="twitter:title"       content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image"       content="${i}" />

  <!-- Redirect real browsers to the SPA immediately -->
  <meta http-equiv="refresh" content="0; url=${u}" />
  <script>location.replace(${JSON.stringify(url)});</script>
</head>
<body>
  <p><a href="${u}">${t}</a></p>
</body>
</html>`;
}

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';

  // Non-bot browsers: pass through to the normal SPA
  if (!BOT_RE.test(ua)) {
    return;           // undefined → Vercel continues to serve index.html
  }

  const { pathname, hostname } = new URL(request.url);
  const parts = pathname.split('/').filter(Boolean);
  // parts[0] = 'expedition' | 'blog' | 'israel'
  // parts[1] = slug

  const section = parts[0];
  const slug    = parts[1] || '';
  const locale  = hostname.startsWith('en.') ? 'en_US' : 'he_IL';

  let meta = null;

  if (section === 'expedition') {
    meta = EXPEDITION_META[slug] || null;
  } else if (section === 'israel') {
    meta = ISRAEL_META[slug] || null;
  }
  // blog slugs: could add BLOG_META here if needed

  if (!meta) return;  // unknown slug → let Vercel serve index.html as usual

  const pageUrl = `${BASE_URL}/${section}/${slug}`;
  const image   = meta.img
    ? (meta.img.startsWith('http') ? meta.img : `${BASE_URL}${meta.img}`)
    : DEFAULT_IMG;

  const html = buildHtml({
    title:       meta.title,
    description: meta.description,
    url:         pageUrl,
    image,
    section,
    locale,
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type':  'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=0, must-revalidate',
    },
  });
}
