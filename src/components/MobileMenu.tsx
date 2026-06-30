"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

type NavLink = { label: string; href: string };

export function MobileMenu({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

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
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute inset-x-0 top-full z-40 border-b border-stone/15 bg-oat"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            >
              <nav className="mx-auto flex max-w-6xl flex-col px-6 py-4">
                {links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="border-b border-stone/10 py-3.5 text-lg text-stone transition-colors hover:text-green"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-5 rounded-lg bg-green px-4 py-3 text-center text-sm font-medium text-oat transition-opacity hover:opacity-90"
                >
                  Request volume
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
