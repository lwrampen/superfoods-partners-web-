import type { Metadata } from "next";
import Image from "next/image";
import { Suspense, type ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { RfqForm } from "@/components/RfqForm";
import { CERTIFICATIONS } from "@/data/trust";

// Landing page for the QR code on the printed A5 leaflet that ships with every
// sample order, worldwide (https://www.superfoodspartners.com/sample). It is the
// web version of the company presentation ("Company Overview — Pure Ingredients.
// Formulated to Thrive."): same story, same look, condensed. Facts and wording
// come from that deck only. No prices, no market data, no named customers or
// farms, no individual/regional sales contacts. Kept out of search and the
// sitemap on purpose so it does not compete with the core pages.
const PATH = "/sample";
const PMP_URL = "https://www.purematchapartners.com";

// The deck's four-colour rule (lime · hojicha · hibiscus · ube).
const RULE = ["#8cc541", "#b24a18", "#ae1d49", "#5a338c"];

// Range cards. `slug` only where a product page exists in the site's routes.
const RANGE = [
  { key: "matcha", img: "/sample/matcha.webp", color: "#1c4b0c", slug: "matcha" },
  { key: "hojicha", img: "/sample/hojicha.webp", color: "#b24a18", slug: "hojicha" },
  { key: "ube", img: "/sample/ube.webp", color: "#5a338c", slug: "ube" },
  { key: "earlGrey", img: "/sample/earl-grey.webp", color: "#3e5a78", slug: "earl-grey-tea-powder" },
  { key: "hibiscus", img: "/sample/hibiscus.webp", color: "#ae1d49", slug: "hibiscus" },
  { key: "mulberry", img: "/sample/mulberry.webp", color: "#5f7f1c" },
  { key: "rooibos", img: "/sample/rooibos.webp", color: "#c0562a" },
] as const;

// "A science-led route" — the deck's five pastel cards.
const ROUTE_COLORS = [
  { bg: "#dcebd3", fg: "#1c4b0c" },
  { bg: "#f8e2cf", fg: "#b24a18" },
  { bg: "#f3d2d9", fg: "#ae1d49" },
  { bg: "#e2d9f0", fg: "#5a338c" },
  { bg: "#faefcf", fg: "#9a6b24" },
];
// Core model: 01 lime/forest · 02 hojicha · 03 hibiscus · 04 ube · 05 ochre · 06 dark.
const MODEL_COLORS = ["#1c4b0c", "#b24a18", "#ae1d49", "#5a338c", "#9a6b24", "#8cc541"];
const ADV_COLORS = ["#8cc541", "#c6a9e4", "#e9b48f"];
const APP_COLORS = ["#1c4b0c", "#9a6b24", "#b24a18", "#5a338c"];

type TD = { t: string; d: string };

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sample" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: alternatesFor(locale, PATH),
    robots: { index: false, follow: true },
  };
}

function ColorRule({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden className={`flex gap-1.5 ${className}`}>
      {RULE.map((c) => (
        <span key={c} className="h-1 w-9 rounded-full" style={{ backgroundColor: c }} />
      ))}
    </span>
  );
}

function Eyebrow({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <p className={`mono text-[11px] uppercase tracking-[0.22em] ${dark ? "text-lime" : "text-stone/70"}`}>{children}</p>
  );
}

