/* ── Kilimanjaro lead rotas ─────────────────────────────────────────────────
   Owner, 14 Sep 2026. Two queues, each a strict repeating cycle:

   CALLS  a Kilimanjaro lead who books a call: Tomer Lan 4, Tomer Harush 1.
          If the one whose turn it is is already on a call at that hour, the
          other takes it, and the next call repays the turn, so over time the
          split stays 4:1 and in that order.
   NEW    a Kilimanjaro lead still without a call KILI_WAIT_MIN minutes after
          leaving details: Tomer Harush 3, Eldar Solomon 1.

   THIS FILE EXISTS TWICE, byte for byte:
     HighAir-webapp/api/_lib/kiliRota.js   (lead-notify: the NEW queue, and a
                                            booked lead nobody picked up)
     HighAir-website/api/_lib/kiliRota.js  (book-slot: the CALLS queue)
   Both write the same stamps and read the same tally. If they disagree they
   fight over whose turn it is. Change one, copy it to the other.

   WHY A STAMP. Each decision writes {Kili Rota} = "Calls 2026-09: Tomer Lan" on
   the lead, and the tally counts those stamps. Nothing a person fills in is
   counted, and moving a lead by hand later does not shift anyone's turn: the
   stamp records what the rota decided, not who owns the lead today. The month
   in the stamp keeps the tally small: each month starts a fresh cycle.
   (The previous tally read one page of 100 leads and never past it, so from
   21 Aug 2026 every rota decision came out Tomer Lan.) */

export const KILI_ROTA_FIELD = 'Kili Rota';
export const KILI_WAIT_MIN = 15;

export const KILI_ROTAS = {
  calls: { label: 'Calls',    agents: [['Tomer Lan', 4], ['Tomer Harush', 1]] },
  new:   { label: 'New lead', agents: [['Tomer Harush', 3], ['Eldar Solomon', 1]] },
};

export function israelMonth(when = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit' }).formatToParts(when);
  return `${p.find(x => x.type === 'year').value}-${p.find(x => x.type === 'month').value}`;
}

const prefixFor = (rota, when) => `${KILI_ROTAS[rota].label} ${israelMonth(when)}:`;

export const kiliRotaStamp = (rota, agent, when = new Date()) => `${prefixFor(rota, when)} ${agent}`;

/* Whose turn it is, given how many decisions each agent already has this month.
   The cycle is laid out in order (L L L L H). After n decisions each agent is
   owed as many as the first n+1 places of the cycle give them; the one owed
   most takes it. With no overflow that is exactly the cycle; after an overflow
   the agent who lost a turn is owed one and gets the next. */
export function pickByCycle(rota, counts = {}) {
  const agents = KILI_ROTAS[rota].agents;
  const cycle = agents.flatMap(([name, n]) => Array(n).fill(name));
  const done = agents.reduce((s, [name]) => s + (counts[name] || 0), 0);
  const places = done + 1;
  const owed = name => Math.floor(places / cycle.length) * cycle.filter(x => x === name).length
    + cycle.slice(0, places % cycle.length).filter(x => x === name).length;
  let best = agents[0][0], bestGap = -Infinity;
  for (const [name] of agents) {
    const gap = owed(name) - (counts[name] || 0);
    if (gap > bestGap) { best = name; bestGap = gap; }
  }
  return best;
}

export async function kiliRotaCounts(base, token, rota, when = new Date()) {
  const prefix = prefixFor(rota, when);
  const formula = `FIND("${prefix}", {${KILI_ROTA_FIELD}}&"")=1`;
  const counts = {};
  let offset = '';
  do {
    const url = `https://api.airtable.com/v0/${base}/${encodeURIComponent('Website Leads')}`
      + `?filterByFormula=${encodeURIComponent(formula)}&pageSize=100`
      + `&fields%5B%5D=${encodeURIComponent(KILI_ROTA_FIELD)}${offset ? `&offset=${offset}` : ''}`;
    const r = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const d = await r.json();
    if (!r.ok || d.error) throw new Error(d.error?.message || `Airtable ${r.status}`);
    for (const rec of d.records || []) {
      const name = String(rec.fields?.[KILI_ROTA_FIELD] || '').slice(prefix.length).trim();
      if (name) counts[name] = (counts[name] || 0) + 1;
    }
    offset = d.offset || '';
  } while (offset);
  return counts;
}

/* The agent for the next decision in a queue. A tally that cannot be read gives
   the queue's first agent, so a lookup failure never leaves a lead unassigned. */
export async function nextKiliAgent(base, token, rota, when = new Date()) {
  try {
    return pickByCycle(rota, await kiliRotaCounts(base, token, rota, when));
  } catch (e) {
    console.error(`[kiliRota] ${rota} tally:`, e.message);
    return KILI_ROTAS[rota].agents[0][0];
  }
}

/* CALLS queue with the hour taken into account. `isBusy(name)` says whether that
   agent is already on a call at the booked time. The agent whose turn it is
   takes the call when free; otherwise the next agent in the queue who is free.
   When everyone is busy the turn holder keeps it, and the caller logs that. */
export function callsAgentFor(turn, isBusy = () => false) {
  if (!isBusy(turn)) return turn;
  const free = KILI_ROTAS.calls.agents.map(([name]) => name).find(name => name !== turn && !isBusy(name));
  return free || turn;
}
