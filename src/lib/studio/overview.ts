// Overview: every post on both sites — Studio drafts/scheduled/published posts plus the posts already in the repos —
// with Search Console numbers (clicks, impressions, average position, last 28 days) when connected.
import { SITES, postUrl } from "./config";
import type { OverviewRow, SiteId, StudioPost } from "./types";
import { githubConfigured, gh, readText as ghReadText } from "./github";
import { devMocks } from "./env";
import fs from "node:fs/promises";
import path from "node:path";
import { POSTS as SFP_POSTS, pick } from "@/data/insights";

type Visits = NonNullable<OverviewRow["visits"]>;
const cache = new Map<string, { at: number; value: unknown }>();
async function cached<T>(key: string, ttl: number, fn: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && Date.now() - hit.at < ttl) return hit.value as T;
  const value = await fn();
  cache.set(key, { at: Date.now(), value });
  return value;
}

// ---------- existing posts in the repos ----------

type PmpCms = { slug: string; name: string; lastPublished?: string | null; archived?: boolean; "blog-date"?: string | null; "writer-detail"?: string | null };

// local testing: read the PMP repo from a checkout on disk instead of the GitHub API
const localRepo = () => (devMocks() ? process.env.STUDIO_LOCAL_REPO_PMP : undefined);
const readText = (site: SiteId, p: string) => (localRepo() ? fs.readFile(path.join(localRepo()!, p), "utf8").catch(() => null) : ghReadText(site, p));
const listDir = async (p: string) =>
  localRepo()
    ? (await fs.readdir(path.join(localRepo()!, p)).catch(() => [] as string[])).map((name) => ({ name, type: "file" }))
    : gh<{ name: string; type: string }[]>("pmp", `/contents/${p}?ref=main`).catch(() => []);

async function pmpExisting(): Promise<OverviewRow[]> {
  if (!githubConfigured() && !localRepo()) return [];
  return cached("pmp-existing", 10 * 60_000, async () => {
    const [cmsRaw, writersRaw, dir] = await Promise.all([
      readText("pmp", "content/cms/blogs.en.json"),
      readText("pmp", "content/cms/writers.en.json"),
      listDir("content/posts"),
    ]);
    const writers = new Map((JSON.parse(writersRaw ?? "[]") as { id: string; name: string }[]).map((w) => [w.id, w.name]));
    const rows: OverviewRow[] = [];
    const seen = new Set<string>();
    const files = dir.filter((f) => f.type === "file" && f.name.endsWith(".json"));
    const posts = await Promise.all(files.map((f) => readText("pmp", `content/posts/${f.name}`).catch(() => null)));
    for (const raw of posts) {
      if (!raw) continue;
      try {
        const p = JSON.parse(raw) as { slug: string; date: string; author: string; en?: { title?: string }; keywords?: { primary?: { keyword: string } }; studio?: { id: string } };
        seen.add(p.slug);
        rows.push({ key: `pmp:${p.slug}`, site: "pmp", slug: p.slug, title: p.en?.title ?? p.slug, author: p.author, status: "live", source: "repo", date: p.date, url: postUrl("pmp", p.slug), primaryKeyword: p.keywords?.primary?.keyword ?? null, id: p.studio?.id });
      } catch {}
    }
    for (const b of JSON.parse(cmsRaw ?? "[]") as PmpCms[]) {
      if (!b.lastPublished || b.archived || seen.has(b.slug)) continue;
      rows.push({ key: `pmp:${b.slug}`, site: "pmp", slug: b.slug, title: b.name, author: writers.get(b["writer-detail"] ?? "") ?? "—", status: "live", source: "repo", date: (b["blog-date"] ?? b.lastPublished).slice(0, 10), url: postUrl("pmp", b.slug) });
    }
    return rows;
  });
}

// SFP: this app *is* the SFP site, so its deployed build holds every SFP post (TS + JSON) — same as main.
function sfpExisting(): OverviewRow[] {
  return SFP_POSTS.map((p) => ({
    key: `sfp:${p.slug}`,
    site: "sfp" as SiteId,
    slug: p.slug,
    title: pick(p.title, "en"),
    author: p.author,
    status: "live" as const,
    source: "repo" as const,
    date: p.date,
    url: postUrl("sfp", p.slug),
    primaryKeyword: p.primaryKeyword ?? null,
    id: p.studioId,
  }));
}

// ---------- Search Console ----------