export default async function SamplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sample");
  const tf = await getTranslations("rfq");

  const stats = t.raw("global.stats") as { n: string; l: string }[];
  const origins = t.raw("global.origins") as { c: string; n: string; d: string }[];
  const model = t.raw("model.items") as TD[];
  const route = t.raw("route.items") as TD[];
  const adv = t.raw("work.adv") as { tag: string; t: string; d: string; x: string }[];
  const apps = t.raw("work.apps") as TD[];
  const procItems = t.raw("work.procItems") as string[];
  const rdSteps = t.raw("work.rdSteps") as TD[];
  const steps = t.raw("path.steps") as TD[];
  const faq = t.raw("faq.items") as { q: string; a: string }[];
  const STAT_VALUES = [
    { value: 75, suffix: "+" },
    { value: 4, suffix: "M+ kg" },
    { value: 60, suffix: "+" },
  ];

  const h2Light = "display mt-4 text-[2.5rem] leading-[1.02] text-forest md:text-6xl";
  const h2Dark = "display mt-4 text-[2.5rem] leading-[1.02] text-oat md:text-6xl";

  return (
    <>
      <SiteNav />
      <main className="flex-1 overflow-x-clip">
        {/* 1. COVER — dark forest, headline left, full-bleed harvest photo right (deck p.1) */}
        <section className="relative bg-forest text-oat">
          <div className="relative h-[44svh] min-h-[280px] md:absolute md:inset-y-0 md:right-0 md:h-auto md:w-[50%]">
            <Image
              src="/sample/harvest-aerial.webp"
              alt={t("hero.imgAlt")}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[48%_50%]"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest via-forest/0 to-forest/0 md:bg-gradient-to-r md:from-forest/60 md:via-forest/0" />
            <p className="mono absolute right-4 bottom-4 hidden text-[10px] uppercase tracking-[0.2em] text-oat/80 md:block">
              {t("hero.imgCaption")}
            </p>
          </div>
          <div className="relative z-10 mx-auto flex max-w-6xl px-6 md:min-h-[min(calc(100svh-4.5rem),54rem)] md:items-center">
            <Reveal className="-mt-10 pb-14 md:mt-0 md:w-[46%] md:py-24 md:pr-8">
              <Eyebrow dark>{t("hero.eyebrow")}</Eyebrow>
              <ColorRule className="mt-6" />
              <h1 className="display mt-6 text-[3.1rem] leading-[0.98] md:text-[4.6rem]">
                <span className="block">Pure ingredients.</span>
                <span className="block">Formulated to thrive.</span>
              </h1>
              <p className="mt-7 text-xl leading-snug text-oat md:text-2xl">{t("hero.lead")}</p>
              <p className="mt-4 max-w-md leading-relaxed text-oat/70">{t("hero.body")}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a
                  href="#quote"
                  className="group inline-flex items-center justify-center gap-2 rounded-lg bg-lime px-6 py-3.5 text-sm font-semibold text-forest shadow-[0_6px_18px_-6px_rgba(140,197,65,0.7)] transition-all hover:-translate-y-0.5"
                >
                  {t("hero.ctaPrimary")}
                  <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                </a>
                <a
                  href="#range"
                  className="inline-flex items-center justify-center rounded-lg border border-oat/30 px-6 py-3.5 text-sm font-medium text-oat transition-colors hover:border-oat"
                >
                  {t("hero.ctaSecondary")}
                </a>
              </div>
              <p className="mono mt-12 text-[10px] uppercase tracking-[0.2em] text-oat/50">{t("hero.footer")}</p>
            </Reveal>
          </div>
        </section>

        {/* 2. WHO WE ARE — the label & the house (deck p.4) */}
        <section className="bg-offwhite">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <Reveal className="max-w-3xl">
              <Eyebrow>{t("who.eyebrow")}</Eyebrow>
              <h2 className={h2Light}>{t("who.heading")}</h2>
            </Reveal>
            <div className="mt-12 grid gap-5 md:grid-cols-3">
              <Reveal className="h-full">
                <article className="flex h-full flex-col border-t-4 border-lime bg-sand p-7">
                  <p className="mono text-[10px] uppercase tracking-[0.2em] text-stone/70">{t("who.labelTag")}</p>
                  <h3 className="display mt-3 text-3xl text-forest">Pure Matcha Partners</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-stone">{t("who.labelBody")}</p>
                  <a
                    href={PMP_URL}
                    target="_blank"
                    rel="noopener"
                    className="mono mt-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-forest underline-offset-4 hover:underline"
                  >
                    purematchapartners.com <span aria-hidden>↗</span>
                  </a>
                </article>
              </Reveal>
              <Reveal delay={0.06} className="h-full">
                <article className="flex h-full flex-col border-t-4 border-forest bg-forest p-7 text-oat">
                  <p className="mono text-[10px] uppercase tracking-[0.2em] text-lime">{t("who.houseTag")}</p>
                  <h3 className="display mt-3 text-3xl">Superfoods Partners</h3>
                  <p className="mt-4 flex-1 leading-relaxed text-oat/75">{t("who.houseBody")}</p>
                  <p className="mono mt-6 text-[10px] uppercase tracking-[0.2em] text-oat/50">{t("who.endorse")}</p>
                </article>
              </Reveal>
              <Reveal delay={0.12} className="h-full">
                <figure className="flex h-full flex-col bg-sand">
                  <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-auto md:flex-1">
                    <Image
                      src="/sample/team-at-origin.webp"
                      alt={t("who.teamAlt")}
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="p-5 text-sm leading-relaxed text-stone">{t("who.teamCaption")}</figcaption>
                </figure>
              </Reveal>
            </div>
            <Reveal>
              <div className="mt-5 flex flex-col gap-3 border-t border-stone/15 pt-6 md:flex-row md:items-baseline md:gap-6">
                <p className="mono shrink-0 text-[11px] uppercase tracking-[0.2em] text-forest">{t("who.countries")}</p>
                <p className="text-stone">{t("who.locations")}</p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. YOUR GLOBAL SUPPLY PARTNER — stats + origins (deck p.5) */}
        <section className="bg-forest text-oat">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-12 md:grid-cols-[1fr_1fr] md:items-center md:gap-16">
              <Reveal>
                <Eyebrow dark>{t("global.eyebrow")}</Eyebrow>
                <h2 className={h2Dark}>{t("global.heading")}</h2>
                <dl className="mt-10 grid grid-cols-3 gap-px overflow-hidden bg-oat/10">
                  {stats.map((s, i) => (
                    <div key={i} className="border-t-4 border-lime bg-forest py-4 pr-2 pl-3 first:pl-0 sm:py-5 sm:pr-4 sm:pl-4 sm:first:pl-0 lg:first:pl-4">
                      <dt className="mono text-[10px] uppercase tracking-[0.2em] text-oat/55">{s.n}</dt>
                      <dd className="display mt-2 text-[1.9rem] leading-none text-oat sm:text-5xl">
                        <CountUp value={STAT_VALUES[i].value} suffix={STAT_VALUES[i].suffix} />
                      </dd>
                      <dd className="mt-2 text-xs leading-snug text-oat/70 sm:text-sm">{s.l}</dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
              <Reveal delay={0.1}>
                <figure className="relative aspect-[4/5] overflow-hidden rounded-sm md:aspect-square">
                  <Image
                    src="/sample/hands-picking.webp"
                    alt={t("global.imgAlt")}
                    fill
                    sizes="(min-width: 768px) 45vw, 100vw"
                    className="object-cover object-[58%_50%]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
                  <figcaption className="mono absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-oat/85">
                    {t("global.imgCaption")}
                  </figcaption>
                </figure>
              </Reveal>
            </div>

            <Reveal className="mt-20">
              <p className="mono text-[11px] uppercase tracking-[0.22em] text-oat/55">{t("global.originsLabel")}</p>
            </Reveal>
            <div className="mt-6 grid gap-5 md:grid-cols-[0.9fr_1.6fr]">
              <Reveal>
                <figure className="relative aspect-[4/3] h-full overflow-hidden rounded-sm md:aspect-auto md:min-h-[22rem]">
                  <Image
                    src="/sample/tea-shoots-china.webp"
                    alt={t("global.chinaAlt")}
                    fill
                    sizes="(min-width: 768px) 35vw, 100vw"
                    className="object-cover object-[50%_70%]"
                  />
                  <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
                  <figcaption className="mono absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-oat/85">
                    {t("global.chinaCaption")}
                  </figcaption>
                </figure>
              </Reveal>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {origins.map((o, i) => (
                  <Reveal key={i} delay={i * 0.04} className="h-full">
                    <div className="h-full border-t-4 border-lime bg-oat/[0.05] p-4 md:p-5">
                      <p className="mono text-[10px] uppercase tracking-[0.18em] text-lime">{o.c}</p>
                      <p className="mt-2 text-lg font-semibold leading-tight text-oat">{o.n}</p>
                      <p className="mt-2 text-sm leading-snug text-oat/65">{o.d}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal>
              <p className="mt-8 max-w-3xl text-lg leading-relaxed text-oat/75">
                {t.rich("global.note", { b: (c) => <strong className="font-semibold text-oat">{c}</strong> })}
              </p>
            </Reveal>
          </div>
        </section>

        {/* 4. OUR CORE MODEL — six points (deck p.6) */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <Reveal>
                <Eyebrow>{t("model.eyebrow")}</Eyebrow>
                <h2 className={h2Light}>{t("model.heading")}</h2>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="text-lg leading-relaxed text-stone md:pb-2">{t("model.intro")}</p>
              </Reveal>
            </div>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {model.map((m, i) => {
                const dark = i === 5;
                return (
                  <Reveal key={i} delay={(i % 3) * 0.05} className="h-full">
                    <article
                      className={`flex h-full flex-col border-t-4 p-7 ${dark ? "bg-forest text-oat" : "bg-offwhite"}`}
                      style={{ borderColor: MODEL_COLORS[i] }}
                    >
                      <span className="display text-4xl" style={{ color: MODEL_COLORS[i] }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className={`mt-4 text-lg font-semibold leading-snug ${dark ? "text-oat" : "text-forest"}`}>{m.t}</h3>
                      <p className={`mt-3 leading-relaxed ${dark ? "text-oat/75" : "text-stone"}`}>{m.d}</p>
                      {i === 3 && (
                        <div className="mt-auto pt-6">
                          <Image src="/certs/eurofins.png" alt="Eurofins" width={160} height={60} className="h-8 w-auto object-contain" />
                        </div>
                      )}
                      {i === 4 && (
                        <ul className="mt-auto grid grid-cols-3 gap-2 pt-6">
                          {CERTIFICATIONS.filter((c) => c.logo).map((c) => (
                            <li key={c.name} title={c.name} className="flex h-16 items-center justify-center rounded-md border border-stone/10 bg-white px-2">
                              <Image src={c.logo!} alt={c.name} width={120} height={60} className="max-h-11 w-auto max-w-full object-contain" />
                            </li>
                          ))}
                        </ul>
                      )}
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. OUR OPERATING MODEL — science-led route (deck p.7) */}
        <section className="bg-forest text-oat">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <Reveal className="max-w-4xl">
              <Eyebrow dark>{t("route.eyebrow")}</Eyebrow>
              <h2 className={h2Dark}>{t("route.heading")}</h2>
            </Reveal>
            <ol className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {route.map((r, i) => (
                <Reveal key={i} delay={i * 0.05} className="h-full">
                  <li
                    className="flex h-full flex-col border-t-[6px] p-6 lg:min-h-[19rem]"
                    style={{ backgroundColor: ROUTE_COLORS[i].bg, borderColor: ROUTE_COLORS[i].fg }}
                  >
                    <span className="display text-4xl" style={{ color: ROUTE_COLORS[i].fg }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-6 text-xl font-semibold leading-tight text-forest lg:mt-auto">{r.t}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-forest/70">{r.d}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 6. THE RANGE — one card per line (deck pp.13–25) */}
        <section id="range" className="scroll-mt-20 bg-offwhite">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr] md:items-end">
              <Reveal>
                <Eyebrow>{t("range.eyebrow")}</Eyebrow>
                <h2 className={h2Light}>{t("range.heading")}</h2>
              </Reveal>
              <Reveal delay={0.06}>
                <p className="text-lg leading-relaxed text-stone md:pb-2">{t("range.intro")}</p>
              </Reveal>
            </div>
          </div>
          <div className="mx-auto -mt-8 max-w-6xl pb-20 md:px-6 md:pb-28">
            <ul className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 [scrollbar-width:none] md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 md:pb-0 [&::-webkit-scrollbar]:hidden">
              {RANGE.map((r, i) => {
                const featured = i === 0;
                return (
                  <li
                    key={r.key}
                    className={`w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto ${featured ? "md:col-span-2" : ""}`}
                  >
                    <Reveal delay={(i % 3) * 0.05} className="h-full">
                      <article className="flex h-full flex-col border-t-4 bg-white" style={{ borderColor: r.color }}>
                        <div className={`relative w-full overflow-hidden ${featured ? "aspect-[4/3] md:aspect-[2.1/1]" : "aspect-[4/3]"}`}>
                          <Image
                            src={r.img}
                            alt={t(`range.items.${r.key}.alt`)}
                            fill
                            sizes={featured ? "(min-width: 768px) 66vw, 82vw" : "(min-width: 768px) 33vw, 82vw"}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col p-6">
                          <p className="mono text-[10px] uppercase tracking-[0.18em]" style={{ color: r.color }}>
                            {t(`range.items.${r.key}.tag`)}
                          </p>
                          <h3 className="display mt-2 text-3xl text-forest">{t(`range.items.${r.key}.name`)}</h3>
                          <p className="mt-3 leading-relaxed text-stone">{t(`range.items.${r.key}.body`)}</p>
                          <p className="mono mt-5 text-[10px] uppercase tracking-[0.18em] text-stone/60">{t("range.appsLabel")}</p>
                          <p className="mt-1.5 text-sm leading-relaxed text-forest">{t(`range.items.${r.key}.apps`)}</p>
                          {"slug" in r && (
                            <Link
                              href={`/products/${r.slug}`}
                              className="mono mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] uppercase tracking-widest text-forest underline-offset-4 hover:underline"
                            >
                              {t("range.view")} <span aria-hidden>→</span>
                            </Link>
                          )}
                        </div>
                      </article>
                    </Reveal>
                  </li>
                );
              })}
              <li className="w-[82%] shrink-0 snap-start sm:w-[60%] md:w-auto">
                <Reveal delay={0.1} className="h-full">
                  <div className="flex h-full min-h-[22rem] flex-col justify-between bg-forest p-7 text-oat">
                    <div>
                      <ColorRule />
                      <p className="display mt-6 text-3xl leading-tight">{t("range.ctaHeading")}</p>
                      <p className="mt-4 leading-relaxed text-oat/70">{t("range.ctaBody")}</p>
                    </div>
                    <div className="mt-8 flex flex-col gap-3">
                      <a href="#quote" className="rounded-lg bg-lime px-5 py-3 text-center text-sm font-semibold text-forest transition-opacity hover:opacity-90">
                        {t("hero.ctaPrimary")}
                      </a>
                      <Link href="/products" className="mono text-center text-[11px] uppercase tracking-widest text-oat/80 underline-offset-4 hover:underline">
                        {t("range.all")} →
                      </Link>
                    </div>
                  </div>
                </Reveal>
              </li>
            </ul>
            <p className="mono mt-2 px-6 text-[10px] uppercase tracking-[0.2em] text-stone/50 md:hidden">{t("range.swipe")}</p>
          </div>
        </section>

        {/* 7. WORKING WITH SUPERFOODS PARTNERS — chapter divider + advantages (deck pp.26–28) */}
        <section className="bg-forest text-oat">
          <div className="relative h-[16rem] md:h-[26rem]">
            <Image src="/sample/tea-rows.webp" alt={t("work.imgAlt")} fill sizes="100vw" className="object-cover" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-forest/0 via-forest/25 to-forest" />
            <div className="absolute inset-x-0 bottom-0">
              <Reveal className="mx-auto max-w-6xl px-6 pb-4">
                <Eyebrow dark>{t("work.chapter")}</Eyebrow>
                <h2 className="display mt-4 max-w-3xl text-[2.6rem] leading-[1.02] md:text-7xl">{t("work.heading")}</h2>
              </Reveal>
            </div>
          </div>
          <div className="mx-auto max-w-6xl px-6 pt-8 pb-20 md:pb-28">
            <Reveal>
              <p className="max-w-2xl text-lg leading-relaxed text-oat/75">{t("work.intro")}</p>
            </Reveal>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              {adv.map((a, i) => (
                <Reveal key={i} delay={i * 0.06} className="h-full">
                  <article className="h-full border-t-4 bg-oat/[0.05] p-7" style={{ borderColor: ADV_COLORS[i] }}>
                    <p className="mono text-[10px] uppercase tracking-[0.2em] text-oat/55">{a.tag}</p>
                    <h3 className="mt-3 text-xl font-semibold text-oat">{a.t}</h3>
                    <p className="mt-3 leading-relaxed text-oat/75">{a.d}</p>
                    <p className="mt-4 text-sm font-semibold leading-relaxed text-oat/90">{a.x}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 7b. APPLICATIONS + R&D + PROCESSING (deck pp.29–37, 40) */}
        <section className="bg-offwhite">
          <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
            <Reveal className="max-w-3xl">
              <Eyebrow>{t("work.appsEyebrow")}</Eyebrow>
              <h2 className={h2Light}>{t("work.appsHeading")}</h2>
            </Reveal>
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {apps.map((a, i) => (
                <Reveal key={i} delay={i * 0.05} className="h-full">
                  <article className="h-full border-t-4 bg-sand p-6" style={{ borderColor: APP_COLORS[i] }}>
                    <p className="mono text-[10px] uppercase tracking-[0.2em]" style={{ color: APP_COLORS[i] }}>
                      {String(i + 1).padStart(2, "0")} — {t("work.category")}
                    </p>
                    <h3 className="display mt-3 text-2xl leading-tight text-forest">{a.t}</h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-stone">{a.d}</p>
                  </article>
                </Reveal>
              ))}
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-[1.25fr_1fr]">
              <Reveal className="h-full">
                <article className="grid h-full overflow-hidden bg-sand md:grid-cols-[0.9fr_1.1fr]">
                  <div className="relative aspect-[16/10] md:aspect-auto">
                    <Image
                      src="/sample/matcha-whisk.webp"
                      alt={t("work.whiskAlt")}
                      fill
                      sizes="(min-width: 1024px) 28vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-7">
                    <p className="mono text-[10px] uppercase tracking-[0.2em] text-stone/70">{t("work.rdEyebrow")}</p>
                    <h3 className="display mt-3 text-3xl leading-tight text-forest">{t("work.rdHeading")}</h3>
                    <p className="mt-3 leading-relaxed text-stone">{t("work.rdBody")}</p>
                    <ol className="mt-5 space-y-3">
                      {rdSteps.map((s, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="display w-4 shrink-0 text-xl text-lime">{i + 1}</span>
                          <span className="text-sm leading-relaxed text-stone">
                            <strong className="font-semibold text-forest">{s.t}</strong> — {s.d}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </article>
              </Reveal>
              <Reveal delay={0.08} className="h-full">
                <article className="flex h-full flex-col bg-forest p-7 text-oat">
                  <p className="mono text-[10px] uppercase tracking-[0.2em] text-lime">{t("work.procEyebrow")}</p>
                  <h3 className="display mt-3 text-3xl leading-tight">{t("work.procHeading")}</h3>
                  <p className="mt-3 leading-relaxed text-oat/75">{t("work.procBody")}</p>
                  <ul className="mt-6 grid grid-cols-2 gap-2">
                    {procItems.map((p, i) => (
                      <li key={i} className="border-t-2 bg-oat/[0.06] px-3 py-3 text-sm text-oat hyphens-auto [overflow-wrap:anywhere]" style={{ borderColor: RULE[i] }}>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto pt-6 text-sm text-oat/70">{t("work.procNote")}</p>
                </article>
              </Reveal>
            </div>
          </div>
        </section>

        {/* 8. FROM SAMPLE TO PRODUCTION */}
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.9fr_1.1fr] md:items-center md:gap-16 md:py-28">
            <Reveal className="order-2 md:order-1">
              <figure className="relative aspect-[4/3] overflow-hidden rounded-sm md:aspect-square">
                <Image
                  src="/sample/harvest-dusk.webp"
                  alt={t("path.imgAlt")}
                  fill
                  sizes="(min-width: 768px) 42vw, 100vw"
                  className="object-cover object-[85%_50%]"
                />
                <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-forest/70 via-transparent to-transparent" />
                <figcaption className="mono absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] text-oat/85">
                  {t("path.imgCaption")}
                </figcaption>
              </figure>
            </Reveal>
            <div className="order-1 md:order-2">
              <Reveal>
                <Eyebrow dark>{t("path.eyebrow")}</Eyebrow>
                <h2 className={h2Dark}>{t("path.heading")}</h2>
              </Reveal>
              <ol className="mt-10 border-l border-oat/15">
                {steps.map((s, i) => (
                  <Reveal key={i} delay={i * 0.06}>
                    <li className="relative pb-8 pl-8 last:pb-0">
                      <span aria-hidden className="absolute top-2 -left-[5px] h-[9px] w-[9px] rounded-full bg-lime" />
                      <span className="display text-4xl text-lime">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="mt-1 text-xl font-semibold text-oat">{s.t}</h3>
                      <p className="mt-1.5 leading-relaxed text-oat/70">{s.d}</p>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 9. CONTACT — RFQ form + talk to our team (no individual or regional contacts) */}
        <section id="quote" className="scroll-mt-20 bg-offwhite">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-[0.85fr_1.15fr] md:py-28">
            <Reveal>
              <Eyebrow>{t("quote.eyebrow")}</Eyebrow>
              <h2 className={h2Light}>{t("quote.heading")}</h2>
              <p className="mt-5 max-w-md text-lg leading-relaxed text-stone">{t("quote.lead")}</p>
              <div className="mt-8 border-t border-stone/15 pt-6">
                <p className="text-stone">{t("quote.talk")}</p>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-forest/25 px-5 py-3 text-sm font-medium text-forest transition-colors hover:bg-forest/5"
                >
                  {t("quote.talkLink")} <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
            <Suspense fallback={<div className="rounded-xl border border-stone/15 bg-sand p-8 text-stone">{tf("loading")}</div>}>
              <RfqForm />
            </Suspense>
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="bg-sand">
          <div className="mx-auto max-w-3xl px-6 py-20 md:py-24">
            <Reveal>
              <Eyebrow>{t("faq.eyebrow")}</Eyebrow>
              <h2 className="display mt-4 text-4xl leading-tight text-forest md:text-5xl">{t("faq.heading")}</h2>
            </Reveal>
            <div className="mt-10 divide-y divide-stone/15 border-y border-stone/15">
              {faq.map((f, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-lg font-medium text-forest [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="mt-0.5 text-2xl leading-none text-stone/60 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-stone">{f.a}</p>
                </details>
              ))}
            </div>
            <p className="mono mt-12 text-center text-[11px] uppercase tracking-[0.22em] text-forest">
              Pure ingredients. Formulated to thrive.
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
