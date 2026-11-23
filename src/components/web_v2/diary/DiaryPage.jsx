/**
 * DiaryPage.jsx - the owner's trek diaries, one design for all of them.
 *
 * The Balkan diary (/blog/peaks-of-the-balkans-diary) and the Everest diary
 * (/blog/everest-base-camp-gokyo-diary) are the same page in the owner's previews: the hero, the
 * trek at a glance, the intro and its quote, chapter 0 (the letter and thanks, the region, the
 * preparation), a band before the days, the days beside a route map that fills in as you read,
 * the flip cards, the vibe, what awaits you, the call to the next trek, the credits and a photo
 * viewer. This file draws all of that once, with its scroll, map and viewer behaviour.
 *
 * What differs is each page's own part, passed in `trip` (BalkanDiary.jsx, EverestDiary.jsx):
 * the art in the glance card, the band before the days (the nights ribbon, the altitude chart),
 * the map, how a day's cover and its other photos are laid out, the badge beside a day's date,
 * and the page's words and photos. The words are in src/data/*Diary.js; the styles in diary.css
 * (the previews' shared stylesheet, every rule under .bd) and a page's own file.
 *
 * trip = {
 *   slug, text(lang) -> T, img(id), size(id) -> [w, h], pos(id), icons,
 *   heroPhoto, ctaPhoto, tripPath, guidePath, proHeadingId, rootClass?, heroClass?,
 *   GlanceArt({ T }), Band({ T, goToDay }), Map({ T, day, onPick, lineRefs }),
 *   DayBadge({ day, T }), Cover({ day, T, onOpen }), Photos({ photos, T, onOpen }),
 * }
 */
import { createContext, memo, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageMeta } from '../../../website/usePageMeta.js';
import { hasPage } from '../../../website/lang.js';
import { srcSetOf } from '../../../website/imageVariants.js';
import { blogLang } from '../../../data/blogLang.js';
import Header from '../Header.jsx';
import SiteFooter from '../SiteFooter.jsx';
import './diary.css';

const SITE = 'https://www.highair-expeditions.com';

/* The page being drawn, for the parts that need its photos and icons */
const DiaryContext = createContext(null);
export const useDiary = () => useContext(DiaryContext);

export function DiaryIcon({ n, s = 22 }) {
  const { icons } = useDiary();
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={icons[n]} />
    </svg>
  );
}

/* A photo of the page: its own size, centred where the owner set it when cropped, and the 800px
   copy for a screen that needs no more (scripts/gen-image-variants.mjs); below the first screen,
   so it loads as the reader nears it. `whole`: a photo shown uncropped, which needs no focus. */
export function Photo({ id, alt, sizes, className, whole }) {
  const { img, size, pos } = useDiary();
  const src = img(id);
  const srcSet = srcSetOf(src);
  const [w, h] = size(id);
  return (
    <img loading="lazy" decoding="async" className={className} src={src} srcSet={srcSet} sizes={srcSet ? sizes : undefined}
      width={w} height={h} alt={alt} style={whole ? undefined : { objectPosition: pos(id) }} />
  );
}
/* How wide a day's cover is drawn (diary.css): the article column is 90vw up to 1020px (the map
   goes above it), beside the map about 580px */
export const COVER_SIZES = '(max-width: 1020px) 90vw, 580px';

/* ── The trek at a glance ────────────────────────────────────────────── */