export const gscConfigured = () => !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && process.env.GOOGLE_REFRESH_TOKEN);

async function googleToken() {
  return cached("gsc-token", 45 * 60_000, async () => {
    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN!,
        grant_type: "refresh_token",
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Google token ${res.status}`);
    return ((await res.json()) as { access_token: string }).access_token;
  });
}

/** clicks/impressions/position per post slug (all languages together), last 28 days */
async function gscVisits(site: SiteId): Promise<Map<string, Visits>> {
  return cached(`gsc-${site}`, 60 * 60_000, async () => {
    const s = SITES[site];
    const token = await googleToken();
    const day = (n: number) => new Date(Date.now() - n * 86400_000).toISOString().slice(0, 10);
    const res = await fetch(`https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(process.env[`GSC_SITE_${site.toUpperCase()}`] || s.gscSite)}/searchAnalytics/query`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        startDate: day(30),
        endDate: day(3), // Search Console data lags ~2–3 days: 28 complete days
        dimensions: ["page"],
        dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: `${s.blogPath}/` }] }],
        rowLimit: 5000,
        dataState: "final",
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Search Console ${res.status}`);
    const j = (await res.json()) as { rows?: { keys: string[]; clicks: number; impressions: number; position: number }[] };
    const out = new Map<string, { clicks: number; impressions: number; posImp: number }>();
    for (const r of j.rows ?? []) {
      const m = r.keys[0].match(new RegExp(`${s.blogPath}/([a-z0-9-]+)`));
      if (!m) continue;
      const e = out.get(m[1]) ?? { clicks: 0, impressions: 0, posImp: 0 };
      e.clicks += r.clicks;
      e.impressions += r.impressions;
      e.posImp += r.position * r.impressions;
      out.set(m[1], e);
    }
    return new Map([...out].map(([k, e]) => [k, { clicks: e.clicks, impressions: e.impressions, position: e.impressions ? Math.round((e.posImp / e.impressions) * 10) / 10 : null }]));
  });
}

// ---------- merge ----------

export async function overview(studio: StudioPost[]) {
  const warnings: string[] = [];
  const pmp = await pmpExisting().catch((e) => {
    warnings.push(`Could not read the PMP repo: ${(e as Error).message}`);
    return [] as OverviewRow[];
  });
  if (!githubConfigured() && !localRepo()) warnings.push("GitHub is not connected yet (STUDIO_GITHUB_TOKEN): existing PMP posts are not listed.");
  const repoRows = [...pmp, ...sfpExisting()];

  const studioRows: OverviewRow[] = studio.map((p) => ({
    key: `${p.site}:${p.slug || p.id}`,
    site: p.site,
    slug: p.slug,
    title: p.locales.en?.title || "(untitled draft)",
    author: p.author,
    status: p.status,
    source: "studio",
    id: p.id,
    date: p.publishedAt?.slice(0, 10) ?? null,
    updatedAt: p.updatedAt,
    scheduledAt: p.scheduledAt ?? null,
    url: p.liveUrl ?? null,
    primaryKeyword: p.seo?.primary?.keyword ?? null,
    error: p.error ?? null,
  }));
  // a Studio post that is already in the repo shows once (the Studio row wins, it knows the status)
  const studioKeys = new Set(studioRows.filter((r) => r.slug).map((r) => r.key));
  const studioIds = new Set(studio.map((p) => p.id));
  const rows = [...studioRows, ...repoRows.filter((r) => !studioKeys.has(r.key) && !(r.id && studioIds.has(r.id)))];

  let gsc: "ok" | "missing" | "error" = gscConfigured() ? "ok" : "missing";
  if (gsc === "ok") {
    try {
      const [a, b] = await Promise.all([gscVisits("pmp"), gscVisits("sfp")]);
      for (const r of rows) {
        const m = (r.site === "pmp" ? a : b).get(r.slug);
        r.visits = m ?? (r.status === "live" ? { clicks: 0, impressions: 0, position: null } : null);
      }
    } catch (e) {
      gsc = "error";
      warnings.push(`Search Console: ${(e as Error).message}`);
    }
  }
  const order: Record<string, number> = { needs_attention: 0, publishing: 1, scheduled: 2, draft: 3, live: 4 };
  rows.sort((x, y) => order[x.status] - order[y.status] || (y.date ?? y.updatedAt ?? "").localeCompare(x.date ?? x.updatedAt ?? ""));
  return { rows, gsc, warnings };
}
