import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CATEGORIES, PRODUCTS, ORIGINS } from "@/data/catalog";
import { localizeProduct, localizeOrigin, categoryLabel } from "@/data/content.i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "catalog" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/catalog"),
  };
}

function ProductTile({ slug, locale }: { slug: string; locale: string }) {
  const p = localizeProduct(PRODUCTS.find((x) => x.slug === slug)!, locale);
  const origin = localizeOrigin(ORIGINS[p.originSlugs[0]], locale);
  return (
    <Link
      href={`/catalog/${p.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1.5"
      style={{ backgroundColor: p.accent }}
    >
      {p.img && (
        <>
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${p.img})` }}
          />
          <div className="absolute inset-0 transition-opacity duration-700 ease-out group-hover:opacity-0" style={{ backgroundColor: p.accent }} />
        </>
      )}
      <span className="relative mono text-[10px] uppercase tracking-wide text-white/70">{p.category}</span>
      <span className="relative">
        <span className="block display text-3xl leading-tight" style={{ color: p.tint }}>{p.name}</span>
        <span className="mono mt-2 flex items-center gap-1 text-[10px] uppercase text-white/80">
          {origin.name.toUpperCase()} · {origin.country.toUpperCase()}
          <span className="opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
        </span>
      </span>
    </Link>
  );
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("catalog");

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(01)</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("eyebrow")}</span>
            </div>
            <h1 className="mt-5 max-w-2xl display text-4xl leading-tight text-green md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone">
              {t("intro")}
            </p>
          </Reveal>
        </section>

        {CATEGORIES.map((cat) => {
          const items = PRODUCTS.filter((p) => p.category === cat);
          if (!items.length) return null;
          const catLabel = categoryLabel(cat, locale);
          return (
            <section key={cat} className="mx-auto max-w-6xl px-6 pb-16">
              <Reveal className="mb-6 flex items-center gap-3">
                <h2 className="display text-xl text-green">{catLabel}</h2>
                <span className="mono text-[11px] uppercase text-stone/40">{t("lines", { count: items.length })}</span>
              </Reveal>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {items.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 0.07}>
                    <ProductTile slug={p.slug} locale={locale} />
                  </Reveal>
                ))}
              </div>
            </section>
          );
        })}

        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">
            <Reveal>
              <h2 className="display text-3xl text-green">{t("ctaHeading")}</h2>
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
