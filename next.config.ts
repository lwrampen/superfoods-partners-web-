import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old origin slug still indexed by Google — consolidate to the current page.
      { source: "/origins/luzon-ph", destination: "/origins/philippines-ph", permanent: true },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
