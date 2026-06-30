// Single source of truth for the catalogue. Drives /catalog, PDPs,
// /origins and the per-origin landing pages (programmatic SEO).

export type Origin = {
  slug: string;
  name: string;
  country: string;
  countryCode: string; // for SKU
  coords: string;
};

export type Form = "Organic" | "Conventional";

export type Product = {
  slug: string;
  name: string; // UPPERCASE per brand
  category: string;
  code: string; // for SKU, e.g. "M"
  accent: string; // hex — matte product colour
  tint: string; // hex — lighter title tint
  img?: string; // macro texture
  tagline: string;
  description: string;
  grades?: string[]; // matcha has grades; others may not
  originSlugs: string[];
  forms: Form[];
  certs: string[];
};

export const ORIGINS: Record<string, Origin> = {
  "uji-jp": { slug: "uji-jp", name: "Uji", country: "Japan", countryCode: "JP", coords: "34.88°N 135.80°E" },
  "kagoshima-jp": { slug: "kagoshima-jp", name: "Kagoshima", country: "Japan", countryCode: "JP", coords: "31.56°N 130.56°E" },
  "fujian-cn": { slug: "fujian-cn", name: "Fujian", country: "China", countryCode: "CN", coords: "26.07°N 119.30°E" },
  "luzon-ph": { slug: "luzon-ph", name: "Luzon", country: "Philippines", countryCode: "PH", coords: "16.04°N 120.93°E" },
  "aswan-eg": { slug: "aswan-eg", name: "Aswan", country: "Egypt", countryCode: "EG", coords: "24.09°N 32.90°E" },
};

export const PRODUCTS: Product[] = [
  {
    slug: "matcha",
    name: "MATCHA",
    category: "Matcha",
    code: "M",
    accent: "#1B5E3F",
    tint: "#A7E3C4",
    img: "/products/matcha.jpg",
    tagline: "Stone-ground green tea, shade-grown at origin.",
    description:
      "Vibrant, single-origin matcha in ceremonial, premium and culinary grades. Shade-grown and stone-milled, lab-tested every batch, available from sample to full container.",
    grades: ["Ceremonial", "Premium", "Culinary"],
    originSlugs: ["uji-jp", "kagoshima-jp", "fujian-cn"],
    forms: ["Organic", "Conventional"],
    certs: ["JAS", "EU Organic", "USDA Organic"],
  },
  {
    slug: "hojicha",
    name: "HOJICHA",
    category: "Hojicha",
    code: "H",
    accent: "#6B3A1E",
    tint: "#E4C3A6",
    img: "/products/hojicha.jpg",
    tagline: "Roasted green tea — low caffeine, deep aroma.",
    description:
      "Charcoal-roasted Japanese green tea with a warm, toasty profile. A natural fit for lattes, bakery and RTD applications.",
    originSlugs: ["uji-jp", "kagoshima-jp"],
    forms: ["Organic", "Conventional"],
    certs: ["JAS", "EU Organic"],
  },
  {
    slug: "ube",
    name: "UBE",
    category: "Superfoods",
    code: "U",
    accent: "#7E3FB0",
    tint: "#DCC2F0",
    img: "/products/ube.jpg",
    tagline: "Purple yam powder — colour and flavour from the Philippines.",
    description:
      "Naturally vivid purple yam powder for beverages, bakery and confectionery. Clean colour, consistent particle size, scalable supply.",
    originSlugs: ["luzon-ph"],
    forms: ["Conventional"],
    certs: ["HACCP", "FSSC 22000"],
  },
  {
    slug: "lions-mane",
    name: "LION'S MANE",
    category: "Superfoods",
    code: "L",
    accent: "#C58A2A",
    tint: "#F4DEA8",
    img: "/products/lionsmane.jpg",
    tagline: "Functional mushroom for nutraceutical formulation.",
    description:
      "Fruiting-body lion's mane for supplement and functional-food brands. Tested for actives and contaminants, documented per batch.",
    originSlugs: ["fujian-cn"],
    forms: ["Organic", "Conventional"],
    certs: ["USDA Organic", "Kosher"],
  },
  {
    slug: "hibiscus",
    name: "HIBISCUS",
    category: "Superfoods",
    code: "HB",
    accent: "#B0324E",
    tint: "#F2B8C6",
    img: "/products/hibiscus.jpg",
    tagline: "Tart, ruby-red botanical for teas and beverages.",
    description:
      "Deep-red hibiscus for infusions, RTD and blends. Sourced at volume, screened and documented.",
    originSlugs: ["aswan-eg"],
    forms: ["Conventional"],
    certs: ["HACCP"],
  },
  {
    slug: "jasmine-tea-powder",
    name: "JASMINE",
    category: "Specialty Teas",
    code: "JA",
    accent: "#5E8C6A",
    tint: "#CDE8D4",
    img: "/products/jasmine-tea-powder.jpg",
    tagline: "Jasmine-scented green tea, finely milled.",
    description:
      "Green tea powder layered with real jasmine blossom — floral aroma, smooth finish. For lattes, RTD, bakery and blends. Sourced at volume in Fujian, screened and documented per batch.",
    originSlugs: ["fujian-cn"],
    forms: ["Organic", "Conventional"],
    certs: ["EU Organic", "HACCP"],
  },
  {
    slug: "oolong-tea-powder",
    name: "OOLONG",
    category: "Specialty Teas",
    code: "OO",
    accent: "#B5722E",
    tint: "#EBC79A",
    img: "/products/oolong-tea-powder.jpg",
    tagline: "Semi-oxidised tea, roasted and finely milled.",
    description:
      "Whole-leaf oolong milled to a fine powder — toasty, floral and complex. Semi-oxidised in Fujian's classic oolong country. For specialty lattes, RTD and dessert applications.",
    originSlugs: ["fujian-cn"],
    forms: ["Organic", "Conventional"],
    certs: ["EU Organic", "HACCP"],
  },
  {
    slug: "earl-grey-tea-powder",
    name: "EARL GREY",
    category: "Specialty Teas",
    code: "EG",
    accent: "#3E5A78",
    tint: "#BFD2E6",
    img: "/products/earl-grey-tea-powder.jpg",
    tagline: "Black tea with natural bergamot, finely milled.",
    description:
      "Black tea powder infused with natural bergamot — bold, citrus-bright and aromatic. A distinctive base for lattes, bakery and beverage innovation. Sourced and documented per batch.",
    originSlugs: ["fujian-cn"],
    forms: ["Conventional"],
    certs: ["HACCP"],
  },
];

export const CATEGORIES = ["Matcha", "Hojicha", "Specialty Teas", "Superfoods"];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getOrigin(slug: string): Origin | undefined {
  return ORIGINS[slug];
}

export function productSku(p: Product, opts?: { grade?: string; origin?: Origin; form?: Form }): string {
  const grade = opts?.grade ? opts.grade.slice(0, 2).toUpperCase() : "STD";
  const origin = opts?.origin?.countryCode ?? "XX";
  const form = opts?.form === "Organic" ? "O" : "C";
  return `SFP-${p.code}-${grade}-1KG-${origin}-${form}`;
}

export const ORIGIN_LIST = Object.values(ORIGINS);

export function productsForOrigin(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.originSlugs.includes(slug));
}
