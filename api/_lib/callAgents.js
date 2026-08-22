/**
 * Who could take a call, and who is already on one.
 *
 * A booked slot used to block that time for EVERY customer. But a 09:00
 * Aconcagua call belongs to Chen, and a 09:00 Kilimanjaro call belongs to one
 * of the Tomers — two different people, two different phones, no clash. The
 * owner asked for exactly that (Aug 20 2026: "אין לי בעיה שיהיו שיחות במקביל,
 * רק עם סוכנים אחרים").
 *
 * ── THE RULE, in full ──────────────────────────────────────────────────────
 * For a time t and a destination D:
 *   1. Nothing booked at t                    → open.
 *   2. Every booking at t has a known owner:
 *        the Agent stamped on it, or, for a row older than that field, every
 *        agent who covers ITS destination.
 *      If any booking's owner cannot be named  → CLOSED. Somebody is on that
 *      call and we cannot prove it is not the person D would go to.
 *   3. Nobody covers D                        → CLOSED, for the same reason
 *      from the other side.
 *   4. Otherwise open when at least one agent who covers D is not among the
 *      owners.
 *
 * The webapp's Lead Center runs this same rule in src/data/leads.js
 * (`bookedTimesForDest`), so the agent's picker and the customer's show the
 * same times. THEY MUST STAY IDENTICAL — a differential test over every real
 * appointment caught them disagreeing on 385 of 16,074 cases the first time,
 * all of them step 2: this file counted an unknown owner as blocking nobody.
 */
import { destKey } from './dest.js';

/* One spelling of an agent's name, so "Tomer Lan" and "tomer  lan" are the
   same person everywhere the owners of a slot are compared. Exported because
   book-slot has to ask "is THIS agent one of the owners" before it decides
   whether the call has to move to somebody free. */
export const agentKey = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
const norm = agentKey;

/* Destinations with a single owner regardless of the Destinations column.
   Mirrors EXCLUSIVE_DEST_AGENT / EXCLUSIVE_DEST_PREFIX in the webapp's
   api/_lib/assign.js, which is the source of truth for who gets a lead. */
const EXCLUSIVE_DEST = { sinai: 'Adir Oyguner' };
const EXCLUSIVE_PREFIX = [['safari', 'Adir Oyguner']];

function exclusiveFor(dest) {
  const d = norm(dest);
  if (EXCLUSIVE_DEST[d]) return EXCLUSIVE_DEST[d];
  for (const [p, who] of EXCLUSIVE_PREFIX) if (d.startsWith(p)) return who;
  return '';
}

/** Sales agents with the destinations they cover. Backups are a fallback for
 *  destinations nobody active covers, not overflow capacity. */
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
  const dest = destKey(expedition) || String(expedition || '').trim();
  if (!dest) return [];
  const only = exclusiveFor(dest);
  if (only) return [only];
  const hit = d => (agents || []).filter(a => !!a.backup === d
    && (a.destinations || []).some(x => norm(x) === norm(dest))).map(a => a.name);
  const active = hit(false);
  return active.length ? active : hit(true);
}

/** time → { owners:Set<string>, unknown:boolean } for the bookings at that time. */
export function busyByTime(appointments, agents) {
  const map = new Map();
  for (const rec of appointments) {
    const f = rec.fields || {};
    const time = f.Time;
    if (!time) continue;
    if (!map.has(time)) map.set(time, { owners: new Set(), unknown: false });
    const slot = map.get(time);
    const named = String(f.Agent || '').trim();
    const who = named ? [named] : coversFor(agents, f.Expedition);
    if (!who.length) { slot.unknown = true; continue; }
    for (const n of who) slot.owners.add(norm(n));
  }
  return map;
}

/** Is anyone who covers `expedition` free at `time`? See THE RULE above. */
export function someoneFreeAt({ time, expedition, agents, busy }) {
  const slot = busy.get(time);
  if (!slot) return true;                                   // 1. nothing booked
  if (slot.unknown) return false;                           // 2. an owner we cannot name
  const candidates = coversFor(agents, expedition);
  if (!candidates.length) return false;                     // 3. nobody covers it
  return candidates.some(n => !slot.owners.has(norm(n)));   // 4.
}

/** Of the agents who could take this call, the ones actually free at `time`. */
export function freeCoversAt({ time, expedition, agents, busy }) {
  const slot = busy.get(time);
  const taken = slot ? slot.owners : new Set();
  if (slot?.unknown) return [];
  return coversFor(agents, expedition).filter(n => !taken.has(norm(n)));
}
