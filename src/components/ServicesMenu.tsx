"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { TinArt, PouchArt } from "@/components/PackagingArt";

export type ServiceLink = { name: string; href: string };
export type ServicesCopy = {
  label: string;
  blending: { title: string; desc: string; href: string; items: ServiceLink[]; more: string };
  packaging: { title: string; desc: string; href: string; more: string };
};

// Desktop "Services" mega-menu: blending (with the blend pages) and packaging.
// Same open/close behaviour as ProductsMenu; copy arrives pre-translated.
export function ServicesMenu({ copy }: { copy: ServicesCopy }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);

  const openNow = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const closeSoon = () => {
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };
  const { blending, packaging } = copy;

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-stone transition-colors hover:text-green"
      >
        {copy.label}
        <svg
          width="10"
          height="10"
          viewBox="0 0 10 10"
          className={`mt-px transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          aria-hidden
        >
          <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <div
        className={`absolute left-1/2 top-[calc(100%+0.9rem)] z-50 w-[min(88vw,620px)] -translate-x-1/2 transition-all duration-150 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-stone/15 bg-oat shadow-[0_30px_80px_-40px_rgba(20,39,27,0.5)] sm:grid-cols-[1.15fr_1fr]">
          {/* blending */}
          <div className="p-7">
            <Link href={blending.href} className="group block">
              <span className="display text-lg text-green">{blending.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-stone">{blending.desc}</span>
            </Link>
            <ul className="mt-4 flex flex-col gap-0.5 border-t border-stone/10 pt-3">
              {blending.items.map((b) => (
                <li key={b.href}>
                  <Link
                    href={b.href}
                    className="group flex items-center justify-between gap-2 rounded-md py-1 text-sm text-stone transition-colors hover:text-green"
                  >
                    {b.name}
                    <span className="text-stone/30 opacity-0 transition-opacity group-hover:opacity-100">→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link href={blending.href} className="mono mt-4 inline-block text-[11px] uppercase tracking-wide text-green">
              {blending.more} →
            </Link>
          </div>
          {/* packaging */}
          <Link href={packaging.href} className="group flex flex-col justify-between bg-sand p-7 transition-colors hover:bg-sand/70">
            <span>
              <span className="display block text-lg text-green">{packaging.title}</span>
              <span className="mt-1 block text-sm leading-relaxed text-stone">{packaging.desc}</span>
            </span>
            <span className="mt-5 flex gap-2">
              <TinArt className="h-16 w-14" />
              <PouchArt className="h-16 w-14" />
            </span>
            <span className="mono mt-4 inline-block text-[11px] uppercase tracking-wide text-green">{packaging.more} →</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
