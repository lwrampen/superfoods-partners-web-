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
  // Japan
  "uji-jp": { slug: "uji-jp", name: "Uji", country: "Japan", countryCode: "JP", coords: "34.88°N 135.80°E" },
  "shizuoka-jp": { slug: "shizuoka-jp", name: "Shizuoka", country: "Japan", countryCode: "JP", coords: "34.98°N 138.38°E" },
  "kagoshima-jp": { slug: "kagoshima-jp", name: "Kagoshima", country: "Japan", countryCode: "JP", coords: "31.56°N 130.56°E" },
  "nara-jp": { slug: "nara-jp", name: "Nara", country: "Japan", countryCode: "JP", coords: "34.69°N 135.80°E" },
  "gifu-jp": { slug: "gifu-jp", name: "Gifu", country: "Japan", countryCode: "JP", coords: "35.42°N 136.76°E" },
  "ibaraki-jp": { slug: "ibaraki-jp", name: "Ibaraki", country: "Japan", countryCode: "JP", coords: "36.37°N 140.47°E" },
  "kyoto-jp": { slug: "kyoto-jp", name: "Kyoto", country: "Japan", countryCode: "JP", coords: "35.01°N 135.77°E" },
  // China
  "east-china-cn": { slug: "east-china-cn", name: "East China", country: "China", countryCode: "CN", coords: "30.27°N 120.15°E" },
  "south-china-cn": { slug: "south-china-cn", name: "South China", country: "China", countryCode: "CN", coords: "23.13°N 113.26°E" },
  "fujian-cn": { slug: "fujian-cn", name: "Fujian", country: "China", countryCode: "CN", coords: "26.07°N 119.30°E" },
  "china-cn": { slug: "china-cn", name: "China", country: "China", countryCode: "CN", coords: "35.86°N 104.20°E" },
  // Other
  "philippines-ph": { slug: "philippines-ph", name: "Philippines", country: "Philippines", countryCode: "PH", coords: "12.88°N 121.77°E" },
  "egypt-eg": { slug: "egypt-eg", name: "Egypt", country: "Egypt", countryCode: "EG", coords: "26.82°N 30.80°E" },
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
    originSlugs: ["uji-jp", "shizuoka-jp", "kagoshima-jp", "nara-jp", "gifu-jp", "ibaraki-jp", "east-china-cn", "south-china-cn"],
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
    img: "/products/hojicha.webp",
    tagline: "Roasted green tea — low caffeine, deep aroma.",
    description:
      "Charcoal-roasted Japanese green tea with a warm, toasty profile. A natural fit for lattes, bakery and RTD applications.",
    originSlugs: ["kyoto-jp", "uji-jp", "nara-jp", "shizuoka-jp", "kagoshima-jp", "east-china-cn"],
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
    originSlugs: ["philippines-ph", "china-cn"],
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
    originSlugs: ["china-cn"],
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
    img: "/products/hibiscus.webp",
    tagline: "Tart, ruby-red botanical for teas and beverages.",
    description:
      "Deep-red hibiscus for infusions, RTD and blends. Sourced at volume, screened and documented.",
    originSlugs: ["east-china-cn", "egypt-eg"],
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
    img: "/products/jasmine-tea-powder.webp",
    tagline: "Jasmine-scented green tea, finely milled.",
    description:
      "Green tea powder layered with real jasmine blossom — floral aroma, smooth finish. For lattes, RTD, bakery and blends. Sourced at volume, screened and documented per batch.",
    originSlugs: ["east-china-cn", "fujian-cn"],
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
    img: "/products/oolong-tea-powder.webp",
    tagline: "Semi-oxidised tea, roasted and finely milled.",
    description:
      "Whole-leaf oolong milled to a fine powder — toasty, floral and complex. Semi-oxidised in China's classic oolong country. For specialty lattes, RTD and dessert applications.",
    originSlugs: ["east-china-cn", "fujian-cn"],
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
    img: "/products/earl-grey-tea-powder.webp",
    tagline: "Black tea with natural bergamot, finely milled.",
    description:
      "Black tea powder infused with natural bergamot — bold, citrus-bright and aromatic. A distinctive base for lattes, bakery and beverage innovation. Sourced and documented per batch.",
    originSlugs: ["east-china-cn", "fujian-cn"],
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

// Parse a "34.88°N 135.80°E" coords string into numeric lat/lng (for maps/globe).
export function parseLatLng(coords: string): { lat: number; lng: number } {
  const m = coords.match(/([\d.]+)°([NS])\s+([\d.]+)°([EW])/);
  if (!m) return { lat: 0, lng: 0 };
  return {
    lat: parseFloat(m[1]) * (m[2] === "S" ? -1 : 1),
    lng: parseFloat(m[3]) * (m[4] === "W" ? -1 : 1),
  };
}

export function productsForOrigin(slug: string): Product[] {
  return PRODUCTS.filter((p) => p.originSlugs.includes(slug));
}

