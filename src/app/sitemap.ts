import type { MetadataRoute } from "next";

const BASE = "https://superfoodspartners.com";

// Routes live today. Expanded as catalog / origins / etc. ship
// (kept accurate so the sitemap never lists 404s).
const ROUTES = [""];

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
