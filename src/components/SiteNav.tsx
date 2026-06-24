import Image from "next/image";
import Link from "next/link";

// Only routes that exist today — expanded as Origins/Verification/About ship.
const LINKS = [{ label: "Catalog", href: "/catalog" }];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone/15 bg-oat/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Superfoods Partners — home">
          <Image src="/logos/sfp-wordmark.svg" alt="Superfoods Partners" width={150} height={28} priority />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="text-sm text-stone transition-colors hover:text-green">
              {l.label}
            </Link>
          ))}
        </div>
        <Link href="/contact" className="rounded-lg bg-green px-4 py-2 text-sm font-medium text-oat transition-opacity hover:opacity-90">
          Request volume
        </Link>
      </nav>
    </header>
  );
}
