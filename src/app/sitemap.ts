import type { MetadataRoute } from "next";
import { PRODUCTS, ORIGIN_LIST } from "@/data/catalog";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/i18n/paths";

// Bumped when catalogue/on-page content is meaningfully updated.
const LAST_UPDATED = new Date("2026-07-27");

// Every URL is listed once (at the default locale) with hreflang `alternates`
// pointing at all language versions — the Google-recommended sitemap shape for
// multilingual sites.
function entry(path: string, priority: number): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedUrl(l, path);
  return {
    url: localizedUrl(routing.defaultLocale, path),
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly",
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: [string, number][] = [
    ["/", 1],
    ["/catalog", 0.8],
    ["/origins", 0.8],
    ["/verification", 0.8],
    ["/about", 0.8],
    ["/contact", 0.8],
  ];
  return [
    ...staticPaths.map(([p, pr]) => entry(p, pr)),
    ...PRODUCTS.map((p) => entry(`/catalog/${p.slug}`, 0.7)),
    ...ORIGIN_LIST.map((o) => entry(`/origins/${o.slug}`, 0.6)),
  ];
}
