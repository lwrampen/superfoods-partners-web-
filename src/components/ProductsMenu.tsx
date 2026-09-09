"use client";

import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";

export type MenuProduct = { slug: string; name: string };
export type MenuGroup = {
  id: string;
  name: string;
  house: boolean;
  accent?: string;
  items: MenuProduct[];
};
export type MenuCopy = {
  specialist: string;
  house: string;
  byOrigin: string;
  allOrigins: string;
  allProducts: string;
  originsNote: string;
};

// Desktop "Products" mega-menu: the catalogue by label, with an origins rail.
// Copy arrives pre-translated as props (same pattern as MobileMenu) so this
// stays a purely presentational client component.
export function ProductsMenu({
  label,
  groups,
  copy,
}: {
  label: string;
  groups: MenuGroup[];
  copy: MenuCopy;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const pathname = usePathname();

  // Close whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Escape + click-outside close.
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

  return (
    <div ref={wrapRef} className="relative" onMouseEnter={openNow} onMouseLeave={closeSoon}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 text-sm text-stone transition-colors hover:text-green"
      >
        {label}
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
        className={`absolute left-0 top-[calc(100%+0.9rem)] z-50 w-[min(88vw,720px)] transition-all duration-150 ${
          open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-stone/15 bg-oat shadow-[0_30px_80px_-40px_rgba(20,39,27,0.5)] sm:grid-cols-[1.7fr_1fr]">
          {/* products, grouped by label */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-7 p-7">
            {groups.map((g) => (
              <div key={g.id}>
                <div className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: g.house ? "#16240F" : g.accent }}
                  />
                  <span className="display text-sm text-green">{g.name}</span>
                </div>
                <p className="mono mt-1 mb-3 text-[9px] uppercase tracking-widest text-stone/40">
                  {g.house ? copy.house : copy.specialist}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {g.items.map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/products/${p.slug}`}
                        className="group flex items-center justify-between gap-2 rounded-md py-1 text-sm capitalize text-stone transition-colors hover:text-green"
                      >
                        {p.name.toLowerCase()}
                        <span className="text-stone/30 opacity-0 transition-opacity group-hover:opacity-100">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* origins rail */}
          <div className="flex flex-col gap-3 border-t border-stone/10 bg-sand p-7 sm:border-l sm:border-t-0">
            <span className="mono text-[9px] uppercase tracking-widest text-stone/40">{copy.byOrigin}</span>
            <p className="text-sm leading-relaxed text-stone/80">{copy.originsNote}</p>
            <Link
              href="/origins"
              className="mono inline-flex items-center gap-1 text-[11px] uppercase tracking-wide text-green hover:underline"
            >
              {copy.allOrigins} →
            </Link>
            <Link
              href="/products"
              className="mono mt-auto inline-flex items-center justify-center gap-1 rounded-lg bg-green px-3 py-2.5 text-[11px] uppercase tracking-wide text-oat transition-opacity hover:opacity-90"
            >
              {copy.allProducts} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
