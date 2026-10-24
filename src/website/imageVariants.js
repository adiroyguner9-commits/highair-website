/* imageVariants.js: the lighter 800px copies of homepage and blog photos
   (written by scripts/gen-image-variants.mjs, listed in imageVariants.json).

   srcSetOf(src)  -> a srcset with the 800px copy and the full file, so the
                     browser downloads the size its screen needs; undefined
                     when the photo has no lighter copy (then src alone works).
   smallOf(src)   -> the 800px copy itself, for CSS backgrounds (blog cards),
                     the same choice as the expedition card thumbs. */
import VARIANTS from './imageVariants.json';

export const srcSetOf = src => {
  const v = VARIANTS[src];
  return v ? `${v.s} 800w, ${src} ${v.w}w` : undefined;
};

export const smallOf = src => VARIANTS[src]?.s || src;
