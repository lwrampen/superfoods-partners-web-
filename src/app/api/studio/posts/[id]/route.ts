import { requireUser } from "@/lib/studio/auth";
import { deletePost, getPost, updatePost } from "@/lib/studio/store";
import { SITES, slugify, videoFromUrl } from "@/lib/studio/config";
import type { StudioPost } from "@/lib/studio/types";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const post = await getPost((await params).id);
  return post ? Response.json({ post }) : Response.json({ error: "Not found" }, { status: 404 });
}

// Editable fields only; status changes go through /schedule and /publish.
const EDITABLE = ["slug", "author", "category", "header", "gallery", "video", "products", "editorDoc", "locales", "seo", "suggestion", "site"] as const;

export async function PUT(req: Request, { params }: Ctx) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const { id } = await params;
  const patch = (await req.json().catch(() => null)) as Partial<StudioPost> | null;
  if (!patch) return Response.json({ error: "Bad request" }, { status: 400 });
  try {
    const post = await updatePost(id, (p) => {
      if (p.status === "publishing") throw new Error("This post is being published right now. Wait until it is live.");
      const next = { ...p } as StudioPost;
      for (const k of EDITABLE) if (k in patch) (next as Record<string, unknown>)[k] = patch[k];
      if (next.site !== p.site && (p.publishedAt || !SITES[next.site])) next.site = p.site; // the site is fixed once published
      if (p.publishedAt) next.slug = p.slug; // never change a published URL
      else next.slug = slugify(next.slug ?? "");
      if (next.video) {
        const v = videoFromUrl(next.video.url);
        next.video = v ? { ...next.video, ...v } : null;
      }
      if (p.status === "needs_attention" && !p.publish?.mergeSha) next.status = "draft"; // fixing a failed publish
      return next;
    });
    return post ? Response.json({ post }) : Response.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 409 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });
  if (post.status === "publishing" || post.status === "live") return Response.json({ error: "Live posts cannot be deleted here." }, { status: 409 });
  await deletePost(id);
  return Response.json({ ok: true });
}
