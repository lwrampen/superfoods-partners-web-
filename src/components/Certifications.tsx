import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Cert } from "@/data/trust";

function LogoRow({ items, compact = false }: { items: Cert[]; compact?: boolean }) {
  const h = compact ? "h-16" : "h-24";
  const logoMax = compact ? "max-h-9" : "max-h-14";
  const minW = compact ? "min-w-[160px]" : "min-w-[132px]";
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
      {items.map((c) => (
        <div
          key={c.name}
          title={c.name}
          className={`flex ${h} ${minW} items-center justify-center rounded-xl border border-stone/12 bg-white px-6 shadow-[0_1px_2px_rgba(20,39,27,0.05)]`}
        >
          <Image src={c.logo!} alt={c.name} width={220} height={90} className={`${logoMax} w-auto object-contain`} />
        </div>
      ))}
    </div>
  );
}

// Certification marks + (optionally) the independent labs we work with, in one
// calm strip. Only marks we actually have a logo for are shown — the logos
// carry the recognition, so no explanatory text is needed.
export function Certifications({
  certs,
  title,
  partners,
  partnersTitle,
}: {
  certs: Cert[];
  title?: string;
  partners?: Cert[];
  partnersTitle?: string;
}) {
  const t = useTranslations("certifications");
  const shownCerts = certs.filter((c) => c.logo);
  const shownPartners = (partners ?? []).filter((c) => c.logo);
  if (!shownCerts.length) return null;
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mono text-center text-[11px] uppercase tracking-widest text-stone/50">{title ?? t("title")}</p>
        <LogoRow items={shownCerts} />
        {shownPartners.length ? (
          <>
            <p className="mono mt-14 text-center text-[11px] uppercase tracking-widest text-stone/45">
              {partnersTitle ?? t("partnersTitle")}
            </p>
            <LogoRow items={shownPartners} compact />
          </>
        ) : null}
      </div>
    </section>
  );
}
