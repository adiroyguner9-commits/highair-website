/**
 * israelFlag.js - master visibility switch for the whole Israel treks section.
 *
 * Kept in its own tiny module (not israelData.js) so importing the flag on the
 * homepage never pulls the full Israel dataset into the main bundle.
 *
 * false = the entire Israel offering is hidden from the public site: the
 * homepage section, the top-nav menu, the footer column, the /israel and
 * /israel/:slug pages (they fall through to 404), and the sitemap + SEO shells.
 * No data is deleted - flip to true and rebuild to bring it all back.
 *
 * Hidden by the owner, 23 Oct 2026.
 */
export const ISRAEL_TREKS_LIVE = false;
