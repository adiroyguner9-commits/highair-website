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
  'olympus':              { title: 'HighAir Expeditions | טרק לפסגת האולימפוס',           img: '/images/cards/olympus.webp',           description: 'טרק הר האולימפוס - הר האלים של יוון, 2,918 מטר. 6 ימים, מסלול דרך יערות פריוניה, פסגת מיטיקאס ויום קניונינג בנהר האורליאס. קבוצה קטנה.' },
  'peaks-of-balkan':      { title: 'HighAir Expeditions | טרק פסגות הבלקן',               img: '/images/og/peaks-of-balkan.jpg',       description: 'טרק פסגות הבלקן - 2,656 מטר. 10 ימים, 8 ימי הליכה דרך גבולות אלבניה, קוסובו ומונטנגרו עם לינה בגסטהאוסים ביתיים. קבוצה קטנה, נוף בלתי מוכר.' },
  'ethiopia':             { title: 'HighAir Expeditions | טרק סימיאן ומדבר דנקיל',        img: '/images/cards/ethiopia.webp',          description: 'טרק הרי סימיאן ומדבר דנקיל באתיופיה - 4,550 מטר. 11 ימים, אגם לבה פעיל בארטה אלה, שקע דאלול הצבעוני וג׳לדות בסימיאן. ניגוד קיצוני בין מדבר להרים.' },
  'kazbek':               { title: 'HighAir Expeditions | טיפוס לקזבק',                   img: '/images/cards/kazbek.webp',            description: 'טיפוס לקזבק - הר געש כבוי בקווקז, 5,054 מטר. 8 ימים בגאורגיה, מסלול דרך קרחון גרגטי ובייס קמפ ב-3,650 מטר. מדריכי IFMGA, קבוצה קטנה.' },
  'manaslu':              { title: 'HighAir Expeditions | טרק סובב מנסלו',                 img: '/images/cards/manaslu.avif',           description: 'טרק סובב מנסלו - 5,106 מטר בנפאל. 16 ימים, לולאה מסביב להר השמיני בגובהו בעולם דרך כפרי טיבט ומעבר לרקיה לה. פחות תיירים, נוף בלתי מוכר.' },
  'everest-base-camp':    { title: 'HighAir Expeditions | טרק אוורסט בייס קמפ',           img: '/images/cards/EBC.webp',               description: 'טרק אוורסט בייס קמפ ואגמי גוקיו - 5,364 מטר בנפאל. 19 ימים, בייס קמפ, קאלה פטאר, מעבר צ׳ו לה ואגמי גוקיו במסלול אחד. קבוצה עד 10 איש.' },
  'annapurna':            { title: 'HighAir Expeditions | טרק סובב אנאפורנה',              img: '/images/cards/annapurna.webp',         description: 'טרק סובב אנאפורנה - 5,416 מטר בנפאל. 16 ימים, לולאה מלאה סביב אנאפורנה דרך כפרי גורקה, אגם טיליצ׳ו ומעבר תורונג לה. ירידה של 1,600 מטר בצד השני.' },
  'elbrus':               { title: 'HighAir Expeditions | טיפוס לאלברוס',                 img: '/images/cards/elbrus.webp',            description: 'טיפוס לאלברוס - ההר הגבוה באירופה, 5,642 מטר. 8 ימים ברוסיה, אחת מ-7 הפסגות. מסלול דרומי עם רכבל עד 3,850 מטר, לינה בבקתות ויום פסגה של 10-14 שעות.' },
  'kilimanjaro':          { title: 'HighAir Expeditions | טיפוס לקילימנג׳רו',             img: '/images/cards/kilimanjaro.webp',       description: 'טיפוס לקילימנג׳רו - הפסגה הגבוהה באפריקה, 5,895 מטר. מסלול מאצ׳מה 7 ימים, 5 אזורי אקלים, יציאה לפסגה בחצות. שיעור הצלחה 94%. ספארי אופציונלי.' },
  'kilimanjaro-kosher':   { title: 'HighAir Expeditions | קילימנג׳רו לשומרי מסורת',       img: '/images/cards/kilimanjaroKosher.webp', description: 'טיפוס לקילימנג׳רו - הפסגה הגבוהה באפריקה, 5,895 מטר - לשומרי מסורת. 10 ימים כולל שבת בארושה עם חב״ד, אוכל כשר מהדרין לאורך כל הטיפוס. שיעור הצלחה 94%.' },
  'lobuche-peak':         { title: 'HighAir Expeditions | טיפוס ללובוצ׳ה פיק',           img: '/images/cards/lobuchePeak.webp',       description: 'טיפוס ללובוצ׳ה פיק - 6,119 מטר בנפאל. 19 ימים, פסגה ממול קרחון קומבו עם נוף ישיר על אוורסט. כולל בייס קמפ אוורסט וקאלה פטאר לפני יום הפסגה.' },
  'island-peak':          { title: 'HighAir Expeditions | טיפוס לאיילנד פיק',             img: '/images/cards/IslandPeak.webp',        description: 'טיפוס לאיילנד פיק - 6,189 מטר בנפאל. 20 ימים, פסגה טכנית עם נוף על אוורסט, להוצה, מקאלו, צ׳ו אויו ואמה דבלאם בבת-אחת. כולל בייס קמפ אוורסט מלא.' },
  'mera-peak':            { title: 'HighAir Expeditions | טיפוס למרה פיק',                img: '/images/cards/MeraPeak.webp',          description: 'טיפוס למרה פיק - הפסגה הגבוהה לטרקינג בנפאל, 6,476 מטר. 19 ימים, מסלול דרך עמק הינקו, ללא טיפוס טכני. נוף על 5 שמיניות מהפסגה.' },
  'aconcagua':            { title: 'HighAir Expeditions | טיפוס לאקונקגואה',              img: '/images/cards/aconcagua.webp',         description: 'טיפוס לאקונקגואה - הפסגה הגבוהה בחצי הכדור המערבי, 6,962 מטר. 20 ימים בארגנטינה, אחת מ-7 הפסגות. שלושה מחנות גובה, פרדות עד בייס קמפ. שיעור הצלחה 75%.' },
  'lenin-peak':           { title: 'HighAir Expeditions | טיפוס ללנין פיק',              img: '/images/cards/leninPeak.avif',         description: 'טיפוס ללנין פיק - ההר הנגיש מעל 7,000 מטר, 7,134 מטר בקירגיזסטן. 20 ימים, שלושה מחנות גובה, בייס קמפ עם יורטות. נדרש ניסיון מעל 5,500 מטר.' },
};

