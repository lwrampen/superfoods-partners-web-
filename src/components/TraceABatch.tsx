"use client";

import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

// Accents match the catalogue product colours so this reads as the same brand
// system as the rest of the site.
const PRODUCTS = [
  { id: "matcha", chip: "CEREMONIAL MATCHA", name: "CEREMONIAL MATCHA", origin: "UJI, JAPAN", coords: "34.88°N 135.80°E", batch: "SFP-M-CE-1KG-JP-O", accent: "#1C4B0C", certs: "JAS · EU ORGANIC" },
  { id: "ube", chip: "UBE", name: "UBE", origin: "PHILIPPINES", coords: "12.88°N 121.77°E", batch: "SFP-U-PR-1KG-PH-C", accent: "#5A338C", certs: "HACCP · FSSC 22000" },
  { id: "lionsmane", chip: "LION'S MANE", name: "LION'S MANE", origin: "FUJIAN, CHINA", coords: "26.07°N 119.30°E", batch: "SFP-L-PR-1KG-CN-O", accent: "#9A6B24", certs: "USDA ORGANIC · KOSHER" },
];

const LIME = "#8CC541";
const NODE_KEYS = ["nodeOrigin", "nodeLab", "nodeHub", "nodeFacility"];

export function TraceABatch() {
  const t = useTranslations("trace");
  const [sel, setSel] = useState(0);
  const reduce = useReducedMotion();
  const p = PRODUCTS[sel];
  const panel: [string, string][] = [
    ["pesticide", "pass"],
    ["heavyMetals", "pass"],
    ["microbiology", "pass"],
    ["radiation", "pass"],
    ["moisture", "inSpec"],
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* product selector */}
      <div className="flex flex-wrap gap-2">
        {PRODUCTS.map((pr, idx) => (
          <button
            key={pr.id}
            onClick={() => setSel(idx)}
            className="mono rounded-lg border px-3.5 py-1.5 text-[11px] uppercase tracking-wide transition-colors"
            style={{
              borderColor: idx === sel ? pr.accent : "rgba(90,94,83,0.22)",
              color: idx === sel ? pr.accent : "#5A5E53",
              backgroundColor: idx === sel ? `${pr.accent}12` : "transparent",
            }}
          >
            {pr.chip}
          </button>
        ))}
      </div>

      {/* matched pair: the journey, and the record it produces */}
      <div className="grid gap-5 md:grid-cols-[0.92fr_1.08fr]">
        {/* LEFT — chain of custody */}
        <div className="flex flex-col rounded-2xl border border-stone/12 bg-white p-6 shadow-[0_1px_2px_rgba(20,39,27,0.05)]">
          <span className="mono text-[10px] uppercase tracking-widest text-stone/50">{t("chain")}</span>

          <div className="relative mt-7 h-52">
            {/* rail */}
            <div className="absolute left-4 top-2 bottom-2 w-px bg-stone/15" />
            {/* travelling signal */}
            {!reduce && (
              <motion.div
                key={`${p.id}-dot`}
                aria-hidden
                className="absolute left-3 h-2 w-2 rounded-full"
                style={{ backgroundColor: p.accent, boxShadow: `0 0 9px ${p.accent}` }}
                animate={{ top: [8, 196], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "linear", times: [0, 0.12, 0.82, 1] }}
              />
            )}
            <div className="flex h-full flex-col justify-between">
              {NODE_KEYS.map((n, idx) => (
                <div key={n} className="relative flex items-center pl-9">
                  <span
                    className="absolute left-[10px] h-3 w-3 rounded-full border-2 bg-white"
                    style={{ borderColor: idx === 2 ? LIME : p.accent }}
                  />
                  <p className="mono text-xs uppercase tracking-wide text-forest">{t(n)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-stone/10 pt-4">
            <span className="mono text-[10px] uppercase tracking-wide text-stone/55">{p.origin}</span>
            <span className="mono flex items-center gap-2 text-[11px] uppercase text-stone/70">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LIME }} /> {t("routed")}
            </span>
          </div>
        </div>

        {/* RIGHT — verification record */}
        <AnimatePresence mode="wait">
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col rounded-2xl border bg-white p-6 shadow-[0_1px_2px_rgba(20,39,27,0.05)]"
            style={{ borderColor: `${p.accent}40` }}
          >
            <div className="flex items-center justify-between">
              <span className="mono text-[10px] uppercase tracking-wide text-stone/55">{p.batch}</span>
              <span className="mono text-[10px] uppercase" style={{ color: p.accent }}>
                Verification Record™
              </span>
            </div>
            <p className="display mt-4 text-2xl" style={{ color: p.accent }}>
              {p.name}
            </p>
            <p className="mono mt-1 text-xs uppercase text-stone/70">
              {p.origin} · {p.coords}
            </p>
            <p className="mono mt-6 text-[10px] uppercase tracking-widest text-stone/50">{t("testPanel")}</p>
            <ul className="mt-3 space-y-2.5">
              {panel.map(([label, result], idx) => (
                <motion.li
                  key={`${p.id}-${label}`}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + idx * 0.26 }}
                  className="flex items-center justify-between text-sm text-stone"
                >
                  <span className="flex items-center gap-2.5">
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.25 + idx * 0.26, type: "spring", stiffness: 380, damping: 14 }}
                      className="flex h-4 w-4 items-center justify-center rounded-full text-[10px] text-white"
                      style={{ backgroundColor: p.accent }}
                    >
                      ✓
                    </motion.span>
                    {t(label)}
                  </span>
                  <span className="mono text-[11px] uppercase text-stone/50">{t(result)}</span>
                </motion.li>
              ))}
            </ul>
            <div className="mt-auto flex items-center justify-between border-t border-stone/10 pt-4">
              <span className="mono text-[10px] uppercase text-stone/60">{p.certs}</span>
              <span className="mono flex items-center gap-2 text-[11px] uppercase text-stone/70">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: LIME }} /> {t("routed")}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
