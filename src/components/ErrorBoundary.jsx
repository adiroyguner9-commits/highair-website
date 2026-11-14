import { Component } from 'react';
import * as Sentry from '@sentry/react';
import { langForHost } from '../website/sites.js';

/* The error screen, in the site's own language. German and Spanish visitors
   saw it in English (owner, 14 Nov 2026). The texts are written here in full
   and not read from the translation files: this screen is what shows when
   something else did not load. German says Sie and Spanish says tú, as the
   rest of each site does. */
export const ERROR_SCREEN = {
  he: { title: 'אופס - משהו השתבש', line1: 'נתקלנו בשגיאה בלתי צפויה', line2: 'אפשר לנסות לחזור לדף הבית ולהמשיך משם', home: 'חזרה לדף הבית' },
  en: { title: 'Oops - something went wrong', line1: 'We encountered an unexpected error', line2: 'You can try returning to the homepage and continuing from there', home: 'Back to Home' },
  de: { title: 'Hoppla, etwas ist schiefgelaufen', line1: 'Es ist ein unerwarteter Fehler aufgetreten', line2: 'Sie können zur Startseite zurückkehren und von dort aus weitermachen', home: 'Zur Startseite' },
  es: { title: 'Vaya, algo ha fallado', line1: 'Se ha producido un error inesperado', line2: 'Puedes volver a la página de inicio y continuar desde allí', home: 'Volver al inicio' },
};
/* Which of them: the site's address decides (en. / de. / es., and www is
   Hebrew), the rule the whole site follows (sites.js). A preview or a local
   address has no language of its own, so there the page's own language counts. */
export function errorScreenLang(host, pageLang) {
  const lang = langForHost(host, String(pageLang || '').slice(0, 2).toLowerCase());
  return ERROR_SCREEN[lang] ? lang : 'he';
}

/* Chunk-error recovery, at most once per 30 seconds per tab. A chunk that is
   still broken after that shows the error screen instead of reloading forever.
   23 Oct 2026: a deploy-time race cached the HTML page under a chunk URL with
   the one-year immutable header, and the old unconditional reload looped. */
const RECOVERY_KEY = 'ha_chunk_recovery_at';
const RECOVERY_WINDOW_MS = 30000;
let recoveryStarted = false; // this page load is already refreshing + reloading

function claimRecovery() {
  try {
    const last = Number(sessionStorage.getItem(RECOVERY_KEY)) || 0;
    if (Date.now() - last < RECOVERY_WINDOW_MS) return false;
    sessionStorage.setItem(RECOVERY_KEY, String(Date.now()));
    return true;
  } catch (_) {
    return false; // no storage: never risk a reload loop
  }
}

/* /assets/ files are cached for a year as immutable, so a bad copy would
   survive a plain reload. Re-fetch every asset this page touched (plus the URL
   named in the error), bypassing the cache, then reload onto fresh copies. */
function refreshAssetsAndReload(error) {
  const urls = new Set(
    performance.getEntriesByType('resource')
      .map(e => e.name)
      .filter(u => u.startsWith(`${window.location.origin}/assets/`)),
  );
  for (const m of String(error?.message || '').matchAll(/https?:\/\/\S+?\/assets\/\S+?\.(?:js|css)/g)) urls.add(m[0]);
  const refresh = Promise.allSettled([...urls].map(u => fetch(u, { cache: 'reload' })));
  const timeout = new Promise(resolve => setTimeout(resolve, 4000));
  Promise.race([refresh, timeout]).finally(() => window.location.reload());
}

/* A page left open across a deploy asks for chunks that no longer exist. */
export function isChunkError(error) {
  const msg = error?.message || '';
  return error?.name === 'ChunkLoadError' ||
    /loading chunk \d+ failed/i.test(msg) ||
    /failed to fetch dynamically imported module/i.test(msg) ||   // Chrome
    /error loading dynamically imported module/i.test(msg) ||     // Firefox (HIGHAIR-WEBSITE-17)
    /importing a module script failed/i.test(msg) ||              // Safari
    /unable to preload css/i.test(msg);
}

/* Whether componentDidCatch reports to Sentry. A stale chunk that is being
   healed by the reload is the deploy working as designed, not a fault (8 such
   reports a week, HIGHAIR-WEBSITE-K/13, 9 Nov 2026). One the reload could not
   heal ends on the error screen, and that one still reports. */
export function shouldReport(error, recovering) {
  return !(isChunkError(error) && recovering);
}

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, recovering: false };
  }

  static getDerivedStateFromError(error) {
    // Stale chunk after a new deployment: refresh the cached chunks and reload
    // so the browser gets the updated index.html and fresh chunk hashes.
    if (isChunkError(error) && (recoveryStarted || claimRecovery())) {
      if (!recoveryStarted) {
        recoveryStarted = true;
        refreshAssetsAndReload(error);
      }
      return { hasError: false, error: null, recovering: true };
    }

    return { hasError: true, error, recovering: false };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
    // Report to Sentry (no-op if DSN not configured), unless the reload heals it
    if (!shouldReport(error, recoveryStarted)) return;
    try { Sentry.captureException(error, { extra: info }); } catch (_) {}
  }

  render() {
    // Reload is on its way; don't re-render the failing tree meanwhile
    if (this.state.recovering) return null;

    if (!this.state.hasError) {
      return this.props.children;
    }

    const lang = errorScreenLang(window.location.hostname, document.documentElement.lang);
    const text = ERROR_SCREEN[lang];

    return (
      <div
        style={{
          minHeight:      '100vh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     '#F5F3FF',
          fontFamily:     "'Ploni', sans-serif",
          padding:        '24px',
          boxSizing:      'border-box',
          direction:      lang === 'he' ? 'rtl' : 'ltr',
        }}
      >
        <div
          style={{
            background:   '#FFFFFF',
            borderRadius: '20px',
            padding:      '48px 40px',
            maxWidth:     '480px',
            width:        '100%',
            textAlign:    'center',
            boxShadow:    '0 8px 40px rgba(109, 40, 217, 0.10)',
          }}
        >
          {/* Icon */}
          <div
            style={{
              fontSize:    '56px',
              marginBottom: '16px',
              lineHeight:  '1',
            }}
          >
            ⛰️
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize:    '26px',
              fontWeight:  '700',
              color:       '#1E1B2E',
              margin:      '0 0 12px',
              lineHeight:  '1.3',
            }}
          >
            {text.title}
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontSize:   '16px',
              color:      '#6B7280',
              margin:     '0 0 32px',
              lineHeight: '1.6',
            }}
          >
            {text.line1}
            <br />
            {text.line2}
          </p>

          {/* CTA button */}
          <a
            href="/"
            style={{
              display:        'inline-block',
              background:     '#6D28D9',
              color:          '#FFFFFF',
              fontSize:       '16px',
              fontWeight:     '700',
              padding:        '14px 36px',
              borderRadius:   '12px',
              textDecoration: 'none',
              letterSpacing:  '0.02em',
              transition:     'background 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#5B21B6')}
            onMouseLeave={e => (e.currentTarget.style.background = '#6D28D9')}
          >
            {text.home}
          </a>
        </div>
      </div>
    );
  }
}
