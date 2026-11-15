import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor, localizedUrl, SITE } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { getProduct } from "@/data/catalog";
import { localizeProduct } from "@/data/content.i18n";
import { getPost, pick } from "@/data/insights";

// Hong Kong buyers: ube powder stocked in Tsuen Wan, wider range via SFP,
// Pure Matcha Partners for matcha. Facts come from the owner's brief only.
const PATH = "/hong-kong";
const PMP_BASE = "https://www.purematchapartners.com";
const pmpHk = (locale: string) =>
  `${PMP_BASE}${locale === "es" || locale === "de" ? "/" + locale : ""}/matcha-supplier-hong-kong`;
const ADDRESS = { street: "491 Castle Peak Road", locality: "Tsuen Wan", country: "Hong Kong" };
const GUIDE_SLUGS = [
  "ube-milk-tea-boba-ube-powder-for-bubble-tea-shops",
  "ube-vs-taro-vs-purple-sweet-potato",
  "what-is-ube-powder",
];
const TEAM = [
  { name: "Max Duijsens", email: "max@purematchapartners.com", phone: "+31 6 25111913", photo: "/team/max.webp" },
  { name: "Emily Chun", email: "emily@purematchapartners.com", phone: undefined, photo: "/team/emily.webp" },
];
const WHO_KEYS = [0, 1, 2, 3] as const;
const FAQ_KEYS = [0, 1, 2, 3] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "hongKong" });
  return {
    title: { absolute: t("metaTitle") },
    description: t("metaDescription"),
    alternates: alternatesFor(locale, PATH),
  };
}

