import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { OriginPhoto } from "@/components/OriginPhoto";
import { TradeGlobe } from "@/components/TradeGlobe";
import { ORIGIN_LIST, productsForOrigin } from "@/data/catalog";

const ORIGIN_COUNT = ORIGIN_LIST.length;
const COUNTRY_LIST = [...new Set(ORIGIN_LIST.map((o) => o.country))];
const COUNTRY_COUNT = COUNTRY_LIST.length;

export const metadata: Metadata = {
  title: `Origins — ${ORIGIN_COUNT} verified sources across ${COUNTRY_COUNT} countries`,
  description: `Across ${COUNTRY_LIST.join(", ")}, every Superfoods Partners origin is mapped, lab-tested and routed through one trusted hub in Hong Kong. Explore our sourcing network.`,
};

const STATS = [
  { v: String(ORIGIN_COUNT), l: "ORIGINS" },
  { v: String(COUNTRY_COUNT), l: "COUNTRIES" },
  { v: "100%", l: "BATCH-TESTED" },
  { v: "1", l: "HUB · HONG KONG", amber: true },
];

export default function OriginsPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-[1.05fr_0.95fr] md:pt-24 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(01)</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Origins</span>
            </div>
            <h1 className="display mt-5 max-w-2xl text-5xl leading-[1.04] text-green md:text-6xl">
              Every origin in the world, routed through one hub.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone">
              We hold direct relationships at source across {COUNTRY_COUNT} countries. Each batch is
              tested and documented before it ships — origin to Hong Kong to your facility.
            </p>
          </Reveal>
          <Reveal delay={0.12} y={28}>
            <OriginPhoto
              src="/photos/field-sky.jpg"
              alt="Tea terraces under a working sky"
              caption="ORIGIN — TEA COUNTRY AT SEASON"
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/3] w-full shadow-[0_30px_80px_-40px_rgba(20,39,27,0.55)]"
            />
          </Reveal>
        </section>

        <section className="bg-forest">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="mb-6 flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(02)</span>
              <span className="h-px w-8 bg-oat/25" />
              <span className="mono text-[11px] uppercase tracking-widest text-oat/55">Global trade map</span>
            </div>
            <h2 className="display max-w-2xl text-3xl leading-tight text-oat md:text-4xl">
              Where we source — and where we sell.
            </h2>
            <p className="mt-4 max-w-xl text-oat/70">
              Drag to spin the globe, scroll to zoom, and hover any point. Green marks where we source;
              amber marks the markets we serve — all routed through one hub in Hong Kong.
            </p>

            <div className="mt-9">
              <TradeGlobe />
            </div>

            <div className="mono mt-6 flex flex-wrap gap-x-7 gap-y-3 text-[11px] uppercase tracking-wide text-oat/65">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#7FD9A6" }} />
                Sourcing · {ORIGIN_LIST.length} origins
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-3 rounded-sm" style={{ backgroundColor: "#E0A23E" }} />
                Markets · US · EU (via Pure Matcha Partners) · Middle East
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2" style={{ borderColor: "#E0A23E" }} />
                Hub · Hong Kong
              </span>
            </div>
          </div>
        </section>

        <section className="bg-green text-oat">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l}>
                <p className={`display text-5xl ${s.amber ? "text-amber" : "text-oat"}`}>{s.v}</p>
                <p className="mono mt-3 text-[11px] uppercase tracking-wide text-oat/60">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <Reveal className="mb-8">
            <h2 className="display text-3xl text-green">Featured origins</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORIGIN_LIST.map((o, i) => {
              const products = productsForOrigin(o.slug);
              const accent = products[0]?.accent ?? "#1E3D2A";
              return (
                <Reveal key={o.slug} delay={i * 0.06}>
                  <Link
                    href={`/origins/${o.slug}`}
                    className="group block rounded-xl border border-stone/15 bg-sand p-6 transition-colors hover:border-green/30"
                  >
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
                      <span className="mono text-[10px] uppercase tracking-wide text-stone/50">{o.country}</span>
                    </span>
                    <p className="display mt-3 text-2xl text-green">{o.name}</p>
                    <p className="mono mt-1 text-[11px] uppercase text-stone/50">{o.coords}</p>
                    <p className="mt-4 text-sm text-stone">
                      {products.map((p) => p.name).join(" · ") || "Multiple lines"}
                    </p>
                    <span className="mono mt-4 inline-flex items-center gap-1 text-[10px] uppercase text-stone/50 transition-colors group-hover:text-green">
                      View origin
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <Reveal>
              <h2 className="display text-3xl text-green md:text-4xl">Need an origin we haven&apos;t listed?</h2>
              <p className="mx-auto mt-4 max-w-lg text-stone">
                Our network runs deeper than this page. Tell us the product and origin you need —
                we&apos;ll find, verify and document it.
              </p>
              <Link href="/contact" className="mt-8 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                Request a volume quote
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
