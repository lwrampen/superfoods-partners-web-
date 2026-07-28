import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { SourcingMap } from "@/components/SourcingMap";
import { ORIGIN_LIST, getOrigin, productsForOrigin, originLabel, ORIGIN_INTRO } from "@/data/catalog";
import { localizeOrigin, localizeProduct, localizedIntro } from "@/data/content.i18n";

export function generateStaticParams() {
  return ORIGIN_LIST.map((o) => ({ origin: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; origin: string }> }): Promise<Metadata> {
  const { locale, origin } = await params;
  const raw = getOrigin(origin);
  if (!raw) return {};
  const t = await getTranslations({ locale, namespace: "originDetail" });
  const o = localizeOrigin(raw, locale);
  const products =
    productsForOrigin(raw.slug).map((p) => localizeProduct(p, locale).name.toLowerCase()).join(", ") ||
    t("metaProductsFallback");
  return {
    title: t("metaTitle", { products, name: o.name, country: o.country }),
    description: t("metaDescription", { products, name: o.name, country: o.country, coords: o.coords }),
    alternates: alternatesFor(locale, `/origins/${raw.slug}`),
  };
}

export default async function OriginPage({ params }: { params: Promise<{ locale: string; origin: string }> }) {
  const { locale, origin } = await params;
  setRequestLocale(locale);
  const raw = getOrigin(origin);
  if (!raw) notFound();
  const t = await getTranslations("originDetail");
  const o = localizeOrigin(raw, locale);
  const products = productsForOrigin(raw.slug);
  const intro = localizedIntro(raw.slug, locale, ORIGIN_INTRO[raw.slug]);

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="bg-forest text-oat">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Link href="/origins" className="mono text-[11px] uppercase tracking-wide text-oat/50 transition-colors hover:text-oat">
              ← {t("back")}
            </Link>
            <p className="mono mt-6 text-[11px] uppercase tracking-widest text-amber">{o.country}</p>
            <h1 className="mt-3 display text-5xl leading-tight text-oat md:text-6xl">{o.name}</h1>
            <p className="mono mt-4 text-sm uppercase tracking-wide text-oat/60">{t("routedVia", { coords: o.coords })}</p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal className="max-w-2xl">
            {intro && (
              <p className="text-lg leading-relaxed text-stone md:text-xl">{intro}</p>
            )}
            <p className={`leading-relaxed text-stone ${intro ? "mt-5" : "text-lg"}`}>
              {t("introFallback", { label: originLabel(o) })}
            </p>
          </Reveal>

          {/* The route — hand-drawn map: this origin → Hong Kong hub */}
          <Reveal className="mt-14">
            <div className="overflow-hidden rounded-2xl border border-stone/12 bg-sand">
              <div className="grid items-center gap-6 p-7 md:grid-cols-[1.1fr_1fr] md:p-10">
                <div className="max-w-md">
                  <p className="mono text-[11px] uppercase tracking-widest text-stone/50">{t("routeEyebrow")}</p>
                  <h2 className="mt-3 display text-2xl leading-tight text-green md:text-3xl">
                    {t("routeHeading", { name: o.name })}
                  </h2>
                  <p className="mt-4 leading-relaxed text-stone">
                    {t("routeBody")}
                  </p>
                  <p className="mono mt-5 text-[11px] uppercase tracking-wide text-stone/50">
                    {t("routePath", { coords: o.coords })}
                  </p>
                </div>
                <div className="rounded-xl bg-oat/70 p-3 md:p-4">
                  <SourcingMap originSlug={raw.slug} />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="mb-6 mt-14">
            <h2 className="display text-xl text-green">{t("sourcedFrom", { name: o.name })}</h2>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((raw, i) => {
              const p = localizeProduct(raw, locale);
              return (
                <Reveal key={p.slug} delay={i * 0.07}>
                  <Link
                    href={`/catalog/${p.slug}`}
                    className="group relative flex aspect-[5/4] flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1.5"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.img && (
                      <>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.img})` }} />
                        <div className="absolute inset-0 transition-opacity duration-700 ease-out group-hover:opacity-0" style={{ backgroundColor: p.accent }} />
                      </>
                    )}
                    <span className="relative mono text-[10px] uppercase tracking-wide text-white/70">{p.category}</span>
                    <span className="relative display text-2xl" style={{ color: p.tint }}>{p.name}</span>
                  </Link>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <Link href="/contact" className="mt-12 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
              {t("ctaQuote", { name: o.name })}
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
