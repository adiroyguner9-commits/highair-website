/**
 * SafariPage — /safari
 *
 * The "ספארי בטנזניה" heading in the header is a plain link (owner, Jul 30
 * 2026), and it lands here: one page showing the three safari lengths as cards.
 *
 * Built like every other standalone page on this site — each one renders its
 * OWN <Header/> and <SiteFooter/>, there is no shared route shell — and it wears
 * the same dark gradient intro band as /contact so it reads as part of the site
 * rather than a card row floating on white.
 *
 * The cards come from <ExpeditionExplorer type="safari" />, the SAME component
 * the home page uses, so a safari card and a Kilimanjaro card stay identical and
 * a future card restyle lands in both places at once.
 */
import { useEffect, useState, useRef, useCallback } from 'react';
import { Analytics } from '../../utils/analytics.js';
import { getAttribution } from '../../utils/attribution.js';
import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import { EXPS } from '../../data/mockData.js';
import { SAFARI_SEASONS, SAFARI_RESERVES, SAFARI_DAY_TRIPS, SAFARI_LODGING,
         SAFARI_HOW_IT_WORKS, SAFARI_FAQ, SAFARI_COLOR as SC } from '../../data/safariData.js';
import PhoneField, { formatFullPhone, validatePhone } from './PhoneField.jsx';
import { UsersIcon, ClockIcon, GpsIcon, CheckIcon, StarIcon, LionIcon } from '../Icons.jsx';

/* SVG only — no emoji anywhere on this site (standing owner rule). Data files
   carry an icon NAME; this map is the single place a name becomes a component. */
const SAFARI_ICONS = { users: UsersIcon, clock: ClockIcon, gps: GpsIcon, check: CheckIcon };


/* ── When to go ─────────────────────────────────────────────────────────
   Interactive, not a wall of boxes: pick a month, read what that month is
   actually like. Four facts a buyer weighs — temperature, weather, what the
   wildlife is doing, how busy the reserves are. The chip row doubles as the
   year-at-a-glance view, coloured by season quality. */
function SeasonGuide({ isRtl, isMobile }) {
  const CHIP = {
    best: { bg: '#FEF3C7', border: '#F59E0B', dot: '#D97706', label: isRtl ? 'העונה הטובה ביותר' : 'Prime season' },
    good: { bg: '#ECFCCB', border: '#A3E635', dot: '#7BA23F', label: isRtl ? 'מצוין' : 'Very good' },
    ok:   { bg: '#F5F5F4', border: '#E7E5E4', dot: '#A8A29E', label: isRtl ? 'עונת ביניים' : 'Shoulder season' },
  };
  /* Opens on the current month, so the guide answers "and right now?" first. */
  const [sel, setSel] = useState(new Date().getMonth());
  const m = SAFARI_SEASONS[sel] || SAFARI_SEASONS[0];
  const c = CHIP[m.rating] || CHIP.ok;

  const fact = (label, value) => (
    <div style={{ flex: '1 1 140px', minWidth: 0 }}>
      <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '10.5px', fontWeight: 800,
        color: SC.ink, opacity: 0.6, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 600,
        color: SC.deep, lineHeight: 1.4, wordBreak: 'break-word' }}>{value}</div>
    </div>
  );

  return (
    <section style={{ padding: isMobile ? '44px 5% 8px' : '72px 5% 16px', maxWidth: '1280px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '26px' : '38px', fontWeight: 700,
        color: SC.deep, margin: '0 0 8px', letterSpacing: '-0.02em', textAlign: 'start' }}>
        {isRtl ? 'מתי הכי כדאי לצאת לספארי' : 'When to go on safari'}
      </h2>
      <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '15px' : '17px', fontWeight: 300,
        color: SC.ink, margin: '0 0 22px', maxWidth: '640px', lineHeight: 1.6, textAlign: 'start' }}>
        {isRtl
          ? 'לכל חודש אופי משלו. בחרו חודש כדי לראות מזג אוויר, מה קורה עם החיות וכמה עמוס בשמורות.'
          : 'Every month has its own character. Pick one to see the weather, what the wildlife is doing and how busy the reserves are.'}
      </p>

      {/* Month chips — the whole year at a glance */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '18px' }}>
        {SAFARI_SEASONS.map((mo, i) => {
          const mc = CHIP[mo.rating] || CHIP.ok;
          const active = i === sel;
          return (
            <button key={mo.monthEn} onClick={() => setSel(i)}
              aria-pressed={active}
              style={{
                fontFamily: "'Ploni', sans-serif", fontSize: '13.5px', fontWeight: 700,
                color: active ? '#FFFFFF' : SC.deep,
                background: active ? SC.earth : mc.bg,
                border: `1px solid ${active ? SC.earth : mc.border}`,
                borderRadius: '999px', padding: '7px 14px', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                transition: 'background 150ms ease, color 150ms ease, border-color 150ms ease',
              }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%',
                background: active ? 'rgba(255,255,255,0.85)' : mc.dot, flexShrink: 0 }} />
              {isRtl ? mo.month : mo.monthEn}
            </button>
          );
        })}
      </div>

      {/* Detail panel for the selected month */}
      <div style={{ background: '#FFFFFF', border: `1px solid ${SC.sandLine}`,
        borderRadius: '18px', padding: isMobile ? '18px' : '24px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px', flexWrap: 'wrap' }}>
          <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '22px', fontWeight: 700,
            color: SC.deep, margin: 0 }}>{isRtl ? m.month : m.monthEn}</h3>
          <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '11px', fontWeight: 800,
            color: SC.deep, background: c.bg, border: `1px solid ${c.border}`,
            borderRadius: '999px', padding: '3px 10px' }}>{c.label}</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px 28px' }}>
          {fact(isRtl ? 'טמפרטורה' : 'Temperature', m.temp)}
          {fact(isRtl ? 'מזג אוויר' : 'Weather',     isRtl ? m.weather  : m.weatherEn)}
          {fact(isRtl ? 'חיות הבר' : 'Wildlife',     isRtl ? m.wildlife : m.wildlifeEn)}
          {fact(isRtl ? 'עומס בשמורות' : 'Crowds',   isRtl ? m.crowds   : m.crowdsEn)}
        </div>
        {(isRtl ? m.note : m.noteEn) && (
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 300,
            color: SC.ink, margin: '18px 0 0', paddingTop: '16px',
            borderTop: `1px solid ${SC.sandLine}`, lineHeight: 1.6 }}>
            {isRtl ? m.note : m.noteEn}
          </p>
        )}
      </div>
    </section>
  );
}

