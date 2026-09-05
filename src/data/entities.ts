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
    city: "Salt Lake City",
    country: "United States",
    address: ["1375 Industrial Road", "Salt Lake City, UT 84104"],
    lat: 40.76,
    lon: -111.89,
    coords: "40.76°N 111.89°W",
    tz: "America/Denver",
  },
];
