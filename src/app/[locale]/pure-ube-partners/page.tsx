import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { LABELS, ORIGINS, getProduct } from "@/data/catalog";
import { localizeProduct, localizeOrigin } from "@/data/content.i18n";
import { POSTS, pick } from "@/data/insights";

// Pure Ube Partners — the specialist ube label. A low-key brand page: it owns
// the brand name, while /products/ube stays the page that targets the
// commercial ube terms (no competing keywords here).
const LABEL = LABELS.pup;
const PATH = "/pure-ube-partners";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pureUbe" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: alternatesFor(locale, PATH),
  };
}

export default async function PureUbePartnersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("pureUbe");

  const base = getProduct("ube")!;
  const ube = localizeProduct(base, locale);
  // Facts come straight from the catalogue (localized), matched on the English label.
  const spec = (label: string) => {
    const i = base.specs?.findIndex((s) => s.label === label) ?? -1;
    return i >= 0 ? (ube.specs?.[i]?.value ?? base.specs![i].value) : "";
  };
  const facts = [
    { l: t("factSource"), v: spec("Source") },
    { l: t("factOrigins"), v: spec("Origin") },
    { l: t("factGrades"), v: spec("Grades") },
    { l: t("factDocs"), v: spec("Documentation") },
  ];
  const origins = base.originSlugs.map((s) => localizeOrigin(ORIGINS[s], locale));
  const guides = POSTS.filter((x) => x.relatedProducts?.includes("ube"));

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-[1.1fr_0.9fr] md:pt-24 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LABEL.accent }} />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("eyebrow")}</span>
            </div>
            <h1 className="display mt-5 text-5xl leading-[1.04] text-green md:text-6xl">{LABEL.name}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">{t("lead")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaPrimary")}
              </Link>
              <Link href="/products/ube" className="rounded-lg border border-stone/25 px-6 py-3.5 text-sm font-medium text-green transition-colors hover:border-green">
                {t("ctaSecondary")} →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" style={{ backgroundColor: base.accent }}>
              {base.img && (
                <Image src={base.img} alt={ube.gallery?.[0]?.alt ?? "Ube purple yam powder"} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" priority />
              )}
              <p className="mono absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-5 pt-10 pb-4 text-[10px] uppercase tracking-widest text-white/85">
                {LABEL.endorsement}
              </p>
            </div>
          </Reveal>
        </section>

        {/* FACTS — from the catalogue */}
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

        {/* WHY A DEDICATED LABEL */}
        <section className="mx-auto max-w-6xl px-6 py-20 md:py-24">
          <div className="grid gap-12 md:grid-cols-[1fr_1fr]">
            <Reveal>
              <span className="mono text-[11px] uppercase tracking-widest" style={{ color: LABEL.accent }}>{t("whyEyebrow")}</span>
              <h2 className="display mt-4 text-4xl leading-tight text-green">{t("whyHeading")}</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <p className="text-lg leading-relaxed text-stone">{t("whyBody1")}</p>
              <p className="mt-5 text-lg leading-relaxed text-stone">{t("whyBody2")}</p>
              <Link href="/insights/what-is-ube-powder" className="mt-6 inline-block text-sm font-medium text-green underline-offset-4 hover:underline">
                {t("whyLink")} →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ORIGINS + GUIDES */}
        <section className="bg-sand">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
            <div>
              <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("originsHeading")}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {origins.map((o) => (
                  <li key={o.slug}>
                    <Link href={`/origins/${o.slug}`} className="inline-block rounded-lg border border-stone/20 bg-oat px-3 py-1.5 text-sm text-stone transition-colors hover:border-green hover:text-green">
                      {o.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {guides.length > 0 && (
              <div>
                <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("guidesHeading")}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {guides.map((g) => (
                    <li key={g.slug}>
                      <Link href={`/insights/${g.slug}`} className="inline-block rounded-lg border border-stone/20 bg-oat px-3 py-1.5 text-sm text-stone transition-colors hover:border-green hover:text-green">
                        {pick(g.title, locale)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-20 text-center md:py-24">
          <Reveal>
            <h2 className="display text-4xl text-green">{t("ctaHeading")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-stone">{t("ctaBody")}</p>
            <Link href="/contact" className="mt-8 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
              {t("ctaPrimary")}
            </Link>
            <p className="mono mt-10 text-[10px] uppercase tracking-widest text-stone/50">{LABEL.endorsement}</p>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
