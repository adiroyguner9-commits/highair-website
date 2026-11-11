/* Audit W21 (12 Nov 2026): Hebrew and English left over on the English, German
   and Spanish sites.

   - the schema the pages build in the browser was in Hebrew and on www
   - a full group was "in stock" in that schema
   - a shared magazine post carried the Hebrew title and the www address
   - German and Spanish showed "Last spot left!" / "3 spots left" in English,
     and the 404 page's title
   - the English phone error spoke of an Israeli number */
import { describe, it, expect, vi } from 'vitest';
import fs from 'node:fs';

/* The two things src/i18n.js touches when it loads: the host and the page. */
const els = {};
vi.stubGlobal('window', { location: { hostname: 'localhost' } });
vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} });
vi.stubGlobal('document', {
  documentElement: {},
  head: { appendChild(el) { els[el.id] = el; } },
  getElementById: id => els[id] || null,
  createElement: () => ({ remove() { delete els[this.id]; } }),
});

const { default: i18n } = await import('../src/i18n.js');
const { breadcrumbList, itemList, tourSchema, blogPostSchema, faqPage } = await import('../src/website/usePageMeta.js');
const { BASE_URLS } = await import('../src/website/sites.js');
const { tripEvents, groupIsFull } = await import('../src/website/tripSchema.js');
const { postShare } = await import('../src/data/blogLang.js');
const { EXPS } = await import('../src/data/mockData.js');
const { LEAD_ERROR_EN } = await import('../src/website/formRules.js');

const read = f => fs.readFileSync(f, 'utf8');
const DICT = { de: JSON.parse(read('src/i18n/ui-de.json')), es: JSON.parse(read('src/i18n/ui-es.json')) };
const HEBREW = /[֐-׿]/;
const WWW = 'https://www.highair-expeditions.com';
const SITES = ['he', 'en', 'de', 'es'];
const FOREIGN = ['en', 'de', 'es'];
const on = async lang => { await i18n.changeLanguage(lang); return BASE_URLS[lang]; };

describe('W21: the schema builders write the address of the site the visitor is on', () => {
  it('breadcrumbs and trip lists', async () => {
    for (const lang of SITES) {
      const base = await on(lang);
      const crumbs = breadcrumbList([{ name: 'Home', url: '/' }, { name: 'Kilimanjaro', url: '/expedition/kilimanjaro' }]);
      expect(crumbs.itemListElement.map(x => x.item), lang).toEqual([`${base}/`, `${base}/expedition/kilimanjaro`]);
      const list = itemList([{ name: 'Kilimanjaro', url: '/expedition/kilimanjaro' }, { name: 'Elsewhere', url: 'https://example.com/x' }]);
      expect(list.itemListElement.map(x => x.url), lang).toEqual([`${base}/expedition/kilimanjaro`, 'https://example.com/x']);
    }
  });
  it('a foreign site never names a www page', async () => {
    for (const lang of FOREIGN) {
      await on(lang);
      const trip = tourSchema({ name: 'Kilimanjaro', description: 'd', image: '/images/cards/kilimanjaro.webp', url: '/expedition/kilimanjaro', country: 'Tanzania', priceFrom: 2900, durationDays: 9 });
      const pages = [trip['@id'], trip.url, trip.provider.url, trip.offers.hasMerchantReturnPolicy.merchantReturnLink,
        ...breadcrumbList([{ name: 'a', url: '/' }]).itemListElement.map(x => x.item),
        blogPostSchema({ headline: 'h', url: '/blog/x', datePublished: '2026-01-01' }).mainEntityOfPage];
      for (const u of pages) expect(u.startsWith(BASE_URLS[lang]), `${lang}: ${u}`).toBe(true);
      expect(JSON.stringify({ ...trip, image: '', provider: { ...trip.provider, image: '' } }), lang).not.toContain(WWW);
    }
  });
  it('the trip carries the same @id as that site\'s static page, so the two are one trip', async () => {
    const make = () => tourSchema({ name: 'n', description: 'd', url: '/expedition/aconcagua', priceFrom: 5900 });
    await on('he');
    expect(make()['@id']).toBe(`${WWW}/expedition/aconcagua`);             // the Hebrew shell: the address itself
    for (const lang of FOREIGN) {
      await on(lang);
      expect(make()['@id'], lang).toBe(`${BASE_URLS[lang]}/expedition/aconcagua#trip`);   // en / de / es shells: address + #trip
      expect(make().url, lang).toBe(`${BASE_URLS[lang]}/expedition/aconcagua`);
    }
    const shells = read('scripts/generate-html-shells.mjs');
    expect(shells).toContain("'@id':         expUrl,");
    expect(shells).toContain("'@id': `${enUrl}#trip`,");
    expect(shells).toContain("'@id': `${url}#trip`,");
  });
  it('the Hebrew site is exactly as it was', async () => {
    await on('he');
    const trip = tourSchema({ name: 'קילימנג׳רו', description: 'd', image: '/images/cards/kilimanjaro.webp', url: '/expedition/kilimanjaro', country: 'טנזניה', priceFrom: 2900 });
    expect(trip.url).toBe(`${WWW}/expedition/kilimanjaro`);
    expect(trip.provider.url).toBe(WWW);
    expect(trip.offers.hasMerchantReturnPolicy.merchantReturnLink).toBe(`${WWW}/cancellation`);
    expect(breadcrumbList([{ name: 'בית', url: '/' }]).itemListElement[0].item).toBe(`${WWW}/`);
  });
  it('photos and the logo stay on www on every site, as in the static pages', async () => {
    for (const lang of SITES) {
      await on(lang);
      const trip = tourSchema({ name: 'n', description: 'd', image: '/images/cards/kilimanjaro.webp', url: '/expedition/kilimanjaro' });
      expect(trip.image, lang).toBe(`${WWW}/images/cards/kilimanjaro.webp`);
      expect(trip.provider.image, lang).toBe(`${WWW}/Logo.png`);
    }
    expect(faqPage([{ q: 'q', a: 'a' }]).mainEntity[0].name).toBe('q');
  });
});

