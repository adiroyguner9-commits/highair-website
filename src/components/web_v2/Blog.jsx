/**
 * Blog.jsx - /blog
 * Article listing page — Hebrew RTL
 */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import { POSTS, CATEGORIES } from '../../data/blogData.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';

function PostCard({ post }) {
  const navigate = useNavigate();
  const { isMobile } = useBreakpoint();

  return (
    <div
      onClick={() => navigate(`/blog/${post.slug}`)}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 12px 40px rgba(109,40,217,0.14)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
      style={{
        background:   '#FFFFFF',
        borderRadius: RADIUS.xl,
        border:       '1px solid #ECEAF8',
        overflow:     'hidden',
        cursor:       'pointer',
        boxShadow:    '0 2px 12px rgba(0,0,0,0.05)',
        transition:   `box-shadow 0.25s ${EASING.out}`,
        display:      'flex',
        flexDirection:'column',
      }}
    >
      {/* Image or gradient placeholder */}
      <div style={{
        height:     '200px',
        background: post.img
          ? `url(${post.img}) center/cover no-repeat`
          : 'linear-gradient(135deg, #1e1b4b, #4338ca, #7c3aed)',
        flexShrink: 0,
        position:   'relative',
      }}>
        {/* Category badge */}
        <div style={{
          position:   'absolute',
          top:        '14px',
          right:      '14px',
          background: 'rgba(109,40,217,0.85)',
          backdropFilter: 'blur(6px)',
          color:      '#fff',
          fontFamily: "'Ploni', sans-serif",
          fontSize:   '12px',
          fontWeight: 700,
          padding:    '4px 12px',
          borderRadius: RADIUS.full,
        }}>
          {post.category}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '22px 24px 28px', direction: 'rtl', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <h2 style={{
          fontFamily:    "'Ploni', sans-serif",
          fontSize:      isMobile ? '18px' : '20px',
          fontWeight:    700,
          color:         '#0A0818',
          margin:        0,
          lineHeight:    1.35,
          letterSpacing: '-0.01em',
        }}>
          {post.title}
        </h2>

        <p style={{
          fontFamily: "'Ploni', sans-serif",
          fontSize:   '15px',
          fontWeight: 300,
          color:      '#6B6B8A',
          margin:     0,
          lineHeight: 1.7,
          flex:       1,
        }}>
          {post.excerpt}
        </p>

        <div style={{
          display:    'flex',
          alignItems: 'center',
          gap:        '6px',
          color:      COLOR.primary,
          fontFamily: "'Ploni', sans-serif",
          fontSize:   '14px',
          fontWeight: 700,
          marginTop:  '4px',
        }}>
          קרא עוד ←
        </div>
      </div>
    </div>
  );
}

export default function Blog() {
  const { isMobile, isTablet } = useBreakpoint();
  const [activeCategory, setActiveCategory] = useState('הכל');

  usePageMeta({
    title:         'בלוג | HighAir Expeditions',
    description:   'מאמרים, טיפים וסיפורים מעולם הטרקים וטיפוס ההרים — מבית HighAir Expeditions.',
    canonicalPath: '/blog',
  });

  const categories = ['הכל', ...CATEGORIES];
  const filtered   = activeCategory === 'הכל'
    ? POSTS
    : POSTS.filter(p => p.category === activeCategory);

  const cols = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <>
      <Header />
      <main id="main-content" style={{ background: '#FAFAF8', minHeight: '100vh', paddingTop: '80px', direction: 'rtl' }}>

        {/* ── Page header ── */}
        <div style={{
          background:   '#FFFFFF',
          borderBottom: '1px solid #ECEAF8',
          padding:      isMobile ? '36px 5% 28px' : '52px 5% 36px',
          textAlign:    'center',
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
            הבלוג של HighAir
          </h1>
          <p style={{
            fontFamily: "'Ploni', sans-serif",
            fontSize:   FS.body,
            fontWeight: 300,
            color:      '#6B6B8A',
            margin:     0,
            lineHeight: 1.7,
          }}>
            מאמרים, טיפים וסיפורים מעולם הטרקים וטיפוס ההרים
          </p>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: isMobile ? '32px 5%' : '48px 5%' }}>

          {/* Category filter */}
          {categories.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '36px' }}>
              {categories.map(cat => {
                const active = cat === activeCategory;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    style={{
                      padding:      '8px 20px',
                      borderRadius: RADIUS.full,
                      border:       `2px solid ${active ? COLOR.primary : '#E5E3F0'}`,
                      background:   active ? COLOR.primary : '#FFFFFF',
                      color:        active ? '#FFFFFF' : '#4B4869',
                      fontFamily:   "'Ploni', sans-serif",
                      fontSize:     FS.btn,
                      fontWeight:   700,
                      cursor:       'pointer',
                      whiteSpace:   'nowrap',
                      transition:   `all 0.2s ${EASING.out}`,
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}

          {/* Grid */}
          <div style={{
            display:             'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap:                 '24px',
            minHeight:           '400px',
            alignContent:        'start',
          }}>
            {filtered.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#9591B0', fontFamily: "'Ploni', sans-serif" }}>
              אין מאמרים בקטגוריה זו עדיין.
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
