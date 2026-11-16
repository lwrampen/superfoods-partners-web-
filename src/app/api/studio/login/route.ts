import { authConfigured, checkCode, clientIp, noteFailure, rateLimited, sessionCookieHeader, sessionValue } from "@/lib/studio/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!authConfigured()) return Response.json({ error: "Sign-in is not configured yet (STUDIO_USERS + STUDIO_SECRET)." }, { status: 503 });
  const ip = clientIp(req);
  if (rateLimited(ip)) return Response.json({ error: "Too many attempts. Wait 15 minutes and try again." }, { status: 429 });
  const body = (await req.json().catch(() => ({}))) as { code?: string };
  const code = String(body.code ?? "").slice(0, 200);
  const user = code ? checkCode(code) : null;
  if (!user) {
    noteFailure(ip);
    await new Promise((r) => setTimeout(r, 700)); // slow down guessing
    return Response.json({ error: "That code is not right." }, { status: 401 });
  }
  return Response.json({ ok: true, user }, { headers: { "Set-Cookie": sessionCookieHeader(sessionValue(user)), "Cache-Control": "no-store" } });
}