/* ── The reserves ───────────────────────────────────────────────────────
   Photo-led, because a safari is sold on imagery. Until the photos land each
   tile shows a warm savanna gradient rather than a broken image. */
function ReservesStrip({ isRtl, isMobile }) {
  return (
    <section style={{ padding: isMobile ? '36px 5% 8px' : '56px 5% 16px', maxWidth: '1280px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '26px' : '38px', fontWeight: 700,
        color: SC.deep, margin: '0 0 8px', letterSpacing: '-0.02em', textAlign: 'start' }}>
        {isRtl ? 'השמורות והשבטים' : 'The reserves and the tribes'}
      </h2>
      <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '15px' : '17px', fontWeight: 300,
        color: SC.ink, margin: '0 0 28px', maxWidth: '640px', lineHeight: 1.6, textAlign: 'start' }}>
        {isRtl
          ? 'שלוש מהשמורות המרהיבות באפריקה, ומפגש עם השבטים שחיים בהן.'
          : "Three of Africa's most spectacular reserves, and a meeting with the peoples who live among them."}
      </p>
      {/* Same PhotoCard as the lodging row, so both rows share one card and one
          set of height rules. It used to have its own inline markup, which is why
          the equal-height and line-clamp treatment missed it. */}
      <CardSlider items={SAFARI_RESERVES} isRtl={isRtl} isMobile={isMobile}
        renderCard={r => (
          <PhotoCard key={r.slug} img={r.img} title={isRtl ? r.name : r.nameEn}
            desc={isRtl ? r.desc : r.descEn}
            gradient={`linear-gradient(135deg, ${SC.earth}, ${SC.ochre})`} />
        )} />
    </section>
  );
}


/* ── Day trips ──────────────────────────────────────────────────────────
   Add-ons around Moshi and Arusha. Same tile language as the reserves strip so
   the page reads as one thing, with a duration chip because that is the first
   thing someone asks about a day trip. */
