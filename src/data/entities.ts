// The Superfoods Partners group — the umbrella and its local operating entities.
// Addresses are legal data and are not translated. Role labels are localized in UI.

export type Entity = {
  code: "HK" | "NL" | "US";
  name: string; // legal / operating name
  city: string;
  country: string;
  address: string[]; // street lines, without city/country
  lat: number;
  lon: number;
  coords: string; // display form
  tz: string; // IANA timezone for the live local clock
};

export const ENTITIES: Entity[] = [
  {
    code: "HK",
    name: "Superfoods Partners HK",
    city: "Hong Kong",
    country: "Hong Kong",
    address: [
      "1108, 11/F, Tower 3, Phase 1, Enterprise Square",
      "9 Sheung Yuet Road",
      "Kowloon Bay",
    ],
    lat: 22.32,
    lon: 114.17,
    coords: "22.32°N 114.17°E",
    tz: "Asia/Hong_Kong",
  },
  {
    code: "NL",
    name: "Superfoods Partners NL",
    city: "Amsterdam",
    country: "The Netherlands",
    address: ["Generaal Vetterstraat 85C", "1059 BT Amsterdam"],
    lat: 52.37,
    lon: 4.9,
    coords: "52.37°N 4.90°E",
    tz: "Europe/Amsterdam",
  },
  {
    code: "US",
    name: "Superfoods Partners US",
    city: "Los Angeles",
    country: "United States",
    address: ["Los Angeles, CA"],
    lat: 34.05,
    lon: -118.24,
    coords: "34.05°N 118.24°W",
    tz: "America/Los_Angeles",
  },
];

// Support hubs — real locations, but not registered legal entities, so they
// carry a city/country rather than a registered address. Together with the
// three entities above they make up the group's five locations.
export type Hub = { city: string; country: string; code: string };
export const HUBS: Hub[] = [
  { city: "Barcelona", country: "Spain", code: "ES" },
  { city: "Tokyo", country: "Japan", code: "JP" },
];
