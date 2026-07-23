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
  icons: {
    icon: "/logos/sfp-roundel-primary.svg",
    apple: "/logos/sfp-roundel-primary.png",
  },
  openGraph: {
    type: "website",
    siteName: "Superfoods Partners",
    title: "Superfoods Partners — Sourced at scale. Trusted at origin.",
    description:
      "Every origin in the world, routed through one trusted hub in Hong Kong. Verified, documented, traceable.",
  },
  robots: { index: true, follow: true },
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
        {children}
        <GoogleAnalytics gaId="G-CDZRWMKR9N" />
      </body>
    </html>
  );
}
