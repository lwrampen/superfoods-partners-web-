import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Run on everything except API routes, Next internals, the team signatures page and files with an extension.
  matcher: ["/((?!api|_next|_vercel|signatures|.*\\..*).*)"],
};
