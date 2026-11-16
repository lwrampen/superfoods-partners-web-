import { tick } from "@/lib/studio/publish";
import { githubConfigured } from "@/lib/studio/github";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

// Vercel cron (vercel.json, hourly): publishes scheduled posts that are due and advances running publishes.
// Vercel sends "Authorization: Bearer $CRON_SECRET" when CRON_SECRET is set on the project.
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return Response.json({ error: "CRON_SECRET is not configured yet." }, { status: 503 });
  if (req.headers.get("authorization") !== `Bearer ${secret}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  if (!githubConfigured()) return Response.json({ error: "STUDIO_GITHUB_TOKEN is not configured yet." }, { status: 503 });
  // advance publishing posts a few times within this run so a publish can finish without a writer online
  const results = [];
  const until = Date.now() + 240_000;
  do {
    const done = await tick();
    results.push(...done);
    if (!done.length) break;
    await new Promise((r) => setTimeout(r, 20_000));
  } while (Date.now() < until);
  return Response.json({ ok: true, steps: results.length });
}
