"use client";
/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Editor as TEditor } from "@tiptap/react";
import { AUTHORS, LOCALE_NAMES, SITES, embedUrl, postUrl, slugify, videoFromUrl } from "@/lib/studio/config";
import type { LocaleCopy, SiteId, StudioPost } from "@/lib/studio/types";
import { blocksToTiptap, copyHash, tiptapToBlocks, type TNode } from "@/lib/studio/blocks";
import { validateForPublish } from "@/lib/studio/validate";
import { api } from "./api";
import { RichText } from "./RichText";
import { SeoReview, applySuggestion, type Accepted } from "./SeoReview";
import { LocaleEditor } from "./LocaleEditor";
import { uploadImage } from "./images";
import { Counter, Label, Notice, StatusChip, amsterdamToUtc, fmtDateTime, utcToAmsterdam } from "./ui";

type Integrations = Record<string, boolean>;
type TState = "idle" | "busy" | "done" | "error";
const emptyCopy = (): LocaleCopy => ({ title: "", metaTitle: "", metaDescription: "", summary: "", lede: "", blocks: [], faqs: [] });

function Card({ title, children, hint, id }: { title: string; children: React.ReactNode; hint?: string; id?: string }) {
  return (
    <section className="card p-4 sm:p-5" id={id}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 className="eyebrow !text-forest">{title}</h2>
        {hint ? <span className="text-[11px] text-stone/70">{hint}</span> : null}
      </div>
      {children}
    </section>
  );
}

