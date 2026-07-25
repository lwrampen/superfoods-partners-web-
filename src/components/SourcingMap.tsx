"use client";

import { useReducedMotion } from "motion/react";
import { feature } from "topojson-client";
import land from "world-atlas/land-110m.json";
import { ORIGIN_LIST, getProduct } from "@/data/catalog";

/* ---- equirectangular projection (no lib): 1° = 1 unit ---- */
const project = (lon: number, lat: number): [number, number] => [lon + 180, 90 - lat];

/* ---- hand-drawn land path (Antarctica dropped: it draws a stray band in equirect) ----
   Break the stroke wherever two consecutive points jump across the antimeridian
   (lon +180 → -180), otherwise the projection draws a stray line straight across. */
function ringToPath(ring: number[][]): string {
  let d = "";
  let prevX: number | null = null;
  for (let i = 0; i < ring.length; i++) {
    const [x, y] = project(ring[i][0], ring[i][1]);
    const cmd = i === 0 || (prevX !== null && Math.abs(x - prevX) > 180) ? "M" : "L";
    d += `${cmd}${x.toFixed(1)},${y.toFixed(1)}`;
    prevX = x;
  }
  return d;
}
/* eslint-disable @typescript-eslint/no-explicit-any */
const parsed = feature(land as any, (land as any).objects.land) as any;
const geoms: any[] = parsed.type === "FeatureCollection" ? parsed.features.map((f: any) => f.geometry) : [parsed.geometry];
function polygons(geom: any): number[][][][] {
  if (!geom) return [];
  if (geom.type === "Polygon") return [geom.coordinates];
  if (geom.type === "MultiPolygon") return geom.coordinates;
  return [];
}
const keepPoly = (poly: number[][][]) => poly[0].some((c) => c[1] >= -55); // drop Antarctica
const LAND_PATH = geoms.flatMap(polygons).filter(keepPoly).flatMap((poly) => poly.map(ringToPath)).join("");
/* eslint-enable @typescript-eslint/no-explicit-any */

/* ---- HK hub + sourcing nodes from catalogue coords ---- */
const HUB = project(114.17, 22.32); // Hong Kong

function parseCoord(s: string): [number, number] {
  const m = s.match(/([\d.]+)°([NS])\s+([\d.]+)°([EW])/);
  if (!m) return [0, 0];
  const lat = parseFloat(m[1]) * (m[2] === "S" ? -1 : 1);
  const lon = parseFloat(m[3]) * (m[4] === "W" ? -1 : 1);
  return project(lon, lat);
}

const COUNTRY_COLOR: Record<string, string> = {
  JP: "#1B5E3F", CN: "#C58A2A", PH: "#7E3FB0", EG: "#B0324E",
};

type Node = { key: string; label: string; x: number; y: number; c: string };

// One node per country (centroid of its origins) among a set of origins.
function countryNodes(origins: typeof ORIGIN_LIST): Node[] {
  const g = new Map<string, { country: string; cc: string; pts: [number, number][] }>();
  for (const o of origins) {
    const p = parseCoord(o.coords);
    if (!g.has(o.countryCode)) g.set(o.countryCode, { country: o.country, cc: o.countryCode, pts: [] });
    g.get(o.countryCode)!.pts.push(p);
  }
  return [...g.values()].map((v) => ({
    key: v.cc,
    label: v.country,
    x: v.pts.reduce((s, p) => s + p[0], 0) / v.pts.length,
    y: v.pts.reduce((s, p) => s + p[1], 0) / v.pts.length,
    c: COUNTRY_COLOR[v.cc] ?? "#5E8C6A",
  }));
}
const ALL_NODES = countryNodes(ORIGIN_LIST);

function originNode(slug: string): Node | undefined {
  const o = ORIGIN_LIST.find((x) => x.slug === slug);
  if (!o) return undefined;
  const [x, y] = parseCoord(o.coords);
  const label = o.name === o.country ? o.name : `${o.name}, ${o.country}`;
  return { key: o.slug, label, x, y, c: COUNTRY_COLOR[o.countryCode] ?? "#5E8C6A" };
}

