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
  'olympus':              { title: 'טרק האולימפוס ביוון 2025 | HighAir Expeditions',                   img: '/images/cards/olympus.webp',           description: 'טרק לפסגת הר האולימפוס ביוון (2917מ׳) — 6 ימים. הר האלים עם מדריכים מקצועיים, יום קניונינג בנהר האורליאס ותרומה למלחמה בסרטן. מתאים לכל רמות כושר!' },
  'peaks-of-balkan':      { title: 'טרק פסגות הבלקן באלבניה | HighAir Expeditions',                    img: '/images/cards/peaks-of-balkan.webp',   description: 'טרק פסגות הבלקן באלבניה (2656מ׳) — 10 ימים. נופים עוצרי נשימה, כפרים מסורתיים ושבילי הרים ירוקים. מסע ייחודי עם מדריכים מנוסים ותרומה למלחמה בסרטן.' },
  'ethiopia':             { title: 'טרק הרי סימיאן ומדבר דנקיל | HighAir Expeditions',                img: '/images/cards/ethiopia.webp',          description: 'טרק הרי סימיאן ומדבר דנקיל באתיופיה (4550מ׳) — 11 ימים. אחד המסעות הנדירים בעולם: ג׳לדות, נוף וולקני ואגם חומצי. חוויה שלא תשכחו לעולם!' },
  'kazbek':               { title: 'טיפוס לקזבק בגאורגיה | HighAir Expeditions',                       img: '/images/cards/kazbek.webp',            description: 'טיפוס לקזבק (5047מ׳) בגאורגיה — 8 ימים. הר הגעש בקווקז עם כנסיות עתיקות ונוף עוצר נשימה. מסע אתגרי עם מדריכים מנוסים ותרומה למלחמה בסרטן.' },
  'manaslu':              { title: 'טרק סובב מנסלו בנפאל | HighAir Expeditions',                       img: '/images/cards/manaslu.avif',           description: 'טרק סובב מנסלו (5160מ׳) בנפאל — 16 ימים. האלטרנטיבה השקטה לאוורסט עם נופי הימלאיה מרהיבים ופחות תיירים. מדריכים ישראלים, תרומה למלחמה בסרטן.' },
  'everest-base-camp':    { title: 'טרק אוורסט בייס קמפ וגוקיו | HighAir Expeditions',                img: '/images/cards/EBC.webp',               description: 'טרק אוורסט בייס קמפ (5364מ׳) + אגמי גוקיו — 19 ימים. חוויית חיים בנפאל עם מדריכים ישראלים מנוסים. כולל אקלימציה מלאה ותרומה למלחמה בסרטן.' },
  'annapurna':            { title: 'טרק סובב אנאפורנה בנפאל | HighAir Expeditions',                   img: '/images/cards/annapurna.webp',         description: 'טרק סובב אנאפורנה (5416מ׳) בנפאל — 16 ימים. אחד הטרקים הקלאסיים ביותר בעולם דרך כפרים, יערות ונוף הימלאיה. מדריכים ישראלים.' },
  'elbrus':               { title: 'טיפוס לאלברוס — ההר הגבוה באירופה | HighAir',                     img: '/images/cards/elbrus.webp',            description: 'טיפוס לאלברוס (5642מ׳) — ההר הגבוה באירופה, אחת מ-7 הפסגות! 8 ימים. קווקז, רוסיה. מסע טיפוס עם מדריכים מקצועיים ותרומה למלחמה בסרטן.' },
  'kilimanjaro':          { title: 'טיפוס לקילימנג׳רו 2025 | HighAir Expeditions',                    img: '/images/cards/kilimanjaro.webp',       description: 'טיפוס לקילימנג׳רו (5895מ׳) — ההר הגבוה באפריקה! 9 ימים. שיעור הצלחה 94%, מדריכים ישראלים, ספארי אופציונלי. הזמינו את המקום שלכם!' },
  'kilimanjaro-kosher':   { title: 'קילימנג׳רו כשר לשומרי מסורת | HighAir Expeditions',               img: '/images/cards/kilimanjaroKosher.webp', description: 'טיפוס לקילימנג׳רו (5895מ׳) לשומרי מסורת — אוכל כשר מהדרין, 10 ימים. ספארי אופציונלי. המשלחת הכשרה המובילה מישראל לקילימנג׳רו!' },
  'lobuche-peak':         { title: 'טיפוס ללובוצ׳ה פיק בנפאל | HighAir Expeditions',                  img: '/images/cards/lobuchePeak.webp',       description: 'טיפוס ללובוצ׳ה פיק (6119מ׳) בנפאל — 19 ימים. פסגת שלג ממול אוורסט. כולל טרק בייס קמפ + ציוד טיפוס. מדריכים ישראלים ומקומיים מנוסים.' },
  'island-peak':          { title: 'טיפוס לאיילנד פיק בנפאל | HighAir Expeditions',                   img: '/images/cards/IslandPeak.webp',        description: 'טיפוס לאיילנד פיק (6189מ׳) בנפאל — 20 ימים. פסגה טכנית עם נוף ישיר על אוורסט, לוצה ונופצה. כולל טרק EBC מלא עם ציוד טיפוס מקצועי.' },
  'mera-peak':            { title: 'טיפוס למרה פיק | HighAir Expeditions',                            img: '/images/cards/MeraPeak.webp',          description: 'טיפוס למרה פיק (6476מ׳) — הפסגה הגבוהה ביותר לטיפוס טרקינג בנפאל! 19 ימים. נוף על 5 שמיניות מהפסגה. HighAir Expeditions.' },
  'aconcagua':            { title: 'טיפוס לאקונקגואה — 7 הפסגות | HighAir Expeditions',               img: '/images/cards/aconcagua.webp',         description: 'טיפוס לאקונקגואה (6961מ׳) — ההר הגבוה מחוץ לאסיה, אחת מ-7 הפסגות! 20 ימים, ארגנטינה. מסע אקספדיציה ברמה גבוהה עם HighAir Expeditions.' },
  'lenin-peak':           { title: 'טיפוס ללנין פיק — 7134מ׳ | HighAir Expeditions',                  img: '/images/cards/leninPeak.avif',         description: 'טיפוס ללנין פיק (7134מ׳) בקירגיזסטן — 20 ימים. אחת מ-7 הפסגות הסובייטיות, הנגישה מבין ה-7,000מ׳. מסע אקספדיציה מלא עם HighAir Expeditions.' },
};

/* ── Israel trails ── */
const ISRAEL_META = {
  'hermon':  { title: 'טרק חרמון | HighAir Expeditions', img: '/images/cards/Hermon.avif', description: 'טרק חרמון עם HighAir Expeditions — מסע חד יומי להר הגבוה בישראל. נוף עוצר נשימה, שלג בחורף ואוויר הרים צח. הצטרפו לקבוצה הבאה!' },
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
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
