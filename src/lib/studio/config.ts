// Blog Studio — the two target sites. Everything that differs per site lives here: repo, languages, URL shape,
// product/page checklist, search markets and the content guardrails the SEO step must respect.
import { PRODUCTS } from "@/data/catalog";
import type { PostKind, SiteId } from "./types";

export type StudioProduct = { id: string; name: string; path: string; kind: "product" | "group" | "page"; seed: string };

export type SiteConfig = {
  id: SiteId;
  name: string;
  short: string;
  host: string; // production origin
  repo: { owner: string; name: string; branch: string };
  locales: string[]; // first = source (English)
  postDir: string; // repo path for post JSON
  blogPath: string; // "/blogs" or "/insights"
  products: StudioProduct[];
  // DataforSEO markets for keyword research (location_code, language_code)
  markets: { label: string; location: number; language: string }[];
  gscSite: string; // Search Console property
  indexNowKey: string; // public key file at /<key>.txt (not a secret)
  categories: string[];
  recipeDir: string; // repo path for recipe JSON
  recipePath: string; // "/recipe" (PMP, as on Webflow) or "/recipes" (SFP)
  guardrail: string; // what this brand must not compete on
  forbiddenKeyword: RegExp; // keyword ideas that belong to the sister brand
};

const PMP_PRODUCTS: StudioProduct[] = [
  // the five product groups (src/data/groups.ts in the PMP repo)
  { id: "ceremonial", name: "Ceremonial Matcha", path: "/collections/ceremonial-matcha", kind: "group", seed: "ceremonial matcha" },
  { id: "premium", name: "Premium (latte grade) Matcha", path: "/collections/latte-grade-matcha", kind: "group", seed: "latte grade matcha" },
  { id: "culinary", name: "Culinary Matcha", path: "/collections/culinary-matcha", kind: "group", seed: "culinary matcha" },
  { id: "hojicha", name: "Hojicha", path: "/collections/hojicha", kind: "group", seed: "hojicha powder" },
  { id: "mulberry", name: "Mulberry Matcha", path: "/collections/mulberry-matcha", kind: "group", seed: "mulberry leaf powder" },
  // Who we serve pages (docs/blog-posts.md → Internal link targets)
  { id: "for-cafes", name: "Cafés & hospitality", path: "/for/wholesale-matcha-for-cafes-hospitality", kind: "page", seed: "wholesale matcha for cafes" },
  { id: "for-private-label", name: "Private label", path: "/for/private-label-matcha", kind: "page", seed: "private label matcha" },
  { id: "for-fnb", name: "Food & beverage brands", path: "/for/food-and-beverage-brands", kind: "page", seed: "matcha for food and beverage" },
  { id: "for-retail", name: "Retail", path: "/for/retail-matcha-supplier", kind: "page", seed: "retail matcha supplier" },
  { id: "for-distributors", name: "Distributors & foodservice", path: "/for/distributors-foodservice-suppliers", kind: "page", seed: "matcha distributor" },
  { id: "for-co-packers", name: "Product developers & co-packers", path: "/for/product-developers-co-packers", kind: "page", seed: "matcha co-packer" },
  { id: "for-supplements", name: "Supplement brands", path: "/for/bulk-matcha-for-supplements", kind: "page", seed: "bulk matcha for supplements" },
  { id: "hong-kong", name: "Matcha supplier Hong Kong", path: "/matcha-supplier-hong-kong", kind: "page", seed: "matcha supplier hong kong" },
];

// SFP products from the catalogue; matcha + hojicha are Pure Matcha Partners' range, so they are not offered here.
const SFP_PRODUCTS: StudioProduct[] = PRODUCTS.filter((p) => p.label !== "pmp").map((p) => ({
  id: p.slug,
  name: p.name.charAt(0) + p.name.slice(1).toLowerCase(),
  path: `/products/${p.slug}`,
  kind: "product" as const,
  seed: `${p.name.toLowerCase().replace(/’/g, "'")} powder`,
}));

