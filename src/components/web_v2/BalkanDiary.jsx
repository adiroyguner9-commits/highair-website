/**
 * BalkanDiary.jsx - /blog/peaks-of-the-balkans-diary
 *
 * "פסגות הבלקן: יומן מסע", the owner's article (23 Nov 2026) as he designed it: a page of its
 * own rather than BlogPost's blocks, rebuilt from the compiled preview he approved (claude.ai
 * artifact 7XKkAYbFMvrT6JKsVkDEgS, updated as Xcy4urDSX8buPxgzgjkiHB), section by section: the
 * hero, the trek at a glance, chapter 0 (thanks, the region, the preparation), the nine nights,
 * the nine days beside a route map that fills in as you read, the flip cards, the vibe, what
 * awaits you, the call to the next trek and a photo viewer.
 *
 * The words are in src/data/balkanDiary.js (the owner's Hebrew; English for the en. site), the
 * styles in balkanDiary.css (the preview's own, every rule under .bd). main.jsx gives this
 * address its own route, which wins over /blog/:slug. The post is in blogData.js (customPage)
 * for the magazine list, the sitemap and the static page, whose pre-hero paints this page's
 * hero (scripts/generate-html-shells.mjs, 'diary'); the schema lives there, as for every post.
 */
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../../website/usePageMeta.js';
import { hasPage } from '../../website/lang.js';
import { srcSetOf } from '../../website/imageVariants.js';
import { blogLang } from '../../data/blogLang.js';
import {
  DIARY_SLUG, ICONS, PHOTO_SIZE, COUNTRY_COLOR, MAP_STOPS, MAP_ROUTE, HERO_PHOTO, CTA_PHOTO,
  TRIP_PATH, GUIDE_PATH, diaryImg, diaryText, shortPlace, allPhotos, photoPos,
} from '../../data/balkanDiary.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import './balkanDiary.css';

const SITE = 'https://www.highair-expeditions.com';

function Icon({ n, s = 22 }) {
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={ICONS[n]} />
    </svg>
  );
}

/* A photo of the page: its own size, centred where the owner set it when cropped (photoPos), and
   the 800px copy for a screen that needs no more (scripts/gen-image-variants.mjs); below the
   first screen, so it loads as the reader nears it. */
function Photo({ id, alt, sizes }) {
  const src = diaryImg(id);
  const srcSet = srcSetOf(src);
  const [w, h] = PHOTO_SIZE[id];
  return <img loading="lazy" decoding="async" src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined} width={w} height={h} alt={alt} style={{ objectPosition: photoPos(id) }} />;
}
/* How wide the photos are drawn (balkanDiary.css): the article column is 90vw up to 1020px
   (the map goes above it), beside the map about 580px. The small photos: four in two rows of two,
   else all in one row; on a phone two abreast, three as one wide and two below. */
const COVER_SIZES = '(max-width: 1020px) 90vw, 580px';
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

