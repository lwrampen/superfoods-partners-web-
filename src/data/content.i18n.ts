import type { Product, Origin, Form } from "./catalog";
import { DE } from "./content.de";
import { ES } from "./content.es";
import { FR } from "./content.fr";
import { PL } from "./content.pl";
import { ZH } from "./content.zh-Hant";

// Locale-generic content dispatcher. English lives in catalog.ts; each
// translated locale ships a LocaleContent bundle (content.<locale>.ts) that the
// localize* helpers merge in. Structural fields (slug, code, colours, img,
// originSlugs, forms, certs, coords) are never translated.

export type ProductText = Partial<
  Pick<Product, "tagline" | "description" | "intro" | "applications" | "specs" | "category" | "gradeNotes">
>;

export interface LocaleContent {
  products: Record<string, ProductText>;
  category: Record<string, string>;
  originName: Record<string, string>;
  country: Record<string, string>;
  form: Record<string, string>;
  blurb: Record<string, string>;
  intro: Record<string, string>;
}

const REGISTRY: Record<string, LocaleContent> = { de: DE, es: ES, fr: FR, pl: PL, "zh-Hant": ZH };

export function localizeProduct(p: Product, locale: string): Product {
  const c = REGISTRY[locale];
  if (!c) return p;
  const o = c.products[p.slug] ?? {};
  return { ...p, ...o, category: c.category[p.category] ?? p.category };
}

export function localizeOrigin(o: Origin, locale: string): Origin {
  const c = REGISTRY[locale];
  if (!c) return o;
  return { ...o, name: c.originName[o.slug] ?? o.name, country: c.country[o.country] ?? o.country };
}

export function formLabel(f: Form, locale: string): string {
  const c = REGISTRY[locale];
  return c ? (c.form[f] ?? f) : f;
}

export function categoryLabel(cat: string, locale: string): string {
  const c = REGISTRY[locale];
  return c ? (c.category[cat] ?? cat) : cat;
}

export function countryLabel(country: string, locale: string): string {
  const c = REGISTRY[locale];
  return c ? (c.country[country] ?? country) : country;
}

// Origin narrative overrides (fall back to the English passed in).
export function localizedBlurb(slug: string, locale: string, fallback: string): string {
  const c = REGISTRY[locale];
  return c ? (c.blurb[slug] ?? fallback) : fallback;
}

export function localizedIntro(slug: string, locale: string, fallback: string | undefined): string | undefined {
  const c = REGISTRY[locale];
  return c ? (c.intro[slug] ?? fallback) : fallback;
}
