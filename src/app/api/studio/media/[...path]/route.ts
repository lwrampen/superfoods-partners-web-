import { currentUser } from "@/lib/studio/auth";
import { readMedia } from "@/lib/studio/store";

export const dynamic = "force-dynamic";

// Studio images (private Blob store) for signed-in writers only.
export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  if (!(await currentUser())) return new Response("Not signed in", { status: 401 });
  const { path } = await params;
  const r = await readMedia(`studio/media/${path.map(decodeURIComponent).join("/")}`).catch(() => null);
  if (!r) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(r.body), { headers: { "Content-Type": r.contentType, "Cache-Control": "private, max-age=86400, immutable" } });
}
