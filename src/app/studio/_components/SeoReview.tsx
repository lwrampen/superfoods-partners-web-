"use client";
import { useState } from "react";
import type { Faq, LocaleCopy, StudioPost } from "@/lib/studio/types";
import { BlocksPreview } from "./BlocksPreview";
import { Counter } from "./ui";

export type Accepted = {
  slug?: string;
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  summary?: string;
  lede?: string;
  headerAlt?: string;
  body?: boolean;
  faqs?: Faq[];
};

type TextKey = "slug" | "title" | "metaTitle" | "metaDescription" | "summary" | "lede" | "headerAlt";
const FIELDS: { key: TextKey; label: string; max?: number; long?: boolean }[] = [
  { key: "title", label: "Title (H1)" },
  { key: "slug", label: "URL slug" },
  { key: "metaTitle", label: "Meta title", max: 60 },
  { key: "metaDescription", label: "Meta description", max: 155, long: true },
  { key: "summary", label: "Summary (overview cards)", long: true },
  { key: "lede", label: "Opening paragraph (answers the search question)", long: true },
  { key: "headerAlt", label: "Header image alt text" },
];

export function SeoReview({ post, onApply, onDismiss }: { post: StudioPost; onApply: (a: Accepted) => void; onDismiss: () => void }) {
  const sug = post.suggestion!;
  const en = post.locales.en;
  const original: Record<TextKey, string> = {
    slug: post.slug,
    title: en.title,
    metaTitle: en.metaTitle,
    metaDescription: en.metaDescription,
    summary: en.summary,
    lede: en.lede,
    headerAlt: en.headerAlt ?? post.header?.alt ?? "",
  };
  const suggested: Record<TextKey, string> = {
    slug: sug.slug,
    title: sug.copy.title,
    metaTitle: sug.copy.metaTitle,
    metaDescription: sug.copy.metaDescription,
    summary: sug.copy.summary,
    lede: sug.copy.lede,
    headerAlt: sug.copy.headerAlt ?? "",
  };
  const locked = !!post.publishedAt; // a published URL never changes
  const [values, setValues] = useState(suggested);
  const [use, setUse] = useState<Record<string, boolean>>(() => ({
    ...Object.fromEntries(FIELDS.map((f) => [f.key, suggested[f.key] !== original[f.key] && !(f.key === "slug" && locked)])),
    body: true,
    faqs: true,
  }));
  const [faqs, setFaqs] = useState<Faq[]>(sug.copy.faqs);

  const apply = () => {
    const a: Accepted = {};
    for (const f of FIELDS) if (use[f.key]) a[f.key] = values[f.key];
    if (use.body) a.body = true;
    if (use.faqs) a.faqs = faqs.filter((f) => f.q.trim() && f.a.trim());
    onApply(a);
  };
  const toggle = (k: string) => setUse((u) => ({ ...u, [k]: !u[k] }));

  return (
    <section className="card mt-8 overflow-hidden" aria-label="SEO suggestion">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#e3e3da] bg-forest px-5 py-4 text-offwhite">
        <div>
          <p className="mono text-[10px] uppercase tracking-[0.18em] text-lime">SEO suggestion · review</p>
          <p className="mt-1 text-sm text-offwhite/80">Left: your text. Right: the suggestion — edit it if you like. Tick what you want to use, then apply.</p>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="btn !border-offwhite/30 !bg-transparent !text-offwhite btn-ghost" onClick={onDismiss}>
            Dismiss
          </button>
          <button className="btn btn-lime" onClick={apply}>
            Apply selected
          </button>
        </div>
      </div>

      {post.seo?.notes?.length ? (
        <ul className="space-y-1 border-b border-[#e3e3da] bg-[#fafaf7] px-5 py-3 text-xs text-stone">
          {post.seo.notes.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      ) : null}

      <div className="divide-y divide-[#efefe8]">
        {FIELDS.map((f) => {
          const same = original[f.key] === suggested[f.key];
          const disabled = f.key === "slug" && locked;
          return (
            <div key={f.key} className="grid gap-3 px-5 py-4 md:grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)]">
              <label className="flex items-start gap-2 pt-1">
                <input type="checkbox" checked={!!use[f.key]} onChange={() => toggle(f.key)} disabled={disabled} className="mt-0.5 h-4 w-4 accent-[#16240f]" />
                <span className="eyebrow !text-[10px] leading-snug">{f.label}</span>
              </label>
              <div className="text-sm text-stone">
                <span className="mono mb-1 block text-[10px] uppercase text-stone/60">Yours</span>
                {original[f.key] || <span className="text-stone/50">(empty)</span>}
                {f.max ? (
                  <span className="ml-2">
                    <Counter value={original[f.key]} max={f.max} />
                  </span>
                ) : null}
              </div>
              <div>
                <span className="mono mb-1 flex justify-between text-[10px] uppercase text-stone/60">
                  <span>{disabled ? "Published — URL stays" : same ? "Suggestion (unchanged)" : "Suggestion"}</span>
                  {f.max ? <Counter value={values[f.key]} max={f.max} /> : null}
                </span>
                {f.long ? (
                  <textarea
                    value={values[f.key]}
                    onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
                    rows={f.key === "lede" ? 5 : 3}
                    className="field text-sm"
                    disabled={disabled}
                  />
                ) : (
                  <input value={values[f.key]} onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))} className="field text-sm" disabled={disabled} />
                )}
              </div>
            </div>
          );
        })}

        <div className="px-5 py-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!use.body} onChange={() => toggle("body")} className="h-4 w-4 accent-[#16240f]" />
            <span className="eyebrow !text-[10px]">Article text — headings, wording, internal links, image texts</span>
          </label>
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#efefe8] p-4">
              <span className="mono mb-2 block text-[10px] uppercase text-stone/60">Yours</span>
              <BlocksPreview blocks={en.blocks} />
            </div>
            <div className="rounded-xl border border-lime/60 bg-[#fbfdf7] p-4">
              <span className="mono mb-2 block text-[10px] uppercase text-stone/60">Suggestion — you can edit it in the editor after applying</span>
              <BlocksPreview blocks={sug.copy.blocks} />
            </div>
          </div>
          {post.seo?.internalLinks?.length ? (
            <p className="mt-3 text-xs text-stone">
              Internal links added:{" "}
              {post.seo.internalLinks.map((l, i) => (
                <span key={i} className="mr-2 inline-block rounded bg-sand px-1.5 py-0.5">
                  {l.anchor} → {l.path}
                </span>
              ))}
            </p>
          ) : null}
        </div>

        <div className="px-5 py-4">
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={!!use.faqs} onChange={() => toggle("faqs")} className="h-4 w-4 accent-[#16240f]" />
            <span className="eyebrow !text-[10px]">FAQs ({faqs.length}) — replace yours ({en.faqs.length})</span>
          </label>
          <div className="mt-3 space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="grid gap-2 rounded-xl border border-[#efefe8] p-3 md:grid-cols-[1fr_1.4fr_auto]">
                <input value={f.q} onChange={(e) => setFaqs((x) => x.map((y, j) => (j === i ? { ...y, q: e.target.value } : y)))} className="field text-sm" aria-label="Question" />
                <textarea value={f.a} onChange={(e) => setFaqs((x) => x.map((y, j) => (j === i ? { ...y, a: e.target.value } : y)))} rows={2} className="field text-sm" aria-label="Answer" />
                <button className="btn btn-ghost !px-3" onClick={() => setFaqs((x) => x.filter((_, j) => j !== i))} aria-label="Remove FAQ">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function applySuggestion(post: StudioPost, a: Accepted): { en: LocaleCopy; slug: string; galleryTexts: boolean } {
  const sug = post.suggestion!.copy;
  const en = { ...post.locales.en };
  for (const k of ["title", "metaTitle", "metaDescription", "summary", "lede", "headerAlt"] as const) if (a[k] !== undefined) en[k] = a[k]!;
  if (a.body) en.blocks = sug.blocks;
  if (a.faqs) en.faqs = a.faqs;
  return { en, slug: a.slug ?? post.slug, galleryTexts: !!a.body };
}
