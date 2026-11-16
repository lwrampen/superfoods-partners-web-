import { requireUser } from "@/lib/studio/auth";
import { getPost, updatePost } from "@/lib/studio/store";
import { NotConfigured, translate } from "@/lib/studio/seo";
import { copyHash } from "@/lib/studio/blocks";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// One language per request (the Studio runs them in parallel). The translation is saved on the post and stays
// editable in its language tab.
export async function POST(req: Request) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const { id, locale } = (await req.json().catch(() => ({}))) as { id?: string; locale?: string };
  const post = id ? await getPost(id) : null;
  if (!post || !locale) return Response.json({ error: "Post not found" }, { status: 404 });
  try {
    const copy = { ...(await translate(post, locale)), sourceHash: copyHash(post.locales.en) };
    const saved = await updatePost(post.id, (p) => ({ ...p, locales: { ...p.locales, [locale]: copy } }));
    return Response.json({ post: saved, locale, copy });
  } catch (e) {
    if (e instanceof NotConfigured) return Response.json({ error: e.message, notConfigured: true }, { status: 503 });
    return Response.json({ error: (e as Error).message }, { status: 502 });
  }
}
