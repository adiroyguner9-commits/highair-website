/**
 * FAQSection.jsx - Accordion FAQ section for homepage
 * RTL Hebrew primary · LTR English · scroll-triggered fade-in
 */

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { COLOR, FS, RADIUS, SHADOW, EASING, DUR } from '../../website/theme.js';
import { useBreakpoint } from '../../website/useBreakpoint.js';
import { useInView } from '../../website/useInView.js';

/* ─────────────── FAQ Data ─────────────── */
const FAQS = [
  {
    q_he: 'כמה עולה משלחת?',
    a_he: 'העלות תלויה ביעד — קילימנג׳רו מ-$3500, אלברוס מ-$2800, אנאפורנה מ-$4200, אוורסט מ-$12000. המחיר כולל מדריכים מקצועיים, ציוד שטח, לינה בדרך, ואוכל במהלך הטרק.',
    q_en: 'How much does an expedition cost?',
    a_en: 'Costs vary by destination — Kilimanjaro from $3,500, Elbrus from $2,800, Annapurna from $4,200, Everest from $12,000. Price includes professional guides, camping gear, accommodation en route, and meals during the trek.',
  },
  {
    q_he: 'האם נדרש ניסיון קודם?',
    a_he: 'לרוב היעדים — לא. קילימנג׳רו, אלברוס, וסובב אנאפורנה מתאימים גם למטיילים ללא ניסיון הרים קודם. כל שנדרש הוא כושר גופני סביר ורצון חזק. לאוורסט ולאקונקאגואה נדרש ניסיון בהרים בגובה 5000+ מטר.',
    a_en: "For most destinations — no. Kilimanjaro, Elbrus, and Annapurna Circuit are suitable for trekkers without prior high-altitude experience. All that's required is reasonable fitness and strong determination. Everest and Aconcagua require prior experience at 5,000m+.",
    q_en: 'Do I need prior experience?',
  },
  {
    q_he: 'כמה זמן לוקחת משלחת?',
    a_he: 'בין 10 ל-21 יום, תלוי ביעד. קילימנג׳רו: כ-14 יום כולל טיסות, אלברוס: 14 יום, סובב אנאפורנה: 21 יום, אוורסט BC: 21 יום. כולן כוללות ימי מנוחה והסתגלות לגובה.',
    a_en: 'Between 10 and 21 days depending on the destination. Kilimanjaro: ~14 days including flights, Elbrus: 14 days, Annapurna Circuit: 21 days, Everest BC: 21 days. All include acclimatization and rest days.',
    q_en: 'How long does an expedition take?',
  },
  {
    q_he: 'האם ניתן להצטרף לבד?',
    a_he: "בהחלט. רוב המשתתפים שלנו מגיעים לבד ומצטרפים לקבוצה. יוצאים זרים, חוזרים חברים. מקסימום 10-12 אנשים לקבוצה כדי לשמור על חוויה אישית.",
    a_en: "Absolutely. Most of our participants join solo and meet the group on arrival. You'll leave as strangers and come back as friends. Groups are capped at 10-12 people for a personal experience.",
    q_en: 'Can I join as a solo traveler?',
  },
  {
    q_he: 'מה לגבי ביטוח?',
    a_he: 'אנחנו דורשים ביטוח נסיעות הכולל פינוי אווירי (Helicopter evacuation) מכל גובה. אנחנו ממליצים על חברות כמו World Nomads או ISOS. אנחנו יכולים לעזור לכם לבחור את הפוליסה הנכונה.',
    a_en: 'We require travel insurance that includes helicopter evacuation from any altitude. We recommend providers like World Nomads or ISOS. We can help you choose the right policy.',
    q_en: 'What about insurance?',
  },
  {
    q_he: 'כיצד מתבצע התשלום?',
    a_he: 'מקדמה של 30% בהרשמה, ויתרת התשלום עד 60 יום לפני יציאת הקבוצה. ניתן לשלם בכרטיס אשראי, Bit, או העברה בנקאית.',
    a_en: 'A 30% deposit is required at registration, with the balance due 60 days before departure. Payment by credit card, bank transfer, or local Israeli payment apps.',
    q_en: 'How does payment work?',
  },
];

