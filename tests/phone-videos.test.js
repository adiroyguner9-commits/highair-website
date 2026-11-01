/* Every trip hero video has a phone copy that is really lighter, and the list
   the page reads matches the files (scripts/gen-phone-videos.mjs). */
import { describe, it, expect } from 'vitest';
import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { EXPS } from '../src/data/mockData.js';
import VIDEOS from '../src/website/phoneVideos.json';

const file = p => resolve(__dirname, '../public', p.replace(/^\//, ''));

describe('phone copies of the trip hero videos', () => {
  const heroes = [...new Set(EXPS.map(e => e.heroVideo).filter(Boolean))];
  it('covers every trip video', () => {
    for (const src of heroes) expect(VIDEOS[src], src).toBeTruthy();
  });
  it('points at real files at most half the original size', () => {
    for (const [src, copy] of Object.entries(VIDEOS)) {
      expect(existsSync(file(copy)), copy).toBe(true);
      expect(statSync(file(copy)).size).toBeLessThan(statSync(file(src)).size / 2);
    }
  });
});
