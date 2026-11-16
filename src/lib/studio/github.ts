// Minimal GitHub REST client for the publish pipeline and the overview (STUDIO_GITHUB_TOKEN: a fine-grained PAT with
// Contents + Pull requests read/write on both site repos).
import { SITES } from "./config";
import type { SiteId } from "./types";

export class GitHubError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export const githubConfigured = () => !!process.env.STUDIO_GITHUB_TOKEN?.trim();

export async function gh<T = unknown>(site: SiteId, pathAndQuery: string, init: { method?: string; body?: unknown; raw?: boolean } = {}): Promise<T> {
  const { owner, name } = SITES[site].repo;
  const url = pathAndQuery.startsWith("https://") ? pathAndQuery : `https://api.github.com/repos/${owner}/${name}${pathAndQuery}`;
  const res = await fetch(url, {
    method: init.method ?? "GET",
    headers: {
      Authorization: `Bearer ${process.env.STUDIO_GITHUB_TOKEN ?? ""}`,
      Accept: init.raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "blog-studio",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
    },
    body: init.body ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    let msg = res.statusText;
    try {
      const j = (await res.json()) as { message?: string };
      msg = j.message ?? msg;
    } catch {}
    throw new GitHubError(res.status, `GitHub ${res.status}: ${msg}`);
  }
  if (res.status === 204) return undefined as T;
  return (init.raw ? await res.text() : await res.json()) as T;
}

export async function fileExists(site: SiteId, path: string, ref = SITES[site].repo.branch) {
  try {
    await gh(site, `/contents/${path}?ref=${encodeURIComponent(ref)}`);
    return true;
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return false;
    throw e;
  }
}

export async function readText(site: SiteId, path: string, ref = SITES[site].repo.branch): Promise<string | null> {
  try {
    return await gh<string>(site, `/contents/${path}?ref=${encodeURIComponent(ref)}`, { raw: true });
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return null;
    throw e;
  }
}

export type FileChange = { path: string; content: Buffer | string };

/** one commit with all files on a new branch from the default branch; returns the commit sha */
export async function commitToNewBranch(site: SiteId, branch: string, message: string, files: FileChange[]) {
  const base = SITES[site].repo.branch;
  const ref = await gh<{ object: { sha: string } }>(site, `/git/ref/heads/${base}`);
  const baseCommit = await gh<{ tree: { sha: string } }>(site, `/git/commits/${ref.object.sha}`);
  const tree = [];
  for (const f of files) {
    const isText = typeof f.content === "string";
    const blob = await gh<{ sha: string }>(site, "/git/blobs", {
      method: "POST",
      body: isText ? { content: f.content, encoding: "utf-8" } : { content: (f.content as Buffer).toString("base64"), encoding: "base64" },
    });
    tree.push({ path: f.path, mode: "100644", type: "blob", sha: blob.sha });
  }
  const newTree = await gh<{ sha: string }>(site, "/git/trees", { method: "POST", body: { base_tree: baseCommit.tree.sha, tree } });
  const commit = await gh<{ sha: string }>(site, "/git/commits", { method: "POST", body: { message, tree: newTree.sha, parents: [ref.object.sha] } });
  await gh(site, "/git/refs", { method: "POST", body: { ref: `refs/heads/${branch}`, sha: commit.sha } });
  return commit.sha;
}

export async function branchExists(site: SiteId, branch: string) {
  try {
    await gh(site, `/git/ref/heads/${branch}`);
    return true;
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return false;
    throw e;
  }
}

export type VercelState = { state: "pending" | "success" | "failure" | "none"; description?: string; url?: string; others?: string };

/** the Vercel commit status on a sha (Vercel's GitHub integration reports it as context "Vercel") */
export async function vercelStatus(site: SiteId, sha: string): Promise<VercelState> {
  const s = await gh<{ statuses: { context: string; state: string; description?: string; target_url?: string }[] }>(site, `/commits/${sha}/status`);
  const v = s.statuses.filter((x) => /^vercel/i.test(x.context));
  const failedOther = s.statuses.filter((x) => !/^vercel/i.test(x.context) && (x.state === "failure" || x.state === "error"));
  if (!v.length) return { state: "none" };
  const bad = v.find((x) => x.state === "failure" || x.state === "error");
  if (bad) return { state: "failure", description: bad.description, url: bad.target_url };
  if (v.every((x) => x.state === "success"))
    return failedOther.length
      ? { state: "failure", description: `Check failed: ${failedOther.map((x) => x.context).join(", ")}`, url: failedOther[0].target_url }
      : { state: "success", url: v[0].target_url };
  return { state: "pending", description: v[0].description, url: v[0].target_url };
}
