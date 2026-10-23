import { Component } from 'react';
import * as Sentry from '@sentry/react';

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

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, recovering: false };
  }

  static getDerivedStateFromError(error) {
    // Stale chunk after a new deployment: refresh the cached chunks and reload
    // so the browser gets the updated index.html and fresh chunk hashes.
    const msg = error?.message || '';
    const isChunkError =
      error?.name === 'ChunkLoadError' ||
      /loading chunk \d+ failed/i.test(msg) ||
      /failed to fetch dynamically imported module/i.test(msg) ||
      /importing a module script failed/i.test(msg) ||
      /unable to preload css/i.test(msg);

    if (isChunkError && (recoveryStarted || claimRecovery())) {
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
    // Report to Sentry (no-op if DSN not configured)
    try { Sentry.captureException(error, { extra: info }); } catch (_) {}
  }

  render() {
    // Reload is on its way; don't re-render the failing tree meanwhile
    if (this.state.recovering) return null;

    if (!this.state.hasError) {
      return this.props.children;
    }

    const isRtl = document.documentElement.dir !== 'ltr';

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
          direction:      document.documentElement.dir,
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
            {isRtl ? 'אופס - משהו השתבש' : 'Oops - something went wrong'}
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
            {isRtl ? 'נתקלנו בשגיאה בלתי צפויה' : 'We encountered an unexpected error'}
            <br />
            {isRtl ? 'אפשר לנסות לחזור לדף הבית ולהמשיך משם' : 'You can try returning to the homepage and continuing from there'}
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
            {isRtl ? 'חזרה לדף הבית' : 'Back to Home'}
          </a>
        </div>
      </div>
    );
  }
}
