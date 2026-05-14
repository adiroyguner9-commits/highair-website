/**
 * BlogPreview.jsx - Latest 3 blog posts preview for homepage
 * RTL Hebrew primary · LTR English · scroll-triggered fade-in
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { COLOR, FS, RADIUS, SHADOW, EASING, DUR } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { useInView } from '../../website/useInView.js';
import { POSTS } from '../../data/blogData.js';

/* ─────────────── BlogCard ─────────────── */
function BlogCard({ post, isEn, dir }) {
  const navigate   = useNavigate();
  const [imgHover, setImgHover] = useState(false);
  const [cardHover, setCardHover] = useState(false);

  const title    = isEn ? (post.titleEn    || post.title)    : post.title;
  const excerpt  = isEn ? (post.excerptEn  || post.excerpt)  : post.excerpt;
  const date     = isEn ? (post.dateEn     || post.dateHe)   : post.dateHe;
  const category = isEn ? (post.categoryEn || post.category) : post.category;

  const handleClick = () => navigate(`/blog/${post.slug}`);

  return (
    <article
      onClick={handleClick}
      onMouseEnter={() => { setCardHover(true); setImgHover(true); }}
      onMouseLeave={() => { setCardHover(false); setImgHover(false); }}
      style={{
        background:    COLOR.card,
        borderRadius:  RADIUS['2xl'],
        boxShadow:     cardHover ? SHADOW.md : SHADOW.sm,
        cursor:        'pointer',
        overflow:      'hidden',
        display:       'flex',
        flexDirection: 'column',
        transform:     cardHover ? 'translateY(-4px)' : 'translateY(0)',
        transition:    `box-shadow ${DUR.slow} ${EASING.out}, transform ${DUR.slow} ${EASING.out}`,
        direction:     dir,
      }}
    >
      {/* Image container */}
      <div
        style={{
          position:   'relative',
          aspectRatio: '16/9',
          width:      '100%',
          overflow:   'hidden',
        }}
      >
        <img
          src={post.img}
          alt={title}
          style={{
            width:      '100%',
            height:     '100%',
            objectFit:  'cover',
            objectPosition: post.imgPosition || 'center',
            display:    'block',
            transform:  imgHover ? 'scale(1.04)' : 'scale(1)',
            transition: `transform 0.5s ${EASING.out}`,
          }}
        />

        {/* Category badge */}
        {category && (
          <span
            style={{
              position:     'absolute',
              top:          '12px',
              [dir === 'rtl' ? 'right' : 'left']: '12px',
              background:   COLOR.primary,
              color:        '#FFFFFF',
              fontSize:     '11px',
              fontWeight:   700,
              padding:      '4px 10px',
              borderRadius: RADIUS.pill,
              fontFamily:   "'Ploni', 'Mazzard', sans-serif",
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              lineHeight:   1.2,
            }}
          >
            {category}
          </span>
        )}
      </div>

      {/* Card body */}
      <div
        style={{
          padding:       '20px',
          display:       'flex',
          flexDirection: 'column',
          flex:          1,
          gap:           '10px',
          textAlign:     dir === 'rtl' ? 'right' : 'left',
        }}
      >
        {/* Date */}
        {date && (
          <time
            dateTime={post.dateIso}
            style={{
              fontFamily: "'Ploni', 'Mazzard', sans-serif",
              fontSize:   FS.sm,
              color:      COLOR.mutedLight,
              display:    'block',
            }}
          >
            {date}
          </time>
        )}

        {/* Title */}
        <h3
          style={{
            fontFamily:        "'Ploni', 'Mazzard', sans-serif",
            fontSize:          FS.h3,
            fontWeight:        700,
            color:             COLOR.text,
            margin:            0,
            lineHeight:        1.35,
            display:           '-webkit-box',
            WebkitLineClamp:   2,
            WebkitBoxOrient:   'vertical',
            overflow:          'hidden',
          }}
        >
          {title}
        </h3>

        {/* Excerpt */}
        <p
          style={{
            fontFamily:        "'Ploni', 'Mazzard', sans-serif",
            fontSize:          FS.sm,
            color:             COLOR.muted,
            margin:            0,
            lineHeight:        1.7,
            display:           '-webkit-box',
            WebkitLineClamp:   3,
            WebkitBoxOrient:   'vertical',
            overflow:          'hidden',
            flex:              1,
          }}
        >
          {excerpt}
        </p>

        {/* Read more */}
        <div
          style={{
            display:    'flex',
            alignItems: 'center',
            gap:        '5px',
            marginTop:  '4px',
          }}
        >
          <span
            style={{
              fontFamily:  "'Ploni', 'Mazzard', sans-serif",
              fontSize:    FS.sm,
              fontWeight:  700,
              color:       COLOR.primary,
            }}
          >
            {isEn ? 'Read more' : 'קרא עוד'}
          </span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{
              transform: dir === 'rtl' ? 'rotate(180deg)' : 'none',
              flexShrink: 0,
            }}
          >
            <path
              d="M2 7h10M8 3l4 4-4 4"
              stroke={COLOR.primary}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </article>
  );
}

