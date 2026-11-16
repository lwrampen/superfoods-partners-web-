import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { Certifications } from "@/components/Certifications";
import { OriginPhoto } from "@/components/OriginPhoto";
import { RfqForm } from "@/components/RfqForm";
import { getProduct } from "@/data/catalog";
import { CERTIFICATIONS, PARTNERS } from "@/data/trust";

// Landing page for the QR code on the printed leaflet in every sample order
// (https://www.superfoodspartners.com/sample). Kept out of search and the
// sitemap on purpose so it does not compete with the core pages. Facts come
// from the owner's brief only.
const PATH = "/sample";
const PMP_URL = "https://www.purematchapartners.com";
// Sales contacts as already shown publicly on /hong-kong.
const TEAM = [
  { name: "Max Duijsens", email: "max@purematchapartners.com", phone: "+31 6 25111913", photo: "/team/max.webp", role: "roleSalesEurope" },
  { name: "Emily Chun", email: "emily@purematchapartners.com", phone: undefined, photo: "/team/emily.webp", role: "roleSalesHk" },
] as const;
// Range lines: product page slug where one exists (mulberry and rooibos have none).
const RANGE: { key: string; slug?: string; accent?: string }[] = [
  { key: "matcha", slug: "matcha" },
  { key: "hojicha", slug: "hojicha" },
  { key: "ube", slug: "ube" },
  { key: "hibiscus", slug: "hibiscus" },
  { key: "mulberry" },
  { key: "rooibos" },
  { key: "earlGrey", slug: "earl-grey-tea-powder" },
];
const STATS = [
  { value: 75, suffix: "+" },
  { value: 4, suffix: "M+" },
  { value: 60, suffix: "+" },
];
const LOC_KEYS = [0, 1, 2] as const;
const ORIGIN_KEYS = [0, 1, 2] as const;
const HOW_KEYS = [0, 1, 2, 3] as const;
const STEP_KEYS = [0, 1, 2, 3] as const;
const FAQ_KEYS = [0, 1, 2, 3] as const;

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

