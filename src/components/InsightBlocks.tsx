/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Reveal } from "@/components/Reveal";
import type { Block, ImageRef } from "@/lib/studio/types";
import { parseInline } from "@/lib/studio/inline";
import { embedUrl } from "@/lib/studio/config";

// Body of an Insights post written in Blog Studio (structured blocks — see src/lib/studio/types.ts).

export function Inline({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((r, i) => {
        let node: React.ReactNode = r.text;
        if (r.italic) node = <em>{node}</em>;
        if (r.bold) node = <strong className="font-semibold text-green">{node}</strong>;
        if (r.href)
          node = r.href.startsWith("/") ? (
            <Link href={r.href} className="text-green underline decoration-lime decoration-2 underline-offset-4 hover:decoration-green">
              {node}
            </Link>
          ) : (
            <a href={r.href} rel="noopener" className="text-green underline decoration-lime decoration-2 underline-offset-4 hover:decoration-green">
              {node}
            </a>
          );
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

function Picture({ img, sizes }: { img: ImageRef; sizes: string }) {
  return img.width && img.height ? (
    <Image src={img.src} alt={img.alt} width={img.width} height={img.height} sizes={sizes} className="h-auto w-full rounded-xl bg-sand object-cover" />
  ) : (
    <img src={img.src} alt={img.alt} loading="lazy" className="h-auto w-full rounded-xl bg-sand object-cover" />
  );
}

function Figure({ img, sizes = "(max-width: 768px) 100vw, 720px", single = false }: { img: ImageRef; sizes?: string; single?: boolean }) {
  // a portrait photo on its own stays narrower so it does not fill several screens
  const portrait = single && img.width && img.height && img.height > img.width;
  return (
    <figure className={portrait ? "mx-auto max-w-[440px]" : undefined}>
      <Picture img={img} sizes={sizes} />
      {img.caption ? <figcaption className="mono mt-2 text-[11px] uppercase tracking-wide text-stone/60">{img.caption}</figcaption> : null}
    </figure>
  );
}

export function InsightBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => {
        switch (b.type) {
          case "heading":
            return b.level === 2 ? (
              <Reveal key={i} className="mt-12">
                <h2 className="display text-2xl leading-tight text-green md:text-3xl">{b.text}</h2>
              </Reveal>
            ) : (
              <h3 key={i} className="mt-8 text-lg font-semibold leading-snug text-green">
                {b.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className="mt-4 leading-relaxed text-stone">
                <Inline text={b.text} />
              </p>
            );
          case "list": {
            const L = b.ordered ? "ol" : "ul";
            return (
              <L key={i} className={`mt-4 space-y-2 pl-5 leading-relaxed text-stone marker:text-lime ${b.ordered ? "list-decimal" : "list-disc"}`}>
                {b.items.map((it, j) => (
                  <li key={j}>
                    <Inline text={it} />
                  </li>
                ))}
              </L>
            );
          }
          case "quote":
            return (
              <blockquote key={i} className="mt-8 border-l-2 border-lime pl-5">
                <p className="text-xl leading-relaxed text-green">
                  <Inline text={b.text} />
                </p>
                {b.cite ? <footer className="mono mt-3 text-[11px] uppercase tracking-wide text-stone/60">— {b.cite}</footer> : null}
              </blockquote>
            );
          case "image":
            return (
              <div key={i} className="mt-8">
                <Figure img={b} single />
              </div>
            );
          case "gallery":
            return (
              <div key={i} className={`mt-10 grid gap-4 ${b.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
                {b.images.map((img, j) => (
                  <Figure key={j} img={img} sizes="(max-width: 640px) 100vw, 360px" />
                ))}
              </div>
            );
          case "video":
            return (
              <div key={i} className="mt-8 overflow-hidden rounded-xl bg-green">
                <iframe
                  src={embedUrl(b)}
                  title={b.title || "Video"}
                  className="aspect-video w-full"
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
