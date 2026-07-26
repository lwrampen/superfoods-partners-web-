import Image from "next/image";
import type { Cert } from "@/data/trust";

// A restrained logo strip. Renders official logos when present, and a clean
// text plate as a fallback so it never looks broken before the files arrive.
export function Certifications({
  certs,
  title = "Certified & independently tested",
  theme = "light",
}: {
  certs: Cert[];
  title?: string;
  theme?: "light" | "dark";
}) {
  if (!certs.length) return null;
  const dark = theme === "dark";
  return (
    <section className={dark ? "bg-green text-oat" : "bg-sand"}>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className={`mono text-center text-[11px] uppercase tracking-widest ${dark ? "text-oat/60" : "text-stone/50"}`}>
          {title}
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {certs.map((c) => (
            <div
              key={c.name}
              className={`flex h-16 min-w-[116px] items-center justify-center rounded-xl border px-5 ${
                dark ? "border-oat/15 bg-oat/5" : "border-stone/12 bg-oat/70"
              }`}
            >
              {c.logo ? (
                <Image src={c.logo} alt={c.name} width={132} height={44} className="max-h-10 w-auto object-contain" />
              ) : (
                <span className={`mono text-[11px] uppercase tracking-wide ${dark ? "text-oat/80" : "text-stone/70"}`}>
                  {c.name}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
