// Custom blends we develop with customers (SFP blending & packaging service).
// Matcha-only blends and private label matcha live with Pure Matcha Partners;
// SFP owns multi-ingredient blends where the second component is an SFP
// ingredient (tea powders, protein). Copy lives in messages under
// `blending.blends.<slug>`; facts here are structural only.

import { PRODUCTS } from "./catalog";

export type BlendPart = {
  product?: string; // catalogue slug, when the component is an SFP product
  key: string; // message key for the component name (blending.parts.<key>)
  color: string; // swatch colour
  tint: string;
  img?: string; // powder macro, when we have real photography
};

export type Blend = {
  slug: string;
  parts: [BlendPart, BlendPart];
};

function part(slug: string, key: string): BlendPart {
  const p = PRODUCTS.find((x) => x.slug === slug)!;
  return { product: p.slug, key, color: p.accent, tint: p.tint, img: p.img };
}

// Protein has no catalogue page or photography yet: the swatch uses the
// reserved protein brand colour (globals.css --color-protein).
const PROTEIN: BlendPart = { key: "protein", color: "#1f5a55", tint: "#93c9c2" };

export const BLENDS: Blend[] = [
  { slug: "matcha-protein", parts: [part("matcha", "matcha"), PROTEIN] },
  { slug: "earl-grey-matcha", parts: [part("matcha", "matcha"), part("earl-grey-tea-powder", "earlGrey")] },
  { slug: "jasmine-matcha", parts: [part("matcha", "matcha"), part("jasmine-tea-powder", "jasmine")] },
];

export const BLEND_MOQ_KG = 100;
export const PACKAGING_MOQ_KG = 100;

export function getBlend(slug: string): Blend | undefined {
  return BLENDS.find((b) => b.slug === slug);
}

// Product pages that point buyers at a blend built on them.
export function blendForProduct(productSlug: string): Blend | undefined {
  if (productSlug === "matcha") return undefined; // matcha PDP links the hub instead
  return BLENDS.find((b) => b.parts.some((p) => p.product === productSlug));
}
