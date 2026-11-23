/**
 * EverestDiary.jsx - /blog/everest-base-camp-gokyo-diary
 *
 * "מחנה הבסיס של האוורסט ואגמי גוקיו: יומן מסע", the owner's article (23 Nov 2026), rebuilt from
 * the compiled preview he approved (claude.ai artifact PDCuSG6PegQjMUyzdoKrgq). The page is the
 * owner's diary design (diary/DiaryPage.jsx, shared with the Balkan diary); this file holds what is
 * the Everest page's own: the three high points in the glance card, the altitude chart of the 18
 * days, the map drawn from Eli's GPS tracks, the star beside the high days, the covers (an upright
 * photo is shown whole in a blurred frame) and the rows of photos at their own proportions.
 *
 * The words are in src/data/everestDiary.js (the owner's Hebrew; English for the en. site), the
 * page's own styles in diary/everest.css (every rule under .bd.ev). main.jsx gives this address
 * its own route, which wins over /blog/:slug; the post is in blogData.js (customPage, ownText).
 */
import { memo } from 'react';
import { smallOf } from '../../website/imageVariants.js';
import { DIARY_ICONS } from '../../data/diaryIcons.js';
import {
  EVEREST, EVEREST_SLUG, PHOTO_SIZE, PLACES, ROUTE_GPS, ROUTE_POINTS, MAP_LABELS, KTM_POINT, CROP_OK,
  HERO_PHOTO, CTA_PHOTO, TRIP_PATH, GUIDE_PATH, everestImg, photoPos, photoRatio, project,
} from '../../data/everestDiary.js';
import DiaryPage, { Photo, COVER_SIZES } from './diary/DiaryPage.jsx';
import './diary/everest.css';

/* The words in each language, every day with the name of the place it ends in (the chips) */
const withPlaces = T => ({ ...T, days: T.days.map(d => ({ ...d, place: T.places[d.loc].name })) });
const TEXT = { he: withPlaces(EVEREST.he), en: withPlaces(EVEREST.en) };

/* ── The trek at a glance: three high points ─────────────────────────── */

