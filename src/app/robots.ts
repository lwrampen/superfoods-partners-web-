import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    // /studio is the internal Blog Studio (also noindex)
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/studio"] }],
    sitemap: "https://www.superfoodspartners.com/sitemap.xml",
  };
}
