"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const ORIGINS = [
  { x: 42, y: 48, c: "#1B5E3F", label: "MATCHA · UJI, JP" },
  { x: 64, y: 156, c: "#7E3FB0", label: "UBE · LUZON, PH" },
  { x: 282, y: 58, c: "#C58A2A", label: "LION'S MANE · FUJIAN, CN" },
  { x: 270, y: 158, c: "#B0324E", label: "HIBISCUS · ASWAN, EG" },
];
const HUB = { x: 162, y: 104 };

export function OriginMap() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((p) => (p + 1) % ORIGINS.length), 2600);
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
            className="mono text-sm uppercase text-green"
          >
            {ORIGINS[i].label}
          </motion.p>
        </AnimatePresence>
      </div>

      <svg viewBox="0 0 320 210" className="mt-5 w-full rounded-lg bg-forest">
        {ORIGINS.map((o, idx) => (
          <g key={idx}>
            <line
              x1={o.x}
              y1={o.y}
              x2={HUB.x}
              y2={HUB.y}
              stroke={o.c}
              strokeOpacity={0.3}
              strokeWidth={1}
              strokeDasharray="3 4"
            />
            <circle cx={o.x} cy={o.y} r={3.5} fill={o.c} />
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
