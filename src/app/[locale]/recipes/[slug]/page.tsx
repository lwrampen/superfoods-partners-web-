import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor, localizedUrl, SITE } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { getProduct } from "@/data/catalog";
import { localizeProduct } from "@/data/content.i18n";
import { allRecipes, getRecipe, isoDuration, recipeCopy } from "@/data/recipes";
import { Inline, InsightBlocks } from "@/components/InsightBlocks";
import { stripInline } from "@/lib/studio/inline";

export function generateStaticParams() {
  return allRecipes().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const r = getRecipe(slug);
  if (!r) return {};
  const c = recipeCopy(r, locale);
  return {
    title: c.metaTitle || c.title,
    description: c.metaDescription || c.summary,
    alternates: alternatesFor(locale, `/recipes/${slug}`),
    openGraph: r.image ? { images: [`${SITE}${r.image}`] } : undefined,
  };
}

export default async function RecipePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const r = getRecipe(slug);
  if (!r) notFound();
  const c = recipeCopy(r, locale);
  const t = await getTranslations("recipes");
  const df = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" });
  const total = (r.prepMins ?? 0) + (r.cookMins ?? 0);
  const yieldText = c.yield || (r.servings ? t("serves", { n: r.servings }) : "");
  const products = (r.products ?? [])
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => localizeProduct(p, locale));

  const url = localizedUrl(locale, `/recipes/${slug}`);
  const recipeLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: c.title,
    description: c.summary,
    inLanguage: locale,
    url,
    image: r.image ? [`${SITE}${r.image}`] : undefined,
    author: { "@type": "Person", name: r.author },
    publisher: { "@type": "Organization", name: "Superfoods Partners", logo: { "@type": "ImageObject", url: `${SITE}/logos/sfp-block-dark.png` } },
    datePublished: r.date,
    dateModified: r.updated ?? r.date,
    prepTime: isoDuration(r.prepMins),
    cookTime: isoDuration(r.cookMins),
    totalTime: isoDuration(total),
    recipeYield: yieldText || undefined,
    recipeCategory: t(`categories.${r.category}` as never),
    keywords: r.keywords?.primary?.keyword,
    recipeIngredient: c.ingredients.flatMap((g) => g.items.map(stripInline)),
    recipeInstructions: c.steps.map((s, i) => ({ "@type": "HowToStep", position: i + 1, text: stripInline(s) })),
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: localizedUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name: t("crumb"), item: localizedUrl(locale, "/recipes") },
      { "@type": "ListItem", position: 3, name: c.title, item: url },
    ],
  };
  const faqLd = c.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: stripInline(f.a) } })),
      }
    : null;
  const jsonLd = [recipeLd, breadcrumb, ...(faqLd ? [faqLd] : [])];

  const facts = [
    r.prepMins ? { label: t("prep"), value: t("minutes", { mins: r.prepMins }) } : null,
    r.cookMins ? { label: t("cook"), value: t("minutes", { mins: r.cookMins }) } : null,
    total ? { label: t("total"), value: t("minutes", { mins: total }) } : null,
    yieldText ? { label: t("yield"), value: yieldText } : null,
    r.difficulty ? { label: t("difficulty"), value: t(`levels.${r.difficulty}` as never) } : null,
  ].filter((f): f is { label: string; value: string } => !!f);

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <article className="mx-auto max-w-3xl px-6 pt-14 pb-8 md:pt-20">
          <Link href="/recipes" className="mono text-[11px] uppercase tracking-wide text-stone/60 transition-colors hover:text-green">
            {t("back")}
          </Link>
          <p className="mono mt-6 text-[11px] uppercase tracking-wide text-amber">{t(`categories.${r.category}` as never)}</p>
          <h1 className="display mt-3 text-4xl leading-[1.08] text-green md:text-5xl">{c.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-stone">{c.summary}</p>
          <p className="mono mt-6 text-[11px] uppercase tracking-wide text-stone/50">
            {t("by")} {r.author} · {df.format(new Date(r.date))}
          </p>
        </article>

        {r.image && (
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-sand">
              <Image src={r.image} alt={c.imageAlt || r.imageAlt} fill priority className="object-cover" sizes="(max-width: 896px) 100vw, 896px" />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-xl leading-relaxed text-green">
            <Inline text={c.lede} />
          </p>

          {facts.length ? (
            <dl className="mono mt-10 flex flex-wrap gap-px overflow-hidden rounded-xl border border-stone/15 bg-stone/15 text-sm">
              {facts.map((f) => (
                <div key={f.label} className="flex-1 basis-[130px] bg-sand px-4 py-3">
                  <dt className="text-[10px] uppercase tracking-wide text-stone/50">{f.label}</dt>
                  <dd className="mt-1 text-green">{f.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}

          <section className="mt-12">
            <h2 className="display text-2xl leading-tight text-green md:text-3xl">{t("ingredients")}</h2>
            {c.ingredients.map((g, gi) => (
              <div key={gi} className="mt-5">
                {g.heading ? <h3 className="font-medium text-green">{g.heading}</h3> : null}
                <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed text-stone marker:text-amber">
                  {g.items.map((it, ii) => (
                    <li key={ii}>
                      <Inline text={it} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          <section className="mt-12">
            <h2 className="display text-2xl leading-tight text-green md:text-3xl">{t("method")}</h2>
            <ol className="mt-5 space-y-5">
              {c.steps.map((s, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mono mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green text-[11px] text-oat">{i + 1}</span>
                  <p className="leading-relaxed text-stone">
                    <Inline text={s} />
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {c.tips?.length ? (
            <section className="mt-12 rounded-2xl border border-stone/15 bg-sand p-6 md:p-8">
              <h2 className="mono text-[11px] uppercase tracking-widest text-stone/50">{t("tips")}</h2>
              <ul className="mt-4 list-disc space-y-2 pl-5 leading-relaxed text-stone marker:text-amber">
                {c.tips.map((tip, i) => (
                  <li key={i}>
                    <Inline text={tip} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {c.blocks?.length ? <InsightBlocks blocks={c.blocks} /> : null}

          {c.faqs?.length ? (
            <div className="mt-14">
              <h2 className="display text-2xl text-green md:text-3xl">{t("faqHeading")}</h2>
              <div className="mt-6 divide-y divide-stone/12 border-t border-stone/15">
                {c.faqs.map((f, i) => (
                  <div key={i} className="py-5">
                    <h3 className="font-medium text-green">{f.q}</h3>
                    <p className="mt-2 leading-relaxed text-stone">
                      <Inline text={f.a} />
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {products.length ? (
          <section className="border-t border-stone/10 bg-sand">
            <div className="mx-auto max-w-3xl px-6 py-12">
              <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("madeWith")}</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {products.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/products/${p.slug}`}
                    className="rounded-lg border border-stone/20 bg-white px-4 py-2 text-sm text-green transition-colors hover:border-green/40"
                  >
                    {p.name}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="bg-green text-oat">
          <div className="mx-auto max-w-3xl px-6 py-16 text-center">
            <h2 className="display text-3xl md:text-4xl">{t("ctaHeading")}</h2>
            <Link href="/contact" className="mt-8 inline-block rounded-lg bg-oat px-6 py-3.5 text-sm font-medium text-green transition-opacity hover:opacity-90">
              {t("ctaButton")}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
