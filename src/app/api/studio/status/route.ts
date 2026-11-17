import { requireUser } from "@/lib/studio/auth";
import { integrations } from "@/lib/studio/env";

export const dynamic = "force-dynamic";

export async function GET() {
  const a = await requireUser();
  if ("response" in a) return a.response;
  return Response.json({ user: a.user, integrations: integrations() });
}
