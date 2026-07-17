import type { MetadataRoute } from "next";
import { PRODUCTS, ORIGIN_LIST } from "@/data/catalog";

const BASE = "https://www.superfoodspartners.com";

// Bumped when catalogue/on-page content is meaningfully updated. A recent
// lastmod is a real crawl-priority signal for "Discovered – not indexed" URLs.
const LAST_UPDATED = new Date("2026-07-17");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/catalog", "/origins", "/verification", "/about", "/contact"].map((path) => ({
    url: `${BASE}${path}`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${BASE}/catalog/${p.slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const originRoutes = ORIGIN_LIST.map((o) => ({
    url: `${BASE}/origins/${o.slug}`,
    lastModified: LAST_UPDATED,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...originRoutes];
}
