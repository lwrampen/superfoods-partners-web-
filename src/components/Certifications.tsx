import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Cert, CertGroup } from "@/data/trust";

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
          {c.logo ? (
            <Image src={c.logo} alt={c.name} width={220} height={90} className={`${logoMax} w-auto object-contain`} />
          ) : (
            <span className="mono text-[11px] uppercase tracking-wide text-stone/70">{c.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}

// Certification marks + (optionally) the independent labs we work with,
// in one calm strip.
export function Certifications({
  certs,
  title,
  partners,
  partnersTitle,
  groups,
}: {
  certs?: Cert[];
  title?: string;
  partners?: Cert[];
  partnersTitle?: string;
  groups?: CertGroup[];
}) {
  const t = useTranslations("certifications");

  // Featured, grouped credentials block — grouped by what each mark proves,
  // with a one-line note per group. Used on Company + Verification.
  if (groups?.length) {
    return (
      <section className="bg-sand">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <p className="mono text-center text-[11px] uppercase tracking-widest text-stone/50">{title ?? t("title")}</p>
          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
            {groups.map((g) => (
              <div key={g.key} className="flex flex-col items-center text-center">
                <p className="mono text-[10px] uppercase tracking-widest text-amber">{t(`${g.key}Label`)}</p>
                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                  {g.items.map((c) => (
                    <div
                      key={c.name}
                      title={c.name}
                      className="flex h-20 min-w-[100px] items-center justify-center rounded-xl border border-stone/12 bg-white px-4 shadow-[0_1px_2px_rgba(20,39,27,0.05)]"
                    >
                      {c.logo ? (
                        <Image src={c.logo} alt={c.name} width={180} height={72} className="max-h-11 w-auto object-contain" />
                      ) : (
                        <span className="mono text-[10px] uppercase tracking-wide text-stone/70">{c.name}</span>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-5 max-w-[280px] text-sm leading-relaxed text-stone/70">{t(`${g.key}Note`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!certs?.length) return null;
  const titleText = title ?? t("title");
  const partnersTitleText = partnersTitle ?? t("partnersTitle");
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="mono text-center text-[11px] uppercase tracking-widest text-stone/50">{titleText}</p>
        <LogoRow items={certs} />
        {partners?.length ? (
          <>
            <p className="mono mt-14 text-center text-[11px] uppercase tracking-widest text-stone/45">{partnersTitleText}</p>
            <LogoRow items={partners} compact />
          </>
        ) : null}
      </div>
    </section>
  );
}
