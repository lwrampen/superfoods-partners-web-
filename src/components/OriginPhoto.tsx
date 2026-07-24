import Image from "next/image";

/**
 * OriginPhoto — the v2 photography primitive.
 * Real origin photography with a bottom gradient scrim and a mono caption
 * (place · coordinate · product). Optional top-left `stamp` for a documentary
 * "at source" tag (e.g. DIRECT FROM ORIGIN).
 */
export function OriginPhoto({
  src,
  alt,
  caption,
  stamp,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
  rounded = "rounded-xl",
}: {
  src: string;
  alt: string;
  caption?: string;
  stamp?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  rounded?: string;
}) {
  return (
    <figure className={`relative overflow-hidden ${rounded} ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {stamp && (
        <span className="mono absolute left-3 top-3 rounded-full bg-oat/90 px-3 py-1.5 text-[10px] uppercase tracking-widest text-green backdrop-blur-sm">
          {stamp}
        </span>
      )}
      {caption && (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(20,39,27,0) 55%, rgba(20,39,27,0.62) 100%)",
            }}
          />
          <figcaption className="mono absolute bottom-3 left-3 right-3 text-[11px] uppercase leading-snug tracking-wide text-oat">
            {caption}
          </figcaption>
        </>
      )}
    </figure>
  );
}