/* ── Israel trails ── */
const ISRAEL_META = {
  'hermon':  { title: 'HighAir Expeditions | טרק לפסגת החרמון', img: '/images/cards/Hermon.avif', description: 'טרק לפסגת החרמון - הפסגה הגבוהה בישראל, 2,040 מטר. 2 ימים כולל לינה, עלייה של 1,040 מטר דרך מעלה גולני, ערב גיבוש עם ארוחה על האש וארוחת צהריים דרוזית.' },
};

function escape(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildHtml({ title, description, url, image }) {
  const t = escape(title);
  const d = escape(description);
  const u = escape(url);
  const i = escape(image);

  return `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <link rel="canonical" href="${u}" />

  <meta property="og:type"        content="website" />
  <meta property="og:site_name"   content="HighAir Expeditions" />
  <meta property="og:title"       content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:url"         content="${u}" />
  <meta property="og:image"       content="${i}" />
  <meta property="og:locale"      content="he_IL" />

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

  const { pathname } = new URL(request.url);
  const parts = pathname.split('/').filter(Boolean);
  // parts[0] = 'expedition' | 'blog' | 'israel'
  // parts[1] = slug

  const section = parts[0];
  const slug    = parts[1] || '';

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
  });

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type':  'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=0, must-revalidate',
    },
  });
}
