"use client";
import Link from "next/link";
import { api } from "./api";

export function Shell({ user, children, active }: { user: string; children: React.ReactNode; active?: "overview" | "new" | "post" }) {
  const signOut = async () => {
    await api("/api/studio/logout", { method: "POST" }).catch(() => undefined);
    window.location.href = "/studio/login";
  };
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-[#e3e3da] bg-offwhite/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-[1320px] items-center gap-2 px-4 sm:gap-4 sm:px-6">
          <Link href="/studio" className="flex items-baseline gap-2">
            <span className="display whitespace-nowrap text-[20px] leading-none text-forest sm:text-[22px]">Blog Studio</span>
            <span className="mono hidden text-[10px] uppercase text-stone sm:inline">SFP · PMP</span>
          </Link>
          <nav className="flex items-center gap-0.5 sm:ml-2 sm:gap-1">
            <Link href="/studio" className={`mono whitespace-nowrap rounded-lg px-2 py-1.5 sm:px-3 text-[11px] uppercase ${active === "overview" ? "bg-forest text-offwhite" : "text-stone hover:text-forest"}`}>
              Overview
            </Link>
            <Link href="/studio/new" className={`mono whitespace-nowrap rounded-lg px-2 py-1.5 sm:px-3 text-[11px] uppercase ${active === "new" ? "bg-forest text-offwhite" : "text-stone hover:text-forest"}`}>
              + New<span className="hidden sm:inline"> post</span>
            </Link>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-stone sm:inline">
              Signed in as <b className="font-semibold text-forest">{user}</b>
            </span>
            <button onClick={signOut} className="mono whitespace-nowrap text-[11px] uppercase text-stone underline-offset-4 hover:text-forest hover:underline">
              Sign out
            </button>
          </div>
        </div>
      </header>
      {children}
    </div>
  );
}
