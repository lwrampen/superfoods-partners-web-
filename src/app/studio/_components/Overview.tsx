"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { OverviewRow, PostStatus, SiteId } from "@/lib/studio/types";
import { api } from "./api";
import { StatusChip, SiteBadge, fmtDate, fmtDateTime } from "./ui";

type Integrations = Record<string, boolean>;
type Data = { rows: OverviewRow[]; gsc: "ok" | "missing" | "error"; warnings: string[] };

const STATUSES: { id: PostStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "draft", label: "Draft" },
  { id: "scheduled", label: "Scheduled" },
  { id: "publishing", label: "Publishing" },
  { id: "live", label: "Live" },
  { id: "needs_attention", label: "Needs attention" },
];

function Visits({ v, gsc }: { v: OverviewRow["visits"]; gsc: Data["gsc"] }) {
  if (gsc === "missing") return <span className="text-xs text-stone/60">—</span>;
  if (!v) return <span className="text-xs text-stone/60">—</span>;
  return (
    <span className="mono whitespace-nowrap text-[12px] text-forest" title="Clicks · impressions · average position (Search Console, last 28 days)">
      <b className="font-medium">{v.clicks.toLocaleString("en")}</b>
      <span className="text-stone"> · {v.impressions.toLocaleString("en")}</span>
      <span className="text-stone"> · {v.position != null ? `#${v.position}` : "–"}</span>
    </span>
  );
}