export default async function HongKongPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hongKong");

  const base = getProduct("ube")!;
  const ube = localizeProduct(base, locale);
  const guides = GUIDE_SLUGS.map((s) => getPost(s)).filter((p): p is NonNullable<typeof p> => !!p);
  const faqs = FAQ_KEYS.map((i) => ({ q: t(`faq.${i}.q`), a: t(`faq.${i}.a`) }));
  const url = localizedUrl(locale, PATH);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${SITE}${PATH}#localbusiness`,
      name: t("ldName"),
      url,
      description: t("metaDescription"),
      parentOrganization: { "@id": `${SITE}/#organization` },
      address: {
        "@type": "PostalAddress",
        streetAddress: ADDRESS.street,
        addressLocality: ADDRESS.locality,
        addressCountry: "HK",
      },
      areaServed: { "@type": "Country", name: ADDRESS.country },
      contactPoint: TEAM.map((m) => ({
        "@type": "ContactPoint",
        contactType: "sales",
        name: m.name,
        email: m.email,
        ...(m.phone ? { telephone: m.phone } : {}),
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: localizedUrl(locale, "/") },
        { "@type": "ListItem", position: 2, name: t("breadcrumbName"), item: url },
      ],
    },
  ];

  const card = "rounded-2xl border border-stone/15 bg-white p-6";
  const pill = "inline-block rounded-lg border border-stone/20 bg-oat px-3 py-1.5 text-sm text-stone transition-colors hover:border-green hover:text-green";

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        {/* HERO */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-16 md:grid-cols-[1.1fr_0.9fr] md:pt-24 md:pb-20">
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">{t("eyebrow")}</span>
              <span className="h-px w-8 bg-stone/30" />
            </div>
            <h1 className="display mt-5 text-5xl leading-[1.04] text-green md:text-6xl">{t("heading")}</h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone">{t("lead")}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/contact?product=ube" className="rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
                {t("ctaPrimary")}
              </Link>
              <Link href="/products/ube" className="rounded-lg border border-stone/25 px-6 py-3.5 text-sm font-medium text-green transition-colors hover:border-green">
                {t("ctaSecondary")} →
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl" style={{ backgroundColor: base.accent }}>
              {base.img && (
                <Image src={base.img} alt={ube.gallery?.[0]?.alt ?? "Ube purple yam powder"} fill sizes="(min-width: 768px) 40vw, 100vw" className="object-cover" priority />
              )}
              <p className="mono absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent px-5 pt-10 pb-4 text-[10px] uppercase tracking-widest text-white/85">
                {t("imgCaption")}
              </p>
            </div>
          </Reveal>
        </section>

        {/* IN STOCK */}
        <section className="border-y border-stone/15 bg-sand">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <Reveal>
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("stockEyebrow")}</span>
              <h2 className="display mt-4 text-4xl leading-tight text-green">{t("stockHeading")}</h2>
              <address className="mt-4 not-italic text-stone">
                <span className="mono text-[10px] uppercase tracking-widest text-stone/50">{t("addressLabel")}</span>
                <br />
                {ADDRESS.street}, {ADDRESS.locality}, {ADDRESS.country}
              </address>
            </Reveal>
            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <Reveal>
                <div className={card}>
                  <p className="mono text-[10px] uppercase tracking-widest" style={{ color: base.accent }}>{t("ubeBrand")}</p>
                  <h3 className="display mt-3 text-2xl text-green">{t("ubeTitle")}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{t("ubeBody")}</p>
                  <Link href="/products/ube" className="mt-5 inline-block text-sm font-medium text-green underline-offset-4 hover:underline">
                    {t("ubeLink")} →
                  </Link>
                </div>
              </Reveal>
              <Reveal delay={0.06}>
                <div className={card}>
                  <p className="mono text-[10px] uppercase tracking-widest text-stone/60">{t("pmpBrand")}</p>
                  <h3 className="display mt-3 text-2xl text-green">{t("pmpTitle")}</h3>
                  <p className="mt-3 leading-relaxed text-stone">{t("pmpBody")}</p>
                  <a href={pmpHk(locale)} target="_blank" rel="noopener" className="mt-5 inline-block text-sm font-medium text-green underline-offset-4 hover:underline">
                    {t("pmpLink")} ↗
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* WHO WE SUPPLY */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("whoEyebrow")}</span>
            <h2 className="display mt-4 max-w-2xl text-4xl leading-tight text-green">{t("whoHeading")}</h2>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {WHO_KEYS.map((i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="h-full border-t border-stone/20 pt-5">
                  <h3 className="text-lg font-medium text-green">{t(`who.${i}.t`)}</h3>
                  <p className="mt-2 leading-relaxed text-stone">{t(`who.${i}.d`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* RANGE + QUALITY */}
        <section className="bg-sand">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2 md:py-20">
            <Reveal>
              <h2 className="display text-3xl leading-tight text-green">{t("rangeHeading")}</h2>
              <p className="mt-4 text-lg leading-relaxed text-stone">{t("rangeBody")}</p>
              <Link href="/products" className="mt-6 inline-block text-sm font-medium text-green underline-offset-4 hover:underline">
                {t("rangeLink")} →
              </Link>
            </Reveal>
            <Reveal delay={0.06}>
              <h2 className="display text-3xl leading-tight text-green">{t("qualityHeading")}</h2>
              <p className="mt-4 text-lg leading-relaxed text-stone">{t("qualityBody")}</p>
              <Link href="/verification" className="mt-6 inline-block text-sm font-medium text-green underline-offset-4 hover:underline">
                {t("qualityLink")} →
              </Link>
            </Reveal>
          </div>
        </section>

        {/* SALES CONTACT */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("teamEyebrow")}</span>
            <h2 className="display mt-4 text-4xl leading-tight text-green">{t("teamHeading")}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-stone">{t("teamLead")}</p>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {TEAM.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05}>
                <div className={`${card} flex items-center gap-5`}>
                  <Image src={m.photo} alt={m.name} width={80} height={80} className="h-20 w-20 shrink-0 rounded-full object-cover" />
                  <div className="min-w-0 text-sm">
                    <p className="text-lg font-medium text-green">{m.name}</p>
                    <p className="mono text-[10px] uppercase tracking-widest text-stone/50">{t("roleSales")}</p>
                    <p className="mt-2 break-words text-stone">
                      {t("emailLabel")}: <a href={`mailto:${m.email}`} className="text-green underline-offset-4 hover:underline">{m.email}</a>
                    </p>
                    {m.phone && <p className="text-stone">{t("phoneLabel")}: {m.phone}</p>}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* GUIDES */}
        {guides.length > 0 && (
          <section className="border-t border-stone/15 bg-sand">
            <div className="mx-auto max-w-6xl px-6 py-12">
              <h2 className="mono text-[11px] uppercase tracking-wide text-stone/50">{t("guidesHeading")}</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {guides.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/insights/${g.slug}`} className={pill}>{pick(g.title, locale)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <h2 className="display text-4xl text-green">{t("faqHeading")}</h2>
          <div className="mt-8 divide-y divide-stone/15 border-y border-stone/15">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="cursor-pointer list-none text-lg font-medium text-green">{f.q}</summary>
                <p className="mt-3 leading-relaxed text-stone">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-20 text-center md:pb-24">
          <Reveal>
            <h2 className="display text-4xl text-green">{t("ctaHeading")}</h2>
            <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-stone">{t("ctaBody")}</p>
            <Link href="/contact?product=ube" className="mt-8 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
              {t("ctaPrimary")}
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
