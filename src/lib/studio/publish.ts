// Publish pipeline: branch studio/<slug> → commit post JSON + images → PR → wait for a green Vercel preview →
// merge → wait for a green production deploy → check the URL answers 200 → IndexNow → Live.
// On any failure the post is marked "Needs attention" with the reason; nothing is merged unless the preview is green.
//
// The pipeline is a small state machine. Each tick (cron, or the Studio page while it is open) advances a post by at
// most one step, so no request has to wait minutes for a deploy.
import { SITES, postUrl } from "./config";
import type { PublishState, StudioPost } from "./types";
import { getPost, listPosts, updatePost } from "./store";
import { branchExists, commitToNewBranch, fileExists, gh, githubConfigured, readText, vercelStatus } from "./github";
import { buildRepoFiles, validateForPublish } from "./export";
import { STATIC_POSTS as SFP_TS_POSTS } from "@/data/insights";

const PREVIEW_TIMEOUT = 30 * 60 * 1000;
const PRODUCTION_TIMEOUT = 30 * 60 * 1000;
const VERIFY_TIMEOUT = 15 * 60 * 1000;
const now = () => new Date().toISOString();
const log = (s: PublishState, msg: string) => ({ ...s, log: [...s.log, { at: now(), msg }].slice(-40) });

async function fail(id: string, reason: string) {
  return updatePost(id, (p) => ({
    ...p,
    status: "needs_attention",
    error: reason,
    publish: p.publish ? { ...log(p.publish, `Stopped: ${reason}`), lockUntil: undefined } : p.publish,
  }));
}

async function slugTaken(p: StudioPost): Promise<string | null> {
  const s = SITES[p.site];
  if (p.kind === "recipe") {
    const own = await readText(p.site, `${s.recipeDir}/${p.slug}.json`);
    if (own) {
      let id: string | undefined;
      try {
        id = (JSON.parse(own) as { studio?: { id?: string } }).studio?.id;
      } catch {
        return "A recipe file with this slug already exists on the site.";
      }
      // a file taken over with "Edit in Studio" has no Studio id yet (or this post's id)
      if (id ? id !== p.id : !p.imported) return "A different recipe with this slug already exists on the site.";
    }
    if (p.site === "pmp" && !own && (await fileExists("pmp", `content/snapshot/en/recipe__${p.slug}.json`))) return "An existing recipe already uses this slug.";
    return null;
  }
  const own = await readText(p.site, `${s.postDir}/${p.slug}.json`);
  if (own) {
    try {
      if ((JSON.parse(own) as { studio?: { id?: string } }).studio?.id !== p.id) return "A different post with this slug already exists on the site.";
    } catch {
      return "A post file with this slug already exists on the site.";
    }
  }
  if (p.site === "sfp" && SFP_TS_POSTS.some((x) => x.slug === p.slug)) return "An existing Insights article already uses this slug.";
  if (p.site === "pmp" && (await fileExists("pmp", `content/snapshot/en/blogs__${p.slug}.json`))) return "An existing blog post already uses this slug.";
  return null;
}

