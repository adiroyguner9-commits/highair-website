/**
 * FlagImg.jsx — Cross-platform country flag image
 *
 * Converts a Unicode flag emoji (e.g. 🇳🇵) into a flagcdn.com <img>
 * so it renders correctly on Windows (which does not support flag emoji).
 *
 * Usage:
 *   <FlagImg emoji="🇳🇵" size={20} />
 *   <FlagImg emoji={exp.flag} size={22} />
 */
export default function FlagImg({ emoji, size = 20 }) {
  if (!emoji) return null;
  const code = [...emoji]
    .map(c => c.codePointAt(0))
    .filter(p => p >= 0x1F1E6 && p <= 0x1F1FF)
    .map(p => String.fromCharCode(p - 0x1F1A5))
    .join('')
    .toLowerCase();
  if (!code || code.length !== 2) return null;
  const h = Math.round(size * 0.75);
  return (
    <img
      src={`https://flagcdn.com/20x15/${code}.png`}
      srcSet={`https://flagcdn.com/40x30/${code}.png 2x`}
      width={size}
      height={h}
      alt={code.toUpperCase()}
      style={{ borderRadius: '2px', display: 'block', flexShrink: 0, width: size, height: h }}
    />
  );
}
