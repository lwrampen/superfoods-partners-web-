"use client";
import { useState } from "react";
import { api } from "./api";

export function LoginForm({ configured }: { configured: boolean }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(configured ? null : "Sign-in is not configured yet. Leonard adds STUDIO_USERS and STUDIO_SECRET in Vercel.");
  const [busy, setBusy] = useState(false);
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/studio/login", { body: { code } });
      window.location.href = "/studio";
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };
  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <form onSubmit={submit} className="card w-full max-w-[400px] p-8 shadow-[0_30px_60px_-40px_rgba(22,36,15,.45)] sm:p-10">
        <p className="eyebrow">Superfoods Partners · Pure Matcha Partners</p>
        <h1 className="display mt-3 text-[44px] leading-[0.95] text-forest">Blog Studio</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-stone">Write and publish posts for both websites. Sign in with your personal code.</p>
        <label className="mt-7 block">
          <span className="eyebrow">Your code</span>
          <input
            type="password"
            autoComplete="current-password"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="field mono mt-2 text-lg tracking-[0.3em]"
            aria-label="Your code"
            disabled={!configured}
          />
        </label>
        {error ? <p className="mt-4 rounded-lg bg-[#fbeee6] px-3 py-2 text-sm text-[#8a3a12]" role="alert">{error}</p> : null}
        <button className="btn btn-primary mt-6 w-full" disabled={busy || !code || !configured}>
          {busy ? "Checking…" : "Sign in"}
        </button>
        <p className="mt-6 text-xs leading-relaxed text-stone/80">No code yet? Ask Leonard. Your session stays signed in for 30 days on this device.</p>
      </form>
    </main>
  );
}
