import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { Reveal } from "@/components/Reveal";
import { OriginPhoto } from "@/components/OriginPhoto";
import { Certifications } from "@/components/Certifications";
import type { Cert } from "@/data/trust";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "verification" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/verification"),
  };
}

// Official cert marks (logos live in /public/certs). Kosher has no supplied
// logo, so it falls back to a text plate — handled by <Certifications>.
const CERTS: Cert[] = [
  { name: "JAS Organic", logo: "/certs/jas.png" },
  { name: "EU Organic", logo: "/certs/eu-organic.webp" },
  { name: "USDA Organic", logo: "/certs/usda-organic.png" },
  { name: "HACCP", logo: "/certs/haccp.webp" },
  { name: "FSSC 22000", logo: "/certs/fssc-22000.webp" },
  { name: "Kosher" },
];
const STEP_NUMS = ["01", "02", "03", "04"];

export default async function VerificationPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("verification");
  const steps = t.raw("steps") as { t: string; d: string }[];
  const panel = t.raw("panel") as string[];
  const faq = t.raw("faq") as { q: string; a: string }[];

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

        <section className="mx-auto max-w-6xl px-6 pt-16 pb-12 md:pt-24">
          <Reveal>
            <p className="mono text-xs uppercase tracking-widest text-amber">{t("eyebrow")}</p>
            <h1 className="display mt-5 max-w-2xl text-4xl leading-tight text-green md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone">
              {t("intro")}
            </p>
          </Reveal>
        </section>

        {/* Photo band — quality at source */}
        <section className="mx-auto max-w-6xl px-6 pb-6">
          <Reveal>
            <OriginPhoto
              src="/photos/grading.jpg"
              alt="Grading tea by hand at origin"
              caption={t("photoCaption")}
              className="aspect-[21/9] w-full"
              sizes="(min-width: 1152px) 1088px, 100vw"
            />
          </Reveal>
        </section>

        {/* Process */}
        <section className="bg-green text-oat">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <Reveal key={STEP_NUMS[i]} delay={i * 0.08}>
                <p className="mono text-xs text-amber">{STEP_NUMS[i]}</p>
                <h3 className="display mt-3 text-xl">{s.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-oat/70">{s.d}</p>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Test panel + record */}
        <section className="mx-auto grid max-w-6xl items-start gap-12 px-6 py-20 md:grid-cols-2">
          <Reveal>
            <h2 className="display text-3xl text-green">{t("testHeading")}</h2>
            <ul className="mt-6 space-y-3">
              {panel.map((p) => (
                <li key={p} className="flex items-start gap-3 text-stone">
                  <span className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-green text-[10px] text-oat">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-stone/15 bg-white p-6">
              <p className="mono text-[10px] uppercase tracking-wide text-stone/50">{t("recordEyebrow")}</p>
              <p className="mt-3 leading-relaxed text-stone">
                {t("recordBody")}
              </p>
              <p className="mono mt-5 flex items-center gap-2 text-[11px] uppercase text-stone/70">
                <span className="h-2.5 w-2.5 rounded-full bg-amber" /> {t("recordRoute")}
              </p>
            </div>
          </Reveal>
        </section>

        {/* Certs — official marks with logos (text-plate fallback per cert) */}
        <Certifications certs={CERTS} title={t("certsHeading")} />

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-6 py-20">
          <Reveal>
            <h2 className="display text-3xl text-green">{t("faqHeading")}</h2>
          </Reveal>
          <div className="mt-8 divide-y divide-stone/15">
            {faq.map((f, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <details className="group py-5">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-lg font-medium text-green">
                    {f.q}
                    <span className="mono text-amber transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-stone">{f.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.1}>
            <Link href="/contact" className="mt-10 inline-block rounded-lg bg-green px-6 py-3.5 text-sm font-medium text-oat transition-opacity hover:opacity-90">
              {t("ctaButton")}
            </Link>
          </Reveal>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
