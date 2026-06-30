"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as topojson from "topojson-client";
import { ORIGIN_LIST, productsForOrigin, parseLatLng } from "@/data/catalog";
import { MARKETS, HUB, MARKET_COUNTRIES } from "@/data/markets";

type PointDatum = {
  lat: number;
  lng: number;
  kind: "origin" | "market" | "hub";
  color: string;
  r: number;
  label: string;
};

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

export function TradeGlobe() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeEl = useRef<any>(null);
  const [GlobeComp, setGlobeComp] = useState<any>(null);
  const [features, setFeatures] = useState<any[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Load the globe library client-side only (keeps SSR clean, ref stays direct).
  useEffect(() => {
    let alive = true;
    import("react-globe.gl").then((mod) => {
      if (alive) setGlobeComp(() => mod.default);
    });
    return () => {
      alive = false;
    };
  }, []);

  // Land geometry for the dotted globe surface.
  useEffect(() => {
    fetch("/geo/countries-110m.json")
      .then((r) => r.json())
      .then((topo) => {
        const fc = topojson.feature(topo, topo.objects.countries) as any;
        setFeatures(fc.features);
      })
      .catch(() => {});
  }, []);

  // Responsive sizing.
  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      const h = w >= 768 ? 600 : w >= 480 ? 480 : 380;
      setSize({ w, h });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const points = useMemo<PointDatum[]>(() => {
    const origins = ORIGIN_LIST.map((o) => {
      const { lat, lng } = parseLatLng(o.coords);
      const prods = productsForOrigin(o.slug).map((p) => p.name).join(" · ");
      return {
        lat,
        lng,
        kind: "origin" as const,
        color: GREEN_DOT,
        r: 0.28,
        label: card(o.name, `Sourcing · ${o.country}`, `${prods || "Multiple lines"}<br/>${o.coords}`, GREEN_DOT),
      };
    });
    const markets = MARKETS.map((m) => ({
      lat: m.lat,
      lng: m.lng,
      kind: "market" as const,
      color: AMBER,
      r: 0.45,
      label: card(m.name, `Market · via ${m.via}`, m.blurb, AMBER),
    }));
    const hub: PointDatum = {
      lat: HUB.lat,
      lng: HUB.lng,
      kind: "hub",
      color: AMBER,
      r: 0.6,
      label: card(HUB.name, "Hub", HUB.blurb, AMBER),
    };
    return [...origins, ...markets, hub];
  }, []);

  const arcs = useMemo(() => {
    const inbound = ORIGIN_LIST.map((o) => {
      const { lat, lng } = parseLatLng(o.coords);
      return {
        startLat: lat,
        startLng: lng,
        endLat: HUB.lat,
        endLng: HUB.lng,
        color: ["rgba(111,212,154,0.05)", "rgba(111,212,154,0.85)"],
        time: 3000,
        label: `${o.name} → Hong Kong`,
      };
    });
    const outbound = MARKETS.map((m) => ({
      startLat: HUB.lat,
      startLng: HUB.lng,
      endLat: m.lat,
      endLng: m.lng,
      color: ["rgba(224,162,62,0.9)", "rgba(240,200,135,0.25)"],
      time: 2200,
      label: `Hong Kong → ${m.name} · via ${m.via}`,
    }));
    return [...inbound, ...outbound];
  }, []);

  const rings = useMemo(() => [{ lat: HUB.lat, lng: HUB.lng }], []);

  const ready = GlobeComp && features.length > 0 && size.w > 0;

  function handleReady() {
    const g = globeEl.current;
    if (!g) return;
    const c = g.controls();
    c.autoRotate = true;
    c.autoRotateSpeed = 0.5;
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

  return (
    <div ref={wrapRef} className="relative w-full overflow-hidden rounded-2xl bg-forest">
      {!ready && (
        <div className="flex items-center justify-center" style={{ height: size.h || 480 }}>
          <span className="mono text-[11px] uppercase tracking-widest text-oat/50">Loading trade map…</span>
        </div>
      )}
      {ready && (
        <GlobeComp
          ref={globeEl}
          width={size.w}
          height={size.h}
          onGlobeReady={handleReady}
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
          pointAltitude={0.012}
          pointRadius={(d: any) => d.r}
          pointLabel={(d: any) => d.label}
          pointsMerge={false}
          arcsData={arcs}
          arcColor={(d: any) => d.color}
          arcStroke={0.5}
          arcDashLength={0.4}
          arcDashGap={0.18}
          arcDashInitialGap={(d: any) => Math.random()}
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
  );
}
