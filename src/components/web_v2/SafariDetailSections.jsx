/**
 * SafariDetailSections.jsx — the sections that appear only on a safari
 * expedition page (/expedition/safari-3-days | -5-days | -7-days).
 *
 * Kept out of ExpeditionDetail.jsx on purpose: that file is already ~2,500
 * lines and serves every climb. Everything here is rendered behind a single
 * `isSafariExp` gate, so a non-safari page is untouched.
 *
 * Structure follows the tour page the owner asked us to adapt (Jul 30 2026):
 * summary card, section nav, is-this-for-me, route map, packing list,
 * season + price table, inclusions, visa and documents.
 *
 * House rules honoured here: SVG icons only (never emoji), no em dashes,
 * Hebrew for customers, and no invented prices.
 */

import { useState, useEffect, useRef } from 'react';
import { RADIUS } from '../../website/theme.js';
import { SAFARI_COLOR as SC } from '../../data/safariData.js';
import {
  SAFARI_TRIP_TYPE, SAFARI_PACKING, SAFARI_SEASONS_PRICING, SAFARI_GROUP_SIZES,
  SAFARI_PRICES, SAFARI_PRICE_NOTES, SAFARI_PRICE_NOTES_EN,
  SAFARI_INCLUDED, SAFARI_NOT_INCLUDED, SAFARI_NOT_INCLUDED_EN,
  SAFARI_VISA, SAFARI_MAP_NODES, SAFARI_ROUTES,
} from '../../data/safariDetailData.js';
import {
  UsersIcon, ClockIcon, TreeIcon, CheckIcon, CalendarIcon, CurrencyIcon,
  ShoppingIcon, GlassesIcon, MedicalIcon, PassportIcon, GpsIcon, GlobeIcon,
  SyringeIcon, ShieldIcon, PlaneIcon, TagIcon, TentIcon, DiningIcon,
  EyeIcon, PinIcon, InfoIcon, WarningIcon,
} from '../Icons.jsx';

/* Data files store icon NAMES, never glyphs. This is the only place a name
   becomes a component, which is what keeps emoji out of the content. */
const ICONS = {
  users: UsersIcon, clock: ClockIcon, tree: TreeIcon, check: CheckIcon,
  calendar: CalendarIcon, currency: CurrencyIcon, shopping: ShoppingIcon,
  glasses: GlassesIcon, medical: MedicalIcon, passport: PassportIcon,
  gps: GpsIcon, globe: GlobeIcon, syringe: SyringeIcon, shield: ShieldIcon,
  plane: PlaneIcon, tag: TagIcon, tent: TentIcon, dining: DiningIcon,
  jeep: GpsIcon, sun: EyeIcon, pin: PinIcon, info: InfoIcon,
};
const Ico = ({ name, size = 20, color = SC.earth }) => {
  const C = ICONS[name] || InfoIcon;
  return <C size={size} color={color} />;
};

const FONT = "'Ploni', sans-serif";
/* ExpeditionDetail renders a 1px marker with this id right below the summary
   card. The nav appears exactly when that marker leaves the top of the view. */
export const NAV_SENTINEL_ID = 'sf-nav-sentinel';
const isPlaceholder = v => !v || /\[למילוי\]/.test(String(v));

/* ─── Shared section heading, so every new block lines up with the others ── */
function Head({ title, sub, isMobile }) {
  return (
    <div style={{ marginBottom: sub ? '22px' : '26px' }}>
      <h2 style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.5vw, 32px)', fontWeight: 700,
        color: '#0A0818', letterSpacing: '-0.02em', margin: 0, textAlign: 'start' }}>
        {title}
      </h2>
      {sub && (
        <p style={{ fontFamily: FONT, fontSize: isMobile ? '14.5px' : '16px', fontWeight: 300,
          color: '#6B6B8A', margin: '10px 0 0', lineHeight: 1.65, textAlign: 'start', maxWidth: '760px' }}>
          {sub}
        </p>
      )}
    </div>
  );
}

const card = {
  background: '#FFFFFF', border: `1px solid ${SC.sandLine}`,
  borderRadius: RADIUS.xl, padding: '18px 20px', textAlign: 'start',
};

