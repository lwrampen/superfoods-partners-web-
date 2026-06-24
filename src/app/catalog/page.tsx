import type { Metadata } from "next";
import Link from "next/link";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CATEGORIES, PRODUCTS, ORIGINS } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Catalogue — bulk matcha & superfoods, verified at origin",
  description:
    "Browse Superfoods Partners' B2B catalogue: matcha (ceremonial, premium, culinary), hojicha, ube, lion's mane and 50+ origins — all lab-tested and documented.",
};

function ProductTile({ slug }: { slug: string }) {
  const p = PRODUCTS.find((x) => x.slug === slug)!;
  const origin = ORIGINS[p.originSlugs[0]];
  return (
    <Link
      href={`/catalog/${p.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1.5"
      style={{ backgroundColor: p.accent }}
    >
      {p.img && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center opacity-0 transition-opacity duration-[1800ms] ease-out group-hover:opacity-100"
            style={{ backgroundImage: `url(${p.img})` }}
          />
          <div className="absolute inset-0" style={{ backgroundColor: p.accent, opacity: 0.5 }} />
        </>
      )}
      <span className="relative mono text-[10px] uppercase tracking-wide text-white/70">{p.category}</span>
      <span className="relative">
        <span className="block text-3xl font-medium leading-tight" style={{ color: p.tint }}>{p.name}</span>
        <span className="mono mt-2 flex items-center gap-1 text-[10px] uppercase text-white/80">
          {origin.name.toUpperCase()} · {origin.country.toUpperCase()}
          <span className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
        </span>
      </span>
    </Link>
  );
}

export default function CatalogPage() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(01)</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Catalogue</span>
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-medium leading-tight text-green md:text-5xl">
              Bulk matcha & superfoods, verified at origin.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone">
              Category → product → variant. Every line lab-tested, documented and available from sample to full container.
            </p>
          </Reveal>
        </section>

        {CATEGORIES.map((cat) => {
          const items = PRODUCTS.filter((p) => p.category === cat);
          if (!items.length) return null;
          return (
            <section key={cat} className="mx-auto max-w-6xl px-6 pb-16">
              <Reveal className="mb-6 flex items-center gap-3">
                <h2 className="text-xl font-medium text-green">{cat}</h2>
                <span className="mono text-[11px] uppercase text-stone/40">{items.length} {items.length === 1 ? "line" : "lines"}</span>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.07}>
                    <ProductTile slug={p.slug} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}

        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <Reveal>
              <h2 className="text-3xl font-medium text-green">Don&apos;t see your origin?</h2>
              <p className="mx-auto mt-4 max-w-lg text-stone">
                We source 50+ origins across 8 countries. Tell us what you need and we&apos;ll find, verify and document it.
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
