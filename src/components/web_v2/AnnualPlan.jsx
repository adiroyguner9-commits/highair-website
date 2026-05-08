/**
 * AnnualPlan.jsx - /annual-plan
 * All upcoming trips (worldwide + Israel) from Airtable,
 * grouped by month, sorted earliest → latest.
 * Trips are removed automatically once their Return date passes.
 */

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { EXPS } from '../../data/mockData.js';
import { ISRAEL_TRIPS } from '../../data/israelData.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';

/* ── Helpers ── */
function fmtDate(str, months) {
  if (!str) return '';
  const d = new Date(str);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function monthKey(str) {
  const d = new Date(str);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(key, months) {
  const [year, month] = key.split('-');
  return `${months[parseInt(month, 10) - 1]} ${year}`;
}

/* Tag for safari / kosher variants */
function eventTag(e, isRtl) {
  const n = (typeof e === 'string' ? e : e?.slug || e?.eventName || '').toLowerCase();
  if (n.includes('kosher') && n.includes('safari')) return isRtl ? 'שומרי מסורת + ספארי' : 'Kosher + Safari';
  if (n.includes('kosher')) return isRtl ? 'שומרי מסורת' : 'Kosher';
  if (n.includes('safari')) return isRtl ? '+ ספארי' : '+ Safari';
  return null;
}

/* Find expedition from EXPS by matching eventName → airtableEvents */
function findExp(eventName) {
  if (!eventName) return null;
  const lower = eventName.toLowerCase();
  return EXPS.find(e =>
    (e.airtableEvents || []).some(ev => ev.toLowerCase() === lower)
  ) || null;
}

/* Find Israel trip by matching eventName → airtableEvents */
function findIsraelTrip(eventName) {
  if (!eventName) return null;
  const lower = eventName.toLowerCase();
  return ISRAEL_TRIPS.find(t =>
    (t.airtableEvents || []).some(ev => ev.toLowerCase() === lower)
  ) || null;
}

/* Classify a group: 'israel' or 'world' */
function classifyGroup(eventName) {
  if (findIsraelTrip(eventName)) return 'israel';
  return 'world';
}

/* ══════════════════════════════════════════════════════════════
   TripCard
══════════════════════════════════════════════════════════════ */
function TripCard({ group, exp, months, isRtl }) {
  const [hovered, setHovered] = useState(false);

  /* Resolve Israel trip data: prefer rich israelData.js lookup, fall back to embedded Airtable fields */
  const trip = group._isIsrael
    ? (findIsraelTrip(group.eventName) || {
        name:   group._nameHe || group.eventName,
        nameEn: group._nameEn || group.eventName,
        slug:   group._slug,
        img:    group._img,
        grad:   group._grad,
      })
    : null;

  const imgSrc    = exp?.img || trip?.img || null;
  const [imgReady, setImgReady] = useState(!imgSrc);
  const cardRef  = useRef(null);
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  const capacity  = group.capacity || exp?.groupCapacity || trip?.groupCapacity || 15;
  const spotsLeft = capacity - (group.count || 0);
  const isFull    = spotsLeft <= 0;
  const isLow     = !isFull && spotsLeft <= 6;
  const spotsBadge = isFull
    ? { bg: 'rgba(220,38,38,0.85)',  color: '#fff', text: isRtl ? 'קבוצה מלאה' : 'Full' }
    : isLow
    ? { bg: 'rgba(217,119,6,0.85)',  color: '#fff', text: isRtl ? `נשארו ${spotsLeft} מקומות` : `${spotsLeft} spots left` }
    : { bg: 'rgba(5,150,105,0.85)',  color: '#fff', text: isRtl ? 'הרשמה פתוחה' : 'Open' };
  const tag = eventTag(group.eventName, isRtl);

  /* Lazy-load image */
  useEffect(() => {
    if (!imgSrc) return;
    const el  = cardRef.current;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setImgReady(true); obs.disconnect(); }
    }, { rootMargin: '200px' });
    obs.observe(el);
    return () => obs.disconnect();
  }, [imgSrc]);

  const fallbackGrad = exp?.grad || trip?.grad || 'linear-gradient(135deg,#4338ca,#7c3aed,#1e1b4b)';
  const bg = imgSrc
    ? (imgReady ? `url(${imgSrc}) center/cover no-repeat` : fallbackGrad)
    : fallbackGrad;

  function handleClick() {
    if (trip?.slug)  return navigate(`/israel/${trip.slug}`);
    if (exp?.slug)   return navigate(`/expedition/${exp.slug}`);
  }

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius:   RADIUS.xl,
        overflow:       'hidden',
        background:     bg,
        display:        'flex',
        flexDirection:  'column',
        justifyContent: 'space-between',
        minHeight:      isMobile ? '220px' : '280px',
        cursor:         (exp?.slug || trip?.slug) ? 'pointer' : 'default',
        transform:      hovered && (exp?.slug || trip?.slug) ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow:      hovered && (exp?.slug || trip?.slug)
                          ? '0 20px 48px rgba(0,0,0,0.22)'
                          : '0 4px 16px rgba(0,0,0,0.10)',
        transition:     `transform 0.3s ${EASING.out}, box-shadow 0.3s ${EASING.out}`,
        position:       'relative',
      }}
    >
      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.65) 100%)',
        zIndex: 0,
      }} />

      {/* ── Top row: country badge + spots badge ── */}
      <div style={{
        padding:        '16px 16px 0',
        direction:      isRtl ? 'rtl' : 'ltr',
        position:       'relative',
        zIndex:         1,
        display:        'flex',
        justifyContent: 'space-between',
        alignItems:     'center',
      }}>
        {/* Country badge */}
        <div style={{
          display:              'inline-flex',
          alignItems:           'center',
          gap:                  '5px',
          padding:              '4px 10px',
          borderRadius:         RADIUS.full,
          background:           'rgba(255,255,255,0.15)',
          backdropFilter:       'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily:           'Ploni, sans-serif',
          fontSize:             FS.sm,
          fontWeight:           600,
          color:                'rgba(255,255,255,0.92)',
          direction:            'ltr',
        }}>
          {trip
            ? `🇮🇱 ${isRtl ? 'ישראל' : 'Israel'}`
            : `${exp?.flag || ''} ${isRtl ? (exp?.countryHe || '-') : (exp?.country || exp?.countryHe || '-')}`
          }
        </div>

        {/* Spots badge — top left (end in RTL) */}
        <div style={{
          display:              'inline-flex',
          alignItems:           'center',
          padding:              '4px 10px',
          borderRadius:         RADIUS.full,
          background:           spotsBadge.bg,
          backdropFilter:       'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          fontFamily:           'Ploni, sans-serif',
          fontSize:             FS.sm,
          fontWeight:           700,
          color:                spotsBadge.color,
          whiteSpace:           'nowrap',
        }}>
          {spotsBadge.text}
        </div>
      </div>

      {/* ── Bottom: name + dates + spots ── */}
      <div style={{ padding: '0 16px 18px', direction: isRtl ? 'rtl' : 'ltr', position: 'relative', zIndex: 1 }}>
        <h3 style={{
          fontFamily:    "'Ploni', sans-serif",
          fontSize:      'clamp(16px, 2.5vw, 20px)',
          fontWeight:    700,
          color:         '#FFFFFF',
          margin:        '0 0 6px',
          letterSpacing: '-0.02em',
          lineHeight:    1.2,
        }}>
          {trip
            ? (isRtl ? trip.name : (trip.nameEn || trip.name))
            : (isRtl ? (exp?.nameHe || group.eventName) : (exp?.nameEn || exp?.name || exp?.nameHe || group.eventName))
          }
        </h3>

        {/* Date range */}
        <p style={{
          fontFamily: "'Ploni', sans-serif",
          fontSize:   '13px',
          fontWeight: 400,
          color:      'rgba(255,255,255,0.80)',
          margin:     0,
          textAlign:  'start',
        }}>
          {fmtDate(group.departure, months)}
          {group.returnDate ? ` – ${fmtDate(group.returnDate, months)}` : ''}
        </p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   Main page
