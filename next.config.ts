import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old origin slug still indexed by Google — consolidate to the current page.
      { source: "/origins/luzon-ph", destination: "/origins/philippines-ph", permanent: true },
      // About → Company (Fase 3 IA rename). Permanent (308) so /about keeps its
      // ranking. Cover the default locale and every prefixed locale variant.
      { source: "/about", destination: "/company", permanent: true },
      {
        source: "/:locale(de|es|fr|pl|zh-Hant)/about",
        destination: "/:locale/company",
        permanent: true,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