// Short, product-neutral descriptor per origin — fallback for the Origin Passport.
export const ORIGIN_BLURB: Record<string, string> = {
  "uji-jp": "Near Kyoto — Japan's historic tea heartland; shaded gardens, deep umami.",
  "shizuoka-jp": "Japan's largest tea region; dependable quality at scale.",
  "kagoshima-jp": "Volcanic southern Japan; mineral-rich soil, early harvests.",
  "nara-jp": "Yamato tea country near Nara; gentle, balanced leaf.",
  "gifu-jp": "Central-Japan mountain gardens; clean, brisk character.",
  "ibaraki-jp": "Eastern Japan; robust, full-bodied leaf.",
  "kyoto-jp": "Kyoto prefecture — the cultural home of Japanese tea.",
  "east-china-cn": "Eastern China's tea belt; broad, consistent supply at volume.",
  "south-china-cn": "Southern China; warm climate, aromatic leaf.",
  "fujian-cn": "Fujian — China's classic green, oolong & jasmine region.",
  "china-cn": "Sourced across China; screened and documented per batch.",
  "philippines-ph": "Philippine highlands; vivid, naturally sweet crops.",
  "egypt-eg": "Sun-grown along the Nile; deep colour, bright acidity.",
};

// Richer place × product notes (override the blurb where we have specifics).
// Keyed by product slug → origin slug. Profile varies by grade & origin, so these
// describe the PLACE in relation to the product — not a fixed taste score.
export const ORIGIN_NOTES: Record<string, Record<string, string>> = {
  matcha: {
    "uji-jp": "Japan's ceremonial heartland near Kyoto — shaded gardens cultivated since the 12th century. Deep umami, vivid jade.",
    "kagoshima-jp": "Volcanic, mineral-rich soil near Sakurajima. Earlier harvests, bold and lively character.",
    "shizuoka-jp": "Japan's largest tea prefecture — dependable, well-rounded matcha at volume.",
  },
  hojicha: {
    "uji-jp": "Uji leaf, charcoal-roasted in small batches. Warm, toasty, naturally low in caffeine.",
    "kyoto-jp": "Kyoto-grown leaf, slow-roasted for a deep, comforting aroma.",
  },
  ube: {
    "philippines-ph": "Philippine highland yam. Naturally vivid purple, sweet and earthy — colour and flavour in one.",
  },
  hibiscus: {
    "egypt-eg": "Upper-Nile sun along the Aswan basin. Deep-ruby calyces with bright, tart acidity.",
  },
  "jasmine-tea-powder": {
    "fujian-cn": "Fujian's coastal hills — the classic jasmine-scenting region. Layered with fresh blossom; floral and smooth.",
  },
  "oolong-tea-powder": {
    "fujian-cn": "Wuyi & Anxi oolong country. Semi-oxidised by hand for a toasty, floral complexity.",
  },
  "earl-grey-tea-powder": {
    "fujian-cn": "A bodied Chinese black-tea base — the bold canvas for natural bergamot.",
  },
};

// Resolve the best note for a product × origin (specific note → origin blurb → empty).
export function originNote(productSlug: string, originSlug: string): string {
  return ORIGIN_NOTES[productSlug]?.[originSlug] ?? ORIGIN_BLURB[originSlug] ?? "";
}

// Buyer-intent FAQ per product, generated from real catalogue data.
// Feeds both an on-page FAQ (content depth for B2B long-tail) and FAQPage JSON-LD
// (citable Q&A for AI/GEO answers). Answers stay accurate to the product's own certs,
// origins and forms — no invented prices or claims.
export function productFaqs(slug: string): { q: string; a: string }[] {
  const p = getProduct(slug);
  if (!p) return [];
  const name = p.name.toLowerCase();
  const countries = [...new Set(p.originSlugs.map((s) => ORIGINS[s]?.country).filter(Boolean))].join(" and ");
  const faqs: { q: string; a: string }[] = [
    {
      q: `What is the minimum order quantity for bulk ${name}?`,
      a: `Bulk ${name} is available from 25 kg up to full-container volume. Sample quantities can be arranged first so you can qualify the material before committing to a wholesale order.`,
    },
    {
      q: `Which certifications does your ${name} carry?`,
      a: `Our ${name} is available with ${p.certs.join(", ")}. Every batch ships with a full COA and a Verification Record™ documenting pesticide-residue, heavy-metal, microbiology and radiation testing.`,
    },
    {
      q: `Where do you source ${name}?`,
      a: `We source ${name} from ${countries || "vetted origins"}, routed and quality-checked through our Hong Kong hub, with traceability to the origin batch on every shipment.`,
    },
    {
      q: `Can you supply ${name} for private label or as a formulation ingredient?`,
      a: `Yes. We supply ${name} to beverage manufacturers, supplement and nutraceutical brands, private-label and co-packers, and distributors — either as a bulk ingredient or under your own label.`,
    },
    {
      q: `How fast can you ship ${name}, and on what Incoterms?`,
      a: `Typical lead time is 2–4 weeks, shipped FOB, CIF or DDP via Hong Kong. A lab report and quote usually follow within 48 hours of your request.`,
    },
  ];
  if (p.grades?.length) {
    faqs.push({
      q: `Which grades of ${name} do you offer?`,
      a: `${p.name} is available in ${p.grades.join(", ").toLowerCase()} grades, in ${p.forms.join(" and ").toLowerCase()} forms — matched to your application and budget.`,
    });
  } else if (p.forms.includes("Organic")) {
    faqs.push({
      q: `Is your ${name} available organic?`,
      a: `Yes — ${name} is available in both organic and conventional forms, documented per batch.`,
    });
  }
  return faqs;
}
