/**
 * AppPage.jsx - האפליקציה של HighAir / The HighAir App
 * Route: /app
 *
 * The store app is for travelers who have booked (they log in with their
 * booking's details), so the page speaks to them: what the app does, how to
 * start, a short FAQ. Copy, store links and screens live in src/data/appData.js,
 * which the page's static shell reads too. Badges and QR: StoreBadges.jsx.
 */
import { tx, currentLang } from '../../website/lang.js';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COLOR, RADIUS, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta, breadcrumbList, faqPage } from '../../website/usePageMeta.js';
import { MountainIcon, CreditCardIcon, UsersIcon, BackpackIcon, BellIcon, DocumentIcon } from '../Icons.jsx';
import { APP_PAGE, APP_HERO_SCREEN, APP_SCREENS } from '../../data/appData.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import FaqAccordion from './FaqAccordion.jsx';
import { StoreBadges, AppQr } from './StoreBadges.jsx';

const ICONS = { mountain: MountainIcon, document: DocumentIcon, card: CreditCardIcon, users: UsersIcon, backpack: BackpackIcon, bell: BellIcon };
const SCREEN_RATIO = '600 / 1304';   // the store screenshots (public/images/app/)

/* An iPhone-style frame around a store screenshot. The screenshots carry
   their own status bar, laid out around the Dynamic Island drawn here. */
function PhoneFrame({ src, alt, width, eager = false, shadow = '0 24px 60px rgba(10,8,24,0.35)' }) {
  const bezel = Math.round(width * 0.035);
  const radius = Math.round(width * 0.155);
  const inner = width - bezel * 2;
  return (
    <div style={{
      width:        `${width}px`,
      flexShrink:   0,
      boxSizing:    'border-box',
      padding:      `${bezel}px`,
      borderRadius: `${radius}px`,
      background:   '#0A0818',
      boxShadow:    `${shadow}, inset 0 0 0 1.5px rgba(255,255,255,0.14)`,
    }}>
      <div style={{ position: 'relative', borderRadius: `${radius - bezel}px`, overflow: 'hidden', aspectRatio: SCREEN_RATIO, background: '#F8F7FF' }}>
        <img
          src={src}
          alt={alt}
          width={600}
          height={1304}
          loading={eager ? 'eager' : 'lazy'}
          fetchpriority={eager ? 'high' : undefined}
          decoding="async"
          style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div aria-hidden="true" style={{
          position: 'absolute', top: `${Math.round(inner * 0.028)}px`, left: '50%', transform: 'translateX(-50%)',
          width: `${Math.round(inner * 0.31)}px`, height: `${Math.round(inner * 0.09)}px`, borderRadius: '999px', background: '#0A0818',
        }} />
      </div>
    </div>
  );
}

/* Section overline + heading, as on the About page. */
function SectionHead({ label, title, isMobile }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
      <p style={{
        fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 600, color: '#7C3AED',
        margin: '0 0 10px', letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {label}
      </p>
      <h2 style={{
        fontFamily: "'Ploni', sans-serif", fontSize: isMobile ? '26px' : '36px', fontWeight: 700, color: '#0A0818',
        margin: 0, letterSpacing: '-0.03em', lineHeight: 1.15,
      }}>
        {title}
      </h2>
    </div>
  );
}

function FeatureCard({ icon, title, text, isMobile }) {
  const Icon = ICONS[icon] || MountainIcon;
  return (
    <div style={{
      background:    '#FFFFFF',
      border:        '1px solid #ECEAF8',
      borderRadius:  RADIUS.xl,
      boxShadow:     '0 2px 12px rgba(0,0,0,0.06)',
      padding:       isMobile ? '20px' : '28px 26px',
      display:       'flex',
      flexDirection: isMobile ? 'row' : 'column',
      alignItems:    'flex-start',
      gap:           isMobile ? '14px' : '16px',
    }}>
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
        background: '#EDE9FF', color: COLOR.primary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={22} />
      </div>
      <div style={{ minWidth: 0 }}>
        <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '17px', fontWeight: 700, color: '#0A0818', margin: '0 0 6px', lineHeight: 1.3 }}>
          {title}
        </h3>
        <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 300, color: '#6B6B8A', margin: 0, lineHeight: 1.75 }}>
          {text}
        </p>
      </div>
    </div>
  );
}

