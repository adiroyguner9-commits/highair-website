/* The homepage stats bar shows its figures as they are (no count-up from 0, which a
   crawler captures as "0"), and the crawlers' text layer carries the same figures
   (owner, 17 Nov 2026). */
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { SITE_STATS, STATS_LABELS_HE, DEST_COUNT, homeStatsHe } from '../src/data/siteStats.js';
import { homeText } from '../scripts/lib/text-layer.mjs';

describe('homepage stats', () => {
  it('the bar has no count-up animation', () => {
    const src = fs.readFileSync('src/components/web_v2/StatsSection.jsx', 'utf8');
    expect(src).not.toMatch(/useCountUp|requestAnimationFrame|useInView/);
    expect(src).toMatch(/SITE_STATS\.climbers/);
  });

  it('the Hebrew labels match i18n.js', () => {
    const i18n = fs.readFileSync('src/i18n.js', 'utf8');
    const block = i18n.match(/stats:\s*\{([^}]*)\}/)[1];
    for (const [k, v] of Object.entries(STATS_LABELS_HE)) expect(block).toContain(`${k}: '${v}'`);
  });

  it('the text layer carries every figure', () => {
    const html = homeText({ description: 'd', stats: homeStatsHe() });
    for (const v of [String(DEST_COUNT), SITE_STATS.climbers, SITE_STATS.donatedHe, SITE_STATS.successRate]) {
      expect(html).toContain(`<strong>${v}</strong>`);
    }
    expect(DEST_COUNT).toBeGreaterThan(10);
  });
});
