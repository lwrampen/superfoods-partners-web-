"use client";
/* eslint-disable @next/next/no-img-element */
import type { Block, LocaleCopy, StudioPost } from "@/lib/studio/types";
import { Counter, Label } from "./ui";

// Edit one translation: every text field and every block, in the same structure as the English post.
export function LocaleEditor({ post, locale, copy, onChange }: { post: StudioPost; locale: string; copy: LocaleCopy; onChange: (c: LocaleCopy) => void }) {
  const set = <K extends keyof LocaleCopy>(k: K, v: LocaleCopy[K]) => onChange({ ...copy, [k]: v });
  const setBlock = (i: number, b: Block) => set("blocks", copy.blocks.map((x, j) => (j === i ? b : x)));
  const dir = locale === "zh-Hant" ? "ltr" : "ltr";
  return (
    <div className="space-y-5" lang={locale} dir={dir}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <Label>Title</Label>
          <input value={copy.title} onChange={(e) => set("title", e.target.value)} className="field mt-1.5 text-lg font-medium" />
        </label>
        <label className="block">
          <Label right={<Counter value={copy.metaTitle} max={60} />}>Meta title</Label>
          <input value={copy.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className="field mt-1.5 text-sm" />
        </label>
        <label className="block">
          <Label right={<Counter value={copy.metaDescription} max={155} />}>Meta description</Label>
          <textarea value={copy.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} rows={2} className="field mt-1.5 text-sm" />
        </label>
        <label className="block md:col-span-2">
          <Label>Summary</Label>
          <textarea value={copy.summary} onChange={(e) => set("summary", e.target.value)} rows={2} className="field mt-1.5 text-sm" />
        </label>
        <label className="block md:col-span-2">
          <Label>Opening paragraph</Label>
          <textarea value={copy.lede} onChange={(e) => set("lede", e.target.value)} rows={4} className="field mt-1.5" />
        </label>
        <label className="block md:col-span-2">
          <Label>Header image alt text</Label>
          <input value={copy.headerAlt ?? ""} onChange={(e) => set("headerAlt", e.target.value)} className="field mt-1.5 text-sm" />
        </label>
      </div>

      <div>
        <Label hint="Same blocks as the English article. Keep [link text](/path) and **bold** markers.">Article</Label>
        <div className="mt-2 space-y-2">
          {copy.blocks.map((b, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[64px_minmax(0,1fr)]">
              <span className="mono pt-2.5 text-[10px] uppercase text-stone/70">{b.type === "heading" ? `H${b.level}` : b.type === "paragraph" ? "Text" : b.type}</span>
              {b.type === "heading" ? (
                <input value={b.text} onChange={(e) => setBlock(i, { ...b, text: e.target.value })} className="field font-semibold" />
              ) : b.type === "paragraph" || b.type === "quote" ? (
                <textarea value={b.text} onChange={(e) => setBlock(i, { ...b, text: e.target.value })} rows={Math.min(8, Math.max(2, Math.ceil(b.text.length / 90)))} className="field text-[15px]" />
              ) : b.type === "list" ? (
                <textarea
                  value={b.items.join("\n")}
                  onChange={(e) => setBlock(i, { ...b, items: e.target.value.split("\n") })}
                  onBlur={() => setBlock(i, { ...b, items: b.items.filter((x) => x.trim()) })}
                  rows={Math.max(2, b.items.length + 1)}
                  className="field text-[15px]"
                  aria-label="List items, one per line"
                />
              ) : b.type === "image" ? (
                <div className="flex items-start gap-3">
                  <img src={b.src} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                  <div className="grid flex-1 gap-2">
                    <input value={b.alt} onChange={(e) => setBlock(i, { ...b, alt: e.target.value })} placeholder="Alt text" className="field text-sm" />
                    <input value={b.caption ?? ""} onChange={(e) => setBlock(i, { ...b, caption: e.target.value || undefined })} placeholder="Caption" className="field text-sm" />
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {post.gallery.length ? (
        <div>
          <Label>Extra photos</Label>
          <div className="mt-2 space-y-2">
            {post.gallery.map((g, i) => {
              const t = copy.gallery?.[i] ?? { alt: "", caption: "" };
              const setG = (patch: Partial<{ alt: string; caption: string }>) => {
                const list = post.gallery.map((_, j) => copy.gallery?.[j] ?? { alt: "" });
                list[i] = { ...t, ...patch };
                set("gallery", list);
              };
              return (
                <div key={g.src} className="flex items-start gap-3">
                  <img src={g.src} alt="" className="h-16 w-24 shrink-0 rounded-lg object-cover" />
                  <div className="grid flex-1 gap-2 sm:grid-cols-2">
                    <input value={t.alt} onChange={(e) => setG({ alt: e.target.value })} placeholder="Alt text" className="field text-sm" />
                    <input value={t.caption ?? ""} onChange={(e) => setG({ caption: e.target.value })} placeholder="Caption" className="field text-sm" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      <div>
        <Label>FAQs</Label>
        <div className="mt-2 space-y-2">
          {copy.faqs.map((f, i) => (
            <div key={i} className="grid gap-2 md:grid-cols-[1fr_1.4fr]">
              <input value={f.q} onChange={(e) => set("faqs", copy.faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)))} className="field text-sm font-medium" />
              <textarea value={f.a} onChange={(e) => set("faqs", copy.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)))} rows={2} className="field text-sm" />
            </div>
          ))}
          {!copy.faqs.length ? <p className="text-sm text-stone/60">No FAQs.</p> : null}
        </div>
      </div>
    </div>
  );
}
