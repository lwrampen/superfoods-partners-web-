import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-forest text-oat/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-16 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <Image src="/logos/sfp-roundel-reversed.svg" alt="" width={52} height={52} />
          <div>
            <p className="font-medium text-oat">Superfoods Partners</p>
            <p className="mono text-[11px] uppercase">Sourced at scale. Trusted at origin.</p>
          </div>
        </div>
        <div className="flex gap-12">
          <div className="flex flex-col gap-2 text-sm">
            <span className="mono text-[10px] uppercase tracking-wide text-oat/40">Catalogue</span>
            <Link href="/catalog" className="hover:text-oat">Matcha</Link>
            <Link href="/catalog" className="hover:text-oat">Superfoods</Link>
            <Link href="/origins" className="hover:text-oat">Origins</Link>
          </div>
          <div className="mono text-[11px] uppercase leading-relaxed">
            <p className="text-oat/40">Hong Kong hub</p>
            <p>22.32°N 114.17°E</p>
            <Link href="/contact" className="mt-3 inline-block text-amber hover:underline">Request a quote →</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-oat/10">
        <p className="mx-auto max-w-6xl px-6 py-5 text-[11px] text-oat/50">
          © 2026 Superfoods Partners — A Pure Matcha Partners company.
        </p>
      </div>
    </footer>
  );
}
