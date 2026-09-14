import Image from "next/image";
import type { Client } from "@/data/trust";

// "Trusted by" customer logo bar. Renders only once at least one client with a
// permission-cleared logo is present in CLIENTS (see src/data/trust.ts).
export function ClientLogos({ clients, label }: { clients: Client[]; label: string }) {
  const withLogo = clients.filter((c) => c.logo);
  if (!withLogo.length) return null;
  return (
    <div>
      <p className="mono text-[11px] uppercase tracking-widest text-stone/45">{label}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-6">
        {withLogo.map((c) => (
          <Image
            key={c.name}
            src={c.logo!}
            alt={c.name}
            width={150}
            height={48}
            className="h-8 w-auto object-contain opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
          />
        ))}
      </div>
    </div>
  );
}
