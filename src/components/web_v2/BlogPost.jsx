/**
 * BlogPost.jsx - /blog/:slug
 * Individual blog post page — Hebrew RTL
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { COLOR, RADIUS, EASING, FS } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { usePageMeta } from '../../website/usePageMeta.js';
import { POSTS } from '../../data/blogData.js';
import Header from './Header.jsx';
import SiteFooter from './SiteFooter.jsx';
import FloatingWA from './FloatingWA.jsx';

// ── Helpers ──────────────────────────────────────────────

function calcReadingTime(content) {
  const textWords = content
    .filter(b => ['text', 'heading', 'section'].includes(b.type))
    .map(b => b.value || '')
    .join(' ')
    .split(/\s+/).length;
  const listWords = content
    .filter(b => b.type === 'list')
    .flatMap(b => b.items)
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round((textWords + listWords) / 200));
}

function extractTOC(content) {
  return content
    .map((block, i) => {
      if (block.type === 'section') return { id: `toc-${i}`, label: block.value, level: 'section' };
      if (block.type === 'heading') return { id: `toc-${i}`, label: block.value, level: 'heading' };
      return null;
    })
    .filter(Boolean);
}

function ShareBtn({ color, onClick, children }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:      'inline-flex',
        alignItems:   'center',
        gap:          '6px',
        padding:      '8px 16px',
        borderRadius: '999px',
        border:       `1.5px solid ${color}`,
        background:   hovered ? color : 'transparent',
        color:        hovered ? '#fff' : color,
        fontFamily:   "'Ploni', sans-serif",
        fontSize:     '13px',
        fontWeight:   600,
        cursor:       'pointer',
        transition:   'all 0.2s',
        whiteSpace:   'nowrap',
      }}
    >
      {children}
    </button>
  );
}

// ── Main component ────────────────────────────────────────

export default function BlogPost() {
  const { slug }   = useParams();
  const navigate   = useNavigate();
  const { isMobile } = useBreakpoint();
  const post = POSTS.find(p => p.slug === slug);

  const [scrollPct, setScrollPct] = useState(0);
  const [copied,    setCopied]    = useState(false);

  // Scroll tracking — progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // JSON-LD Article schema
  useEffect(() => {
    if (!post) return;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context':       'https://schema.org',
      '@type':          'Article',
      headline:         post.title,
      description:      post.excerpt,
      image:            post.img ? `https://www.highair-expeditions.com${post.img}` : undefined,
      author:           { '@type': 'Organization', name: 'HighAir Expeditions' },
      publisher: {
        '@type': 'Organization',
        name:    'HighAir Expeditions',
        logo:    { '@type': 'ImageObject', url: 'https://www.highair-expeditions.com/logo.png' },
      },
      datePublished:    post.dateIso,
      dateModified:     post.dateIso,
      mainEntityOfPage: { '@type': 'WebPage', '@id': `https://www.highair-expeditions.com/blog/${post.slug}` },
    });
    document.head.appendChild(script);
    return () => document.head.removeChild(script);
  }, [post]);

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

  const pageUrl     = `https://www.highair-expeditions.com/blog/${post.slug}`;
  const readingTime = calcReadingTime(post.content);

  const shareWA = () => {
    const text = encodeURIComponent(`${post.title}\n${pageUrl}?utm_source=whatsapp&utm_medium=social&utm_campaign=blog`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareFB = () => {
    const url = encodeURIComponent(`${pageUrl}?utm_source=facebook&utm_medium=social&utm_campaign=blog`);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${pageUrl}?utm_source=copy&utm_medium=social&utm_campaign=blog`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ direction: 'rtl', fontFamily: "'Ploni', sans-serif", background: '#FFFFFF', minHeight: '100vh' }}>
      <Header />
      <FloatingWA />

      {/* ── Reading Progress Bar ── */}
      <div style={{ position: 'fixed', top: '80px', right: 0, left: 0, height: '3px', background: '#ECEAF8', zIndex: 999 }}>
        <div style={{
          height:     '100%',
          width:      `${scrollPct}%`,
          background: 'linear-gradient(to left, #7C3AED, #6D28D9)',
          transition: 'width 0.1s linear',
        }} />
      </div>

      {/* ── Hero ── */}
      <div style={{
        width:      '100%',
        height:     isMobile ? '300px' : '440px',
        background: post.img
          ? `url(${post.img}) ${post.imgPosition || 'center'}/cover no-repeat`
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
          <div style={{ maxWidth: '960px', margin: '0 auto', width: '100%' }}>
            {/* Category + reading time badges */}
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
              {post.category && (
                <span style={{
                  background:     'rgba(109,40,217,0.85)',
                  backdropFilter: 'blur(6px)',
                  color:          '#fff',
                  fontFamily:     "'Ploni', sans-serif",
                  fontSize:       '12px',
                  fontWeight:     700,
                  padding:        '4px 12px',
                  borderRadius:   RADIUS.full,
                }}>
                  {post.category}
                </span>
              )}
              <span style={{
                background:     'rgba(255,255,255,0.15)',
                backdropFilter: 'blur(6px)',
                color:          'rgba(255,255,255,0.9)',
                fontFamily:     "'Ploni', sans-serif",
                fontSize:       '12px',
                fontWeight:     400,
                padding:        '4px 12px',
                borderRadius:   RADIUS.full,
              }}>
                {readingTime} דקות קריאה
              </span>
            </div>
            <h1 style={{
              fontFamily:    "'Ploni', sans-serif",
              fontSize:      isMobile ? '24px' : '40px',
              fontWeight:    800,
              color:         '#FFFFFF',
              margin:        0,
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
            display:    'inline-flex',
            alignItems: 'center',
            gap:        '6px',
            background: 'transparent',
            border:     'none',
            color:      COLOR.primary,
            fontFamily: "'Ploni', sans-serif",
            fontSize:   '14px',
            fontWeight: 600,
            cursor:     'pointer',
            padding:    '0 0 32px',
            transition: `color 0.2s ${EASING.out}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#7C3AED'; }}
          onMouseLeave={e => { e.currentTarget.style.color = COLOR.primary; }}
        >
          → כל המאמרים
        </button>

        {/* ── Article Body ── */}
        <article>
          {post.content.map((block, i) => {
            const id = `toc-${i}`;

            if (block.type === 'section') return (
              <div key={i} id={id} style={{ margin: '72px 0 44px', textAlign: 'center' }}>
                <h2 style={{
                  fontFamily:    "'Ploni', sans-serif",
                  fontSize:      isMobile ? '26px' : '34px',
                  fontWeight:    800,
                  color:         '#0A0818',
                  letterSpacing: '-0.03em',
                  lineHeight:    1.15,
                  margin:        '0 0 14px',
                }}>
                  {block.value}
                </h2>
                <div style={{
                  width:        '48px',
                  height:       '4px',
                  borderRadius: '2px',
                  background:   'linear-gradient(to left, #7C3AED, #6D28D9)',
                  margin:       '0 auto',
                }} />
              </div>
            );

            if (block.type === 'heading') return (
              <div key={i} id={id} style={{ margin: '48px 0 18px' }}>
                <div style={{
                  height:       '1px',
                  background:   'linear-gradient(to left, transparent, #DDD6FE, transparent)',
                  marginBottom: '20px',
                }} />
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
              <ul key={i} style={{
                margin:      '0 0 24px',
                paddingRight: block.noMarker ? '4px' : '20px',
                paddingLeft: 0,
                listStyle:   block.noMarker ? 'none' : 'disc',
              }}>
                {block.items.map((item, j) => (
                  <li key={j} style={{
                    fontFamily:   "'Ploni', sans-serif",
                    fontSize:     isMobile ? '16px' : '18px',
                    fontWeight:   400,
                    color:        '#3D3B5A',
                    lineHeight:   1.85,
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
                  alt={block.alt || block.caption || ''}
                  loading="lazy"
                  style={{
                    width:          '100%',
                    borderRadius:   RADIUS.xl,
                    display:        'block',
                    objectFit:      'cover',
                    maxHeight:      '520px',
                    objectPosition: block.objectPosition || 'center',
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

        {/* ── Bottom Share Bar ── */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '10px',
          margin:         '48px 0 40px',
          flexWrap:       'wrap',
        }}>
          <span style={{ fontFamily: "'Ploni', sans-serif", fontSize: '14px', color: '#9591B0', fontWeight: 600 }}>
            אהבתם? שתפו:
          </span>
          <ShareBtn color="#25D366" onClick={shareWA}>
            <WhatsAppIcon /> WhatsApp
          </ShareBtn>
          <ShareBtn color="#1877F2" onClick={shareFB}>
            <FacebookIcon /> Facebook
          </ShareBtn>
          <ShareBtn color={copied ? '#059669' : '#6B6B8A'} onClick={copyLink}>
            {copied ? '✓ הועתק!' : '🔗 העתק לינק'}
          </ShareBtn>
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid #ECEAF8', margin: '0 0 48px' }} />

        {/* ── Related Posts ── */}
        {(() => {
          const related = POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
          if (!related.length) return null;
          return (
            <div style={{ marginBottom: '56px' }}>
              <h3 style={{
                fontFamily:    "'Ploni', sans-serif",
                fontSize:      isMobile ? '20px' : '24px',
                fontWeight:    700,
                color:         '#0A0818',
                letterSpacing: '-0.02em',
                margin:        '0 0 24px',
                textAlign:     'right',
              }}>
                מאמרים נוספים
              </h3>
              <div style={{
                display:             'grid',
                gridTemplateColumns: isMobile ? '1fr' : `repeat(${Math.min(related.length, 3)}, 1fr)`,
                gap:                 '20px',
              }}>
                {related.map(p => (
                  <div
                    key={p.slug}
                    onClick={() => navigate(`/blog/${p.slug}`)}
                    style={{
                      background:   '#FFFFFF',
                      borderRadius: RADIUS.xl,
                      border:       '1px solid #ECEAF8',
                      overflow:     'hidden',
                      cursor:       'pointer',
                      transition:   `all 0.25s ${EASING.out}`,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform  = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow  = '0 12px 40px rgba(109,40,217,0.12)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform  = 'translateY(0)';
                      e.currentTarget.style.boxShadow  = 'none';
                    }}
                  >
                    <div style={{
                      height:     '140px',
                      background: p.img
                        ? `url(${p.img}) ${p.imgPosition || 'center'}/cover no-repeat`
                        : 'linear-gradient(135deg, #1e1b4b, #4338ca, #7c3aed)',
                    }} />
                    <div style={{ padding: '16px 18px 20px', direction: 'rtl' }}>
                      <p style={{
                        fontFamily:    "'Ploni', sans-serif",
                        fontSize:      '15px',
                        fontWeight:    700,
                        color:         '#0A0818',
                        margin:        '0 0 8px',
                        lineHeight:    1.35,
                        letterSpacing: '-0.01em',
                      }}>
                        {p.title}
                      </p>
                      <p style={{
                        fontFamily:      "'Ploni', sans-serif",
                        fontSize:        '13px',
                        color:           '#6B6B8A',
                        margin:          0,
                        lineHeight:      1.6,
                        fontWeight:      300,
                        display:         '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow:        'hidden',
                      }}>
                        {p.excerpt}
                      </p>
                      <div style={{ color: COLOR.primary, fontFamily: "'Ploni', sans-serif", fontSize: '13px', fontWeight: 700, marginTop: '10px' }}>
                        קרא עוד ←
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ── CTA ── */}
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

// ── Icons ─────────────────────────────────────────────────

function WhatsAppIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.532 5.862L.057 23.882l6.214-1.47A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-4.964-1.348l-.356-.212-3.69.873.939-3.601-.232-.369A9.818 9.818 0 1112 21.818z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}
