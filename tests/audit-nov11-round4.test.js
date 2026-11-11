/* The 11 Nov 2026 audit, the round on the website after the first two:
   W8   a call from months ago kept a new enquiry from being offered a call
   W32  photos and fonts were re-checked on every view; a missing build file was kept for a year
   W33  a guide downloaded every photo in full with the page
   W34  every page decoded a 2000px logo for a 72px circle */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

process.env.AIRTABLE_BASE = process.env.AIRTABLE_BASE || 'appTEST';
process.env.AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN || 'tok';

const { upcomingCallFor } = await import('../api/lead-messaging.js');
const { tripKey } = await import('../api/_lib/active-lead.js');
const { default: assetMissing } = await import('../api/asset-missing.js');
const { srcSetOf, smallOf, LOGO_SRC } = await import('../src/website/imageVariants.js');
const VARIANTS = JSON.parse(fs.readFileSync('src/website/imageVariants.json', 'utf8'));
const GALLERY = JSON.parse(fs.readFileSync('src/website/galleryManifest.json', 'utf8'));
const VERCEL = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const read = f => fs.readFileSync(f, 'utf8');

describe('W8: only a call still ahead holds back the offer of a call', () => {
  const kili = tripKey('Kilimanjaro');
  const today = '2026-11-11';
  const call = over => ({ Expedition: 'Kilimanjaro', Date: '2026-11-20', Status: 'Confirmed', ...over });

  it('the trip key exists, or every case below would pass for the wrong reason', () => {
    expect(kili).toBeTruthy();
    expect(tripKey('Everest Base Camp')).not.toBe(kili);
  });
  it('a confirmed call later this month counts', () => {
    expect(upcomingCallFor(call(), kili, today)).toBe(true);
  });
  it('a call today still counts', () => {
    expect(upcomingCallFor(call({ Date: today }), kili, today)).toBe(true);
  });
  it('a call from the spring does not', () => {
    expect(upcomingCallFor(call({ Date: '2026-04-02' }), kili, today)).toBe(false);
    expect(upcomingCallFor(call({ Date: '2026-11-10' }), kili, today)).toBe(false);
  });
  it('a cancelled or finished call does not, whatever its date', () => {
    for (const Status of ['Cancelled', 'Completed', 'No Show', '', undefined]) {
      expect(upcomingCallFor(call({ Status }), kili, today), String(Status)).toBe(false);
    }
  });
  it('a call for another trip does not', () => {
    expect(upcomingCallFor(call({ Expedition: 'Everest Base Camp' }), kili, today)).toBe(false);
  });
  it('a row with no readable date does not', () => {
    for (const Date of ['', undefined, 'soon', '20/11/2026']) {
      expect(upcomingCallFor(call({ Date }), kili, today), String(Date)).toBe(false);
    }
    expect(upcomingCallFor(null, kili, today)).toBe(false);
  });
  it('a full timestamp is read by its day', () => {
    expect(upcomingCallFor(call({ Date: '2026-11-20T08:30:00.000Z' }), kili, today)).toBe(true);
  });
  it('the cron asks Airtable for the date and the status, and uses the rule', () => {
    const src = read('api/lead-messaging.js');
    expect(src).toMatch(/\['Expedition', 'Date', 'Status'\]/);
    expect(src).toMatch(/upcomingCallFor\(a\.fields, want, israelNow\(\)\.ymd\)/);
  });
});

describe('W32: what a browser may keep, and for how long', () => {
  const cacheOf = source => VERCEL.headers.find(h => h.source === source)?.headers.find(x => x.key === 'Cache-Control')?.value;

  it('photos are kept for a day and refreshed in the background for a week', () => {
    expect(cacheOf('/images/(.*)')).toBe('public, max-age=86400, stale-while-revalidate=604800');
  });
  it('photos are never marked immutable: their names are not hashed, so a replaced photo must arrive', () => {
    expect(cacheOf('/images/(.*)')).not.toMatch(/immutable/);
    expect(cacheOf('/([^/]+)\\.(woff2|ttf|otf)')).not.toMatch(/immutable/);
  });
  it('fonts are kept for a month', () => {
    expect(cacheOf('/([^/]+)\\.(woff2|ttf|otf)')).toMatch(/^public, max-age=2592000/);
  });
  it('the font rule matches the font files at the site root, and nothing in a folder', () => {
    const re = /^\/([^/]+)\.(woff2|ttf|otf)$/;
    const fonts = fs.readdirSync('public').filter(f => /\.(woff2|ttf|otf)$/.test(f));
    expect(fonts.length).toBeGreaterThan(5);
    for (const f of fonts) expect(re.test('/' + f), f).toBe(true);
    expect(re.test('/assets/font-abc123.woff2')).toBe(false);
    expect(re.test('/index.html')).toBe(false);
  });
  it('the hashed build files keep their year', () => {
    expect(cacheOf('/assets/(.*)')).toBe('public, max-age=31536000, immutable');
  });
  it('a missing file under a cached folder goes to the function that answers "not found, do not keep"', () => {
    const last = VERCEL.rewrites[VERCEL.rewrites.length - 1];
    expect(last).toEqual({ source: '/(assets|images|videos)/:path*', destination: '/api/asset-missing' });
  });
  it('that function answers 404 and no-store', () => {
    const headers = {}; let status = 0, body;
    const res = { setHeader(k, v) { headers[k] = v; return this; }, status(s) { status = s; return this; }, send(b) { body = b; return this; } };
    assetMissing({ method: 'GET', url: '/assets/index-OLDHASH.js' }, res);
    expect(status).toBe(404);
    expect(headers['Cache-Control']).toBe('no-store');
    expect(body).toBe('Not found');
  });
  it('no page or API path is caught by the missing-file rewrite', () => {
    const re = /^\/(assets|images|videos)\/.*/;
    for (const p of ['/', '/blog', '/expedition/kilimanjaro', '/api/slots', '/book', '/Logo.png', '/sitemap.xml']) expect(re.test(p), p).toBe(false);
    for (const p of ['/assets/x.js', '/images/cards/a.webp', '/videos/hero.mp4']) expect(re.test(p), p).toBe(true);
  });
});

