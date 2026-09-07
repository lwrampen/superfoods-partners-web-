import { defineRouting } from "next-intl/routing";

// English (default, no prefix) + translated locales. We never publish an
// untranslated locale — each is added here only once its messages/<locale>.json
// and content.<locale>.ts bundle reach full key parity.
export const routing = defineRouting({
  locales: ["en", "de", "es", "fr", "pl", "zh-Hant"],
  defaultLocale: "en",
  localePrefix: "as-needed", // en at "/", others at "/de/…", "/pl/…", "/zh-Hant/…"
  // Don't auto-redirect on Accept-Language (Google discourages it; avoids
  // apex→www→/locale redirect chains). hreflang + the switcher handle locale.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
