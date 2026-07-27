import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

// Serif — headlines & pull-quotes (the brand's warmth and voice)
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// Grotesk — body & UI
const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// Mono — labels, SKUs, coordinates (documentation tone)
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.superfoodspartners.com"),
  title: {
    default: "Superfoods Partners — Sourced at scale. Trusted at origin.",
    template: "%s | Superfoods Partners",
  },
  description:
    "Hong Kong–based B2B superfood sourcing. Every origin in the world, verified, documented and traceable, routed through one trusted hub.",
  applicationName: "Superfoods Partners",
  openGraph: {
    type: "website",
    siteName: "Superfoods Partners",
    title: "Superfoods Partners — Sourced at scale. Trusted at origin.",
    description:
      "Every origin in the world, routed through one trusted hub in Hong Kong. Verified, documented, traceable.",
  },
  robots: { index: true, follow: true },
};

// Site-wide entity graph: gives Google a stable Organization + WebSite entity
// to attach the brand to (referenced implicitly by the per-page Breadcrumb/FAQ nodes).
const ORG_ID = "https://www.superfoodspartners.com/#organization";
const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "Superfoods Partners",
      url: "https://www.superfoodspartners.com/",
      logo: "https://www.superfoodspartners.com/logos/sfp-roundel-primary.png",
      description:
        "Hong Kong–based B2B superfood sourcing. Every origin verified, documented and traceable, routed through one trusted hub in Hong Kong.",
      areaServed: "Worldwide",
      knowsAbout: [
        "matcha",
        "hojicha",
        "ube",
        "lion's mane",
        "hibiscus",
        "superfood sourcing",
        "B2B ingredient supply",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.superfoodspartners.com/#website",
      url: "https://www.superfoodspartners.com/",
      name: "Superfoods Partners",
      inLanguage: "en",
      publisher: { "@id": ORG_ID },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${hanken.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-oat text-stone">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        {children}
        <GoogleAnalytics gaId="G-CDZRWMKR9N" />
      </body>
    </html>
  );
}
