"use client";

import Link from "next/link";
import { motion } from "motion/react";

export function ProductHero({
  name,
  category,
  tagline,
  accent,
  tint,
  img,
}: {
  name: string;
  category: string;
  tagline: string;
  accent: string;
  tint: string;
  img?: string;
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
        <Link href="/catalog" className="mono text-[11px] uppercase tracking-wide text-white/60 transition-colors hover:text-white">
          ← Catalogue
        </Link>
        <p className="mono mt-6 text-[11px] uppercase tracking-widest text-white/70">{category}</p>
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