/* A FAQ answer with its link (the data keeps the plain text for the schema). */
function answerWithLink({ a, link }) {
  if (!link || !a.includes(link.text)) return a;
  const [before, after] = a.split(link.text);
  const style = { color: COLOR.primary, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' };
  const anchor = link.href.startsWith('/')
    ? <Link to={link.href} style={style}>{link.text}</Link>
    : <a href={link.href} target="_blank" rel="noopener noreferrer" style={style}>{link.text}</a>;
  return <>{before}{anchor}{after}</>;
}

export default function AppPage() {
  const { i18n } = useTranslation();
  const isEn = i18n.language !== 'he';
  const T = APP_PAGE[currentLang()] || APP_PAGE[isEn ? 'en' : 'he'];
  const dir = isEn ? 'ltr' : 'rtl';
  const { isMobile, isTablet, isDesktop } = useBreakpoint();

  usePageMeta({
    title:         T.metaTitle,
    description:   T.metaDesc,
    canonicalPath: '/app',
    jsonLd: [
      breadcrumbList([
        { name: isEn ? tx("Home") : 'בית', url: '/' },
        { name: T.h1, url: '/app' },
      ]),
      faqPage(T.faq.map(({ q, a }) => ({ q, a }))),
    ],
  });

  const heroPhone = isMobile ? 236 : isTablet ? 260 : 290;
  const shotPhone = isMobile ? 210 : isTablet ? 200 : 240;

  return (
    <>
      <Header />
      <main id="main-content" style={{ background: '#FAFAF8', minHeight: '100vh', paddingTop: isMobile ? '80px' : '124px', direction: dir }}>

        {/* ── Hero ── */}
        <section style={{
          background: 'linear-gradient(135deg, #0f0c29 0%, #1e1b4b 50%, #2d1b69 100%)',
          position:   'relative',
          overflow:   'hidden',
          padding:    isMobile ? '44px 6% 0' : '64px 6% 0',
        }}>
          {/* decorative blobs (as on the contact page) */}
          <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '280px', height: '280px',
            borderRadius: '50%', background: 'rgba(109,40,217,0.18)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '-40px', right: '-40px', width: '220px', height: '220px',
            borderRadius: '50%', background: 'rgba(139,92,246,0.14)', filter: 'blur(50px)', pointerEvents: 'none' }} />

          <div style={{
            position:       'relative',
            maxWidth:       '1160px',
            margin:         '0 auto',
            display:        'flex',
            flexDirection:  isMobile ? 'column' : 'row',
            alignItems:     isMobile ? 'center' : 'flex-end',
            justifyContent: 'space-between',
            gap:            isMobile ? '36px' : '48px',
          }}>
            {/* Text, badges, QR */}
            <div style={{
              flex:          '1 1 0',
              minWidth:      0,
              maxWidth:      '600px',
              alignSelf:     'center',
              textAlign:     isMobile ? 'center' : 'start',
              paddingBottom: isMobile ? 0 : '64px',
            }}>
              <h1 style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      isMobile ? '36px' : '56px',
                fontWeight:    700,
                color:         '#FFFFFF',
                margin:        '0 0 16px',
                letterSpacing: '-0.03em',
                lineHeight:    1.1,
              }}>
                {T.h1}
              </h1>
              <p style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize:   isMobile ? '16px' : '18px',
                fontWeight: 300,
                color:      'rgba(255,255,255,0.72)',
                margin:     isMobile ? '0 auto 28px' : '0 0 32px',
                lineHeight: 1.75,
                maxWidth:   '520px',
              }}>
                {T.sub}
              </p>

              <StoreBadges height={isMobile ? 40 : 44} justify={isMobile ? 'center' : 'flex-start'} location="app_page_hero" />

              <p style={{
                fontFamily: "'Ploni', sans-serif", fontSize: FS.sm, fontWeight: 400,
                color: 'rgba(255,255,255,0.55)', margin: '16px 0 0', lineHeight: 1.5,
              }}>
                {T.note}
              </p>

              {/* A computer cannot install the app: the QR hands it to the phone. */}
              {isDesktop && (
                <div style={{
                  display:      'inline-flex',
                  marginTop:    '28px',
                  padding:      '12px',
                  paddingInlineEnd: '20px',
                  borderRadius: RADIUS.lg,
                  background:   'rgba(255,255,255,0.06)',
                  border:       '1px solid rgba(255,255,255,0.12)',
                }}>
                  <AppQr size={148} title={T.qrTitle} sub={T.qrSub} alt={T.qrAlt} dark />
                </div>
              )}
            </div>

            {/* Phone: rises from the bottom edge of the hero. clip-path cuts only
                the bottom, so the phone's shadow is not boxed in at the sides. */}
            <div style={{
              flexShrink: 0,
              height:     isMobile ? '330px' : isTablet ? '430px' : '520px',
              clipPath:   'inset(-120px -120px 0 -120px)',
              display:    'flex',
              alignItems: 'flex-start',
            }}>
              <PhoneFrame src={APP_HERO_SCREEN} alt={T.screenAlt} width={heroPhone} eager />
            </div>
          </div>
        </section>

        {/* ── What the app does ── */}
        <section style={{ background: '#FFFFFF', borderBottom: '1px solid #ECEAF8', padding: isMobile ? '48px 5%' : '72px 5%' }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <SectionHead label={T.featuresLabel} title={T.featuresTitle} isMobile={isMobile} />
            <div style={{
              display:             'grid',
              gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap:                 isMobile ? '14px' : '24px',
            }}>
              {T.features.map(f => <FeatureCard key={f.icon} {...f} isMobile={isMobile} />)}
            </div>
          </div>
        </section>

        {/* ── Screens ── */}
        <section style={{ background: '#FAF5FF', borderBottom: '1px solid #ECEAF8', padding: isMobile ? '48px 0' : '72px 5%' }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <div style={{ padding: isMobile ? '0 5%' : 0 }}>
              <SectionHead label={T.screensLabel} title={T.screensTitle} isMobile={isMobile} />
            </div>
            <div style={{
              display:         'flex',
              justifyContent:  isMobile ? 'flex-start' : 'center',
              gap:             isMobile ? '20px' : '40px',
              overflowX:       isMobile ? 'auto' : 'visible',
              scrollSnapType:  isMobile ? 'x mandatory' : undefined,
              scrollbarWidth:  'none',
              /* room for the phones' shadows inside the phone's scroll strip */
              padding:         isMobile ? '24px 5% 40px' : 0,
              margin:          isMobile ? '-24px 0 -32px' : 0,
              scrollPaddingInline: isMobile ? '5%' : undefined,
            }}>
              {APP_SCREENS.map(s => (
                <figure key={s.src} style={{ margin: 0, flexShrink: 0, scrollSnapAlign: 'start', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                  <PhoneFrame src={s.src} alt={isEn ? (s[currentLang()] || s.en) : s.he} width={shotPhone} shadow="0 14px 36px rgba(10,8,24,0.16)" />
                  <figcaption style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 600, color: '#3D3B52' }}>
                    {isEn ? (s[currentLang()] || s.en) : s.he}
                  </figcaption>
                </figure>
              ))}
            </div>
            <p style={{
              fontFamily: "'Ploni', sans-serif", fontSize: FS.sm, fontWeight: 300, color: '#6B6B8A',
              textAlign: 'center', margin: isMobile ? '20px 5% 0' : '28px 0 0',
            }}>
              {T.screensNote}
            </p>
          </div>
        </section>

        {/* ── Three steps ── */}
        <section style={{ background: '#FFFFFF', borderBottom: '1px solid #ECEAF8', padding: isMobile ? '48px 5%' : '72px 5%' }}>
          <div style={{ maxWidth: '1160px', margin: '0 auto' }}>
            <SectionHead label={T.stepsLabel} title={T.stepsTitle} isMobile={isMobile} />
            <ol style={{
              listStyle:           'none',
              margin:              0,
              padding:             0,
              display:             'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
              gap:                 isMobile ? '28px' : '32px',
            }}>
              {T.steps.map((s, i) => (
                <li key={s.title} style={{
                  display:       'flex',
                  flexDirection: isMobile ? 'row' : 'column',
                  alignItems:    isMobile ? 'flex-start' : 'center',
                  textAlign:     isMobile ? 'start' : 'center',
                  gap:           isMobile ? '16px' : '18px',
                }}>
                  <span aria-hidden="true" style={{
                    width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                    background: COLOR.grad.brand, color: '#FFFFFF', boxShadow: '0 6px 18px rgba(109,40,217,0.25)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Mazzard', sans-serif", fontSize: '18px', fontWeight: 700,
                  }}>
                    {i + 1}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontFamily: "'Ploni', sans-serif", fontSize: '18px', fontWeight: 700, color: '#0A0818', margin: '0 0 6px', lineHeight: 1.3 }}>
                      {s.title}
                    </h3>
                    <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 300, color: '#6B6B8A', margin: 0, lineHeight: 1.75, maxWidth: '320px', marginInline: isMobile ? 0 : 'auto' }}>
                      {s.text}
                    </p>
                    {/* The download step carries the badges, for whoever scrolled this far on a phone. */}
                    {i === 1 && (
                      <div style={{ marginTop: '16px' }}>
                        <StoreBadges height={40} justify={isMobile ? 'flex-start' : 'center'} location="app_page_steps" />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ── */}
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '0 5%' }}>
          <FaqAccordion
            items={T.faq.map(f => ({ q: f.q, a: answerWithLink(f) }))}
            isRtl={!isEn}
            isMobile={isMobile}
          />
        </div>

      </main>
      <SiteFooter />
    </>
  );
}
