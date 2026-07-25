"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as topojson from "topojson-client";
import { ORIGIN_LIST, productsForOrigin, parseLatLng } from "@/data/catalog";
import { MARKETS, HUB, MARKET_COUNTRIES } from "@/data/markets";

type Loc = {
  id: string;
  name: string;
  sub: string;
  detail: string;
  kind: "origin" | "market" | "hub";
  lat: number;
  lng: number;
};

type PointDatum = Loc & { color: string; r: number; label: string };

// Warm "paper globe" palette — ink-green land dots on a cream sphere.
const LAND = "rgba(30,61,42,0.42)"; // ink-green landmass dots
const MARKET_HEX = "rgba(224,162,62,0.85)"; // amber-lit market countries
const PAPER = "#e7e2d6"; // sphere (sand)
const AMBER = "#c58a2a"; // markets + hub (slightly deeper than UI amber for cream)
const GREEN_DOT = "#1b5e3f"; // sourcing pins

function card(title: string, sub: string, body: string, accent: string) {
  return `<div style="font-family:ui-monospace,monospace;background:#f0ece2;border:1px solid ${accent};border-radius:10px;padding:10px 12px;max-width:240px;color:#1e3d2a;box-shadow:0 12px 30px rgba(20,39,27,.18)">
    <div style="font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${accent}">${sub}</div>
    <div style="font-size:15px;font-weight:600;margin-top:3px">${title}</div>
    <div style="font-size:11px;line-height:1.5;color:rgba(90,94,83,.9);margin-top:5px">${body}</div>
  </div>`;
}

// Build the location directory from the catalog + markets (single source).
const SOURCING: Loc[] = ORIGIN_LIST.map((o) => {
  const { lat, lng } = parseLatLng(o.coords);
  const prods = productsForOrigin(o.slug).map((p) => p.name).join(" · ");
  return {
    id: o.slug,
    name: o.name,
    sub: o.country,
    detail: prods || "Multiple lines",
    kind: "origin",
    lat,
    lng,
  };
});

const SELLING: Loc[] = MARKETS.map((m) => ({
  id: m.slug,
  name: m.name,
  sub: `via ${m.via}`,
  detail: m.blurb,
  kind: "market",
  lat: m.lat,
  lng: m.lng,
}));

const HUB_LOC: Loc = {
  id: "hub",
  name: HUB.name,
  sub: "Hub",
  detail: HUB.blurb,
  kind: "hub",
  lat: HUB.lat,
  lng: HUB.lng,
};

const LOC_BY_ID: Record<string, Loc> = Object.fromEntries(
  [...SOURCING, ...SELLING, HUB_LOC].map((l) => [l.id, l]),
);

