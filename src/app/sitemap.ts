import type { MetadataRoute } from "next";
import { PRODUCTS, ORIGIN_LIST, isIndexableOrigin } from "@/data/catalog";
import { POSTS } from "@/data/insights";
import { BLENDS } from "@/data/blends";
import { routing } from "@/i18n/routing";
import { localizedUrl } from "@/i18n/paths";

// Bumped when catalogue/on-page content is meaningfully updated. Insights use
// their own updated/publication date, so lastmod only moves when a page changed.
const LAST_UPDATED = new Date("2026-10-21");

// Every URL is listed once (at the default locale) with hreflang `alternates`
// pointing at all language versions — the Google-recommended sitemap shape for
// multilingual sites.
function entry(path: string, priority: number, lastModified: Date = LAST_UPDATED): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) languages[l] = localizedUrl(l, path);
  return {
    url: localizedUrl(routing.defaultLocale, path),
    lastModified,
    changeFrequency: "weekly",
    priority,
    alternates: { languages },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths: [string, number][] = [
    ["/", 1],
    ["/products", 0.8],
    ["/origins", 0.8],
    ["/verification", 0.8],
    ["/insights", 0.7],
    ["/company", 0.8],
    ["/pure-ube-partners", 0.6],
    ["/blending", 0.8],
    ["/packaging", 0.7],
    ["/contact", 0.8],
  ];
  return [
    ...staticPaths.map(([p, pr]) => entry(p, pr)),
    ...PRODUCTS.map((p) => entry(`/products/${p.slug}`, 0.7)),
    ...BLENDS.map((b) => entry(`/blending/${b.slug}`, 0.7)),
    ...ORIGIN_LIST.filter((o) => isIndexableOrigin(o.slug)).map((o) => entry(`/origins/${o.slug}`, 0.6)),
    ...POSTS.map((p) => entry(`/insights/${p.slug}`, 0.6, new Date(p.updated ?? p.date))),
  ];
}
