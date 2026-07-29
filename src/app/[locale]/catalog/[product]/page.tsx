import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { VariantSelector } from "@/components/VariantSelector";
import { ProductHero } from "@/components/ProductHero";
import { OriginPassport } from "@/components/OriginPassport";
import { Reveal } from "@/components/Reveal";
import { SourcingMap } from "@/components/SourcingMap";
import { Link } from "@/i18n/navigation";
import { alternatesFor, localizedUrl } from "@/i18n/paths";
import { PRODUCTS, ORIGINS, getProduct, originNote, originLabel } from "@/data/catalog";
import { toCert } from "@/data/trust";
import { localizeProduct, localizeOrigin, localizedBlurb, formLabel } from "@/data/content.i18n";

export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; product: string }>;
}): Promise<Metadata> {
  const { locale, product } = await params;
  const base = getProduct(product);
  if (!base) return {};
  const p = localizeProduct(base, locale);
  const origin = localizeOrigin(ORIGINS[p.originSlugs[0]], locale);
  const t = await getTranslations({ locale, namespace: "pdp" });
  return {
    title: t("metaTitle", { name: p.name, origin: origin.name, country: origin.country }),
    description: t("metaDescription", { name: p.name, origin: origin.name, country: origin.country }),
    alternates: alternatesFor(locale, `/catalog/${p.slug}`),
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; product: string }>;
}) {
  const { locale, product } = await params;
  setRequestLocale(locale);
  const base = getProduct(product);
  if (!base) notFound();
  const p = localizeProduct(base, locale);
  const t = await getTranslations("pdp");
  const tf = await getTranslations("faq");
  const and = ` ${t("andWord")} `;

  const origins = p.originSlugs.map((s) => localizeOrigin(ORIGINS[s], locale));
  const passportNotes = Object.fromEntries(
    origins.map((o) => [o.slug, localizedBlurb(o.slug, locale, originNote(p.slug, o.slug))]),
  );
  const sameCat = PRODUCTS.filter((x) => x.category === base.category && x.slug !== p.slug);
  const related = (sameCat.length ? sameCat : PRODUCTS.filter((x) => x.slug !== p.slug)).slice(0, 4);

  // FAQ built from the message catalog so it is fully localized.
  const nameLc = p.name.toLowerCase();
  const certs = p.certs.join(", ");
  const countries =
    [...new Set(origins.map((o) => o.country).filter(Boolean))].join(and) || tf("vettedOrigins");
  const faqs: { q: string; a: string }[] = [
    { q: tf("moqQ", { name: nameLc }), a: tf("moqA", { name: nameLc }) },
    { q: tf("certsQ", { name: nameLc }), a: tf("certsA", { name: nameLc, certs }) },
    { q: tf("sourceQ", { name: nameLc }), a: tf("sourceA", { name: nameLc, countries }) },
    { q: tf("plQ", { name: nameLc }), a: tf("plA", { name: nameLc }) },
    { q: tf("shipQ", { name: nameLc }), a: tf("shipA", { name: nameLc }) },
  ];
  if (p.grades?.length) {
    faqs.push({
      q: tf("gradesQ", { name: nameLc }),
      a: tf("gradesA", {
        name: p.name,
        grades: p.grades.join(", ").toLowerCase(),
        forms: p.forms.map((f) => formLabel(f, locale)).join(and).toLowerCase(),
      }),
    });
  } else if (p.forms.includes("Organic")) {
    faqs.push({ q: tf("organicQ", { name: nameLc }), a: tf("organicA", { name: nameLc }) });
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t("crumbHome"), item: localizedUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name: t("crumbCatalogue"), item: localizedUrl(locale, "/catalog") },
      { "@type": "ListItem", position: 3, name: p.name, item: localizedUrl(locale, `/catalog/${p.slug}`) },
    ],
  };
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  // Product schema — B2B/quote-based, so no price Offer (avoids invalid
  // merchant-listing markup); brand, category and origins carry the signal.
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.description,
    category: p.category,
    image: `https://www.superfoodspartners.com${p.img}`,
    url: localizedUrl(locale, `/catalog/${p.slug}`),
    brand: { "@type": "Brand", name: "Superfoods Partners" },
    countryOfOrigin: [...new Set(origins.map((o) => o.country).filter(Boolean))],
    additionalProperty: [
      { "@type": "PropertyValue", name: "MOQ", value: "25 kg" },
      { "@type": "PropertyValue", name: "Certifications", value: certs },
    ],
  };
  const jsonLd = [breadcrumb, productLd, faqLd];

  const lead = p.gallery?.[0];
  const strip = p.gallery?.slice(1) ?? [];

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <ProductHero name={p.name} category={p.category} tagline={p.tagline} accent={p.accent} tint={p.tint} img={p.img} />

        {/* Intro — split: readable lead + one supporting image */}
        <section className="mx-auto max-w-6xl px-6 pt-12 md:pt-16">
          <div className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="mono text-[11px] uppercase tracking-widest" style={{ color: p.accent }}>
                {t("bulkSupplier", { name: p.name.toLowerCase() })}
              </p>
              <p className="mt-4 text-lg leading-relaxed text-stone md:text-xl">{p.intro ?? p.description}</p>
              <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
                <Link
                  href={`/contact?product=${p.slug}`}
                  className="inline-block rounded-lg px-6 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: p.accent }}
                >
                  {t("requestQuote")}
                </Link>
                <span className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("labReport")}</span>
              </div>
            </div>
            {lead && (
              <div>
                <figure>
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sand md:aspect-[5/6]">
                    <Image src={lead.src} alt={lead.alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 520px" priority />
                  </div>
                  {lead.caption && (
                    <figcaption className="mono mt-2.5 text-[11px] leading-relaxed text-stone/60">{lead.caption}</figcaption>
                  )}
                </figure>
              </div>
            )}
          </div>
        </section>

        {/* Order + at-a-glance */}
        <section className="mx-auto max-w-6xl px-6 py-14 md:py-16">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <VariantSelector product={p} />
              <p className="mono mt-4 flex items-center gap-2 text-[11px] uppercase text-stone/60">
                <span className="h-2.5 w-2.5 rounded-full bg-amber" />
                {t("everyBatch")}
              </p>
            </div>
            <div>
              <h2 className="display text-xl text-green">{t("atGlance")}</h2>
              <dl className="mono mt-5 divide-y divide-stone/12 border-t border-stone/15 text-sm">
                {[
                  { label: t("moq"), value: t("moqValue") },
                  { label: t("leadTime"), value: t("leadValue") },
                  { label: t("incoterms"), value: t("incotermsValue") },
                  ...(p.specs ?? []),
                ].map((s) => (
                  <div key={s.label} className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="text-stone/50 uppercase text-[11px]">{s.label}</dt>
                    <dd className="text-right text-green">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                {p.certs.map(toCert).map((c) => (
                  <span
                    key={c.name}
                    title={c.name}
                    className="flex h-9 items-center gap-2 rounded-lg border border-stone/12 bg-white px-3"
                  >
                    {c.logo ? (
                      <Image src={c.logo} alt={c.name} width={120} height={40} className="max-h-5 w-auto object-contain" />
                    ) : (
                      <span className="mono text-[10px] uppercase text-stone/70">{c.name}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Grades — "which grade for what" (products that have grades, e.g. matcha) */}
        {p.gradeNotes?.length ? (
          <section className="border-t border-stone/10">
            <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
              <h2 className="display text-2xl text-green">{t("gradesTitle")}</h2>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {p.gradeNotes.map((g) => (
                  <div key={g.grade} className="rounded-xl border border-stone/15 bg-sand p-6">
                    <p className="mono text-[11px] uppercase tracking-wide" style={{ color: p.accent }}>{g.grade}</p>
                    <p className="mt-3 text-sm leading-relaxed text-stone">{g.use}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* Applications */}
        {p.applications?.length ? (
          <section className="border-t border-stone/10">
            <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <h2 className="display text-2xl text-green">{t("applications")}</h2>
                <p className="max-w-md text-sm leading-relaxed text-stone/70">
                  {t("applicationsBody", { name: p.name.toLowerCase() })}
                </p>
              </div>
              <ul className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
                {p.applications.map((a) => (
                  <li key={a} className="flex items-center gap-2 rounded-lg border border-stone/12 bg-sand/50 px-3.5 py-3 text-sm text-stone">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ backgroundColor: p.accent }} />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        {/* Extra farm / people photography */}
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

        {/* Where this comes from */}
        <section className="border-t border-stone/10 bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_1.1fr]">
              <div className="max-w-md">
                <p className="mono text-[11px] uppercase tracking-widest" style={{ color: p.accent }}>{t("whereFrom")}</p>
                <h2 className="mt-3 display text-2xl leading-tight text-green md:text-3xl">
                  {t("sourcedAtOrigin", { name: p.name.charAt(0) + p.name.slice(1).toLowerCase() })}
                </h2>
                <p className="mt-4 leading-relaxed text-stone">
                  {origins.length > 1
                    ? t("sourceMulti", { name: p.name.toLowerCase(), count: origins.length })
                    : t("sourceSingle", { name: p.name.toLowerCase(), country: origins[0].country })}
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

        {/* Internal links */}
        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("originsFor", { name: p.name.toLowerCase() })}</h2>
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
                <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("moreCatalogue")}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link href={`/catalog/${r.slug}`} className="mono inline-block rounded-lg border border-stone/20 px-3 py-1.5 text-[11px] uppercase text-stone transition-colors hover:border-green hover:text-green">
                        {r.name}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link href="/catalog" className="mono mt-4 inline-block text-[11px] uppercase tracking-wide text-green">{t("viewCatalogue")}</Link>
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        {faqs.length > 0 && (
          <section className="border-t border-stone/10 bg-sand">
            <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
              <h2 className="display text-2xl text-green md:text-3xl">{t("faqHeading", { name: p.name.toLowerCase() })}</h2>
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
