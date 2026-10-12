import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "@/data/trust";

// "Real people behind it" cue: a link + an auto-scrolling strip of circular
// team avatars. About six show at once; the strip scrolls on its own so the
// whole team cycles through without crowding the row. Pure CSS marquee —
// pauses on hover and freezes under prefers-reduced-motion.
export function ExpertsCluster({
  members,
  href = "/company",
  label = "Meet the team",
  tone = "light",
}: {
  members: TeamMember[];
  href?: string;
  label?: string;
  tone?: "light" | "dark";
}) {
  const withPhoto = members.filter((m) => m.photo);
  if (!withPhoto.length) return null;
  const ring = tone === "dark" ? "ring-forest" : "ring-oat";
  const text = tone === "dark" ? "text-amber" : "text-green";
  // Duplicate the set so translateX(-50%) loops seamlessly.
  const loop = [...withPhoto, ...withPhoto];
  const fade = "linear-gradient(90deg, transparent, #000 7%, #000 93%, transparent)";

  return (
    <div className="flex flex-col gap-3">
      <Link
        href={href}
        className={`group mono inline-flex w-fit items-center gap-1 text-[11px] uppercase tracking-wide ${text} underline-offset-4 hover:underline`}
      >
        {label} <span aria-hidden>→</span>
      </Link>
      <div
        className="marquee relative w-full max-w-[320px] overflow-hidden"
        style={{ maskImage: fade, WebkitMaskImage: fade }}
      >
        <div className="marquee-track flex w-max gap-2 py-1">
          {loop.map((m, i) => {
            const dup = i >= withPhoto.length;
            return (
              <span
                key={`${m.name}-${i}`}
                title={dup ? undefined : m.name}
                aria-hidden={dup || undefined}
                className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sand ring-2 ${ring}`}
              >
                <Image
                  src={m.photo!}
                  alt={dup ? "" : m.name}
                  fill
                  sizes="40px"
                  className="object-cover"
                  style={{ objectPosition: "50% 16%" }}
                />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
