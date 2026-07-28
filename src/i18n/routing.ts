import { defineRouting } from "next-intl/routing";

// English (default, no prefix) + translated locales. Additional locales
// (fr, pl, zh-Hant) are added here once their translations are ready —
// we never publish an untranslated locale.
export const routing = defineRouting({
  locales: ["en", "de", "es"],
  defaultLocale: "en",
  localePrefix: "as-needed", // en at "/", others at "/de/…", "/es/…"
});

export type AppLocale = (typeof routing.locales)[number];
