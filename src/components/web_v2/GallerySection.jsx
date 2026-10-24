/**
 * GallerySection.jsx - homepage "הצטרפו לחוויה של פעם בחיים"
 *
 * The same 11 photos as before, shown with the trip pages' gallery
 * (PhotoGallery: masonry on desktop, the snap carousel on phones, the same
 * lightbox), so the homepage and the trip pages look alike (owner, 24 Oct 2026).
 * Photos and sizes come from galleryManifest.json ('home'); the grid shows the
 * 800px copies (imageVariants), the lightbox the originals.
 */
import { useTranslation } from 'react-i18next';
import { FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { smallOf } from '../../website/imageVariants.js';
import GALLERY from '../../website/galleryManifest.json';
import PhotoGallery from './PhotoGallery.jsx';

const HOME = GALLERY.home || [];
const IMAGES = HOME.map(x => x.src);
const ORIENTATIONS = Object.fromEntries(HOME.map((x, i) => [i, x.w >= x.h ? 'landscape' : 'portrait']));

export default function GallerySection() {
  const { isMobile } = useBreakpoint();
  const { t, i18n } = useTranslation();
  const dir = i18n.language === 'en' ? 'ltr' : 'rtl';
  const isRtl = dir === 'rtl';
  const captions = t('gallery.captions', { returnObjects: true });
  const altOf = i => (Array.isArray(captions) && captions[i]) || t('gallery.sectionTitle');

  return (
    <section style={{
      background: 'transparent',
      padding: isMobile ? '36px 5% 36px' : '60px 5%',
      boxSizing: 'border-box',
      direction: dir,
      overflow: 'hidden',
    }}>

      <div style={{ padding: isMobile ? '0 0 24px' : '0 0 40px' }}>
        <h2 style={{
          fontFamily: 'Ploni, sans-serif',
          fontSize: FS.h2,
          fontWeight: 700,
          color: '#0A0818',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          textAlign: 'start',
        }}>
          {t('gallery.sectionTitle')}
        </h2>
        <p style={{
          fontFamily: 'Ploni, sans-serif',
          fontSize: FS.body,
          fontWeight: 300,
          color: '#6B6B8A',
          margin: 0,
          lineHeight: 1.7,
          textAlign: 'start',
        }}>
          {t('gallery.sectionSubtitle')}
        </p>
      </div>

      <PhotoGallery
        images={IMAGES}
        orientations={ORIENTATIONS}
        thumbOf={smallOf}
        altPrefix={t('gallery.sectionTitle')}
        altOf={altOf}
        hint={isRtl ? 'לחץ להגדלה' : 'Tap to zoom'}
        isRtl={isRtl}
        isMobile={isMobile}
      />
    </section>
  );
}
