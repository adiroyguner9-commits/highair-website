/**
 * WorldExpeditionsPage.jsx - dedicated landing page for the world expeditions.
 * Mounted twice: /treks (type="treks") and /climbs (type="climbs").
 *
 * Own <Header/> + <SiteFooter/> (no shared route shell, same as SafariPage and
 * IsraelTreksPage). A hero, then the full grid of that type's destinations -
 * reuses the homepage ExpeditionExplorer section in `fullPage` mode (same cards,
 * same altitude filter), so nothing is duplicated.
 */

import { useTranslation } from 'react-i18next';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta, itemList, breadcrumbList } from '../../website/usePageMeta.js';
import { HOME_TREKS, HOME_CLIMBS } from '../../data/expeditionGroups.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import ExpeditionExplorer from './ExpeditionExplorer.jsx';

/* Per-type copy, hero image and SEO. Kept here so the two routes share one component. */
const CONFIG = {
  treks: {
    heroImg:   '/images/cards/annapurna.webp',
    heroPos:   'center',
    h1He:      'הטרקים שלנו בעולם',
    h1En:      'Our Treks Around the World',
    subHe:     'מהבלקן דרך אתיופיה ועד להימלאיה בנפאל - הטרקים שאסור לפספס.',
    subEn:     'From the Balkans through Ethiopia to the Himalayas in Nepal - the treks you cannot miss.',
    seoTitleHe: 'HighAir Expeditions | טרקים בעולם',
    seoTitleEn: 'World Treks | HighAir Expeditions',
    seoDescHe:  'כל הטרקים של HighAir בעולם - מהבלקן ואתיופיה ועד ההימלאיה בנפאל. מדריכים מקצועיים, קבוצות קטנות ותרומה למאבק במחלת הסרטן. בחרו את הטרק הבא שלכם.',
    seoDescEn:  "All of HighAir's world treks - from the Balkans and Ethiopia to the Himalayas in Nepal. Professional guides, small groups, supporting the fight against cancer. Choose your next trek.",
  },
  climbs: {
    heroImg:   '/images/cards/kilimanjaro.webp',
    heroPos:   'center',
    h1He:      'משלחות טיפוס הרים בעולם',
    h1En:      'Mountain Climbing Expeditions',
    subHe:     'מקילימנג׳רו דרך אלברוס ועד לאקונקגואה - הטיפוסים שמשנים חיים.',
    subEn:     'From Kilimanjaro through Elbrus to Aconcagua - climbs that change lives.',
    seoTitleHe: 'HighAir Expeditions | משלחות טיפוס הרים',
    seoTitleEn: 'Mountain Climbing Expeditions | HighAir Expeditions',
    seoDescHe:  'כל משלחות טיפוס ההרים של HighAir - קילימנג׳רו, אלברוס, אקונקגואה, אמה דבלאם ועוד. מדריכים מוסמכים, ליווי מלא ותרומה למאבק במחלת הסרטן. מעפילים לכל פסגה.',
    seoDescEn:  "All of HighAir's mountain climbing expeditions - Kilimanjaro, Elbrus, Aconcagua, Ama Dablam and more. Certified guides, full support, supporting the fight against cancer.",
  },
};

export default function WorldExpeditionsPage({ type = 'treks' }) {
  const { i18n } = useTranslation();
  const isRtl = i18n.language !== 'en';
  const { isMobile } = useBreakpoint();
  const cfg = CONFIG[type] || CONFIG.treks;

  /* SEO + Schema.org (canonical, OG, hreflang, JSON-LD) via the shared hook. */
  const list = (type === 'climbs' ? HOME_CLIMBS : HOME_TREKS).filter(e => e.slug && !e.teaser);
  usePageMeta({
    title:         isRtl ? cfg.seoTitleHe : cfg.seoTitleEn,
    description:   isRtl ? cfg.seoDescHe  : cfg.seoDescEn,
    canonicalPath: `/${type}`,
    image:         cfg.heroImg,
    jsonLd: [
      breadcrumbList([
        { name: isRtl ? 'בית' : 'Home', url: '/' },
        { name: isRtl ? cfg.h1He : cfg.h1En, url: `/${type}` },
      ]),
      itemList(list.map(e => ({
        name: isRtl ? (e.nameHe || e.name) : (e.nameEn || e.name || e.nameHe),
        url:  `/expedition/${e.slug}`,
      }))),
    ],
  });

  return (
    <div style={{ direction: isRtl ? 'rtl' : 'ltr', background: '#FFFFFF' }}>
      <Header />

      {/* ── Hero ── */}
      <section style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        textAlign: 'center',
        minHeight: isMobile ? '340px' : '440px',
        padding: isMobile ? '140px 6% 48px' : '184px 8% 72px',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: `url(${cfg.heroImg}) ${cfg.heroPos}/cover no-repeat` }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,8,24,0.55), rgba(10,8,24,0.78))' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px' }}>
          <h1 style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(30px,6vw,56px)', fontWeight: 800,
            color: '#FFFFFF', margin: '0 0 18px', letterSpacing: '-0.02em', lineHeight: 1.08,
            textShadow: '0 2px 24px rgba(0,0,0,0.5)',
          }}>
            {isRtl ? cfg.h1He : cfg.h1En}
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif", fontSize: 'clamp(16px,2.5vw,20px)', fontWeight: 400,
            color: 'rgba(255,255,255,0.9)', margin: 0, lineHeight: 1.6,
            textShadow: '0 1px 10px rgba(0,0,0,0.5)',
          }}>
            {isRtl ? cfg.subHe : cfg.subEn}
          </p>
        </div>
      </section>

      {/* ── The full grid (reused homepage section, fullPage mode) ── */}
      <ExpeditionExplorer type={type} fullPage />

      <SiteFooter />
    </div>
  );
}
