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
export const HUB = {
  name: "Hong Kong",
  via: "Central hub",
  blurb: "Every origin converges here — consolidated, tested and documented.",
  lat: 22.32,
  lng: 114.17,
};

export const MARKET_COUNTRIES = new Set(MARKETS.flatMap((m) => m.countries));