/* ══════════════════════════════════════════════════════════════════════════
   1. SUMMARY CARD
   The one block a visitor reads before deciding to scroll: what the trip is,
   how long, who is in the jeep, when it departs, what it costs, one action.
   No altitude and no difficulty grade, which the owner ruled out for safari.
   ══════════════════════════════════════════════════════════════════════════ */
export function SafariSummaryCard({ exp, isRtl, isMobile, onEnquire }) {
  const rows = [
    { icon: 'clock', label: isRtl ? 'משך המסע' : 'Duration',
      value: isRtl ? exp.days : (exp.daysEn || exp.days) },
    { icon: 'tree', label: isRtl ? 'שמורות במסלול' : 'Reserves on the route',
      value: isPlaceholder(exp.reserves) ? null : exp.reserves },
    { icon: 'users', label: isRtl ? 'סוג המסע' : 'Trip type',
      value: isRtl ? 'ספארי פרטי, עד 6 נוסעים בג׳יפ' : 'Private safari, up to 6 in the jeep' },
    { icon: 'calendar', label: isRtl ? 'תאריכי יציאה' : 'Departure dates',
      value: isRtl ? 'בכל תאריך, לפי היומן שלכם' : 'Any date, to suit your calendar' },
  ].filter(r => r.value);

  const priceKnown = !isPlaceholder(exp.priceStr);

  return (
    <div style={{ ...card, padding: isMobile ? '20px' : '26px 28px', marginTop: isMobile ? '24px' : '32px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '2px' : '2px 32px' }}>
        {rows.map((r, i) => (
          <div key={r.label} style={{ display: 'flex', alignItems: 'center', gap: '12px',
            padding: '13px 0', borderTop: i === 0 || (!isMobile && i === 1) ? 'none' : `1px solid ${SC.sandLine}` }}>
            <span style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px',
              background: '#FEF6E7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico name={r.icon} size={18} />
            </span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontFamily: FONT, fontSize: '12px', color: '#6B6B8A' }}>{r.label}</span>
              <span style={{ display: 'block', fontFamily: FONT, fontSize: '15px', fontWeight: 700, color: '#0A0818' }}>{r.value}</span>
            </span>
          </div>
        ))}
      </div>

      <div style={{ borderTop: `1px solid ${SC.sandLine}`, marginTop: '14px', paddingTop: '18px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
        <div>
          <span style={{ display: 'block', fontFamily: FONT, fontSize: '12px', color: '#6B6B8A' }}>
            {isRtl ? 'מחיר לאדם' : 'Price per person'}
          </span>
          <span style={{ display: 'block', fontFamily: FONT, fontWeight: 900, color: SC.earth,
            fontSize: isMobile ? '24px' : '28px', letterSpacing: '-0.02em' }}>
            {priceKnown
              ? (isRtl ? `החל מ-${exp.priceStr}` : `From ${exp.priceStr}`)
              : (isRtl ? 'לפי גודל הקבוצה' : 'By group size')}
          </span>
          {!priceKnown && (
            <span style={{ display: 'block', fontFamily: FONT, fontSize: '12.5px', color: '#6B6B8A', marginTop: '2px' }}>
              {isRtl ? 'נשלח הצעה מדויקת לפי מספר הנוסעים והחודש' : 'We send an exact quote by party size and month'}
            </span>
          )}
        </div>
        <button onClick={onEnquire} style={{
          background: SC.earth, color: '#FFFFFF', border: 'none', borderRadius: RADIUS.full,
          padding: isMobile ? '13px 26px' : '14px 34px', fontFamily: FONT, fontSize: '15px',
          fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          {isRtl ? 'קבלת הצעה' : 'Request a quote'}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   2. STICKY SECTION NAV
   Anchors into the sections below. It appears once the reader is past the
   summary card and hides again at the form, so it never covers the CTA.
   ══════════════════════════════════════════════════════════════════════════ */
export function SafariSectionNav({ sections: all, isRtl, isMobile }) {
  /* A chip must never scroll to nothing. The 7-day itinerary section, for
     instance, does not render until its route is filled in, so the list is
     narrowed to the sections actually in the document. */
  const [sections, setSections] = useState(all);
  useEffect(() => {
    const present = all.filter(s => document.getElementById(s.id));
    if (present.length) setSections(present);
  }, [all]);

  const [active, setActive] = useState(all[0]?.id);
  const [shown, setShown] = useState(false);
  const trackRef = useRef(null);

  /* Both effects are IntersectionObserver-driven rather than scroll-driven,
     matching the floating bar above. A scroll listener misses any movement the
     browser performs without emitting scroll events (restored positions,
     programmatic jumps), which left the bar stuck off-screen. */
  useEffect(() => {
    const sentinel = document.getElementById(NAV_SENTINEL_ID);
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = sections.map(s => document.getElementById(s.id)).filter(Boolean);
    if (!els.length) return;
    const seen = new Map();
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => seen.set(e.target.id, e.isIntersecting));
      // Document order wins, so the topmost section in the band is the active one.
      const hit = sections.find(s => seen.get(s.id));
      if (hit) setActive(hit.id);
    }, { rootMargin: '-140px 0px -65% 0px', threshold: 0 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [sections]);

  // Keep the active chip in view on mobile, where the strip scrolls sideways.
  useEffect(() => {
    const t = trackRef.current;
    if (!t) return;
    const chip = t.querySelector(`[data-nav="${active}"]`);
    if (chip && t.scrollWidth > t.clientWidth) {
      chip.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }, [active]);

  const go = id => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' });
  };

  return (
    <div data-safari-nav style={{
      position: 'fixed', top: '60px', left: 0, right: 0, zIndex: 190,
      background: 'rgba(255,253,249,0.96)', backdropFilter: 'blur(10px)',
      borderBottom: `1px solid ${SC.sandLine}`,
      transform: shown ? 'translateY(0)' : 'translateY(-160%)',
      transition: 'transform .3s ease', pointerEvents: shown ? 'auto' : 'none',
      direction: isRtl ? 'rtl' : 'ltr',
    }}>
      <div ref={trackRef} style={{
        maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 5%' : '0',
        display: 'flex', gap: '4px', overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {sections.map(s => (
          <button key={s.id} data-nav={s.id} onClick={() => go(s.id)} style={{
            flexShrink: 0, background: 'transparent', border: 'none', cursor: 'pointer',
            padding: '13px 14px', fontFamily: FONT, fontSize: '14px',
            fontWeight: active === s.id ? 700 : 500,
            color: active === s.id ? SC.earth : '#6B6B8A',
            borderBottom: `2px solid ${active === s.id ? SC.earth : 'transparent'}`,
            whiteSpace: 'nowrap',
          }}>
            {isRtl ? s.label : s.labelEn}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   3. IS THIS TRIP FOR ME
   Private group, ages, the jeep, and the reserves this particular package
   visits, taken from the record's own highlights rather than hardcoded.
   ══════════════════════════════════════════════════════════════════════════ */
export function SafariForMe({ exp, isRtl, isMobile }) {
  const T = SAFARI_TRIP_TYPE;
  const blocks = [
    { icon: 'users', title: isRtl ? T.privateTitle : T.privateTitleEn,
      desc: isRtl ? T.private : T.privateEn,
      note: isRtl ? T.groupNote : T.groupNoteEn },
    { icon: 'medical', title: isRtl ? T.ageTitle : T.ageTitleEn,
      desc: isRtl ? T.age : T.ageEn },
    { icon: 'jeep', title: isRtl ? T.jeepTitle : T.jeepTitleEn,
      desc: isRtl ? T.jeep : T.jeepEn },
  ];
  const visits = (isRtl ? exp.highlights : (exp.highlightsEn || exp.highlights)) || [];
  const realVisits = visits.filter(v => !isPlaceholder(v));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.35fr 1fr', gap: isMobile ? '16px' : '24px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {blocks.map(b => (
          <div key={b.title} style={{ ...card, display: 'flex', gap: '14px' }}>
            <span style={{ flexShrink: 0, width: '42px', height: '42px', borderRadius: '12px',
              background: '#FEF6E7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico name={b.icon} size={21} />
            </span>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontFamily: FONT, fontSize: '17px', fontWeight: 700, color: SC.deep, margin: '0 0 5px' }}>{b.title}</h3>
              <p style={{ fontFamily: FONT, fontSize: '14.5px', fontWeight: 300, color: SC.ink, margin: 0, lineHeight: 1.65 }}>{b.desc}</p>
              {b.note && (
                <p style={{ fontFamily: FONT, fontSize: '13.5px', fontWeight: 400, color: SC.earth,
                  margin: '9px 0 0', lineHeight: 1.6 }}>{b.note}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {realVisits.length > 0 && (
        <div style={{ ...card, background: '#FFFDF9' }}>
          <h3 style={{ fontFamily: FONT, fontSize: '17px', fontWeight: 700, color: SC.deep, margin: '0 0 14px' }}>
            {isRtl ? 'מה תראו במסע' : "What you will visit"}
          </h3>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '11px' }}>
            {realVisits.map(v => (
              <li key={v} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ flexShrink: 0, marginTop: '2px' }}><Ico name="pin" size={17} /></span>
                <span style={{ fontFamily: FONT, fontSize: '14.5px', fontWeight: 400, color: SC.ink, lineHeight: 1.5 }}>{v}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   4. ROUTE MAP
   A schematic map, not a decoration: every pin sits at the real coordinate of
   the place, projected in safariDetailData.js. Reserve shapes are indicative.
   ══════════════════════════════════════════════════════════════════════════ */
export function SafariRouteMap({ exp, isRtl, isMobile }) {
  const route = SAFARI_ROUTES[exp.slug];
  if (!route) {
    return (
      <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '12px', background: '#FFFDF9' }}>
        <Ico name="info" size={20} />
        <span style={{ fontFamily: FONT, fontSize: '14.5px', color: SC.ink, lineHeight: 1.6 }}>
          {isRtl ? 'מפת המסלול תתפרסם עם פרסום המסלול המלא.' : 'The route map will be published with the full itinerary.'}
        </span>
      </div>
    );
  }
  const N = SAFARI_MAP_NODES;
  const pts = route.map(r => ({ ...N[r.node], day: r.day, key: r.node }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div style={{ ...card, padding: isMobile ? '12px' : '18px', background: '#FFFCF4', overflow: 'hidden' }}>
      {/* dir ltr: the map is geography, so it must not mirror in Hebrew. */}
      <div style={{ direction: 'ltr', width: '100%', maxWidth: '720px', margin: '0 auto' }}>
        <svg viewBox="20 80 650 550" style={{ width: '100%', height: 'auto', display: 'block' }}
          role="img" aria-label={isRtl ? 'מפת המסלול בצפון טנזניה' : 'Route map of northern Tanzania'}>
          <defs>
            <linearGradient id="safari-map-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFF8EA" />
              <stop offset="100%" stopColor="#F6EBD6" />
            </linearGradient>
          </defs>
          <rect x="20" y="80" width="650" height="550" fill="url(#safari-map-bg)" rx="14" />

          {/* Indicative reserve areas, drawn behind the route. */}
          <g opacity="0.55">
            {/* Serengeti: one long plain from the Mara river down to Seronera */}
            <path d="M62 96 C 150 88, 178 150, 168 226 C 160 300, 128 336, 74 340 C 52 300, 50 150, 62 96 Z"
              fill="#E7EBC8" stroke="#C7CE9C" strokeWidth="2" />
            {/* Ngorongoro conservation area, with the crater ring inside */}
            <path d="M214 396 C 262 384, 306 402, 302 444 C 298 486, 250 496, 216 476 C 196 452, 196 410, 214 396 Z"
              fill="#DCE7CC" stroke="#B9C9A6" strokeWidth="2" />
            <circle cx="256" cy="434" r="19" fill="none" stroke="#8F9E74" strokeWidth="3" strokeDasharray="4 4" />
            {/* Tarangire, following the river valley */}
            <path d="M316 526 C 356 522, 372 556, 358 600 C 342 636, 306 632, 300 596 C 296 560, 302 532, 316 526 Z"
              fill="#EDE6C6" stroke="#CFC79C" strokeWidth="2" />
            {/* Lake Eyasi */}
            <ellipse cx="196" cy="522" rx="30" ry="14" fill="#CFE0E6" stroke="#A8C3CC" strokeWidth="2" transform="rotate(-24 196 522)" />
          </g>

          {/* The route itself */}
          <path d={line} fill="none" stroke={SC.earth} strokeWidth="3.2"
            strokeDasharray="9 7" strokeLinecap="round" opacity="0.85" />

          {pts.map(p => (
            <g key={p.key}>
              {p.day ? (
                <>
                  <circle cx={p.x} cy={p.y} r="17" fill={SC.earth} />
                  <text x={p.x} y={p.y + 5} textAnchor="middle"
                    style={{ fontFamily: FONT, fontSize: '15px', fontWeight: 800, fill: '#FFFFFF' }}>
                    {p.day}
                  </text>
                </>
              ) : (
                <circle cx={p.x} cy={p.y} r="7" fill="#FFFFFF" stroke={SC.deep} strokeWidth="3" />
              )}
              <text x={p.x} y={p.y + (p.day ? 34 : 24)} textAnchor="middle"
                style={{ fontFamily: FONT, fontSize: isMobile ? '15px' : '14px', fontWeight: 600,
                  fill: SC.deep, direction: isRtl ? 'rtl' : 'ltr' }}>
                {isRtl ? p.label : p.labelEn}
              </text>
            </g>
          ))}
        </svg>
      </div>
      <p style={{ fontFamily: FONT, fontSize: '12.5px', color: '#8A7A66', margin: '8px 4px 0',
        textAlign: 'start', direction: isRtl ? 'rtl' : 'ltr' }}>
        {isRtl
          ? 'המספרים הם ימי הספארי. מיקומי הנקודות לפי הקואורדינטות בפועל, גבולות השמורות מסורטטים להמחשה.'
          : 'The numbers are safari days. Points sit at real coordinates; reserve outlines are indicative.'}
      </p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   5. PACKING LIST
   ══════════════════════════════════════════════════════════════════════════ */
export function SafariPacking({ isRtl, isMobile }) {
  const [open, setOpen] = useState(() => SAFARI_PACKING.map((_, i) => i === 0));
  const toggle = i => setOpen(o => o.map((v, j) => (j === i ? !v : v)));

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px', alignItems: 'start' }}>
      {SAFARI_PACKING.map((g, i) => {
        const items = isRtl ? g.items : (g.itemsEn || g.items);
        return (
          <div key={g.title} style={{ ...card, padding: 0, overflow: 'hidden' }}>
            <button onClick={() => toggle(i)} aria-expanded={open[i]} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '15px 18px', background: open[i] ? '#FFFCF4' : '#FFFFFF',
              border: 'none', cursor: 'pointer', textAlign: 'start', fontFamily: FONT,
            }}>
              <span style={{ flexShrink: 0, width: '36px', height: '36px', borderRadius: '10px',
                background: '#FEF6E7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ico name={g.icon} size={18} />
              </span>
              <span style={{ flex: 1, fontFamily: FONT, fontSize: '16px', fontWeight: 700, color: SC.deep }}>
                {isRtl ? g.title : g.titleEn}
              </span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9A8B76"
                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ flexShrink: 0, transform: open[i] ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div style={{ maxHeight: open[i] ? '600px' : '0', overflow: 'hidden', transition: 'max-height .3s ease' }}>
              <ul style={{ listStyle: 'none', margin: 0, padding: '2px 18px 18px',
                display: 'flex', flexDirection: 'column', gap: '9px' }}>
                {items.map(it => (
                  <li key={it} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
                    <span style={{ flexShrink: 0, marginTop: '2px' }}><Ico name="check" size={15} color={SC.green} /></span>
                    <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 300, color: SC.ink, lineHeight: 1.55 }}>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   6. SEASONS AND PRICING
   Rows are group size, columns are season, because that is how a private
   safari is actually quoted. Any missing number renders as "לפי בקשה", so the
   table is publishable before the owner sends prices and filling it is a
   one-line data edit in SAFARI_PRICES.
   ══════════════════════════════════════════════════════════════════════════ */
export function SafariPricing({ exp, isRtl, isMobile }) {
  const table = SAFARI_PRICES[exp.slug] || {};
  const notes = isRtl ? SAFARI_PRICE_NOTES : SAFARI_PRICE_NOTES_EN;
  const anyPrice = SAFARI_SEASONS_PRICING.some(s =>
    SAFARI_GROUP_SIZES.some(g => typeof table[s.key]?.[g] === 'number'));

  const cell = { fontFamily: FONT, fontSize: '14.5px', padding: isMobile ? '10px 8px' : '13px 16px',
    textAlign: 'center', borderTop: `1px solid ${SC.sandLine}` };
  const price = v => (typeof v === 'number'
    ? `$${v.toLocaleString('en-US')}`
    : (isRtl ? 'לפי בקשה' : 'On request'));

  return (
    <>
      <div style={{ ...card, padding: 0, overflowX: 'auto' }}>
        <table style={{ width: '100%', minWidth: isMobile ? '460px' : 0, borderCollapse: 'collapse', direction: isRtl ? 'rtl' : 'ltr' }}>
          <thead>
            <tr style={{ background: '#FFFCF4' }}>
              <th style={{ ...cell, borderTop: 'none', textAlign: 'start', fontWeight: 700, color: SC.deep }}>
                {isRtl ? 'מספר נוסעים' : 'Travellers'}
              </th>
              {SAFARI_SEASONS_PRICING.map(s => (
                <th key={s.key} style={{ ...cell, borderTop: 'none', fontWeight: 700, color: SC.deep }}>
                  <span style={{ display: 'block' }}>{isRtl ? s.label : s.labelEn}</span>
                  <span style={{ display: 'block', fontSize: '11.5px', fontWeight: 400, color: '#8A7A66', marginTop: '3px' }}>
                    {isRtl ? s.when : s.whenEn}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SAFARI_GROUP_SIZES.map(g => (
              <tr key={g}>
                <td style={{ ...cell, textAlign: 'start', fontWeight: 700, color: SC.deep }}>
                  {g === '6+'
                    ? (isRtl ? '6 נוסעים ומעלה' : '6 travellers or more')
                    : isRtl
                      ? (g === 1 ? 'נוסע אחד' : `${g} נוסעים`)
                      : (g === 1 ? '1 traveller' : `${g} travellers`)}
                </td>
                {SAFARI_SEASONS_PRICING.map(s => (
                  <td key={s.key} style={{ ...cell, fontWeight: 600, color: SC.ink,
                    fontVariantNumeric: 'tabular-nums' }}>
                    {price(table[s.key]?.[g])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!anyPrice && (
        <div style={{ ...card, marginTop: '14px', background: '#FFFCF4', display: 'flex', gap: '12px' }}>
          <span style={{ flexShrink: 0, marginTop: '1px' }}><Ico name="currency" size={19} /></span>
          <p style={{ fontFamily: FONT, fontSize: '14.5px', fontWeight: 400, color: SC.ink, margin: 0, lineHeight: 1.65 }}>
            {isRtl
              ? 'המחיר לספארי פרטי נגזר ממספר הנוסעים, מהחודש ומהלודג׳ים, ולכן אנחנו מוציאים הצעה אישית ולא מפרסמים מחירון אחד. השאירו פרטים ונחזור עם מחיר מדויק.'
              : 'A private safari is priced by party size, month and lodges, so we quote personally rather than publish one price list. Leave your details and we will come back with an exact figure.'}
          </p>
        </div>
      )}

      <ul style={{ listStyle: 'none', margin: '16px 0 0', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {notes.map(n => (
          <li key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
            <span style={{ flexShrink: 0, marginTop: '2px' }}><Ico name="info" size={15} color="#9A8B76" /></span>
            <span style={{ fontFamily: FONT, fontSize: '13.5px', fontWeight: 300, color: '#6B6B8A', lineHeight: 1.6 }}>{n}</span>
          </li>
        ))}
      </ul>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   7. INCLUSIONS
   ══════════════════════════════════════════════════════════════════════════ */
export function SafariInclusions({ isRtl, isMobile }) {
  const [open, setOpen] = useState(null);
  const notIncluded = isRtl ? SAFARI_NOT_INCLUDED : SAFARI_NOT_INCLUDED_EN;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr', gap: isMobile ? '16px' : '24px', alignItems: 'start' }}>
      <div style={{ ...card, padding: 0, overflow: 'hidden' }}>
        {SAFARI_INCLUDED.map((it, i) => {
          const isOpen = open === i;
          return (
            <div key={it.title} style={{ borderTop: i === 0 ? 'none' : `1px solid ${SC.sandLine}` }}>
              <button onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px',
                background: isOpen ? '#FFFCF4' : '#FFFFFF', border: 'none', cursor: 'pointer', textAlign: 'start',
              }}>
                <span style={{ flexShrink: 0 }}><Ico name="check" size={18} color={SC.green} /></span>
                <span style={{ flex: 1, fontFamily: FONT, fontSize: '15px', fontWeight: 600, color: SC.deep }}>
                  {isRtl ? it.title : it.titleEn}
                </span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9A8B76"
                  strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s ease' }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
              <div style={{ maxHeight: isOpen ? '260px' : '0', overflow: 'hidden', transition: 'max-height .3s ease' }}>
                <p style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 300, color: SC.ink,
                  margin: 0, padding: '0 18px 16px 48px', lineHeight: 1.65 }}>
                  {isRtl ? it.desc : it.descEn}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ ...card, background: '#FFFDF9' }}>
        <h3 style={{ fontFamily: FONT, fontSize: '16px', fontWeight: 700, color: SC.deep, margin: '0 0 13px' }}>
          {isRtl ? 'מה לא כלול' : 'Not included'}
        </h3>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {notIncluded.map(n => (
            <li key={n} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px' }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#B98A6A" strokeWidth="2.5"
                strokeLinecap="round" style={{ flexShrink: 0, marginTop: '3px' }}>
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
              <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 300, color: SC.ink, lineHeight: 1.55 }}>{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   8. VISA AND DOCUMENTS
   ══════════════════════════════════════════════════════════════════════════ */
export function SafariVisa({ isRtl, isMobile }) {
  const V = SAFARI_VISA;
  return (
    <>
      <p style={{ fontFamily: FONT, fontSize: isMobile ? '15px' : '16px', fontWeight: 400, color: SC.ink,
        margin: '0 0 18px', lineHeight: 1.7, textAlign: 'start', maxWidth: '780px' }}>
        {isRtl ? V.intro : V.introEn}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '14px' }}>
        {V.items.map(it => (
          <div key={it.title} style={{ ...card, display: 'flex', gap: '13px' }}>
            <span style={{ flexShrink: 0, width: '38px', height: '38px', borderRadius: '11px',
              background: '#FEF6E7', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Ico name={it.icon} size={19} />
            </span>
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontFamily: FONT, fontSize: '16px', fontWeight: 700, color: SC.deep, margin: '0 0 4px' }}>
                {isRtl ? it.title : it.titleEn}
              </h3>
              <p style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 300, color: SC.ink, margin: 0, lineHeight: 1.6 }}>
                {isRtl ? it.desc : it.descEn}
              </p>
            </div>
          </div>
        ))}
      </div>

      <a href={V.portal} target="_blank" rel="noopener noreferrer" style={{
        display: 'inline-flex', alignItems: 'center', gap: '9px', marginTop: '16px',
        fontFamily: FONT, fontSize: '14.5px', fontWeight: 700, color: SC.earth, textDecoration: 'none',
      }}>
        <Ico name="globe" size={17} />
        {isRtl ? 'לאתר הרשמי להגשת הוויזה' : 'The official visa portal'}
      </a>

      <div style={{ ...card, marginTop: '16px', background: '#FFFCF4', display: 'flex', gap: '12px' }}>
        <span style={{ flexShrink: 0, marginTop: '1px' }}><WarningIcon size={18} color="#B98A6A" /></span>
        <p style={{ fontFamily: FONT, fontSize: '13.5px', fontWeight: 300, color: SC.ink, margin: 0, lineHeight: 1.65 }}>
          {isRtl ? V.disclaimer : V.disclaimerEn}
        </p>
      </div>
    </>
  );
}

/* A section shell so every new block gets the same anchor, padding and head. */
export function SafariSection({ id, title, sub, isMobile, children, first }) {
  return (
    <section id={id} style={{ padding: isMobile ? '44px 0' : '64px 0',
      borderTop: first ? 'none' : `1px solid ${SC.sandLine}` }}>
      <Head title={title} sub={sub} isMobile={isMobile} />
      {children}
    </section>
  );
}