export function Overview({ integrations }: { integrations: Integrations }) {
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [site, setSite] = useState<SiteId | "all">("all");
  const [status, setStatus] = useState<PostStatus | "all">("all");
  const [q, setQ] = useState("");

  const load = useCallback(async () => {
    try {
      setData(await api<Data>("/api/studio/overview"));
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);
  useEffect(() => {
    let live = true;
    api<Data>("/api/studio/overview")
      .then((d) => live && setData(d))
      .catch((e: Error) => live && setError(e.message));
    return () => {
      live = false;
    };
  }, []);

  // while something is scheduled or publishing, nudge the pipeline and refresh every 20 s
  const busy = data?.rows.some((r) => r.status === "publishing" || (r.status === "scheduled" && r.scheduledAt && r.scheduledAt <= new Date().toISOString()));
  useEffect(() => {
    if (!busy) return;
    const t = setInterval(async () => {
      await api("/api/studio/tick", { method: "POST" }).catch(() => undefined);
      load();
    }, 20_000);
    return () => clearInterval(t);
  }, [busy, load]);

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return (data?.rows ?? []).filter(
      (r) =>
        (site === "all" || r.site === site) &&
        (status === "all" || r.status === status) &&
        (!needle || `${r.title} ${r.slug} ${r.author} ${r.primaryKeyword ?? ""}`.toLowerCase().includes(needle)),
    );
  }, [data, site, status, q]);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const r of data?.rows ?? []) c[r.status] = (c[r.status] ?? 0) + 1;
    return c;
  }, [data]);

  const missing = [
    !integrations.storage && "draft storage (Vercel Blob)",
    !integrations.anthropic && "AI suggestions (Anthropic)",
    !integrations.dataforseo && "keyword volumes (DataforSEO)",
    !integrations.github && "publishing (GitHub token)",
    !integrations.cron && "scheduled publishing (CRON_SECRET)",
  ].filter(Boolean) as string[];

  return (
    <main className="mx-auto max-w-[1320px] px-4 py-8 sm:px-6 sm:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Both websites</p>
          <h1 className="display mt-1 text-[40px] leading-none sm:text-[52px]">Posts</h1>
        </div>
        <Link href="/studio/new" className="btn btn-lime">
          + New post
        </Link>
      </div>

      {missing.length || integrations.mocks ? (
        <div className="mt-6 rounded-xl border border-[#e3e3da] bg-white px-4 py-3 text-sm text-stone">
          {integrations.mocks ? <b className="text-forest">Local test mode — storage on disk, SEO answers are mocked. </b> : null}
          {missing.length ? (
            <>
              <span className="text-forest">Not configured yet:</span> {missing.join(" · ")}. Leonard adds these in Vercel.
            </>
          ) : null}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
        {(["needs_attention", "publishing", "scheduled", "draft", "live"] as PostStatus[]).map((s) => (
          <button key={s} onClick={() => setStatus(status === s ? "all" : s)} className={`card px-3 py-3 text-left transition sm:px-4 ${status === s ? "ring-2 ring-lime" : ""}`}>
            <StatusChip status={s} />
            <span className="display mt-2 block text-[30px] leading-none">{counts[s] ?? 0}</span>
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="flex rounded-xl border border-[#dcdcd2] bg-white p-1">
          {(["all", "pmp", "sfp"] as const).map((s) => (
            <button key={s} onClick={() => setSite(s)} className={`mono rounded-lg px-3 py-1.5 text-[11px] uppercase ${site === s ? "bg-forest text-offwhite" : "text-stone hover:text-forest"}`}>
              {s === "all" ? "Both sites" : s.toUpperCase()}
            </button>
          ))}
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value as PostStatus | "all")} className="field !w-auto !py-2 text-sm" aria-label="Status">
          {STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search title, keyword, author…" className="field !w-full !py-2 text-sm sm:!w-72" aria-label="Search" />
        <span className="ml-auto text-xs text-stone">
          {data?.gsc === "missing" ? (
            <span className="rounded-lg bg-sand px-3 py-1.5">Visits: connect Search Console (GOOGLE_* env vars)</span>
          ) : data?.gsc === "ok" ? (
            <span>Visits = clicks · impressions · avg. position, Search Console, last 28 days</span>
          ) : null}
        </span>
      </div>

      {error ? <p className="mt-6 rounded-lg bg-[#fbeee6] px-4 py-3 text-sm text-[#8a3a12]">{error}</p> : null}
      {data?.warnings.length ? (
        <ul className="mt-4 space-y-1 text-xs text-stone">
          {data.warnings.map((w, i) => (
            <li key={i}>⚠ {w}</li>
          ))}
        </ul>
      ) : null}

      {!data && !error ? <p className="mt-10 text-stone">Loading posts…</p> : null}

      {data ? (
        <>
          {/* laptop: table */}
          <div className="card mt-5 hidden overflow-hidden md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="mono border-b border-[#e3e3da] bg-[#fafaf7] text-[10px] uppercase tracking-[0.12em] text-stone">
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-3 py-3 font-medium">Site</th>
                  <th className="px-3 py-3 font-medium">Author</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium">Primary keyword</th>
                  <th className="px-4 py-3 font-medium">Visits (28 d)</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key} className="border-b border-[#efefe8] last:border-0 hover:bg-[#fbfbf8]">
                    <td className="max-w-[420px] px-4 py-3">
                      {r.source === "studio" && r.id ? (
                        <Link href={`/studio/posts/${r.id}`} className="font-medium text-forest hover:underline">
                          {r.title}
                        </Link>
                      ) : (
                        <span className="font-medium text-forest">{r.title}</span>
                      )}
                      <div className="mt-0.5 truncate text-xs text-stone">
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noreferrer" className="hover:text-forest hover:underline">
                            {r.url.replace(/^https:\/\/www\./, "")}
                          </a>
                        ) : (
                          <span className="text-stone/60">{r.slug ? `/${r.slug}` : "no URL yet"}</span>
                        )}
                      </div>
                      {r.error ? <div className="mt-1 text-xs text-[#9a3c12]">{r.error}</div> : null}
                    </td>
                    <td className="px-3 py-3">
                      <SiteBadge site={r.site} />
                    </td>
                    <td className="px-3 py-3 text-stone">{r.author}</td>
                    <td className="px-3 py-3">
                      <StatusChip status={r.status} />
                    </td>
                    <td className="mono whitespace-nowrap px-3 py-3 text-[12px] text-stone">
                      {r.status === "scheduled" && r.scheduledAt ? fmtDateTime(r.scheduledAt) : r.date ? fmtDate(r.date) : r.updatedAt ? `edited ${fmtDate(r.updatedAt)}` : "—"}
                    </td>
                    <td className="px-3 py-3 text-stone">{r.primaryKeyword ?? <span className="text-stone/50">—</span>}</td>
                    <td className="px-4 py-3">
                      <Visits v={r.visits} gsc={data.gsc} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!rows.length ? <p className="px-4 py-8 text-center text-stone">No posts match.</p> : null}
          </div>

          {/* phone: cards */}
          <ul className="mt-5 space-y-3 md:hidden">
            {rows.map((r) => (
              <li key={r.key} className="card p-4">
                <div className="flex items-center gap-2">
                  <SiteBadge site={r.site} />
                  <StatusChip status={r.status} />
                  <span className="mono ml-auto text-[11px] text-stone">{r.status === "scheduled" && r.scheduledAt ? fmtDateTime(r.scheduledAt) : r.date ? fmtDate(r.date) : ""}</span>
                </div>
                {r.source === "studio" && r.id ? (
                  <Link href={`/studio/posts/${r.id}`} className="mt-2 block font-medium leading-snug text-forest">
                    {r.title}
                  </Link>
                ) : (
                  <a href={r.url ?? "#"} target="_blank" rel="noreferrer" className="mt-2 block font-medium leading-snug text-forest">
                    {r.title}
                  </a>
                )}
                <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-stone">
                  <span>{r.author}</span>
                  {r.primaryKeyword ? <span>Keyword: {r.primaryKeyword}</span> : null}
                  {data.gsc === "ok" && r.visits ? <Visits v={r.visits} gsc={data.gsc} /> : null}
                </div>
                {r.error ? <div className="mt-2 text-xs text-[#9a3c12]">{r.error}</div> : null}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
