/* Server logs never carry a lead's name, email or phone (owner, 8 Nov 2026):
   Vercel keeps runtime logs and everyone with project access reads them. */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const files = dir => readdirSync(dir).flatMap(n => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? files(p) : p.endsWith('.js') ? [p] : [];
});
const LEAK = /\['(Name|Full Name|Email|Phone)'\]\s*[,)]|\bclean(Name|Phone|Email)\b|\b(lead|c)\.(email|phone|name)\b|,\s*(email|phone|name)\s*[,)]/;

describe('no personal data in server logs', () => {
  it('no console call logs a name, email or phone', () => {
    const bad = [];
    for (const f of files('api')) {
      readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
        if (/console\.(log|info|warn|error)\(/.test(line) && LEAK.test(line.slice(line.indexOf('console.')))) bad.push(`${f}:${i + 1}`);
      });
    }
    expect(bad).toEqual([]);
  });
});
