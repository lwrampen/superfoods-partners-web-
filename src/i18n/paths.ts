import { routing } from "./routing";

export const SITE = "https://www.superfoodspartners.com";

// Absolute URL for a locale + locale-less path ("/", "/about", "/catalog/matcha").
// Default locale (en) lives at the root; others are prefixed (/de/...).
export function localizedUrl(locale: string, path: string): string {
  const clean = path === "/" ? "" : path;
  return locale === routing.defaultLocale ? `${SITE}${clean || "/"}` : `${SITE}/${locale}${clean}`;
}

// hreflang + canonical block for a page. Every page self-canonicals and lists
// all language alternates plus x-default (English).
export function alternatesFor(locale: string, path: string) {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { canonical: localizedUrl(locale, path), languages };
}

// Insights that only exist in some locales (the rest would be English copies under a /de, /zh-Hant ... URL): the
// translated locales list each other as hreflang alternatives; an untranslated locale canonicals to the English page
// so Google consolidates the duplicates instead of indexing six copies of the same English text.
export function alternatesForLocales(locale: string, path: string, available: readonly string[]) {
  if (!available.includes(locale)) return { canonical: localizedUrl(routing.defaultLocale, path) };
  const languages: Record<string, string> = {};
  for (const l of available) languages[l] = localizedUrl(l, path);
  languages["x-default"] = localizedUrl(routing.defaultLocale, path);
  return { canonical: localizedUrl(locale, path), languages };
}
