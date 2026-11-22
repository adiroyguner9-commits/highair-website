/* BlogDiagram.jsx: the drawn figures a blog post shows with `{ type: 'diagram', name }`.

   'ama-dablam-route': the South West Ridge of Ama Dablam, base camp to summit, from the
   owner's Tali Varshavsky article (22 Nov 2026). Drawn, not a photo, so it stays sharp at
   every width and its labels are real text in the site's font, in the page's language.
   The heights are approximate, as the caption says. */

const AMA_DABLAM_LABELS = {
  he: {
    aria: 'איור של אמא דאבלם עם הרכס הדרום מערבי: בייס קמפ למטה, מחנה 1 על לוחות גרניט, ה-Yellow Tower ומחנה 2 מעליו, ה-Mushroom Ridge, מחנה 3 מתחת לקרחון התלוי והפסגה',
    base: 'בייס קמפ · 4,600', c1: 'מחנה 1 · כ-5,700', c2: 'מחנה 2 · כ-6,000', c3: 'מחנה 3 · כ-6,300',
    dablam: 'הדאבלם, הקרחון התלוי', summit: 'פסגה · 6,812',
  },
  en: {
    aria: 'Drawing of Ama Dablam and its South West Ridge: base camp below, Camp 1 on granite slabs, the Yellow Tower with Camp 2 above it, the Mushroom Ridge, Camp 3 below the hanging glacier, and the summit',
    base: 'Base camp · 4,600', c1: 'Camp 1 · c. 5,700', c2: 'Camp 2 · c. 6,000', c3: 'Camp 3 · c. 6,300',
    dablam: 'The Dablam, hanging glacier', summit: 'Summit · 6,812',
  },
};

function AmaDablamRoute({ lang, big }) {
  const L = AMA_DABLAM_LABELS[lang === 'he' ? 'he' : 'en'];
  const rtl = lang === 'he';
  /* The drawing was laid out for right-to-left labels; in English each label keeps its
     place by anchoring on its other end. */
  const a = side => (rtl ? side : side === 'start' ? 'end' : 'start');
  /* On a phone the drawing is about 340px wide, so its labels were 6-8px; there every label
     is at least 27 units (10px on screen, the site's floor), and Camp 1's label moves to the
     left of its point to stay inside the drawing. */
  const fs = n => (big ? Math.max(Math.round(n * 1.4), 27) : n);
  const label = { fill: '#fff', stroke: '#2b2733', strokeWidth: 4 };
  const route = 'M790 585 L730 500 L690 430 L640 360 L612 318 L585 268 L560 238 L528 200 L500 140 L463 72';
  return (
    <svg viewBox="0 0 900 620" role="img" aria-label={L.aria}
      style={{ direction: 'ltr', width: '100%', height: 'auto', display: 'block', borderRadius: '20px' }}>
      <defs>
        <linearGradient id="adr-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3b1a8f" /><stop offset="1" stopColor="#8b6be0" /></linearGradient>
        <linearGradient id="adr-rock" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#2b2733" /><stop offset="1" stopColor="#4a4456" /></linearGradient>
      </defs>
      <rect width="900" height="620" fill="url(#adr-sky)" />
      {/* far range */}
      <path d="M0 470 L90 400 L150 430 L230 360 L300 420 L360 390 L420 440 L520 380 L600 430 L680 370 L760 420 L830 380 L900 410 L900 620 L0 620Z" fill="#c9bdf0" opacity=".35" />
      {/* the mountain: shadow face, lit face, snow */}
      <path d="M120 600 L330 330 L410 170 L455 70 L470 70 L520 190 L600 300 L700 400 L860 600Z" fill="url(#adr-rock)" />
      <path d="M455 70 L470 70 L520 190 L600 300 L700 400 L860 600 L560 600 L520 420 L500 260Z" fill="#5d566b" />
      <path d="M440 100 L455 70 L470 70 L500 140 L486 175 L470 150 L458 190 L446 150 L430 170Z" fill="#fff" />
      <path d="M470 70 L520 190 L560 240 L540 250 L515 225 L500 245 L490 200 L478 160Z" fill="#f1eefa" />
      {/* the Dablam, the hanging glacier */}
      <path d="M390 205 Q420 185 450 200 L455 240 Q425 255 395 245Z" fill="#e8f3ff" stroke="#bcd6f0" strokeWidth="2" />
      {/* the Mushroom Ridge cornices */}
      <path d="M520 190 q12 -14 24 0 q12 -14 24 0 q12 -14 24 0 L600 300 L560 240Z" fill="#fff" opacity=".95" />
      <path d="M600 300 L640 330 L620 345 L590 325Z M330 330 L360 300 L370 330 L345 350Z" fill="#fff" opacity=".85" />
      {/* moraine and ground */}
      <path d="M560 600 L700 470 L760 520 L860 600Z" fill="#7b6d5f" />
      <path d="M0 600 Q450 560 900 600 L900 620 L0 620Z" fill="#e9e4f5" />
      {/* the route */}
      <path d={route} fill="none" stroke="#fff" strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" opacity=".55" />
      <path d={route} fill="none" stroke="#6D28D9" strokeWidth="3.5" strokeDasharray="9 7" strokeLinejoin="round" strokeLinecap="round" />
      {/* the Yellow Tower */}
      <rect x="620" y="330" width="22" height="34" rx="3" fill="#f2c230" stroke="#fff" strokeWidth="2" />
      <g fontFamily="'Ploni', sans-serif" fontWeight="800" fontSize={fs(19)} direction={rtl ? 'rtl' : 'ltr'} paintOrder="stroke" strokeLinejoin="round">
        <circle cx="790" cy="585" r="9" fill="#6D28D9" stroke="#fff" strokeWidth="3" />
        <text x="772" y="566" textAnchor={a('start')} {...label}>{L.base}</text>
        <circle cx="690" cy="430" r="9" fill="#6D28D9" stroke="#fff" strokeWidth="3" />
        <text x={big ? 672 : 708} y="436" textAnchor={a(big ? 'start' : 'end')} {...label}>{L.c1}</text>
        <text x="652" y="362" textAnchor={a('end')} {...label} fill="#f2c230" fontSize={fs(17)}>Yellow Tower</text>
        <circle cx="612" cy="318" r="9" fill="#6D28D9" stroke="#fff" strokeWidth="3" />
        <text x="630" y="314" textAnchor={a('end')} {...label}>{L.c2}</text>
        <text x="604" y="258" textAnchor={a('end')} {...label} fontSize={fs(16)} fontWeight="500">Mushroom Ridge</text>
        <circle cx="528" cy="200" r="9" fill="#6D28D9" stroke="#fff" strokeWidth="3" />
        <text x="436" y="176" textAnchor={a('start')} {...label}>{L.c3}</text>
        <text x="452" y="274" textAnchor={a('start')} {...label} fill="#e8f3ff" fontSize={fs(15)} fontWeight="500">{L.dablam}</text>
        <circle cx="463" cy="72" r="11" fill="#6D28D9" stroke="#fff" strokeWidth="3" />
        <text x="485" y="62" textAnchor={a('end')} {...label} fontSize={fs(22)}>{L.summit}</text>
      </g>
    </svg>
  );
}

const DIAGRAMS = { 'ama-dablam-route': AmaDablamRoute };

export default function BlogDiagram({ name, lang, big }) {
  const Figure = DIAGRAMS[name];
  return Figure ? <Figure lang={lang} big={big} /> : null;
}
