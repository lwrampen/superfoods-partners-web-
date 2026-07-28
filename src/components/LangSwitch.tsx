"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Native language names + a short label for the collapsed button.
const LANGS: Record<string, { native: string; short: string }> = {
  "en": { native: "English", short: "EN" },
  "de": { native: "Deutsch", short: "DE" },
  "es": { native: "Español", short: "ES" },
  "fr": { native: "Français", short: "FR" },
  "pl": { native: "Polski", short: "PL" },
  "zh-Hant": { native: "繁體中文", short: "繁中" },
};

const meta = (l: string) => LANGS[l] ?? { native: l, short: l.toUpperCase() };

// Switches locale while keeping the current path (drives visible hreflang too).
// variant="dropdown" (default) is a compact menu for the desktop nav;
// variant="inline" lists every language, used inside the mobile menu.
export function LangSwitch({
  className = "",
  variant = "dropdown",
}: {
  className?: string;
  variant?: "dropdown" | "inline";
}) {
  const locale = useLocale();
  const pathname = usePathname(); // locale-less

  if (variant === "inline") {
    return (
      <div className={`flex flex-col gap-1 ${className}`}>
        {routing.locales.map((l) => (
          <Link
            key={l}
            href={pathname}
            locale={l}
            aria-current={l === locale ? "true" : undefined}
            className={`text-sm ${l === locale ? "font-medium text-green" : "text-stone transition-colors hover:text-green"}`}
          >
            {meta(l).native}
          </Link>
        ))}
      </div>
    );
  }

  return <Dropdown className={className} locale={locale} pathname={pathname} />;
}

function Dropdown({ className, locale, pathname }: { className: string; locale: string; pathname: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change language"
        className="mono flex items-center gap-1.5 rounded-lg border border-stone/20 px-2.5 py-1.5 text-[11px] uppercase tracking-wide text-stone/70 transition-colors hover:border-stone/40 hover:text-green"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="opacity-70">
          <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2.5 12h19M12 2.5c2.6 2.6 4 6 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-6-4-9.5s1.4-6.9 4-9.5Z" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        {meta(locale).short}
        <svg width="9" height="9" viewBox="0 0 12 12" aria-hidden className={`transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-[9rem] overflow-hidden rounded-xl border border-stone/15 bg-oat py-1 shadow-[0_20px_50px_-24px_rgba(20,39,27,0.5)]"
        >
          {routing.locales.map((l) => (
            <Link
              key={l}
              href={pathname}
              locale={l}
              role="menuitem"
              onClick={() => setOpen(false)}
              aria-current={l === locale ? "true" : undefined}
              className={`flex items-center justify-between gap-4 px-3.5 py-2 text-sm transition-colors ${
                l === locale ? "text-green" : "text-stone hover:bg-sand hover:text-green"
              }`}
            >
              <span>{meta(l).native}</span>
              <span className="mono text-[10px] uppercase tracking-wide text-stone/40">{meta(l).short}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