describe('W33: the photos inside a post', () => {
  const post = read('src/components/web_v2/BlogPost.jsx');

  it('the blurred fill waits until the photo is near, and takes the lighter copy', () => {
    expect(post).toMatch(/const \[ref, near\] = useNearView\(\)/);
    expect(post).toMatch(/\{near && \(/);
    expect(post).toContain('backgroundImage:    `url(${smallOf(block.src)})`');
    expect(post).not.toContain('backgroundImage:    `url(${block.src})`');
  });
  it('the photo offers the lighter copy and stays lazy', () => {
    expect(post).toMatch(/srcSet=\{srcSet\}/);
    expect(post).toMatch(/<img\s+loading="lazy"\s+src=\{block\.src\}/);   // lazy BEFORE the address (round 5: the order decides)
    expect(post).toContain('decoding="async"');
  });
  it('the related posts at the foot of the page take the lighter cover, once the reader is near', () => {
    expect(post).toContain('<RelatedCover post={p} />');
    expect(post).toContain("? `url(${smallOf(post.img)}) ${post.imgPosition || 'center'}/cover no-repeat`");
    expect(post).not.toContain('`url(${p.img}) ');
  });
  it('`sizes` is never narrower than the column, so the photo keeps the size it had', () => {
    expect(post).toContain("sizes={srcSet ? '(max-width: 768px) 100vw, 960px' : undefined}");
    expect(post).toMatch(/maxWidth: '960px'/);
  });
  it('a trip-gallery photo used in a post points at its grid copy', async () => {
    const { POSTS } = await import('../src/data/blogData.js');
    const grid = Object.fromEntries(Object.values(GALLERY).flat().map(x => [x.src, x]));
    const inPost = new Set();
    for (const p of POSTS) for (const b of [...(p.content || []), ...(p.contentEn || [])]) if (b.type === 'image' && String(b.src || '').startsWith('/images/gallery/')) inPost.add(b.src);
    expect(inPost.size).toBeGreaterThan(30);
    let withCopy = 0;
    for (const src of inPost) {
      const g = grid[src];
      if (!g || g.thumb === src) continue;   // already small: the file itself is the copy
      expect(VARIANTS[src], `${src}: run node scripts/gen-image-variants.mjs`).toBeTruthy();
      expect(VARIANTS[src].s).toBe(g.thumb);
      expect(srcSetOf(src)).toBe(`${g.thumb} ${VARIANTS[src].sw}w, ${src} ${g.w}w`);
      withCopy++;
    }
    expect(withCopy).toBeGreaterThan(30);
  });
  it('every lighter copy is a real file, lighter than its original', () => {
    for (const [src, v] of Object.entries(VARIANTS)) {
      const full = fs.statSync(path.join('public', src)).size, small = fs.statSync(path.join('public', v.s)).size;
      expect(small, `${v.s} vs ${src}`).toBeLessThan(full);
    }
  });
});

describe('W34: the logo', () => {
  it('the pages show the 256px copy', () => {
    expect(LOGO_SRC).toBe('/images/logo-256.webp');
    expect(smallOf('/Logo.png')).toBe(LOGO_SRC);
    expect(fs.statSync('public' + LOGO_SRC).size).toBeLessThan(20 * 1024);
  });
  it('no component loads the 2000px file as a picture', () => {
    for (const f of fs.readdirSync('src/components/web_v2').filter(x => x.endsWith('.jsx'))) {
      expect(read(`src/components/web_v2/${f}`), f).not.toMatch(/src="\/Logo\.png"/);
    }
  });
  it('the full file stays for search engines and for links to it', () => {
    expect(fs.existsSync('public/Logo.png')).toBe(true);
    expect(read('src/website/usePageMeta.js')).toContain("BASE_URL + '/Logo.png'");
  });
});
