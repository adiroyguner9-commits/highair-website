/**
 * The answer for a file under /assets, /images or /videos that this deployment does not have.
 *
 * Those folders carry a long browser cache (vercel.json: a year for the hashed build files, a
 * day for photos), and a header rule covers every answer under its path, the 404 as well. So a
 * browser that asked for a chunk during the minute it did not exist kept "not found" for a year,
 * and the same chunk coming back in a later build stayed broken for that visitor: the mechanism
 * of the 23 Oct 2026 outage (audit, 11 Nov 2026).
 *
 * vercel.json rewrites run only when no real file matched, so a real file never reaches this
 * function and keeps its long cache. A Cache-Control header set by a function wins over the one
 * from vercel.json, so the 404 below is never stored anywhere.
 */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.status(404).send('Not found');
}
