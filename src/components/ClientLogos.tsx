import Image from "next/image";
import type { Client } from "@/data/trust";

// "Trusted by" customer logo strip — a calm horizontal band (label + logos)
// sitting just under the hero. Renders only clients that have a logo file.
export function ClientLogos({ clients, label }: { clients: Client[]; label: string }) {
  const withLogo = clients.filter((c) => c.logo);
  if (!withLogo.length) return null;
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-7 md:flex-row md:gap-12">
      <p className="mono shrink-0 text-[11px] uppercase tracking-widest text-amber">{label}</p>
      <div className="flex flex-1 flex-wrap items-center justify-center gap-x-12 gap-y-6 md:justify-between">
        {withLogo.map((c) => (
          <Image
            key={c.name}
            src={c.logo!}
            alt={c.name}
            width={160}
            height={44}
            className="h-7 w-auto object-contain md:h-8"
          />
        ))}
      </div>
    </div>
  );
}
