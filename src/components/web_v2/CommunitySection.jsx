/**
 * CommunitySection.jsx — WhatsApp + YouTube horizontal banner cards
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RADIUS, EASING } from '../../website/theme.js';
import { Analytics } from '../../utils/analytics.js';

const WA_HREF  = 'https://chat.whatsapp.com/Lg6zPiIFp5RGSkOARrBmuX';
const YT_HREF  = 'https://www.youtube.com/@HighAirExpeditions';

function WhatsAppSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fill="rgba(255,255,255,0.9)" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function YouTubeSVG({ size }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path fill="rgba(255,255,255,0.9)" d="M23.495 6.205a3.007 3.007 0 00-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 00.527 6.205a31.247 31.247 0 00-.522 5.805 31.247 31.247 0 00.522 5.783 3.007 3.007 0 002.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 002.088-2.088 31.247 31.247 0 00.5-5.783 31.247 31.247 0 00-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/>
    </svg>
  );
}

function BannerCard({ platform, Icon, bg, fadeColor, ctaColor, headline, cta, href, isEn }) {
  const [hov, setHov] = useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => Analytics.clickCTA(`community_${platform}`, 'community_section')}
      style={{
        flex: '1 1 300px',
        display: 'flex',
        alignItems: 'stretch',
        borderRadius: RADIUS.xl,
        overflow: 'hidden',
        minHeight: '155px',
        direction: isEn ? 'ltr' : 'rtl',
        textDecoration: 'none',
        background: bg,
        transform: hov ? 'translateY(-3px)' : 'none',
        boxShadow: hov
          ? '0 18px 44px rgba(0,0,0,0.32)'
          : '0 6px 24px rgba(0,0,0,0.18)',
        transition: `all 0.25s ${EASING.out}`,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* Text area */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '28px 32px',
        gap: '16px',
        position: 'relative',
        zIndex: 2,
      }}>
        <h3 style={{
          fontSize: 'clamp(16px, 2vw, 21px)',
          fontWeight: 900,
          color: '#FFFFFF',
          margin: 0,
          lineHeight: 1.4,
          letterSpacing: '-0.3px',
        }}>
          {headline.split('\n').map((line, i) => (
            <span key={i}>{i > 0 && <br />}{line}</span>
          ))}
        </h3>
        <span style={{
          display: 'inline-block',
          padding: '9px 22px',
          borderRadius: RADIUS.pill,
          background: '#FFFFFF',
          color: ctaColor,
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '0.01em',
          whiteSpace: 'nowrap',
          alignSelf: 'flex-start',
          transition: `transform 0.2s ${EASING.out}`,
          transform: hov ? 'scale(1.03)' : 'none',
        }}>
          {cta}
        </span>
      </div>

      {/* Icon visual panel */}
      <div style={{
        width: '140px',
        flexShrink: 0,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Large icon */}
        <div style={{ opacity: 0.22, position: 'relative', zIndex: 0 }}>
          <Icon size={110} />
        </div>
        {/* Gradient fade toward text area */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: isEn
            ? `linear-gradient(to right, ${fadeColor} 0%, transparent 70%)`
            : `linear-gradient(to left,  ${fadeColor} 0%, transparent 70%)`,
          zIndex: 1,
        }} />
      </div>
    </a>
  );
}

export default function CommunitySection() {
  const { i18n } = useTranslation();
  const isEn = i18n.language === 'en';

  return (
    <section
      id="community"
      style={{
        padding: '48px 5vw',
        background: '#F8F7FF',
        direction: isEn ? 'ltr' : 'rtl',
      }}
    >
      <div style={{
        display: 'flex',
        gap: '16px',
        maxWidth: '1100px',
        margin: '0 auto',
        flexWrap: 'wrap',
      }}>
        <BannerCard
          platform="whatsapp"
          Icon={WhatsAppSVG}
          bg="linear-gradient(135deg, #075E40 0%, #128C7E 50%, #25D366 100%)"
          fadeColor="#075E40"
          ctaColor="#075E40"
          isEn={isEn}
          headline={isEn
            ? 'Trek updates, articles & news from the world of hiking — on WhatsApp'
            : 'עדכונים על טרקים בארץ ובעולם, מאמרים וחדשות - ישר לווצאפ שלך'}
          cta={isEn ? 'Join the WhatsApp community' : 'הצטרפו לקהילת הווצאפ'}
          href={WA_HREF}
        />
        <BannerCard
          platform="youtube"
          Icon={YouTubeSVG}
          bg="linear-gradient(135deg, #0A0505 0%, #1E0808 40%, #6B1010 75%, #CC1010 100%)"
          fadeColor="#0A0505"
          ctaColor="#8B0000"
          isEn={isEn}
          headline={isEn
            ? 'Want to see what awaits you? Everything is on our channel'
            : 'רוצים לדעת מה מחכה לכם בשטח?\nהכל בערוץ שלנו'}
          cta={isEn ? 'Watch on YouTube' : 'לצפייה בערוץ היוטיוב'}
          href={YT_HREF}
        />
      </div>
    </section>
  );
}
