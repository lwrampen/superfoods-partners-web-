import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { VariantSelector } from "@/components/VariantSelector";
import { ProductHero } from "@/components/ProductHero";
import { OriginPassport } from "@/components/OriginPassport";
import { Reveal } from "@/components/Reveal";
import { SourcingMap } from "@/components/SourcingMap";
import { PRODUCTS, ORIGINS, getProduct, originNote, productFaqs, originLabel } from "@/data/catalog";

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
    alternates: { canonical: `/catalog/${p.slug}` },
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

  const lead = p.gallery?.[0]; // hero-side supporting photo
  const strip = p.gallery?.slice(1) ?? []; // extra farm/people shots (compact strip)

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <ProductHero name={p.name} category={p.category} tagline={p.tagline} accent={p.accent} tint={p.tint} img={p.img} />

        {/* Intro — split: readable lead + one supporting image. Brings the page
            to life while staying compact (no full-width photo band). */}
        <section className="mx-auto max-w-6xl px-6 pt-12 md:pt-16">
          <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <p className="mono text-[11px] uppercase tracking-widest" style={{ color: p.accent }}>
                Bulk {p.name.toLowerCase()} supplier
              </p>
              <p className="mt-4 text-lg leading-relaxed text-stone md:text-xl">
                {p.intro ?? p.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                <Link
                  href={`/contact?product=${p.slug}`}
                  className="inline-block rounded-lg px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: p.accent }}
                >
                  Request a quote
                </Link>
                <span className="mono text-[11px] uppercase tracking-wide text-stone/50">
                  Lab report &amp; quote within 48 h
                </span>
              </div>
            </Reveal>
            {lead && (
              <Reveal delay={0.1}>
                <figure>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sand md:aspect-[5/6]">
                    <Image
                      src={lead.src}
                      alt={lead.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 520px"
                      priority
                    />
                  </div>
                  {lead.caption && (
                    <figcaption className="mono mt-2.5 text-[11px] leading-relaxed text-stone/60">{lead.caption}</figcaption>
                  )}
                </figure>
              </Reveal>
            )}
          </div>
        </section>

        {/* Order + at-a-glance — variant selector alongside a single compact
            facts panel (trade terms + specs merged for scannability). */}
        <section className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <VariantSelector product={p} />
              <p className="mono mt-4 flex items-center gap-2 text-[11px] uppercase text-stone/60">
                <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                Every batch ships with a Verification Record™ · routed via Hong Kong
              </p>
            </div>
            <div>
              <h2 className="display text-xl text-green">At a glance</h2>
              <dl className="mono mt-5 divide-y divide-stone/12 border-t border-stone/15 text-sm">
                {[
                  { label: "MOQ", value: "25 kg → full container" },
                  { label: "Lead time", value: "2–4 weeks via Hong Kong" },
                  { label: "Incoterms", value: "FOB / CIF / DDP" },
                  ...(p.specs ?? []),
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="text-stone/50 uppercase text-[11px]">{s.label}</dt>
                    <dd className="text-right text-green">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.certs.map((c) => (
                  <span key={c} className="mono rounded-lg border px-3 py-1.5 text-[10px] uppercase" style={{ borderColor: `${p.accent}40`, color: p.accent }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Applications — full-width compact chip row (buyer long-tail) */}
        {p.applications?.length ? (
          <section className="border-t border-stone/10">
            <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="display text-2xl text-green">Applications</h2>
                <p className="max-w-md text-sm leading-relaxed text-stone/70">
                  Where buyers put {p.name.toLowerCase()} to work — across beverage, bakery and functional formats.
                </p>
              </div>
              <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                {p.applications.map((a) => (
                  <li
                    key={a}
                    className="flex items-center gap-2 rounded-lg border border-stone/12 bg-sand/50 px-3.5 py-3 text-sm text-stone"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: p.accent }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* Extra farm / people photography — compact, height-limited strip */}
        {strip.length > 0 && (
          <section className="mx-auto max-w-6xl px-6 pt-14 md:pt-16">
            <div className="grid gap-4 sm:grid-cols-2">
              {strip.map((g, i) => (
                <Reveal key={g.src} delay={i * 0.08}>
                  <figure>
                    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-sand">
                      <Image src={g.src} alt={g.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 560px" />
                    </div>
                    {g.caption && (
                      <figcaption className="mono mt-2 text-[11px] leading-relaxed text-stone/60">{g.caption}</figcaption>
                    )}
                  </figure>
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* Where this comes from — hand-drawn map: origin countries → Hong Kong hub */}
        <section className="border-t border-stone/10 bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
              <div className="max-w-md">
                <p className="mono text-[11px] uppercase tracking-widest" style={{ color: p.accent }}>
                  Where it comes from
                </p>
                <h2 className="mt-3 display text-2xl leading-tight text-green md:text-3xl">
                  {p.name.charAt(0) + p.name.slice(1).toLowerCase()}, sourced at origin.
                </h2>
                <p className="mt-4 leading-relaxed text-stone">
                  {origins.length > 1
                    ? `We source ${p.name.toLowerCase()} directly from ${origins.length} regions, then consolidate and document every batch through our Hong Kong hub before it reaches you.`
                    : `We source ${p.name.toLowerCase()} directly in ${origins[0].country}, then consolidate and document every batch through our Hong Kong hub before it reaches you.`}
                </p>
                <ul className="mono mt-6 flex flex-wrap gap-2">
                  {origins.map((o) => (
                    <li key={o.slug}>
                      <Link href={`/origins/${o.slug}`} className="inline-block rounded-lg border border-stone/20 px-3 py-1.5 text-[11px] uppercase text-stone transition-colors hover:border-green hover:text-green">
                        {originLabel(o)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-stone/12 bg-oat/70 p-3 md:p-5">
                <SourcingMap productSlug={p.slug} />
              </div>
            </div>
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
                      {originLabel(o)}
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
              <h2 className="display text-2xl text-green md:text-3xl">
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
