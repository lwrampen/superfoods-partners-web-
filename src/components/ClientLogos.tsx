import Image from "next/image";
import type { Client } from "@/data/trust";

// "Trusted by" customer logo bar. Renders only the clients that have a logo
// file. Logos shown at a uniform height in their natural colour — the marks
// carry the recognition.
export function ClientLogos({ clients, label }: { clients: Client[]; label: string }) {
  const withLogo = clients.filter((c) => c.logo);
  if (!withLogo.length) return null;
  return (
    <div>
      <p className="mono text-[11px] uppercase tracking-widest text-stone/45">{label}</p>
      <div className="mt-7 flex flex-wrap items-center gap-x-12 gap-y-8">
        {withLogo.map((c) => (
          <Image
            key={c.name}
            src={c.logo!}
            alt={c.name}
            width={180}
            height={56}
            className="h-8 w-auto object-contain md:h-9"
          />
        ))}
      </div>
    </div>
  );
}
