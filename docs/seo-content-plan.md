# HighAir SEO + GEO content plan

The weekly SEO agent (claude.ai routine "HighAir - סוכן SEO שבועי", Sunday 08:10 Israel) works from this file.
Each week it takes the FIRST topic marked `todo`, writes it, and changes its status to `in review`
in the same branch. The owner approves; after merge the status becomes `live`.
Only the owner (or Claude in a session, on his instruction) reorders or adds topics.

## Why this plan exists (measured, 24 Oct 2026)

- Search Console, September 2026: 568 clicks, 8.79K impressions. The top queries are the brand
  ("high air", "highair", "highair expeditions"); generic searches such as "קילימנג'רו" or
  "טרק בנפאל" bring almost nobody. That generic demand is the opportunity.
- 73% of the clicks are on mobile.
- The blog has 10 posts, 6 of them news that dates. There is no evergreen guide for the questions
  people ask before booking (cost, season, route, difficulty, training, gear, altitude sickness).
- People already search the founder's name ("חן שקד"). Expert authorship is a ranking and AI-citation
  signal we are not using: every post is signed by the company.

## How every guide is written

1. Follow `BLOG_STYLE_GUIDE.md` to the letter (voice, no dashes of any kind, opening rule, blocks,
   metadata checklist, FAQ section, HighAir connection, Hebrew + English content arrays).
2. Evergreen and useful first. Answer the question in the first 2 to 3 sentences (AI engines quote
   the opening), then go deep. 1,500 to 2,500 Hebrew words.
