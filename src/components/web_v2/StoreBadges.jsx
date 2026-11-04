/**
 * StoreBadges.jsx - the official App Store and Google Play badges, and the
 * QR code that opens the right store. Used by the /app page and the footer.
 *
 * Store rules: official artwork only (public/images/badges/, never edited or
 * recoloured), one badge per store, Hebrew badges on the Hebrew site, equal
 * visible height, clear space around each. The files carry different built-in
 * margins (Google's PNG has wide padding), so each image is sized from its
 * artwork height and the margin is pulled back with a negative margin. The
 * gap between badges is the clear space (at least a quarter of the height).
 */
import { useTranslation } from 'react-i18next';
import { Analytics } from '../../utils/analytics.js';
import { BADGES, APP_STORE_URL, PLAY_STORE_URL, APP_QR_SRC } from '../../data/appData.js';

const HREF = { apple: APP_STORE_URL, google: PLAY_STORE_URL };
const CTA_LABEL = { apple: 'app_store', google: 'google_play' };

function Badge({ store, lang, height, location }) {
  const b = BADGES[store][lang];
  const scale = height / b.art[1];
  const w = b.box[0] * scale;
  const h = b.box[1] * scale;
  const padX = ((b.box[0] - b.art[0]) / 2) * scale;
  const padY = ((b.box[1] - b.art[1]) / 2) * scale;
  return (
    <a
      href={HREF[store]}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => Analytics.clickCTA(CTA_LABEL[store], location)}
      style={{ display: 'inline-flex', lineHeight: 0, flexShrink: 0, borderRadius: `${height * 0.2}px` }}
    >
      <img
        src={b.src}
        alt={b.alt}
        width={Math.round(w)}
        height={Math.round(h)}
        decoding="async"
        style={{ display: 'block', width: `${w}px`, height: `${h}px`, maxWidth: 'none', margin: `${-padY}px ${-padX}px` }}
      />
    </a>
  );
}

export function StoreBadges({ height = 40, stacked = false, justify = 'flex-start', location = 'app_page' }) {
  const { i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'he';
  return (
    <div style={{
      display:        'flex',
      flexDirection:  stacked ? 'column' : 'row',
      flexWrap:       stacked ? 'nowrap' : 'wrap',
      alignItems:     stacked ? 'flex-start' : 'center',
      justifyContent: justify,
      gap:            `${Math.max(12, Math.round(height * 0.3))}px`,
    }}>
      <Badge store="apple"  lang={lang} height={height} location={location} />
      <Badge store="google" lang={lang} height={height} location={location} />
    </div>
  );
}

/* The QR code for desktops (a phone camera opens app.highair-expeditions.com/download,
   which sends iPhone to the App Store and Android to Google Play). The SVG carries
   its own white quiet zone, so it reads on any background. */
export function AppQr({ size = 96, title, sub, alt, dark = false }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      <img
        src={APP_QR_SRC}
        alt={alt || title}
        width={size}
        height={size}
        decoding="async"
        style={{ display: 'block', width: `${size}px`, height: `${size}px`, borderRadius: '10px', flexShrink: 0, boxShadow: dark ? 'none' : '0 0 0 1px #ECEAF8' }}
      />
      {(title || sub) && (
        <div style={{ minWidth: 0 }}>
          {title && (
            <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', fontWeight: 700, color: dark ? '#FFFFFF' : '#0A0818', margin: '0 0 4px', lineHeight: 1.3 }}>
              {title}
            </p>
          )}
          {sub && (
            <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 300, color: dark ? 'rgba(255,255,255,0.6)' : '#6B6B8A', margin: 0, lineHeight: 1.5 }}>
              {sub}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