describe('W21: the trip page hands the builders its own language', () => {
  const page = read('src/components/web_v2/ExpeditionDetail.jsx');
  it('name, country, description and breadcrumbs are Hebrew only on the Hebrew site', () => {
    expect(page).toContain("const schemaName    = !exp ? '' : isRtl ? `${exp.nameHe}${exp.countryHe ? ' · ' + exp.countryHe : ''}` : (loc(exp, 'name') || exp.name);");
    expect(page).toContain("const schemaCountry = !exp ? '' : isRtl ? (exp.countryHe || exp.country) : (loc(exp, 'country') || exp.country);");
    expect(page).toContain("{ name: isRtl ? 'בית'       : tx('Home'),        url: '/' },");
    expect(page).toContain("{ name: isRtl ? 'משלחות'   : tx('Expeditions'), url: '/#expeditions' },");
    expect(page).toContain("{ name: isRtl ? exp.nameHe : (loc(exp, 'name') || exp.name), url: `/expedition/${exp.slug}` },");
    expect(page).toContain(": (filled(loc(exp, 'seoDescription')) || filled(loc(exp, 'desc')) || ''),");
    /* the old Hebrew-for-everyone lines are gone */
    expect(page).not.toContain("{ name: 'בית',       url: '/' },");
    expect(page).not.toContain('country:       exp.countryHe || exp.country,');
  });
  it('the departures list is built by tripEvents on the site\'s own address', () => {
    expect(page).toContain('const siteUrl = BASE_URLS[currentLang()] || BASE_URLS.he;');
    expect(page).toContain('const events = tripEvents({');
    expect(page).toContain('pageUrl:     `${siteUrl}/expedition/${exp.slug}`,');
    expect(page).not.toContain("organizer:           { '@type': 'TravelAgency', name: 'HighAir Expeditions', url: 'https://www.highair-expeditions.com' }");
    expect(page).not.toContain('const absUrl   = `https://www.highair-expeditions.com/expedition/${exp.slug}`;');
  });
  it('every core trip has a name, a country and a description for each foreign site', async () => {
    const { CORE_TRIPS } = await import('../src/website/sites.js');
    for (const slug of CORE_TRIPS) {
      const e = EXPS.find(x => x.slug === slug);
      for (const S of ['En', 'De', 'Es']) {
        for (const k of ['name', 'seoDescription']) {
          expect(e[k + S], `${slug} ${k}${S}`).toBeTruthy();
          expect(HEBREW.test(e[k + S]), `${slug} ${k}${S}`).toBe(false);
        }
        expect(e['country' + S] || e.country, `${slug} country${S}`).toBeTruthy();
        expect(HEBREW.test(e['country' + S] || e.country), `${slug} country${S}`).toBe(false);
      }
    }
  });
  it('German and Spanish have the two breadcrumb words', () => {
    for (const l of ['de', 'es']) { expect(DICT[l].Home).toBeTruthy(); expect(DICT[l].Expeditions).toBeTruthy(); }
  });
});