function DayTrips({ isRtl, isMobile }) {
  if (!SAFARI_DAY_TRIPS.length) return null;
  return (
    <section style={{ padding: isMobile ? '36px 5% 8px' : '56px 5% 16px', maxWidth: '1280px', margin: '0 auto' }}>
      <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '26px' : '38px', fontWeight: 700,
        color: SC.deep, margin: '0 0 8px', letterSpacing: '-0.02em', textAlign: 'start' }}>
        {isRtl ? 'טיולי יום בטנזניה' : 'Day trips in Tanzania'}
      </h2>
      <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '15px' : '17px', fontWeight: 300,
        color: SC.ink, margin: '0 0 28px', maxWidth: '640px', lineHeight: 1.6, textAlign: 'start' }}>
        {isRtl
          ? 'אפשר להוסיף למסע יום או יומיים של אטרקציות באזור, לפני הספארי או אחריו.'
          : 'Add a day or two of local attractions to the journey, before the safari or after it.'}
      </p>
      <div style={{ display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(SAFARI_DAY_TRIPS.length, 4)}, 1fr)`, gap: '16px' }}>
        {SAFARI_DAY_TRIPS.map(d => (
          <article key={d.slug} style={{ background: '#FFFFFF', border: `1px solid ${SC.sandLine}`,
            borderRadius: '16px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ aspectRatio: '4 / 3', background: `linear-gradient(135deg, ${SC.green}, ${SC.gold})`,
              backgroundImage: `url(${d.img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
            <div style={{ padding: '14px 16px 18px', textAlign: 'start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '18px', fontWeight: 700,
                  color: SC.deep, margin: 0 }}>{isRtl ? d.name : d.nameEn}</h3>
                <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '10.5px', fontWeight: 700,
                  color: SC.ink, background: '#FEF3C7', border: '1px solid #F59E0B',
                  borderRadius: '999px', padding: '2px 8px' }}>{isRtl ? d.duration : d.durationEn}</span>
              </div>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13.5px', fontWeight: 300,
                color: SC.ink, margin: 0, lineHeight: 1.55 }}>{isRtl ? d.desc : d.descEn}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}



/* ── Card slider ────────────────────────────────────────────────────────
   Three cards per view with arrows (owner, Jul 30 2026). On a phone it drops to
   a plain vertical stack rather than a swipe strip, matching the package cards
   above — the owner asked for stacking there and the page should not disagree
   with itself. Arrows are inline SVG chevrons; no emoji anywhere on this site. */
function Chevron({ dir, size = 18 }) {
  const d = dir === 'prev' ? 'M15 18l-6-6 6-6' : 'M9 18l6-6-6-6';
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

function SliderArrow({ dir, disabled, onClick, isRtl }) {
  /* In RTL the visual "next" points left, so flip the glyph, not the handler. */
  const glyph = isRtl ? (dir === 'next' ? 'prev' : 'next') : dir;
  return (
    <button onClick={onClick} disabled={disabled}
      aria-label={dir === 'prev' ? (isRtl ? 'הקודם' : 'Previous') : (isRtl ? 'הבא' : 'Next')}
      style={{
        width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
        border: `1px solid ${disabled ? SC.sandLine : SC.earth}`,
        background: '#FFFFFF', color: disabled ? '#C9BCA8' : SC.earth,
        cursor: disabled ? 'default' : 'pointer',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        transition: 'color 150ms ease, border-color 150ms ease',
      }}>
      <Chevron dir={glyph} />
    </button>
  );
}

function CardSlider({ items, renderCard, isRtl, isMobile, perView = 3 }) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    /* scrollLeft is negative in RTL, so compare on absolute distance. */
    const pos = Math.abs(el.scrollLeft);
    const max = el.scrollWidth - el.clientWidth - 2;
    setCanPrev(pos > 2);
    setCanNext(pos < max);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || isMobile) return;
    update();
    el.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => { el.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, [update, isMobile, items.length]);

  const step = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.firstElementChild;
    const delta = (card ? card.getBoundingClientRect().width + 16 : 260) * (dir === 'next' ? 1 : -1);
    el.scrollBy({ left: isRtl ? -delta : delta, behavior: 'smooth' });
  };

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {items.map(renderCard)}
      </div>
    );
  }

  return (
    <>
      <div ref={trackRef} style={{
        display: 'flex', alignItems: 'stretch', gap: '16px', overflowX: 'auto',
        scrollSnapType: 'x mandatory', scrollbarWidth: 'none', msOverflowStyle: 'none',
        paddingBottom: '4px',
      }}>
        {items.map((it, i) => (
          <div key={it.slug || i} style={{
            flex: `0 0 calc((100% - ${(perView - 1) * 16}px) / ${perView})`,
            scrollSnapAlign: 'start',
            display: 'flex',          /* stretch the card to the row's height */
          }}>
            {renderCard(it, i)}
          </div>
        ))}
      </div>
      {items.length > perView && (
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          <SliderArrow dir="prev" disabled={!canPrev} onClick={() => step('prev')} isRtl={isRtl} />
          <SliderArrow dir="next" disabled={!canNext} onClick={() => step('next')} isRtl={isRtl} />
        </div>
      )}
    </>
  );
}

