import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MobileMenu } from "@/components/MobileMenu";
import { LangSwitch } from "@/components/LangSwitch";

const NAV = [
  { key: "catalog", href: "/catalog" },
  { key: "origins", href: "/origins" },
  { key: "verification", href: "/verification" },
  { key: "insights", href: "/insights" },
  { key: "about", href: "/about" },
] as const;

export function SiteNav() {
  const t = useTranslations("nav");
  const links = NAV.map((l) => ({ label: t(l.key), href: l.href }));
  return (
    <header className="sticky top-0 z-50 border-b border-stone/15 bg-oat/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label={t("home")}>
          <Image src="/logos/sfp-wordmark.svg" alt="Superfoods Partners" width={130} height={40} priority />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-stone transition-colors hover:text-green">
              {l.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <LangSwitch className="hidden sm:flex" />
          <Link href="/contact" className="hidden rounded-lg bg-green px-4 py-2 text-sm font-medium text-oat transition-opacity hover:opacity-90 md:inline-block">
            {t("requestVolume")}
          </Link>
          <MobileMenu links={links} cta={t("requestVolume")} />
        </div>
      </nav>
    </header>
  );
}
