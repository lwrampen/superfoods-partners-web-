import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor, localizedUrl, SITE } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { POSTS, getPost, pick } from "@/data/insights";
import { getProduct } from "@/data/catalog";
import { localizeProduct } from "@/data/content.i18n";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: pick(post.metaTitle, locale),
    description: pick(post.metaDescription, locale),
    alternates: alternatesFor(locale, `/insights/${slug}`),
  };
}

export default async function InsightPost({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = getPost(slug);
  if (!post) notFound();
  const t = await getTranslations("insights");
  const df = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long", day: "numeric" });

  const related = (post.relatedProducts ?? [])
    .map((s) => getProduct(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => localizeProduct(p, locale));

  const url = localizedUrl(locale, `/insights/${slug}`);
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: pick(post.title, locale),
    description: pick(post.dek, locale),
    inLanguage: locale,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    author: { "@type": "Person", name: post.author, jobTitle: pick(post.authorRole, locale) },
    publisher: {
      "@type": "Organization",
      name: "Superfoods Partners",
      logo: { "@type": "ImageObject", url: `${SITE}/logos/sfp-roundel-primary.png` },
    },
    image: post.hero ? `${SITE}${post.hero}` : undefined,
    mainEntityOfPage: url,
  };
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: localizedUrl(locale, "/") },
      { "@type": "ListItem", position: 2, name: t("crumbInsights"), item: localizedUrl(locale, "/insights") },
      { "@type": "ListItem", position: 3, name: pick(post.title, locale), item: url },
    ],
  };
  const faqLd = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((f) => ({
          "@type": "Question",
          name: pick(f.q, locale),
          acceptedAnswer: { "@type": "Answer", text: pick(f.a, locale) },
        })),
      }
    : null;
  const jsonLd = [article, breadcrumb, ...(faqLd ? [faqLd] : [])];

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <article className="mx-auto max-w-3xl px-6 pt-14 pb-8 md:pt-20">
          <Link href="/insights" className="mono text-[11px] uppercase tracking-wide text-stone/60 transition-colors hover:text-green">
            {t("back")}
          </Link>
          <p className="mono mt-6 text-[11px] uppercase tracking-wide text-amber">{pick(post.category, locale)}</p>
          <h1 className="display mt-3 text-4xl leading-[1.08] text-green md:text-5xl">{pick(post.title, locale)}</h1>
          <p className="mt-5 text-lg leading-relaxed text-stone">{pick(post.dek, locale)}</p>
          <p className="mono mt-6 text-[11px] uppercase tracking-wide text-stone/50">
            {t("by")} {post.author} · {pick(post.authorRole, locale)} · {df.format(new Date(post.date))} · {t("readTime", { mins: post.readingMins })}
          </p>
        </article>

        {post.hero && (
          <div className="mx-auto max-w-4xl px-6">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-sand">
              <Image src={post.hero} alt={pick(post.heroAlt, locale)} fill priority className="object-cover" sizes="(max-width: 896px) 100vw, 896px" />
            </div>
          </div>
        )}

        <div className="mx-auto max-w-3xl px-6 py-12">
          <p className="text-xl leading-relaxed text-green">{pick(post.lede, locale)}</p>

          {post.sections.map((s, i) => (
            <Reveal key={i} className="mt-12">
              <h2 className="display text-2xl leading-tight text-green md:text-3xl">{pick(s.heading, locale)}</h2>
              {s.body.map((b, j) => (
                <p key={j} className="mt-4 leading-relaxed text-stone">{pick(b, locale)}</p>
              ))}
            </Reveal>
          ))}

          {post.keyFacts?.length ? (
            <div className="mt-14 rounded-2xl border border-stone/15 bg-sand p-6 md:p-8">
              <h2 className="mono text-[11px] uppercase tracking-widest text-stone/50">{t("keyFacts")}</h2>
              <dl className="mono mt-5 divide-y divide-stone/12 border-t border-stone/15 text-sm">
                {post.keyFacts.map((f, i) => (
                  <div key={i} className="flex items-baseline justify-between gap-6 py-3">
                    <dt className="text-[11px] uppercase text-stone/50">{pick(f.label, locale)}</dt>
                    <dd className="text-right text-green">{pick(f.value, locale)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}

          {post.tables?.map((tbl, ti) => (
            <div key={ti} className="mt-14">
              <h2 className="display text-2xl text-green md:text-3xl">{tbl.title}</h2>
              <div className="mt-5 overflow-x-auto rounded-xl border border-stone/15">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr>
                      {tbl.columns.map((c, ci) => (
                        <th key={ci} className="mono border-b border-stone/15 bg-sand px-4 py-3 text-left text-[10px] uppercase tracking-wide text-stone/60">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tbl.rows.map((row, ri) => (
                      <tr key={ri}>
                        {row.map((cell, ci) => (
                          <td key={ci} className={`border-b border-stone/10 px-4 py-3 ${ci === 0 ? "text-green" : "text-stone tabular-nums"}`}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {tbl.note ? <p className="mono mt-3 text-[11px] uppercase tracking-wide text-stone/45">{tbl.note}</p> : null}
            </div>
          ))}

          {post.faqs?.length ? (
            <div className="mt-14">
              <h2 className="display text-2xl text-green md:text-3xl">{t("faqHeading")}</h2>
              <div className="mt-6 divide-y divide-stone/12 border-t border-stone/15">
                {post.faqs.map((f, i) => (
                  <div key={i} className="py-5">
                    <h3 className="font-medium text-green">{pick(f.q, locale)}</h3>
                    <p className="mt-2 leading-relaxed text-stone">{pick(f.a, locale)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {related.length ? (
          <section className="border-t border-stone/10 bg-sand">
            <div className="mx-auto max-w-3xl px-6 py-12">
              <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("related")}</h2>
              <div className="mt-5 flex flex-wrap gap-3">
                {related.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/catalog/${p.slug}`}
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
            <Link
              href="/contact"
              className="mt-8 inline-block rounded-lg bg-oat px-6 py-3.5 text-sm font-medium text-green transition-opacity hover:opacity-90"
            >
              {t("ctaButton")}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
