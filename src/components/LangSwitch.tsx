"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

// Switches locale while keeping the current path (drives visible hreflang too).
export function LangSwitch({ className = "" }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname(); // locale-less
  return (
    <div className={`mono flex items-center gap-1.5 text-[11px] uppercase ${className}`}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-stone/25">/</span>}
          <Link
            href={pathname}
            locale={l}
            aria-current={l === locale ? "true" : undefined}
            className={l === locale ? "text-green" : "text-stone/45 transition-colors hover:text-green"}
          >
            {l}
          </Link>
        </span>
      ))}
    </div>
  );
}
