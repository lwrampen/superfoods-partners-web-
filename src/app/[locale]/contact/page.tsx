import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { alternatesFor } from "@/i18n/paths";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { RfqForm } from "@/components/RfqForm";
import { OriginPhoto } from "@/components/OriginPhoto";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: alternatesFor(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tr = await getTranslations("rfq");

  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl gap-12 px-6 pt-16 pb-24 md:grid-cols-[0.9fr_1.1fr] md:pt-24">
          <div>
            <div className="flex items-center gap-3">
              <span className="mono text-[11px] text-amber">{t("eyebrow")}</span>
              <span className="h-px w-8 bg-stone/30" />
              <span className="mono text-[11px] uppercase tracking-widest text-stone/60">{t("eyebrowSub")}</span>
            </div>
            <h1 className="display mt-5 text-4xl leading-tight text-green md:text-5xl">
              {t("heading")}
            </h1>
            <p className="mt-5 max-w-md text-lg text-stone">
              {t("intro")}
            </p>
            <div className="mono mt-8 space-y-2 border-t border-stone/15 pt-6 text-[11px] uppercase tracking-wide text-stone/60">
              <p>{t("specMoq")}</p>
              <p>{t("specLead")}</p>
              <p>{t("specIncoterms")}</p>
              <p>{t("specReply")}</p>
            </div>
            <OriginPhoto
              src="/photos/grower-picker.jpg"
              alt="Growers in the shade-grown gardens"
              caption={t("photoCaption")}
              className="mt-8 hidden aspect-[5/4] w-full md:block"
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </div>
          <Suspense fallback={<div className="rounded-xl border border-stone/15 bg-sand p-8 text-stone">{tr("loading")}</div>}>
            <RfqForm />
          </Suspense>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
