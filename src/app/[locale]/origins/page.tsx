import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { OriginPhoto } from "@/components/OriginPhoto";
import { TradeGlobe } from "@/components/TradeGlobe";
import { ORIGIN_LIST, productsForOrigin } from "@/data/catalog";
import { localizeOrigin, localizeProduct, countryLabel } from "@/data/content.i18n";

const ORIGIN_COUNT = ORIGIN_LIST.length;
const COUNTRY_LIST = [...new Set(ORIGIN_LIST.map((o) => o.country))];
const COUNTRY_COUNT = COUNTRY_LIST.length;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "origins" });
  const countryList = COUNTRY_LIST.map((c) => countryLabel(c, locale)).join(", ");
  return {
    title: t("metaTitle", { origins: ORIGIN_COUNT, countries: COUNTRY_COUNT }),
    description: t("metaDescription", { countryList }),
    alternates: alternatesFor(locale, "/origins"),
  };
}

export default async function OriginsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("origins");

  const STATS = [
    { v: String(ORIGIN_COUNT), l: t("statOrigins") },
    { v: String(COUNTRY_COUNT), l: t("statCountries") },
    { v: "100%", l: t("statBatch") },
    { v: "1", l: t("statHub"), amber: true },
  ];

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-[1.05fr_0.95fr] md:pt-24 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(01)</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("eyebrow")}</span>
            </div>
            <h1 className="display mt-5 max-w-2xl text-5xl leading-[1.04] text-green md:text-6xl">
              {t("heading")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone">
              {t("intro", { countries: COUNTRY_COUNT })}
            </p>
          </Reveal>
          <Reveal delay={0.12} y={28}>
            <OriginPhoto
              src="/photos/field-sky.jpg"
              alt="Tea terraces under a working sky"
              caption={t("heroCaption")}
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/3] w-full shadow-[0_30px_80px_-40px_rgba(20,39,27,0.55)]"
            />
          </Reveal>
        </section>

        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-20">
            <div className="mb-6 flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(02)</span>
              <span className="h-px w-8 bg-stone/25" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("mapEyebrow")}</span>
            </div>
            <h2 className="display max-w-2xl text-3xl leading-tight text-green md:text-4xl">
              {t("mapHeading")}
            </h2>
            <p className="mt-4 max-w-xl text-stone">
              {t("mapBody")}
            </p>

            <div className="mt-9">
              <TradeGlobe />
            </div>

            <div className="mono mt-6 flex flex-wrap gap-x-7 gap-y-3 text-[11px] uppercase tracking-wide text-stone/65">
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: "#1b5e3f" }} />
                {t("legendSourcing", { count: ORIGIN_LIST.length })}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2.5 w-3 rounded-sm" style={{ backgroundColor: "#c58a2a" }} />
                {t("legendMarkets")}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full border-2" style={{ borderColor: "#c58a2a" }} />
                {t("legendHub")}
              </span>
            </div>
          </div>
        </section>

        <section className="bg-green text-oat">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-16 lg:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.l}>
                <p className={`display text-5xl ${s.amber ? "text-amber" : "text-oat"}`}>{s.v}</p>
                <p className="mono mt-3 text-[11px] uppercase tracking-wide text-oat/60">{s.l}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16">
          <Reveal className="mb-8">
            <h2 className="display text-3xl text-green">{t("featuredHeading")}</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ORIGIN_LIST.map((raw, i) => {
              const o = localizeOrigin(raw, locale);
              const products = productsForOrigin(raw.slug);
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
                    <p className="display mt-3 text-2xl text-green">{o.name}</p>
                    <p className="mono mt-1 text-[11px] uppercase text-stone/50">{o.coords}</p>
                    <p className="mt-4 text-sm text-stone">
                      {products.map((p) => localizeProduct(p, locale).name).join(" · ") || t("multipleLines")}
                    </p>
                    <span className="mono mt-4 inline-flex items-center gap-1 text-[10px] uppercase text-stone/50 transition-colors group-hover:text-green">
                      {t("viewOrigin")}
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
              <h2 className="display text-3xl text-green md:text-4xl">{t("ctaHeading")}</h2>
              <p className="mx-auto mt-4 max-w-lg text-stone">
                {t("ctaBody")}
              </p>
              <Link href="/contact" className="mt-8 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaButton")}
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
