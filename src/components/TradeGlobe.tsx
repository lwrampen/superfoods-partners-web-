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

const OAT = "rgba(237,231,217,0.32)";
const AMBER = "#E0A23E";
const GREEN_DOT = "#7FD9A6";

function card(title: string, sub: string, body: string, accent: string) {
  return `<div style="font-family:ui-monospace,monospace;background:#10301f;border:1px solid ${accent};border-radius:10px;padding:10px 12px;max-width:240px;color:#EDE7D9;box-shadow:0 8px 24px rgba(0,0,0,.35)">
    <div style="font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:${accent}">${sub}</div>
    <div style="font-size:15px;font-weight:500;margin-top:3px">${title}</div>
    <div style="font-size:11px;line-height:1.5;color:rgba(237,231,217,.75);margin-top:5px">${body}</div>
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
      color: ["rgba(111,212,154,0.05)", "rgba(111,212,154,0.85)"],
      time: 3000,
      label: `${l.name} → Hong Kong`,
    }));
    const outbound = SELLING.map((l) => ({
      startLat: HUB.lat,
      startLng: HUB.lng,
      endLat: l.lat,
      endLng: l.lng,
      color: ["rgba(224,162,62,0.9)", "rgba(240,200,135,0.25)"],
      time: 2200,
      label: `Hong Kong → ${l.name}`,
    }));
    return [...inbound, ...outbound];
  }, []);

  const rings = useMemo(() => [{ lat: HUB.lat, lng: HUB.lng }], []);
  const ready = GlobeComp && features.length > 0 && size.w > 0;

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
    const m = g.globeMaterial();
    m.color.set("#0E2C1E");
    m.emissive.set("#07160F");
    m.emissiveIntensity = 0.12;
    m.shininess = 2;
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
          borderColor: isSel ? accent : "rgba(237,231,217,0.12)",
          backgroundColor: isSel ? "rgba(237,231,217,0.06)" : "transparent",
        }}
      >
        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: accent }} />
        <span className="min-w-0">
          <span className="flex items-baseline gap-2">
            <span className="text-sm font-medium text-oat">{l.name}</span>
            <span className="mono text-[10px] uppercase tracking-wide text-oat/45">{l.sub}</span>
          </span>
          <span className="mono mt-0.5 block truncate text-[11px] text-oat/55">{l.detail}</span>
        </span>
      </button>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:items-stretch">
      <div
        ref={wrapRef}
        className="relative w-full min-w-0 overflow-hidden rounded-2xl bg-forest"
        onPointerEnter={() => setPointerOver(true)}
        onPointerLeave={() => {
          setPointerOver(false);
          setHovered(null);
        }}
      >
        {!ready && (
          <div className="flex items-center justify-center" style={{ height: size.h || 460 }}>
            <span className="mono text-[11px] uppercase tracking-widest text-oat/50">Loading trade map…</span>
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
            atmosphereColor="#3B6D4F"
            atmosphereAltitude={0.18}
            hexPolygonsData={features}
            hexPolygonResolution={3}
            hexPolygonMargin={0.3}
            hexPolygonUseDots={true}
            hexPolygonAltitude={0.006}
            hexPolygonColor={(d: any) =>
              MARKET_COUNTRIES.has(d.properties?.name) ? "rgba(224,162,62,0.92)" : OAT
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
            ringColor={() => (t: number) => `rgba(224,162,62,${1 - t})`}
            ringMaxRadius={4}
            ringPropagationSpeed={2}
            ringRepeatPeriod={1100}
          />
        )}
      </div>

      <div className="flex min-w-0 flex-col rounded-2xl border border-oat/10 bg-forest/40 p-4" style={{ maxHeight: size.h ? size.h : undefined }}>
        <div className="flex items-center justify-between px-1 pb-2">
          <span className="mono text-[11px] uppercase tracking-widest text-oat/60">Locations</span>
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
            <p className="mono mb-2 flex items-center gap-2 px-1 text-[10px] uppercase tracking-widest text-oat/45">
              <span className="h-2 w-2 rounded-full" style={{ backgroundColor: GREEN_DOT }} />
              Sourcing · {SOURCING.length}
            </p>
            <div className="space-y-1.5">{SOURCING.map((l) => row(l, GREEN_DOT))}</div>
          </div>
          <div>
            <p className="mono mb-2 flex items-center gap-2 px-1 text-[10px] uppercase tracking-widest text-oat/45">
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
