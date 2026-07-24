"use client";

import { useReducedMotion } from "motion/react";
import { feature } from "topojson-client";
import land from "world-atlas/land-110m.json";
import { ORIGIN_LIST } from "@/data/catalog";

/* ---- equirectangular projection (no lib): 1° = 1 unit ---- */
const project = (lon: number, lat: number): [number, number] => [lon + 180, 90 - lat];

/* ---- hand-drawn land path from world-atlas land outline ---- */
function ringToPath(ring: number[][]): string {
  return ring.map((c, i) => {
    const [x, y] = project(c[0], c[1]);
    return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join("") + "Z";
}
// topojson feature() may return a Feature or a FeatureCollection; normalise to
// a flat list of polygons (each polygon is an array of rings), then to paths.
/* eslint-disable @typescript-eslint/no-explicit-any */
const parsed = feature(land as any, (land as any).objects.land) as any;
const geoms: any[] = parsed.type === "FeatureCollection" ? parsed.features.map((f: any) => f.geometry) : [parsed.geometry];
function polygons(geom: any): number[][][][] {
  if (!geom) return [];
  if (geom.type === "Polygon") return [geom.coordinates];
  if (geom.type === "MultiPolygon") return geom.coordinates;
  return [];
}
const LAND_PATH = geoms
  .flatMap(polygons)
  .flatMap((poly) => poly.map(ringToPath))
  .join("");
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ---- HK hub + origins from the catalogue coords ---- */
const HUB = project(114.17, 22.32); // Hong Kong

function parseCoord(s: string): [number, number] {
  // "34.88°N 135.80°E"
  const m = s.match(/([\d.]+)°([NS])\s+([\d.]+)°([EW])/);
  if (!m) return [0, 0];
  const lat = parseFloat(m[1]) * (m[2] === "S" ? -1 : 1);
  const lon = parseFloat(m[3]) * (m[4] === "W" ? -1 : 1);
  return project(lon, lat);
}

const COUNTRY_COLOR: Record<string, string> = {
  JP: "#1B5E3F", CN: "#C58A2A", PH: "#7E3FB0", EG: "#B0324E",
};

const NODES = ORIGIN_LIST.map((o) => {
  const [x, y] = parseCoord(o.coords);
  return { slug: o.slug, name: o.name, country: o.country, cc: o.countryCode, x, y, c: COUNTRY_COLOR[o.countryCode] ?? "#5E8C6A" };
});

// One mono label per country cluster (at the northern-most node of that country).
const LABELS = Object.values(
  NODES.reduce<Record<string, { cc: string; country: string; x: number; y: number }>>((acc, n) => {
    if (!acc[n.cc] || n.y < acc[n.cc].y) acc[n.cc] = { cc: n.cc, country: n.country, x: n.x, y: n.y };
    return acc;
  }, {})
).filter((l) => Math.hypot(l.x - HUB[0], l.y - HUB[1]) > 16);

function arc(x: number, y: number): string {
  const mx = (x + HUB[0]) / 2;
  const my = (y + HUB[1]) / 2;
  const dist = Math.hypot(x - HUB[0], y - HUB[1]);
  return `M${x.toFixed(1)},${y.toFixed(1)} Q${mx.toFixed(1)},${(my - dist * 0.28).toFixed(1)} ${HUB[0].toFixed(1)},${HUB[1].toFixed(1)}`;
}

/**
 * SourcingMap — hand-drawn flat world map of where we source, with calm flows
 * converging on the Hong Kong hub. Pass `originSlug` to focus a single origin
 * (per-product / per-origin variant).
 */
export function SourcingMap({ originSlug }: { originSlug?: string }) {
  const reduce = useReducedMotion();
  const focus = originSlug ? NODES.find((n) => n.slug === originSlug) : undefined;
  const nodes = focus ? [focus] : NODES;
  // viewBox: eastern hemisphere framed on the sourcing region (Europe/Africa → Japan)
  const viewBox = "155 30 202 88";

  return (
    <svg viewBox={viewBox} className="w-full" role="img" aria-label="Where Superfoods Partners sources, routed through Hong Kong">
      <defs>
        <filter id="sketch" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.8" />
        </filter>
      </defs>

      {/* hand-drawn land */}
      <g filter="url(#sketch)">
        <path d={LAND_PATH} fill="#E7E2D6" stroke="#b9b2a1" strokeWidth={0.35} strokeLinejoin="round" />
      </g>

      {/* flows + origins */}
      {nodes.map((n, i) => (
        <g key={n.slug}>
          <path d={arc(n.x, n.y)} fill="none" stroke={n.c} strokeOpacity={0.5} strokeWidth={0.5} strokeDasharray="1.4 1.8" />
          <circle cx={n.x} cy={n.y} r={1.6} fill={n.c} />
          {!reduce && (
            <circle r={1.1} fill={n.c}>
              <animateMotion dur="3.2s" begin={`${i * 0.45}s`} repeatCount="indefinite" path={arc(n.x, n.y)} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
              <animate attributeName="opacity" values="0;1;1;0" dur="3.2s" begin={`${i * 0.45}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}

      {/* country labels */}
      {(focus ? [] : LABELS).map((l) => (
        <text key={l.cc} x={l.x} y={l.y - 3} textAnchor="middle"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 3, letterSpacing: 0.3, textTransform: "uppercase", fill: "#5A5E53" }}>
          {l.country}
        </text>
      ))}

      {/* Hong Kong hub */}
      {!reduce && (
        <circle cx={HUB[0]} cy={HUB[1]} r={2.4} fill="none" stroke="#E0A23E" strokeWidth={0.5}>
          <animate attributeName="r" values="2.4;7" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="2.4s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={HUB[0]} cy={HUB[1]} r={2.4} fill="#E0A23E" />
      <text x={HUB[0]} y={HUB[1] + 7.5} textAnchor="middle"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: 3.2, letterSpacing: 0.4, fill: "#14271B" }}>
        HONG KONG HUB
      </text>
    </svg>
  );
}
