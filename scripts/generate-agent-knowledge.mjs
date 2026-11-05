/* The email sales agent's knowledge sheet (5 Nov 2026).
 *
 * The agent that answers leads from the English, German and Spanish sites runs
 * in the HighAir app, but everything it may say about a trip is on this site.
 * This writes that, and only that, to public/agent-knowledge.json on every
 * build, so the agent can never quote a price, an inclusion or a policy the
 * site does not show. Dates are NOT here: the app reads the international
 * groups live from Airtable (airtableEventsEn names them).
 *
 * Everything in the file is already public on the site. */
import { writeFileSync } from 'node:fs';
import { EXPS } from '../src/data/mockData.js';
import { FAQ_BY_SLUG } from '../src/data/faqData.js';
import { CORE_TRIPS, BASE_URLS } from '../src/website/sites.js';

const pick = (e, k) => ({ en: e[k + 'En'] || '', de: e[k + 'De'] || e[k + 'En'] || '', es: e[k + 'Es'] || e[k + 'En'] || '' });

const trips = CORE_TRIPS.map(slug => {
  const e = EXPS.find(x => x.slug === slug);
  if (!e) throw new Error(`agent knowledge: no trip ${slug}`);
  return {
    slug,
    name: pick(e, 'name'),
    country: pick(e, 'country'),
    days: pick(e, 'days'),
    summit: e.elev || '',
    priceFromUsd: e.price || null,
    successRate: e.successRate || null,
    groupCapacity: e.groupCapacity || null,
    bestSeasons: e.seasonsEn || [],
    description: e.descEn || '',
    highlights: e.highlightsEn || [],
    included: (e.includedEn || []).filter(Boolean),
    notIncluded: (e.notIncludedEn || []).filter(Boolean),
    goodToKnow: e.importantToNoteEn || [],
    itinerary: (e.itineraryEn || []).map(d => ({ day: d.day, title: d.title, stay: d.accommodation || '' })),
    safariItinerary: (e.safariItineraryEn || []).map(d => ({ day: d.day, title: d.title })),
    internationalGroups: e.airtableEventsEn || [],
    faq: (FAQ_BY_SLUG[slug]?.en || []).map(f => ({ q: f.q, a: f.a })),
    url: Object.fromEntries(['en', 'de', 'es'].map(l => [l, `${BASE_URLS[l]}/expedition/${slug}`])),
  };
});

/* Word for word what the English Terms (sections 8 and 9) and the Cancellation
   Policy say. Change them there first, then here. */
const policies = {
  payment: 'A deposit secures your place in the group. An additional payment is due 45 days before departure, and the balance is paid to the local supplier on arrival at the destination, by bank transfer to the account details a HighAir representative provides. Paying by credit card adds a 2% processing fee.',
  cancellation: 'Cancellation is by written notice by email. An order cancelled within 14 days of placing it, and not within 7 business days of departure, has no cancellation fee. Otherwise: 60 days or more before departure, the deposit is refunded minus 15% of the total trip cost; 1–59 days before departure, the deposit is not refunded. You may always keep your deposit as credit for a future trip, with no cancellation fee.',
  cancelledByHighAir: 'If a trip is cancelled by force majeure, it is moved to another date and all payments carry over in full to the new date or another destination of your choice. If HighAir cancels for any other reason, the deposit is refunded in full.',
  language: 'International groups run in English, led by our local guides, with climbers from around the world.',
};

const company = {
  name: 'HighAir Expeditions',
  whatsapp: '+972 55-563-6975',
  email: 'team@highair-expeditions.com',
  charity: 'Part of every expedition supports cancer patients.',
};

writeFileSync('public/agent-knowledge.json', JSON.stringify({ generated: new Date().toISOString().slice(0, 10), company, policies, trips }, null, 1));
console.log(`✅ agent knowledge: ${trips.length} trips, ${trips.filter(t => t.internationalGroups.length).length} with international groups`);
