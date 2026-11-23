/**
 * BalkanDiary.jsx - /blog/peaks-of-the-balkans-diary
 *
 * "פסגות הבלקן: יומן מסע", the owner's article (23 Nov 2026) as he designed it, rebuilt from the
 * compiled preview he approved (claude.ai artifact 7XKkAYbFMvrT6JKsVkDEgS, updated as
 * Xcy4urDSX8buPxgzgjkiHB). The page is the owners' diary design (diary/DiaryPage.jsx, shared with
 * the Everest diary); this file holds what is the Balkan page's own: the round flags in the
 * glance card, the nine nights ribbon, the route map across the three countries, the night's
 * country beside each date, and the day's cover and photos.
 *
 * The words are in src/data/balkanDiary.js (the owner's Hebrew; English for the en. site).
 * main.jsx gives this address its own route, which wins over /blog/:slug. The post is in
 * blogData.js (customPage) for the magazine list, the sitemap and the static page, whose
 * pre-hero paints this page's hero (scripts/generate-html-shells.mjs, 'diary').
 */
import { memo } from 'react';
import {
  DIARY_SLUG, ICONS, PHOTO_SIZE, COUNTRY_COLOR, MAP_STOPS, MAP_ROUTE, HERO_PHOTO, CTA_PHOTO,
  TRIP_PATH, GUIDE_PATH, diaryImg, diaryText, shortPlace, photoPos,
} from '../../data/balkanDiary.js';
import DiaryPage, { DiaryIcon as Icon, Photo, COVER_SIZES } from './diary/DiaryPage.jsx';

/* How wide a day's small photos are drawn (diary.css): four in two rows of two, else all in one
   row; on a phone two abreast, three as one wide and two below. */
function smallSizes(n, i) {
  const cols = n === 4 ? 2 : n;
  const phone = n === 1 || (n === 3 && i === 0) ? '90vw' : '45vw';
  return `(max-width: 600px) ${phone}, (max-width: 1020px) ${Math.round(90 / cols)}vw, ${Math.round(580 / cols)}px`;
}

/* ── The trek at a glance ────────────────────────────────────────────── */

