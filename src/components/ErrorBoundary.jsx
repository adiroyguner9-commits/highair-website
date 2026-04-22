import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught error:', error, info);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div
        dir="rtl"
        style={{
          minHeight:      '100vh',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          background:     '#F5F3FF',
          fontFamily:     "'Ploni', sans-serif",
          padding:        '24px',
          boxSizing:      'border-box',
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
            אופס — משהו השתבש
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
            נתקלנו בשגיאה בלתי צפויה.
            <br />
            אפשר לנסות לחזור לדף הבית ולהמשיך משם.
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
            חזרה לדף הבית
          </a>
        </div>
      </div>
    );
  }
}
