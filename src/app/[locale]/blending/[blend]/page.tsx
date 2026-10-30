import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor, localizedUrl } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { BlendSwatch } from "@/components/BlendSwatch";
import { BLENDS, BLEND_MOQ_KG, getBlend } from "@/data/blends";
import { getProduct } from "@/data/catalog";
import { localizeProduct } from "@/data/content.i18n";

const PMP_BLENDS = "https://www.purematchapartners.com/custom-matcha-blends";

export function generateStaticParams() {
  return BLENDS.map((b) => ({ blend: b.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; blend: string }>;
}): Promise<Metadata> {
  const { locale, blend } = await params;
  if (!getBlend(blend)) return {};
  const t = await getTranslations({ locale, namespace: "blending" });
  return {
    title: t(`blends.${blend}.metaTitle`),
    description: t(`blends.${blend}.metaDescription`, { kg: BLEND_MOQ_KG }),
    alternates: alternatesFor(locale, `/blending/${blend}`),
  };
}

export default async function BlendPage({ params }: { params: Promise<{ locale: string; blend: string }> }) {
  const { locale, blend: slug } = await params;
  setRequestLocale(locale);
  const blend = getBlend(slug);
  if (!blend) notFound();
  const t = await getTranslations("blending");
  const k = (key: string) => `blends.${slug}.${key}`;

  const name = t(k("name"));
  const labels: [string, string] = [t(`parts.${blend.parts[0].key}`), t(`parts.${blend.parts[1].key}`)];
  const applications = t.raw(k("applications")) as string[];
  const specs = [
    { l: t("specRatio"), v: t("specRatioV") },
    { l: t("specBase"), v: t.has(k("base")) ? t(k("base")) : t("specBaseV") },
    { l: t("specFormat"), v: t("specFormatV") },
    { l: t("specMoq"), v: t("factMoq", { kg: BLEND_MOQ_KG }) },
  ];
  const faqs = [
    { q: t(k("faq1Q")), a: t(k("faq1A")) },
    { q: t(k("faq2Q")), a: t(k("faq2A")) },
    { q: t("faq.moqQ"), a: t("faq.moqA", { kg: BLEND_MOQ_KG }) },
  ];
  const others = BLENDS.filter((b) => b.slug !== slug);
  const contact = `/contact?service=blend&blend=${slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Superfoods Partners", item: localizedUrl(locale, "/") },
        { "@type": "ListItem", position: 2, name: t("crumb"), item: localizedUrl(locale, "/blending") },
        { "@type": "ListItem", position: 3, name, item: localizedUrl(locale, `/blending/${slug}`) },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-12 pb-16 md:grid-cols-[1.1fr_0.9fr] md:pt-20 md:pb-20">
          <Reveal>
            <Link href="/blending" className="mono text-[11px] uppercase tracking-wide text-stone/60 transition-colors hover:text-green">
              ← {t("crumb")}
            </Link>
            <p className="mono mt-6 text-[11px] uppercase tracking-widest text-amber">{t("blendEyebrow")}</p>
            <h1 className="display mt-3 text-5xl leading-[1.04] text-green md:text-6xl">{name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">{t(k("intro"))}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={contact} className="rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaThisBlend")}
              </Link>
              <Link href="/packaging" className="rounded-lg border border-stone/25 px-6 py-3.5 text-sm font-medium text-green transition-colors hover:border-green">
                {t("ctaPackaging")} →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <BlendSwatch parts={blend.parts} labels={labels} className="aspect-[4/5]" priority />
          </Reveal>
        </section>

        {/* SPEC */}
        <section className="border-y border-stone/15 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {specs.map((s) => (
              <div key={s.l}>
                <p className="mono text-[10px] uppercase tracking-widest text-stone/50">{s.l}</p>
                <p className="mt-2 text-base text-green">{s.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FLAVOUR + USE */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <h2 className="display text-3xl leading-tight text-green">{t("flavourHeading")}</h2>
              <p className="mt-4 text-lg leading-relaxed text-stone">{t(k("flavour"))}</p>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display text-3xl leading-tight text-green">{t("useHeading")}</h2>
              <p className="mt-4 text-lg leading-relaxed text-stone">{t(k("use"))}</p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {applications.map((a) => (
                  <li key={a} className="rounded-lg border border-stone/20 bg-white px-3 py-1.5 text-sm text-stone">{a}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* COMPONENTS */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("componentsHeading")}</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {blend.parts.map((part) => {
                const base = part.product ? getProduct(part.product) : undefined;
                const prod = base ? localizeProduct(base, locale) : undefined;
                const body = (
                  <>
                    <span className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: part.color }} />
                      <span className="display text-xl text-green">{t(`parts.${part.key}`)}</span>
                    </span>
                    <span className="mt-2 block text-sm leading-relaxed text-stone">{prod ? prod.description : t("proteinBody")}</span>
                    {prod && <span className="mono mt-3 inline-block text-[11px] uppercase tracking-wide text-green">{t("viewIngredient")} →</span>}
                  </>
                );
                return prod ? (
                  <Link key={part.key} href={`/products/${prod.slug}`} className="rounded-xl border border-stone/15 bg-white p-6 transition-colors hover:border-green">
                    {body}
                  </Link>
                ) : (
                  <div key={part.key} className="rounded-xl border border-stone/15 bg-white p-6">{body}</div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <h2 className="display text-2xl text-green md:text-3xl">{t("faqHeadingBlend", { name })}</h2>
          <dl className="mt-8 divide-y divide-stone/15">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-medium text-green">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-stone">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* OTHER BLENDS + CTA */}
        <section className="border-t border-stone/10 bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("otherBlends")}</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {others.map((b) => (
                <li key={b.slug}>
                  <Link href={`/blending/${b.slug}`} className="inline-block rounded-lg border border-stone/20 bg-oat px-3 py-1.5 text-sm text-stone transition-colors hover:border-green hover:text-green">
                    {t(`blends.${b.slug}.name`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blending" className="inline-block rounded-lg border border-stone/20 bg-oat px-3 py-1.5 text-sm text-stone transition-colors hover:border-green hover:text-green">
                  {t("allBlending")}
                </Link>
              </li>
            </ul>
            <p className="mt-8 text-sm text-stone/80">
              {t("pmpNote")}{" "}
              <a href={PMP_BLENDS} target="_blank" rel="noopener" className="text-green underline-offset-4 hover:underline">
                {t("pmpLink")} ↗
              </a>
            </p>
            <Link href={contact} className="mt-10 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
              {t("ctaThisBlend")}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
