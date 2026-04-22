/**
 * BlogPost.jsx - /blog/:slug
 * Individual blog post page — Hebrew RTL
 */
import { useParams, useNavigate } from 'react-router-dom';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import { POSTS } from '../../data/blogData.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import FloatingWA from './FloatingWA.jsx';

export default function BlogPost() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const { isMobile } = useBreakpoint();
  const post = POSTS.find(p => p.slug === slug);

  usePageMeta(post ? {
    title:         `${post.title} | HighAir Blog`,
    description:   post.excerpt,
    canonicalPath: `/blog/${post.slug}`,
    image:         post.img ? `https://www.highair-expeditions.com${post.img}` : undefined,
  } : {
    title:         'מאמר | HighAir Blog',
    canonicalPath: `/blog/${slug}`,
  });

  if (!post) {
    return (
      <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif" }}>
        <Header />
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '24px' }}>
          <div style={{ fontSize: '64px' }}>📄</div>
          <h1 style={{ color: '#0A0818', fontWeight: 700 }}>המאמר לא נמצא</h1>
          <button onClick={() => navigate('/blog')} style={{ padding: '12px 28px', borderRadius: RADIUS.full, border: 'none', background: COLOR.primary, color: '#fff', fontFamily: "'Ploni', sans-serif", fontSize: FS.btn, fontWeight: 700, cursor: 'pointer' }}>
            לכל המאמרים ←
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <Header />
      <FloatingWA />

      {/* ── Hero ── */}
      <div style={{
        width:      '100%',
        height:     isMobile ? '300px' : '440px',
        background: post.img
          ? `url(${post.img}) center/cover no-repeat`
          : 'linear-gradient(135deg, #1e1b4b, #4338ca, #7c3aed)',
        position:   'relative',
        marginTop:  '80px',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }} />
        <div style={{
          position:       'absolute',
          inset:          0,
          display:        'flex',
          flexDirection:  'column',
          justifyContent: 'flex-end',
          padding:        isMobile ? '32px 6%' : '48px 5%',
          direction:      'rtl',
        }}>
          {/* Align with content column */}
          <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
            <h1 style={{
              fontFamily:    "'Ploni', sans-serif",
              fontSize:      isMobile ? '24px' : '40px',
              fontWeight:    800,
              color:         '#FFFFFF',
              margin:        '0 0 16px',
              letterSpacing: '-0.02em',
              lineHeight:    1.2,
              textShadow:    '0 2px 16px rgba(0,0,0,0.4)',
              textAlign:     'right',
            }}>
              {post.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{
        maxWidth: '960px',
        margin:   '0 auto',
        padding:  isMobile ? '40px 5% 80px' : '60px 5% 100px',
      }}>

        {/* Back link */}
        <button
          onClick={() => navigate('/blog')}
          style={{
            display:      'inline-flex',
            alignItems:   'center',
            gap:          '6px',
            background:   'transparent',
            border:       'none',
            color:        COLOR.primary,
            fontFamily:   "'Ploni', sans-serif",
            fontSize:     '14px',
            fontWeight:   600,
            cursor:       'pointer',
            padding:      '0 0 32px',
            transition:   `color 0.2s ${EASING.out}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#7C3AED'; }}
          onMouseLeave={e => { e.currentTarget.style.color = COLOR.primary; }}
        >
          → כל המאמרים
        </button>

        {/* Body */}
        <article>
          {post.content.map((block, i) => {
            if (block.type === 'heading') return (
              <div key={i} style={{ margin: '48px 0 18px' }}>
                {/* Gradient divider */}
                <div style={{
                  height:     '1px',
                  background: 'linear-gradient(to left, transparent, #DDD6FE, transparent)',
                  marginBottom: '20px',
                }} />
                {/* Accent bar + heading */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', direction: 'rtl' }}>
                  <div style={{
                    width:        '4px',
                    height:       '28px',
                    borderRadius: '2px',
                    background:   'linear-gradient(to bottom, #7C3AED, #6D28D9)',
                    flexShrink:   0,
                  }} />
                  <h2 style={{
                    fontFamily:    "'Ploni', sans-serif",
                    fontSize:      isMobile ? '20px' : '26px',
                    fontWeight:    700,
                    color:         '#0A0818',
                    letterSpacing: '-0.02em',
                    lineHeight:    1.3,
                    margin:        0,
                  }}>
                    {block.value}
                  </h2>
                </div>
              </div>
            );

            if (block.type === 'text') return (
              <p key={i} style={{
                fontFamily: "'Ploni', sans-serif",
                fontSize:   isMobile ? '16px' : '18px',
                fontWeight: 300,
                color:      '#3D3B5A',
                lineHeight: 1.85,
                margin:     '0 0 20px',
              }}>
                {block.value}
              </p>
            );

            if (block.type === 'list') return (
              <ul key={i} style={{ margin: '0 0 24px', paddingRight: '20px', paddingLeft: 0 }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{
                    fontFamily: "'Ploni', sans-serif",
                    fontSize:   isMobile ? '16px' : '18px',
                    fontWeight: 400,
                    color:      '#3D3B5A',
                    lineHeight: 1.85,
                    marginBottom: '6px',
                  }}>
                    {item}
                  </li>
                ))}
              </ul>
            );

            if (block.type === 'image') return (
              <figure key={i} style={{ margin: '36px 0' }}>
                <img
                  src={block.src}
                  alt={block.caption || ''}
                  loading="lazy"
                  style={{
                    width:        '100%',
                    borderRadius: RADIUS.xl,
                    display:      'block',
                    objectFit:    'cover',
                    maxHeight:    '520px',
                  }}
                />
                {block.caption && (
                  <figcaption style={{
                    fontFamily: "'Ploni', sans-serif",
                    fontSize:   '13px',
                    color:      '#9591B0',
                    textAlign:  'center',
                    marginTop:  '10px',
                  }}>
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

            return null;
          })}
        </article>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #ECEAF8', margin: '48px 0 40px' }} />

        {/* CTA */}
        <div style={{
          background:   'linear-gradient(135deg, #F5F0FF, #EDE9FE)',
          borderRadius: RADIUS.xl,
          padding:      isMobile ? '28px 24px' : '36px 40px',
          textAlign:    'center',
          border:       '1px solid #DDD6FE',
        }}>
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '22px', fontWeight: 700, color: '#0A0818', margin: '0 0 8px', letterSpacing: '-0.01em' }}>
            מוכנים לצאת למסע?
          </p>
          <p style={{ fontFamily: "'Ploni', sans-serif", fontSize: '15px', color: '#6B6B8A', margin: '0 0 24px', fontWeight: 300, lineHeight: 1.7 }}>
            HighAir Expeditions מארגנת טרקים ומשלחות טיפוס הרים ברחבי העולם, בשילוב תרומה למלחמה בסרטן.
          </p>
          <button
            onClick={() => navigate('/')}
            style={{
              padding:      '13px 32px',
              borderRadius: RADIUS.full,
              border:       'none',
              background:   COLOR.primary,
              color:        '#FFFFFF',
              fontFamily:   "'Ploni', sans-serif",
              fontSize:     FS.btn,
              fontWeight:   700,
              cursor:       'pointer',
              transition:   `background 0.2s ${EASING.out}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; }}
            onMouseLeave={e => { e.currentTarget.style.background = COLOR.primary; }}
          >
            לכל המשלחות ←
          </button>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
