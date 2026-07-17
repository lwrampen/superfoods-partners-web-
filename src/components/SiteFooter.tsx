import Image from "next/image";
import Link from "next/link";
import { PRODUCTS, ORIGIN_LIST } from "@/data/catalog";

// Group origins by country so the footer stays scannable while still exposing
// a direct crawl link to every origin page.
const ORIGINS_BY_COUNTRY = ORIGIN_LIST.reduce<Record<string, typeof ORIGIN_LIST>>((acc, o) => {
  (acc[o.country] ??= []).push(o);
  return acc;
}, {});

export function SiteFooter() {
  return (
    <footer className="bg-forest text-oat/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4 md:max-w-[220px] md:flex-col md:items-start">
          <Image src="/logos/sfp-roundel-reversed.svg" alt="" width={52} height={52} />
          <div>
            <p className="font-medium text-oat">Superfoods Partners</p>
            <p className="mono text-[11px] uppercase">Sourced at scale. Trusted at origin.</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-10 gap-y-8 sm:grid-cols-3">
          {/* Direct links to every product — a crawl path from every page. */}
          <div className="flex flex-col gap-2 text-sm">
            <span className="mono text-[10px] uppercase tracking-wide text-oat/40">Catalogue</span>
            {PRODUCTS.map((p) => (
              <Link key={p.slug} href={`/catalog/${p.slug}`} className="capitalize hover:text-oat">
                {p.name.toLowerCase()}
              </Link>
            ))}
            <Link href="/catalog" className="mt-1 text-oat/50 hover:text-oat">All products →</Link>
          </div>

          {/* Direct links to every origin page, grouped by country. */}
          <div className="col-span-2 flex flex-col gap-3 text-sm sm:col-span-1">
            <span className="mono text-[10px] uppercase tracking-wide text-oat/40">Origins</span>
            {Object.entries(ORIGINS_BY_COUNTRY).map(([country, origins]) => (
              <div key={country} className="flex flex-col gap-1">
                <span className="mono text-[10px] uppercase text-oat/30">{country}</span>
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {origins.map((o) => (
                    <Link key={o.slug} href={`/origins/${o.slug}`} className="hover:text-oat">
                      {o.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link href="/origins" className="mt-1 text-oat/50 hover:text-oat">All origins →</Link>
          </div>

          <div className="flex flex-col gap-2 text-sm">
            <span className="mono text-[10px] uppercase tracking-wide text-oat/40">Company</span>
            <Link href="/verification" className="hover:text-oat">Verification</Link>
            <Link href="/about" className="hover:text-oat">About</Link>
            <Link href="/contact" className="hover:text-oat">Contact</Link>
            <div className="mono mt-3 text-[11px] uppercase leading-relaxed text-oat/50">
              <p className="text-oat/40">Hong Kong hub</p>
              <p>22.32°N 114.17°E</p>
            </div>
            <Link href="/contact" className="mt-2 inline-block text-amber hover:underline">Request a quote →</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-oat/10">
        <p className="mx-auto max-w-6xl px-6 py-5 text-[11px] text-oat/50">
          © 2026 Superfoods Partners — A Pure Matcha Partners company.
        </p>
      </div>
    </footer>
  );
}
