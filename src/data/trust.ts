// Trust signals — team + certifications.
//
// HOW TO POPULATE WITH REAL ASSETS
// - Team photos: drop headshots in /public/team (e.g. /public/team/leonard.jpg),
//   then set `photo` below and replace the placeholder name/role.
// - Certification / partner logos: drop official SVG/PNG files in /public/certs
//   (e.g. /public/certs/eu-organic.svg) and set `logo` below.
// Both components fall back gracefully (silhouette / text plate) until the
// real asset is present, so nothing looks broken in the meantime.

export type TeamMember = {
  name: string;
  role: string;
  photo?: string; // /team/<file> — omit for silhouette fallback
  location?: string;
};

export type Cert = {
  name: string;
  logo?: string; // /certs/<file> — omit for text-plate fallback
};

// Team — portraits unified to a single studio backdrop + crop; the untouched
// originals are kept out of the build under /design-assets/team-raw.
export const TEAM: TeamMember[] = [
  { name: "Wanjin", role: "Supply chain & sourcing", photo: "/team/wanjin.jpg", location: "Hong Kong" },
  { name: "Fannie", role: "Sourcing", photo: "/team/fannie.jpg", location: "Hong Kong" },
  { name: "Candy", role: "Partnerships", photo: "/team/candy.jpg", location: "Hong Kong" },
  { name: "Lucinda", role: "Quality control", photo: "/team/lucinda.jpg", location: "Hong Kong" },
];

// Certifications — official marks supplied by SFP.
export const CERTIFICATIONS: Cert[] = [
  { name: "JAS Organic", logo: "/certs/jas.png" },
  { name: "EU Organic", logo: "/certs/eu-organic.webp" },
  { name: "USDA Organic", logo: "/certs/usda-organic.png" },
  { name: "Rainforest Alliance", logo: "/certs/rainforest-alliance.png" },
  { name: "HACCP", logo: "/certs/haccp.webp" },
  { name: "FSSC 22000", logo: "/certs/fssc-22000.webp" },
];

// Independent labs / bodies we work with (shown as a separate, lighter strip).
export const PARTNERS: Cert[] = [
  { name: "Eurofins", logo: "/certs/eurofins.png" },
  { name: "Mérieux NutriSciences", logo: "/certs/merieux.png" },
];
