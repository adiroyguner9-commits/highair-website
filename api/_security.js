/**
 * _security.js — Shared security helpers for all API endpoints
 * - HTML escaping (XSS prevention in emails)
 * - Input validation & sanitisation
 * - Rate limiting (in-memory, per serverless instance — best-effort)
 * - CORS headers
 */

/* ── HTML escape ─────────────────────────────────────────────────────── */
export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#x27;');
}

/* ── Field length limits ─────────────────────────────────────────────── */
const FIELD_LIMITS = {
  Name:            100,
  Phone:            25,
  Email:           255,
  Message:        5000,
  Expedition:      200,
  'Preferred Month': 50,
  Age:              10,
  'Group Size':     10,
  Experience:      500,
  Source:           50,
  date:             10,   // YYYY-MM-DD
  time:              5,   // HH:MM
};

/**
 * Truncates any string field that exceeds its limit.
 * Returns the sanitised object.
 */
export function sanitiseFields(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (typeof v === 'string') {
      const limit = FIELD_LIMITS[k] ?? 1000;
      out[k] = v.slice(0, limit).trim();
    } else {
      out[k] = v;
    }
  }
  return out;
}

/* ── Validators ──────────────────────────────────────────────────────── */
export function isValidDate(s) {
  return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export function isValidTime(s) {
  return typeof s === 'string' && /^\d{2}:\d{2}$/.test(s);
}

export function isValidEmail(s) {
  return typeof s === 'string' && /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/.test(s);
}

export function isValidPhone(s) {
  if (typeof s !== 'string') return false;
  const digits = s.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function isValidName(s) {
  return typeof s === 'string' && s.trim().length >= 2 && s.trim().length <= 100;
}

/* ── In-memory rate limiter ──────────────────────────────────────────── */
// NOTE: Per-serverless-instance only. For global rate limiting, migrate to
// Vercel KV / Upstash. The current implementation is best-effort.
//
// IP detection — important: clients can forge `X-Forwarded-For`. Vercel's
// edge sets `x-vercel-forwarded-for` (not client-spoofable) and ALSO appends
// the real client IP to the END of `x-forwarded-for`. We must therefore
// either trust the Vercel-only header, or take the LAST entry of XFF.
// Reading the FIRST entry of XFF (the previous behaviour) lets attackers
// rotate IPs by sending arbitrary `X-Forwarded-For: ...` values.
const _store = new Map(); // ip → [timestamps]

const RATE_LIMITS = {
  default:      { max: 30, windowMs: 60_000  },   // 30 req/min
  'submit-lead':{ max:  5, windowMs: 300_000 },   // 5 submissions per 5 min
  'book-slot':  { max:  5, windowMs: 300_000 },   // 5 bookings per 5 min
};

function clientIp(req) {
  const v = req.headers['x-vercel-forwarded-for'];
  if (v) return String(v).split(',')[0].trim();
  const xff = req.headers['x-forwarded-for'];
  if (xff) {
    const parts = String(xff).split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1]; // LAST entry — Vercel appends real IP
  }
  return req.socket?.remoteAddress || 'unknown';
}

export function checkRateLimit(req, endpointKey = 'default') {
  const ip = clientIp(req);
  const key    = `${endpointKey}:${ip}`;
  const limit  = RATE_LIMITS[endpointKey] ?? RATE_LIMITS.default;
  const now    = Date.now();
  const window = limit.windowMs;

  const timestamps = (_store.get(key) || []).filter(t => now - t < window);
  timestamps.push(now);
  _store.set(key, timestamps);

  if (_store.size > 500) {
    for (const [k, ts] of _store) {
      if (ts.every(t => now - t > window)) _store.delete(k);
    }
  }

  return timestamps.length <= limit.max;
}

/* ── Airtable formula string escaper — defence in depth ──────────────── */
export function escFml(s) {
  return String(s ?? '').replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

/* ── CORS & security headers ─────────────────────────────────────────── */
const ALLOWED_ORIGINS = new Set([
  'https://highair-expeditions.com',
  'https://www.highair-expeditions.com',
  'https://en.highair-expeditions.com',
  'https://highair-website.vercel.app',
]);

export function setSecurityHeaders(req, res) {
  const origin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else if (process.env.NODE_ENV !== 'production') {
    // Allow localhost in dev
    res.setHeader('Access-Control-Allow-Origin', origin || '*');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
}
