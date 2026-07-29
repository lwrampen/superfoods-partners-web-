import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TraceABatch } from "@/components/TraceABatch";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { OriginPhoto } from "@/components/OriginPhoto";
import { SourcingMap } from "@/components/SourcingMap";
import { Certifications } from "@/components/Certifications";
import { ExpertsCluster } from "@/components/ExpertsCluster";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { PRODUCTS, ORIGINS, ORIGIN_LIST } from "@/data/catalog";
import { TEAM, CERTIFICATIONS, PARTNERS } from "@/data/trust";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/"),
  };
}

function Marker({ n, label, color = "text-stone/60" }: { n: string; label: string; color?: string }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="mono text-[11px] text-amber">{n}</span>
      <span className="h-px w-8 bg-stone/30" />
      <span className={`mono text-[11px] uppercase tracking-widest ${color}`}>{label}</span>
    </div>
  );
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("core");

  const peopleItems = t.raw("peopleItems") as { t: string; d: string }[];
  const steps = t.raw("steps") as { t: string; d: string }[];
  const coreItems = tc.raw("items") as { t: string; d: string }[];
  const socialTags = t.raw("socialTags") as string[];
  const stats = [
    { value: ORIGIN_LIST.length, suffix: "", l: t("statOrigins") },
    { value: new Set(ORIGIN_LIST.map((o) => o.country)).size, suffix: "", l: t("statCountries") },
    { value: 100, suffix: "%", l: t("statTested") },
    { value: 1, suffix: "", l: t("statHub"), amber: true },
  ];

  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-20 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:pt-24 md:pb-28">
          <Reveal>
            <p className="mono text-xs uppercase tracking-widest text-amber">{t("heroEyebrow")}</p>
            <h1 className="display mt-6 text-[3.4rem] leading-[1.03] text-green md:text-[4.6rem]">
              {t("heroTitle1")}
              <br />
              {t("heroTitle2")}
            </h1>
            <p className="mt-7 max-w-md text-lg leading-relaxed text-stone">{t("heroIntro")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-green px-5 py-3 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaQuote")}
              </Link>
              <a href="#trace" className="rounded-lg border border-green/25 px-5 py-3 text-sm font-medium text-green transition-colors hover:bg-green/5">
                {t("ctaTrace")}
              </a>
            </div>
            <p className="mono mt-8 text-[11px] uppercase tracking-wide text-stone/55">{t("heroBadge")}</p>
          </Reveal>
          <Reveal delay={0.15} y={28}>
            <OriginPhoto
              src="/photos/hero-shade-nets.jpg"
              alt="A grower among the shade-grown tea gardens at harvest"
              caption={t("heroCaption")}
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/5] w-full shadow-[0_30px_80px_-40px_rgba(20,39,27,0.55)]"
            />
          </Reveal>
        </section>

        {/* CATALOGUE */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <Reveal className="mb-8">
            <Marker n="(01)" label={t("catMarker")} />
            <div className="flex items-end justify-between">
              <h2 className="display text-4xl text-green">{t("catHeading", { n: ORIGIN_LIST.length })}</h2>
              <Link href="/catalog" className="mono text-[11px] uppercase tracking-widest text-stone/60 transition-colors hover:text-green">
                {t("catViewAll")}
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => {
              const o = ORIGINS[p.originSlugs[0]];
              const label = p.grades ? p.grades.join(" · ") : p.category;
              return (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <Link
                    href={`/catalog/${p.slug}`}
                    className="group relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-xl p-6 transition-transform duration-300 hover:-translate-y-1.5"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.img && (
                      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${p.img})` }} />
                    )}
                    <div
                      className="absolute inset-0 transition-opacity duration-700 ease-out group-hover:opacity-0"
                      style={{ backgroundColor: p.accent }}
                    />
                    <span className="relative mono text-[10px] uppercase tracking-wide text-white/70">{label}</span>
                    <span className="relative">
                      <span className="display block text-3xl leading-tight" style={{ color: p.tint }}>{p.name}</span>
                      <span className="mono mt-2 flex items-center gap-1 text-[10px] uppercase text-white/80">
                        {o.name === o.country ? o.name : `${o.name} · ${o.country}`}
                        <span className="translate-x-0 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100">→</span>
                      </span>
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* PEOPLE & PLANET */}
        <section className="bg-oat">
          <div className="mx-auto grid max-w-6xl items-stretch gap-12 px-6 py-24 md:grid-cols-[1fr_0.8fr]">
            <Reveal>
              <Marker n="(02)" label={t("peopleMarker")} color="text-lionsmane" />
              <h2 className="display max-w-xl text-4xl leading-tight text-green md:text-5xl">{t("peopleHeading")}</h2>
              <p className="mt-6 max-w-lg text-stone">{t("peopleBody")}</p>
              <div className="mt-9 flex flex-col">
                {peopleItems.map((p, i) => (
                  <div key={p.t} className={`border-t border-stone/15 py-4 ${i === peopleItems.length - 1 ? "border-b" : ""}`}>
                    <h3 className="display text-xl text-green">{p.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-stone">{p.d}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12} y={28}>
              <OriginPhoto
                src="/photos/grower-portrait.jpg"
                alt="A grower in the shade-grown gardens"
                caption={t("peopleCaption")}
                className="h-full min-h-[420px] w-full"
                sizes="(min-width: 768px) 36vw, 100vw"
              />
            </Reveal>
          </div>
        </section>

        {/* WHERE WE SOURCE */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-24">
            <Reveal className="mb-10 max-w-xl">
              <p className="mono text-xs uppercase tracking-widest text-amber">{t("sourceEyebrow")}</p>
              <h2 className="display mt-4 text-4xl leading-tight text-green md:text-5xl">{t("sourceHeading")}</h2>
              <p className="mt-4 text-stone">{t("sourceBody")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <SourcingMap />
            </Reveal>
          </div>
        </section>

        {/* CORE MODEL */}
        <section className="bg-green text-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-14 max-w-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="mono text-[11px] text-amber">(03)</span>
                <span className="h-px w-8 bg-oat/25" />
                <span className="mono text-[11px] uppercase tracking-widest text-oat/60">{tc("eyebrow")}</span>
              </div>
              <h2 className="display text-4xl leading-tight md:text-5xl">{tc("heading")}</h2>
              <p className="mt-5 text-oat/75">{tc("body")}</p>
            </Reveal>
            <div className="grid gap-x-12 sm:grid-cols-2">
              {coreItems.map((c, i) => (
                <Reveal key={c.t} delay={(i % 2) * 0.05}>
                  <div className={`flex gap-5 border-t border-oat/15 py-5 ${i === coreItems.length - 1 || i === coreItems.length - 2 ? "border-b" : ""}`}>
                    <span className="mono pt-1 text-[13px] text-amber">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="display text-xl">{c.t}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-oat/70">{c.d}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* TRACE A BATCH */}
        <section id="trace" className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-12 max-w-xl">
              <Marker n="(04)" label={t("traceMarker")} />
              <h2 className="display text-4xl leading-tight text-green md:text-5xl">{t("traceHeading")}</h2>
              <p className="mt-4 text-stone">{t("traceBody")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <TraceABatch />
            </Reveal>
          </div>
        </section>

        {/* HOW SOURCING WORKS */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-12 max-w-xl">
              <Marker n="(05)" label={t("stepsMarker")} />
              <h2 className="display text-4xl leading-tight text-green">{t("stepsHeading")}</h2>
              <p className="mt-4 text-stone">{t("stepsBody")}</p>
            </Reveal>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <Reveal key={s.t} delay={i * 0.08}>
                  <div className="border-t border-stone/20 pt-5">
                    <p className="mono text-xs text-amber">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="display mt-3 text-lg text-green">{s.t}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-stone">{s.d}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.1}>
              <div className="mono mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-stone/15 pt-6 text-[11px] uppercase tracking-wide text-stone/70">
                <span>{t("termMoq")}</span>
                <span>{t("termLead")}</span>
                <span>{t("termIncoterms")}</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* STAT BAND */}
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 pt-20 pb-12 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.l} delay={i * 0.08}>
                <p className={`display text-6xl ${s.amber ? "text-amber" : "text-oat"}`}>
                  <CountUp value={s.value} suffix={s.suffix} />
                </p>
                <p className="mono mt-3 text-[11px] uppercase tracking-wide text-oat/60">{s.l}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* WHY HONG KONG */}
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-24 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <Reveal>
              <p className="mono text-[11px] uppercase tracking-widest text-amber">{t("hkEyebrow")}</p>
              <p className="mono mt-3 text-sm text-oat/55">{t("hkCoords")}</p>
              <h2 className="display mt-6 text-4xl leading-tight text-oat md:text-5xl">{t("hkHeading")}</h2>
              <p className="mt-6 max-w-xl leading-relaxed text-oat/75">{t("hkBody1")}</p>
              <p className="mt-4 max-w-xl leading-relaxed text-oat/75">{t("hkBody2")}</p>
              <div className="mt-7">
                <ExpertsCluster members={TEAM} tone="dark" label={t("hkExpertsLabel")} />
              </div>
            </Reveal>
            <Reveal delay={0.12} y={28}>
              <OriginPhoto
                src="/photos/harvest-transport.jpg"
                alt="Loaded harvest moving from the gardens"
                caption={t("hkCaption")}
                className="aspect-[4/5] w-full"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </Reveal>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="max-w-xl">
              <Marker n="(06)" label={t("socialMarker")} />
              <h2 className="display text-4xl leading-tight text-green">{t("socialHeading")}</h2>
              <p className="mt-4 text-stone">{t("socialBody")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <figure className="mt-12 max-w-3xl border-l-2 border-amber pl-6">
                <blockquote className="display-italic text-2xl leading-snug text-green md:text-3xl">{t("socialQuote")}</blockquote>
                <figcaption className="mono mt-5 text-[11px] uppercase tracking-wide text-stone/60">{t("socialQuoteAttr")}</figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mono mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-stone/15 pt-6 text-[11px] uppercase tracking-wide text-stone/45">
                {socialTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <Certifications certs={CERTIFICATIONS} partners={PARTNERS} />

        {/* CTA */}
        <section className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-28 text-center">
            <Reveal>
              <h2 className="display text-5xl tracking-tight text-green md:text-6xl">{t("ctaHeading")}</h2>
              <p className="mx-auto mt-5 max-w-lg text-stone">{t("ctaBody")}</p>
              <Link href="/contact" className="mt-9 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaQuote")}
              </Link>
              <p className="mono mt-5 text-[11px] uppercase tracking-wide text-stone/50">{t("ctaNote")}</p>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
