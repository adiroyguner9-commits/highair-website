/* A missing field is said on the page, never left to the browser's bubble, which
   the Facebook and Instagram in-app browsers do not show (PostHog, 18 Nov 2026: a
   visitor from a Facebook ad left the experience box empty, pressed send three
   times, saw nothing and left; no lead reached the table). */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { missingFields, revealField, FIELD_NEEDED_HE, FIELD_NEEDED_EN, MONTH_NEEDED_EN } from '../src/website/formRules.js';

const de = JSON.parse(readFileSync(new URL('../src/i18n/ui-de.json', import.meta.url), 'utf8'));
const es = JSON.parse(readFileSync(new URL('../src/i18n/ui-es.json', import.meta.url), 'utf8'));
const trip = readFileSync(new URL('../src/components/web_v2/ExpeditionDetail.jsx', import.meta.url), 'utf8');
const israel = readFileSync(new URL('../src/components/web_v2/IsraelDetail.jsx', import.meta.url), 'utf8');

describe('missingFields', () => {
  it('names the empty required fields in the page order, spaces count as empty', () => {
    expect(missingFields([
      ['lead-name', true, 'דנה'],
      ['lead-month', true, ''],
      ['lead-age', true, '34'],
      ['lead-phone', true, '   '],
      ['lead-experience', true, ''],
    ])).toEqual(['lead-month', 'lead-phone', 'lead-experience']);
  });
  it('a field the page does not ask for is never missing (the safari has no age or experience)', () => {
    expect(missingFields([['lead-age', false, ''], ['lead-experience', false, undefined]])).toEqual([]);
  });
  it('the session that was lost: everything but the experience box', () => {
    expect(missingFields([
      ['lead-name', true, 'Name'], ['lead-month', true, 'פברואר 2027'], ['lead-age', true, '45'],
      ['lead-group', true, '1'], ['lead-phone', true, '0501234567'], ['lead-email', true, 'a@b.co'],
      ['lead-experience', true, ''],
    ])).toEqual(['lead-experience']);
  });
});

describe('revealField', () => {
  it('scrolls to the field and puts the cursor in it, a select only scrolled to', () => {
    const calls = [];
    const el = tag => ({ tagName: tag, scrollIntoView: o => calls.push(['scroll', tag, o?.block]), focus: () => calls.push(['focus', tag]) });
    const doc = { getElementById: id => ({ a: el('TEXTAREA'), b: el('SELECT') }[id] || null) };
    revealField('a', doc); revealField('b', doc); revealField('nothing', doc);
    expect(calls).toEqual([['scroll', 'TEXTAREA', 'center'], ['focus', 'TEXTAREA'], ['scroll', 'SELECT', 'center']]);
  });
});

describe('the lead forms check for themselves', () => {
  it('the trip page and the Israel trek page take no browser validation', () => {
    expect(trip).toMatch(/<form noValidate onSubmit=\{handleSubmit\}/);
    expect(israel).toMatch(/<form noValidate onSubmit=\{handleSubmit\}/);
  });
  it('every required field of the trip form is checked, and the phone too (it carries no required)', () => {
    for (const id of ['lead-name', 'lead-month', 'lead-age', 'lead-group', 'lead-phone', 'lead-email', 'lead-experience']) {
      expect(trip).toContain(`['${id}', `);
    }
    for (const id of ['israel-name', 'israel-email', 'israel-month', 'israel-phone']) {
      expect(israel).toContain(`['${id}', `);
    }
  });
  it('the message reads in every language the trip page is sold in', () => {
    expect(FIELD_NEEDED_HE).toBe('נא למלא את השדה');
    for (const dict of [de, es]) {
      expect(dict[FIELD_NEEDED_EN]).toBeTruthy();
      expect(dict[MONTH_NEEDED_EN]).toBeTruthy();
    }
  });
});