function Glance({ T, Art }) {
  const g = T.glance;
  return (
    <section className="bd-in" aria-label={g.aria || g.title}>
      <div className="bd-glance">
        <div className="bd-tri">
          <h2>{g.title}</h2>
          <Art T={T} />
        </div>
        <div className="bd-tiles">
          {g.tiles.map(([icon, figure, unit, what]) => (
            <div className="bd-tile" key={what}>
              <span className="ic"><DiaryIcon n={icon} /></span>
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

/* The group: names as chips (the Balkans) or a card for each person (Everest); the small moments,
   the region's facts or its two routes, where the page has them */
function Prologue({ T, headingId }) {
  const P = T.prologue;
  const G = P.group;
  return (
    <section className="bd-pro" aria-labelledby={headingId}>
      <div className="bd-in">
        <span className="bd-kicker">{P.kicker}</span>
        <h2 id={headingId}>{P.h2}</h2>
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
                  <span className="ic"><DiaryIcon n={icon} s={22} /></span>
                  <b>{who}</b>
                  <p>{why}</p>
                </div>
              ))}
            </div>
            <div className="bd-group">
              <div className="gh">
                <span className="ic"><DiaryIcon n="users" s={22} /></span>
                <div><b>{G.title}</b><small>{G.note}</small></div>
              </div>
              {G.names && (
                <div className="names">
                  {G.names.map((name, i) => (
                    <span key={name}><i style={{ background: INITIAL_COLORS[i % 4] }}>{name[0]}</i>{name}</span>
                  ))}
                </div>
              )}
              {G.people && (
                <div className="people">
                  {G.people.map(([name, why], i) => (
                    <div key={name}>
                      <i style={{ background: INITIAL_COLORS[i % 4] }}>{name[0]}</i>
                      <span><b>{G.to}{name}</b><p>{why}</p></span>
                    </div>
                  ))}
                </div>
              )}
              <p>{G.quote}</p>
            </div>
            {P.moments && (
              <div className="bd-moments">
                <b>{P.moments.title}</b>
                <ul>{P.moments.items.map(m => <li key={m}><DiaryIcon n="star" s={15} />{m}</li>)}</ul>
                <p className="end">{P.moments.end}</p>
              </div>
            )}
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
            {P.geo.facts && <ul>{P.geo.facts.map(([icon, fact]) => <li key={fact}><DiaryIcon n={icon} s={18} />{fact}</li>)}</ul>}
            {P.geo.routes && (
              <div className="bd-routes">
                {P.geo.routes.map(([title, what, ours]) => (
                  <div key={title} className={ours ? 'us' : undefined}><b>{title}</b><span>{what}</span></div>
                ))}
              </div>
            )}
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
                  <span className="pin"><DiaryIcon n={icon} s={22} /><em>{i + 1}</em></span>
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

/* ── The days ────────────────────────────────────────────────────────── */

/* The days. Memoised: the page re-renders when the day in view changes, these do not. */
const DayStories = memo(function DayStories({ T, onOpen, articleRef, DayBadge, Cover, Photos }) {
  return (
    <article ref={articleRef}>
      {T.days.map(d => (
        <section key={d.d} className="bd-day" id={`day-${d.d}`} data-d={d.d}>
          <div className="bd-dh">
            <span className="bd-num"><small>{T.day}</small><b>{d.d}</b></span>
            <div>
              <div className="date">
                {d.date}
                <DayBadge day={d} T={T} />
              </div>
              <h3>{d.title}</h3>
            </div>
          </div>
          <Cover day={d} T={T} onOpen={onOpen} />
          <ul className="bd-facts">
            {d.facts.map(([icon, fact]) => <li key={fact}><DiaryIcon n={icon} s={17} />{fact}</li>)}
          </ul>
          {d.body.map((p, i) => <p key={i}>{p}</p>)}
          <Photos photos={d.photos.slice(1)} T={T} onOpen={onOpen} />
          {d.know && (
            <div className="bd-know">
              <span className="ic"><DiaryIcon n="compass" /></span>
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
            <span className="ic"><DiaryIcon n={icon} s={22} /></span>
            <small>{hint}</small>
          </span>
          <b>{figure}</b>
          <span className="lb">{label}</span>
        </span>
        <span className="b">
          <span className="ic"><DiaryIcon n={icon} s={20} /></span>
          {back}
        </span>
      </span>
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────

export default function DiaryPage({ trip }) {
  const { i18n } = useTranslation();
  const lang = blogLang(i18n.language);
  /* Published in Hebrew and English (src/website/blogLangs.js); elsewhere the magazine */
  const published = hasPage(lang, `/blog/${trip.slug}`);
  const T = trip.text(lang);
  const rtl = lang === 'he';
  const photos = useMemo(() => T.days.flatMap(d => d.photos), [T]);
  const { GlanceArt, Band, Map: TrekMap, DayBadge, Cover, Photos } = trip;

  const [day, setDay] = useState(1);      // the day in view
  const [open, setOpen] = useState(-1);   // the photo in the viewer, by its place in `photos`
  const articleRef = useRef(null);
  const barRef = useRef(null);
  const lineRefs = useRef([]);
  const chipsRef = useRef(null);

  usePageMeta({
    title:         `${T.seoTitle} | HighAir`,
    description:   T.description,
    canonicalPath: `/blog/${trip.slug}`,
    image:         `${SITE}${trip.img(trip.heroPhoto)}`,
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
  const [heroW, heroH] = trip.size(trip.heroPhoto);
  const [ctaW, ctaH] = trip.size(trip.ctaPhoto);

  return (
    <DiaryContext.Provider value={trip}>
      <Header />
      <div className={trip.rootClass ? `bd ${trip.rootClass}` : 'bd'} dir={rtl ? 'rtl' : 'ltr'}>
        <div className="bd-prog"><i ref={barRef} /></div>

        <header className={trip.heroClass ? `bd-hero ${trip.heroClass}` : 'bd-hero'}>
          <img src={trip.img(trip.heroPhoto)} width={heroW} height={heroH} alt={T.hero.alt} fetchpriority="high" style={{ objectPosition: trip.pos(trip.heroPhoto) }} />
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

        <Glance T={T} Art={GlanceArt} />

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

        <Prologue T={T} headingId={trip.proHeadingId} />

        <Band T={T} goToDay={goToDay} />

        <nav className="bd-chips" ref={chipsRef} aria-label={T.chipsAria}>
          {T.days.map(d => (
            <a key={d.d} href={`#day-${d.d}`} className={d.d === day ? 'on' : ''}>{T.day} {d.d} · {d.place}</a>
          ))}
        </nav>

        <div className="bd-in">
          <div className="bd-journey">
            <DayStories T={T} onOpen={openPhoto} articleRef={articleRef} DayBadge={DayBadge} Cover={Cover} Photos={Photos} />
            <TrekMap T={T} day={day} onPick={goToDay} lineRefs={lineRefs} />
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
                  <span className="ic"><DiaryIcon n={icon} /></span>
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
          <img loading="lazy" decoding="async" src={trip.img(trip.ctaPhoto)} width={ctaW} height={ctaH} alt="" style={{ objectPosition: trip.pos(trip.ctaPhoto) }} />
          <div className="bd-in">
            <span className="bd-badge">{T.cta.badge}</span>
            <h2>{T.cta.h2}</h2>
            <p>{T.cta.p}</p>
            <div className="bd-btns">
              <Link className="bd-btn w" to={trip.tripPath}>{T.cta.trip}</Link>
              <Link className="bd-btn o" to={trip.guidePath}>{T.cta.guide}</Link>
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
            <img src={trip.img(photos[open][0])} alt={photos[open][1]} />
            <div className="cap">{photos[open][1]}</div>
          </div>
        )}
      </div>
      <SiteFooter />
    </DiaryContext.Provider>
  );
}
