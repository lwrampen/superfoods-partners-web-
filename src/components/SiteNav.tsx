import Image from "next/image";
import Link from "next/link";
import { MobileMenu } from "@/components/MobileMenu";

const LINKS = [
  { label: "Catalog", href: "/catalog" },
  { label: "Origins", href: "/origins" },
  { label: "Verification", href: "/verification" },
  { label: "About", href: "/about" },
];

export function SiteNav() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone/15 bg-oat/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label="Superfoods Partners — home">
          <Image src="/logos/sfp-wordmark.svg" alt="Superfoods Partners" width={130} height={40} priority />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <Link key={l.label} href={l.href} className="text-sm text-stone transition-colors hover:text-green">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link href="/contact" className="hidden rounded-lg bg-green px-4 py-2 text-sm font-medium text-oat transition-opacity hover:opacity-90 md:inline-block">
            Request volume
          </Link>
          <MobileMenu links={LINKS} />
        </div>
      </nav>
    </header>
  );
}
