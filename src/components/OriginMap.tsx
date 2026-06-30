"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ORIGIN_LIST, productsForOrigin, type Origin } from "@/data/catalog";

const HUB = { x: 160, y: 105 };

// Representative colour per country (keyed by SKU country code).
const COUNTRY_COLOR: Record<string, string> = {
  JP: "#1B5E3F", // matcha green
  CN: "#C58A2A", // gold
  PH: "#7E3FB0", // ube purple
  EG: "#B0324E", // hibiscus red
};
const FALLBACK_COLOR = "#5E8C6A";

// Build the sourcing nodes from the catalogue — one node per country, with the
// products actually sourced there. Positions are placed on an even ellipse
// around the hub (stylised, not a literal geo-projection), so adding an origin
// or country in catalog.ts automatically updates this map. One source of truth.
type Node = { country: string; cc: string; x: number; y: number; c: string; label: string };

function buildNodes(): Node[] {
  const order: string[] = [];
  const groups = new Map<string, Origin[]>();
  for (const o of ORIGIN_LIST) {
    if (!groups.has(o.country)) {
      groups.set(o.country, []);
      order.push(o.country);
    }
    groups.get(o.country)!.push(o);
  }

  const n = order.length;
  const rx = 120;
  const ry = 76;

  return order.map((country, k) => {
    const origins = groups.get(country)!;
    const cc = origins[0].countryCode;

    // Unique products sourced from this country, in catalogue order.
    const prodNames: string[] = [];
    for (const o of origins) {
      for (const p of productsForOrigin(o.slug)) {
        if (!prodNames.includes(p.name)) prodNames.push(p.name);
      }
    }
    const head = prodNames.slice(0, 2).join(", ");
    const more = prodNames.length > 2 ? ` +${prodNames.length - 2}` : "";
    const label = `${head}${more} · ${country.toUpperCase()}`;

    // Even ellipse around the hub, starting bottom-right for a balanced spread.
    const a = ((45 + (k * 360) / n) * Math.PI) / 180;
    return {
      country,
      cc,
      x: Math.round(HUB.x + rx * Math.cos(a)),
      y: Math.round(HUB.y + ry * Math.sin(a)),
      c: COUNTRY_COLOR[cc] ?? FALLBACK_COLOR,
      label,
    };
  });
}

const NODES = buildNodes();

export function OriginMap() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % NODES.length), 2600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-xl border border-stone/15 bg-sand p-6">
      <div className="flex items-center justify-between">
        <p className="mono text-[11px] uppercase text-stone/70">Now sourcing</p>
        <span className="mono flex items-center gap-1.5 text-[10px] uppercase text-amber">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-amber" />
          </span>
          Live
        </span>
      </div>

      <div className="mt-1 h-6 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={i}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mono truncate text-sm uppercase text-green"
          >
            {NODES[i].label}
          </motion.p>
        </AnimatePresence>
      </div>

      <svg viewBox="0 0 320 210" className="mt-5 w-full rounded-lg bg-forest">
        {NODES.map((o, idx) => (
          <g key={o.country}>
            <line
              x1={o.x}
              y1={o.y}
              x2={HUB.x}
              y2={HUB.y}
              stroke={o.c}
              strokeOpacity={idx === i ? 0.6 : 0.3}
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <circle cx={o.x} cy={o.y} r={idx === i ? 5 : 3.5} fill={o.c} />
            {idx === i && (
              <circle cx={o.x} cy={o.y} r={3.5} fill="none" stroke={o.c} strokeWidth={0.6}>
                <animate attributeName="r" values="4;11" dur="1.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="1.6s" repeatCount="indefinite" />
              </circle>
            )}
            <motion.circle
              r={2.6}
              fill={o.c}
              animate={{ cx: [o.x, HUB.x], cy: [o.y, HUB.y], opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: idx * 0.5, ease: "easeInOut" }}
            />
          </g>
        ))}
        <motion.circle
          cx={HUB.x}
          cy={HUB.y}
          fill="none"
          stroke="#E0A23E"
          strokeWidth={1.5}
          animate={{ r: [7, 20], opacity: [0.6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
        />
        <circle cx={HUB.x} cy={HUB.y} r={6} fill="#E0A23E" />
      </svg>

      <p className="mono mt-3 text-[10px] uppercase text-stone/60">
        1 hub · hong kong · 22.32°N 114.17°E
      </p>
    </div>
  );
}
