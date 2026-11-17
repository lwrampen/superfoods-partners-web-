"use client";
// tiny fetch helper for the Studio's own API
export async function api<T = Record<string, unknown>>(url: string, init?: { method?: string; body?: unknown; form?: FormData }): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? (init?.body || init?.form ? "POST" : "GET"),
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    body: init?.form ?? (init?.body ? JSON.stringify(init.body) : undefined),
    cache: "no-store",
  });
  const j = (await res.json().catch(() => ({}))) as T & { error?: string; notConfigured?: boolean };
  if (res.status === 401 && typeof window !== "undefined" && !url.includes("/login")) window.location.href = "/studio/login";
  if (!res.ok) throw Object.assign(new Error(j.error ?? `Error ${res.status}`), { notConfigured: !!j.notConfigured, status: res.status });
  return j;
}