/** start publishing now (writer clicked Publish, or a scheduled post is due) */
export async function startPublish(id: string, user?: string): Promise<StudioPost | null> {
  let post = await getPost(id);
  if (!post) return null;
  if (!githubConfigured()) throw new Error("Publishing is not configured yet (STUDIO_GITHUB_TOKEN).");
  const issues = validateForPublish(post);
  if (issues.length) throw new Error(issues.map((i) => i.message).join(" "));
  if (post.status === "publishing") return post;

  post = await updatePost(id, (p) => ({
    ...p,
    status: "publishing",
    error: null,
    publishedAt: p.publishedAt ?? now(),
    publish: { phase: "branch", startedAt: now(), phaseStartedAt: now(), lockUntil: new Date(Date.now() + 120_000).toISOString(), log: [{ at: now(), msg: `Publishing started${user ? ` by ${user}` : ""}` }] },
  }));
  if (!post) return null;

  try {
    const taken = await slugTaken(post);
    if (taken) return fail(id, taken);
    const { files } = await buildRepoFiles(post);
    const s = SITES[post.site];
    let branch = `studio/${post.slug}`;
    if (await branchExists(post.site, branch)) branch = `studio/${post.slug}-${Date.now().toString(36)}`;
    const title = post.locales.en.title;
    const sha = await commitToNewBranch(post.site, branch, `Blog Studio: ${title}\n\n${post.kind === "recipe" ? "Recipe" : "Post"} ${post.slug} by ${post.author}, published from Blog Studio.`, files);
    const pr = await gh<{ number: number; html_url: string }>(post.site, "/pulls", {
      method: "POST",
      body: {
        title: `Blog Studio: ${title}`,
        head: branch,
        base: s.repo.branch,
        body: [
          `New post from Blog Studio by **${post.author}**.`,
          "",
          `- URL after merge: ${postUrl(post.site, post.slug, "en", post.kind)}`,
          `- Languages: ${s.locales.join(", ")}`,
          `- Files: ${files.map((f) => `\`${f.path}\``).join(", ")}`,
          post.seo?.primary ? `- Primary keyword: ${post.seo.primary.keyword}${post.seo.primary.volume != null ? ` (${post.seo.primary.volume}/mo)` : ""}` : "",
          "",
          "Blog Studio merges this PR automatically once the Vercel preview is green, then waits for the production deploy.",
        ]
          .filter((x) => x !== "")
          .join("\n"),
      },
    });
    return updatePost(id, (p) => ({
      ...p,
      publish: {
        ...log(p.publish!, `Branch ${branch} and PR #${pr.number} created`),
        phase: "preview",
        branch,
        prNumber: pr.number,
        prUrl: pr.html_url,
        headSha: sha,
        phaseStartedAt: now(),
        lockUntil: undefined,
      },
    }));
  } catch (e) {
    return fail(id, (e as Error).message);
  }
}

async function indexNow(p: StudioPost) {
  const s = SITES[p.site];
  const host = new URL(s.host).host;
  const urlList = s.locales.map((l) => postUrl(p.site, p.slug, l, p.kind));
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ host, key: s.indexNowKey, keyLocation: `${s.host}/${s.indexNowKey}.txt`, urlList }),
  });
  return res.status;
}

