/* tripSchema.js: what a trip page tells search engines about its departures
   (audit W21, 12 Nov 2026).

   The list was built inside the trip page, in Hebrew and with www addresses on
   every site, and it marked every departure as available, a full group
   included. Here it is a plain function with no imports: the page hands in the
   texts in its own language and its own address, and each departure says
   whether a seat is left. tests/audit-w21-foreign-sites.test.js runs it. */

/* Photos are served from www on every site, as in the static pages. */
const IMAGE_BASE = 'https://www.highair-expeditions.com';

/* A departure with no seat left: by the count against the group's capacity
   (Airtable {Capacity} first, the trip's own number after it), or closed by
   hand for its month (exp.soldOutGroups). The one rule for the card on the
   page and for the schema, so the two cannot disagree. */
export function groupIsFull(g, exp) {
  const capacity = g?.capacity || exp?.groupCapacity || 15;
  if (capacity - (g?.count || 0) <= 0) return true;
  const ym = s => { const d = new Date(s); return `${d.getUTCFullYear()}-${d.getUTCMonth()}`; };
  return (exp?.soldOutGroups || []).some(m => ym(m) === ym(g?.departure));
}

/* How many departures a list of group rows holds. A trip sold in two lengths
   (Kilimanjaro with and without the safari, Ethiopia with and without the
   tribes) keeps two rows for one departure: the same Group Name and the same
   date, a different Event. The month tabs on the trip page counted rows, so
   three departures in January read "6" (owner, 14 Nov 2026). Two groups that
   leave on one date under two names (a women's group, a second guided group)
   are two departures, as the page lists them. */
export function departureCount(groups) {
  return new Set((groups || []).map(g => `${String(g?.departure || '').slice(0, 10)}|${g?.groupName || g?.id || ''}`)).size;
}

/* One Event per upcoming departure, twenty at most.
   name, description, place: the page's own words, in the site's language
   pageUrl, siteUrl: the trip's address and the home address on this site
   today: 'YYYY-MM-DD' */
export function tripEvents({ exp, groups, name, description, place, pageUrl, siteUrl, today }) {
  const currency = String(exp?.priceStr || '').startsWith('€') ? 'EUR' : 'USD';
  return (groups || []).slice(0, 20).map(g => ({
    '@type':             'Event',
    name,
    description,
    startDate:           g.departure,
    endDate:             g.returnDate || g.departure,
    eventStatus:         'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    image:               exp.img ? `${IMAGE_BASE}${exp.img}` : undefined,
    url:                 pageUrl,
    location:            { '@type': 'Place', name: place || 'HighAir Expeditions', address: { '@type': 'PostalAddress', addressCountry: exp.country || exp.countryHe || 'IL' } },
    organizer:           { '@type': 'TravelAgency', name: 'HighAir Expeditions', url: siteUrl },
    performer:           { '@type': 'Organization', name: 'HighAir Expeditions' },
    ...(exp.price > 0 ? { offers: {
      '@type': 'Offer', price: exp.price, priceCurrency: currency,
      availability: groupIsFull(g, exp) ? 'https://schema.org/SoldOut' : 'https://schema.org/InStock',
      url: pageUrl, validFrom: today,
    } } : {}),
  }));
}
