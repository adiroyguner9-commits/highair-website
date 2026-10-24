/* indexnow.mjs: tell Bing (and the other IndexNow engines: Yandex, Seznam,
   Naver) that pages changed, so they recrawl now instead of whenever.
   Bing feeds ChatGPT search and Copilot, which cite us (Bing Webmaster Tools,
   AI Performance: 25 citations in 3 months as of 24 Oct 2026).

   Usage, after a production deploy is live:
     node scripts/indexnow.mjs                 every URL in the live sitemap
     node scripts/indexnow.mjs /blog/<slug> ...  just these paths

   The key file public/9ba1bc2d918fb754d6226c60ef627381.txt proves we own the host; it must stay. */
const HOST = 'www.highair-expeditions.com';
const KEY  = '9ba1bc2d918fb754d6226c60ef627381';

const paths = process.argv.slice(2);
let urls;
if (paths.length) {
  urls = paths.map(p => `https://${HOST}${p.startsWith('/') ? p : '/' + p}`);
} else {
  const xml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
  urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}
if (!urls.length) { console.error('No URLs to submit'); process.exit(1); }

const r = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
});
console.log(`IndexNow: ${r.status} ${r.statusText} for ${urls.length} URL(s)`);
if (r.status >= 300) { console.error(await r.text()); process.exit(1); }
