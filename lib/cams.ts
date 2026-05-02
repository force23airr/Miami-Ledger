// PUBLIC CAMERA FEEDS for the Streets page.
//
// This file ships with placeholder URLs marked with `verified: false`.
// Replace each entry with a real public source before relying on the live
// stream. Suggested sources:
//
//   - FDOT 511 traffic cameras → https://fl511.com/Map  (District 6 = Miami-Dade)
//     For each cam, copy the snapshot URL out of the network tab, set
//     source.type = "snapshot" and paste it into source.url.
//
//   - YouTube livestreams → search "Miami beach live cam", pick a stream that
//     has been live continuously for weeks, copy the video ID from the URL,
//     and set source.type = "youtube" with source.videoId.
//
//   - City webcams (City of Miami Beach, MIA airport) → most expose an
//     iframe-friendly page; set source.type = "iframe" with source.url.
//
// Only use feeds that the operator has chosen to publish publicly. Never
// scrape private security cameras or IoT devices.

export type CamSource =
  | { type: "youtube"; videoId: string }
  | { type: "snapshot"; url: string; refreshSeconds?: number }
  | { type: "iframe"; url: string };

export type CamCategory = "traffic" | "beach" | "port" | "skyline" | "transit";

export type Cam = {
  slug: string;
  name: string;
  neighborhood: string;
  category: CamCategory;
  source: CamSource;
  // false = placeholder; replace before relying on this feed
  verified: boolean;
  // Optional credit / source attribution shown on the tile
  credit?: string;
  creditUrl?: string;
};

export const CAMS: Cam[] = [
  // === TRAFFIC (FDOT 511, Miami-Dade) ===
  {
    slug: "i95-downtown",
    name: "I-95 @ Downtown",
    neighborhood: "Downtown",
    category: "traffic",
    source: {
      type: "snapshot",
      url: "https://example.invalid/replace-me-fdot-i95-downtown.jpg",
      refreshSeconds: 5,
    },
    verified: false,
    credit: "FDOT 511",
    creditUrl: "https://fl511.com/Map",
  },
  {
    slug: "i95-airport-expy",
    name: "I-95 @ Airport Expy",
    neighborhood: "Allapattah",
    category: "traffic",
    source: {
      type: "snapshot",
      url: "https://example.invalid/replace-me-fdot-i95-airport.jpg",
      refreshSeconds: 5,
    },
    verified: false,
    credit: "FDOT 511",
    creditUrl: "https://fl511.com/Map",
  },
  {
    slug: "macarthur-causeway",
    name: "MacArthur Causeway",
    neighborhood: "Watson Island",
    category: "traffic",
    source: {
      type: "snapshot",
      url: "https://example.invalid/replace-me-fdot-macarthur.jpg",
      refreshSeconds: 5,
    },
    verified: false,
    credit: "FDOT 511",
    creditUrl: "https://fl511.com/Map",
  },
  {
    slug: "turnpike-okeechobee",
    name: "Turnpike @ Okeechobee Rd",
    neighborhood: "Hialeah Gardens",
    category: "traffic",
    source: {
      type: "snapshot",
      url: "https://example.invalid/replace-me-fdot-turnpike.jpg",
      refreshSeconds: 5,
    },
    verified: false,
    credit: "FDOT 511",
    creditUrl: "https://fl511.com/Map",
  },

  // === BEACH (YouTube livestreams) ===
  {
    slug: "south-beach-pier",
    name: "South Beach · Pier",
    neighborhood: "South Beach",
    category: "beach",
    source: { type: "youtube", videoId: "REPLACE_WITH_LIVESTREAM_ID" },
    verified: false,
    credit: "EarthCam / YouTube",
  },
  {
    slug: "ocean-drive",
    name: "Ocean Drive · Boardwalk",
    neighborhood: "South Beach",
    category: "beach",
    source: { type: "youtube", videoId: "REPLACE_WITH_LIVESTREAM_ID" },
    verified: false,
    credit: "EarthCam / YouTube",
  },
  {
    slug: "haulover-inlet",
    name: "Haulover Inlet",
    neighborhood: "Bal Harbour",
    category: "beach",
    source: { type: "youtube", videoId: "REPLACE_WITH_LIVESTREAM_ID" },
    verified: false,
    credit: "Boat Zone / YouTube",
  },
  {
    slug: "key-biscayne-surf",
    name: "Key Biscayne · Surf",
    neighborhood: "Key Biscayne",
    category: "beach",
    source: { type: "youtube", videoId: "REPLACE_WITH_LIVESTREAM_ID" },
    verified: false,
    credit: "Surfline / YouTube",
  },

  // === PORT ===
  {
    slug: "portmiami-cruise",
    name: "PortMiami · Cruise Terminals",
    neighborhood: "PortMiami",
    category: "port",
    source: { type: "youtube", videoId: "REPLACE_WITH_LIVESTREAM_ID" },
    verified: false,
    credit: "PortMiami webcam",
  },
  {
    slug: "government-cut",
    name: "Government Cut · Channel",
    neighborhood: "South Beach",
    category: "port",
    source: { type: "youtube", videoId: "REPLACE_WITH_LIVESTREAM_ID" },
    verified: false,
    credit: "EarthCam / YouTube",
  },

  // === SKYLINE ===
  {
    slug: "brickell-skyline",
    name: "Brickell Skyline",
    neighborhood: "Brickell",
    category: "skyline",
    source: { type: "youtube", videoId: "REPLACE_WITH_LIVESTREAM_ID" },
    verified: false,
    credit: "Hotel webcam / YouTube",
  },
  {
    slug: "downtown-skyline",
    name: "Downtown Miami Skyline",
    neighborhood: "Downtown",
    category: "skyline",
    source: { type: "youtube", videoId: "REPLACE_WITH_LIVESTREAM_ID" },
    verified: false,
    credit: "EarthCam / YouTube",
  },

  // === TRANSIT ===
  {
    slug: "mia-arrivals",
    name: "MIA · Terminal Curb",
    neighborhood: "MIA Airport",
    category: "transit",
    source: { type: "iframe", url: "https://example.invalid/replace-me-mia-cam" },
    verified: false,
    credit: "MIA airport webcam",
  },
];

export const CATEGORY_LABEL: Record<CamCategory, string> = {
  traffic: "Traffic",
  beach: "Beach",
  port: "Port",
  skyline: "Skyline",
  transit: "Transit",
};

export function camsByCategory() {
  const out: Record<CamCategory, Cam[]> = {
    traffic: [],
    beach: [],
    port: [],
    skyline: [],
    transit: [],
  };
  for (const c of CAMS) out[c.category].push(c);
  return out;
}
