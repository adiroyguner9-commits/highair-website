/* The send button is never dead (owner, 25 Nov 2026, after a PostHog recording: a Google visitor
   filled in the whole Kilimanjaro form but the consent box, pressed a grey button that did nothing,
   sat five minutes and left). Every lead form keeps its button live and, pressed without the box,
   says so under the box and brings it into view. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { missingFields, CONSENT_NEEDED_HE, CONSENT_NEEDED_EN } from '../src/website/formRules.js';

const read = p => readFileSync(p, 'utf8');
const FORMS = ['src/components/web_v2/ExpeditionDetail.jsx', 'src/components/web_v2/CTASection.jsx', 'src/components/web_v2/SafariPage.jsx'];

describe('the consent box is asked for, the button is not disabled for it', () => {
  it('no lead form disables or greys its button over the box', () => {
    for (const f of FORMS) {
      const src = read(f);
      expect(src, f).not.toMatch(/disabled=\{[^}]*privacy/);
      expect(src, f).not.toMatch(/background:[^\n]*!form\.privacy/);
      expect(src, f).not.toMatch(/cursor:[^\n]*!form\.privacy/);
    }
  });
  it('each form names the box and says the line', () => {
    expect(read(FORMS[0])).toContain('id="lead-privacy"');
    expect(read(FORMS[0])).toContain("['lead-privacy', true, form.privacy ? 'yes' : '']");
    expect(read(FORMS[1])).toContain('id="cta-privacy"');
    expect(read(FORMS[1])).toContain("revealField('cta-privacy')");
    expect(read(FORMS[2])).toContain('id="safari-privacy"');
    expect(read(FORMS[2])).toContain("revealField('safari-privacy')");
    for (const f of FORMS) expect(read(f), f).toContain('isRtl ? CONSENT_NEEDED_HE : tx(CONSENT_NEEDED_EN)');
  });
  it('on the trip page the box comes after every empty field, so the fields are shown first', () => {
    const order = ['lead-name', 'lead-month', 'lead-phone', 'lead-privacy'];
    expect(missingFields(order.map(id => [id, true, '']))).toEqual(order);
    expect(missingFields([['lead-name', true, 'Dana'], ['lead-privacy', true, '']])).toEqual(['lead-privacy']);
    expect(missingFields([['lead-name', true, 'Dana'], ['lead-privacy', true, 'yes']])).toEqual([]);
  });
  it('the words, in every language the site speaks', () => {
    expect(CONSENT_NEEDED_HE).toBe('יש לסמן את האישור כדי לשלוח');
    expect(CONSENT_NEEDED_EN).toBe('Please tick the box to send');
    for (const l of ['de', 'es']) expect(JSON.parse(read(`src/i18n/ui-${l}.json`))[CONSENT_NEEDED_EN], l).toBeTruthy();
    expect(`${CONSENT_NEEDED_HE} ${CONSENT_NEEDED_EN}`).not.toMatch(/[—–]/);
  });
});