/* ─────────────── AccordionItem ─────────────── */
function AccordionItem({ question, answer, isOpen, onToggle, isLast, dir }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        borderBottom: isLast ? 'none' : `1px solid ${COLOR.border}`,
      }}
    >
      {/* Question row */}
      <button
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          width:          '100%',
          background:     'none',
          border:         'none',
          cursor:         'pointer',
          padding:        '22px 0',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          gap:            '16px',
          direction:      dir,
          textAlign:      dir === 'rtl' ? 'right' : 'left',
        }}
        aria-expanded={isOpen}
      >
        <span
          style={{
            fontFamily:  "'Ploni', 'Mazzard', sans-serif",
            fontSize:    FS.body,
            fontWeight:  700,
            color:       hovered || isOpen ? COLOR.primary : COLOR.text,
            lineHeight:  1.5,
            transition:  `color ${DUR.base} ${EASING.smooth}`,
            flex:        1,
          }}
        >
          {question}
        </span>

        {/* Toggle icon */}
        <div
          style={{
            width:          '32px',
            height:         '32px',
            borderRadius:   RADIUS.full,
            border:         `1.5px solid ${isOpen ? COLOR.primary : COLOR.border}`,
            background:     isOpen ? COLOR.primary : 'transparent',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     0,
            transition:     `all ${DUR.base} ${EASING.smooth}`,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            style={{
              transform:  isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
              transition: `transform ${DUR.slow} ${EASING.out}`,
            }}
          >
            <line x1="7" y1="1" x2="7" y2="13" stroke={isOpen ? 'white' : COLOR.primary} strokeWidth="2" strokeLinecap="round" />
            <line x1="1" y1="7" x2="13" y2="7" stroke={isOpen ? 'white' : COLOR.primary} strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      </button>

      {/* Answer — animated height */}
      <div
        style={{
          maxHeight:  isOpen ? '500px' : '0',
          opacity:    isOpen ? 1 : 0,
          overflow:   'hidden',
          transition: 'max-height 0.35s ease, opacity 0.3s ease',
        }}
      >
        <p
          style={{
            fontFamily: "'Ploni', 'Mazzard', sans-serif",
            fontSize:   FS.body,
            color:      COLOR.muted,
            lineHeight: 1.8,
            margin:     '0 0 24px',
            direction:  dir,
            textAlign:  dir === 'rtl' ? 'right' : 'left',
          }}
        >
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ─────────────── FAQSection ─────────────── */
export default function FAQSection() {
  const { i18n } = useTranslation();
  const isEn    = i18n.language === 'en';
  const dir     = isEn ? 'ltr' : 'rtl';
  const { isMobile } = useBreakpoint();
  const [sectionRef, inView] = useInView(0.1);
  const [openIdx, setOpenIdx] = useState(null);

  const handleToggle = (idx) => {
    setOpenIdx(prev => (prev === idx ? null : idx));
  };

  const sectionLabel = isEn ? 'FAQ' : 'שאלות נפוצות';
  const heading      = isEn ? 'Everything You Wanted to Know' : 'כל מה שרצית לדעת';
  const subtext      = isEn
    ? 'Can\'t find an answer? Chat with us on WhatsApp'
    : 'לא מצאתם תשובה? דברו איתנו ב-WhatsApp';

  return (
    <section
      ref={sectionRef}
      style={{
        background:  '#FFFFFF',
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
          maxWidth: '800px',
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
            margin:        '0 0 16px',
            letterSpacing: '-1.5px',
            lineHeight:    1.1,
            textAlign:     dir === 'rtl' ? 'right' : 'left',
          }}
        >
          {heading}
        </h2>

        {/* Subtext with WhatsApp link */}
        <p
          style={{
            fontFamily:   "'Ploni', 'Mazzard', sans-serif",
            fontSize:     FS.body,
            color:        COLOR.muted,
            margin:       '0 0 48px',
            lineHeight:   1.7,
            textAlign:    dir === 'rtl' ? 'right' : 'left',
          }}
        >
          {isEn ? "Can't find an answer? " : 'לא מצאתם תשובה? '}
          <a
            href="https://api.whatsapp.com/send?phone=972555636975"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color:          COLOR.primary,
              fontWeight:     700,
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
            onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
          >
            {isEn ? 'Chat with us on WhatsApp' : 'דברו איתנו ב-WhatsApp'}
          </a>
        </p>

        {/* Accordion */}
        <div
          style={{
            borderTop: `1px solid ${COLOR.border}`,
          }}
        >
          {FAQS.map((faq, idx) => (
            <AccordionItem
              key={idx}
              question={isEn ? faq.q_en : faq.q_he}
              answer={isEn ? faq.a_en : faq.a_he}
              isOpen={openIdx === idx}
              onToggle={() => handleToggle(idx)}
              isLast={idx === FAQS.length - 1}
              dir={dir}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
