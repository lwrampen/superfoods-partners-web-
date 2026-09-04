"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { feature } from "topojson-client";
import land from "world-atlas/land-110m.json";
import { ENTITIES } from "@/data/entities";

/* ---- equirectangular projection (shared with SourcingMap): 1° = 1 unit ---- */
const project = (lon: number, lat: number): [number, number] => [lon + 180, 90 - lat];

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
const geoms: any[] =
  parsed.type === "FeatureCollection" ? parsed.features.map((f: any) => f.geometry) : [parsed.geometry];
function polygons(geom: any): number[][][][] {
  if (!geom) return [];
  if (geom.type === "Polygon") return [geom.coordinates];
  if (geom.type === "MultiPolygon") return geom.coordinates;
  return [];
}
const keepPoly = (poly: number[][][]) => poly[0].some((c) => c[1] >= -56);
const LAND_PATH = geoms.flatMap(polygons).filter(keepPoly).flatMap((poly) => poly.map(ringToPath)).join("");
/* eslint-enable @typescript-eslint/no-explicit-any */

type Box = { x: number; y: number; w: number; h: number };
const R = 288 / 130;
const FULL: Box = { x: 45, y: 5, w: 288, h: 130 };
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

const NODES = ENTITIES.map((e) => {
  const [x, y] = project(e.lon, e.lat);
  return { ...e, x, y };
});

// network arcs between the three nodes
function arc(a: { x: number; y: number }, b: { x: number; y: number }): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dist = Math.hypot(a.x - b.x, a.y - b.y);
  return `M${a.x},${a.y} Q${mx},${(my - dist * 0.22).toFixed(1)} ${b.x},${b.y}`;
}
const ARCS = [
  [0, 1],
  [1, 2],
  [0, 2],
].map(([i, j]) => arc(NODES[i], NODES[j]));

export function LocationsMap() {
  const reduce = useReducedMotion();
  const t = useTranslations("locationsMap");
  const [active, setActive] = useState<string | null>(null);
  const [clocks, setClocks] = useState<Record<string, string>>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const curRef = useRef<Box>({ ...FULL });

  const setVB = (v: Box) =>
    svgRef.current?.setAttribute("viewBox", `${v.x.toFixed(2)} ${v.y.toFixed(2)} ${v.w.toFixed(2)} ${v.h.toFixed(2)}`);

  const target = (code: string | null): Box => {
    if (!code) return { ...FULL };
    const e = NODES.find((n) => n.code === code)!;
    const w = 150;
    const h = w / R;
    return { x: clamp(e.x - w / 2, 0, 360 - w), y: clamp(e.y - h / 2, 0, 180 - h), w, h };
  };

  const animTo = (v: Box) => {
    if (reduce) {
      curRef.current = { ...v };
      setVB(v);
      return;
    }
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = { ...curRef.current };
    const t0 = performance.now();
    const D = 680;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / D);
      const e = 1 - Math.pow(1 - p, 3);
      curRef.current = {
        x: from.x + (v.x - from.x) * e,
        y: from.y + (v.y - from.y) * e,
        w: from.w + (v.w - from.w) * e,
        h: from.h + (v.h - from.h) * e,
      };
      setVB(curRef.current);
      if (p < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  const select = (code: string) => {
    const next = active === code ? null : code;
    setActive(next);
    animTo(target(next));
  };

  useEffect(() => {
    setVB(FULL);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const tick = () => {
      const o: Record<string, string> = {};
      for (const e of ENTITIES) {
        try {
          o[e.code] = new Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: e.tz,
          }).format(new Date());
        } catch {
          o[e.code] = "";
        }
      }
      setClocks(o);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="lm-stage">
      <svg
        ref={svgRef}
        className="lm-map"
        viewBox="45 5 288 130"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={t("aria")}
      >
        <path className="lm-land" d={LAND_PATH} />
        {ARCS.map((d, i) => (
          <path key={i} className="lm-arc" d={d} />
        ))}
        {NODES.map((n) => (
          <g key={n.code} className={`lm-node${active === n.code ? " is-active" : active ? " is-dim" : ""}`}>
            {!reduce && (
              <circle className="lm-ring" cx={n.x} cy={n.y} r={2.2} fill="none" stroke="#8cc541" strokeWidth={0.5}>
                <animate attributeName="r" values="2;7" dur="3.6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.7;0" dur="3.6s" repeatCount="indefinite" />
              </circle>
            )}
            <circle className="lm-dot" cx={n.x} cy={n.y} r={1.7} />
            <circle className="lm-core" cx={n.x} cy={n.y} r={0.7} />
            <text className="lm-lbl" x={n.x} y={n.y - 3.2}>
              {n.city.toUpperCase()}
            </text>
            <circle
              className="lm-hit"
              cx={n.x}
              cy={n.y}
              r={6}
              fill="transparent"
              onClick={() => select(n.code)}
            />
          </g>
        ))}
      </svg>
      <div className="lm-scrim" />
      <div className="lm-cards" role="tablist" aria-label={t("aria")}>
        {ENTITIES.map((e) => (
          <button
            key={e.code}
            type="button"
            role="tab"
            aria-selected={active === e.code}
            className={`lm-card${active === e.code ? " is-active" : ""}`}
            onClick={() => select(e.code)}
          >
            <div className="lm-code">
              {e.code} · {t("role")}
            </div>
            <div className="lm-name">{e.city}</div>
            <p className="lm-cc">{e.name}</p>
            <address className="lm-addr">
              {e.address.map((line) => (
                <span key={line}>{line}</span>
              ))}
              <span>{e.country}</span>
            </address>
            <div className="lm-clock">
              <span className="lm-pulse" />
              <span>{clocks[e.code] ?? "—"}</span>
              <span className="lm-lab">{t("local")}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
