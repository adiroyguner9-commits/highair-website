/* ─────────────────────────────────────────────────────────
   Centralised minimalist line-SVG icon library
   All icons: strokeWidth 1.6, strokeLinecap/join round
───────────────────────────────────────────────────────── */

const base = { fill: 'none', strokeWidth: '1.6', strokeLinecap: 'round', strokeLinejoin: 'round' };
const I = ({ size = 22, color = 'currentColor', children }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...base}>{children}</svg>
);

export const MountainIcon    = p => <I {...p}><path d="M3 20l6-11 3 4 4-7 5 10H3z"/></I>;
export const CalendarIcon    = p => <I {...p}><rect x="3" y="4" width="18" height="18" rx="3"/><path d="M16 2v4M8 2v4M3 10h18"/></I>;
export const CheckIcon       = p => <I {...p}><path d="M20 6L9 17l-5-5"/></I>;
export const PlaneIcon       = p => <I {...p}><path d="M22 2L11 13M22 2L15 22l-4-9-9-4 19-7z"/></I>;
export const ShieldIcon      = p => <I {...p}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></I>;
export const ChatIcon        = p => <I {...p}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></I>;
export const BellIcon        = p => <I {...p}><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></I>;
export const InfoIcon        = p => <I {...p}><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></I>;
export const SatelliteIcon   = p => <I {...p}><path d="M4.5 16.5l-1-1a5 5 0 017.07-7.07l1 1M19.5 7.5l1 1a5 5 0 01-7.07 7.07l-1-1M14 10l-4 4"/><circle cx="6" cy="18" r="2"/><path d="M6 14v2M10 18h2"/></I>;
export const PassportIcon    = p => <I {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="12" cy="10" r="3"/><path d="M6 21v-1a6 6 0 0112 0v1"/></I>;
export const SyringeIcon     = p => <I {...p}><path d="M18 2l4 4M17 7L6 18M8 17l-5 5M14 4l6 6M12 6l6 6M9 9l6 6"/></I>;
export const BackpackIcon    = p => <I {...p}><path d="M9 2h6a1 1 0 011 1v3H8V3a1 1 0 011-1z"/><rect x="3" y="6" width="18" height="15" rx="3"/><path d="M9 11h6M12 11v4"/></I>;
export const CurrencyIcon    = p => <I {...p}><circle cx="12" cy="12" r="10"/><path d="M12 6v12M15 9H9a3 3 0 000 6h6a3 3 0 010 6H8"/></I>;
export const CameraIcon      = p => <I {...p}><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></I>;
export const UsersIcon       = p => <I {...p}><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></I>;
export const MedicalIcon     = p => <I {...p}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 8v8M8 12h8"/></I>;
export const HikingIcon      = p => <I {...p}><path d="M3 20h18M8 20V8l4-5 4 9v8M12 12H8"/></I>;
export const ShoppingIcon    = p => <I {...p}><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 01-8 0"/></I>;
export const HeartIcon       = p => <I {...p}><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></I>;
export const TagIcon         = p => <I {...p}><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none"/></I>;
export const SearchIcon      = p => <I {...p}><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></I>;
export const WarningIcon     = p => <I {...p}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><path d="M12 9v4M12 17h.01"/></I>;
export const DiningIcon      = p => <I {...p}><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2a5 5 0 00-5 5v6h3M19 22v-7"/></I>;
export const PinIcon         = p => <I {...p}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></I>;
export const PhoneIcon       = p => <I {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/></I>;
export const TentIcon        = p => <I {...p}><path d="M3 20L12 4l9 16H3zM9 20l3-8 3 8"/></I>;
export const GlassesIcon     = p => <I {...p}><circle cx="6" cy="14" r="4"/><circle cx="18" cy="14" r="4"/><path d="M10 14h4M2 10l2 4M22 10l-2 4"/></I>;
export const GpsIcon         = p => <I {...p}><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3M16.5 2.5l1 3-3 1M7.5 21.5l-1-3 3-1"/></I>;
export const CreditCardIcon  = p => <I {...p}><rect x="1" y="4" width="22" height="16" rx="3"/><path d="M1 10h22"/></I>;
export const StarIcon        = p => <I {...p}><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></I>;

/* ── Event decorative icons (used large on card backgrounds) ── */
export const VolcanoIcon     = p => <I {...p}><path d="M12 2L6 16h12L12 2z"/><path d="M9 16l-5 6h16l-5-6"/><path d="M10 10l-2 2M14 10l2 2"/></I>;
export const LionIcon        = p => <I {...p}><circle cx="12" cy="11" r="5"/><path d="M12 16v6M9 18l-2 3M15 18l2 3M7 9C5 7 4 5 5 3M17 9c2-2 3-4 2-6M9 7c-1-2-3-3-4-2M15 7c1-2 3-3 4-2"/></I>;
export const EagleIcon       = p => <I {...p}><path d="M12 8c-2-4-6-6-8-4s0 6 4 8l4 2 4-2c4-2 6-6 4-8s-6 0-8 4z"/><path d="M12 18v4M10 22h4"/></I>;
export const SnowflakeIcon   = p => <I {...p}><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07M12 2l-3 4M12 2l3 4M12 22l-3-4M12 22l3-4M2 12l4-3M2 12l4 3M22 12l-4-3M22 12l-4 3"/></I>;
export const TreeIcon        = p => <I {...p}><path d="M12 2L4 12h4l-2 5h4l-2 5h8l-2-5h4l-2-5h4L12 2z"/></I>;
export const GlobeIcon       = p => <I {...p}><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20"/></I>;
export const EyeIcon         = p => <I {...p}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></I>;
export const ElephantIcon    = p => <I {...p}><path d="M18 6c0-2-1.5-4-4-4s-4 2-5 4H7a4 4 0 00-4 4v2a4 4 0 004 4h1v4h6v-4h1a4 4 0 004-4V9"/><path d="M21 8c1 1 1 3 0 4"/></I>;

/* ── Map: event key → decorative SVG icon key ── */
const EVENT_ICON_MAP = {
  mountain:    MountainIcon,
  volcano:     VolcanoIcon,
  lion:        LionIcon,
  eagle:       EagleIcon,
  snowflake:   SnowflakeIcon,
  tree:        TreeIcon,
  globe:       GlobeIcon,
  elephant:    ElephantIcon,
};

export const MedalIcon  = p => <I {...p}><circle cx="12" cy="14" r="6"/><path d="M8.5 7.5L7 2h10l-1.5 5.5"/><path d="M9 8.5C10 7.5 14 7.5 15 8.5"/></I>;
export const ShareIcon  = p => <I {...p}><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></I>;
export const GiftIcon   = p => <I {...p}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><path d="M12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z"/></I>;

export function EventIconComp({ iconKey, size = 48, color = 'currentColor' }) {
  const Comp = EVENT_ICON_MAP[iconKey] || MountainIcon;
  return <Comp size={size} color={color} />;
}
