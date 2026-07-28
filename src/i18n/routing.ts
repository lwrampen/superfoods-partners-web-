import { defineRouting } from "next-intl/routing";

// English (default, no prefix) + translated locales. Additional locales
// (pl, zh-Hant) are added here once their translations are ready —
// we never publish an untranslated locale.
export const routing = defineRouting({
  locales: ["en", "de", "es", "fr"],
  defaultLocale: "en",
  localePrefix: "as-needed", // en at "/", others at "/de/…", "/es/…", "/fr/…"
});

export type AppLocale = (typeof routing.locales)[number];
