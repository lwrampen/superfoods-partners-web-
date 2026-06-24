import type { MetadataRoute } from "next";
import { PRODUCTS, ORIGIN_LIST } from "@/data/catalog";

const BASE = "https://www.superfoodspartners.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/catalog", "/origins", "/verification", "/about", "/contact"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const productRoutes = PRODUCTS.map((p) => ({
    url: `${BASE}/catalog/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const originRoutes = ORIGIN_LIST.map((o) => ({
    url: `${BASE}/origins/${o.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...originRoutes];
}
