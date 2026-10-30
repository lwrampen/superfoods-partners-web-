import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor, localizedUrl } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { BlendSwatch } from "@/components/BlendSwatch";
import { TinArt, PouchArt, CustomArt } from "@/components/PackagingArt";
import { BLENDS, BLEND_MOQ_KG } from "@/data/blends";

// Blending & packaging hub: multi-ingredient blends developed with the buyer.
// Matcha-only blends and private label matcha are Pure Matcha Partners' (link out).
const PATH = "/blending";
const PMP_BLENDS = "https://www.purematchapartners.com/custom-matcha-blends";
const STEPS = [1, 2, 3, 4, 5] as const;
const FAQ_KEYS = ["moq", "organic", "protein", "pack", "sample"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blending" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription", { kg: BLEND_MOQ_KG }),
    alternates: alternatesFor(locale, PATH),
  };
}

export default async function BlendingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blending");

  const facts = [
    { l: t("factMoqLabel"), v: t("factMoq", { kg: BLEND_MOQ_KG }) },
    { l: t("factFormsLabel"), v: t("factForms") },
    { l: t("factDocsLabel"), v: t("factDocs") },
    { l: t("factPackLabel"), v: t("factPack") },
  ];
  const faqs = FAQ_KEYS.map((k) => ({ q: t(`faq.${k}Q`), a: t(`faq.${k}A`, { kg: BLEND_MOQ_KG }) }));
  const partLabel = (key: string) => t(`parts.${key}`);
  const hero = BLENDS[1];

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: t("metaTitle"),
      serviceType: "Custom powder blending and packaging",
      description: t("metaDescription", { kg: BLEND_MOQ_KG }),
      provider: { "@type": "Organization", name: "Superfoods Partners", url: localizedUrl(locale, "/") },
      url: localizedUrl(locale, PATH),
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
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-[1.1fr_0.9fr] md:pt-24 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">{t("eyebrow")}</span>
              <span className="h-px w-8 bg-stone/30" />
            </div>
            <h1 className="display mt-5 text-5xl leading-[1.04] text-green md:text-6xl">{t("heading")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">{t("lead")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact?service=blend" className="rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaBrief")}
              </Link>
              <Link href="/packaging" className="rounded-lg border border-stone/25 px-6 py-3.5 text-sm font-medium text-green transition-colors hover:border-green">
                {t("ctaPackaging")} →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <BlendSwatch
              parts={hero.parts}
              labels={[partLabel(hero.parts[0].key), partLabel(hero.parts[1].key)]}
              className="aspect-[4/5]"
              priority
            />
          </Reveal>
        </section>

        {/* FACTS */}
        <section className="border-y border-stone/15 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4">
            {facts.map((f) => (
              <div key={f.l}>
                <p className="mono text-[10px] uppercase tracking-widest text-stone/50">{f.l}</p>
                <p className="mt-2 text-base text-green">{f.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* WHAT WE BLEND */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="display text-4xl leading-tight text-green md:text-5xl">{t("whatHeading")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-stone">{t("whatIntro")}</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BLENDS.map((b, i) => (
              <Reveal key={b.slug} delay={i * 0.06}>
                <Link href={`/blending/${b.slug}`} className="group block">
                  <BlendSwatch
                    parts={b.parts}
                    labels={[partLabel(b.parts[0].key), partLabel(b.parts[1].key)]}
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
                    className="aspect-[4/5] transition-transform duration-300 group-hover:-translate-y-1.5"
                  />
                  <p className="display mt-4 text-xl text-green">{t(`blends.${b.slug}.name`)}</p>
                  <p className="mt-1 text-sm leading-relaxed text-stone">{t(`blends.${b.slug}.tagline`)}</p>
                  <span className="mono mt-2 inline-block text-[11px] uppercase tracking-wide text-green">{t("viewBlend")} →</span>
                </Link>
              </Reveal>
            ))}
            <Reveal delay={BLENDS.length * 0.06}>
              <Link href="/contact?service=blend" className="group flex aspect-[4/5] flex-col justify-between rounded-2xl border border-dashed border-stone/30 bg-sand p-6 transition-colors hover:border-green">
                <span className="mono text-[10px] uppercase tracking-widest text-stone/60">{t("ownEyebrow")}</span>
                <span>
                  <span className="display block text-2xl leading-tight text-green">{t("ownTitle")}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-stone">{t("ownBody")}</span>
                  <span className="mono mt-4 inline-block text-[11px] uppercase tracking-wide text-green">{t("ctaBrief")} →</span>
                </span>
              </Link>
            </Reveal>
          </div>
          <p className="mt-10 text-sm text-stone/80">
            {t("pmpNote")}{" "}
            <a href={PMP_BLENDS} target="_blank" rel="noopener" className="text-green underline-offset-4 hover:underline">
              {t("pmpLink")} ↗
            </a>
          </p>
        </section>

        {/* PROCESS */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Reveal className="mb-12 max-w-xl">
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("processEyebrow")}</span>
              <h2 className="display mt-3 text-4xl leading-tight text-green md:text-5xl">{t("processHeading")}</h2>
            </Reveal>
            <ol className="grid gap-y-9 md:grid-cols-5 md:gap-x-6">
              {STEPS.map((n) => (
                <li key={n} className="relative border-l-2 border-lime/30 pl-5 md:border-l-0 md:pl-0">
                  <span className="mb-5 hidden h-2.5 w-2.5 rounded-full bg-lime md:block" />
                  <span className="mono text-[11px] text-lime">{String(n).padStart(2, "0")}</span>
                  <h3 className="display mt-2 text-lg leading-snug text-green">{t(`step${n}T`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{t(`step${n}D`, { kg: BLEND_MOQ_KG })}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* PACKAGING TEASER */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <Link href="/packaging" className="group grid items-center gap-8 rounded-2xl border border-stone/15 bg-white p-8 transition-colors hover:border-green md:grid-cols-[1fr_auto] md:p-10">
            <div>
              <h2 className="display text-3xl text-green">{t("packHeading")}</h2>
              <p className="mt-3 max-w-xl text-stone">{t("packBody")}</p>
              <span className="mono mt-5 inline-block text-[11px] uppercase tracking-wide text-green">{t("ctaPackaging")} →</span>
            </div>
            <div className="flex gap-3">
              <TinArt className="h-28 w-24" />
              <PouchArt className="h-28 w-24" />
              <CustomArt className="h-28 w-24" />
            </div>
          </Link>
        </section>

        {/* FAQ */}
        <section className="border-t border-stone/10 bg-sand">
          <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
            <h2 className="display text-2xl text-green md:text-3xl">{t("faqHeading")}</h2>
            <dl className="mt-8 divide-y divide-stone/15">
              {faqs.map((f) => (
                <div key={f.q} className="py-5">
                  <dt className="font-medium text-green">{f.q}</dt>
                  <dd className="mt-2 leading-relaxed text-stone">{f.a}</dd>
                </div>
              ))}
            </dl>
            <Link href="/contact?service=blend" className="mt-10 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
              {t("ctaBrief")}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
