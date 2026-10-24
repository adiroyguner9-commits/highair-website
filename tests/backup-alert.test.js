/* A message only the 5-minute safety net sent means the Lead Center's instant
   send failed (api/_lib/backup-alert.js). In October 2026 that went unseen for
   two days; now each one emails info@ the same day. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { backupAlert } from '../api/_lib/backup-alert.js';

describe('backup alert', () => {
  it('says nothing when the instant path did its job', () => {
    expect(backupAlert([])).toBe(null);
  });
  it('names each late message, the customer and how late', () => {
    const m = backupAlert([{ kind: 'deposit', name: 'דנה', expedition: 'Kilimanjaro', minutes: 7 }, { kind: 'noAnswer', name: 'יואב', minutes: 4 }]);
    expect(m.subject).toContain('(2)');
    expect(m.html).toContain('הודעת הסגירה');
    expect(m.html).toContain('דנה');
    expect(m.html).toContain('7 דקות');
    expect(m.html).toContain('ניסינו להשיג אותך');
  });
  it('escapes names', () => {
    expect(backupAlert([{ kind: 'deposit', name: '<b>x</b>' }]).html).not.toContain('<b>x</b>');
  });
  it('is wired to both safety nets, and only for messages that really went out', () => {
    const src = readFileSync(resolve(__dirname, '../api/lead-messaging.js'), 'utf8');
    expect(src).toContain("if (out.sent) { result.noAnswer++; backupSends.push(backupItem('noAnswer', rec)); }");
    expect(src).toContain("if (out.waSent) backupSends.push(backupItem('deposit', rec));");
    expect(src).toContain('await sendBackupAlert(backupSends)');
  });
});
