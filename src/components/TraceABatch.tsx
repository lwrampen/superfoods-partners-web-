"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

const PRODUCTS = [
  { id: "matcha", chip: "CEREMONIAL MATCHA", name: "CEREMONIAL MATCHA", origin: "UJI, JAPAN", coords: "34.88°N 135.80°E", batch: "SFP-M-CE-1KG-JP-O", accent: "#1B5E3F", certs: "JAS · EU ORGANIC" },
  { id: "ube", chip: "UBE", name: "UBE", origin: "LUZON, PHILIPPINES", coords: "16.04°N 120.93°E", batch: "SFP-U-PR-1KG-PH-C", accent: "#7E3FB0", certs: "HACCP · FSSC 22000" },
  { id: "lionsmane", chip: "LION'S MANE", name: "LION'S MANE", origin: "FUJIAN, CHINA", coords: "26.07°N 119.30°E", batch: "SFP-L-PR-1KG-CN-O", accent: "#C58A2A", certs: "USDA ORGANIC · KOSHER" },
];

const NODES = ["ORIGIN", "LAB VERIFIED", "HONG KONG HUB", "YOUR FACILITY"];

export function TraceABatch() {
  const [sel, setSel] = useState(0);
  const p = PRODUCTS[sel];
  const panel: [string, string][] = [
    ["Pesticide residue", "Pass"],
    ["Heavy metals · Pb As Cd", "Pass"],
    ["Microbiology", "Pass"],
    ["Radiation", "Pass"],
    ["Moisture · particle size", "In spec"],
  ];

  return (
    <div className="grid gap-10 md:grid-cols-2 md:items-center">
      <div>
        <div className="flex flex-wrap gap-2">
          {PRODUCTS.map((pr, idx) => (
            <button
              key={pr.id}
              onClick={() => setSel(idx)}
              className="mono rounded-lg border px-3 py-1.5 text-[11px] uppercase transition-colors"
              style={{
                borderColor: idx === sel ? pr.accent : "rgba(90,94,83,0.25)",
                color: idx === sel ? pr.accent : "#5A5E53",
                backgroundColor: idx === sel ? `${pr.accent}14` : "transparent",
              }}
            >
              {pr.chip}
            </button>
          ))}
        </div>

        <div className="relative mt-10 h-56 pl-8">
          <div className="absolute left-[7px] top-1 bottom-1 w-px bg-stone/20" />
          <motion.div
            key={`${p.id}-dot`}
            className="absolute left-[2px] h-3 w-3 rounded-full"
            style={{ backgroundColor: p.accent }}
            animate={{ top: ["0%", "100%"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="flex h-full flex-col justify-between">
            {NODES.map((n, idx) => (
              <div key={n} className="relative flex items-center">
                <span
                  className="absolute left-[-26px] h-3 w-3 rounded-full border-2 bg-oat"
                  style={{ borderColor: idx === 2 ? "#E0A23E" : p.accent }}
                />
                <p
                  className="mono text-xs uppercase"
                  style={{ color: idx === 2 ? "#E0A23E" : "#1E3D2A" }}
                >
                  {n}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="rounded-xl border bg-white p-6"
          style={{ borderColor: `${p.accent}40` }}
        >
          <div className="flex items-center justify-between">
            <span className="mono text-[10px] uppercase text-stone/60">{p.batch}</span>
            <span className="mono text-[10px] uppercase" style={{ color: p.accent }}>
              Verification Record™
            </span>
          </div>
          <p className="mt-4 text-2xl font-medium" style={{ color: p.accent }}>
            {p.name}
          </p>
          <p className="mono mt-1 text-xs uppercase text-stone/70">
            {p.origin} · {p.coords}
          </p>
          <p className="mono mt-6 text-[10px] uppercase tracking-wide text-stone/50">Test panel</p>
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
                  {label}
                </span>
                <span className="mono text-[11px] uppercase text-stone/50">{result}</span>
              </motion.li>
            ))}
          </ul>
          <div className="mt-5 flex items-center justify-between border-t border-stone/10 pt-4">
            <span className="mono text-[10px] uppercase text-stone/60">{p.certs}</span>
            <span className="mono flex items-center gap-2 text-[11px] uppercase text-stone/70">
              <span className="h-2.5 w-2.5 rounded-full bg-amber" /> Routed via Hong Kong
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
