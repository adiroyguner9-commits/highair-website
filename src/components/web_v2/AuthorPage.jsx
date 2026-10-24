/**
 * AuthorPage.jsx - an author's page: who they are and the guides they wrote
 * Route: /author/:id   (authors in src/data/authors.js)
 *
 * Built from the blog's own pieces (the page header band, PostCard grid) and
 * the About page's team card look, so it reads as part of the same site. The
 * static shell (scripts/generate-html-shells.mjs) carries the same text and a
 * schema.org Person for search and AI engines.
 */
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RADIUS, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import { POSTS } from '../../data/blogData.js';
import { AUTHORS } from '../../data/authors.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import MountainBackdrop from './MountainBackdrop.jsx';
import NotFound404 from './NotFound404.jsx';
import { PostCard } from './Blog.jsx';

export default function AuthorPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { isMobile, isTablet } = useBreakpoint();
  const isEn = i18n.language === 'en';
  const dir  = isEn ? 'ltr' : 'rtl';
  const author = AUTHORS[id];
  const posts  = author ? POSTS.filter(p => p.authorId === author.id) : [];

  usePageMeta(author ? {
    title:         isEn ? `${author.nameEn} | HighAir Expeditions` : `HighAir Expeditions | ${author.nameHe}`,
    description:   isEn ? author.bioEn : author.bioHe,
    canonicalPath: `/author/${author.id}`,
    image:         `https://www.highair-expeditions.com${author.photo}`,
    ogType:        'profile',
  } : {
    title: 'HighAir Expeditions', description: '', canonicalPath: '/', noIndex: true,
  });

  if (!author) return <NotFound404 />;

  const name    = isEn ? author.nameEn  : author.nameHe;
  const role    = isEn ? author.roleEn  : author.roleHe;
  const bio     = isEn ? author.bioEn   : author.bioHe;
  const summits = isEn ? author.summitsEn : author.summitsHe;
  const cols    = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <>
      <MountainBackdrop />
      <Header />
      <main id="main-content" style={{ background: 'transparent', minHeight: '100vh', paddingTop: isMobile ? '80px' : '124px', direction: dir }}>

        {/* ── Page header: photo, name, role (the blog's header band) ── */}
        <div style={{
          background:   '#FFFFFF',
          borderBottom: '1px solid #ECEAF8',
          padding:      isMobile ? '36px 5% 28px' : '52px 5% 36px',
          textAlign:    'center',
        }}>
          <img
            src={author.photo}
            alt={name}
            width={112}
            height={112}
            style={{
              width:        '112px',
              height:       '112px',
              borderRadius: '50%',
              objectFit:    'cover',
              display:      'block',
              margin:       '0 auto 18px',
              boxShadow:    '0 4px 16px rgba(109,40,217,0.20)',
            }}
          />
          <h1 style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      isMobile ? '28px' : '42px',
            fontWeight:    700,
            color:         '#0A0818',
            margin:        '0 0 10px',
            letterSpacing: '-0.03em',
            lineHeight:    1.1,
          }}>
            {name}
          </h1>
          <p style={{
            fontFamily:    "'Ploni', sans-serif",
            fontSize:      '13px',
            fontWeight:    600,
            color:         '#7C3AED',
            margin:        0,
            letterSpacing: '0.02em',
          }}>
            {role}
          </p>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '32px 5%' : '48px 5%' }}>

          {/* ── Bio + summits (the team card's look) ── */}
          <div style={{
            maxWidth:     '820px',
            margin:       '0 auto 48px',
            background:   '#FFFFFF',
            borderRadius: RADIUS.xl,
            border:       '1px solid #ECEAF8',
            boxShadow:    '0 2px 12px rgba(0,0,0,0.06)',
            padding:      isMobile ? '24px 20px' : '32px 36px',
          }}>
            <p style={{
              fontFamily: "'Ploni', sans-serif",
              fontSize:   FS.body,
              fontWeight: 300,
              color:      '#4B4869',
              margin:     '0 0 20px',
              lineHeight: 1.8,
            }}>
              {bio}
            </p>
            <h2 style={{
              fontFamily: "'Ploni', sans-serif",
              fontSize:   '16px',
              fontWeight: 700,
              color:      '#0A0818',
              margin:     '0 0 10px',
            }}>
              {isEn ? 'Summits' : 'פסגות שטיפס עליהן'}
            </h2>
            <ul style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', listStyle: 'none', margin: 0, padding: 0 }}>
              {summits.map(s => (
                <li key={s} style={{
                  fontFamily:   "'Ploni', sans-serif",
                  fontSize:     '13px',
                  fontWeight:   600,
                  color:        '#6D28D9',
                  background:   '#F5F3FF',
                  borderRadius: RADIUS.full,
                  padding:      '6px 14px',
                }}>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* ── The author's guides ── */}
          {posts.length > 0 && (
            <>
              <h2 style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      isMobile ? '22px' : '28px',
                fontWeight:    700,
                color:         '#0A0818',
                margin:        '0 0 24px',
                letterSpacing: '-0.02em',
                textAlign:     'center',
              }}>
                {isEn ? `Guides by ${author.nameEn}` : `המדריכים של ${author.nameHe}`}
              </h2>
              <div style={{
                display:             'grid',
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap:                 '24px',
                alignContent:        'start',
              }}>
                {posts.map(post => <PostCard key={post.id} post={post} />)}
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