describe('W21: a full group is sold out, not in stock', () => {
  const kili = { slug: 'kilimanjaro', img: '/images/cards/kilimanjaro.webp', price: 2900, priceStr: '$2,900', country: 'Tanzania', countryHe: 'טנזניה', groupCapacity: 15 };
  const G = (count, extra = {}) => ({ id: 'rec' + count, departure: '2027-01-21', returnDate: '2027-01-30', count, capacity: 0, ...extra });
  const IN = 'https://schema.org/InStock', OUT = 'https://schema.org/SoldOut';

  it('full by the count, against the group\'s own capacity first and the trip\'s after it', () => {
    expect(groupIsFull(G(14), kili)).toBe(false);
    expect(groupIsFull(G(15), kili)).toBe(true);
    expect(groupIsFull(G(17), kili)).toBe(true);
    expect(groupIsFull(G(15, { capacity: 16 }), kili)).toBe(false);   // the owner opened a seat in Airtable
    expect(groupIsFull(G(16, { capacity: 16 }), kili)).toBe(true);
    expect(groupIsFull(G(15), { ...kili, groupCapacity: undefined })).toBe(true);   // 15 when nothing is set
    expect(groupIsFull(G(0), kili)).toBe(false);
  });
  it('full when its month was closed by hand', () => {
    const closed = { ...kili, soldOutGroups: ['2027-01-05'] };
    expect(groupIsFull(G(2), closed)).toBe(true);
    expect(groupIsFull(G(2, { departure: '2027-02-21' }), closed)).toBe(false);
    expect(groupIsFull(G(2, { departure: '2028-01-21' }), closed)).toBe(false);
  });
  it('the page\'s card and the schema read that one rule', () => {
    const page = read('src/components/web_v2/ExpeditionDetail.jsx');
    expect(page).toContain('const isFull = groupIsFull(g, exp);');
    expect(page).not.toContain("availability: 'https://schema.org/InStock'");
  });
  it('each departure says so in its offer', () => {
    const events = tripEvents({
      exp: kili, groups: [G(15), G(3, { id: 'recOpen', departure: '2027-02-18', returnDate: '2027-02-27' })],
      name: 'Kilimanjaro', description: 'Climb Kilimanjaro', place: 'Tanzania',
      pageUrl: 'https://en.highair-expeditions.com/expedition/kilimanjaro', siteUrl: 'https://en.highair-expeditions.com', today: '2026-11-12',
    });
    expect(events.map(e => e.offers.availability)).toEqual([OUT, IN]);
    expect(events.map(e => [e.startDate, e.endDate])).toEqual([['2027-01-21', '2027-01-30'], ['2027-02-18', '2027-02-27']]);
    expect(events[0].offers).toEqual({ '@type': 'Offer', price: 2900, priceCurrency: 'USD', availability: OUT, url: 'https://en.highair-expeditions.com/expedition/kilimanjaro', validFrom: '2026-11-12' });
  });
  it('the list is in the page\'s words and on the page\'s site', () => {
    for (const lang of FOREIGN) {
      const site = BASE_URLS[lang];
      const [e] = tripEvents({ exp: kili, groups: [G(3)], name: 'Kilimandscharo', description: 'Besteigung', place: 'Tansania', pageUrl: `${site}/expedition/kilimanjaro`, siteUrl: site, today: '2026-11-12' });
      expect(e.name).toBe('Kilimandscharo');
      expect(e.location.name).toBe('Tansania');
      expect(e.url).toBe(`${site}/expedition/kilimanjaro`);
      expect(e.organizer.url).toBe(site);
      expect(e.offers.url).toBe(`${site}/expedition/kilimanjaro`);
      expect(HEBREW.test(JSON.stringify(e)), lang).toBe(false);
      expect(JSON.stringify({ ...e, image: '' })).not.toContain(WWW);
      expect(e.image).toBe(`${WWW}/images/cards/kilimanjaro.webp`);
    }
  });
  it('a euro trip is priced in euros, a trip with no price has no offer, twenty departures at most', () => {
    const [eur] = tripEvents({ exp: { ...kili, priceStr: '€1,290', price: 1290 }, groups: [G(1)], name: 'n', description: 'd', place: 'p', pageUrl: 'u', siteUrl: 's', today: 't' });
    expect(eur.offers.priceCurrency).toBe('EUR');
    const [none] = tripEvents({ exp: { ...kili, price: 0 }, groups: [G(1)], name: 'n', description: 'd', place: 'p', pageUrl: 'u', siteUrl: 's', today: 't' });
    expect(none.offers).toBeUndefined();
    expect(tripEvents({ exp: kili, groups: Array.from({ length: 30 }, (_, i) => G(i % 5)), name: 'n', description: 'd', place: 'p', pageUrl: 'u', siteUrl: 's', today: 't' })).toHaveLength(20);
    expect(tripEvents({ exp: kili, groups: [], name: 'n', description: 'd', place: 'p', pageUrl: 'u', siteUrl: 's', today: 't' })).toEqual([]);
  });
});

