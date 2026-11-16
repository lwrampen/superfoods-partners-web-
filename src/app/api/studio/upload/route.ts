import { requireUser } from "@/lib/studio/auth";
import { getPost, putMedia, StorageNotConfigured } from "@/lib/studio/store";
import { randomBytes } from "node:crypto";

export const dynamic = "force-dynamic";

const MAX = 4.4 * 1024 * 1024; // after the browser resized it (Vercel request limit 4.5 MB)

// multipart: postId, file (already resized in the browser to ≤ 2400 px webp/jpeg)
export async function POST(req: Request) {
  const a = await requireUser();
  if ("response" in a) return a.response;
  const form = await req.formData().catch(() => null);
  const postId = String(form?.get("postId") ?? "");
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file" }, { status: 400 });
  if (!/^image\/(webp|jpeg|png)$/.test(file.type)) return Response.json({ error: "Only JPEG, PNG or WebP images." }, { status: 415 });
  if (file.size > MAX) return Response.json({ error: "The image is still too large after resizing. Try a smaller photo." }, { status: 413 });
  try {
    if (!(await getPost(postId))) return Response.json({ error: "Post not found" }, { status: 404 });
    const ext = file.type === "image/webp" ? "webp" : file.type === "image/png" ? "png" : "jpg";
    const base = String(form?.get("name") ?? "photo")
      .toLowerCase()
      .replace(/\.[a-z0-9]+$/, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "photo";
    const src = await putMedia(postId, `${base}-${randomBytes(3).toString("hex")}.${ext}`, Buffer.from(await file.arrayBuffer()), file.type);
    return Response.json({ src });
  } catch (e) {
    if (e instanceof StorageNotConfigured) return Response.json({ error: e.message, notConfigured: true }, { status: 503 });
    return Response.json({ error: (e as Error).message }, { status: 500 });
  }
}
