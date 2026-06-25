import type { Metadata } from "next";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
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
      className={`${inter.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-oat text-stone">
        {children}
        <GoogleAnalytics gaId="G-CDZRWMKR9N" />
      </body>
    </html>
  );
}
