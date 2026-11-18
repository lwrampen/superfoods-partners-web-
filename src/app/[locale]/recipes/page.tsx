import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { pick } from "@/data/insights";
import { allRecipes, recipeCopy } from "@/data/recipes";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "recipes" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/recipes"),
    // an empty overview is not worth indexing; it goes into the sitemap with the first recipe
    ...(allRecipes().length ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function RecipesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("recipes");
  const recipes = allRecipes();

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 md:pt-24">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">(01)</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("eyebrow")}</span>
            </div>
            <h1 className="display mt-5 max-w-3xl text-5xl leading-[1.04] text-green md:text-6xl">{t("heading")}</h1>
            <p className="mt-5 max-w-xl text-lg text-stone">{t("intro")}</p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          {recipes.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recipes.map((r, i) => {
                const c = recipeCopy(r, locale);
                const total = (r.prepMins ?? 0) + (r.cookMins ?? 0);
                return (
                  <Reveal key={r.slug} delay={i * 0.06}>
                    <Link
                      href={`/recipes/${r.slug}`}
                      className="group flex h-full flex-col overflow-hidden rounded-xl border border-stone/15 bg-sand transition-colors hover:border-green/30"
                    >
                      {r.image ? (
                        <div className="relative aspect-[4/3] w-full bg-oat">
                          <Image src={r.image} alt={c.imageAlt || r.imageAlt} fill className="object-cover" sizes="(max-width: 640px) 100vw, 360px" />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col p-6">
                        <span className="mono text-[10px] uppercase tracking-wide text-amber">{t(`categories.${r.category}` as never)}</span>
                        <h2 className="display mt-3 text-2xl leading-tight text-green">{pick(r.title, locale)}</h2>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{pick(r.summary, locale)}</p>
                        {total ? (
                          <span className="mono mt-5 text-[10px] uppercase tracking-wide text-stone/50">{t("totalTime", { mins: total })}</span>
                        ) : null}
                      </div>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          ) : (
            <p className="rounded-xl border border-stone/15 bg-sand p-6 text-stone">{t("empty")}</p>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
