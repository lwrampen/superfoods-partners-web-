import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { OriginPhoto } from "@/components/OriginPhoto";
import { TeamSection } from "@/components/TeamSection";
import { Certifications } from "@/components/Certifications";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { TEAM, CERTIFICATIONS, PARTNERS } from "@/data/trust";
import { ENTITIES } from "@/data/entities";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/company"),
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("core");
  const th = await getTranslations("home");
  const coreItems = tc.raw("items") as { t: string; d: string }[];

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-[1.05fr_0.95fr] md:pt-24 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">{t("eyebrow")}</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("eyebrowSub")}</span>
            </div>
            <h1 className="display mt-5 max-w-2xl text-5xl leading-[1.04] text-green md:text-6xl">{t("heroHeading")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">{t("heroBody1")}</p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone">{t("heroBody2")}</p>
          </Reveal>
          <Reveal delay={0.12} y={28}>
            <OriginPhoto
              src="/photos/grower-portrait.jpg"
              alt="A grower in the shade-grown gardens"
              caption={t("heroCaption")}
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="aspect-[4/5] w-full shadow-[0_30px_80px_-40px_rgba(20,39,27,0.55)]"
            />
          </Reveal>
        </section>

        {/* TWO BRANDS, ONE HOUSE — the umbrella architecture */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-12 max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="mono text-[11px] text-amber">{t("houseEyebrow")}</span>
                <span className="h-px w-8 bg-stone/30" />
              </div>
              <h2 className="display text-4xl leading-tight text-green md:text-5xl">{t("houseHeading")}</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone">{t("houseBody")}</p>
            </Reveal>

            {/* the house → labels diagram */}
            <Reveal>
              <div className="rounded-2xl border border-stone/15 bg-white p-6 md:p-8">
                <div className="border-b border-stone/10 pb-6">
                  <span className="mono text-[10px] uppercase tracking-widest text-amber">{t("houseUmbrellaTag")}</span>
                  <p className="display mt-2 text-2xl text-green md:text-3xl">Superfoods Partners</p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-stone/80">{t("houseUmbrellaBody")}</p>
                </div>
                {/* connector */}
                <div className="mx-auto h-6 w-px bg-stone/20" aria-hidden />
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Pure Matcha Partners — the live specialist label */}
                  <a
                    href="https://www.purematchapartners.com"
                    target="_blank"
                    rel="noopener"
                    className="group rounded-xl border border-green/20 bg-oat p-6 transition-colors hover:border-amber"
                  >
                    <div className="flex items-center justify-between">
                      <span className="mono text-[10px] uppercase tracking-widest text-amber">{t("housePmpTag")}</span>
                      <span className="mono text-[11px] text-stone/40 transition-colors group-hover:text-green">↗</span>
                    </div>
                    <p className="display mt-3 text-xl text-green">Pure Matcha Partners</p>
                    <p className="mt-2 text-sm leading-relaxed text-stone/80">{t("housePmpBody")}</p>
                    <p className="mono mt-4 border-t border-stone/10 pt-3 text-[10px] uppercase leading-relaxed tracking-wide text-stone/55">
                      Pure Matcha Partners — a Superfoods Partners brand
                    </p>
                  </a>
                  {/* future labels — muted placeholder */}
                  <div className="rounded-xl border border-dashed border-stone/25 bg-oat/40 p-6">
                    <span className="mono text-[10px] uppercase tracking-widest text-stone/45">{t("houseSoonTag")}</span>
                    <p className="display mt-3 text-xl text-stone/45">{t("houseSoonTitle")}</p>
                    <p className="mt-2 text-sm leading-relaxed text-stone/55">{t("houseSoonBody")}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* two routes a product reaches a buyer */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal>
                <div className="h-full rounded-xl border border-stone/15 bg-white p-6">
                  <h3 className="display text-lg text-green">{t("houseRouteOwnTitle")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone/80">{t("houseRouteOwnBody")}</p>
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className="h-full rounded-xl border border-stone/15 bg-white p-6">
                  <h3 className="display text-lg text-green">{t("houseRoutePrivTitle")}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-stone/80">{t("houseRoutePrivBody")}</p>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* The team — real faces, placed high for trust */}
        <TeamSection members={TEAM} />

        {/* CORE MODEL */}
        <section className="bg-green text-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-14 max-w-xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="mono text-[11px] text-amber">{tc("eyebrow")}</span>
                <span className="h-px w-8 bg-oat/25" />
                <span className="mono text-[11px] uppercase tracking-widest text-oat/60">{tc("eyebrowSub")}</span>
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

        {/* Hong Kong / the family */}
        <section className="bg-forest text-oat">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 md:grid-cols-[1.05fr_0.95fr] md:items-center">
            <Reveal>
              <p className="mono text-[11px] uppercase tracking-widest text-amber">{th("hkEyebrow")}</p>
              <p className="mono mt-3 text-sm text-oat/55">{th("hkCoords")}</p>
              <h2 className="display mt-6 text-4xl leading-tight text-oat md:text-5xl">{th("hkHeading")}</h2>
              <p className="mt-6 max-w-xl leading-relaxed text-oat/75">{th("hkBody1")}</p>
              <p className="mt-4 max-w-xl leading-relaxed text-oat/75">{th("hkBody2")}</p>
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

        {/* GROUP & OPERATING ENTITIES */}
        <section className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Reveal className="mb-12 max-w-2xl">
              <div className="mb-4 flex items-center gap-3">
                <span className="mono text-[11px] text-amber">{t("groupEyebrow")}</span>
                <span className="h-px w-8 bg-stone/30" />
              </div>
              <h2 className="display text-4xl leading-tight text-green md:text-5xl">{t("groupHeading")}</h2>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-stone">{t("groupBody")}</p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {ENTITIES.map((e) => (
                <Reveal key={e.code}>
                  <div className="h-full rounded-xl border border-stone/15 bg-white p-6">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="display text-lg text-green">{e.name}</p>
                      <span className="mono text-[11px] text-amber">{e.code}</span>
                    </div>
                    <address className="mono mt-4 block text-[12px] not-italic leading-relaxed text-stone/70">
                      {e.address.map((line) => (
                        <span key={line} className="block">{line}</span>
                      ))}
                      <span className="block">{e.country}</span>
                    </address>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications + independent labs */}
        <Certifications certs={CERTIFICATIONS} partners={PARTNERS} />

        <section className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-28 text-center">
            <Reveal>
              <h2 className="display text-4xl tracking-tight text-green md:text-5xl">{t("ctaHeading")}</h2>
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
