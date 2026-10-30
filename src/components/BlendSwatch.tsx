import Image from "next/image";
import type { BlendPart } from "@/data/blends";

// Two powders meeting on a diagonal — the real ingredient photography where we
// have it, the brand colour where we don't. Stands in for blend photography
// until we shoot the actual blends.
export function BlendSwatch({
  parts,
  labels,
  caption,
  sizes = "(min-width: 768px) 40vw, 100vw",
  priority = false,
  className = "",
}: {
  parts: [BlendPart, BlendPart];
  labels: [string, string];
  caption?: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const [a, b] = parts;
  return (
    <div className={`relative overflow-hidden rounded-2xl ${className}`} style={{ backgroundColor: a.color }}>
      {[a, b].map((p, i) => (
        <div
          key={i}
          className="absolute inset-0"
          style={{
            backgroundColor: p.color,
            clipPath: i === 0 ? "polygon(0 0, 100% 0, 0 100%)" : "polygon(100% 0, 100% 100%, 0 100%)",
          }}
        >
          {p.img ? (
            <Image src={p.img} alt="" fill sizes={sizes} className="object-cover" priority={priority} />
          ) : (
            // no photography yet: a quiet grain so the flat colour reads as powder
            <div
              className="absolute inset-0 opacity-30"
              style={{ backgroundImage: `radial-gradient(${p.tint} 1px, transparent 1.4px)`, backgroundSize: "7px 7px" }}
            />
          )}
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
      <p className="mono absolute left-5 top-4 text-[10px] uppercase tracking-widest" style={{ color: a.tint }}>
        {labels[0]}
      </p>
      <p className="mono absolute bottom-4 right-5 text-[10px] uppercase tracking-widest" style={{ color: b.tint }}>
        + {labels[1]}
      </p>
      {caption && (
        <p className="mono absolute bottom-4 left-5 max-w-[55%] text-[10px] uppercase tracking-widest text-white/80">{caption}</p>
      )}
    </div>
  );
}
