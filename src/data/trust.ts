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

// Team — the site groups this roster by `location`, so add people for every
// operating location (Hong Kong / Amsterdam / Salt Lake City) and they appear
// under the right heading automatically. To grow the team: add entries below
// with name, role, location and a photo in /public/team (silhouette fallback
// until a photo is set). Roles/locations are localised via the `roles` message
// namespace when a matching key exists, else shown verbatim.
export const TEAM: TeamMember[] = [
  { name: "Wanjin", role: "Supply chain & sourcing", photo: "/team/wanjin.jpg", location: "Hong Kong" },
  { name: "Fannie", role: "Sourcing", photo: "/team/fannie.jpg", location: "Hong Kong" },
  { name: "Candy", role: "Partnerships", photo: "/team/candy.jpg", location: "Hong Kong" },
  { name: "Lucinda", role: "Quality control", photo: "/team/lucinda.jpg", location: "Hong Kong" },
  // TODO (Leonard to supply): remaining team + Amsterdam / Salt Lake City people,
  // with better portraits. e.g.
  // { name: "…", role: "…", photo: "/team/….jpg", location: "Amsterdam" },
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

// Cert marks are referenced by name in several places (catalog products,
// verification page) with slightly different spellings. This maps any known
// spelling to its logo so every surface renders the same mark; unknown names
// (e.g. Kosher, for which we have no supplied asset) fall back to a text plate.
const CERT_LOGOS: Record<string, string> = {
  jas: "/certs/jas.png",
  "jas organic": "/certs/jas.png",
  "eu organic": "/certs/eu-organic.webp",
  "usda organic": "/certs/usda-organic.png",
  "rainforest alliance": "/certs/rainforest-alliance.png",
  haccp: "/certs/haccp.webp",
  "fssc 22000": "/certs/fssc-22000.webp",
};

export function toCert(name: string): Cert {
  const logo = CERT_LOGOS[name.trim().toLowerCase()];
  return logo ? { name, logo } : { name };
}
