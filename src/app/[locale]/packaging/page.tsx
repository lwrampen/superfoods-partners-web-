import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor, localizedUrl } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { TinArt, PouchArt, CartonArt, CustomArt } from "@/components/PackagingArt";
import { PACKAGING_MOQ_KG } from "@/data/blends";

// Custom packaging: tins, pouches and bespoke formats on top of bulk supply.
const PATH = "/packaging";
const FORMATS = [
  { key: "tins", Art: TinArt },
  { key: "pouches", Art: PouchArt },
  { key: "custom", Art: CustomArt },
  { key: "bulk", Art: CartonArt },
] as const;
const STEPS = [1, 2, 3, 4] as const;
const FAQ_KEYS = ["moq", "branding", "blend", "organic"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "packaging" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription", { kg: PACKAGING_MOQ_KG }),
    alternates: alternatesFor(locale, PATH),
  };
}

export default async function PackagingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("packaging");
  const faqs = FAQ_KEYS.map((k) => ({ q: t(`faq.${k}Q`), a: t(`faq.${k}A`, { kg: PACKAGING_MOQ_KG }) }));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: t("metaTitle"),
      serviceType: "Custom packaging and private label filling",
      description: t("metaDescription", { kg: PACKAGING_MOQ_KG }),
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
              <Link href="/contact?service=packaging" className="rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("cta")}
              </Link>
              <Link href="/blending" className="rounded-lg border border-stone/25 px-6 py-3.5 text-sm font-medium text-green transition-colors hover:border-green">
                {t("ctaBlending")} →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="grid grid-cols-2 gap-4 rounded-2xl bg-sand p-8">
              {FORMATS.map(({ key, Art }) => (
                <div key={key} className="flex flex-col items-center rounded-xl bg-oat p-4">
                  <Art className="h-28 w-24" />
                  <span className="mono mt-2 text-[10px] uppercase tracking-widest text-stone/60">{t(`formats.${key}.title`)}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* FACT STRIP */}
        <section className="border-y border-stone/15 bg-white">
          <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3">
            {(["moq", "branding", "documentation"] as const).map((f) => (
              <div key={f}>
                <p className="mono text-[10px] uppercase tracking-widest text-stone/50">{t(`facts.${f}L`)}</p>
                <p className="mt-2 text-base text-green">{t(`facts.${f}V`, { kg: PACKAGING_MOQ_KG })}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FORMATS */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <Reveal className="mb-10 max-w-2xl">
            <h2 className="display text-4xl leading-tight text-green md:text-5xl">{t("formatsHeading")}</h2>
            <p className="mt-4 text-lg leading-relaxed text-stone">{t("formatsIntro")}</p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FORMATS.map(({ key, Art }, i) => (
              <Reveal key={key} delay={i * 0.06}>
                <div className="h-full rounded-xl border border-stone/15 bg-white p-6">
                  <Art className="h-20 w-16" />
                  <h3 className="display mt-4 text-xl text-green">{t(`formats.${key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{t(`formats.${key}.body`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Reveal className="mb-12 max-w-xl">
              <h2 className="display text-4xl leading-tight text-green md:text-5xl">{t("stepsHeading")}</h2>
            </Reveal>
            <ol className="grid gap-y-9 md:grid-cols-4 md:gap-x-6">
              {STEPS.map((n) => (
                <li key={n} className="relative border-l-2 border-lime/30 pl-5 md:border-l-0 md:pl-0">
                  <span className="mb-5 hidden h-2.5 w-2.5 rounded-full bg-lime md:block" />
                  <span className="mono text-[11px] text-lime">{String(n).padStart(2, "0")}</span>
                  <h3 className="display mt-2 text-lg leading-snug text-green">{t(`step${n}T`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone">{t(`step${n}D`, { kg: PACKAGING_MOQ_KG })}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ + CTA */}
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <h2 className="display text-2xl text-green md:text-3xl">{t("faqHeading")}</h2>
          <dl className="mt-8 divide-y divide-stone/15">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-medium text-green">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-stone">{f.a}</dd>
              </div>
            ))}
          </dl>
          <Link href="/contact?service=packaging" className="mt-10 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
            {t("cta")}
          </Link>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
