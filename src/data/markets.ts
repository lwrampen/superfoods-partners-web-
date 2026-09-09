// Sales markets — where Superfoods Partners sells (the "selling" layer on the
// trade globe). Single source of truth, mirrors how catalog.ts drives sourcing.
// `countries` are matched against world-atlas country `properties.name` so the
// globe can light up the right landmasses.

export type Market = {
  slug: string;
  name: string;
  via: string; // which brand serves this market
  blurb: string;
  lat: number;
  lng: number;
  countries: string[];
};

export const MARKETS: Market[] = [
  {
    slug: "us",
    name: "United States",
    via: "Superfoods Partners",
    blurb: "Bulk supply to US beverage, supplement and foodservice brands.",
    lat: 39.5,
    lng: -98.5,
    countries: ["United States of America"],
  },
  {
    slug: "eu",
    name: "European Union",
    via: "Pure Matcha Partners",
    blurb: "Served across the EU through our sister brand, Pure Matcha Partners.",
    lat: 50.1,
    lng: 9.5,
    countries: [
      "Germany", "France", "Netherlands", "Belgium", "Spain", "Italy", "Poland",
      "Sweden", "Denmark", "Austria", "Portugal", "Ireland", "Czechia", "Finland",
      "Greece", "Romania", "Hungary", "Slovakia", "Croatia", "Lithuania", "Latvia",
      "Estonia", "Slovenia", "Bulgaria", "Luxembourg",
    ],
  },
  {
    slug: "middle-east",
    name: "Middle East",
    via: "Superfoods Partners",
    blurb: "Growing demand across the Gulf and the Levant.",
    lat: 24.5,
    lng: 50.5,
    countries: [
      "Saudi Arabia", "United Arab Emirates", "Qatar", "Kuwait", "Oman",
      "Bahrain", "Israel", "Jordan",
    ],
  },
];

// The convergence hub every shipment routes through.
// The three co-equal operating locations (replaces the former single hub).
export type Location = { id: string; name: string; blurb: string; lat: number; lng: number };
export const LOCATIONS: Location[] = [
  { id: "hk", name: "Hong Kong", blurb: "Sourcing and QC across Asia — closest to the gardens.", lat: 22.32, lng: 114.17 },
  { id: "nl", name: "Amsterdam", blurb: "European base — commercial, ops and documentation.", lat: 52.37, lng: 4.9 },
  { id: "us", name: "Salt Lake City", blurb: "North American base, serving the Americas.", lat: 40.76, lng: -111.89 },
];

// Nearest operating location to a point — used to route map flows to whichever
// location sits closest, instead of everything converging on one hub.
export function nearestLocation(lat: number, lng: number): Location {
  let best = LOCATIONS[0];
  let bestD = Infinity;
  for (const L of LOCATIONS) {
    const dLng = Math.min(Math.abs(L.lng - lng), 360 - Math.abs(L.lng - lng));
    const d = (L.lat - lat) ** 2 + dLng ** 2;
    if (d < bestD) {
      bestD = d;
      best = L;
    }
  }
  return best;
}

export const MARKET_COUNTRIES = new Set(MARKETS.flatMap((m) => m.countries));
