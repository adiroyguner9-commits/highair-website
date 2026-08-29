/**
 * MountainBackdrop.jsx
 * A fixed, faint black-and-white mountain wash that sits behind the page
 * (z-index -1). Drop it near the top of a page and make that page's section
 * backgrounds transparent so the mountain shows through as a quiet, cinematic
 * backdrop. Shared across pages so the effect is consistent site-wide.
 *
 * Performance: a fixed positioned div (NOT background-attachment:fixed, which
 * is janky/disabled on mobile) + a single ~140KB webp.
 */
export default function MountainBackdrop() {
  return (
    <div aria-hidden="true" style={{
      position:           'fixed',
      inset:              0,
      zIndex:             -1,
      pointerEvents:      'none',
      backgroundImage:    'linear-gradient(rgba(255,255,255,0.90), rgba(255,255,255,0.93)), url(/images/mountain-bw-bg.webp)',
      backgroundSize:     'cover',
      backgroundPosition: 'center top',
      backgroundRepeat:   'no-repeat',
    }} />
  );
}
