// Line drawings of the formats we pack into — illustrative, in the house
// colours, until we have photography of finished packaging.
const STROKE = "#16240f";

export function TinArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden fill="none" stroke={STROKE} strokeWidth="1.6">
      <ellipse cx="60" cy="24" rx="38" ry="10" fill="#eceae2" />
      <path d="M22 24v14c0 5.5 17 10 38 10s38-4.5 38-10V24" fill="#eceae2" />
      <path d="M22 44v74c0 5.5 17 10 38 10s38-4.5 38-10V44" fill="#f6f6f3" />
      <path d="M22 70c0 5.5 17 10 38 10s38-4.5 38-10M22 100c0 5.5 17 10 38 10s38-4.5 38-10" />
      <path d="M22 70v30c0 5.5 17 10 38 10s38-4.5 38-10V70c0 5.5-17 10-38 10S22 75.5 22 70Z" fill="#8cc541" fillOpacity=".35" />
    </svg>
  );
}

export function PouchArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden fill="none" stroke={STROKE} strokeWidth="1.6">
      <path d="M26 14h68l4 104c0 6-17 12-38 12S22 124 22 118l4-104Z" fill="#f6f6f3" />
      <path d="M26 14h68v10H26z" fill="#eceae2" />
      <path d="M30 32h60" strokeDasharray="3 3" />
      <rect x="36" y="56" width="48" height="36" rx="3" fill="#8cc541" fillOpacity=".35" />
      <path d="M44 68h32M44 78h22" />
    </svg>
  );
}

export function CartonArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden fill="none" stroke={STROKE} strokeWidth="1.6">
      <path d="M18 46 60 30l42 16v62l-42 16-42-16V46Z" fill="#eceae2" />
      <path d="M18 46l42 16 42-16M60 62v62" />
      <path d="M39 38l42 16v14" stroke="#8cc541" strokeWidth="3" />
      <path d="M28 78l20 7.5M28 88l14 5" />
    </svg>
  );
}

export function CustomArt({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={className} aria-hidden fill="none" stroke={STROKE} strokeWidth="1.6">
      <rect x="22" y="22" width="76" height="96" rx="6" fill="#f6f6f3" strokeDasharray="5 4" />
      <circle cx="60" cy="62" r="18" fill="#8cc541" fillOpacity=".35" />
      <path d="M52 62h16M60 54v16" />
      <path d="M40 96h40M46 104h28" />
    </svg>
  );
}
