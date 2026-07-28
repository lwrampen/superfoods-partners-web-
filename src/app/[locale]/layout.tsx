import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";
import "../globals.css";

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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL("https://www.superfoodspartners.com"),
    title: {
      default: t("titleDefault"),
      template: `%s | Superfoods Partners`,
    },
    description: t("description"),
    applicationName: "Superfoods Partners",
    openGraph: {
      type: "website",
      siteName: "Superfoods Partners",
      title: t("titleDefault"),
      description: t("ogDescription"),
      locale,
    },
    robots: { index: true, follow: true },
  };
}

const ORG_ID = "https://www.superfoodspartners.com/#organization";

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

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
        inLanguage: locale,
        publisher: { "@id": ORG_ID },
      },
    ],
  };

  return (
    <html
      lang={locale}
      className={`${newsreader.variable} ${hanken.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-oat text-stone">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
        <GoogleAnalytics gaId="G-CDZRWMKR9N" />
      </body>
    </html>
  );
}
