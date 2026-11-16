// Blog Studio — personal codes + signed session cookie.
//
// STUDIO_USERS = {"Leonard":"<sha256 hex of his code>","Judith":"…","Emily":"…"} (scripts/studio-user.mjs prints a
// line). STUDIO_SECRET signs the session cookie (HMAC-SHA256). The code itself is never stored anywhere; the server
// hashes what is typed and compares hashes in constant time.
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "studio_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function users(): Record<string, string> {
  try {
    const raw = JSON.parse(process.env.STUDIO_USERS ?? "{}");
    return raw && typeof raw === "object" ? (raw as Record<string, string>) : {};
  } catch {
    return {};
  }
}

const secret = () => process.env.STUDIO_SECRET ?? "";
export const authConfigured = () => !!secret() && Object.keys(users()).length > 0;

const b64u = (b: Buffer | string) => Buffer.from(b).toString("base64url");
const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

function safeEq(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** returns the user name for a code, or null */
export function checkCode(code: string): string | null {
  const hash = createHash("sha256").update(code.trim()).digest("hex");
  let found: string | null = null;
  for (const [name, h] of Object.entries(users())) if (typeof h === "string" && safeEq(h.toLowerCase(), hash)) found = name;
  return found;
}

export function sessionValue(name: string) {
  const payload = b64u(JSON.stringify({ u: name, exp: Math.floor(Date.now() / 1000) + MAX_AGE }));
  return `${payload}.${sign(payload)}`;
}

export function sessionCookieHeader(value: string, maxAge = MAX_AGE) {
  return `${SESSION_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function verifySession(value: string | undefined | null): string | null {
  if (!value || !secret()) return null;
  const [payload, sig] = value.split(".");
  if (!payload || !sig || !safeEq(sign(payload), sig)) return null;
  try {
    const { u, exp } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { u: string; exp: number };
    if (!u || exp < Date.now() / 1000) return null;
    return u in users() ? u : null; // removing a user from STUDIO_USERS ends their sessions
  } catch {
    return null;
  }
}

/** the signed-in user (server components + route handlers), or null */
export async function currentUser(): Promise<string | null> {
  const jar = await cookies();
  return verifySession(jar.get(SESSION_COOKIE)?.value);
}

// Light rate limiting for the login form: per IP, 8 failed attempts per 15 minutes (per server instance), plus a
// short delay on every failure.
const failures = new Map<string, number[]>();
const WINDOW = 15 * 60 * 1000;
export function rateLimited(ip: string) {
  const now = Date.now();
  const list = (failures.get(ip) ?? []).filter((t) => now - t < WINDOW);
  failures.set(ip, list);
  return list.length >= 8;
}
export function noteFailure(ip: string) {
  const list = failures.get(ip) ?? [];
  list.push(Date.now());
  failures.set(ip, list);
  if (failures.size > 5000) failures.clear();
}
export function clientIp(req: Request) {
  return (req.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
}

/** route-handler guard: returns the user or a 401 response */
export async function requireUser(): Promise<{ user: string } | { response: Response }> {
  const user = await currentUser();
  if (!user) return { response: Response.json({ error: "Not signed in" }, { status: 401 }) };
  return { user };
}
