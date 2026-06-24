import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { ORIGIN_LIST, productsForOrigin } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Origins — 50+ verified sources across 8 countries",
  description:
    "From Uji to Luzon, every Superfoods Partners origin is mapped, lab-tested and routed through one trusted hub in Hong Kong. Explore our sourcing network.",
};

const STATS = [
  { v: "50+", l: "ORIGINS" },
  { v: "8", l: "COUNTRIES" },
  { v: "100%", l: "BATCH-TESTED" },
  { v: "1", l: "HUB · HONG KONG", amber: true },
];

export default function OriginsPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(01)</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Origins</span>
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-medium leading-tight text-green md:text-5xl">
              Every origin in the world, routed through one hub.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone">
              We hold direct relationships at source across 8 countries. Each batch is tested and documented before it ships — origin to Hong Kong to your facility.
            </p>
          </Reveal>
        </section>

        <section className="bg-green text-oat">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l}>
                <p className={`text-5xl font-medium ${s.amber ? "text-amber" : "text-oat"}`}>{s.v}</p>
                <p className="mono mt-3 text-[11px] uppercase tracking-wide text-oat/60">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <Reveal className="mb-8">
            <h2 className="text-xl font-medium text-green">Featured origins</h2>
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
                    <p className="mt-3 text-2xl font-medium text-green">{o.name}</p>
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
              <h2 className="text-3xl font-medium text-green">Need an origin we haven&apos;t listed?</h2>
              <p className="mx-auto mt-4 max-w-lg text-stone">
                Our network runs deeper than this page. Tell us the product and origin you need — we&apos;ll find, verify and document it.
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
