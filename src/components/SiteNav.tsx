import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MobileMenu } from "@/components/MobileMenu";
import { ProductsMenu } from "@/components/ProductsMenu";
import { LangSwitch } from "@/components/LangSwitch";
import { PRODUCTS, LABELS, ORIGIN_LIST, type LabelId } from "@/data/catalog";

// Products + Origins now live inside the Products mega-menu, so the flat nav
// carries only the remaining top-level destinations.
const NAV = [
  { key: "verification", href: "/verification" },
  { key: "insights", href: "/insights" },
  { key: "company", href: "/company" },
] as const;

const LABEL_ORDER: LabelId[] = ["pmp", "sfp"];

export function SiteNav() {
  const t = useTranslations("nav");
  const links = NAV.map((l) => ({ label: t(l.key), href: l.href }));

  // Slim, serialisable data for the (client) menus — the full catalogue never
  // reaches the client bundle.
  const productGroups = LABEL_ORDER.map((id) => ({
    id,
    name: LABELS[id].name,
    house: LABELS[id].house,
    accent: LABELS[id].accent,
    items: PRODUCTS.filter((p) => p.label === id).map((p) => ({ slug: p.slug, name: p.name })),
  }));
  const menuCopy = {
    specialist: t("specialist"),
    house: t("house"),
    byOrigin: t("byOrigin"),
    allOrigins: t("allOrigins"),
    allProducts: t("allProducts"),
    originsNote: t("originsNote", {
      origins: ORIGIN_LIST.length,
      countries: new Set(ORIGIN_LIST.map((o) => o.country)).size,
    }),
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone/15 bg-oat/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" aria-label={t("home")}>
          <Image src="/logos/sfp-lockup-dark.svg" alt="Superfoods Partners" width={109} height={40} priority />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <ProductsMenu label={t("products")} groups={productGroups} copy={menuCopy} />
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
          <MobileMenu
            links={links}
            cta={t("requestVolume")}
            productsLabel={t("products")}
            originsLabel={t("origins")}
            productGroups={productGroups}
            copy={menuCopy}
          />
        </div>
      </nav>
    </header>
  );
}
