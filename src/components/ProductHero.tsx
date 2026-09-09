"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Link as LocaleLink } from "@/i18n/navigation";

export function ProductHero({
  name,
  category,
  tagline,
  accent,
  tint,
  img,
  labelName,
  labelHouse,
  labelHref,
}: {
  name: string;
  category: string;
  tagline: string;
  accent: string;
  tint: string;
  img?: string;
  labelName: string;
  labelHouse: boolean;
  labelHref?: string;
}) {
  return (
    <motion.section
      className="relative isolate overflow-hidden"
      style={{ backgroundColor: accent }}
      initial="rest"
      animate="rest"
      whileInView="in"
      whileHover="hover"
      viewport={{ once: true }}
    >
      {img && (
        <>
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
            variants={{
              rest: { opacity: 0, scale: 1.08 },
              in: { opacity: 0.5, scale: 1 },
              hover: { opacity: 0.95, scale: 1.05 },
            }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{ background: `linear-gradient(to top, ${accent}, ${accent}cc 45%, ${accent}55)` }}
          />
        </>
      )}
      <div className="relative mx-auto max-w-6xl px-6 py-20 md:py-32">
        <Link href="/products" className="mono text-[11px] uppercase tracking-wide text-white/60 transition-colors hover:text-white">
          ← Products
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="mono text-[11px] uppercase tracking-widest text-white/70">{category}</p>
          {labelHref ? (
            <a
              href={labelHref}
              target="_blank"
              rel="noopener"
              className="mono inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wide transition-opacity hover:opacity-80"
              style={{ borderColor: "#8CC541", color: "#8CC541" }}
            >
              {labelName} ↗
            </a>
          ) : (
            <LocaleLink
              href="/company"
              className="mono inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-wide transition-opacity hover:opacity-80"
              style={{ borderColor: "rgba(255,255,255,0.3)", color: "rgba(255,255,255,0.8)" }}
            >
              {labelName}
            </LocaleLink>
          )}
        </div>
        <motion.h1
          className="mt-3 display text-6xl leading-[0.95] md:text-7xl"
          style={{ color: tint }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {name}
        </motion.h1>
        <p className="mt-5 max-w-xl text-lg text-white/85">{tagline}</p>
        {img && (
          <p className="mono mt-8 text-[10px] uppercase tracking-widest text-white/40">
            ✦ Hover to reveal the grind
          </p>
        )}
      </div>
    </motion.section>
  );
}