/* Shared section heading, so every block on this page lines up. */
function SectionHead({ title, sub, isMobile }) {
  return (
    <>
      <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '26px' : '38px', fontWeight: 700,
        color: SC.deep, margin: '0 0 8px', letterSpacing: '-0.02em', textAlign: 'start' }}>{title}</h2>
      {sub && <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '15px' : '17px', fontWeight: 300,
        color: SC.ink, margin: '0 0 28px', maxWidth: '640px', lineHeight: 1.6, textAlign: 'start' }}>{sub}</p>}
    </>
  );
}

/* Photo tile shared by the reserves and lodging rows.
   EQUAL HEIGHT BY CONSTRUCTION (owner, Jul 30 2026: keep rows and card heights
   uniform): the tile fills its slider cell, the image keeps a fixed 4:3 ratio,
   the title reserves two lines whether or not it needs them, and the body is
   clamped to four lines. A longer description therefore cannot make one card
   taller than its neighbours. */
function PhotoCard({ img, title, desc, chip, gradient, href, cta, rtl }) {
  const [hover, setHover] = useState(false);
  const clamp = (lines) => ({
    display: '-webkit-box',
    WebkitLineClamp: lines,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  });
  // A card with href becomes one big link; without it, a plain article. Same box
  // either way, so the package row is visually identical to reserves and lodging.
  const Box = href ? 'a' : 'article';
  const linkProps = href
    ? { href, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false) }
    : {};
  return (
    <Box {...linkProps} style={{ background: '#FFFFFF', border: `1px solid ${SC.sandLine}`,
      borderRadius: '16px', overflow: 'hidden', textDecoration: 'none',
      height: '100%', display: 'flex', flexDirection: 'column',
      transition: 'transform .22s ease, box-shadow .22s ease',
      transform: hover ? 'translateY(-4px)' : 'none',
      boxShadow: hover ? '0 14px 32px rgba(120,86,42,0.16)' : 'none' }}>
      <div style={{ aspectRatio: '4 / 3', flexShrink: 0, background: gradient,
        backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div style={{ padding: '14px 16px 18px', textAlign: 'start', flex: 1,
        display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
          <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '18px', fontWeight: 700,
            color: SC.deep, margin: 0, lineHeight: 1.25, minHeight: '2.5em', ...clamp(2) }}>{title}</h3>
          {chip && <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '10.5px', fontWeight: 700,
            color: SC.deep, background: '#FEF3C7', border: '1px solid #F59E0B',
            borderRadius: '999px', padding: '2px 8px', flexShrink: 0 }}>{chip}</span>}
        </div>
        <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13.5px', fontWeight: 300,
          color: SC.ink, margin: 0, lineHeight: 1.55, ...clamp(3) }}>{desc}</p>
        {cta && (
          <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 700,
            color: SC.earth, marginTop: 'auto', paddingTop: '14px',
            display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            {cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"
              style={{ transform: rtl ? 'scaleX(-1)' : 'none' }}>
              <path d="M5 12h14M13 6l6 6-6 6" stroke={SC.earth} strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        )}
      </div>
    </Box>
  );
}

/* ── The three safari packages ──────────────────────────────────────────
   Was <ExpeditionExplorer type="safari" />, the shared home-page card row. The
   owner asked for the same card as the reserves and lodging rows (Jul 30 2026),
   so this reuses PhotoCard and adds only what a package card needs: a link to
   its expedition page and a read-more affordance. Centred, and one per row on
   mobile. Reads EXPS directly, so a card appears the moment a record exists. */
function PackageCards({ isRtl, isMobile }) {
  const packs = EXPS.filter(e => e.type === 'Safari')
                    .sort((a, b) => a.id - b.id);
  if (!packs.length) return null;
  return (
    <section style={{ padding: isMobile ? '28px 5% 8px' : '44px 5% 16px',
      maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, minmax(0, 1fr))',
        gap: '16px', alignItems: 'stretch', justifyContent: 'center' }}>
        {packs.map(exp => (
          <PhotoCard key={exp.slug} rtl={isRtl}
            href={`/expedition/${exp.slug}`}
            img={exp.img}
            title={isRtl ? exp.nameHe : (exp.nameEn || exp.name)}
            desc={isRtl ? exp.cardDesc : exp.cardDescEn}
            cta={isRtl ? 'לפרטי המסלול' : 'See the route'}
            gradient={`linear-gradient(135deg, ${SC.earth}, ${SC.ochre})`} />
        ))}
      </div>
    </section>
  );
}