export const SITES: Record<SiteId, SiteConfig> = {
  pmp: {
    id: "pmp",
    name: "Pure Matcha Partners",
    short: "PMP",
    host: "https://www.purematchapartners.com",
    repo: { owner: "lwrampen", name: "pure-matcha-partners-web", branch: "main" },
    locales: ["en", "es", "de"],
    postDir: "content/posts",
    blogPath: "/blogs",
    products: PMP_PRODUCTS,
    markets: [
      { label: "United States", location: 2840, language: "en" },
      { label: "United Kingdom", location: 2826, language: "en" },
    ],
    gscSite: "sc-domain:purematchapartners.com",
    indexNowKey: "7be0a2339efada56c4b1f588273648b4",
    categories: ["Insights", "Education", "Business", "Recipes"],
    recipeDir: "content/recipes",
    recipePath: "/recipe",
    guardrail:
      "Pure Matcha Partners covers matcha, hojicha and mulberry/tea powders. Ube and the other superfood powders belong to Superfoods Partners (superfoodspartners.com): never target or promote them here.",
    forbiddenKeyword: /\b(ube|superfood|lion'?s mane|hibiscus|butterfly pea|purple yam|taro)\b/i,
  },
  sfp: {
    id: "sfp",
    name: "Superfoods Partners",
    short: "SFP",
    host: "https://www.superfoodspartners.com",
    repo: { owner: "lwrampen", name: "superfoods-partners-web-", branch: "main" },
    locales: ["en", "de", "es", "fr", "pl", "zh-Hant"],
    postDir: "content/insights",
    blogPath: "/insights",
    products: SFP_PRODUCTS,
    markets: [
      { label: "United States", location: 2840, language: "en" },
      { label: "United Kingdom", location: 2826, language: "en" },
    ],
    gscSite: "sc-domain:superfoodspartners.com",
    indexNowKey: "13f6fbf51950dde4000e2d43d7ba6854",
    categories: ["Buyer's guide", "Ingredient guide", "Market report", "Company"],
    recipeDir: "content/recipes",
    recipePath: "/recipes",
    guardrail:
      "Superfoods Partners covers ube and the other superfood powders. Matcha and hojicha belong to Pure Matcha Partners (purematchapartners.com): never target matcha or hojicha terms here.",
    forbiddenKeyword: /\b(matcha|hojicha|houjicha)\b/i,
  },
};

export const SITE_IDS: SiteId[] = ["pmp", "sfp"];
export const AUTHORS = ["Leonard", "Judith", "Emily"];

export function postUrl(site: SiteId, slug: string, locale = "en", kind: PostKind = "post") {
  const s = SITES[site];
  return `${s.host}${locale === "en" ? "" : `/${locale}`}${kind === "recipe" ? s.recipePath : s.blogPath}/${slug}`;
}

// Recipes: the same categories on both sites (the site pages translate them)
export const RECIPE_CATEGORIES = ["Drinks", "Bakery", "Desserts", "Frozen", "Snacks"];
export const categoriesFor = (site: SiteId, kind: PostKind = "post") => (kind === "recipe" ? RECIPE_CATEGORIES : SITES[site].categories);

export const LOCALE_NAMES: Record<string, string> = {
  en: "English",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  pl: "Polski",
  "zh-Hant": "繁體中文",
};

export function productsFor(site: SiteId, ids: string[]) {
  return SITES[site].products.filter((p) => ids.includes(p.id));
}

export function slugify(s: string) {
  return s
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function videoFromUrl(url: string): { provider: "youtube" | "vimeo"; id: string } | null {
  const u = url.trim();
  let m = u.match(/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  if (m) return { provider: "youtube", id: m[1] };
  m = u.match(/vimeo\.com\/(?:video\/|channels\/[^/]+\/|groups\/[^/]+\/videos\/)?(\d{6,12})/);
  if (m) return { provider: "vimeo", id: m[1] };
  return null;
}

export function embedUrl(v: { provider: "youtube" | "vimeo"; id: string }) {
  return v.provider === "youtube" ? `https://www.youtube-nocookie.com/embed/${v.id}?rel=0` : `https://player.vimeo.com/video/${v.id}?dnt=1`;
}