export function Editor({ initial, integrations }: { initial: StudioPost; integrations: Integrations }) {
  const router = useRouter();
  const [post, setPost] = useState<StudioPost>(initial);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [msg, setMsg] = useState<{ kind: "info" | "error" | "ok"; text: string } | null>(null);
  const [seoBusy, setSeoBusy] = useState(false);
  const [tr, setTr] = useState<Record<string, TState>>({});
  const [tab, setTab] = useState<string>(SITES[initial.site].locales[1]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [schedOpen, setSchedOpen] = useState(false);
  const [sched, setSched] = useState(() => (initial.scheduledAt ? utcToAmsterdam(initial.scheduledAt) : utcToAmsterdam(new Date(Date.now() + 86400_000).toISOString().slice(0, 11) + "07:00:00Z")));
  const editorRef = useRef<TEditor | null>(null);
  const headerInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const inlineInput = useRef<HTMLInputElement>(null);
  const postRef = useRef(post);
  useEffect(() => {
    postRef.current = post;
  }, [post]);

  const site = SITES[post.site];
  const en = post.locales.en ?? emptyCopy();
  const locked = post.status === "publishing";
  const published = !!post.publishedAt;
  const otherLocales = site.locales.filter((l) => l !== "en");
  const issues = useMemo(() => validateForPublish(post), [post]);
  const enHash = useMemo(() => copyHash(post.locales.en), [post.locales.en]);

  // ---------- state helpers ----------
  const update = useCallback((fn: (p: StudioPost) => StudioPost) => {
    setPost((p) => fn(p));
    setDirty(true);
  }, []);
  const setEn = (patch: Partial<LocaleCopy>) => update((p) => ({ ...p, locales: { ...p.locales, en: { ...(p.locales.en ?? emptyCopy()), ...patch } } }));
  const fromServer = (p: StudioPost, keepLocalEdits = false) => {
    setPost((cur) => (keepLocalEdits ? { ...cur, status: p.status, scheduledAt: p.scheduledAt, publish: p.publish, error: p.error, liveUrl: p.liveUrl, publishedAt: p.publishedAt, slug: p.slug } : p));
  };

  const save = useCallback(async () => {
    const p = postRef.current;
    if (p.status === "publishing") return true;
    setSaving("saving");
    try {
      const { post: saved } = await api<{ post: StudioPost }>(`/api/studio/posts/${p.id}`, {
        method: "PUT",
        body: { slug: p.slug, author: p.author, category: p.category, header: p.header, gallery: p.gallery, video: p.video, products: p.products, editorDoc: p.editorDoc, locales: p.locales, seo: p.seo, suggestion: p.suggestion, site: p.site },
      });
      // keep what was typed meanwhile; take over server-side fields
      setPost((cur) => ({ ...cur, slug: saved.slug, status: saved.status, updatedAt: saved.updatedAt, video: saved.video }));
      setDirty(false);
      setSaving("saved");
      return true;
    } catch (e) {
      setSaving("error");
      setMsg({ kind: "error", text: (e as Error).message });
      return false;
    }
  }, []);

  // autosave
  useEffect(() => {
    if (!dirty || locked) return;
    const t = setTimeout(save, 1500);
    return () => clearTimeout(t);
  }, [post, dirty, locked, save]);
  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  // follow a running publish
  useEffect(() => {
    if (post.status !== "publishing") return;
    const t = setInterval(async () => {
      try {
        const { post: p } = await api<{ post: StudioPost }>(`/api/studio/posts/${post.id}/publish`, { body: { advance: true } });
        if (p) fromServer(p, true);
      } catch {}
    }, 15_000);
    return () => clearInterval(t);
  }, [post.status, post.id]);

  // ---------- editor ----------
  const onDoc = useCallback(
    (doc: TNode) => update((p) => ({ ...p, editorDoc: doc, locales: { ...p.locales, en: { ...(p.locales.en ?? emptyCopy()), blocks: tiptapToBlocks(doc) } } })),
    [update],
  );
  const onEditor = useCallback((e: TEditor) => {
    editorRef.current = e;
  }, []);
  const initialDoc = useMemo(() => (initial.editorDoc as TNode | undefined) ?? blocksToTiptap(initial.locales.en?.blocks ?? []), [initial]);

  // ---------- images ----------
  const upload = async (files: FileList | null, kind: "header" | "gallery" | "inline") => {
    if (!files?.length) return;
    setMsg(null);
    for (const f of Array.from(files)) {
      setUploading(`${kind === "header" ? "Header image" : "Photo"}: ${f.name}`);
      try {
        const img = await uploadImage(post.id, f);
        if (kind === "header") update((p) => ({ ...p, header: { ...img, alt: p.locales.en?.headerAlt ?? p.header?.alt ?? "" } }));
        else if (kind === "gallery") update((p) => ({ ...p, gallery: [...p.gallery, { ...img, alt: "", inGallery: true }] }));
        else editorRef.current?.chain().focus().setImage({ src: img.src, alt: "" }).updateAttributes("image", { width: img.width, height: img.height }).run();
      } catch (e) {
        setMsg({ kind: "error", text: (e as Error).message });
      }
    }
    setUploading(null);
  };
  const insertInline = (i: number) => {
    const g = post.gallery[i];
    editorRef.current?.chain().focus().setImage({ src: g.src, alt: g.alt }).updateAttributes("image", { caption: g.caption ?? null, width: g.width ?? null, height: g.height ?? null }).run();
    update((p) => ({ ...p, gallery: p.gallery.map((x, j) => (j === i ? { ...x, inGallery: false } : x)) }));
  };

  // ---------- SEO + translations ----------
  const translateAll = async (locales = otherLocales) => {
    if (!(await save())) return;
    setTr((t) => ({ ...t, ...Object.fromEntries(locales.map((l) => [l, "busy" as TState])) }));
    let ok = 0;
    await Promise.all(
      locales.map(async (l) => {
        try {
          const r = await api<{ copy: LocaleCopy }>("/api/studio/translate", { body: { id: post.id, locale: l } });
          setPost((p) => ({ ...p, locales: { ...p.locales, [l]: r.copy } }));
          setDirty(true);
          setTr((t) => ({ ...t, [l]: "done" }));
          ok++;
        } catch (e) {
          setTr((t) => ({ ...t, [l]: "error" }));
          setMsg({ kind: "error", text: `${LOCALE_NAMES[l]}: ${(e as Error).message}` });
        }
      }),
    );
    if (ok === locales.length) setMsg({ kind: "ok", text: `Translations ready (${locales.map((l) => LOCALE_NAMES[l]).join(", ")}) — check them in the language tabs.` });
  };

  const optimise = async () => {
    setMsg(null);
    if (!en.title.trim()) return setMsg({ kind: "error", text: "Write a title first." });
    if (!(await save())) return;
    setSeoBusy(true);
    try {
      const { post: p } = await api<{ post: StudioPost }>("/api/studio/seo", { body: { id: post.id } });
      setPost((cur) => ({ ...cur, seo: p.seo, suggestion: p.suggestion }));
      setMsg({ kind: "ok", text: "Suggestion ready — review it below the editor." });
      setTimeout(() => document.getElementById("seo-review")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    } catch (e) {
      const err = e as Error & { notConfigured?: boolean };
      setMsg({ kind: "error", text: err.notConfigured ? `${err.message} Leonard adds it in Vercel.` : err.message });
    } finally {
      setSeoBusy(false);
    }
  };

  const applySeo = (a: Accepted) => {
    const { en: next, slug, galleryTexts } = applySuggestion(post, a);
    const sug = post.suggestion!.copy;
    if (a.body) editorRef.current?.commands.setContent(blocksToTiptap(next.blocks) as object, { emitUpdate: false });
    update((p) => ({
      ...p,
      slug: published ? p.slug : slugify(slug),
      editorDoc: a.body ? blocksToTiptap(next.blocks) : p.editorDoc,
      header: p.header && a.headerAlt !== undefined ? { ...p.header, alt: a.headerAlt } : p.header,
      gallery: galleryTexts ? p.gallery.map((g, i) => ({ ...g, alt: sug.gallery?.[i]?.alt || g.alt, caption: sug.gallery?.[i]?.caption || g.caption })) : p.gallery,
      locales: { ...p.locales, en: next },
      suggestion: null,
    }));
    setMsg({ kind: "ok", text: `Applied. Translating into ${otherLocales.map((l) => LOCALE_NAMES[l]).join(", ")}…` });
    setTimeout(() => translateAll(), 50);
  };

  // ---------- publish ----------
  const doSchedule = async (cancel = false) => {
    setMsg(null);
    if (!cancel && !(await save())) return;
    try {
      const { post: p } = await api<{ post: StudioPost }>(`/api/studio/posts/${post.id}/schedule`, { body: cancel ? { cancel: true } : { at: amsterdamToUtc(sched.date, sched.time) } });
      fromServer(p, true);
      setSchedOpen(false);
      setMsg({ kind: "ok", text: cancel ? "Schedule cancelled — back to draft." : `Scheduled for ${fmtDateTime(p.scheduledAt!)}.` });
    } catch (e) {
      setMsg({ kind: "error", text: (e as Error).message });
    }
  };
  const publishNow = async () => {
    setMsg(null);
    if (!window.confirm(`Publish “${en.title}” on ${site.name} now?\n\nBlog Studio opens a PR, waits for a green preview, merges and waits for the live site.`)) return;
    if (!(await save())) return;
    try {
      const { post: p } = await api<{ post: StudioPost }>(`/api/studio/posts/${post.id}/publish`, { body: {} });
      fromServer(p, true);
    } catch (e) {
      setMsg({ kind: "error", text: (e as Error).message });
    }
  };
  const remove = async () => {
    if (!window.confirm("Delete this draft and its photos? This cannot be undone.")) return;
    await api(`/api/studio/posts/${post.id}`, { method: "DELETE" });
    router.push("/studio");
  };

  const changeSite = (s: SiteId) => {
    if (s === post.site || published) return;
    if (!window.confirm(`Move this post to ${SITES[s].name}? Linked products and translations for the other site are cleared.`)) return;
    update((p) => ({ ...p, site: s, products: [], category: SITES[s].categories[0], locales: { en: p.locales.en }, seo: null, suggestion: null }));
    setTab(SITES[s].locales[1]);
  };

  const videoParsed = post.video?.url ? videoFromUrl(post.video.url) : null;
  const linkTargets = useMemo(() => site.products.filter((x) => post.products.includes(x.id)).map((x) => ({ path: x.path, name: x.name })), [site, post.products]);
  const missingTranslations = otherLocales.filter((l) => !post.locales[l]?.title);

  // ---------- render ----------
  const actions = (
    <div className="grid gap-2">
      <div className="grid grid-cols-2 gap-2">
        <button className="btn btn-ghost" onClick={() => save()} disabled={locked || saving === "saving"}>
          {saving === "saving" ? "Saving…" : "Save draft"}
        </button>
        <button className="btn btn-lime" onClick={optimise} disabled={locked || seoBusy}>
          {seoBusy ? "Optimising…" : "Optimise for SEO"}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn btn-ghost" onClick={() => setSchedOpen((x) => !x)} disabled={locked || post.status === "live"}>
          Schedule…
        </button>
        <button className="btn btn-primary" onClick={publishNow} disabled={locked || issues.length > 0}>
          {post.status === "live" ? "Publish update" : "Publish now"}
        </button>
      </div>
    </div>
  );

  return (
    <main className="mx-auto max-w-[1320px] px-4 pb-28 pt-6 sm:px-6 lg:pb-16">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-[#dcdcd2] bg-white p-1" role="radiogroup" aria-label="Website">
          {(Object.keys(SITES) as SiteId[]).map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={post.site === s}
              onClick={() => changeSite(s)}
              disabled={published && post.site !== s}
              className={`mono rounded-lg px-3 py-1.5 text-[11px] uppercase ${post.site === s ? "bg-forest text-offwhite" : "text-stone hover:text-forest disabled:opacity-40"}`}
            >
              {SITES[s].name}
            </button>
          ))}
        </div>
        <StatusChip status={post.status} />
        {post.status === "scheduled" && post.scheduledAt ? <span className="text-sm text-stone">{fmtDateTime(post.scheduledAt)}</span> : null}
        <span className="mono ml-auto text-[11px] text-stone">
          {saving === "saving" ? "Saving…" : saving === "error" ? "Not saved" : dirty ? "Unsaved changes" : saving === "saved" ? "All changes saved" : ""}
        </span>
      </div>

      {msg ? (
        <div className="mt-4" role={msg.kind === "error" ? "alert" : "status"}>
          <Notice kind={msg.kind}>{msg.text}</Notice>
        </div>
      ) : null}
      {post.status === "needs_attention" && post.error ? (
        <div className="mt-4">
          <Notice kind="error">
            <b>Needs attention:</b> {post.error} {post.publish?.prUrl ? <a className="underline" href={post.publish.prUrl} target="_blank" rel="noreferrer">Open the PR</a> : null}
          </Notice>
        </div>
      ) : null}

      <div className="mt-5 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* ---------------- main column ---------------- */}
        <div className="min-w-0">
          <label className="block">
            <span className="sr-only">Title</span>
            <textarea
              value={en.title}
              onChange={(e) => setEn({ title: e.target.value.replace(/\n/g, " ") })}
              onBlur={() => !post.slug && en.title && !published && update((p) => ({ ...p, slug: slugify(p.locales.en.title) }))}
              placeholder="Title of the post"
              rows={2}
              disabled={locked}
              className="display w-full resize-none bg-transparent text-[34px] leading-[1.02] text-forest outline-none placeholder:text-stone/40 sm:text-[46px]"
            />
          </label>
          <label className="mt-3 block">
            <Label hint="Answer the reader's question directly — Google and AI answers quote this">Opening paragraph</Label>
            <textarea value={en.lede} onChange={(e) => setEn({ lede: e.target.value })} rows={4} disabled={locked} className="field mt-1.5 text-[16px]" placeholder="In two to four sentences: the answer, then what the article covers." />
          </label>

          <div className="mt-5">
            <RichText initial={initialDoc} onChange={onDoc} onEditor={onEditor} onInsertImage={() => inlineInput.current?.click()} linkTargets={linkTargets} />
            <input ref={inlineInput} type="file" accept="image/*" className="hidden" aria-label="Upload image for the text" onChange={(e) => (upload(e.target.files, "inline"), (e.target.value = ""))} />
          </div>

          <details className="card mt-5 p-4 sm:p-5" open={en.faqs.length > 0}>
            <summary className="eyebrow cursor-pointer !text-forest">FAQs ({en.faqs.length}) — optional, the SEO step suggests 3–5</summary>
            <div className="mt-3 space-y-2">
              {en.faqs.map((f, i) => (
                <div key={i} className="grid gap-2 md:grid-cols-[1fr_1.4fr_auto]">
                  <input value={f.q} onChange={(e) => setEn({ faqs: en.faqs.map((x, j) => (j === i ? { ...x, q: e.target.value } : x)) })} placeholder="Question" className="field text-sm" />
                  <textarea value={f.a} onChange={(e) => setEn({ faqs: en.faqs.map((x, j) => (j === i ? { ...x, a: e.target.value } : x)) })} placeholder="Answer" rows={2} className="field text-sm" />
                  <button className="btn btn-ghost !px-3" onClick={() => setEn({ faqs: en.faqs.filter((_, j) => j !== i) })} aria-label="Remove FAQ">
                    ✕
                  </button>
                </div>
              ))}
              <button className="btn btn-ghost" onClick={() => setEn({ faqs: [...en.faqs, { q: "", a: "" }] })}>
                + Add FAQ
              </button>
            </div>
          </details>

          <div id="seo-review">{post.suggestion ? <SeoReview key={post.suggestion.at} post={post} onApply={applySeo} onDismiss={() => update((p) => ({ ...p, suggestion: null }))} /> : null}</div>

          {/* ---------------- translations ---------------- */}
          <section className="card mt-8 overflow-hidden" aria-label="Languages">
            <div className="flex flex-wrap items-center gap-3 border-b border-[#e3e3da] px-4 py-3 sm:px-5">
              <h2 className="eyebrow !text-forest">Languages</h2>
              <span className="text-xs text-stone">
                {site.name} is live in {site.locales.map((l) => l.toUpperCase()).join(", ")}. {missingTranslations.length ? `Missing: ${missingTranslations.map((l) => LOCALE_NAMES[l]).join(", ")}.` : "All translations are there."}
              </span>
              <button className="btn btn-ghost ml-auto !py-2" onClick={() => translateAll()} disabled={locked || !en.title || Object.values(tr).includes("busy")}>
                {Object.values(tr).includes("busy") ? "Translating…" : missingTranslations.length === otherLocales.length ? "Translate all" : "Re-translate all"}
              </button>
            </div>
            <div className="flex gap-1 overflow-x-auto border-b border-[#efefe8] bg-[#fafaf7] px-2 pt-2" role="tablist">
              {otherLocales.map((l) => {
                const c = post.locales[l];
                const stale = c?.title && c.sourceHash && c.sourceHash !== enHash;
                return (
                  <button
                    key={l}
                    role="tab"
                    aria-selected={tab === l}
                    onClick={() => setTab(l)}
                    className={`flex items-center gap-2 whitespace-nowrap rounded-t-lg px-3 py-2 text-sm ${tab === l ? "bg-white text-forest shadow-[0_-1px_0_#e3e3da]" : "text-stone hover:text-forest"}`}
                  >
                    {LOCALE_NAMES[l]}
                    <span
                      className={`h-2 w-2 rounded-full ${tr[l] === "busy" ? "animate-pulse bg-lime" : tr[l] === "error" ? "bg-[#b24a18]" : !c?.title ? "bg-[#d3d3c8]" : stale ? "bg-[#e0a43a]" : "bg-lime"}`}
                      title={tr[l] === "busy" ? "Translating" : !c?.title ? "Missing" : stale ? "English changed since this translation" : "Up to date"}
                    />
                  </button>
                );
              })}
            </div>
            <div className="p-4 sm:p-5">
              {(() => {
                const c = post.locales[tab];
                if (tr[tab] === "busy" && !c) return <p className="text-sm text-stone">Translating into {LOCALE_NAMES[tab]}…</p>;
                if (!c)
                  return (
                    <div className="flex flex-wrap items-center gap-3">
                      <p className="text-sm text-stone">No {LOCALE_NAMES[tab]} version yet. It is made by the SEO step (or translate now).</p>
                      <button className="btn btn-ghost" onClick={() => translateAll([tab])} disabled={locked || !en.title}>
                        Translate {LOCALE_NAMES[tab]}
                      </button>
                    </div>
                  );
                return (
                  <>
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                      {c.sourceHash && c.sourceHash !== enHash ? <Notice>The English text changed after this translation was made.</Notice> : null}
                      <button className="btn btn-ghost ml-auto !py-2" onClick={() => translateAll([tab])} disabled={locked || tr[tab] === "busy"}>
                        {tr[tab] === "busy" ? "Translating…" : `Re-translate ${LOCALE_NAMES[tab]}`}
                      </button>
                    </div>
                    <LocaleEditor post={post} locale={tab} copy={c} onChange={(copy) => update((p) => ({ ...p, locales: { ...p.locales, [tab]: copy } }))} />
                  </>
                );
              })()}
            </div>
          </section>
        </div>

        {/* ---------------- sidebar ---------------- */}
        <aside className="grid gap-4">
          <Card title="Publish" id="publish">
            {actions}
            {schedOpen ? (
              <div className="mt-3 rounded-xl bg-[#fafaf7] p-3">
                <Label hint="Europe/Amsterdam time">Publish on</Label>
                <div className="mt-2 grid grid-cols-[1fr_110px] gap-2">
                  <input type="date" value={sched.date} onChange={(e) => setSched((s) => ({ ...s, date: e.target.value }))} className="field text-sm" aria-label="Date" />
                  <input type="time" value={sched.time} onChange={(e) => setSched((s) => ({ ...s, time: e.target.value }))} className="field text-sm" aria-label="Time" step={300} />
                </div>
                <p className="mt-2 text-xs text-stone">Scheduled posts go out within the hour after this time (hourly check).</p>
                <button className="btn btn-primary mt-3 w-full" onClick={() => doSchedule()} disabled={issues.length > 0}>
                  Schedule
                </button>
              </div>
            ) : null}
            {post.status === "scheduled" ? (
              <button className="mt-2 text-xs text-stone underline" onClick={() => doSchedule(true)}>
                Cancel schedule
              </button>
            ) : null}
            {issues.length && post.status !== "live" ? (
              <ul className="mt-3 space-y-1 text-xs text-stone">
                <li className="mono text-[10px] uppercase text-stone/70">Before publishing</li>
                {issues.map((i, k) => (
                  <li key={k}>○ {i.message}</li>
                ))}
              </ul>
            ) : null}
            {!integrations.github ? <p className="mt-3 text-xs text-stone">Publishing is not configured yet (GitHub token).</p> : null}
            {post.publish ? (
              <div className="mt-4 border-t border-[#efefe8] pt-3">
                <p className="mono text-[10px] uppercase text-stone/70">Publish log</p>
                <ol className="mt-2 space-y-1 text-xs text-stone">
                  {post.publish.log.slice(-8).map((l, i) => (
                    <li key={i}>
                      <span className="mono text-[10px] text-stone/60">{new Date(l.at).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Amsterdam" })}</span> {l.msg}
                    </li>
                  ))}
                </ol>
                <div className="mt-2 flex flex-wrap gap-3 text-xs">
                  {post.publish.prUrl ? (
                    <a className="text-forest underline" href={post.publish.prUrl} target="_blank" rel="noreferrer">
                      PR #{post.publish.prNumber}
                    </a>
                  ) : null}
                  {post.publish.previewUrl ? (
                    <a className="text-forest underline" href={post.publish.previewUrl} target="_blank" rel="noreferrer">
                      Preview
                    </a>
                  ) : null}
                  {post.liveUrl ? (
                    <a className="font-medium text-forest underline" href={post.liveUrl} target="_blank" rel="noreferrer">
                      Live post →
                    </a>
                  ) : null}
                </div>
              </div>
            ) : null}
          </Card>

          <Card title="Header image" hint="max 15 MB · resized to 2400 px">
            {post.header ? (
              <div>
                <img src={post.header.src} alt="" className="aspect-[16/9] w-full rounded-xl object-cover" />
                <input
                  value={en.headerAlt ?? post.header.alt ?? ""}
                  onChange={(e) => update((p) => ({ ...p, header: p.header ? { ...p.header, alt: e.target.value } : null, locales: { ...p.locales, en: { ...p.locales.en, headerAlt: e.target.value } } }))}
                  placeholder="Alt text — describe the photo"
                  className="field mt-2 text-sm"
                  aria-label="Header image alt text"
                  disabled={locked}
                />
              </div>
            ) : (
              <button onClick={() => headerInput.current?.click()} disabled={locked} className="grid aspect-[16/9] w-full place-items-center rounded-xl border-2 border-dashed border-[#d3d3c8] text-sm text-stone hover:border-forest hover:text-forest">
                + Add header image
              </button>
            )}
            {post.header ? (
              <button className="btn btn-ghost mt-2 w-full !py-2" onClick={() => headerInput.current?.click()} disabled={locked}>
                Replace
              </button>
            ) : null}
            <input ref={headerInput} type="file" accept="image/*" className="hidden" aria-label="Upload header image" onChange={(e) => (upload(e.target.files, "header"), (e.target.value = ""))} />
          </Card>

          <Card title="Extra photos" hint="gallery + inline">
            <div className="space-y-3">
              {post.gallery.map((g, i) => (
                <div key={g.src} className="flex gap-3">
                  <img src={g.src} alt="" className="h-16 w-20 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <input value={g.alt} onChange={(e) => update((p) => ({ ...p, gallery: p.gallery.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)) }))} placeholder="Alt text" className="field !py-1.5 text-xs" disabled={locked} />
                    <input value={g.caption ?? ""} onChange={(e) => update((p) => ({ ...p, gallery: p.gallery.map((x, j) => (j === i ? { ...x, caption: e.target.value || undefined } : x)) }))} placeholder="Caption (optional)" className="field !py-1.5 text-xs" disabled={locked} />
                    <div className="flex flex-wrap items-center gap-3 text-[11px]">
                      <button className="text-forest underline" onClick={() => insertInline(i)} disabled={locked}>
                        Insert in text
                      </button>
                      <label className="flex items-center gap-1 text-stone">
                        <input type="checkbox" checked={g.inGallery !== false} onChange={(e) => update((p) => ({ ...p, gallery: p.gallery.map((x, j) => (j === i ? { ...x, inGallery: e.target.checked } : x)) }))} className="accent-[#16240f]" disabled={locked} />
                        In gallery
                      </label>
                      <button className="ml-auto text-stone hover:text-[#b24a18]" onClick={() => update((p) => ({ ...p, gallery: p.gallery.filter((_, j) => j !== i) }))} disabled={locked}>
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-ghost mt-3 w-full !py-2" onClick={() => galleryInput.current?.click()} disabled={locked}>
              + Add photos
            </button>
            <input ref={galleryInput} type="file" accept="image/*" multiple className="hidden" aria-label="Upload extra photos" onChange={(e) => (upload(e.target.files, "gallery"), (e.target.value = ""))} />
            {uploading ? <p className="mt-2 text-xs text-stone">Uploading {uploading}…</p> : null}
          </Card>

          <Card title="Video" hint="YouTube or Vimeo link">
            <input
              value={post.video?.url ?? ""}
              onChange={(e) => {
                const url = e.target.value;
                const v = videoFromUrl(url);
                update((p) => ({ ...p, video: url ? { url, provider: v?.provider ?? "youtube", id: v?.id ?? "", position: p.video?.position ?? "end" } : null }));
              }}
              placeholder="https://www.youtube.com/watch?v=…"
              className="field text-sm"
              disabled={locked}
              aria-label="Video link"
            />
            {post.video?.url && !videoParsed ? <p className="mt-2 text-xs text-[#b24a18]">Not a YouTube or Vimeo video link.</p> : null}
            {videoParsed ? (
              <>
                <iframe src={embedUrl(videoParsed)} title="Video preview" className="mt-2 aspect-video w-full rounded-lg" loading="lazy" allowFullScreen />
                <select value={post.video?.position ?? "end"} onChange={(e) => update((p) => ({ ...p, video: p.video ? { ...p.video, position: e.target.value as "end" | "after-intro" } : null }))} className="field mt-2 text-sm" aria-label="Video position">
                  <option value="after-intro">Show after the opening paragraph</option>
                  <option value="end">Show at the end of the article</option>
                </select>
              </>
            ) : null}
          </Card>

          <Card title={post.site === "pmp" ? "Products & pages" : "Products"} hint="linked + related block">
            {(["group", "product", "page"] as const).map((kind) => {
              const list = site.products.filter((x) => x.kind === kind);
              if (!list.length) return null;
              return (
                <div key={kind} className="mb-3 last:mb-0">
                  <p className="mono mb-1.5 text-[10px] uppercase text-stone/70">{kind === "group" ? "Product groups" : kind === "page" ? "Who we serve" : "Products"}</p>
                  <div className="grid gap-1">
                    {list.map((x) => (
                      <label key={x.id} className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm hover:bg-[#fafaf7]">
                        <input
                          type="checkbox"
                          checked={post.products.includes(x.id)}
                          onChange={(e) => update((p) => ({ ...p, products: e.target.checked ? [...p.products, x.id] : p.products.filter((y) => y !== x.id) }))}
                          className="h-4 w-4 accent-[#16240f]"
                          disabled={locked}
                        />
                        <span className="text-forest">{x.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </Card>

          <Card title="Details">
            <div className="grid gap-3">
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <Label>Author</Label>
                  <select value={post.author} onChange={(e) => update((p) => ({ ...p, author: e.target.value }))} className="field mt-1.5 text-sm" disabled={locked}>
                    {[...new Set([...AUTHORS, post.author])].map((a) => (
                      <option key={a}>{a}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <Label>Category</Label>
                  <select value={post.category} onChange={(e) => update((p) => ({ ...p, category: e.target.value }))} className="field mt-1.5 text-sm" disabled={locked}>
                    {[...new Set([...site.categories, post.category])].map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="block">
                <Label hint={published ? "fixed after publishing" : undefined}>URL slug</Label>
                <input value={post.slug} onChange={(e) => update((p) => ({ ...p, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-") }))} onBlur={() => update((p) => ({ ...p, slug: slugify(p.slug) }))} className="field mono mt-1.5 text-xs" disabled={locked || published} />
                <span className="mt-1 block truncate text-[11px] text-stone">{postUrl(post.site, post.slug || "…")}</span>
              </label>
              <label className="block">
                <Label right={<Counter value={en.metaTitle} max={60} />}>Meta title</Label>
                <input value={en.metaTitle} onChange={(e) => setEn({ metaTitle: e.target.value })} className="field mt-1.5 text-sm" disabled={locked} />
              </label>
              <label className="block">
                <Label right={<Counter value={en.metaDescription} max={155} />}>Meta description</Label>
                <textarea value={en.metaDescription} onChange={(e) => setEn({ metaDescription: e.target.value })} rows={3} className="field mt-1.5 text-sm" disabled={locked} />
              </label>
              <label className="block">
                <Label>Summary</Label>
                <textarea value={en.summary} onChange={(e) => setEn({ summary: e.target.value })} rows={2} className="field mt-1.5 text-sm" placeholder="1–2 sentences for the blog overview" disabled={locked} />
              </label>
              {post.status === "draft" || post.status === "needs_attention" ? (
                <button className="mt-1 justify-self-start text-xs text-stone underline hover:text-[#b24a18]" onClick={remove}>
                  Delete draft
                </button>
              ) : null}
            </div>
          </Card>

          <Card title="Keywords" hint={post.seo?.mocked ? "mocked" : post.seo ? "DataforSEO" : undefined}>
            {post.seo?.primary ? (
              <div className="space-y-2 text-sm">
                <div className="flex items-baseline justify-between gap-3 rounded-lg bg-[#eef7e2] px-3 py-2">
                  <span className="font-medium text-forest">{post.seo.primary.keyword}</span>
                  <span className="mono text-[11px] text-stone">{post.seo.primary.volume != null ? `${post.seo.primary.volume.toLocaleString("en")}/mo` : "—"}</span>
                </div>
                {post.seo.secondary.map((k) => (
                  <div key={k.keyword} className="flex items-baseline justify-between gap-3 px-3">
                    <span className="text-forest">{k.keyword}</span>
                    <span className="mono text-[11px] text-stone">{k.volume != null ? `${k.volume.toLocaleString("en")}/mo` : "—"}</span>
                  </div>
                ))}
                <p className="px-3 text-[11px] text-stone/80">Monthly searches, {site.markets.map((m) => m.label).join(" + ")}.</p>
              </div>
            ) : (
              <p className="text-sm text-stone">Run “Optimise for SEO” to pick a primary keyword and 3–5 secondary keywords with search volumes.</p>
            )}
          </Card>
        </aside>
      </div>

      {/* phone: sticky actions */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#e3e3da] bg-offwhite/95 p-3 backdrop-blur lg:hidden">
        <div className="mx-auto grid max-w-[600px] grid-cols-3 gap-2">
          <button className="btn btn-ghost !px-2" onClick={() => save()} disabled={locked}>
            Save
          </button>
          <button className="btn btn-lime !px-2" onClick={optimise} disabled={locked || seoBusy}>
            {seoBusy ? "SEO…" : "SEO"}
          </button>
          <button className="btn btn-primary !px-2" onClick={() => document.getElementById("publish")?.scrollIntoView({ behavior: "smooth" })}>
            Publish…
          </button>
        </div>
      </div>
    </main>
  );
}
