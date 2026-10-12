import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TraceABatch } from "@/components/TraceABatch";
import { Reveal } from "@/components/Reveal";
import { CountUp } from "@/components/CountUp";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { OriginPhoto } from "@/components/OriginPhoto";
import { LocationsMap } from "@/components/LocationsMap";
import { Certifications } from "@/components/Certifications";
import { ClientLogos } from "@/components/ClientLogos";
import { ExpertsCluster } from "@/components/ExpertsCluster";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { PRODUCTS, ORIGIN_LIST } from "@/data/catalog";
import { TEAM, CERTIFICATIONS, PARTNERS, CLIENTS } from "@/data/trust";

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
  const tp = await getTranslations("promises");

  const promiseItems = tp.raw("items") as { t: string; d: string }[];
  const peopleItems = t.raw("peopleItems") as { t: string; d: string }[];
  const peopleStrip = t.raw("peopleStrip") as { src: string; alt: string; cap: string }[];
  const reviews = t.raw("reviews") as { q: string; name: string; role: string }[];
  const audienceHrefs = ["/products", "/verification", "/contact"];
  const audienceRooms = (
    t.raw("audiences.rooms") as { tag: string; who: string; body: string; cta: string }[]
  ).map((r, i) => ({ ...r, href: audienceHrefs[i] }));
  const stats = [
    { value: ORIGIN_LIST.length, suffix: "", l: t("statOrigins") },
    { value: new Set(ORIGIN_LIST.map((o) => o.country)).size, suffix: "", l: t("statCountries") },
    { value: 100, suffix: "%", l: t("statTested") },
    { value: 5, suffix: "", l: t("statHub"), amber: true },
  ];

  return (
    <>
      <SiteNav />

      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-14 pb-20 md:grid-cols-[1.05fr_0.95fr] md:gap-14 md:pt-24 md:pb-28">
          <Reveal>
            <p className="mono text-xs uppercase tracking-widest text-amber">{t("heroEyebrow")}</p>
            <h1 className="display mt-6 text-[2.9rem] leading-[1.02] text-green md:text-[3.9rem]">
              {t("heroTitle1")}
              <br />
              {t("heroTitle2")}
            </h1>
            <p className="mt-7 max-w-lg text-lg leading-relaxed text-stone">{t("heroIntro")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact" className="rounded-lg bg-green px-5 py-3 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaQuote")}
              </Link>
              <Link href="/products" className="rounded-lg border border-green/25 px-5 py-3 text-sm font-medium text-green transition-colors hover:bg-green/5">
                {t("ctaTrace")}
              </Link>
            </div>
            <ul className="mt-9 flex flex-col gap-2.5 border-t border-stone/15 pt-6">
              {(t.raw("pillars") as string[]).map((pillar, i) => (
                <li key={i} className="flex items-baseline gap-3 text-sm text-stone">
                  <span className="mono text-[11px] text-amber">{String(i + 1).padStart(2, "0")}</span>
                  {pillar}
                </li>
              ))}
            </ul>
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

        {/* TRUSTED BY — customer logo strip, right under the hero */}
        {CLIENTS.some((c) => c.logo) && (
          <section className="border-y border-stone/10 bg-oat/60">
            <ClientLogos clients={CLIENTS} label={t("clientsLabel")} />
          </section>
        )}

        {/* AUDIENCES — three rooms, one house */}
        <section className="bg-forest text-oat">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Reveal className="mb-12 max-w-xl">
              <p className="mono text-[11px] uppercase tracking-widest text-amber">{t("audiences.eyebrow")}</p>
              <h2 className="display mt-4 text-4xl leading-tight md:text-5xl">{t("audiences.heading")}</h2>
              <p className="mt-5 text-oat/75">{t("audiences.body")}</p>
            </Reveal>
            <div className="grid gap-5 md:grid-cols-3">
              {audienceRooms.map((r, i) => (
                <Reveal key={r.href} delay={i * 0.08}>
                  <Link
                    href={r.href}
                    className="group flex h-full flex-col rounded-xl border border-oat/15 bg-oat/[0.03] p-7 transition-colors hover:border-amber/50 hover:bg-oat/[0.06]"
                  >
                    <span className="mono text-[10px] uppercase tracking-widest text-amber">{r.tag}</span>
                    <h3 className="display mt-4 text-2xl text-oat">{r.who}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-oat/70">{r.body}</p>
                    <span className="mono mt-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-oat/80 transition-colors group-hover:text-amber">
                      {r.cta}
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* CATALOGUE */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <Reveal className="mb-8">
            <Marker n="(01)" label={t("catMarker")} />
            <div className="flex items-end justify-between">
              <h2 className="display text-4xl text-green">{t("catHeading", { n: ORIGIN_LIST.length })}</h2>
              <Link href="/products" className="mono text-[11px] uppercase tracking-widest text-stone/60 transition-colors hover:text-green">
                {t("catViewAll")}
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {PRODUCTS.map((p, i) => {
              return (
                <Reveal key={p.slug} delay={i * 0.06}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-xl p-5 transition-transform duration-300 hover:-translate-y-1.5 sm:p-6"
                    style={{ backgroundColor: p.accent }}
                  >
                    {p.img && (
                      <Image
                        src={p.img}
                        alt={p.name}
                        fill
                        sizes="(min-width: 1024px) 22vw, 45vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      />
                    )}
                    {/* Flat brand colour by default; on hover (desktop) it fades to
                        reveal the powder. On touch devices — no hover — it stays off,
                        so the photo shows straight away. */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-500 ease-out [@media(hover:hover)]:opacity-100 group-hover:opacity-0"
                      style={{ backgroundColor: p.accent }}
                    />
                    {/* scrim so the name stays legible on light powders (e.g. lion's mane) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="relative display text-2xl leading-tight sm:text-3xl" style={{ color: p.tint }}>
                      {p.name}
                    </span>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* PEOPLE & PLANET */}
        <section className="bg-oat">
          <div className="mx-auto grid max-w-6xl items-stretch gap-12 px-6 py-16 md:grid-cols-[1fr_0.8fr] md:py-24">
            <Reveal>
              <Marker n="(02)" label={t("peopleMarker")} />
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
          {/* the farms we return to — show, not just tell */}
          <div className="mx-auto max-w-6xl px-6 pb-16 md:pb-24">
            <Reveal className="mb-6">
              <p className="mono text-[11px] uppercase tracking-widest text-amber">{t("peopleStripEyebrow")}</p>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-3">
              {peopleStrip.map((s, i) => (
                <Reveal key={s.src} delay={i * 0.08}>
                  <figure className="group">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-sand">
                      <Image
                        src={s.src}
                        alt={s.alt}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(min-width: 640px) 30vw, 100vw"
                      />
                    </div>
                    <figcaption className="mono mt-3 text-[11px] uppercase leading-relaxed tracking-wide text-stone/55">
                      {s.cap}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* HOW WE WORK — one journey, source to scale (spine + commercial terms) */}
        <section id="how" className="bg-sand scroll-mt-20">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Reveal className="mb-14 max-w-xl">
              <Marker n="(03)" label={tp("marker")} />
              <h2 className="display text-4xl leading-tight text-green md:text-5xl">{tp("heading")}</h2>
              <p className="mt-4 text-stone">{tp("intro")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="relative">
                {/* desktop connecting thread, source → scale */}
                <div className="pointer-events-none absolute inset-x-0 top-[5px] hidden h-px bg-gradient-to-r from-lime via-lime/50 to-lime/15 md:block" />
                <ol className="grid gap-y-9 md:grid-cols-5 md:gap-x-6">
                  {promiseItems.map((p, i) => (
                    <li
                      key={p.t}
                      className="relative border-l-2 border-lime/30 pl-5 md:border-l-0 md:pl-0"
                    >
                      <span className="mb-5 hidden h-2.5 w-2.5 rounded-full bg-lime md:block" />
                      <span className="mono text-[11px] text-lime">{String(i + 1).padStart(2, "0")}</span>
                      <h3 className="display mt-2 text-lg leading-snug text-green">{p.t}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-stone">{p.d}</p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
            {/* commercial terms — the concrete numbers buyers ask for */}
            <Reveal delay={0.1}>
              <div className="mono mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-stone/15 pt-6 text-[11px] uppercase tracking-wide text-stone/70">
                <span>{t("termMoq")}</span>
                <span>{t("termLead")}</span>
                <span>{t("termIncoterms")}</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* TRACE A BATCH */}
        <section id="trace" className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
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

        {/* WHERE WE OPERATE — the network, the scale, the people (merged) */}
        <section id="network" className="bg-sand scroll-mt-20">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Reveal className="mb-10 max-w-2xl">
              <p className="mono text-xs uppercase tracking-widest text-amber">{t("sourceEyebrow")}</p>
              <h2 className="display mt-4 text-4xl leading-tight text-green md:text-5xl">{t("sourceHeading")}</h2>
              <p className="mono mt-4 text-sm tracking-wide text-stone/70">{t("hkCoords")}</p>
              <p className="mt-4 text-stone">{t("hkBody1")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <LocationsMap />
            </Reveal>
            {/* scale, in numbers */}
            <div className="mt-14 grid grid-cols-2 gap-8 border-t border-stone/15 pt-10 lg:grid-cols-4">
              {stats.map((s, i) => (
                <Reveal key={s.l} delay={i * 0.08}>
                  <p className={`display text-5xl md:text-6xl ${s.amber ? "text-amber" : "text-green"}`}>
                    <CountUp value={s.value} suffix={s.suffix} />
                  </p>
                  <p className="mono mt-3 text-[11px] uppercase tracking-wide text-stone/60">{s.l}</p>
                </Reveal>
              ))}
            </div>
            {/* the people behind it */}
            <Reveal delay={0.1} className="mt-14 border-t border-stone/15 pt-10">
              <p className="max-w-xl leading-relaxed text-stone">{t("hkBody2")}</p>
              <div className="mt-7">
                <ExpertsCluster members={TEAM} tone="light" label={t("hkExpertsLabel")} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* SOCIAL PROOF */}
        <section className="bg-oat">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Reveal className="max-w-xl">
              <Marker n="(05)" label={t("socialMarker")} />
              <h2 className="display text-4xl leading-tight text-green">{t("socialHeading")}</h2>
              <p className="mt-4 text-stone">{t("socialBody")}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-12 columns-1 gap-5 sm:columns-2 lg:columns-3">
                {reviews.map((r, i) => (
                  <figure key={i} className="mb-5 break-inside-avoid rounded-2xl border border-stone/15 bg-white p-7">
                    <div className="text-sm tracking-[0.15em] text-amber" aria-label="Rated 5 out of 5">★★★★★</div>
                    <blockquote className="mt-4 whitespace-pre-line text-sm leading-relaxed text-green">{r.q}</blockquote>
                    <figcaption className="mt-5 border-t border-stone/10 pt-4">
                      <p className="font-medium text-green">{r.name}</p>
                      <p className="mono text-[11px] uppercase tracking-wide text-stone/55">{r.role}</p>
                    </figcaption>
                  </figure>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* CERTIFICATIONS */}
        <Certifications certs={CERTIFICATIONS} partners={PARTNERS} />

        {/* CTA */}
        <section className="bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-forest px-8 py-14 text-oat md:px-14 md:py-16">
                <div className="absolute inset-x-0 top-0 flex h-1.5">
                  <span className="flex-1 bg-amber" />
                  <span className="flex-1 bg-hojicha" />
                  <span className="flex-1 bg-hibiscus" />
                  <span className="flex-1 bg-ube" />
                </div>
                <div className="grid items-center gap-10 md:grid-cols-[1.35fr_0.65fr]">
                  <div>
                    <p className="mono text-[11px] uppercase tracking-widest text-amber">{t("ctaMarker")}</p>
                    <h2 className="display mt-4 text-4xl leading-[1.05] md:text-5xl">{t("ctaHeading")}</h2>
                    <p className="mt-5 max-w-lg leading-relaxed text-oat/75">{t("ctaBody")}</p>
                  </div>
                  <div className="flex flex-col gap-4 md:items-end">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-lg bg-amber px-7 py-4 text-sm font-semibold text-forest transition-transform hover:-translate-y-0.5"
                    >
                      {t("ctaQuote")}
                      <span>→</span>
                    </Link>
                    <p className="mono max-w-[15rem] text-[11px] uppercase leading-relaxed tracking-wide text-oat/50 md:text-right">
                      {t("ctaNote")}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
