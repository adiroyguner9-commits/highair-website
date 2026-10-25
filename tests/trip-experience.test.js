/* A technical trip must not tell readers "no prior experience needed"
   (owner, 25 Oct 2026). Its experienceHe / experienceEn line replaces the
   generic note and the default FAQ answer. */
import { describe, it, expect } from 'vitest';
import { EXPS } from '../src/data/mockData.js';
import { FAQ_BY_SLUG, makeDefaultFaq, makeDefaultFaqEn, notesWithExperience } from '../src/data/faqData.js';

const NO_EXP = /לא נדרש ניסיון טיפוס קודם|אם אין לכם ניסיון קודם|no prior (climbing )?experience/i;
const technical = EXPS.filter(e => e.experienceHe);

describe('required experience on technical trips', () => {
  it('the technical trips carry an experience line in both languages', () => {
    expect(technical.map(e => e.slug).sort()).toEqual(['ama-dablam', 'elbrus', 'himlung-himal', 'island-peak', 'lenin-peak', 'lobuche-peak', 'manaslu']);
    for (const e of technical) expect(e.experienceEn, e.slug).toBeTruthy();
  });
  it('no technical trip says "no prior experience" in its notes or FAQ', () => {
    for (const e of technical) {
      const notes = [...notesWithExperience(e.importantToNote, e.experienceHe), ...notesWithExperience(e.importantToNoteEn, e.experienceEn)];
      const faq = FAQ_BY_SLUG[e.slug]?.he?.length ? [...FAQ_BY_SLUG[e.slug].he, ...FAQ_BY_SLUG[e.slug].en]
        : [...makeDefaultFaq(15, e.experienceHe), ...makeDefaultFaqEn(15, e.experienceEn)];
      const text = [...notes, ...faq.map(f => f.a)].join(' ');
      expect(NO_EXP.test(text), e.slug).toBe(false);
    }
  });
});
