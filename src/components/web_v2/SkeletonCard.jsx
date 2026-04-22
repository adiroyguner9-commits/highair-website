/**
 * SkeletonCard.jsx
 * Pulsing placeholder card for blog/shop lists while content loads.
 */

const KEYFRAMES = `
@keyframes skeletonShimmer {
  0%   { background-position: 200% center; }
  100% { background-position: -200% center; }
}
`;

const shimmerBg =
  'linear-gradient(90deg, #F0EEF8 25%, #E8E4F8 50%, #F0EEF8 75%)';

function SkeletonBlock({ width = '100%', height = '16px', borderRadius = '8px', style = {} }) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background:           shimmerBg,
        backgroundSize:       '400% 100%',
        animation:            'skeletonShimmer 1.6s ease-in-out infinite',
        ...style,
      }}
    />
  );
}

export default function SkeletonCard({ style = {} }) {
  return (
    <>
      {/* Inject keyframes once via a style tag */}
      <style>{KEYFRAMES}</style>

      <div
        style={{
          borderRadius:  '16px',
          overflow:      'hidden',
          background:    '#FFFFFF',
          boxShadow:     '0 2px 12px rgba(109, 40, 217, 0.07)',
          display:       'flex',
          flexDirection: 'column',
          ...style,
        }}
      >
        {/* Image placeholder */}
        <SkeletonBlock
          height="200px"
          borderRadius="0"
          style={{ flexShrink: 0 }}
        />

        {/* Text content area */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Tag / category chip */}
          <SkeletonBlock width="72px" height="20px" borderRadius="20px" />

          {/* Title line 1 */}
          <SkeletonBlock width="85%" height="18px" />

          {/* Title line 2 */}
          <SkeletonBlock width="60%" height="18px" />

          {/* Divider gap */}
          <div style={{ height: '4px' }} />

          {/* Body text lines */}
          <SkeletonBlock width="100%" height="13px" />
          <SkeletonBlock width="92%"  height="13px" />
          <SkeletonBlock width="78%"  height="13px" />

          {/* Divider gap */}
          <div style={{ height: '8px' }} />

          {/* CTA / price row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <SkeletonBlock width="90px" height="36px" borderRadius="10px" />
            <SkeletonBlock width="56px" height="14px" />
          </div>
        </div>
      </div>
    </>
  );
}
