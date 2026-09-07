"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@/i18n/navigation";
import { LangSwitch } from "@/components/LangSwitch";
import type { MenuGroup, MenuCopy } from "@/components/ProductsMenu";

type NavLink = { label: string; href: string };

export function MobileMenu({
  links,
  cta,
  productsLabel,
  originsLabel,
  productGroups,
  copy,
}: {
  links: NavLink[];
  cta: string;
  productsLabel: string;
  originsLabel: string;
  productGroups: MenuGroup[];
  copy: MenuCopy;
}) {
  const [open, setOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="-mr-2 flex h-10 w-10 items-center justify-center text-green"
      >
        <span className="relative block h-4 w-6">
          <motion.span
            className="absolute left-0 block h-[2px] w-6 rounded-full bg-current"
            animate={open ? { top: 7, rotate: 45 } : { top: 0, rotate: 0 }}
            style={{ top: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="absolute left-0 top-[7px] block h-[2px] w-6 rounded-full bg-current"
            animate={open ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="absolute left-0 block h-[2px] w-6 rounded-full bg-current"
            animate={open ? { top: 7, rotate: -45 } : { top: 14, rotate: 0 }}
            style={{ top: 14 }}
            transition={{ duration: 0.25 }}
          />
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 top-[var(--nav-h,61px)] z-40 bg-stone/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={close}
            />
            <motion.div
              className="absolute inset-x-0 top-full z-40 max-h-[80vh] overflow-y-auto border-b border-stone/15 bg-oat"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="mx-auto flex max-w-6xl flex-col px-6 py-4">
                {/* Products — expandable, grouped by label */}
                <button
                  type="button"
                  onClick={() => setProductsOpen((v) => !v)}
                  aria-expanded={productsOpen}
                  className="flex items-center justify-between border-b border-stone/10 py-3.5 text-lg text-stone transition-colors hover:text-green"
                >
                  {productsLabel}
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 10 10"
                    className={`transition-transform duration-200 ${productsOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  >
                    <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </button>

                <AnimatePresence initial={false}>
                  {productsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden border-b border-stone/10"
                    >
                      <div className="flex flex-col gap-4 py-4">
                        {productGroups.map((g) => (
                          <div key={g.id}>
                            <div className="flex items-center gap-2">
                              <span
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: g.house ? "#16240F" : g.accent }}
                              />
                              <span className="display text-sm text-green">{g.name}</span>
                              <span className="mono text-[9px] uppercase tracking-widest text-stone/40">
                                {g.house ? copy.house : copy.specialist}
                              </span>
                            </div>
                            <ul className="mt-2 flex flex-col">
                              {g.items.map((p) => (
                                <li key={p.slug}>
                                  <Link
                                    href={`/products/${p.slug}`}
                                    onClick={close}
                                    className="block py-1.5 pl-4 text-sm capitalize text-stone transition-colors hover:text-green"
                                  >
                                    {p.name.toLowerCase()}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="flex flex-col gap-1 pt-1">
                          <Link
                            href="/products"
                            onClick={close}
                            className="mono text-[11px] uppercase tracking-wide text-green"
                          >
                            {copy.allProducts} →
                          </Link>
                          <Link
                            href="/origins"
                            onClick={close}
                            className="mono text-[11px] uppercase tracking-wide text-stone/60"
                          >
                            {originsLabel} →
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={close}
                    className="border-b border-stone/10 py-3.5 text-lg text-stone transition-colors hover:text-green"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={close}
                  className="mt-5 rounded-lg bg-green px-4 py-3 text-center text-sm font-medium text-oat transition-opacity hover:opacity-90"
                >
                  {cta}
                </Link>
                <div className="mt-5 border-t border-stone/10 pt-4" onClick={close}>
                  <LangSwitch variant="inline" />
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
