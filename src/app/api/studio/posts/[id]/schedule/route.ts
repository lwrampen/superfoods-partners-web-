import { requireUser } from "@/lib/studio/auth";
import { updatePost } from "@/lib/studio/store";
import { validateForPublish } from "@/lib/studio/export";
import { githubConfigured } from "@/lib/studio/github";

export const dynamic = "force-dynamic";
type Ctx = { params: Promise<{ id: string }> };

// body: { at: ISO instant } to schedule, { cancel: true } to go back to draft
export async function POST(req: Request, { params }: Ctx) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { at?: string; cancel?: boolean };
  try {
    const post = await updatePost(id, (p) => {
      if (p.status === "publishing" || p.status === "live") throw new Error("This post is already published.");
      if (body.cancel) return { ...p, status: "draft", scheduledAt: null };
      const at = body.at ? new Date(body.at) : null;
      if (!at || isNaN(at.getTime())) throw new Error("Pick a date and time.");
      if (at.getTime() < Date.now() - 60_000) throw new Error("That time is in the past.");
      if (!githubConfigured()) throw new Error("Publishing is not configured yet (STUDIO_GITHUB_TOKEN).");
      const issues = validateForPublish(p);
      if (issues.length) throw new Error(issues.map((i) => i.message).join(" "));
      return { ...p, status: "scheduled", scheduledAt: at.toISOString(), error: null };
    });
    return post ? Response.json({ post }) : Response.json({ error: "Not found" }, { status: 404 });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 400 });
  }
}