function Glance({ T }) {
  const g = T.glance;
  return (
    <section className="bd-in" aria-label={g.title}>
      <div className="bd-glance">
        <div className="bd-tri">
          <h2>{g.title}</h2>
          <TripointArt T={T} />
        </div>
        <div className="bd-tiles">
          {g.tiles.map(([icon, figure, unit, what]) => (
            <div className="bd-tile" key={what}>
              <span className="ic"><Icon n={icon} /></span>
              <b>{figure}<small>{unit}</small></b>
              <span>{what}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Chapter 0: before we set out ─────────────────────────────────────── */

const INITIAL_COLORS = ['#6D28D9', '#8B5CF6', '#4C1D95', '#7C3AED'];

function Prologue({ T }) {
  const P = T.prologue;
  return (
    <section className="bd-pro" aria-labelledby="bd-pro-h">
      <div className="bd-in">
        <span className="bd-kicker">{P.kicker}</span>
        <h2 id="bd-pro-h">{P.h2}</h2>
        <p className="lead">{P.lead}</p>

        <div className="bd-letter">
          <div className="bd-lhero">
            <Photo id={P.letter.photo} alt={P.letter.alt} sizes="(max-width: 1180px) 90vw, 1040px" />
            <div className="in">
              <span className="k">{P.letter.kicker}</span>
              <p className="q">{P.letter.quote}</p>
              <span className="sig">
                <span className="bd-av">{T.hero.initials}</span>
                <span><b>{T.hero.author}</b><small>{P.letter.sigNote}</small></span>
              </span>
            </div>
          </div>
          <div className="bd-lbody">
            <h3 className="ttl">{P.thanksTitle}</h3>
            <div className="bd-thx">
              {P.thanks.map(([icon, who, why]) => (
                <div className="c" key={who}>
                  <span className="ic"><Icon n={icon} s={22} /></span>
                  <b>{who}</b>
                  <p>{why}</p>
                </div>
              ))}
            </div>
            <div className="bd-group">
              <div className="gh">
                <span className="ic"><Icon n="users" s={22} /></span>
                <div><b>{P.group.title}</b><small>{P.group.note}</small></div>
              </div>
              <div className="names">
                {P.group.names.map((name, i) => (
                  <span key={name}><i style={{ background: INITIAL_COLORS[i % 4] }}>{name[0]}</i>{name}</span>
                ))}
              </div>
              <p>{P.group.quote}</p>
            </div>
            <div className="bd-moments">
              <b>{P.moments.title}</b>
              <ul>{P.moments.items.map(m => <li key={m}><Icon n="star" s={15} />{m}</li>)}</ul>
              <p className="end">{P.moments.end}</p>
            </div>
          </div>
        </div>

        <div className="bd-geo">
          <div className="ph">
            <Photo id={P.geo.photo} alt={P.geo.alt} sizes="(max-width: 820px) 90vw, (max-width: 1180px) 42vw, 480px" />
          </div>
          <div className="tx">
            <span className="bd-kicker">{P.geo.kicker}</span>
            <h3>{P.geo.h3}</h3>
            {P.geo.paras.map((p, i) => <p key={i}>{p}</p>)}
            <ul>{P.geo.facts.map(([icon, fact]) => <li key={fact}><Icon n={icon} s={18} />{fact}</li>)}</ul>
          </div>
        </div>

        <div className="bd-prep">
          <div className="t">
            <span className="bd-kicker">{P.prep.kicker}</span>
            <h3>{P.prep.h3}</h3>
            <p>{P.prep.p}</p>
          </div>
          <div className="bd-trail">
            <svg className="path" viewBox="0 0 1000 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M10 30 C110 4 190 56 300 30 S490 4 600 30 S790 56 990 30" fill="none" stroke="#C4B5FD" strokeWidth="2"
                strokeDasharray="3 7" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
            </svg>
            <ol>
              {P.prep.steps.map(([icon, when, what, note], i) => (
                <li key={what} className={i === P.prep.steps.length - 1 ? 'last' : ''}>
                  <span className="pin"><Icon n={icon} s={22} /><em>{i + 1}</em></span>
                  <div className="card"><small>{when}</small><b>{what}</b><p>{note}</p></div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
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

/* ── The days ────────────────────────────────────────────────────────── */

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

/* The nine days. Memoised: the page re-renders when the day in view changes, these do not. */
const DayStories = memo(function DayStories({ T, onOpen, articleRef }) {
  return (
    <article ref={articleRef}>
      {T.days.map(d => (
        <section key={d.d} className="bd-day" id={`day-${d.d}`} data-d={d.d}>
          <div className="bd-dh">
            <span className="bd-num"><small>{T.day}</small><b>{d.d}</b></span>
            <div>
              <div className="date">
                {d.date}
                <i style={{ background: COUNTRY_COLOR[d.country] }}>{T.sleep}{T.countries[d.country]}</i>
              </div>
              <h3>{d.title}</h3>
            </div>
          </div>
          <DayCover day={d} T={T} onOpen={onOpen} />
          <ul className="bd-facts">
            {d.facts.map(([icon, fact]) => <li key={fact}><Icon n={icon} s={17} />{fact}</li>)}
          </ul>
          {d.body.map((p, i) => <p key={i}>{p}</p>)}
          <DayPhotos photos={d.photos.slice(1)} T={T} onOpen={onOpen} />
          {d.know && (
            <div className="bd-know">
              <span className="ic"><Icon n="compass" /></span>
              <div><b>{T.know}</b>{d.know}</div>
            </div>
          )}
          {d.quote && <p className="bd-pull">{d.quote[0]}<small>{d.quote[1]}</small></p>}
        </section>
      ))}
    </article>
  );
});

/* ── Six things we learned: cards that flip ──────────────────────────── */

function FlipCard({ card, hint }) {
  const [on, setOn] = useState(false);
  const [icon, figure, label, back] = card;
  return (
    <button type="button" className={`bd-flip${on ? ' on' : ''}`} aria-pressed={on} onClick={() => setOn(x => !x)}>
      <span className="fi">
        <span className="f">
          <span className="top">
            <span className="ic"><Icon n={icon} s={22} /></span>
            <small>{hint}</small>
          </span>
          <b>{figure}</b>
          <span className="lb">{label}</span>
        </span>
        <span className="b">
          <span className="ic"><Icon n={icon} s={20} /></span>
          {back}
        </span>
      </span>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function BalkanDiary() {
  const { i18n } = useTranslation();
  const lang = blogLang(i18n.language);
  /* Published in Hebrew and English (src/website/blogLangs.js); elsewhere the magazine */
  const published = hasPage(lang, `/blog/${DIARY_SLUG}`);
  const T = diaryText(lang);
  const rtl = lang === 'he';
  const photos = useMemo(() => allPhotos(T), [T]);

  const [day, setDay] = useState(1);      // the day in view
  const [open, setOpen] = useState(-1);   // the photo in the viewer, by its place in `photos`
  const articleRef = useRef(null);
  const barRef = useRef(null);
  const lineRefs = useRef([]);
  const chipsRef = useRef(null);

  usePageMeta({
    title:         `${T.seoTitle} | HighAir`,
    description:   T.description,
    canonicalPath: `/blog/${DIARY_SLUG}`,
    image:         `${SITE}${diaryImg(HERO_PHOTO)}`,
    ogType:        'article',
    noIndex:       !published,
    /* no jsonLd: the article's schema is in the static page, as for every post */
  });

  /* The day in view (the chips and the map follow it), and how far the reader is: the bar
     under the header and the solid part of the route, both written straight to the page. */
  useEffect(() => {
    const article = articleRef.current;
    if (!article) return undefined;
    const io = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setDay(+e.target.dataset.d); }),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    article.querySelectorAll('.bd-day').forEach(s => io.observe(s));
    let frame = 0;
    const paint = () => {
      frame = 0;
      const doc = document.documentElement;
      if (barRef.current) barRef.current.style.transform = `scaleX(${doc.scrollTop / (doc.scrollHeight - doc.clientHeight) || 0})`;
      const box = article.getBoundingClientRect();
      const read = Math.max(0, Math.min(1, (window.innerHeight * 0.5 - box.top) / box.height));
      lineRefs.current.forEach(line => { if (line) line.style.strokeDashoffset = String(1 - read); });
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(paint); };
    window.addEventListener('scroll', onScroll, { passive: true });
    paint();
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(frame); };
  }, [published]);

  /* The chips (phones and tablets) keep the day in view centred */
  useEffect(() => {
    const nav = chipsRef.current;
    const chip = nav?.children[day - 1];
    if (nav && chip && getComputedStyle(nav).display !== 'none') {
      nav.scrollTo({ left: chip.offsetLeft - nav.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' });
    }
  }, [day]);

  /* The viewer: Escape closes, the arrows step in the page's reading direction */
  useEffect(() => {
    if (open < 0) return undefined;
    const [forward, back] = rtl ? ['ArrowLeft', 'ArrowRight'] : ['ArrowRight', 'ArrowLeft'];
    const onKey = e => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === forward) setOpen(i => (i + 1) % photos.length);
      if (e.key === back) setOpen(i => (i - 1 + photos.length) % photos.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, rtl, photos.length]);

  const openPhoto = useCallback(id => setOpen(photos.findIndex(p => p[0] === id)), [photos]);
  const goToDay = useCallback(n => document.getElementById(`day-${n}`)?.scrollIntoView({ behavior: 'smooth' }), []);

  if (!published) return <Navigate to="/blog" replace />;

  const lb = T.lightbox;
  const [prevMark, nextMark] = rtl ? ['›', '‹'] : ['‹', '›'];
  const [heroW, heroH] = PHOTO_SIZE[HERO_PHOTO];
  const [ctaW, ctaH] = PHOTO_SIZE[CTA_PHOTO];

  return (
    <>
      <Header />
      <div className="bd" dir={rtl ? 'rtl' : 'ltr'}>
        <div className="bd-prog"><i ref={barRef} /></div>

        <header className="bd-hero">
          <img src={diaryImg(HERO_PHOTO)} width={heroW} height={heroH} alt={T.hero.alt} fetchpriority="high" style={{ objectPosition: photoPos(HERO_PHOTO) }} />
          <div className="bd-in">
            <div className="bd-badges">
              {T.hero.badges.map((b, i) => <span key={b} className={i ? 'bd-badge g' : 'bd-badge'}>{b}</span>)}
            </div>
            <h1>{T.hero.h1}</h1>
            <p className="sub">{T.hero.sub}</p>
            <div className="bd-by">
              <span className="bd-av">{T.hero.initials}</span>
              <span>
                {T.hero.basedOn}<b>{T.hero.author}</b>{T.hero.role}
                <br />
                {T.hero.photos}
              </span>
            </div>
          </div>
        </header>

        <Glance T={T} />

        <div className="bd-in">
          <Link className="bd-back" to="/blog">{T.back}</Link>
          <section className="bd-intro">
            <div>
              <h2>{T.intro.h2}</h2>
              {T.intro.paras.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <blockquote className="bd-q">
              {T.intro.quote}
              <cite><span className="bd-av">{T.hero.initials}</span>{T.intro.cite}</cite>
            </blockquote>
          </section>
        </div>

        <Prologue T={T} />

        <NightsRibbon T={T} />

        <nav className="bd-chips" ref={chipsRef} aria-label={T.chipsAria}>
          {T.days.map(d => (
            <a key={d.d} href={`#day-${d.d}`} className={d.d === day ? 'on' : ''}>{T.day} {d.d} · {d.place}</a>
          ))}
        </nav>

        <div className="bd-in">
          <div className="bd-journey">
            <DayStories T={T} onOpen={openPhoto} articleRef={articleRef} />
            <RouteMap T={T} day={day} onPick={goToDay} lineRefs={lineRefs} />
          </div>
        </div>

        <section className="bd-sec" style={{ background: '#FAF9FF' }}>
          <div className="bd-in">
            <h2>{T.cards.h2}</h2>
            <p className="lead">{T.cards.lead}</p>
            <div className="bd-cards">
              {T.cards.items.map(card => <FlipCard key={card[2]} card={card} hint={T.cards.hint} />)}
            </div>
          </div>
        </section>

        <section className="bd-sec bd-vibe">
          <div className="bd-in">
            <h2>{T.vibe.h2}</h2>
            <p className="lead" style={{ maxWidth: '62ch' }}>{T.vibe.lead}</p>
            <div className="bd-calls">
              {T.vibe.calls.map(([call, story]) => (
                <div className="bd-call" key={call}><b>{call}</b><p>{story}</p></div>
              ))}
            </div>
          </div>
        </section>

        <section className="bd-sec">
          <div className="bd-in">
            <h2>{T.expect.h2}</h2>
            <div className="bd-exp">
              {T.expect.items.map(([icon, title, story]) => (
                <div key={title}>
                  <span className="ic"><Icon n={icon} /></span>
                  <b>{title}</b>
                  <p>{story}</p>
                </div>
              ))}
            </div>
            <div className="bd-test">
              <span className="bd-av">{T.hero.initials}</span>
              <p>{T.expect.quote}<small>{T.expect.cite}</small></p>
            </div>
          </div>
        </section>

        <section className="bd-ctab">
          <img loading="lazy" decoding="async" src={diaryImg(CTA_PHOTO)} width={ctaW} height={ctaH} alt="" style={{ objectPosition: photoPos(CTA_PHOTO) }} />
          <div className="bd-in">
            <span className="bd-badge">{T.cta.badge}</span>
            <h2>{T.cta.h2}</h2>
            <p>{T.cta.p}</p>
            <div className="bd-btns">
              <Link className="bd-btn w" to={TRIP_PATH}>{T.cta.trip}</Link>
              <Link className="bd-btn o" to={GUIDE_PATH}>{T.cta.guide}</Link>
            </div>
          </div>
        </section>

        <p className="bd-credit">{T.credit}</p>

        {open >= 0 && (
          <div className="bd-lb" role="dialog" aria-modal="true" aria-label={lb.aria}
            onClick={e => { if (e.target === e.currentTarget) setOpen(-1); }}>
            <button className="x" onClick={() => setOpen(-1)} aria-label={lb.close} autoFocus>✕</button>
            <button className="pv" onClick={() => setOpen(i => (i - 1 + photos.length) % photos.length)} aria-label={lb.prev}>{prevMark}</button>
            <button className="nx" onClick={() => setOpen(i => (i + 1) % photos.length)} aria-label={lb.next}>{nextMark}</button>
            <img src={diaryImg(photos[open][0])} alt={photos[open][1]} />
            <div className="cap">{photos[open][1]}</div>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
