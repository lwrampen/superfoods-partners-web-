// Blog Studio — storage for drafts and uploaded images.
//
// Production: Vercel Blob (BLOB_READ_WRITE_TOKEN), private by default — every read goes through this server, so the
// drafts and photos are only visible to signed-in writers. Set STUDIO_BLOB_ACCESS=public only if the store was created
// as a public store. Local testing (no token, not on Vercel): plain files under .studio-data/.
import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { get, head, list, put, del, BlobNotFoundError, BlobPreconditionFailedError } from "@vercel/blob";
import type { StudioPost } from "./types";
import { devMocks } from "./env";

const POSTS = "studio/posts/";
const MEDIA = "studio/media/";
const LOCAL = path.join(process.cwd(), ".studio-data");
const access = () => (process.env.STUDIO_BLOB_ACCESS === "public" ? "public" : "private") as "public" | "private";
const blobMode = () => !!process.env.BLOB_READ_WRITE_TOKEN;

export class StorageNotConfigured extends Error {
  constructor() {
    super("Storage is not configured yet (BLOB_READ_WRITE_TOKEN).");
  }
}
function ensure() {
  if (!blobMode() && !devMocks()) throw new StorageNotConfigured();
}

export const newId = () => `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}`;
const safeId = (id: string) => /^[a-z0-9-]{6,40}$/.test(id);

async function streamToBuffer(s: ReadableStream<Uint8Array>) {
  return Buffer.from(await new Response(s).arrayBuffer());
}

// withEtag: also return the stored ETag for a conditional write. It comes from head() (the Blob API), not from the
// download response: larger JSON files are served compressed and then carry a different (weak) ETag, which never
// matches on put({ ifMatch }) — every save of a longer post failed as "changed by someone else". head() runs before
// get(), so a write in between leaves us with the older ETag and the conditional write retries instead of
// overwriting.
async function readRaw(pathname: string, withEtag = false): Promise<{ body: Buffer; etag?: string; contentType?: string } | null> {
  ensure();
  if (blobMode()) {
    let etag: string | undefined;
    if (withEtag) {
      try {
        etag = (await head(pathname)).etag;
      } catch (e) {
        if (e instanceof BlobNotFoundError) return null;
        throw e;
      }
    }
    const r = await get(pathname, { access: access(), useCache: false });
    if (!r || r.statusCode !== 200) return null;
    return { body: await streamToBuffer(r.stream), etag, contentType: r.blob.contentType };
  }
  try {
    return { body: await fs.readFile(path.join(LOCAL, pathname)) };
  } catch {
    return null;
  }
}

async function writeRaw(pathname: string, body: Buffer | string, contentType: string, ifMatch?: string) {
  ensure();
  if (blobMode()) {
    await put(pathname, body, { access: access(), contentType, addRandomSuffix: false, allowOverwrite: true, cacheControlMaxAge: 60, ...(ifMatch ? { ifMatch } : {}) });
    return;
  }
  const f = path.join(LOCAL, pathname);
  await fs.mkdir(path.dirname(f), { recursive: true });
  const tmp = `${f}.${randomBytes(4).toString("hex")}.tmp`;
  await fs.writeFile(tmp, body);
  await fs.rename(tmp, f); // atomic: readers never see a half-written file
}

// ---------- posts ----------

export async function getPost(id: string): Promise<StudioPost | null> {
  if (!safeId(id)) return null;
  const r = await readRaw(`${POSTS}${id}.json`);
  return r ? (JSON.parse(r.body.toString("utf8")) as StudioPost) : null;
}

export async function savePost(post: StudioPost) {
  await writeRaw(`${POSTS}${post.id}.json`, JSON.stringify(post, null, 1), "application/json");
  return post;
}

// updates of one post run one after the other within this server instance (Blob's ETag check covers the rest)
const queues = new Map<string, Promise<unknown>>();
function serial<T>(id: string, job: () => Promise<T>): Promise<T> {
  const prev = queues.get(id) ?? Promise.resolve();
  const next = prev.then(job, job);
  const tail = next.catch(() => undefined);
  queues.set(id, tail);
  tail.then(() => queues.get(id) === tail && queues.delete(id));
  return next;
}

/** read-modify-write with optimistic concurrency on Blob (retries when another request saved in between) */
export function updatePost(id: string, fn: (p: StudioPost) => StudioPost | Promise<StudioPost>): Promise<StudioPost | null> {
  return serial(id, () => updateOnce(id, fn));
}
async function updateOnce(id: string, fn: (p: StudioPost) => StudioPost | Promise<StudioPost>): Promise<StudioPost | null> {
  for (let attempt = 0; attempt < 4; attempt++) {
    if (!safeId(id)) return null;
    const r = await readRaw(`${POSTS}${id}.json`, true);
    if (!r) return null;
    const next = await fn(JSON.parse(r.body.toString("utf8")) as StudioPost);
    next.updatedAt = new Date().toISOString();
    try {
      await writeRaw(`${POSTS}${id}.json`, JSON.stringify(next, null, 1), "application/json", r.etag);
      return next;
    } catch (e) {
      if (e instanceof BlobPreconditionFailedError) continue;
      throw e;
    }
  }
  throw new Error("The post was changed by someone else at the same time. Reload and try again.");
}

export async function listPosts(): Promise<StudioPost[]> {
  ensure();
  let names: string[] = [];
  if (blobMode()) {
    let cursor: string | undefined;
    do {
      const r = await list({ prefix: POSTS, cursor, limit: 1000 });
      names.push(...r.blobs.map((b) => b.pathname));
      cursor = r.hasMore ? r.cursor : undefined;
    } while (cursor);
  } else {
    try {
      names = (await fs.readdir(path.join(LOCAL, POSTS))).map((f) => POSTS + f);
    } catch {
      names = [];
    }
  }
  const posts = await Promise.all(
    names.filter((n) => n.endsWith(".json")).map(async (n) => {
      const r = await readRaw(n);
      return r ? (JSON.parse(r.body.toString("utf8")) as StudioPost) : null;
    }),
  );
  return posts.filter((p): p is StudioPost => !!p).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function deletePost(id: string) {
  if (!safeId(id)) return;
  ensure();
  if (blobMode()) {
    const media = await list({ prefix: `${MEDIA}${id}/` });
    await del([`${POSTS}${id}.json`, ...media.blobs.map((b) => b.pathname)]).catch(() => undefined);
    return;
  }
  await fs.rm(path.join(LOCAL, POSTS, `${id}.json`), { force: true });
  await fs.rm(path.join(LOCAL, MEDIA, id), { recursive: true, force: true });
}

// ---------- media ----------

export const mediaUrl = (pathname: string) => `/api/studio/media/${pathname.slice(MEDIA.length)}`;
export const mediaPathFromUrl = (url: string) => (url.startsWith("/api/studio/media/") ? MEDIA + url.slice("/api/studio/media/".length) : null);

export async function putMedia(postId: string, name: string, body: Buffer, contentType: string) {
  const pathname = `${MEDIA}${postId}/${name}`;
  await writeRaw(pathname, body, contentType);
  return mediaUrl(pathname);
}

export async function readMedia(pathname: string) {
  if (!pathname.startsWith(MEDIA) || pathname.includes("..")) return null;
  const r = await readRaw(pathname);
  if (!r) return null;
  const ext = pathname.split(".").pop()?.toLowerCase();
  const type = r.contentType ?? (ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : "image/jpeg");
  return { body: r.body, contentType: type };
}
