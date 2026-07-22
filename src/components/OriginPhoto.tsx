import Image from "next/image";

/**
 * OriginPhoto — the v2 photography primitive.
 * Real origin photography with a bottom gradient scrim and a mono caption
 * (place · coordinate · product), exactly as the brandbook prescribes.
 */
export function OriginPhoto({
  src,
  alt,
  caption,
  className = "",
  sizes = "(min-width: 768px) 50vw, 100vw",
  priority = false,
  rounded = "rounded-xl",
}: {
  src: string;
  alt: string;
  caption?: string;
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
