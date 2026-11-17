import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "../globals.css";
import "./studio.css";

// Blog Studio — internal tool for the team (Leonard, Judith, Emily). Its own root layout: not localized, no site
// navigation, never indexed.

const anton = localFont({ variable: "--font-anton", display: "swap", src: [{ path: "../../fonts/anton-latin-400-normal.woff2", weight: "400" }] });
const archivo = localFont({
  variable: "--font-archivo",
  display: "swap",
  src: [
    { path: "../../fonts/archivo-latin-400-normal.woff2", weight: "400" },
    { path: "../../fonts/archivo-latin-500-normal.woff2", weight: "500" },
    { path: "../../fonts/archivo-latin-600-normal.woff2", weight: "600" },
    { path: "../../fonts/archivo-latin-700-normal.woff2", weight: "700" },
  ],
});
const plexMono = localFont({
  variable: "--font-plex-mono",
  display: "swap",
  src: [
    { path: "../../fonts/ibm-plex-mono-latin-400-normal.woff2", weight: "400" },
    { path: "../../fonts/ibm-plex-mono-latin-500-normal.woff2", weight: "500" },
  ],
});

export const metadata: Metadata = {
  title: { default: "Blog Studio", template: "%s · Blog Studio" },
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  icons: { icon: "/icon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#16240f" };

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable} ${plexMono.variable}`}>
      <body className="studio min-h-screen bg-offwhite text-forest antialiased">{children}</body>
    </html>
  );
}
