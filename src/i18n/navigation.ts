import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Locale-aware Link/router — automatically prefixes non-default locales.
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