export default async function SamplePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("sample");
  const tf = await getTranslations("rfq");

  const card = "rounded-2xl border border-stone/15 bg-white p-6";
  const eyebrow = "mono text-[11px] uppercase tracking-widest text-stone/60";
  const textLink = "inline-block text-sm font-medium text-green underline-offset-4 hover:underline";
  const eurofins = PARTNERS.filter((p) => p.name === "Eurofins");

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* 1. HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-[1.1fr_0.9fr] md:pt-24 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">{t("eyebrow")}</span>
              <span className="h-px w-8 bg-stone/30" />
            </div>
            <h1 className="display mt-5 text-5xl leading-[1.04] text-green md:text-6xl">{t("heading")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">{t("lead")}</p>
            <p className="mono mt-6 text-[11px] uppercase tracking-widest text-green">{t("slogan")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#quote" className="rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaPrimary")}
              </a>
              <a href="#team" className="rounded-lg border border-stone/25 px-6 py-3.5 text-sm font-medium text-green transition-colors hover:border-green">
                {t("ctaSecondary")} →
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <OriginPhoto
              src="/photos/hero-shade-nets.jpg"
              alt={t("imgAlt")}
              caption={t("imgCaption")}
              className="aspect-[4/5] w-full"
              rounded="rounded-2xl"
              sizes="(min-width: 768px) 40vw, 100vw"
              priority
            />
          </Reveal>
        </section>

        {/* 2. WHO WE ARE */}
        <section className="border-y border-stone/15 bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <Reveal>
              <span className={eyebrow}>{t("whoEyebrow")}</span>
              <h2 className="display mt-4 max-w-3xl text-4xl leading-tight text-green">{t("whoHeading")}</h2>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-stone">{t("whoBody")}</p>
              <a href={PMP_URL} target="_blank" rel="noopener" className={`${textLink} mt-5`}>
                {t("pmpLink")} ↗
              </a>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {STATS.map((s, i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <div className={card}>
                    <p className="display text-5xl text-green">
                      <CountUp value={s.value} suffix={s.suffix} />
                    </p>
                    <p className="mono mt-2 text-[11px] uppercase tracking-wide text-stone/60">{t(`stats.${i}`)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal>
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-stone/20 pt-6">
                <span className={eyebrow}>{t("locEyebrow")}</span>
                {LOC_KEYS.map((i) => (
                  <span key={i} className="flex items-center gap-2 text-green">
                    <span className="h-2 w-2 rounded-full bg-amber" />
                    {t(`locations.${i}`)}
                  </span>
                ))}
                <Link href="/hong-kong" className={textLink}>{t("hkLink")} →</Link>
              </div>
            </Reveal>
          </div>
        </section>

        {/* 3. ORIGINS */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <span className={eyebrow}>{t("originsEyebrow")}</span>
            <h2 className="display mt-4 max-w-3xl text-4xl leading-tight text-green">{t("originsHeading")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {ORIGIN_KEYS.map((i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div className="h-full border-t border-stone/20 pt-5">
                  <h3 className="display text-2xl text-green">{t(`origins.${i}.c`)}</h3>
                  <p className="mt-3 text-lg text-green">{t(`origins.${i}.p`)}</p>
                  {t(`origins.${i}.n`) && <p className="mono mt-2 text-[11px] uppercase tracking-wide text-stone/60">{t(`origins.${i}.n`)}</p>}
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <Link href="/origins" className={`${textLink} mt-8`}>{t("originsLink")} →</Link>
          </Reveal>
        </section>

        {/* 4. HOW WE WORK */}
        <section className="border-t border-stone/15 bg-sand">
          <div className="mx-auto max-w-6xl px-6 pt-16 pb-4 md:pt-20">
            <Reveal>
              <span className={eyebrow}>{t("howEyebrow")}</span>
              <h2 className="display mt-4 max-w-3xl text-4xl leading-tight text-green">{t("howHeading")}</h2>
            </Reveal>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {HOW_KEYS.map((i) => (
                <Reveal key={i} delay={i * 0.04}>
                  <div className={`${card} h-full`}>
                    <p className="mono text-[10px] uppercase tracking-widest text-amber">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-3 text-lg font-medium text-green">{t(`how.${i}.t`)}</h3>
                    <p className="mt-2 leading-relaxed text-stone">{t(`how.${i}.d`)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Certifications certs={CERTIFICATIONS} partners={eurofins} />
        </section>

        {/* 5. THE RANGE */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <span className={eyebrow}>{t("rangeEyebrow")}</span>
            <h2 className="display mt-4 max-w-3xl text-4xl leading-tight text-green">{t("rangeHeading")}</h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {RANGE.map((r, i) => {
              const product = r.slug ? getProduct(r.slug) : undefined;
              const inner = (
                <>
                  <span className="block h-1.5 w-10 rounded-full" style={{ backgroundColor: product?.accent ?? "var(--color-lime)" }} />
                  <span className="display mt-4 block text-2xl text-green">{t(`range.${r.key}`)}</span>
                </>
              );
              return (
                <Reveal key={r.key} delay={i * 0.03}>
                  {product ? (
                    <Link href={`/products/${product.slug}`} className={`${card} block h-full transition-colors hover:border-green`}>
                      {inner}
                    </Link>
                  ) : (
                    <div className={`${card} h-full`}>{inner}</div>
                  )}
                </Reveal>
              );
            })}
          </div>
          <Reveal>
            <Link href="/products" className={`${textLink} mt-8`}>{t("rangeLink")} →</Link>
          </Reveal>
        </section>

        {/* 6. FROM SAMPLE TO PRODUCTION */}
        <section className="border-y border-stone/15 bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <Reveal>
              <span className={eyebrow}>{t("pathEyebrow")}</span>
              <h2 className="display mt-4 max-w-3xl text-4xl leading-tight text-green">{t("pathHeading")}</h2>
            </Reveal>
            <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {STEP_KEYS.map((i) => (
                <Reveal key={i} delay={i * 0.05}>
                  <li className="h-full border-t-2 border-green pt-5">
                    <span className="display text-5xl text-amber">{i + 1}</span>
                    <h3 className="mt-3 text-lg font-medium text-green">{t(`steps.${i}.t`)}</h3>
                    <p className="mt-2 leading-relaxed text-stone">{t(`steps.${i}.d`)}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
          </div>
        </section>

        {/* 7. CONTACT: quote form + sales team */}
        <section id="quote" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-16 md:py-20">
          <div className="grid gap-12 md:grid-cols-[0.8fr_1.2fr]">
            <Reveal>
              <span className={eyebrow}>{t("quoteEyebrow")}</span>
              <h2 className="display mt-4 text-4xl leading-tight text-green">{t("quoteHeading")}</h2>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-stone">{t("quoteLead")}</p>
            </Reveal>
            <Suspense fallback={<div className="rounded-xl border border-stone/15 bg-sand p-8 text-stone">{tf("loading")}</div>}>
              <RfqForm />
            </Suspense>
          </div>
          <div id="team" className="mt-16 scroll-mt-20">
            <Reveal>
              <span className={eyebrow}>{t("teamEyebrow")}</span>
              <h2 className="display mt-4 text-3xl leading-tight text-green">{t("teamHeading")}</h2>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {TEAM.map((m, i) => (
                <Reveal key={m.name} delay={i * 0.05}>
                  <div className={`${card} flex items-center gap-5`}>
                    <Image src={m.photo} alt={m.name} width={80} height={80} className="h-20 w-20 shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 text-sm">
                      <p className="text-lg font-medium text-green">{m.name}</p>
                      <p className="mono text-[10px] uppercase tracking-widest text-stone/50">{t(m.role)}</p>
                      <p className="mt-2 break-words text-stone">
                        {t("emailLabel")}: <a href={`mailto:${m.email}`} className="text-green underline-offset-4 hover:underline">{m.email}</a>
                      </p>
                      {m.phone && <p className="text-stone">{t("phoneLabel")}: {m.phone}</p>}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 8. FAQ */}
        <section className="mx-auto max-w-3xl px-6 pb-20 md:pb-24">
          <h2 className="display text-4xl text-green">{t("faqHeading")}</h2>
          <div className="mt-8 divide-y divide-stone/15 border-y border-stone/15">
            {FAQ_KEYS.map((i) => (
              <details key={i} className="group py-5">
                <summary className="cursor-pointer list-none text-lg font-medium text-green">{t(`faq.${i}.q`)}</summary>
                <p className="mt-3 leading-relaxed text-stone">{t(`faq.${i}.a`)}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
