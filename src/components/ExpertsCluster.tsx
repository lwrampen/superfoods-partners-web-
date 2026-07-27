import Image from "next/image";
import Link from "next/link";
import type { TeamMember } from "@/data/trust";

// Small, subtle "real people behind it" cue: a link + a row of overlapping
// circular team avatars. Reuses the team portraits (face-cropped via CSS).
export function ExpertsCluster({
  members,
  href = "/about",
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
  return (
    <Link href={href} className="group inline-flex flex-col gap-3">
      <span className={`mono inline-flex items-center gap-1 text-[11px] uppercase tracking-wide ${text} underline-offset-4 group-hover:underline`}>
        {label} <span aria-hidden>→</span>
      </span>
      <span className="flex -space-x-2.5">
        {withPhoto.map((m) => (
          <span key={m.name} title={m.name} className={`relative h-10 w-10 overflow-hidden rounded-full bg-sand ring-2 ${ring}`}>
            <Image src={m.photo!} alt={m.name} fill sizes="40px" className="object-cover" style={{ objectPosition: "50% 16%" }} />
          </span>
        ))}
      </span>
    </Link>
  );
}
