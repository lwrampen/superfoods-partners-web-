import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { VariantSelector } from "@/components/VariantSelector";
import { PRODUCTS, ORIGINS, getProduct } from "@/data/catalog";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ product: string }> }): Promise<Metadata> {
  const { product } = await params;
  const p = getProduct(product);
  if (!p) return {};
  const origin = ORIGINS[p.originSlugs[0]];
  return {
    title: `Bulk ${p.name} — ${origin.name}, ${origin.country} | wholesale supplier`,
    description: `${p.tagline} ${p.description}`,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ product: string }> }) {
  const { product } = await params;
  const p = getProduct(product);
  if (!p) notFound();

  const origins = p.originSlugs.map((s) => ORIGINS[s]);
  const primary = origins[0];

  // B2B wholesale is quote-based (RFQ): no public price and no reviews, so a
  // Product snippet can never satisfy Google's offers/review/aggregateRating
  // requirement. Instead of emitting Product markup that will always be flagged,
  // we ship an accurate BreadcrumbList (eligible, no merchant requirements) and
  // rely on site-wide Organization schema for brand context.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.superfoodspartners.com/" },
      { "@type": "ListItem", position: 2, name: "Catalogue", item: "https://www.superfoodspartners.com/catalog" },
      { "@type": "ListItem", position: 3, name: p.name, item: `https://www.superfoodspartners.com/catalog/${p.slug}` },
    ],
  };

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* Immersive macro hero — the powder texture you can almost feel */}
        <section className="relative isolate overflow-hidden" style={{ backgroundColor: p.accent }}>
          {p.img && (
            <>
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.img})` }} aria-hidden />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${p.accent}, ${p.accent}cc 45%, ${p.accent}66)` }} aria-hidden />
            </>
          )}
          <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32">
            <Link href="/catalog" className="mono text-[11px] uppercase tracking-wide text-white/60 transition-colors hover:text-white">
              ← Catalogue
            </Link>
            <p className="mono mt-6 text-[11px] uppercase tracking-widest text-white/70">{p.category}</p>
            <h1 className="mt-3 text-6xl font-medium leading-[0.95] md:text-7xl" style={{ color: p.tint }}>
              {p.name}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">{p.tagline}</p>
          </div>
        </section>

        {/* Detail + variant selector */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="leading-relaxed text-stone">{p.description}</p>

            <div className="mono mt-8 grid grid-cols-2 gap-y-4 border-t border-stone/15 pt-6 text-sm">
              <span className="text-stone/50 uppercase text-[11px]">Origins</span>
              <span className="text-green">{origins.map((o) => `${o.name}, ${o.countryCode}`).join(" · ")}</span>
              <span className="text-stone/50 uppercase text-[11px]">MOQ</span>
              <span className="text-green">25 kg → full container</span>
              <span className="text-stone/50 uppercase text-[11px]">Lead time</span>
              <span className="text-green">2–4 weeks via Hong Kong</span>
              <span className="text-stone/50 uppercase text-[11px]">Incoterms</span>
              <span className="text-green">FOB / CIF / DDP</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {p.certs.map((c) => (
                <span key={c} className="mono rounded-lg border px-3 py-1.5 text-[10px] uppercase" style={{ borderColor: `${p.accent}40`, color: p.accent }}>
                  {c}
                </span>
              ))}
            </div>

            <Link
              href={`/contact?product=${p.slug}`}
              className="mt-9 inline-block rounded-lg px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: p.accent }}
            >
              Request a quote for {p.name}
            </Link>
            <p className="mono mt-4 text-[11px] uppercase tracking-wide text-stone/50">
              Lab report &amp; quote within 48 hours
            </p>
          </div>

          <div>
            <VariantSelector product={p} />
            <p className="mono mt-4 flex items-center gap-2 text-[11px] uppercase text-stone/60">
              <span className="h-2.5 w-2.5 rounded-full bg-amber" />
              Every batch ships with a Verification Record™ · routed via Hong Kong
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
