import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { POSTS, pick } from "@/data/insights";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "insights" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/insights"),
  };
}

export default async function InsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("insights");
  const df = new Intl.DateTimeFormat(locale, { year: "numeric", month: "short", day: "numeric" });
  const posts = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));

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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link
                  href={`/insights/${p.slug}`}
                  className="group flex h-full flex-col rounded-xl border border-stone/15 bg-sand p-6 transition-colors hover:border-green/30"
                >
                  <span className="mono text-[10px] uppercase tracking-wide text-amber">{pick(p.category, locale)}</span>
                  <h2 className="display mt-3 text-2xl leading-tight text-green">{pick(p.title, locale)}</h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-stone">{pick(p.dek, locale)}</p>
                  <span className="mono mt-5 text-[10px] uppercase tracking-wide text-stone/50">
                    {df.format(new Date(p.date))} · {t("readTime", { mins: p.readingMins })}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
