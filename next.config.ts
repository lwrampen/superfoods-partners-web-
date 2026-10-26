import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // pureubepartners.com (brand/print domain, bought Oct 2026) → the Pure Ube
      // Partners label page. Every path on the apex or www host lands there; UTM tags make the
      // traffic visible in GA4. Must stay first so it wins over the rules below.
      {
        source: "/:path*",
        has: [{ type: "host", value: "(www\\.)?pureubepartners\\.com" }],
        destination:
          "https://www.superfoodspartners.com/pure-ube-partners?utm_source=pureubepartners.com&utm_medium=redirect",
        permanent: true,
      },
      // Old origin slug still indexed by Google — consolidate to the current page.
      { source: "/origins/luzon-ph", destination: "/origins/philippines-ph", permanent: true },
      // Hojicha now belongs to Pure Matcha Partners (decision 20 Oct 2026); the removed
      // guide still has inbound links, so send every locale variant to the PMP hojicha range.
      {
        source: "/:locale(de|es|fr|pl|zh-Hant)?/insights/hojicha-powder-wholesale-buyers-guide",
        destination: "https://www.purematchapartners.com/collections/hojicha",
        permanent: true,
      },
      // About → Company (Fase 3 IA rename). Permanent (308) so /about keeps its
      // ranking. Cover the default locale and every prefixed locale variant.
      { source: "/about", destination: "/company", permanent: true },
      {
        source: "/:locale(de|es|fr|pl|zh-Hant)/about",
        destination: "/:locale/company",
        permanent: true,
      },
      // Catalog → Products (Fase 3 IA rename). Permanent (308) so the ranking
      // of /catalog and every /catalog/<product> PDP carries over. Cover the
      // index and product pages, default locale and every prefixed locale.
      { source: "/catalog", destination: "/products", permanent: true },
      { source: "/catalog/:slug", destination: "/products/:slug", permanent: true },
      {
        source: "/:locale(de|es|fr|pl|zh-Hant)/catalog",
        destination: "/:locale/products",
        permanent: true,
      },
      {
        source: "/:locale(de|es|fr|pl|zh-Hant)/catalog/:slug",
        destination: "/:locale/products/:slug",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
