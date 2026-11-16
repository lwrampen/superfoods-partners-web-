"use client";
/* eslint-disable @next/next/no-img-element */
import type { Block } from "@/lib/studio/types";
import { parseInline } from "@/lib/studio/inline";

export function InlinePreview({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((r, i) => {
        let n: React.ReactNode = r.text;
        if (r.italic) n = <em>{n}</em>;
        if (r.bold) n = <strong className="font-semibold text-forest">{n}</strong>;
        if (r.href)
          n = (
            <span className="text-forest underline decoration-lime decoration-2 underline-offset-2" title={r.href}>
              {n}
            </span>
          );
        return <span key={i}>{n}</span>;
      })}
    </>
  );
}

/** compact read-only rendering of body blocks (SEO review: original vs suggestion) */
export function BlocksPreview({ blocks }: { blocks: Block[] }) {
  if (!blocks.length) return <p className="text-sm text-stone/60">(empty)</p>;
  return (
    <div className="space-y-2.5 text-[14px] leading-relaxed text-[#2c3424]">
      {blocks.map((b, i) => {
        if (b.type === "heading")
          return b.level === 2 ? (
            <p key={i} className="display pt-2 text-[19px] leading-tight text-forest">
              {b.text}
            </p>
          ) : (
            <p key={i} className="pt-1 font-semibold text-forest">
              {b.text}
            </p>
          );
        if (b.type === "paragraph")
          return (
            <p key={i}>
              <InlinePreview text={b.text} />
            </p>
          );
        if (b.type === "list")
          return (
            <ul key={i} className={`${b.ordered ? "list-decimal" : "list-disc"} space-y-1 pl-5 marker:text-lime`}>
              {b.items.map((it, j) => (
                <li key={j}>
                  <InlinePreview text={it} />
                </li>
              ))}
            </ul>
          );
        if (b.type === "quote")
          return (
            <blockquote key={i} className="border-l-2 border-lime pl-3 text-forest">
              <InlinePreview text={b.text} />
            </blockquote>
          );
        if (b.type === "image")
          return (
            <figure key={i} className="flex items-center gap-3 rounded-lg bg-[#fafaf7] p-2">
              <img src={b.src} alt="" className="h-12 w-16 rounded object-cover" />
              <figcaption className="text-xs text-stone">
                <b className="font-medium text-forest">Alt:</b> {b.alt || "—"}
                {b.caption ? (
                  <>
                    <br />
                    <b className="font-medium text-forest">Caption:</b> {b.caption}
                  </>
                ) : null}
              </figcaption>
            </figure>
          );
        return null;
      })}
    </div>
  );
}