/* ── How it works ───────────────────────────────────────────────────────
   Leads with the fact that matters most commercially: our safaris are PRIVATE. */
function HowItWorks({ isRtl, isMobile }) {
  return (
    <section style={{ padding: isMobile ? '36px 5% 8px' : '56px 5% 16px', maxWidth: '1280px', margin: '0 auto' }}>
      <SectionHead isMobile={isMobile}
        title={isRtl ? 'איך נראה ספארי איתנו' : 'What a safari with us looks like'}
        sub={isRtl
          ? 'ספארי הוא לא טיול מאורגן. זה הג׳יפ שלכם, הקצב שלכם, והמדריך שמכיר את השטח.'
          : 'A safari is not a packaged tour. It is your jeep, your pace, and a guide who knows the ground.'} />
      <div style={{ display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '16px' }}>
        {SAFARI_HOW_IT_WORKS.map((it, i) => (
          <div key={i} style={{ background: '#FFFFFF', border: `1px solid ${SC.sandLine}`,
            borderRadius: '16px', padding: '18px 20px', display: 'flex', gap: '14px', textAlign: 'start' }}>
            {(() => {
              const Ico = SAFARI_ICONS[it.icon] || UsersIcon;
              return (
                <span style={{ flexShrink: 0, width: '44px', height: '44px', borderRadius: '12px',
                  background: '#FEF6E7', border: `1px solid ${SC.sandLine}`,
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Ico size={22} color={SC.earth} />
                </span>
              );
            })()}
            <div style={{ minWidth: 0 }}>
              <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '17px', fontWeight: 700,
                color: SC.deep, margin: '0 0 6px' }}>{isRtl ? it.title : it.titleEn}</h3>
              <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', fontWeight: 300,
                color: SC.ink, margin: 0, lineHeight: 1.6, display: '-webkit-box',
                WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {isRtl ? it.desc : it.descEn}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Where you sleep ────────────────────────────────────────────────────── */
function Lodging({ isRtl, isMobile }) {
  return (
    <section style={{ padding: isMobile ? '36px 5% 8px' : '56px 5% 16px', maxWidth: '1280px', margin: '0 auto' }}>
      <SectionHead isMobile={isMobile}
        title={isRtl ? 'איפה ישנים' : 'Where you sleep'}
        sub={isRtl
          ? 'בספארי הלינה היא חצי מהחוויה. אלה הקמפים והלודג׳ים שאנחנו עובדים איתם.'
          : 'On a safari the accommodation is half the experience. These are the camps and lodges we work with.'} />
      <CardSlider items={SAFARI_LODGING} isRtl={isRtl} isMobile={isMobile}
        renderCard={l => (
          <PhotoCard key={l.slug} img={l.img} title={isRtl ? l.name : l.nameEn}
            chip={isRtl ? l.area : l.areaEn}
            desc={isRtl ? l.desc : l.descEn}
            gradient={`linear-gradient(135deg, ${SC.green}, ${SC.gold})`} />
        )} />
    </section>
  );
}

/* ── Trust ──────────────────────────────────────────────────────────────
   The 5.0 Google rating sits in the top bar and scrolls away; buyers need it
   next to the decision, not above it. */
function TrustBar({ isRtl, isMobile }) {
  const items = isRtl
    ? [['5.0', 'דירוג בגוגל', true], ['1,200+', 'מטיילים איתנו'], ['פרטי', 'ג׳יפ ומדריך משלכם'], ['תרומה', 'בכל מסע, לחולי סרטן']]
    : [['5.0', 'Google rating', true], ['1,200+', 'travellers with us'], ['Private', 'your own jeep and guide'], ['Donation', 'to cancer patients, every journey']];
  return (
    <section style={{ padding: isMobile ? '28px 5%' : '40px 5%', maxWidth: '1280px', margin: '0 auto' }}>
      <div style={{ background: '#FFFFFF', border: `1px solid ${SC.sandLine}`, borderRadius: '18px',
        padding: isMobile ? '18px' : '22px 28px', display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '18px' }}>
        {items.map(([big, small, withStar], i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '20px' : '24px',
              fontWeight: 800, color: SC.earth, lineHeight: 1.1,
              display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              {withStar && <StarIcon size={isMobile ? 17 : 20} color={SC.gold} />}{big}</div>
            <div style={{ fontFamily: "'Ploni', sans-serif", fontSize: '12.5px', fontWeight: 400,
              color: SC.ink, marginTop: '4px' }}>{small}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── FAQ ────────────────────────────────────────────────────────────────── */
function Faq({ isRtl, isMobile }) {
  const [open, setOpen] = useState(0);
  return (
    <section style={{ padding: isMobile ? '36px 5% 8px' : '56px 5% 16px', maxWidth: '900px', margin: '0 auto' }}>
      <SectionHead isMobile={isMobile}
        title={isRtl ? 'שאלות נפוצות' : 'Frequently asked questions'} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {SAFARI_FAQ.map((f, i) => {
          const isOpen = open === i;
          return (
            <div key={i} style={{ background: '#FFFFFF', border: `1px solid ${SC.sandLine}`, borderRadius: '14px' }}>
              <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '15px 18px', display: 'flex', alignItems: 'center', gap: '12px',
                  textAlign: 'start', fontFamily: "'Ploni', sans-serif", fontSize: '16px',
                  fontWeight: 600, color: SC.deep }}>
                <span style={{ flex: 1 }}>{isRtl ? f.q : f.qEn}</span>
                <span aria-hidden style={{ flexShrink: 0, color: SC.earth, fontSize: '20px', lineHeight: 1,
                  transform: isOpen ? 'rotate(45deg)' : 'none', transition: 'transform 160ms ease' }}>+</span>
              </button>
              {isOpen && (
                <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14.5px', fontWeight: 300,
                  color: SC.ink, margin: 0, padding: '0 18px 16px', lineHeight: 1.65, textAlign: 'start' }}>
                  {isRtl ? f.a : f.aEn}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── Enquiry band ───────────────────────────────────────────────────────
   The page had NO call to action at all: a reader who got this far reached the
   footer with nowhere to go. Same short field set the safari trip pages use
   (name / month / people / phone / email / consent) and the same
   /api/submit-lead contract, tagged Source="Safari Page" so these leads are
   identifiable in the pipeline. */
function EnquiryBand({ isRtl, isMobile }) {
  const [form, setForm] = useState({ name: '', days: '', month: '', people: '', dial: '+972', phone: '', email: '', privacy: false });
  const [status, setStatus] = useState('idle');
  const [phoneErr, setPhoneErr] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.privacy || status === 'loading') return;
    if (!validatePhone(form.dial, form.phone)) {
      setPhoneErr(isRtl ? 'מספר טלפון לא תקין' : 'Invalid phone number');
      return;
    }
    setPhoneErr(''); setStatus('loading');
    // Only the three real lengths become a number; "unsure" stays empty.
    const len = ['3', '5', '7'].includes(form.days) ? form.days : '';
    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            Name: form.name,
            Phone: formatFullPhone(form.dial, form.phone),
            Email: form.email,
            Expedition: len ? `Safari ${len} Days` : 'Safari',
            'Preferred Month': form.month,
            'Group Size': form.people ? Number(form.people) : undefined,
            Message: len ? `ספארי ${len} ימים` : 'ספארי, עוד לא הוחלט על מספר הימים',
            Source: 'Safari Page',
          },
          ...getAttribution(),
        }),
      });
      if (res.ok) Analytics.leadSubmit({ source: 'safari_page' });
      setStatus(res.ok ? 'sent' : 'error');
    } catch { setStatus('error'); }
  }

  const input = {
    width: '100%', padding: '12px 14px', borderRadius: '12px',
    border: `1px solid ${SC.sandLine}`, background: '#FFFFFF',
    fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: SC.deep,
    boxSizing: 'border-box', outline: 'none',
  };
  const label = { display: 'block', fontFamily: "'Ploni', sans-serif", fontSize: '13px',
    fontWeight: 600, color: SC.deep, marginBottom: '6px', textAlign: 'start' };

  if (status === 'sent') {
    return (
      <section style={{ padding: isMobile ? '36px 5%' : '56px 5%', maxWidth: '760px', margin: '0 auto' }}>
        <div style={{ background: '#FFFFFF', border: `1px solid ${SC.sandLine}`, borderRadius: '20px',
          padding: '40px 28px', textAlign: 'center' }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <span style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#FEF6E7',
              border: `1px solid ${SC.sandLine}`, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <LionIcon size={30} color={SC.earth} />
            </span>
          </div>
          <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '24px', fontWeight: 700,
            color: SC.deep, margin: '0 0 8px' }}>{isRtl ? 'קיבלנו, תודה!' : 'Got it, thank you!'}</h2>
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 300,
            color: SC.ink, margin: 0, lineHeight: 1.6 }}>
            {isRtl ? 'ניצור אתכם קשר בהקדם כדי לבנות יחד את הספארי שלכם.'
                   : 'We will be in touch shortly to build your safari together.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section style={{ padding: isMobile ? '36px 5%' : '56px 5%', maxWidth: '760px', margin: '0 auto' }}>
      <div style={{ background: `linear-gradient(135deg, ${SC.earth} 0%, ${SC.ochre} 55%, ${SC.gold} 100%)`,
        borderRadius: '22px', padding: isMobile ? '24px 20px' : '36px 40px' }}>
        <h2 style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '24px' : '32px', fontWeight: 700,
          color: '#FFFFFF', margin: '0 0 8px', letterSpacing: '-0.02em', textAlign: 'center' }}>
          {isRtl ? 'מתכננים ספארי בטנזניה?' : 'Planning a safari in Tanzania?'}
        </h2>
        <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '14.5px' : '16px', fontWeight: 300,
          color: 'rgba(255,255,255,0.92)', margin: '0 0 22px', textAlign: 'center', lineHeight: 1.6 }}>
          {isRtl ? 'השאירו פרטים ונחזור אליכם עם מסלול שמתאים בדיוק לכם.'
                 : 'Leave your details and we will come back with an itinerary built around you.'}
        </p>

        <form onSubmit={submit} style={{ background: '#FFFFFF', borderRadius: '16px',
          padding: isMobile ? '18px' : '22px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={label}>{isRtl ? 'שם מלא *' : 'Full name *'}</label>
            <input required value={form.name} onChange={e => set('name', e.target.value)} style={input} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '14px' }}>
            <div>
              <label style={label}>{isRtl ? 'כמה ימים? *' : 'How many days? *'}</label>
              <select required value={form.days} onChange={e => set('days', e.target.value)}
                style={{ ...input, cursor: 'pointer', color: form.days ? SC.deep : '#9CA3AF' }}>
                <option value="" disabled>{isRtl ? 'בחרו' : 'Select'}</option>
                <option value="3">{isRtl ? '3 ימים' : '3 days'}</option>
                <option value="5">{isRtl ? '5 ימים' : '5 days'}</option>
                <option value="7">{isRtl ? '7 ימים' : '7 days'}</option>
                <option value="unsure">{isRtl ? 'עוד לא החלטנו' : 'Not decided yet'}</option>
              </select>
            </div>
            <div>
              <label style={label}>{isRtl ? 'באיזה חודש תרצו לצאת? *' : 'Which month? *'}</label>
              <input required value={form.month} onChange={e => set('month', e.target.value)} style={input}
                placeholder={isRtl ? 'לדוגמה: אוגוסט' : 'E.g. August'} />
            </div>
            <div>
              <label style={label}>{isRtl ? 'כמות אנשים *' : 'Number of people *'}</label>
              <input required type="number" min="1" max="20" value={form.people}
                onChange={e => set('people', e.target.value.replace(/\D/g, '').slice(0, 2))} style={input} placeholder="2" />
            </div>
          </div>
          <PhoneField
            label={<span style={{ ...label, marginBottom: 0 }}>{isRtl ? 'מספר טלפון *' : 'Phone *'}</span>}
            dial={form.dial} onDialChange={v => set('dial', v)}
            local={form.phone} onLocalChange={v => { set('phone', v); if (phoneErr) setPhoneErr(''); }}
            error={!!phoneErr} errorMsg={phoneErr}
          />
          <div>
            <label style={label}>{isRtl ? 'מייל *' : 'Email *'}</label>
            <input required type="email" value={form.email} onChange={e => set('email', e.target.value)} style={input} />
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', cursor: 'pointer',
            fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: SC.ink, textAlign: 'start', lineHeight: 1.5 }}>
            <input type="checkbox" checked={form.privacy} onChange={e => set('privacy', e.target.checked)}
              style={{ marginTop: '3px', width: '16px', height: '16px', accentColor: SC.earth, flexShrink: 0 }} />
            <span>{isRtl
              ? 'אני מסכימ/ה למדיניות הפרטיות ולקבלת דיוור שיווקי'
              : 'I agree to the privacy policy and to receiving marketing communications'}</span>
          </label>
          {status === 'error' && (
            <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', color: '#DC2626', margin: 0, textAlign: 'start' }}>
              {isRtl ? 'משהו השתבש, נסו שוב או פנו אלינו בוואטסאפ.' : 'Something went wrong. Please try again or reach us on WhatsApp.'}
            </p>
          )}
          <button type="submit" disabled={!form.privacy || status === 'loading'}
            style={{ width: '100%', padding: '14px', borderRadius: '999px', border: 'none',
              background: (!form.privacy || status === 'loading') ? '#D8C7B0' : SC.earth,
              color: '#FFFFFF', fontFamily: "'Ploni', sans-serif", fontSize: '16px', fontWeight: 700,
              cursor: (!form.privacy || status === 'loading') ? 'not-allowed' : 'pointer',
              transition: 'background 160ms ease' }}>
            {status === 'loading' ? (isRtl ? 'שולח…' : 'Sending…') : (isRtl ? 'לתיאום שיחה' : 'Book a call')}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function SafariPage() {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';
  const dir = isRtl ? 'rtl' : 'ltr';
  const { isMobile } = useBreakpoint();

  useEffect(() => {
    document.title = isRtl
      ? 'ספארי בטנזניה | HighAir Expeditions'
      : 'Tanzania Safari | HighAir Expeditions';
    const desc = isRtl
      ? 'ספארי בטנזניה עם HighAir - שלושה אורכים לבחירה, 3, 5 ו-7 ימים, בשמורות המרהיבות של אפריקה.'
      : "Tanzania safari with HighAir - three lengths to choose from: 3, 5 and 7 days across Africa's most spectacular reserves.";
    document.querySelector('meta[name="description"]')?.setAttribute('content', desc);
  }, [isRtl]);

  return (
    <>
      <Header />
      <main id="main-content" style={{ background: '#FDFBF7', minHeight: '100vh', paddingTop: isMobile ? '80px' : '124px', direction: dir }}>

        {/* ── Intro band — same treatment as the other standalone pages ── */}
        <div style={{
          /* Savanna, not the site's purple: earth + ochre so the page carries a
             safari mood the moment it opens (owner, Jul 30 2026, after Altezza).
             The rest of the site keeps its purple; only safari wears this. */
          background: 'linear-gradient(135deg, #A8520B 0%, #D97706 45%, #F5B942 100%)',
          padding: isMobile ? '52px 6% 48px' : '72px 8% 64px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '280px', height: '280px',
            borderRadius: '50%', background: 'rgba(255,214,120,0.35)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '240px', height: '240px',
            borderRadius: '50%', background: 'rgba(150,190,90,0.26)', filter: 'blur(55px)', pointerEvents: 'none' }} />

          <h1 style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: isMobile ? '36px' : '56px',
            fontWeight: 700,
            color: '#FFFFFF',
            margin: '0 0 16px',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            position: 'relative',
          }}>
            {isRtl ? 'ספארי בטנזניה' : 'Tanzania Safari'}
          </h1>

          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize: isMobile ? '16px' : '19px',
            fontWeight: 300,
            color: 'rgba(255,255,255,0.92)',
            margin: '0 auto',
            maxWidth: '620px',
            lineHeight: 1.6,
            position: 'relative',
          }}>
            {isRtl
              ? 'שלושה אורכים, אותן שמורות מהמרהיבות באפריקה. בחרו כמה ימים אתם רוצים בטבע, ואנחנו נדאג לכל השאר.'
              : 'Three lengths, the same spectacular African reserves. Choose how many days you want in the wild, and we will handle everything else.'}
          </p>
        </div>

        {/* ── The three packages, centred, in the same card as the rest of the page ── */}
        <PackageCards isRtl={isRtl} isMobile={isMobile} />

        <HowItWorks    isRtl={isRtl} isMobile={isMobile} />
        <TrustBar      isRtl={isRtl} isMobile={isMobile} />
        <ReservesStrip isRtl={isRtl} isMobile={isMobile} />
        <Lodging       isRtl={isRtl} isMobile={isMobile} />
        <SeasonGuide   isRtl={isRtl} isMobile={isMobile} />
        {/* Day trips hidden for now (owner, Jul 30 2026: "תוריד בינתיים").
            The <DayTrips/> component and SAFARI_DAY_TRIPS data are intact —
            uncomment this one line to bring the section back. */}
        {/* <DayTrips isRtl={isRtl} isMobile={isMobile} /> */}
        <Faq           isRtl={isRtl} isMobile={isMobile} />
        <EnquiryBand   isRtl={isRtl} isMobile={isMobile} />

        {/* The last section ends flush; give the footer room to breathe. */}
        <div style={{ height: isMobile ? '48px' : '72px' }} />
      </main>
      <SiteFooter />
    </>
  );
}
