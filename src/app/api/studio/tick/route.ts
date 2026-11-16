import { requireUser } from "@/lib/studio/auth";
import { tick } from "@/lib/studio/publish";
import { githubConfigured } from "@/lib/studio/github";

export const dynamic = "force-dynamic";
export const maxDuration = 120;

// Called by open Studio pages every ~20 s: publishes due scheduled posts and moves running publishes forward.
export async function POST() {
  const a = await requireUser();
  if ("response" in a) return a.response;
  if (!githubConfigured()) return Response.json({ done: [] });
  try {
    return Response.json({ done: await tick() });
  } catch (e) {
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