/* ─────────────── BlogPreview ─────────────── */
export default function BlogPreview() {
  const navigate  = useNavigate();
  const { i18n }  = useTranslation();
  const isEn      = i18n.language === 'en';
  const dir       = isEn ? 'ltr' : 'rtl';
  const { isMobile } = useBreakpoint();
  const [sectionRef, inView] = useInView(0.1);

  const [allPostsHover, setAllPostsHover] = useState(false);

  // First 3 posts = most recent (listed newest-first in blogData)
  const latestPosts = POSTS.slice(0, 3);

  const sectionLabel = isEn ? 'Our Blog' : 'הבלוג שלנו';
  const heading      = isEn ? 'Guides, Stories & Field Tips' : 'מדריכים, סיפורים ועצות מהשטח';
  const allPostsText = isEn ? 'All posts' : 'לכל הפוסטים';

  return (
    <section
      ref={sectionRef}
      style={{
        background:  COLOR.bg,
        padding:     isMobile ? '60px 5vw' : '80px 5vw',
        boxSizing:   'border-box',
        direction:   dir,
        opacity:     inView ? 1 : 0,
        transform:   inView ? 'translateY(0)' : 'translateY(32px)',
        transition:  `opacity 0.6s ${EASING.out}, transform 0.6s ${EASING.out}`,
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin:   '0 auto',
        }}
      >
        {/* Section label */}
        <span
          style={{
            fontFamily:    "'Ploni', 'Mazzard', sans-serif",
            fontSize:      '12px',
            fontWeight:    700,
            color:         COLOR.primary,
            textTransform: 'uppercase',
            letterSpacing: '2px',
            display:       'block',
            marginBottom:  '14px',
            textAlign:     dir === 'rtl' ? 'right' : 'left',
          }}
        >
          {sectionLabel}
        </span>

        {/* H2 heading */}
        <h2
          style={{
            fontFamily:    "'Ploni', 'Mazzard', sans-serif",
            fontSize:      FS.h2,
            fontWeight:    900,
            color:         COLOR.text,
            margin:        '0 0 48px',
            letterSpacing: '-1.5px',
            lineHeight:    1.1,
            textAlign:     dir === 'rtl' ? 'right' : 'left',
          }}
        >
          {heading}
        </h2>

        {/* Cards grid */}
        <div
          style={{
            display:             'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap:                 '24px',
            marginBottom:        '48px',
          }}
        >
          {latestPosts.map(post => (
            <BlogCard
              key={post.id}
              post={post}
              isEn={isEn}
              dir={dir}
            />
          ))}
        </div>

        {/* All posts button */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/blog')}
            onMouseEnter={() => setAllPostsHover(true)}
            onMouseLeave={() => setAllPostsHover(false)}
            style={{
              display:        'inline-flex',
              alignItems:     'center',
              gap:            '8px',
              padding:        '14px 40px',
              borderRadius:   RADIUS.pill,
              border:         `2px solid ${COLOR.primary}`,
              background:     allPostsHover ? COLOR.primary : 'transparent',
              color:          allPostsHover ? '#FFFFFF' : COLOR.primary,
              fontFamily:     "'Ploni', 'Mazzard', sans-serif",
              fontSize:       FS.btn,
              fontWeight:     800,
              cursor:         'pointer',
              letterSpacing:  '-0.2px',
              boxShadow:      allPostsHover ? SHADOW.brand.md : 'none',
              transform:      allPostsHover ? 'translateY(-1px)' : 'translateY(0)',
              transition:     `all ${DUR.base} ${EASING.smooth}`,
            }}
          >
            {allPostsText}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              style={{
                transform: dir === 'rtl' ? 'rotate(180deg)' : 'none',
                flexShrink: 0,
              }}
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke={allPostsHover ? '#FFFFFF' : COLOR.primary}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
