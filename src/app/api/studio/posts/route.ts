import { requireUser } from "@/lib/studio/auth";
import { listPosts, newId, savePost, StorageNotConfigured } from "@/lib/studio/store";
import { AUTHORS, SITES } from "@/lib/studio/config";
import type { SiteId, StudioPost } from "@/lib/studio/types";

export const dynamic = "force-dynamic";

const notConfigured = (e: unknown) => (e instanceof StorageNotConfigured ? Response.json({ error: e.message, notConfigured: true }, { status: 503 }) : null);

export async function GET() {
  const a = await requireUser();
  if ("response" in a) return a.response;
  try {
    return Response.json({ posts: await listPosts() });
  } catch (e) {
    return notConfigured(e) ?? Response.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const { site } = (await req.json().catch(() => ({}))) as { site?: SiteId };
  if (site !== "pmp" && site !== "sfp") return Response.json({ error: "Choose a website." }, { status: 400 });
  const now = new Date().toISOString();
  const post: StudioPost = {
    id: newId(),
    site,
    slug: "",
    status: "draft",
    author: AUTHORS.includes(a.user) ? a.user : a.user,
    createdAt: now,
    updatedAt: now,
    category: SITES[site].categories[0],
    header: null,
    gallery: [],
    video: null,
    products: [],
    locales: { en: { title: "", metaTitle: "", metaDescription: "", summary: "", lede: "", blocks: [], faqs: [] } },
    seo: null,
    publish: null,
  };
  try {
    await savePost(post);
    return Response.json({ post });
  } catch (e) {
    return notConfigured(e) ?? Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