/* The three flags, round, over the ridge line, meeting at the triple border */
function TripointArt({ T }) {
  const g = T.glance;
  const ridge = 'M0 196 C40 186 62 168 96 172 S150 150 176 148 S196 138 210 136 S236 146 262 150 S318 160 346 168 S396 184 420 188';
  return (
    <svg viewBox="0 0 420 210" role="img" aria-label={g.triAria}>
      <defs>
        <clipPath id="bdFc"><circle r="17" /></clipPath>
        <linearGradient id="bdRf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A78BFA" stopOpacity=".16" />
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${ridge} V210 H0Z`} fill="url(#bdRf)" />
      <path d={ridge} fill="none" stroke="#C4B5FD" strokeOpacity=".55" strokeWidth="1.5" strokeLinecap="round" />
      {g.triFlags.map(([code, name, x]) => (
        <g key={code}>
          <path d={`M${x} 82 C${x} 112 ${(x + 210) / 2} 118 210 128`} fill="none" stroke="#C4B5FD" strokeOpacity=".45" strokeWidth="1.2" strokeDasharray="2 5" strokeLinecap="round" />
          <g transform={`translate(${x} 38)`}>
            <circle r="21" fill="none" stroke="#fff" strokeOpacity=".22" />
            <image href={diaryImg(`flag-${code}`)} x="-26" y="-17" width="52" height="34" preserveAspectRatio="xMidYMid slice" clipPath="url(#bdFc)" />
          </g>
          <text x={x} y="78" textAnchor="middle" fill="#E9E5FF" fontSize="13" fontWeight="600" fontFamily="Ploni">{name}</text>
        </g>
      ))}
      <circle cx="210" cy="128" r="13" fill="none" stroke="#fff" strokeOpacity=".18" />
      <rect x="206" y="121" width="8" height="13" rx="2" fill="#fff" />
      <text x="210" y="170" textAnchor="middle" fill="#C4B5FD" fontSize="12" fontFamily="Ploni">{g.triCaption}</text>
    </svg>
  );
}

/* ── Nine nights: where we slept, and the days we crossed a border ───── */

function NightsRibbon({ T }) {
  const r = T.ribbon;
  const flag = <b className="fl"><Icon n="flag" s={12} /></b>;
  return (
    <section className="bd-ribbon" aria-label={r.aria}>
      <div className="bd-in">
        <div className="bd-rh">
          <div>
            <h2>{r.h2}</h2>
            <p className="lead">{r.lead}</p>
          </div>
          <div className="bd-legend">
            {Object.entries(T.countries).map(([code, name]) => (
              <span key={code}><i style={{ background: COUNTRY_COLOR[code] }} />{name}</span>
            ))}
            <span>{flag}{r.crossing}</span>
          </div>
        </div>
        <div className="bd-tl">
          <div className="bd-tlin">
            {T.days.map(d => {
              const color = COUNTRY_COLOR[d.country];
              const crossing = T.crossings[d.d];
              return (
                <a key={d.d} href={`#day-${d.d}`} className="bd-node" title={crossing ? r.crossingTitle + crossing : undefined}>
                  <span className="cross">{crossing && flag}</span>
                  <span className="dot" style={{ background: color, boxShadow: `0 0 0 6px ${color}22` }}>{d.d}</span>
                  <span className="pl">{shortPlace(d, T)}</span>
                  <span className="cn" style={{ color }}>{T.countries[d.country]}</span>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── The route map, beside the days ──────────────────────────────────── */

/* One contour ring of a hill: a wobbly closed curve around (cx, cy) */
function contour(cx, cy, r, phase) {
  const pts = [];
  for (let i = 0; i < 28; i++) {
    const a = (i / 28) * Math.PI * 2;
    const rr = r * (1 + 0.16 * Math.sin(3 * a + phase) + 0.08 * Math.sin(5 * a + phase * 2.3));
    pts.push([cx + rr * Math.cos(a) * 1.35, cy + rr * Math.sin(a)]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < 28; i++) {
    const p0 = pts[(i - 1 + 28) % 28], p1 = pts[i], p2 = pts[(i + 1) % 28], p3 = pts[(i + 2) % 28];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}
/* The hills: centre, number of rings, phase */
const HILLS = [[236, 120, 6, 0.4], [430, 84, 5, 1.7], [196, 60, 5, 2.6], [330, 214, 4, 0.9], [480, 250, 4, 3.1], [120, 150, 3, 1.2]];
const CONTOURS = HILLS.flatMap(([x, y, n, phase]) =>
  Array.from({ length: n }, (_, k) => ({ d: contour(x, y, 10 + k * 13, phase + k * 0.35), k, n })));
/* The read part of the route: written straight to the two lines on scroll (no re-render) */
const LINE_STYLE = { strokeDashoffset: 1, transition: 'stroke-dashoffset .25s linear' };

const RouteMap = memo(function RouteMap({ T, day, onPick, lineRefs }) {
  const m = T.map;
  const [x, y] = MAP_STOPS[day - 1];
  const place = T.days[day - 1].place;
  /* the place's label: beside the stop, on its left near the right edge, below it near the top */
  const w = place.length * 7.2 + 22;
  const top = y < 80, right = x > 420;
  const lx = top ? x - w / 2 : right ? x - 20 - w : x + 20;
  const ly = top ? y + 18 : y - 14;
  return (
    <aside className="bd-map" aria-label={m.aria}>
      <div className="hd"><b>{m.title}</b><span>{m.hint}</span></div>
      <svg viewBox="0 0 600 440" role="img" aria-label={m.svgAria}>
        <defs>
          <linearGradient id="bdLand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FCFBF7" />
            <stop offset="1" stopColor="#F4F1EA" />
          </linearGradient>
          <radialGradient id="bdHill">
            <stop offset="0" stopColor="#E7DCC8" />
            <stop offset="1" stopColor="#E7DCC8" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="bdRoute" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#5B21B6" />
          </linearGradient>
          <linearGradient id="bdWater" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#BFE3EE" />
            <stop offset="1" stopColor="#9FD3E4" />
          </linearGradient>
          <filter id="bdGl" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
          <filter id="bdPs" x="-40%" y="-60%" width="180%" height="220%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4C1D95" floodOpacity=".3" />
          </filter>
        </defs>
        <rect width="600" height="440" fill="url(#bdLand)" />
        {HILLS.map(([hx, hy, n], i) => <ellipse key={i} cx={hx} cy={hy} rx={n * 22} ry={n * 15} fill="url(#bdHill)" opacity=".8" />)}
        {/* Montenegro and Kosovo, tinted */}
        <path d="M0 0 H470 L402 72 L332 84 L262 112 L162 172 L92 218 L0 266Z" fill="#D97706" opacity=".05" />
        <path d="M470 0 H600 V350 L558 340 L522 266 L452 166 L402 72Z" fill="#0EA5E9" opacity=".06" />
        <g fill="none" stroke="#A8551B">
          {CONTOURS.map((c, i) => <path key={i} d={c.d} strokeOpacity={0.08 + (c.n - c.k) * 0.035} strokeWidth={c.k === c.n - 1 ? 1.1 : 0.8} />)}
        </g>
        {/* Lake Shkodra, Lake Komani, Lake Hrid */}
        <path d="M24 300 C40 280 76 292 94 318 C112 346 104 392 76 404 C46 416 14 392 12 356 C10 330 14 312 24 300Z" fill="url(#bdWater)" />
        <path d="M150 345 C200 325 240 312 270 292 S312 258 332 246" fill="none" stroke="url(#bdWater)" strokeWidth="12" strokeLinecap="round" />
        <path d="M150 345 C200 325 240 312 270 292 S312 258 332 246" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity=".7" strokeDasharray="1 8" strokeLinecap="round" />
        <ellipse cx="346" cy="48" rx="13" ry="8" fill="url(#bdWater)" />
        {/* the borders */}
        <g fill="none" stroke="#8B8398" strokeWidth="1.3" strokeDasharray="1 5" strokeLinecap="round">
          <polyline points="0,266 92,218 162,172 262,112 332,84 402,72" />
          <polyline points="402,72 452,166 522,266 558,340" />
          <polyline points="402,72 470,0" />
        </g>
        <g fontFamily="Ploni" fontWeight="700" fontSize="17" fill="#6B6478" textAnchor="middle" opacity=".55">
          <text x="110" y="104">{T.countries.ME}</text>
          <text x="400" y="392">{T.countries.AL}</text>
          <text x="530" y="160">{T.countries.XK}</text>
        </g>
        {/* the route: dotted all the way, drawn solid as far as the reader has read */}
        <path d={MAP_ROUTE} fill="none" stroke="#C4B5FD" strokeWidth="2.2" strokeDasharray="1.5 6" strokeLinecap="round" />
        <path ref={el => { lineRefs.current[0] = el; }} d={MAP_ROUTE} pathLength="1" fill="none" stroke="#8B5CF6" strokeWidth="9" strokeOpacity=".35"
          filter="url(#bdGl)" strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1" style={LINE_STYLE} />
        <path ref={el => { lineRefs.current[1] = el; }} d={MAP_ROUTE} pathLength="1" fill="none" stroke="url(#bdRoute)" strokeWidth="4"
          strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1" style={LINE_STYLE} />
        <g fontFamily="Ploni" fontSize="11.5" fill="#57506A" fontWeight="600">
          <path d="M402 60 l-7 11 h14z" fill="#1E1B4B" />
          <text x="413" y="68">{m.tripoint}</text>
          <path d="M232 120 l-7 11 h14z" fill="#1E1B4B" />
          <text x="222" y="126" textAnchor="end">{m.pass}</text>
          <text x="236" y="320" textAnchor="middle" fill="#3E8AA3">{m.lakes.komani}</text>
          <text x="58" y="432" textAnchor="middle" fill="#3E8AA3">{m.lakes.shkodra}</text>
          <text x="364" y="30" textAnchor="middle" fill="#3E8AA3">{m.lakes.hrid}</text>
        </g>
        {MAP_STOPS.map(([sx, sy], i) => {
          const n = i + 1;
          return (
            <g key={n} className={n === day ? 'stop on' : n < day ? 'stop past' : 'stop'} tabIndex="0" role="link"
              aria-label={`${T.day} ${n}: ${T.days[i].place}`}
              onClick={() => onPick(n)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(n); } }}>
              <circle className="pulse" cx={sx} cy={sy} r="12" />
              <circle className="dot" cx={sx} cy={sy} r="12" />
              <text x={sx} y={sy + 4.5} textAnchor="middle">{n}</text>
            </g>
          );
        })}
        <g filter="url(#bdPs)" style={{ pointerEvents: 'none' }}>
          <rect x={lx} y={ly} width={w} height="28" rx="14" fill="#fff" />
          <text x={lx + w / 2} y={ly + 19} textAnchor="middle" fontFamily="Ploni" fontWeight="700" fontSize="13" fill="#4C1D95">{place}</text>
        </g>
      </svg>
      <div className="ft">
        <div className="t"><b>{m.dayOf[0]}{day}{m.dayOf[1]}</b><span>{T.days[day - 1].date}</span></div>
        <div className="bd-steps">{T.days.map(d => <i key={d.d} className={d.d <= day ? 'on' : ''} />)}</div>
        <p className="note">{m.note}</p>
      </div>
    </aside>
  );
});

/* ── A day: the country it ends in, its cover, its other photos ─────── */

/* Beside the date: the country of the night */
function DayBadge({ day, T }) {
  return <i style={{ background: COUNTRY_COLOR[day.country] }}>{T.sleep}{T.countries[day.country]}</i>;
}

function DayCover({ day, T, onOpen }) {
  const [id, caption] = day.photos[0];
  return (
    <button type="button" className="bd-cover" onClick={() => onOpen(id)} aria-label={T.zoom + caption}>
      <Photo id={id} alt={caption} sizes={COVER_SIZES} />
      <span className="cap">
        <i style={{ background: COUNTRY_COLOR[day.country] }} />
        {shortPlace(day, T)}{' · '}{T.countries[day.country]}
      </span>
    </button>
  );
}

/* The day's other photos: up to four, the fourth counting the rest */
function DayPhotos({ photos, T, onOpen }) {
  if (!photos.length) return null;
  const shown = photos.slice(0, 4);
  const more = photos.length - 4;
  return (
    <div className={`bd-bento n${shown.length}`}>
      {shown.map(([id, caption], i) => (
        <button key={id} type="button" onClick={() => onOpen(id)} aria-label={T.zoom + caption}>
          <Photo id={id} alt={caption} sizes={smallSizes(shown.length, i)} />
          {i === 3 && more > 0 && <span className="more">+{more}</span>}
        </button>
      ))}
    </div>
  );
}

const BALKAN = {
  slug: DIARY_SLUG, text: diaryText, img: diaryImg, size: id => PHOTO_SIZE[id], pos: photoPos, icons: ICONS,
  heroPhoto: HERO_PHOTO, ctaPhoto: CTA_PHOTO, tripPath: TRIP_PATH, guidePath: GUIDE_PATH, proHeadingId: 'bd-pro-h',
  GlanceArt: TripointArt, Band: NightsRibbon, Map: RouteMap, DayBadge, Cover: DayCover, Photos: DayPhotos,
};

export default function BalkanDiary() {
  return <DiaryPage trip={BALKAN} />;
}