3. Check every fact against a current source, but DO NOT name sources in the text (owner, 24 Oct
   2026: a guide by an expert, not a news report; the first guides had 15-19 "לפי ..." each). The only
   exception is a number that changes (a fee, permit price, rule): give it with its year, e.g.
   "3,000 רופי לאדם (נכון ל-2024)", at most 2 or 3 such numbers per guide, no newspaper names.
   Leave out trivia that does not help the reader decide or prepare (monthly visitor counts, a past
   year's disruption story, dates a lake was listed). Never invent numbers, quotes or experiences.
4. Our own facts come from the repo (`src/data/mockData.js`, `src/data/faqData.js`, the trip pages):
   our routes, days, group sizes, what is included, success rate as published. Do not contradict them.
5. Link the matching trip page(s) at least twice (`/expedition/<slug>`), and 2 to 3 related guides.
6. End with a FAQ section of 4 to 6 real questions (the style guide's FAQ format) and a CTA to the trip.
7. Images: ONLY photos that already exist in `public/images/` (our own, copyright-stamped). Never
   stock, never press, never generated. Reuse the destination's card/hero images if needed.
8. Category `מדריכים` / `Guides`. New post goes at the top of `POSTS` in `src/data/blogData.js`.
   Sign every guide as Chen Shaked: `author: 'חן שקד'` and `authorId: 'chen-shaked'` (src/data/authors.js;
   a plain-text byline, no author page). Guides show no date on the site (only news does), so never
   write "today" or "this week" in a guide; keep `dateIso` / `dateModified` accurate for the schema.
   Hebrew: התאקלמות, never אקלום; להעפיל, never לכבוש (BLOG_STYLE_GUIDE.md §2.1).
9. Travel warnings (owner, 25 Oct 2026: "אל תפחיד את הקורא"): one neutral line only, e.g. "כמו לפני
   כל נסיעה לחו״ל, כדאי לבדוק את המלצות המסע העדכניות לישראלים ולוודא שביטוח הנסיעות מכסה את
   המסע". No warning levels, no warning section, no warning FAQ. Never call a destination safe.
10. Guiding: local guides, no Hebrew guiding and no Israeli guide or escort on any destination; say it
   once in the body and in the FAQ ("האם יש הדרכה בעברית?").
11. Card description (`excerpt`): 135 to 145 characters in Hebrew (owner, 25 Oct 2026). The cards show
   exactly 3 lines, and this length fills 3 lines on every phone width without leaving a 2-line card.
12. Title: one line on every card (owner, 25 Oct 2026): at most 32 characters in Hebrew and in English.
   Guides: "<topic>: המדריך המלא" / "<Topic>: Full Guide". News: "<name>: <what happened>".
   Category is `מדריכים` / `Guides` or `חדשות` / `News` only. The section is called מגזין / Magazine.
   Facts the owner set (24 Oct 2026): climbs are led by LOCAL guides in English. There is NO Hebrew
   guiding and NO Israeli guide or escort on any destination. Never write otherwise; say it plainly
   where a reader would ask (the kosher guide has an FAQ for it).
9. Run `npm test` and `npm run build`; both must pass.

## Topic queue (in order)

Order set 24 Oct 2026 from a Hebrew SERP study (27 core queries, HighAir present in 5): first
where HighAir has something nobody else answers well in Hebrew, then where only English pages rank.
Reordered 24 Oct 2026 (owner: content on EVERY destination): one full guide per destination first,
season-led (winter destinations and Nepal spring before summer peaks), then the cross-destination topics.
The agent takes the first `todo` row in TABLE order (the # column is only an id).

| # | Status | Topic (Hebrew working title) | Why | Links to |
|---|--------|------------------------------|-----|----------|
| 1 | live | טיפוס לקילימנג'רו כשר: שבת, כשרות ותפילה על ההר | unique product, HighAir absent for "קילימנג'רו כשר" | kilimanjaro-kosher, kilimanjaro |
| 9 | live | טרק לאוורסט בייס קמפ: המדריך המלא | core query, HighAir absent | everest-base-camp |
| 14 | live | טיפוס לאקונקגואה: המדריך המלא | Hebrew results are trip reports | aconcagua |
| 28 | live | טיפוס לקילימנג'רו: המדריך המלא | main product, no deep Hebrew guide | kilimanjaro, kilimanjaro-kosher |
| 22 | live | טרק סובב אנאפורנה: המדריך המלא | only a comparison exists (#4) | annapurna |
| 29 | live | טיפוס למרה פיק: המדריך המלא | first peak above 6,000 m, English results only | mera-peak |
| 18 | live | טיפוס לאלברוס: המדריך המלא | trip pages rank, no deep guide | elbrus |
| 27 | live | טיפוס לקזבק: המדריך המלא | only in the comparison (#15), English results dominate | kazbek |
| 21 | live | טרק להר הגבוה בסיני: המדריך המלא | new destination, winter season, no Hebrew guide | sinai |
| 13 | live | טרק סימיאן ודנקיל באתיופיה: המדריך המלא | thin Hebrew coverage | ethiopia |
| 11 | live | טיפוס להר קניה: המדריך המלא בעברית | Hebrew search returns English only | mount-kenya |
| 19 | live | פסגות הבלקן: טרק בשלוש מדינות | thin Hebrew coverage | peaks-of-balkan |
| 12 | live | טיפוס לאולימפוס: המדריך המלא בעברית | Hebrew search returns English only | olympus |
| 10 | live | מנסלו סירקיט: המדריך המלא בעברית | Hebrew search returns English only | manaslu-circuit, manaslu |
| 30 | live | טיפוס לאיילנד פיק: המדריך המלא | technical first 6,000 m peak, English results only | island-peak |
| 25 | live | טיפוס ללנין פיק: המדריך המלא | 7,134 m, English results only | lenin-peak |
| 23 | live | טיפוס לאמא דאבלם: המדריך המלא | technical 6,812 m, English results only | ama-dablam |
| 24 | live | טיפוס להימלונג הימאל: הפסגה הראשונה מעל 7,000 מטרים | English results only | himlung-himal |
| 31 | live | טיפוס ללובוצ׳ה פיק: המדריך המלא | technical 6,119 m in the Khumbu, English results only | lobuche-peak |
| 32 | ready | טרק רכס הסקארדוס: המדריך המלא | written, waits for the trip to launch (teaser): docs/drafts/scardus-ridge-trek-guide.mjs | scardus |
| 26 | live | משלחת למנסלו: המדריך המלא | our 8,000 m expedition, no Hebrew guide | manaslu |
| 2 | todo | מסלולי הקילימנג'רו: מצ'אמה, לממשה, מרנגו ורונגאי, איזה מסלול מתאים לך | only English comparisons rank | kilimanjaro |
| 3 | todo | כמה עולה טיפוס לקילימנג'רו ב-2026-27: פירוק מלא של העלויות | Hebrew answers are old forum posts | kilimanjaro, kilimanjaro-kosher |
| 4 | todo | אוורסט בייס קמפ או אנאפורנה: איזה טרק בנפאל מתאים לך | only English comparisons rank | everest-base-camp, annapurna |
| 8 | todo | הפסגה הראשונה מעל 6,000 מטר: מרה פיק, איילנד פיק או לובוצ'ה | only English comparisons rank | mera-peak, island-peak, lobuche-peak |
| 15 | todo | אלברוס, קזבק או קילימנג'רו: איזו פסגה ראשונה מתאימה לך | only English comparisons rank | elbrus, kazbek, kilimanjaro |
| 5 | todo | מחלת גבהים וביטוח מעל 4,000 ו-6,000 מטר: מה חייבים לדעת | no Hebrew source covers insurance at altitude | kilimanjaro, everest-base-camp, mera-peak, aconcagua |
| 6 | todo | תוכנית אימונים של 12 שבועות לטרק בגובה, במסלולים בישראל | no week-by-week Hebrew plan | kilimanjaro, everest-base-camp |
| 7 | todo | מתי הכי טוב לטפס על הקילימנג'רו: עונות לפי חודשים | only English season calendars rank | kilimanjaro |
| 16 | todo | רשימת ציוד לטרק בגובה ולטיפוס לקילימנג'רו | competitors rank with lists | kilimanjaro, everest-base-camp |
| 17 | todo | הטרק הראשון שלי בחו"ל: איך בוחרים יעד לפי כושר וניסיון | first-trek intent, listicles rank | treks, climbs |
| 20 | todo | מה לשאול חברת טרקים לפני שנרשמים | "חברת טרקים מומלצת" is listicles | treks, climbs |

## Weekly visibility probe queries

טיפוס לקילימנג'רו · כמה עולה טיפוס לקילימנג'רו · מתי לטפס על הקילימנג'רו · טרק אוורסט בייס קמפ ·
טרק אנאפורנה · טרקים בנפאל · טיפוס הרים מאורגן · טרק מאורגן לחו"ל · אקונקגואה · אלברוס ·
קזבק · טרק אתיופיה · מרה פיק · מחלת גבהים · חברת טרקים מומלצת