describe('W21: sharing a magazine post', () => {
  const post = { slug: 'kazbek-climbing-guide', title: 'טיפוס לקזבק', titleEn: 'Climbing Kazbek', titleDe: 'Kasbek besteigen', titleEs: 'Subir al Kazbek' };
  it('sends the title in the site\'s language and the address of that site', () => {
    expect(postShare(post, 'he')).toEqual({ title: 'טיפוס לקזבק', url: `${WWW}/blog/kazbek-climbing-guide` });
    expect(postShare(post, 'en')).toEqual({ title: 'Climbing Kazbek', url: 'https://en.highair-expeditions.com/blog/kazbek-climbing-guide' });
    expect(postShare(post, 'de')).toEqual({ title: 'Kasbek besteigen', url: 'https://de.highair-expeditions.com/blog/kazbek-climbing-guide' });
    expect(postShare(post, 'es')).toEqual({ title: 'Subir al Kazbek', url: 'https://es.highair-expeditions.com/blog/kazbek-climbing-guide' });
  });
  it('a post with no German title shares its English one, never the Hebrew', () => {
    expect(postShare({ slug: 's', title: 'עברית', titleEn: 'English' }, 'de').title).toBe('English');
  });
  it('the three share buttons use it', () => {
    const page = read('src/components/web_v2/BlogPost.jsx');
    expect(page).toContain('const { title: shareTitle, url: pageUrl } = postShare(post, lang);');
    expect(page).toContain('encodeURIComponent(`${shareTitle}\\n${pageUrl}?utm_source=whatsapp&utm_medium=social&utm_campaign=blog`)');
    expect(page).not.toContain('const pageUrl     = `https://www.highair-expeditions.com/blog/${post.slug}`;');
    expect(page).not.toContain('encodeURIComponent(`${post.title}');
  });
});

describe('W21: words German and Spanish got in English', () => {
  it('the seats badge on a trip page goes through the dictionary', () => {
    const page = read('src/components/web_v2/ExpeditionDetail.jsx');
    expect(page).toContain('(spotsLeft === 1 ? tx("Last spot left!") : tx("{0} spots left", [spotsLeft]))');
    expect(page).not.toContain("'Last spot left!'");
    expect(page).not.toContain('`${spotsLeft} spots left`');
  });
  it('the 404 page\'s title and description go through it too', () => {
    const page = read('src/components/web_v2/NotFound404.jsx');
    expect(page).toContain("tx('404 - Page Not Found | HighAir Expeditions')");
    expect(page).toContain("tx('The page you were looking for does not exist.')");
  });
  it('both languages have the new lines, and they are not the English ones', () => {
    for (const l of ['de', 'es']) {
      for (const k of ['Last spot left!', '{0} spots left', '404 - Page Not Found | HighAir Expeditions', 'The page you were looking for does not exist.']) {
        expect(DICT[l][k], `${l}: ${k}`).toBeTruthy();
        expect(DICT[l][k], `${l}: ${k}`).not.toBe(k);
        expect(DICT[l][k], `${l}: ${k}`).not.toMatch(/[—–]/);
      }
    }
  });
});

describe('W21: the English phone error no longer speaks of an Israeli number', () => {
  const NEW = 'Invalid phone number. Please enter your number with the country code.';
  it('the contact page and the call booking page say the new sentence', () => {
    for (const f of ['src/components/web_v2/ContactPage.jsx', 'src/components/web_v2/BookCall.jsx']) {
      const src = read(f);
      expect(src, f).toContain(`"${NEW}"`);
      /* no English sentence on these pages names Israel, 050 or 03 numbers */
      const english = [...src.matchAll(/tx\(\s*"([^"]+)"/g)].map(m => m[1]);
      expect(english.filter(s => /Israel|050-|03-/.test(s)), f).toEqual([]);
    }
  });
  it('German and Spanish keep their sentence under the new key, and the old key is gone', () => {
    for (const l of ['de', 'es']) {
      expect(DICT[l][NEW], l).toBeTruthy();
      expect(Object.keys(DICT[l]).filter(k => /Israeli mobile/.test(k)), l).toEqual([]);
    }
    expect(DICT.de[NEW]).toBe('Ungültige Telefonnummer. Bitte geben Sie Ihre Nummer mit Ländervorwahl ein.');
    expect(DICT.es[NEW]).toBe('Número de teléfono no válido. Escribe tu número con el prefijo del país.');
  });
  it('the other English phone lines never did', () => {
    expect(LEAD_ERROR_EN.phone).not.toMatch(/Israel/);
    expect(i18n.getResource('en', 'translation', 'cta.phoneError')).not.toMatch(/Israel/);
  });
});