// Paint the sphere as warm matte "paper". Returns true once the material exists.
/* eslint-disable @typescript-eslint/no-explicit-any */
function paintMaterial(m: any): boolean {
  if (!m || !m.color) return false;
  m.color.set(PAPER);
  if (m.emissive) {
    m.emissive.set("#d8d0bd");
    m.emissiveIntensity = 0.22;
  }
  if ("shininess" in m) m.shininess = 0;
  m.needsUpdate = true;
  return true;
}
function applyPaperMaterial(g: any): boolean {
  if (!g) return false;
  if (typeof g.globeMaterial === "function" && paintMaterial(g.globeMaterial())) return true;
  // react-globe.gl 2.38 doesn't expose globeMaterial() on the ref, so reach into
  // the scene and paint the globe surface — the SphereGeometry with a
  // MeshPhongMaterial (the atmosphere is a ShaderMaterial; points are cylinders).
  if (typeof g.scene === "function") {
    let done = false;
    g.scene()?.traverse((o: any) => {
      const m = o.material;
      if (o.isMesh && /Sphere/.test(o.geometry?.type ?? "") && m?.type === "MeshPhongMaterial") {
        if (paintMaterial(m)) done = true;
      }
    });
    return done;
  }
  return false;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function TradeGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>(null);
  const [GlobeComp, setGlobeComp] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pointerOver, setPointerOver] = useState(false);

  useEffect(() => {
    let alive = true;
    import("react-globe.gl").then((mod) => {
      if (alive) setGlobeComp(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    fetch("/geo/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        const fc = topojson.feature(topo, topo.objects.countries) as any;
        setFeatures(fc.features);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      // Keep height < width so the globe (which scales to canvas height) always
      // fits horizontally and never clips off the sides on narrow screens.
      const h = Math.min(560, Math.round(w * 0.9));
      setSize({ w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pause auto-rotation while hovering or with a location selected — so the
  // target holds still and is easy to read/click.
  useEffect(() => {
    const g = globeEl.current;
    if (!g || !g.controls) return;
    g.controls().autoRotate = !pointerOver && !selected;
  }, [pointerOver, selected, GlobeComp, features]);

  const points = useMemo<PointDatum[]>(() => {
    const mk = (l: Loc, color: string, base: number, body: string): PointDatum => ({
      ...l,
      color,
      r: base * (l.id === selected ? 2.1 : l.id === hovered ? 1.6 : 1),
      label: card(l.name, l.kind === "origin" ? `Sourcing · ${l.sub}` : l.kind === "market" ? `Market · ${l.sub}` : "Hub", body, color),
    });
    return [
      ...SOURCING.map((l) => mk(l, GREEN_DOT, 0.3, `${l.detail}<br/>${ORIGIN_LIST.find((o) => o.slug === l.id)?.coords ?? ""}`)),
      ...SELLING.map((l) => mk(l, AMBER, 0.5, l.detail)),
      mk(HUB_LOC, AMBER, 0.62, HUB_LOC.detail),
    ];
  }, [selected, hovered]);

  const arcs = useMemo(() => {
    const inbound = SOURCING.map((l) => ({
      startLat: l.lat,
      startLng: l.lng,
      endLat: HUB.lat,
      endLng: HUB.lng,
      color: ["rgba(27,94,63,0.04)", "rgba(27,94,63,0.75)"],
      time: 3600,
      label: `${l.name} → Hong Kong`,
    }));
    const outbound = SELLING.map((l) => ({
      startLat: HUB.lat,
      startLng: HUB.lng,
      endLat: l.lat,
      endLng: l.lng,
      color: ["rgba(197,138,42,0.8)", "rgba(197,138,42,0.15)"],
      time: 2800,
      label: `Hong Kong → ${l.name}`,
    }));
    return [...inbound, ...outbound];
  }, []);

  const rings = useMemo(() => [{ lat: HUB.lat, lng: HUB.lng }], []);
  const ready = GlobeComp && features.length > 0 && size.w > 0;

  // onGlobeReady can fire before the WebGL material exists (esp. on slow GPUs),
  // so keep trying briefly until the paper material actually takes.
  useEffect(() => {
    if (!ready) return;
    let tries = 0;
    const id = setInterval(() => {
      if (applyPaperMaterial(globeEl.current) || ++tries > 50) clearInterval(id);
    }, 120);
    return () => clearInterval(id);
  }, [ready]);

  function focusOn(l: Loc) {
    const g = globeEl.current;
    if (g) g.pointOfView({ lat: l.lat, lng: l.lng, altitude: 1.6 }, 900);
  }

  function selectLoc(id: string) {
    setSelected((cur) => (cur === id ? null : id));
    const l = LOC_BY_ID[id];
    if (l && selected !== id) focusOn(l);
  }

  function handleReady() {
    const g = globeEl.current;
    if (!g) return;
    const c = g.controls();
    c.autoRotate = true;
    c.autoRotateSpeed = 0.35;
    c.enableZoom = true;
    c.minDistance = 180;
    c.maxDistance = 520;
    g.pointOfView({ lat: 20, lng: 104, altitude: 2.4 }, 0);
    applyPaperMaterial(g);
  }

  function row(l: Loc, accent: string) {
    const isSel = selected === l.id;
    return (
      <button
        key={l.id}
        type="button"
        onClick={() => selectLoc(l.id)}
        onMouseEnter={() => setHovered(l.id)}
        onMouseLeave={() => setHovered((h) => (h === l.id ? null : h))}
        className="group flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors"
        style={{
          borderColor: isSel ? accent : "rgba(90,94,83,0.16)",
          backgroundColor: isSel ? "rgba(231,226,214,0.7)" : "transparent",
        }}
      >
        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
        <span className="min-w-0">
          <span className="flex items-baseline gap-2">
            <span className="display text-base text-green">{l.name}</span>
            <span className="mono text-[10px] uppercase tracking-wide text-stone/50">{l.sub}</span>
          </span>
          <span className="mono mt-0.5 block truncate text-[11px] text-stone/70">{l.detail}</span>
        </span>
      </button>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-stretch">
      <div
        ref={wrapRef}
        className="relative w-full min-w-0 overflow-hidden rounded-2xl border border-stone/12 bg-oat"
        onPointerEnter={() => setPointerOver(true)}
        onPointerLeave={() => {
          setPointerOver(false);
          setHovered(null);
        }}
      >
        {!ready && (
          <div className="flex items-center justify-center" style={{ height: size.h || 460 }}>
            <span className="mono text-[11px] uppercase tracking-widest text-stone/50">Loading trade map…</span>
          </div>
        )}
        {ready && (
          <GlobeComp
            ref={globeEl}
            width={size.w}
            height={size.h}
            onGlobeReady={handleReady}
            onGlobeClick={() => setSelected(null)}
            backgroundColor="rgba(0,0,0,0)"
            atmosphereColor="#d9cba8"
            atmosphereAltitude={0.1}
            hexPolygonsData={features}
            hexPolygonResolution={3}
            hexPolygonMargin={0.3}
            hexPolygonUseDots={true}
            hexPolygonAltitude={0.006}
            hexPolygonColor={(d: any) =>
              MARKET_COUNTRIES.has(d.properties?.name) ? MARKET_HEX : LAND
            }
            pointsData={points}
            pointColor={(d: any) => d.color}
            pointAltitude={(d: any) => (d.id === selected ? 0.05 : 0.012)}
            pointRadius={(d: any) => d.r}
            pointLabel={(d: any) => d.label}
            pointsMerge={false}
            onPointClick={(d: any) => selectLoc(d.id)}
            onPointHover={(d: any) => setHovered(d ? d.id : null)}
            arcsData={arcs}
            arcColor={(d: any) => d.color}
            arcStroke={0.5}
            arcDashLength={0.4}
            arcDashGap={0.18}
            arcDashInitialGap={() => Math.random()}
            arcDashAnimateTime={(d: any) => d.time}
            arcAltitudeAutoScale={0.5}
            arcLabel={(d: any) => d.label}
            ringsData={rings}
            ringColor={() => (t: number) => `rgba(197,138,42,${1 - t})`}
            ringMaxRadius={4}
            ringPropagationSpeed={2}
            ringRepeatPeriod={1100}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col rounded-2xl border border-stone/12 bg-sand/50 p-4" style={{ maxHeight: size.h ? size.h : undefined }}>
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="mono text-[11px] uppercase tracking-widest text-stone/60">Locations</span>
          {selected && (
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mono text-[10px] uppercase tracking-wide text-amber transition-opacity hover:opacity-75"
            >
              Reset view
            </button>
          )}
        </div>
        <div className="-mr-1 space-y-3 overflow-y-auto pr-1">
          <div>
            <p className="mono mb-2 flex items-center gap-2 px-1 text-[10px] uppercase tracking-widest text-stone/55">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GREEN_DOT }} />
              Sourcing · {SOURCING.length}
            </p>
            <div className="space-y-1.5">{SOURCING.map((l) => row(l, GREEN_DOT))}</div>
          </div>
          <div>
            <p className="mono mb-2 flex items-center gap-2 px-1 text-[10px] uppercase tracking-widest text-stone/55">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: AMBER }} />
              Markets · {SELLING.length}
            </p>
            <div className="space-y-1.5">{SELLING.map((l) => row(l, AMBER))}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
