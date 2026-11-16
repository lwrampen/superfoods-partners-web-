import { requireUser } from "@/lib/studio/auth";
import { advance, startPublish } from "@/lib/studio/publish";
import { getPost } from "@/lib/studio/store";

export const dynamic = "force-dynamic";
export const maxDuration = 120;
type Ctx = { params: Promise<{ id: string }> };

// body: {} to publish now, { advance: true } to check on a publish that is running
export async function POST(req: Request, { params }: Ctx) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { advance?: boolean };
  try {
    const current = await getPost(id);
    if (!current) return Response.json({ error: "Not found" }, { status: 404 });
    const post = body.advance || current.status === "publishing" ? await advance(id) : await startPublish(id, a.user);
    return Response.json({ post });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
