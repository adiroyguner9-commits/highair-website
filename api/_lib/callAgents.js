/**
 * Who could take a call, and who is already on one.
 *
 * A booked slot used to block that time for EVERY customer. But a 09:00
 * Aconcagua call belongs to Chen, and a 09:00 Kilimanjaro call belongs to one
 * of the Tomers — two different people, two different phones, no clash. The
 * owner asked for exactly that (Aug 20 2026: "אין לי בעיה שתהיה חפיפה על יעדים
 * שונים, אם יש סוכן שונה שלוקח את השיחה").
 *
 * So a time is closed for a destination only when every agent who covers that
 * destination is already busy at it. Today twelve of the sixteen destinations
 * have exactly one possible agent, which is why "a different destination"
 * nearly always does mean "a different person".
 *
 * Mirrors the webapp's api/_lib/assign.js on purpose: the same Agents table,
 * the same Destinations field, the same backup rule. Keep the two in step.
 */
import { destKey } from './dest.js';

const norm = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();

/** Sales agents with the destinations they cover. Backups are excluded: they
 *  exist for destinations nobody active covers, not to absorb overflow. */
export async function fetchCallAgents(base, token) {
  const url = `https://api.airtable.com/v0/${base}/${encodeURIComponent('Agents')}`
    + `?filterByFormula=${encodeURIComponent('{Type}="Sales"')}&pageSize=50`;
  const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  if (!r.ok) throw new Error(`agents fetch failed: ${r.status}`);
  const d = await r.json();
  return (d.records || []).map(rec => {
    const f = rec.fields || {};
    const name = [f['Name'], f['Last Name']].filter(Boolean).join(' ').trim()
      || String(f['Booking Reference'] || '').trim();
    return {
      name,
      destinations: Array.isArray(f['Destinations']) ? f['Destinations'] : [],
      backup: !!f['Backup'],
    };
  }).filter(a => a.name);
}

/** The agents who could take a call about this expedition, by name. */
export function coversFor(agents, expedition) {
  const dest = destKey(expedition);
  if (!dest) return [];
  const active = agents.filter(a => !a.backup);
  const hit = active.filter(a => (a.destinations || []).some(d => norm(d) === norm(dest)));
  if (hit.length) return hit.map(a => a.name);
  /* Nobody active covers it — the backups do, and if there are none either we
     know nothing about who would take it. */
  const backups = agents.filter(a => a.backup
    && (a.destinations || []).some(d => norm(d) === norm(dest)));
  return backups.map(a => a.name);
}

/**
 * time → the set of agent names already on a call then.
 *
 * `Agent` is written onto every appointment from now on. A row without one is
 * older than this feature, so its agent is inferred from its destination: with
 * a single coverer that is exact, and with two it counts BOTH as busy. That
 * over-blocks a Kilimanjaro pair for a few weeks rather than risk booking two
 * customers onto one person, and it is still no worse than the old behaviour,
 * which blocked everybody.
 */
export function busyByTime(appointments, agents) {
  const map = new Map();
  for (const rec of appointments) {
    const f = rec.fields || {};
    const time = f.Time;
    if (!time) continue;
    const named = String(f.Agent || '').trim();
    const who = named ? [named] : coversFor(agents, f.Expedition);
    if (!map.has(time)) map.set(time, new Set());
    const set = map.get(time);
    for (const n of who) set.add(norm(n));
  }
  return map;
}

/** Is anyone who covers `expedition` free at `time`? */
export function someoneFreeAt({ time, expedition, agents, busy }) {
  const candidates = coversFor(agents, expedition);
  /* An expedition we cannot place — an unmapped value, or a destination no
     agent covers — keeps the old rule: any booking at that time closes it.
     Better to send the customer to another slot than to a person who is not
     there. */
  if (!candidates.length) return !(busy.get(time)?.size > 0);
  const taken = busy.get(time) || new Set();
  return candidates.some(n => !taken.has(norm(n)));
}

/** Of the agents who could take this call, the ones actually free at `time`. */
export function freeCoversAt({ time, expedition, agents, busy }) {
  const taken = busy.get(time) || new Set();
  return coversFor(agents, expedition).filter(n => !taken.has(norm(n)));
}
