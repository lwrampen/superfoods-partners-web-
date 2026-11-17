"use client";
import type { PostStatus, SiteId } from "@/lib/studio/types";

const STATUS: Record<PostStatus, { label: string; cls: string }> = {
  draft: { label: "Draft", cls: "bg-sand text-stone" },
  scheduled: { label: "Scheduled", cls: "bg-[#e9f4d9] text-[#2f5a12]" },
  publishing: { label: "Publishing", cls: "bg-forest text-offwhite" },
  live: { label: "Live", cls: "bg-lime text-forest" },
  needs_attention: { label: "Needs attention", cls: "bg-[#f7dfd2] text-[#8a3a12]" },
};

export function StatusChip({ status }: { status: PostStatus }) {
  const s = STATUS[status];
  return (
    <span className={`mono inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] ${s.cls}`}>
      {status === "publishing" ? <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" /> : null}
      {s.label}
    </span>
  );
}

export function SiteBadge({ site }: { site: SiteId }) {
  return (
    <span
      className="mono inline-flex rounded-md px-2 py-0.5 text-[10px] uppercase tracking-[0.1em]"
      style={site === "pmp" ? { background: "#e4f2d3", color: "#1c4b0c" } : { background: "#16240f", color: "#f6f6f3" }}
    >
      {site}
    </span>
  );
}

const AMS = "Europe/Amsterdam";
export const fmtDate = (iso: string) => new Date(iso.length === 10 ? `${iso}T12:00:00Z` : iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: AMS });
export const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", timeZone: AMS }) + " (Amsterdam)";

/** Europe/Amsterdam wall-clock date + time → UTC ISO instant */
export function amsterdamToUtc(date: string, time: string) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const offset = (t: number) => {
    const p = Object.fromEntries(
      new Intl.DateTimeFormat("en-US", { timeZone: AMS, hourCycle: "h23", year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric" })
        .formatToParts(new Date(t))
        .map((x) => [x.type, x.value]),
    );
    return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute) - t;
  };
  const t1 = guess - offset(guess);
  return new Date(guess - offset(t1)).toISOString();
}
/** UTC ISO → Amsterdam {date, time} for the inputs */
export function utcToAmsterdam(iso: string) {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", { timeZone: AMS, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })
      .formatToParts(new Date(iso))
      .map((x) => [x.type, x.value]),
  );
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${p.hour}:${p.minute}` };
}

export function Counter({ value, max }: { value: string; max: number }) {
  const n = [...(value ?? "")].length;
  return <span className={`mono text-[10px] ${n > max ? "font-medium text-[#b24a18]" : "text-stone/70"}`}>{n}/{max}</span>;
}

export function Label({ children, hint, right }: { children: React.ReactNode; hint?: string; right?: React.ReactNode }) {
  return (
    <span className="flex items-baseline justify-between gap-3">
      <span className="eyebrow">{children}</span>
      {right ?? (hint ? <span className="text-[11px] text-stone/70">{hint}</span> : null)}
    </span>
  );
}

export function Notice({ kind = "info", children }: { kind?: "info" | "error" | "ok"; children: React.ReactNode }) {
  const cls = kind === "error" ? "bg-[#fbeee6] text-[#8a3a12]" : kind === "ok" ? "bg-[#eaf5dc] text-[#2f5a12]" : "bg-sand text-stone";
  return <div className={`rounded-lg px-3 py-2 text-sm ${cls}`}>{children}</div>;
}
