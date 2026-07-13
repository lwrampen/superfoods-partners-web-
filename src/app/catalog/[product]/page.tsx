import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { VariantSelector } from "@/components/VariantSelector";
import { ProductHero } from "@/components/ProductHero";
import { OriginPassport } from "@/components/OriginPassport";
import { PRODUCTS, ORIGINS, getProduct, originNote, productFaqs } from "@/data/catalog";

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
  const passportNotes = Object.fromEntries(origins.map((o) => [o.slug, originNote(p.slug, o.slug)]));
  const faqs = productFaqs(p.slug);
  // Interne links: crawl-paden naar origin- en andere product-pagina's (helpt indexatie).
  const sameCat = PRODUCTS.filter((x) => x.category === p.category && x.slug !== p.slug);
  const related = (sameCat.length ? sameCat : PRODUCTS.filter((x) => x.slug !== p.slug)).slice(0, 4);

  // B2B wholesale is quote-based (RFQ): no public price and no reviews, so a
  // Product snippet can never satisfy Google's offers/review/aggregateRating
  // requirement. Instead of emitting Product markup that will always be flagged,
  // we ship an accurate BreadcrumbList (eligible, no merchant requirements) and
  // rely on site-wide Organization schema for brand context.
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.superfoodspartners.com/" },
      { "@type": "ListItem", position: 2, name: "Catalogue", item: "https://www.superfoodspartners.com/catalog" },
      { "@type": "ListItem", position: 3, name: p.name, item: `https://www.superfoodspartners.com/catalog/${p.slug}` },
    ],
  };
  // FAQPage: accurate Q&A drawn from the product's own data — eligible (no offers/review
  // requirement) and citable in AI/GEO answers.
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const jsonLd = [breadcrumb, faqLd];

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <ProductHero name={p.name} category={p.category} tagline={p.tagline} accent={p.accent} tint={p.tint} img={p.img} />

        {/* Detail + variant selector */}
        <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:py-20">
          <div>
            <p className="leading-relaxed text-stone">{p.description}</p>

            <div className="mono mt-8 grid grid-cols-2 gap-y-4 border-t border-stone/15 pt-6 text-sm">
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

        <OriginPassport origins={origins} notes={passportNotes} accent={p.accent} />

        {/* Interne links — crawl-paden naar origin- & gerelateerde productpagina's (indexatie) */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">Origins for {p.name.toLowerCase()}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {origins.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/origins/${o.slug}`} className="mono inline-block rounded-lg border border-stone/20 px-3 py-1.5 text-[11px] uppercase text-stone transition-colors hover:border-green hover:text-green">
                      {o.name}, {o.country}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {related.length > 0 && (
              <div>
                <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">More from the catalogue</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/catalog/${r.slug}`} className="mono inline-block rounded-lg border border-stone/20 px-3 py-1.5 text-[11px] uppercase text-stone transition-colors hover:border-green hover:text-green">
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/catalog" className="mono mt-4 inline-block text-[11px] uppercase tracking-wide text-green">View full catalogue →</Link>
              </div>
            )}
          </div>
        </section>

        {/* Buyer-intent FAQ — content depth for B2B long-tail + citable Q&A for AI/GEO */}
        {faqs.length > 0 && (
          <section className="border-t border-stone/10 bg-sand">
            <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
              <h2 className="text-2xl font-medium text-green md:text-3xl">
                Sourcing {p.name.toLowerCase()} — common questions
              </h2>
              <dl className="mt-8 divide-y divide-stone/15">
                {faqs.map((f) => (
                  <div key={f.q} className="py-5">
                    <dt className="font-medium text-green">{f.q}</dt>
                    <dd className="mt-2 leading-relaxed text-stone">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
