import { defineRouting } from "next-intl/routing";

// Phase 1 ships English (default, no prefix) + German. Additional locales
// (es, fr, pl, zh-Hant) are added here once their translations are ready —
// we never publish an untranslated locale.
export const routing = defineRouting({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "as-needed", // en at "/", others at "/de/…"
});

export type AppLocale = (typeof routing.locales)[number];
