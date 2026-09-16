/**
 * validate-structured-data.mjs
 * Post-build guard: scans every generated index.html under dist/ for JSON-LD
 * structured-data problems that Google Search Console flags, so a bug like the
 * `trip.nameHe`-instead-of-`trip.name` slip (which shipped "undefined" into
 * Event / BreadcrumbList / ItemList / TouristTrip names) is caught BEFORE deploy
 * rather than by a Search Console email days later.
 *
 * Runs automatically after generate-html-shells.mjs (see the "postbuild" script).
 * CRITICAL issues (missing required names, a literal "undefined" in any value,
 * an Event missing startDate/location) exit non-zero and fail the build.
 * RECOMMENDED-field gaps (Event description/performer) only warn.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(path.resolve(__dirname, '..'), 'dist');

function walk(dir) {
  let out = [];
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) out = out.concat(walk(p));
    else if (f === 'index.html') out.push(p);
  }
  return out;
}

const critical = [];
const warnings = [];

const files = fs.existsSync(DIST) ? walk(DIST) : [];
for (const file of files) {
  const rel = file.replace(DIST + '/', '');
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(m => m[1]);

  for (const raw of scripts) {
    let json;
    try { json = JSON.parse(raw); }
    catch { critical.push([rel, 'JSON-LD parse error']); continue; }

    const nodes = json['@graph'] || (Array.isArray(json) ? json : [json]);
    for (const n of nodes) {
      const type = Array.isArray(n['@type']) ? n['@type'].join('+') : n['@type'];

      // A literal "undefined" anywhere means a data field referenced the wrong key.
      if (/"[^"]*undefined[^"]*"/.test(JSON.stringify(n))) critical.push([rel, `${type}: a value contains "undefined"`]);

      if (type === 'BreadcrumbList') {
        for (const li of n.itemListElement || []) if (!li.name) critical.push([rel, 'BreadcrumbList item missing name']);
      }
      if (type === 'ItemList') {
        for (const li of n.itemListElement || []) if (!li.name) critical.push([rel, 'ItemList item missing name']);
      }
      if (type === 'Event') {
        if (!n.name)                       critical.push([rel, 'Event missing name']);
        if (!n.startDate)                  critical.push([rel, 'Event missing startDate']);
        if (!n.location || !n.location.name) critical.push([rel, 'Event missing location.name']);
        if (!n.description)                warnings.push([rel, 'Event missing description (recommended)']);
        if (!n.performer)                  warnings.push([rel, 'Event missing performer (recommended)']);
      }
    }
  }
}

if (warnings.length) {
  const counts = warnings.reduce((a, [, m]) => (a[m] = (a[m] || 0) + 1, a), {});
  console.log('Structured-data warnings (non-blocking):');
  for (const [m, c] of Object.entries(counts)) console.log(`  ~ ${m} ×${c}`);
}

if (critical.length) {
  console.error(`\n❌ Structured-data validation FAILED: ${critical.length} critical issue(s) across ${files.length} pages`);
  const counts = critical.reduce((a, [, m]) => (a[m] = (a[m] || 0) + 1, a), {});
  for (const [m, c] of Object.entries(counts)) console.error(`  ✗ ${m} ×${c}`);
  console.error('  Examples:');
  critical.slice(0, 8).forEach(([f, m]) => console.error(`    ${f} -> ${m}`));
  console.error('  Fix the data before deploying (these are what Google Search Console emails about).');
  process.exit(1);
}

console.log(`✅ Structured data valid across ${files.length} built pages`);
