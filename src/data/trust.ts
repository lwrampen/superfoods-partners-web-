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

// PLACEHOLDER roster — replace names/roles and add photos.
export const TEAM: TeamMember[] = [
  { name: "Name to add", role: "Sourcing & partnerships", location: "Hong Kong" },
  { name: "Name to add", role: "Quality & compliance", location: "Hong Kong" },
  { name: "Name to add", role: "Logistics & operations", location: "Hong Kong" },
  { name: "Name to add", role: "Accounts & service", location: "Europe" },
];

// Certifications SFP works to — names come from the product data; drop official
// logo files in /public/certs and set `logo` to show the real marks.
export const CERTIFICATIONS: Cert[] = [
  { name: "JAS" },
  { name: "EU Organic" },
  { name: "USDA Organic" },
  { name: "HACCP" },
  { name: "FSSC 22000" },
  { name: "Kosher" },
];
