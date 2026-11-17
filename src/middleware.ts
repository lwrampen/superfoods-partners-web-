import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

// Blog Studio (internal tool) lives at /studio and is not localized. On its own host
// (studio.superfoodspartners.com) every page path is served from /studio, so the root of that host is the Studio.
const STUDIO_HOST = /^studio\./i;

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (STUDIO_HOST.test(req.headers.get("host") ?? "")) {
    if (pathname === "/studio" || pathname.startsWith("/studio/")) return NextResponse.next();
    const url = req.nextUrl.clone();
    url.pathname = pathname === "/" ? "/studio" : `/studio${pathname}`;
    return NextResponse.rewrite(url);
  }
  return intl(req);
}

export const config = {
  // Run on everything except API routes, Next internals, the team signatures page, the Studio and files with an extension.
  matcher: ["/((?!api|_next|_vercel|signatures|studio(?:/|$)|.*\\..*).*)"],
};
