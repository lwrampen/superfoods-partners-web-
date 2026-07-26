import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import type { TeamMember } from "@/data/trust";

function Silhouette() {
  return (
    <span className="flex h-full w-full items-center justify-center text-stone/25">
      <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-5 0-9 2.7-9 6.2V22h18v-1.8c0-3.5-4-6.2-9-6.2Z" />
      </svg>
    </span>
  );
}

export function TeamSection({ members }: { members: TeamMember[] }) {
  if (!members.length) return null;
  return (
    <section className="bg-oat">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal className="mb-14 max-w-xl">
          <div className="mb-4 flex items-center gap-3">
            <span className="mono text-[11px] text-amber">The team</span>
            <span className="h-px w-8 bg-stone/30" />
            <span className="mono text-[11px] uppercase tracking-widest text-stone/60">People behind it</span>
          </div>
          <h2 className="display text-4xl leading-tight text-green md:text-5xl">Faces you can call.</h2>
          <p className="mt-5 text-stone/75">
            The people who source, test and move your volume — one partner, in your timezone, who
            actually picks up.
          </p>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {members.map((m, i) => (
            <Reveal key={`${m.name}-${i}`} delay={(i % 4) * 0.05}>
              <figure>
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-sand">
                  {m.photo ? (
                    <Image src={m.photo} alt={m.name} fill className="object-cover" sizes="(min-width: 1024px) 22vw, 45vw" />
                  ) : (
                    <Silhouette />
                  )}
                </div>
                <figcaption className="mt-3">
                  <p className="display text-lg leading-tight text-green">{m.name}</p>
                  <p className="mono mt-1 text-[11px] uppercase tracking-wide text-stone/55">{m.role}</p>
                  {m.location && (
                    <p className="mono mt-0.5 text-[10px] uppercase tracking-wide text-stone/40">{m.location}</p>
                  )}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
