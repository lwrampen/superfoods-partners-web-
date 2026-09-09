import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PRODUCTS, ORIGIN_LIST, LABELS, type LabelId } from "@/data/catalog";
import { ENTITIES } from "@/data/entities";

// Group origins by country so the footer stays scannable while still exposing
// a direct crawl link to every origin page.
const ORIGINS_BY_COUNTRY = ORIGIN_LIST.reduce<Record<string, typeof ORIGIN_LIST>>((acc, o) => {
  (acc[o.country] ??= []).push(o);
  return acc;
}, {});

// Products grouped by their specialist label — mirrors the mega-menu.
const LABEL_ORDER: LabelId[] = ["pmp", "sfp"];

export function SiteFooter() {
  const t = useTranslations("footer");
  const tc = useTranslations("countries");
  return (
    <footer className="bg-forest text-oat/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4 md:max-w-[220px] md:flex-col md:items-start">
          <Image src="/logos/sfp-block-light.svg" alt="" width={52} height={52} />
          <div>
            <p className="font-medium text-oat">Superfoods Partners</p>
            <p className="mono text-[11px] uppercase">{t("tagline")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
          {/* Direct links to every product — a crawl path from every page. */}
          <div className="flex flex-col gap-4 text-sm">
            <span className="mono text-[10px] uppercase tracking-wide text-oat/40">{t("catalogue")}</span>
            {LABEL_ORDER.map((id) => {
              const L = LABELS[id];
              return (
                <div key={id} className="flex flex-col gap-1.5">
                  <span className="mono flex items-center gap-1.5 text-[10px] uppercase tracking-wide text-oat/30">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: L.house ? "rgba(246,246,243,0.4)" : "#8CC541" }}
                    />
                    {L.name}
                  </span>
                  {PRODUCTS.filter((p) => p.label === id).map((p) => (
                    <Link key={p.slug} href={`/products/${p.slug}`} className="capitalize hover:text-oat">
                      {p.name.toLowerCase()}
                    </Link>
                  ))}
                </div>
              );
            })}
            <Link href="/products" className="text-oat/50 hover:text-oat">{t("allProducts")}</Link>
          </div>

          {/* Direct links to every origin page, grouped by country. */}
          <div className="col-span-2 flex flex-col gap-3 text-sm sm:col-span-1">
            <span className="mono text-[10px] uppercase tracking-wide text-oat/40">{t("origins")}</span>
            {Object.entries(ORIGINS_BY_COUNTRY).map(([country, origins]) => (
              <div key={country} className="flex flex-col gap-1">
                <span className="mono text-[10px] uppercase text-oat/30">{tc.has(country) ? tc(country) : country}</span>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {origins.map((o) => (
                    <Link key={o.slug} href={`/origins/${o.slug}`} className="hover:text-oat">
                      {o.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/origins" className="mt-1 text-oat/50 hover:text-oat">{t("allOrigins")}</Link>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span className="mono text-[10px] uppercase tracking-wide text-oat/40">{t("company")}</span>
            <Link href="/verification" className="hover:text-oat">{t("verification")}</Link>
            <Link href="/company" className="hover:text-oat">{t("about")}</Link>
            <Link href="/contact" className="hover:text-oat">{t("contact")}</Link>
            <div className="mono mt-3 text-[11px] uppercase leading-relaxed text-oat/50">
              <p className="text-oat/40">{t("locations")}</p>
              <p>Hong Kong · Amsterdam · Salt Lake City</p>
            </div>
            <Link href="/contact" className="mt-2 inline-block text-amber hover:underline">{t("requestQuote")}</Link>
          </div>
        </div>
      </div>
      {/* Registered operating entities — every company is Superfoods Partners */}
      <div className="border-t border-oat/10">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <span className="mono text-[10px] uppercase tracking-wide text-oat/40">{t("entities")}</span>
          <div className="mt-3 grid gap-6 sm:grid-cols-3">
            {ENTITIES.map((e) => (
              <div key={e.code}>
                <p className="text-sm text-oat">{e.name}</p>
                <p className="mono mt-1 text-[11px] leading-relaxed text-oat/50">
                  {e.address.join(", ")}, {e.country}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-oat/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-[11px] text-oat/50 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright")}</p>
          <a
            href="https://www.purematchapartners.com"
            target="_blank"
            rel="noopener"
            className="mono uppercase tracking-wide hover:text-oat"
          >
            Pure Matcha Partners — a Superfoods Partners brand ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