function PeaksArt({ T }) {
  const g = T.glance;
  const ridge = 'M0 190 L40 150 L80 58 L118 128 L160 96 L210 64 L252 110 L296 132 L340 98 L380 140 L420 160';
  return (
    <svg viewBox="0 0 420 210" role="img" aria-label={g.triAria}>
      <defs>
        <linearGradient id="evRf" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A78BFA" stopOpacity=".18" />
          <stop offset="1" stopColor="#A78BFA" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`${ridge} V210 H0Z`} fill="url(#evRf)" />
      <path d={ridge} fill="none" stroke="#C4B5FD" strokeOpacity=".6" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M68 86 L80 58 L92 84 L84 80 L80 86 L74 80Z M198 90 L210 64 L222 88 L214 84 L210 90 L204 84Z" fill="#fff" opacity=".55" />
      <line x1="0" y1="64" x2="420" y2="64" stroke="#fff" strokeOpacity=".12" strokeDasharray="2 5" />
      {g.peaks.map(([x, name, alt, y]) => (
        <g key={name}>
          <circle cx={x} cy={y} r="5" fill="#fff" />
          <circle cx={x} cy={y} r="11" fill="none" stroke="#fff" strokeOpacity=".22" />
          <text x={x} y={y - 22} textAnchor="middle" fill="#fff" fontSize="15" fontWeight="700" fontFamily="Mazzard, Ploni">{alt}</text>
          <text x={x} y={y - 40} textAnchor="middle" fill="#C4B5FD" fontSize="12.5" fontFamily="Ploni">{name}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── 18 days in one chart: where we slept, and the day's high point ──── */

function AltitudeProfile({ T, goToDay }) {
  const P = T.profile;
  const days = T.days;
  const rtl = T === TEXT.he;
  /* The chart is drawn for Hebrew, day 1 on the right; English mirrors it, day 1 on the left */
  const mx = x => (rtl ? x : 900 - x);
  const side = a => (rtl ? a : a === 'start' ? 'end' : 'start');
  const yOf = alt => 34 + (1 - (alt - 1000) / 4600) * 220;
  const step = 826 / days.length;
  const xOf = i => mx(842 - step * i - step / 2);
  const line = days.map((d, i) => `${i ? 'L' : 'M'}${xOf(i).toFixed(1)} ${yOf(d.sleep).toFixed(1)}`).join(' ');
  const area = `${line} L${xOf(days.length - 1)} 254 L${xOf(0)} 254Z`;
  const shortName = loc => T.places[loc].short || T.places[loc].name.split(' ')[0];
  return (
    <section className="bd-prof" aria-label={P.aria}>
      <div className="bd-in">
        <div className="bd-rh" style={{ marginBottom: 18 }}>
          <div>
            <h2>{P.h2}</h2>
            <p className="lead">{P.lead}</p>
          </div>
        </div>
        <div className="bd-chart">
          <svg viewBox="0 0 900 300" role="img" aria-label={P.svgAria}>
            <defs>
              <linearGradient id="evAr" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#8B5CF6" stopOpacity=".35" />
                <stop offset="1" stopColor="#8B5CF6" stopOpacity=".02" />
              </linearGradient>
            </defs>
            {[2000, 3000, 4000, 5000].map(alt => (
              <g key={alt}>
                <line x1={mx(16)} x2={mx(842)} y1={yOf(alt)} y2={yOf(alt)} stroke={alt === 5000 ? '#F59E0B' : '#EDE9FE'} strokeDasharray={alt === 5000 ? '4 5' : '0'} />
                <text x={mx(850)} y={yOf(alt) + 4} textAnchor={side('start')} fontSize="12" fill="#6B7280" fontFamily="Mazzard, Ploni">{alt.toLocaleString('en-US')}</text>
              </g>
            ))}
            <text x={mx(16)} y={yOf(5000) - 6} textAnchor={side('start')} fontSize="11.5" fill="#B45309" fontFamily="Ploni" fontWeight="700">{P.line5000}</text>
            <path d={area} fill="url(#evAr)" />
            <path d={line} fill="none" stroke="#6D28D9" strokeWidth="2.5" strokeLinejoin="round" />
            {days.map((d, i) => (
              <g key={d.d} className="col" onClick={() => goToDay(d.d)}>
                <rect className="hit" x={xOf(i) - step / 2} y={14} width={step} height={240} fill="transparent" rx="6" />
                {d.max > d.sleep && <line x1={xOf(i)} x2={xOf(i)} y1={yOf(d.max)} y2={yOf(d.sleep)} stroke="#C4B5FD" strokeWidth="2" strokeDasharray="2 3" />}
                {d.max > d.sleep && <circle cx={xOf(i)} cy={yOf(d.max)} r="4.5" fill="#fff" stroke="#8B5CF6" strokeWidth="2" />}
                <circle cx={xOf(i)} cy={yOf(d.sleep)} r={d.star ? 6 : 4.5} fill={d.star ? '#6D28D9' : '#fff'} stroke="#6D28D9" strokeWidth="2" />
                <text x={xOf(i)} y={272} textAnchor="middle" fontSize="12.5" fontWeight="700" fill="#1E1B4B" fontFamily="Mazzard, Ploni">{d.d}</text>
                {/* the place under each day: Latin letters run wider than the Hebrew, so the English is a size smaller */}
                <text x={xOf(i)} y={288} textAnchor="middle" fontSize={rtl ? '10.5' : '9'} fill="#6B7280" fontFamily="Ploni">{shortName(d.loc)}</text>
              </g>
            ))}
            {P.marks.map(([i, alt, label]) => (
              <text key={label} x={xOf(i)} y={yOf(alt) - 10} textAnchor="middle" fontSize="12" fontWeight="700" fill="#4C1D95" fontFamily="Ploni">{label}</text>
            ))}
          </svg>
        </div>
        <div className="bd-pleg">
          <span><i style={{ background: '#6D28D9' }} />{P.sleep}</span>
          <span><i style={{ background: '#fff', border: '2px solid #8B5CF6', width: 12, height: 12, borderRadius: '50%' }} />{P.high}</span>
          <span><i style={{ background: '#F59E0B', height: 2 }} />{P.line5000}</span>
        </div>
      </div>
    </section>
  );
}

/* ── The map, from Eli's GPS tracks ──────────────────────────────────── */

/* One contour ring of a hill */
function contour(cx, cy, r, phase) {
  const pts = [];
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2;
    const rr = r * (1 + 0.16 * Math.sin(3 * a + phase) + 0.08 * Math.sin(5 * a + phase * 2.3));
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a) * 1.2]);
  }
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < 26; i++) {
    const p0 = pts[(i - 1 + 26) % 26], p1 = pts[i], p2 = pts[(i + 1) % 26], p3 = pts[(i + 2) % 26];
    d += ` C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)} ${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)} ${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d + 'Z';
}
/* The hills: centre, number of rings, phase */
const HILLS = [[388, 55, 6, 0.3], [330, 140, 5, 1.4], [140, 90, 4, 2.2], [360, 330, 4, 0.8], [180, 250, 3, 2.9], [250, 420, 3, 1.1], [60, 300, 3, 0.5]];
const CONTOURS = HILLS.flatMap(([x, y, n, phase]) =>
  Array.from({ length: n }, (_, k) => ({ d: contour(x, y, 10 + k * 12, phase + k * 0.35), k, n })));
/* The route the purple line follows: a smooth curve through its points */
const ROUTE = (() => {
  const pts = ROUTE_POINTS.map(([lon, lat]) => project(lon, lat));
  let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(i - 1, 0)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(i + 2, pts.length - 1)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
})();
/* Where a night stop sits on the map */
const pointOf = loc => (loc === 'KTM' ? KTM_POINT : project(...PLACES[loc].ll));
/* The read part of the route: written straight to the two lines on scroll (no re-render) */
const LINE_STYLE = { strokeDashoffset: 1, transition: 'stroke-dashoffset .25s linear' };

const TrekMap = memo(function TrekMap({ T, day, onPick, lineRefs }) {
  const m = T.map;
  const today = T.days[day - 1];
  const stops = [...new Set(T.days.map(d => d.loc))];
  const daysAt = loc => T.days.filter(d => d.loc === loc).map(d => d.d);
  const [x, y] = pointOf(today.loc);
  const name = T.places[today.loc].name;
  /* the place's label: beside the stop, on its left in the right half of the map */
  const w = name.length * 7.4 + 22;
  const lx = x > 260 ? x - 20 - w : x + 20;
  return (
    <aside className="bd-map" aria-label={m.aria}>
      <div className="hd"><b>{m.title}</b><span>{m.hint}</span></div>
      <svg viewBox="0 0 420 600" role="img" aria-label={m.svgAria}>
        <defs>
          <linearGradient id="evLand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#FCFBF7" />
            <stop offset="1" stopColor="#F2EEE6" />
          </linearGradient>
          <radialGradient id="evHill">
            <stop offset="0" stopColor="#E3D8C4" />
            <stop offset="1" stopColor="#E3D8C4" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="evRoute" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor="#8B5CF6" />
            <stop offset="1" stopColor="#4C1D95" />
          </linearGradient>
          <filter id="evGl" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id="evPs" x="-40%" y="-60%" width="180%" height="220%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#4C1D95" floodOpacity=".3" />
          </filter>
        </defs>
        <rect width="420" height="600" fill="url(#evLand)" />
        {HILLS.map(([hx, hy, n], i) => <ellipse key={i} cx={hx} cy={hy} rx={n * 20} ry={n * 22} fill="url(#evHill)" />)}
        <g fill="none" stroke="#A8551B">
          {CONTOURS.map((c, i) => <path key={i} d={c.d} strokeOpacity={0.07 + (c.n - c.k) * 0.03} strokeWidth={c.k === c.n - 1 ? 1 : 0.8} />)}
        </g>
        {/* the Khumbu and Ngozumpa glaciers, and a Gokyo lake */}
        <path d="M290 40 C280 70 262 100 250 140 C244 160 238 170 232 180" fill="none" stroke="#D7E6EE" strokeWidth="14" strokeLinecap="round" opacity=".9" />
        <path d="M58 40 C60 80 62 120 66 170 C70 210 76 240 82 262" fill="none" stroke="#D7E6EE" strokeWidth="16" strokeLinecap="round" opacity=".9" />
        <ellipse cx="34" cy="122" rx="9" ry="14" fill="#9FD3E4" />
        {/* Eli's GPS tracks, thin; the route dotted all the way, drawn solid as far as the reader has read */}
        <path d={ROUTE_GPS} fill="none" stroke="#B9AED6" strokeWidth="1" strokeOpacity=".9" />
        <path d={ROUTE} fill="none" stroke="#C4B5FD" strokeWidth="2" strokeDasharray="1.5 5" strokeLinecap="round" />
        <path ref={el => { lineRefs.current[0] = el; }} d={ROUTE} pathLength="1" fill="none" stroke="#8B5CF6" strokeWidth="8" strokeOpacity=".3"
          filter="url(#evGl)" strokeDasharray="1" strokeLinecap="round" style={LINE_STYLE} />
        <path ref={el => { lineRefs.current[1] = el; }} d={ROUTE} pathLength="1" fill="none" stroke="url(#evRoute)" strokeWidth="3.5"
          strokeLinejoin="round" strokeLinecap="round" strokeDasharray="1" style={LINE_STYLE} />
        <g fontFamily="Ploni" fontSize="11.5" fill="#57506A" fontWeight="600">
          {MAP_LABELS.map(([key, ll, anchor]) => {
            const [px, py] = project(...ll);
            return (
              <g key={key}>
                <path d={`M${px} ${py - 7} l-7 11 h14z`} fill="#1E1B4B" />
                <text x={anchor === 'start' ? px + 10 : px - 10} y={py + 2} textAnchor={anchor}>{m.labels[key]}</text>
              </g>
            );
          })}
          <text x="88" y="214" fill="#7B93A3" fontSize="10.5">{m.glaciers[0]}</text>
          <text x="290" y="136" fill="#7B93A3" fontSize="10.5">{m.glaciers[1]}</text>
        </g>
        <g>
          <rect x="256" y="552" width="152" height="40" rx="12" fill="#fff" stroke="#E4DEFC" />
          <text x="348" y="569" textAnchor="middle" fontFamily="Ploni" fontSize="12" fontWeight="700" fill="#1E1B4B">{m.ktm[0]}</text>
          <text x="348" y="584" textAnchor="middle" fontFamily="Ploni" fontSize="10.5" fill="#6B7280">{m.ktm[1]}</text>
        </g>
        {stops.map(loc => {
          const [sx, sy] = pointOf(loc);
          const nights = daysAt(loc);
          const here = nights.includes(day);
          const n = here ? day : nights[0];
          return (
            <g key={loc} className={here ? 'stop on' : nights[0] < day ? 'stop past' : 'stop'} tabIndex="0" role="link"
              aria-label={`${T.places[loc].name}${m.stopDays}${nights.join(', ')}`}
              onClick={() => onPick(nights[0])}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onPick(nights[0]); } }}>
              <circle className="pulse" cx={sx} cy={sy} r="11" />
              <circle className="dot" cx={sx} cy={sy} r="11" />
              <text x={sx} y={sy + 4.5} textAnchor="middle">{n}</text>
            </g>
          );
        })}
        <g filter="url(#evPs)" style={{ pointerEvents: 'none' }}>
          <rect x={lx} y={y - 14} width={w} height="28" rx="14" fill="#fff" />
          <text x={lx + w / 2} y={y + 5} textAnchor="middle" fontFamily="Ploni" fontWeight="700" fontSize="13" fill="#4C1D95">{name}</text>
        </g>
      </svg>
      <div className="ft">
        <div className="t">
          <b>{m.dayOf[0]}{day}{m.dayOf[1]}</b>
          <span>{m.sleepAt[0]}{PLACES[today.loc].alt}{m.sleepAt[1]}</span>
        </div>
        <div className="bd-steps" style={{ gridTemplateColumns: `repeat(${T.days.length},1fr)` }}>
          {T.days.map(d => <i key={d.d} className={d.d <= day ? 'on' : ''} />)}
        </div>
        <p className="note">{m.note}</p>
      </div>
    </aside>
  );
});

/* ── A day: the star on a high day, its cover, its other photos ──────── */

function DayBadge({ day, T }) {
  return day.star ? <span className="star">{T.star}</span> : null;
}

/* The cover: cropped to fill, or, for an upright photo that would lose too much, whole in a
   blurred copy of itself */
function DayCover({ day, T, onOpen }) {
  const [id, caption] = day.photos[0];
  const framed = photoRatio(id) < 1.25 && !CROP_OK.has(id);
  return (
    <button type="button" className={`bd-cover${framed ? ' ev-frame' : ''}`} onClick={() => onOpen(id)} aria-label={T.zoom + caption}>
      {/* the frame: a blurred copy, so the lighter 800px file */}
      {framed && <img loading="lazy" decoding="async" className="bg" src={smallOf(everestImg(id))} alt="" aria-hidden="true" />}
      <Photo id={id} alt={caption} sizes={COVER_SIZES} className="fg" whole={framed} />
      <span className="cap">
        <i style={{ background: '#6D28D9' }} />
        {T.places[day.loc].name}{' · '}{PLACES[day.loc].alt}{T.meters}
      </span>
    </button>
  );
}

/* The day's other photos in rows, each at its own proportions: 4 as two and two, 5 as three and
   two, 6 as three and three; a photo alone in its row is kept narrow if it is upright */
const ROWS = { 1: [1], 2: [2], 3: [3], 4: [2, 2], 5: [3, 2], 6: [3, 3] };
function PhotoRows({ photos, T, onOpen }) {
  if (!photos.length) return null;
  let next = 0;
  const rows = (ROWS[photos.length] || [3, 3, 3]).map(n => photos.slice(next, (next += n)));
  return (
    <div className="ev-rows">
      {rows.map((row, i) => {
        const total = row.reduce((s, [id]) => s + photoRatio(id), 0);
        return (
          <div className="ev-row" key={i}>
            {row.map(([id, caption]) => {
              const r = photoRatio(id);
              const share = r / total;
              return (
                <button key={id} type="button" onClick={() => onOpen(id)} aria-label={T.zoom + caption}
                  style={{ flex: `${r} 1 0`, aspectRatio: String(r), maxWidth: row.length === 1 ? (r < 1 ? '55%' : r < 1.25 ? '70%' : '100%') : undefined }}>
                  <Photo id={id} alt={caption} whole sizes={`(max-width: 1020px) ${Math.round(90 * share)}vw, ${Math.round(580 * share)}px`} />
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

const EVEREST_TRIP = {
  slug: EVEREST_SLUG, text: lang => (lang === 'he' ? TEXT.he : TEXT.en), img: everestImg, size: id => PHOTO_SIZE[id], pos: photoPos, icons: DIARY_ICONS,
  heroPhoto: HERO_PHOTO, ctaPhoto: CTA_PHOTO, tripPath: TRIP_PATH, guidePath: GUIDE_PATH, proHeadingId: 'ev-pro-h', rootClass: 'ev', heroClass: 'ev',
  GlanceArt: PeaksArt, Band: AltitudeProfile, Map: TrekMap, DayBadge, Cover: DayCover, Photos: PhotoRows,
};

export default function EverestDiary() {
  return <DiaryPage trip={EVEREST_TRIP} />;
}