/** advance one publishing post by one step */
export async function advance(id: string): Promise<StudioPost | null> {
  const lockUntil = new Date(Date.now() + 90_000).toISOString();
  let locked = false;
  const post = await updatePost(id, (p) => {
    if (p.status !== "publishing" || !p.publish) return p;
    if (p.publish.lockUntil && p.publish.lockUntil > now()) return p;
    locked = true;
    return { ...p, publish: { ...p.publish, lockUntil } };
  });
  if (!post || !locked || !post.publish) return post;
  const st = post.publish;
  const since = Date.now() - new Date(st.phaseStartedAt ?? st.startedAt).getTime();
  const unlock = (patch: Partial<PublishState> = {}, msg?: string, extra: Partial<StudioPost> = {}) =>
    updatePost(id, (p) => ({ ...p, ...extra, publish: { ...(msg ? log(p.publish!, msg) : p.publish!), ...patch, lockUntil: undefined } }));

  try {
    if (st.phase === "branch") {
      // the start step crashed midway: start over
      await updatePost(id, (p) => ({ ...p, status: "draft", publish: null }));
      return startPublish(id);
    }
    if (st.phase === "preview") {
      const v = await vercelStatus(post.site, st.headSha!);
      if (v.state === "failure") return fail(id, `The Vercel preview failed${v.description ? `: ${v.description}` : ""}. Nothing was merged.${v.url ? ` ${v.url}` : ""}`);
      if (v.state !== "success") {
        if (since > PREVIEW_TIMEOUT) return fail(id, "No green Vercel preview after 30 minutes. Nothing was merged.");
        return unlock({ previewUrl: v.url ?? st.previewUrl });
      }
      const pr = await gh<{ state: string; merged: boolean; mergeable: boolean | null; head: { sha: string } }>(post.site, `/pulls/${st.prNumber}`);
      if (pr.head.sha !== st.headSha) return fail(id, "The PR branch was changed by someone else. Nothing was merged.");
      if (pr.state !== "open" && !pr.merged) return fail(id, "The PR was closed. Nothing was merged.");
      if (pr.mergeable === false) return fail(id, "The PR has a merge conflict. Nothing was merged.");
      if (pr.mergeable === null && !pr.merged) return unlock({}, "Waiting for GitHub to check the PR");
      const merged = pr.merged
        ? await gh<{ merge_commit_sha: string }>(post.site, `/pulls/${st.prNumber}`).then((x) => ({ sha: x.merge_commit_sha }))
        : await gh<{ sha: string }>(post.site, `/pulls/${st.prNumber}/merge`, { method: "PUT", body: { merge_method: "merge", sha: st.headSha } });
      return unlock({ phase: "production", mergeSha: merged.sha, previewUrl: v.url ?? st.previewUrl, phaseStartedAt: now() }, `Preview green — PR #${st.prNumber} merged`);
    }
    if (st.phase === "production") {
      const v = await vercelStatus(post.site, st.mergeSha!);
      if (v.state === "failure")
        return fail(id, `The production deploy failed${v.description ? `: ${v.description}` : ""}. The previous version of the site stays live, so the post is not visible yet.`);
      if (v.state !== "success") {
        if (since > PRODUCTION_TIMEOUT) return fail(id, "No green production deploy after 30 minutes.");
        return unlock();
      }
      return unlock({ phase: "verify", phaseStartedAt: now() }, "Production deploy green");
    }
    if (st.phase === "verify") {
      const url = postUrl(post.site, post.slug, "en", post.kind);
      const res = await fetch(url, { method: "GET", cache: "no-store", redirect: "manual" }).catch(() => null);
      if (!res || res.status !== 200) {
        if (since > VERIFY_TIMEOUT) return fail(id, `${url} does not answer 200 (got ${res?.status ?? "no response"}).`);
        return unlock();
      }
      let ping = "IndexNow skipped";
      try {
        ping = `IndexNow ${await indexNow(post)}`;
      } catch {}
      if (st.branch) await gh(post.site, `/git/refs/heads/${st.branch}`, { method: "DELETE" }).catch(() => undefined);
      return unlock({ phase: "done" }, `Live at ${url} · ${ping}`, { status: "live", liveUrl: url, error: null });
    }
    return unlock();
  } catch (e) {
    // network or API hiccup: keep the phase, try again on the next tick (fail only after the phase timeout)
    if (since > PREVIEW_TIMEOUT + PRODUCTION_TIMEOUT) return fail(id, (e as Error).message);
    return unlock({}, `Retrying: ${(e as Error).message}`);
  }
}

/** cron + open Studio pages: start due scheduled posts, advance publishing ones */
export async function tick() {
  const posts = await listPosts();
  const done: { id: string; status: string }[] = [];
  for (const p of posts) {
    try {
      if (p.status === "scheduled" && p.scheduledAt && p.scheduledAt <= now()) {
        const r = await startPublish(p.id, "schedule");
        done.push({ id: p.id, status: r?.status ?? "?" });
      } else if (p.status === "publishing") {
        const r = await advance(p.id);
        done.push({ id: p.id, status: r?.status ?? "?" });
      }
    } catch (e) {
      await fail(p.id, (e as Error).message).catch(() => undefined);
      done.push({ id: p.id, status: "needs_attention" });
    }
  }
  return done;
}
