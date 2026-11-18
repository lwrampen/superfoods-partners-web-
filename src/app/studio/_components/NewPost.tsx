"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { SITES } from "@/lib/studio/config";
import type { PostKind, SiteId } from "@/lib/studio/types";
import { api } from "./api";

const LOOK: Record<SiteId, { bg: string; ink: string; note: string }> = {
  pmp: { bg: "#1c4b0c", ink: "#e9f5dc", note: "Matcha, hojicha & mulberry · English, Spanish, German" },
  sfp: { bg: "#16240f", ink: "#f6f6f3", note: "Ube & superfood powders · English + 5 languages" },
};

export function NewPost({ storage, kind: initialKind = "post" }: { storage: boolean; kind?: PostKind }) {
  const [kind, setKind] = useState<PostKind>(initialKind);
  const router = useRouter();
  const [busy, setBusy] = useState<SiteId | null>(null);
  const [error, setError] = useState<string | null>(storage ? null : "Draft storage is not configured yet (Vercel Blob). Leonard connects a Blob store to the project.");
  const start = async (site: SiteId) => {
    setBusy(site);
    setError(null);
    try {
      const { post } = await api<{ post: { id: string } }>("/api/studio/posts", { body: { site, kind } });
      router.push(`/studio/posts/${post.id}`);
    } catch (e) {
      setError((e as Error).message);
      setBusy(null);
    }
  };
  return (
    <main className="mx-auto max-w-[960px] px-4 py-10 sm:px-6 sm:py-14">
      <p className="eyebrow">New {kind === "recipe" ? "recipe" : "post"} · step 1</p>
      <h1 className="display mt-2 text-[40px] leading-none sm:text-[56px]">Which website?</h1>
      <div className="mt-5 flex w-fit rounded-xl border border-[#dcdcd2] bg-white p-1" role="radiogroup" aria-label="Type">
        {(["post", "recipe"] as const).map((k) => (
          <button key={k} role="radio" aria-checked={kind === k} onClick={() => setKind(k)} className={`mono rounded-lg px-4 py-2 text-[11px] uppercase ${kind === k ? "bg-forest text-offwhite" : "text-stone hover:text-forest"}`}>
            {k === "post" ? "Blog post" : "Recipe"}
          </button>
        ))}
      </div>
      <p className="mt-4 max-w-xl text-stone">
        {kind === "recipe"
          ? "Each recipe is written for exactly one site: Pure Matcha Partners for matcha, hojicha and mulberry; Superfoods Partners for ube and the other superfood powders."
          : "Each post is written for exactly one site. The products you can link, the languages and the place it is published follow from this choice."}
      </p>
      {error ? <p className="mt-6 rounded-lg bg-[#fbeee6] px-4 py-3 text-sm text-[#8a3a12]">{error}</p> : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {(Object.keys(SITES) as SiteId[]).map((id) => {
          const s = SITES[id];
          return (
            <button
              key={id}
              onClick={() => start(id)}
              disabled={!!busy || !storage}
              className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl p-7 text-left transition hover:-translate-y-0.5 disabled:opacity-60"
              style={{ background: LOOK[id].bg, color: LOOK[id].ink }}
            >
              <span className="mono text-[11px] uppercase tracking-[0.2em] opacity-80">{s.host.replace("https://www.", "")}</span>
              <span>
                <span className="display block text-[38px] leading-[0.95]">{s.name}</span>
                <span className="mt-3 block text-sm opacity-85">{LOOK[id].note}</span>
                <span className="mono mt-5 inline-flex items-center gap-2 rounded-lg bg-lime px-3 py-2 text-[11px] uppercase tracking-[0.14em] text-forest">
                  {busy === id ? "Creating…" : `Write for ${s.short}`} →
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </main>
  );
}
