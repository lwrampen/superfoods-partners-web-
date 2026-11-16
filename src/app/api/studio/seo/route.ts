import { requireUser } from "@/lib/studio/auth";
import { getPost, updatePost } from "@/lib/studio/store";
import { NotConfigured, optimise } from "@/lib/studio/seo";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Keyword research + the English SEO suggestion. Keywords and volumes are stored on the post right away; the
// suggestion is stored until the writer accepts or dismisses it.
export async function POST(req: Request) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  const post = id ? await getPost(id) : null;
  if (!post) return Response.json({ error: "Post not found" }, { status: 404 });
  try {
    const s = await optimise(post);
    const saved = await updatePost(post.id, (p) => ({ ...p, seo: s.seo, suggestion: { slug: s.slug, copy: s.copy, at: new Date().toISOString() } }));
    return Response.json({ post: saved });
  } catch (e) {
    if (e instanceof NotConfigured) return Response.json({ error: e.message, notConfigured: true }, { status: 503 });
    return Response.json({ error: (e as Error).message }, { status: 502 });
  }
}