function arc(x: number, y: number): string {
  const mx = (x + HUB[0]) / 2;
  const my = (y + HUB[1]) / 2;
  const dist = Math.hypot(x - HUB[0], y - HUB[1]);
  return `M${x.toFixed(1)},${y.toFixed(1)} Q${mx.toFixed(1)},${(my - dist * 0.28).toFixed(1)} ${HUB[0].toFixed(1)},${HUB[1].toFixed(1)}`;
}

/**
 * SourcingMap — hand-drawn flat world map of where we source: one calm flow line
 * per country converging on the Hong Kong hub.
 *  - default: all sourcing countries (home)
 *  - `productSlug`: only the countries that product is sourced from (PDP)
 *  - `originSlug`: a single origin focus (origin page)
 */
export function SourcingMap({ productSlug, originSlug }: { productSlug?: string; originSlug?: string }) {
  const reduce = useReducedMotion();

  let nodes: Node[];
  const showLabels = true;
  if (originSlug) {
    const n = originNode(originSlug);
    nodes = n ? [n] : ALL_NODES;
  } else if (productSlug) {
    const p = getProduct(productSlug);
    const set = new Set(p?.originSlugs ?? []);
    nodes = countryNodes(ORIGIN_LIST.filter((o) => set.has(o.slug)));
    if (!nodes.length) nodes = ALL_NODES;
  } else {
    nodes = ALL_NODES;
  }

  const viewBox = "155 30 202 88";

  return (
    <svg viewBox={viewBox} className="w-full" role="img" aria-label="Where Superfoods Partners sources, routed through Hong Kong">
      <defs>
        <filter id="sketch" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="2" seed="7" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="1.6" />
        </filter>
        <clipPath id="frame"><rect x="155" y="30" width="202" height="88" /></clipPath>
      </defs>

      {/* hand-drawn land */}
      <g clipPath="url(#frame)">
        <g filter="url(#sketch)">
          <path d={LAND_PATH} fill="#E7E2D6" stroke="#b9b2a1" strokeWidth={0.22} strokeLinejoin="round" />
        </g>
      </g>

      {/* one flow line per country + origin dot */}
      {nodes.map((n, i) => (
        <g key={n.key}>
          <path d={arc(n.x, n.y)} fill="none" stroke={n.c} strokeOpacity={0.4} strokeWidth={0.28} strokeDasharray="1.1 2.6" strokeLinecap="round" />
          <circle cx={n.x} cy={n.y} r={1.4} fill={n.c} />
          {!reduce && (
            <circle r={0.9} fill={n.c}>
              <animateMotion dur="6.5s" begin={`${i * 1.3}s`} repeatCount="indefinite" path={arc(n.x, n.y)} calcMode="linear" />
              <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.15;0.85;1" dur="6.5s" begin={`${i * 1.3}s`} repeatCount="indefinite" />
            </circle>
          )}
        </g>
      ))}

      {/* country labels — all sourcing countries; Philippines sits below its dot to clear the hub */}
      {showLabels && nodes.map((l) => (
        <text key={`lbl-${l.key}`} x={l.x} y={l.y + (l.key === "PH" ? 4.6 : -2.6)} textAnchor="middle"
          style={{ fontFamily: "var(--font-mono), monospace", fontSize: 2.4, letterSpacing: 0.25, textTransform: "uppercase", fill: "#5A5E53" }}>
          {l.label}
        </text>
      ))}

      {/* Hong Kong hub */}
      {!reduce && (
        <circle cx={HUB[0]} cy={HUB[1]} r={2.2} fill="none" stroke="#E0A23E" strokeWidth={0.45}>
          <animate attributeName="r" values="2.2;6.5" dur="3.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.55;0" dur="3.8s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={HUB[0]} cy={HUB[1]} r={2} fill="#E0A23E" />
      <text x={HUB[0]} y={HUB[1] + 6.8} textAnchor="middle"
        style={{ fontFamily: "var(--font-mono), monospace", fontSize: 2.7, letterSpacing: 0.35, fill: "#14271B" }}>
        HONG KONG HUB
      </text>
    </svg>
  );
}
