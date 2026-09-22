/* ── Kilimanjaro lead rota ──────────────────────────────────────────────────
   Owner, 22 Sep 2026: ONE queue for every Kilimanjaro lead, whether or not they
   book a call and whether they came from the website or from WhatsApp: Tomer
   Lan 4, Tomer Harush 2, Eldar Solomon 1, a strict repeating cycle ("לן 4 הרוש 2
   אלדר 1", "ותור אחד לכל הקילי", "כולל הווצאפים").

   It replaces the two queues of 14 Sep (calls: Lan 4, Harush 1; everyone else,
   after a 15-minute wait: Harush 3, Eldar 1). Only about a quarter of leads book
   a call in their first 15 minutes, so the queue without Lan took three leads in
   four: 16 of the 54 Kilimanjaro leads of 14-22 Sep were his, while he converts
   about twice as well (22.7% of his June-August leads against 12.3%).

   A lead gets its agent as soon as it lands, like any other destination: the
   webapp's lead-notify on its next minute, or the website's book-slot when the
   customer books a call before that. At a booking, if the one whose turn it is
   already has a call at that hour, the next agent who is free takes it and the
   following lead repays the turn.

   THIS FILE EXISTS TWICE, byte for byte:
     HighAir-webapp/api/_lib/kiliRota.js   (lead-notify)
     HighAir-website/api/_lib/kiliRota.js  (book-slot)
   Both write the same stamps and read the same tally. If they disagree they
   fight over whose turn it is. Change one, copy it to the other.

   WHY A STAMP. Each decision writes {Kili Rota} = "Kili 2026-09: Tomer Lan" on
   the lead, and the tally counts those stamps. Nothing a person fills in is
   counted, and moving a lead by hand later does not shift anyone's turn: the
   stamp records what the rota decided, not who owns the lead today. The month
   in the stamp keeps the tally small: each month starts a fresh cycle. The
   label is new with the single queue, so the stamps of the two old queues
   ("Calls 2026-09", "New lead 2026-09") stay on their leads as history and are
   not counted.
   (An earlier tally read one page of 100 leads and never past it, so from
   21 Aug 2026 every rota decision came out Tomer Lan.) */

export const KILI_ROTA_FIELD = 'Kili Rota';

export const KILI_ROTA = { label: 'Kili', agents: [['Tomer Lan', 4], ['Tomer Harush', 2], ['Eldar Solomon', 1]] };

export function israelMonth(when = new Date()) {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem', year: 'numeric', month: '2-digit' }).formatToParts(when);
  return `${p.find(x => x.type === 'year').value}-${p.find(x => x.type === 'month').value}`;
}

const prefixFor = (when) => `${KILI_ROTA.label} ${israelMonth(when)}:`;

export const kiliRotaStamp = (agent, when = new Date()) => `${prefixFor(when)} ${agent}`;

/* Whose turn it is, given how many decisions each agent already has this month.
   The cycle is laid out in order (L L L L H H E). After n decisions each agent is
   owed as many as the first n+1 places of the cycle give them; the one owed
   most takes it. With no overflow that is exactly the cycle; after an overflow
   the agent who lost a turn is owed one and gets the next. */
export function pickByCycle(counts = {}) {
  const agents = KILI_ROTA.agents;
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

export async function kiliRotaCounts(base, token, when = new Date()) {
  const prefix = prefixFor(when);
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

/* The agent for the next decision. A tally that cannot be read gives the
   queue's first agent, so a lookup failure never leaves a lead unassigned. */
export async function nextKiliAgent(base, token, when = new Date()) {
  try {
    return pickByCycle(await kiliRotaCounts(base, token, when));
  } catch (e) {
    console.error('[kiliRota] tally:', e.message);
    return KILI_ROTA.agents[0][0];
  }
}

/* A booking with the hour taken into account. `isBusy(name)` says whether that
   agent is already on a call at the booked time. The agent whose turn it is
   takes the call when free; otherwise the next agent in the queue who is free.
   When everyone is busy the turn holder keeps it, and the caller logs that. */
export function callsAgentFor(turn, isBusy = () => false) {
  if (!isBusy(turn)) return turn;
  const free = KILI_ROTA.agents.map(([name]) => name).find(name => name !== turn && !isBusy(name));
  return free || turn;
}