══════════════════════════════════════════════════════════════ */
export default function AnnualPlan() {
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';
  const tabsRef = useRef(null);
  const monthNames = t('annualPlan.months', { returnObjects: true });

  const [groups,       setGroups]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [activeMonth,  setActiveMonth]  = useState(null);
  const [filter,       setFilter]       = useState('all'); // 'all' | 'world' | 'israel'
  const [contentFaded, setContentFaded] = useState(false);
  const filterTimerRef = useRef(null);
  const rafRef         = useRef(null);

  function changeFilter(key) {
    if (key === filter) return;
    clearTimeout(filterTimerRef.current);
    cancelAnimationFrame(rafRef.current);

    /* Step 1 – fade out */
    setContentFaded(true);

    /* Step 2 – after fade-out completes, swap filter data */
    filterTimerRef.current = setTimeout(() => {
      setFilter(key);
      /* Step 3 – two rAFs: first lets React paint the new (still-hidden) content,
         second triggers the fade-in transition in a fresh paint cycle */
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setContentFaded(false);
        });
      });
    }, 180); // slightly longer than the 160ms CSS transition
  }

  usePageMeta({
    title:         isRtl ? 'תוכנית שנתית | HighAir Expeditions' : 'Expedition Schedule 2026 | HighAir Expeditions',
    description:   isRtl
      ? 'כל המשלחות והטרקים המתוכננים של HighAir Expeditions לשנה הקרובה — קילימנג׳רו, אוורסט, אלברוס, אנאפורנה ועוד. בחרו תאריך והצטרפו אלינו!'
      : 'All upcoming HighAir Expeditions treks and climbs for 2026 - Kilimanjaro, Everest, Elbrus, Annapurna and more. Pick a date and join us.',
    canonicalPath: '/annual-plan',
  });

  /* ── Fetch world + Israel groups from Airtable ── */
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    /* Paginate through ALL records of a table */
    async function fetchAllRecords(url) {
      const records = [];
      let offset = null;
      do {
        const full = offset ? `${url}&offset=${encodeURIComponent(offset)}` : url;
        const data = await fetch(full).then(r => r.json());
        if (data.error) throw new Error(JSON.stringify(data.error));
        (data.records || []).forEach(r => records.push(r));
        offset = data.offset || null;
      } while (offset);
      return records;
    }

    /* Normalise a raw Airtable record into our group shape */
    function normaliseGroup(rec, isIsrael, counts) {
      const groupName  = rec.fields['Group Name'] || rec.id;
      const returnDate = rec.fields['Return']     || null;
      const departure  = rec.fields['Departure']  || null;
      return {
        id:         rec.id,
        groupName,
        eventName:  rec.fields['Event'] || '',
        departure,
        returnDate,
        count:      counts[groupName] || 0,
        capacity:   rec.fields['Capacity'] || null,
        /* Israel-specific embedded fields (from IsraelGroups table) */
        _isIsrael:  isIsrael,
        _nameHe:    rec.fields['Name']       || '',
        _nameEn:    rec.fields['Name_En']    || '',
        _slug:      rec.fields['Slug']       || '',
        _img:       rec.fields['Image_URL']  || null,
        _grad:      rec.fields['Gradient']   || null,
      };
    }

    /* Common date filters (same rules for both tables) */
    function dateFilter(g) {
      if (!g.departure) return false;
      const weekFromNow = new Date(today);
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      return new Date(g.departure) >= weekFromNow;
    }

    Promise.all([
      fetch(`/api/airtable/Groups?fields[]=Event&fields[]=Group%20Name&fields[]=Departure&fields[]=Return&fields[]=Capacity`).then(r => r.json()),
      fetch(`/api/airtable/IsraelGroups?fields[]=Event&fields[]=Group%20Name&fields[]=Departure&fields[]=Return&fields[]=Capacity&fields[]=Name&fields[]=Name_En&fields[]=Slug&fields[]=Image_URL&fields[]=Gradient`).then(r => r.json()),
      fetchAllRecords(`/api/airtable/Customers?fields[]=Group%20Name&pageSize=100`),
    ]).then(([worldData, israelData, custRecords]) => {
      if (worldData.error)  throw new Error(JSON.stringify(worldData.error));
      if (israelData.error) throw new Error(JSON.stringify(israelData.error));

      /* Build group-name → customer count map */
      const counts = {};
      custRecords.forEach(rec => {
        const gn = rec.fields['Group Name'] || rec.fields['group name'];
        if (gn) counts[gn] = (counts[gn] || 0) + 1;
      });

      /* Process world groups */
      const worldGroups = (worldData.records || [])
        .map(rec => normaliseGroup(rec, false, counts))
        .filter(dateFilter)
        .filter(g => { const m = new Date(g.departure).getMonth(); return m !== 3 && m !== 4; })
        .filter(g => g.eventName !== 'Annapurna_Circut_Kosher');

      /* Process Israel groups */
      const israelGroups = (israelData.records || [])
        .map(rec => normaliseGroup(rec, true, counts))
        .filter(dateFilter);

      /* Combine and sort by departure date */
      const all = [...worldGroups, ...israelGroups]
        .sort((a, b) => new Date(a.departure) - new Date(b.departure));

      /* Merge duplicate rows (same expedition slug + same departure date) */
      const mergedMap = new Map();
      all.forEach(g => {
        const slug = g._isIsrael
          ? (g._slug || g.eventName)
          : (findExp(g.eventName)?.slug || g.eventName);
        const key = `${slug}|${(g.departure || '').slice(0, 10)}`;
        if (mergedMap.has(key)) {
          const ex = mergedMap.get(key);
          ex.count    += g.count;
          ex.capacity  = (ex.capacity || 0) + (g.capacity || 0);
          if (g.returnDate && (!ex.returnDate || new Date(g.returnDate) > new Date(ex.returnDate))) {
            ex.returnDate = g.returnDate;
          }
        } else {
          mergedMap.set(key, { ...g });
        }
      });
      const merged = Array.from(mergedMap.values());

      setGroups(merged);
      if (merged.length > 0) setActiveMonth(monthKey(merged[0].departure));
    }).catch(err => {
      console.error('[annual-plan]', err);
      setError(err.message);
    }).finally(() => setLoading(false));
  }, []);

  /* ── Filter by category ── */
  const filteredGroups = filter === 'all'    ? groups
    : filter === 'israel' ? groups.filter(g =>  g._isIsrael)
    : groups.filter(g => !g._isIsrael);

  /* Reset active month tab to first visible month when filter changes */
  useEffect(() => {
    if (groups.length === 0) return;
    const keys = [...new Set(
      (filter === 'all' ? groups : filter === 'israel'
        ? groups.filter(g => g._isIsrael)
        : groups.filter(g => !g._isIsrael)
      ).map(g => monthKey(g.departure))
    )].sort();
    if (keys.length > 0) setActiveMonth(keys[0]);
  }, [filter]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Group by month ── */
  const byMonth = {};
  filteredGroups.forEach(g => {
    const key = monthKey(g.departure);
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(g);
  });
  const months = Object.keys(byMonth).sort();

  /* ── Scroll to month section ── */
  function scrollToMonth(key) {
    setActiveMonth(key);
    const el = document.getElementById(`month-${key}`);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 160;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  return (
    <>
      <Header />
      <main style={{
        background: '#FAFAF8',
        minHeight:  '100vh',
        paddingTop: '80px',
        direction:  dir,
      }}>

        {/* ── Page header ── */}
        <div style={{
          background:  '#FFFFFF',
          borderBottom: '1px solid #ECEAF8',
          padding:     isMobile ? '36px 5% 28px' : '52px 5% 36px',
          textAlign:   'center',
        }}>
          <h1 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      isMobile ? '28px' : '42px',
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 12px',
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
          }}>
            {t('annualPlan.title')}
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     '0 0 24px',
            lineHeight: 1.7,
          }}>
            {t('annualPlan.subtitle')}
          </p>

          {/* ── Category filter ── */}
          <div style={{
            display:        'inline-flex',
            alignItems:     'center',
            gap:            '4px',
            background:     '#F3F1FB',
            borderRadius:   RADIUS.full,
            padding:        '4px',
          }}>
            {[
              { key: 'all',    label: t('annualPlan.filterAll') },
              { key: 'world',  label: t('annualPlan.filterWorld') },
              { key: 'israel', label: t('annualPlan.filterIsrael') },
            ].map(opt => {
              const active = filter === opt.key;
              return (
                <button
                  key={opt.key}
                  onClick={() => changeFilter(opt.key)}
                  style={{
                    padding:      isMobile ? '7px 16px' : '8px 22px',
                    borderRadius: RADIUS.full,
                    border:       'none',
                    background:   active ? '#FFFFFF' : 'transparent',
                    color:        active ? COLOR.primary : '#7B78A0',
                    fontFamily:   "'Ploni', sans-serif",
                    fontSize:     FS.btn,
                    fontWeight:   active ? 700 : 400,
                    cursor:       'pointer',
                    whiteSpace:   'nowrap',
                    transition:   `all 0.22s ${EASING.out}`,
                    boxShadow:    active ? '0 2px 10px rgba(109,40,217,0.15)' : 'none',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Sticky month tabs (real data) ── */}
        {!loading && months.length > 0 && (
          <div style={{
            position:     'sticky',
            top:          '80px',
            zIndex:       100,
            background:   '#FFFFFF',
            borderBottom: '1px solid #ECEAF8',
            boxShadow:    '0 2px 12px rgba(0,0,0,0.06)',
            animation:    'fadeIn 0.35s ease forwards',
            opacity:    contentFaded ? 0 : 1,
            transition: 'opacity 0.16s ease',
            willChange: 'opacity',
          }}>
            <div
              ref={tabsRef}
              style={{
                display:    'flex',
                gap:        '4px',
                overflowX:  'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                padding:    isMobile ? '12px 5%' : '14px 5%',
                maxWidth:   '1280px',
                margin:     '0 auto',
              }}
            >
              {months.map(key => {
                const isActive = key === activeMonth;
                return (
                  <button
                    key={key}
                    onClick={() => scrollToMonth(key)}
                    style={{
                      flexShrink:  0,
                      padding:     isMobile ? '6px 16px' : '8px 20px',
                      borderRadius: RADIUS.full,
                      border:      `2px solid ${isActive ? COLOR.primary : '#E5E3F0'}`,
                      background:  isActive ? COLOR.primary : '#FFFFFF',
                      color:       isActive ? '#FFFFFF' : '#4B4869',
                      fontFamily:  "'Ploni', sans-serif",
                      fontSize:    FS.btn,
                      fontWeight:  isActive ? 700 : 400,
                      cursor:      'pointer',
                      whiteSpace:  'nowrap',
                      transition:  `all 0.22s ${EASING.out}`,
                      boxShadow:   isActive ? '0 4px 14px rgba(109,40,217,0.25)' : 'none',
                    }}
                  >
                    {monthLabel(key, monthNames)}
                    <span style={{
                      display:        'inline-flex',
                      alignItems:     'center',
                      justifyContent: 'center',
                      minWidth:       '18px',
                      height:         '18px',
                      padding:        '0 4px',
                      borderRadius:   '9px',
                      marginRight:    '6px',
                      background:     isActive ? 'rgba(255,255,255,0.25)' : 'rgba(109,40,217,0.10)',
                      color:          isActive ? '#FFFFFF' : COLOR.primary,
                      fontSize:       '11px',
                      fontWeight:     700,
                    }}>
                      {byMonth[key].length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Skeleton tabs (during load) ── */}
        {loading && (
          <div style={{
            position:     'sticky',
            top:          '80px',
            zIndex:       100,
            background:   '#FFFFFF',
            borderBottom: '1px solid #ECEAF8',
            boxShadow:    '0 2px 12px rgba(0,0,0,0.06)',
          }}>
            <div style={{
              display:  'flex',
              gap:      '8px',
              padding:  isMobile ? '12px 5%' : '14px 5%',
              maxWidth: '1280px',
              margin:   '0 auto',
            }}>
              {[96, 80, 110, 88, 102].map((w, i) => (
                <div key={i} style={{
                  width: `${w}px`, height: '36px', borderRadius: RADIUS.full, flexShrink: 0,
                  background: 'linear-gradient(90deg,#ECEAF8 25%,#F5F3FF 50%,#ECEAF8 75%)',
                  backgroundSize: '400% 100%',
                  animation: `shimmer 1.6s ease-in-out ${i * 0.12}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* ── Content ── */}
        <div style={{
          maxWidth:   '1280px',
          margin:     '0 auto',
          padding:    isMobile ? '32px 5%' : '48px 5%',
          opacity:    contentFaded ? 0 : 1,
          transition: 'opacity 0.16s ease',
          willChange: 'opacity',
        }}>

          {/* ── Skeleton cards (during load) ── */}
          {loading && (
            <div>
              {[0, 1, 2].map(monthIdx => (
                <div key={monthIdx} style={{ marginBottom: isMobile ? '40px' : '56px' }}>

                  {/* Month title skeleton */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                    <div style={{
                      width: [110, 130, 100][monthIdx], height: '26px', borderRadius: '8px',
                      background: 'linear-gradient(90deg,#ECEAF8 25%,#F5F3FF 50%,#ECEAF8 75%)',
                      backgroundSize: '400% 100%',
                      animation: 'shimmer 1.6s ease-in-out infinite',
                    }} />
                    <div style={{ height: '2px', flex: 1, background: '#ECEAF8', borderRadius: '1px' }} />
                    <div style={{
                      width: '72px', height: '22px', borderRadius: RADIUS.full,
                      background: 'linear-gradient(90deg,#ECEAF8 25%,#F5F3FF 50%,#ECEAF8 75%)',
                      backgroundSize: '400% 100%',
                      animation: 'shimmer 1.6s ease-in-out infinite',
                    }} />
                  </div>

                  {/* Card skeletons — mimic TripCard layout */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                    gap: '16px',
                  }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        borderRadius:  RADIUS.xl,
                        minHeight:     isMobile ? '220px' : '280px',
                        background:    '#1e1b3a',
                        position:      'relative',
                        overflow:      'hidden',
                        display:       'flex',
                        flexDirection: 'column',
                        justifyContent:'space-between',
                        padding:       '16px',
                      }}>
                        {/* Shimmer sweep */}
                        <div style={{
                          position:   'absolute', inset: 0,
                          background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
                          backgroundSize: '250% 100%',
                          animation: `shimmer 1.8s ease-in-out ${i * 0.18 + monthIdx * 0.1}s infinite`,
                        }} />
                        {/* Top: badge placeholders */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
                          <div style={{ width: '80px', height: '26px', borderRadius: RADIUS.full, background: 'rgba(255,255,255,0.13)' }} />
                          <div style={{ width: '68px', height: '26px', borderRadius: RADIUS.full, background: 'rgba(255,255,255,0.13)' }} />
                        </div>
                        {/* Bottom: name + date placeholders */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', position: 'relative', zIndex: 1 }}>
                          <div style={{ width: '65%', height: '20px', borderRadius: '6px', background: 'rgba(255,255,255,0.18)' }} />
                          <div style={{ width: '42%', height: '13px', borderRadius: '6px', background: 'rgba(255,255,255,0.11)' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div style={{
              textAlign:  'center',
              padding:    '80px 0',
              fontFamily: "'Ploni', sans-serif",
              color:      '#DC2626',
              fontSize:   FS.body,
            }}>
              {t('annualPlan.error')}
            </div>
          )}

          {/* Empty state — no data at all */}
          {!loading && !error && groups.length === 0 && (
            <div style={{
              textAlign:   'center',
              padding:     '80px 24px',
              fontFamily:  "'Ploni', sans-serif',",
            }}>
              <div style={{ marginBottom: '16px' }}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none"
                  stroke={COLOR.primary} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#0A0818', margin: '0 0 8px' }}>
                {t('annualPlan.empty')}
              </p>
              <p style={{ fontSize: FS.body, color: '#6B6B8A', margin: 0 }}>
                {t('annualPlan.emptyDetail')}
              </p>
            </div>
          )}

          {/* Empty state — filter has no results */}
          {!loading && !error && groups.length > 0 && filteredGroups.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 24px', fontFamily: "'Ploni', sans-serif" }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗓️</div>
              <p style={{ fontSize: '18px', fontWeight: 700, color: '#0A0818', margin: '0 0 8px' }}>
                {isRtl ? 'אין טיולים מתוכננים בקטגוריה זו' : 'No trips in this category'}
              </p>
              <p style={{ fontSize: FS.body, color: '#6B6B8A', margin: 0 }}>
                {isRtl ? 'נסו לבחור "הכל" כדי לראות את כל הטיולים' : 'Try selecting "All" to see all trips'}
              </p>
            </div>
          )}

          {/* Month sections */}
          {!loading && !error && months.map((key) => (
            <div key={key} id={`month-${key}`} style={{
              marginBottom: isMobile ? '40px' : '56px',
            }}>

              {/* Month title */}
              <div style={{
                display:     'flex',
                alignItems:  'center',
                gap:         '12px',
                marginBottom: '20px',
              }}>
                <h2 style={{
                  fontFamily:    "'Ploni', sans-serif",
                  fontSize:      isMobile ? '20px' : '26px',
                  fontWeight:    700,
                  color:         '#0A0818',
                  margin:        0,
                  letterSpacing: '-0.02em',
                }}>
                  {monthLabel(key, monthNames)}
                </h2>
                <div style={{
                  height: '2px',
                  flex:   1,
                  background: 'linear-gradient(to left, transparent, #ECEAF8)',
                  borderRadius: '1px',
                }} />
                <span style={{
                  fontFamily: "'Ploni', sans-serif",
                  fontSize:   '13px',
                  fontWeight: 600,
                  color:      COLOR.primary,
                  background: '#F5F3FF',
                  padding:    '3px 10px',
                  borderRadius: RADIUS.full,
                }}>
                  {byMonth[key].length} {isRtl ? 'יציאות' : 'departures'}
                </span>
              </div>

              {/* Cards grid */}
              <div style={{
                display:             'grid',
                gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
                gap:                 '16px',
              }}>
                {byMonth[key].map(group => {
                  const exp = group._isIsrael ? null : findExp(group.eventName);
                  return (
                    <TripCard key={group.id} group={group} exp={exp} months={monthNames} isRtl={isRtl} />
                  );
                })}
              </div>
            </div>
          ))}

        </div>
      </main>
      <SiteFooter />
    </>
  );
}
