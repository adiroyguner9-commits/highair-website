/* The endpoints that message a lead answer the webapp's server only, which checks
   the staff session first (api/lead-action.js there). Same secret as its push hook.
   CORS is no lock: it stops a browser on another site, not a direct call. */
import crypto from 'crypto';

export function hookAllowed(req) {
  const secret = Buffer.from(process.env.PUSH_HOOK_SECRET || '');
  const given = Buffer.from(String(req.headers?.['x-hook-key'] || ''));
  return secret.length > 0 && given.length === secret.length && crypto.timingSafeEqual(given, secret);
}
