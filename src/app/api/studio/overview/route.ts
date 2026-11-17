import { requireUser } from "@/lib/studio/auth";
import { listPosts, StorageNotConfigured } from "@/lib/studio/store";
import { overview } from "@/lib/studio/overview";
import type { StudioPost } from "@/lib/studio/types";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  const a = await requireUser();
  if ("response" in a) return a.response;
  let studio: StudioPost[] = [];
  const warnings: string[] = [];
  try {
    studio = await listPosts();
  } catch (e) {
    warnings.push(e instanceof StorageNotConfigured ? e.message : `Storage: ${(e as Error).message}`);
  }
  const o = await overview(studio);
  return Response.json({ ...o, warnings: [...warnings, ...o.warnings] });
}
