/* A carousel dot. The mark stays small; the button around it is 24 wide and 28
   high, so a finger can land on it without moving the dots far apart. */
export default function CarouselDot({ width, height = 7, color, onClick, label, pressed, transition }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      aria-pressed={pressed}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minWidth: '24px', height: '28px', padding: 0,
        background: 'none', border: 'none', cursor: 'pointer',
      }}
    >
      <span style={{ display: 'block', width, height, borderRadius: '4px', background: color, transition }} />
    </button>
  );
}
