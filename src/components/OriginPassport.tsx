"use client";

import { motion } from "motion/react";
import type { Origin } from "@/data/catalog";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.12 } } };
const card = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export function OriginPassport({
  origins,
  notes,
  accent,
}: {
  origins: Origin[];
  notes?: Record<string, string>;
  accent: string;
}) {
  return (
    <section className="bg-sand">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex items-center gap-3">
          <span className="text-amber">✦</span>
          <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Origin passport</span>
        </div>
        <h2 className="mt-4 max-w-2xl display text-3xl text-green md:text-4xl">
          Where it comes from — and why it tastes that way.
        </h2>
        <motion.div
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
        >
          {origins.map((o) => (
            <motion.div
              key={o.slug}
              variants={card}
              whileHover={{ y: -6 }}
              className="relative overflow-hidden rounded-xl border border-stone/15 bg-oat p-5"
            >
              <svg className="absolute right-3 top-3 opacity-60" width="56" height="56" viewBox="0 0 56 56" aria-hidden>
                <circle cx="28" cy="28" r="21" fill="none" stroke={accent} strokeWidth="0.5" strokeDasharray="2 3" />
                <line x1="28" y1="4" x2="28" y2="52" stroke={accent} strokeWidth="0.4" />
                <line x1="4" y1="28" x2="52" y2="28" stroke={accent} strokeWidth="0.4" />
                <circle cx="35" cy="22" r="3" fill="#E0A23E" />
              </svg>
              <span className="mono text-[9px] uppercase tracking-widest text-stone/45">Origin · {o.countryCode}</span>
              <div className="mt-5 display text-2xl text-green">{o.name}</div>
              <div className="mono text-[11px] uppercase tracking-wide text-stone/55">{o.country}</div>
              <div className="mono mt-2 text-[12px] tabular-nums text-stone/70">{o.coords}</div>
              {notes?.[o.slug] && (
                <p className="mt-4 text-sm leading-relaxed text-stone">{notes[o.slug]}</p>
              )}
              <div className="mono mt-5 flex items-center gap-2 border-t border-stone/10 pt-4 text-[10px] uppercase tracking-wide text-stone/50">
                <span className="h-2 w-2 rounded-full bg-amber" />
                Verified at origin · routed via Hong Kong
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
