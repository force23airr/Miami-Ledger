export type Country = {
  code: string; // ISO-2
  name: string;
  flag: string; // emoji
  lat: number;
  lng: number;
  region: "Americas" | "Europe" | "Asia" | "Africa" | "Oceania";
  tier?: "MIA" | "MAJOR"; // visual emphasis
  headlines: string[];
};

export const COUNTRIES: Country[] = [
  // === Americas — Miami's home turf ===
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    lat: 38.0,
    lng: -97.0,
    region: "Americas",
    tier: "MIA",
    headlines: [
      "Fed signals June pause; LATAM remittance corridors react",
      "Treasury yields tick up after stronger jobs print",
      "Florida population growth slows for first time post-pandemic",
      "Senate Banking advances stablecoin framework, 14-9",
    ],
  },
  {
    code: "MX",
    name: "Mexico",
    flag: "🇲🇽",
    lat: 23.6,
    lng: -102.5,
    region: "Americas",
    tier: "MAJOR",
    headlines: [
      "Banxico holds at 10.25%, signals dovish pivot Q3",
      "Nearshoring deals push Monterrey industrial vacancy to 1.8%",
      "CDMX-Miami air corridor capacity +18% YoY",
    ],
  },
  {
    code: "BR",
    name: "Brazil",
    flag: "🇧🇷",
    lat: -14.2,
    lng: -51.9,
    region: "Americas",
    tier: "MAJOR",
    headlines: [
      "Real strengthens past 5.0 on commodity tailwind",
      "Mercado Bitcoin opens compliance HQ in Wynwood",
      "BCB approves third tokenized-deposit pilot",
      "São Paulo VC dry powder hits record $4.1B",
    ],
  },
  {
    code: "CO",
    name: "Colombia",
    flag: "🇨🇴",
    lat: 4.6,
    lng: -74.1,
    region: "Americas",
    tier: "MIA",
    headlines: [
      "Bogotá–Miami stablecoin corridor crosses $1B notional Q1",
      "Petro fiscal package faces second congressional hearing",
      "Avianca cuts MIA frequency, points to slot constraints",
    ],
  },
  {
    code: "AR",
    name: "Argentina",
    flag: "🇦🇷",
    lat: -38.4,
    lng: -63.6,
    region: "Americas",
    tier: "MAJOR",
    headlines: [
      "Milei FX unification cleared by IMF working group",
      "Vaca Muerta gas exports to Brazil up 31% MoM",
      "Buenos Aires fintech sandbox welcomes 12 new firms",
    ],
  },
  {
    code: "CL",
    name: "Chile",
    flag: "🇨🇱",
    lat: -35.7,
    lng: -71.5,
    region: "Americas",
    headlines: [
      "Lithium royalty bill clears Senate finance committee",
      "Santiago-MIA cargo lane reopens after maintenance",
    ],
  },
  {
    code: "PE",
    name: "Peru",
    flag: "🇵🇪",
    lat: -9.2,
    lng: -75.0,
    region: "Americas",
    headlines: [
      "BCRP cuts 25bps; sol weakens against dollar",
      "Copper exports to Asia at multi-year high",
    ],
  },
  {
    code: "VE",
    name: "Venezuela",
    flag: "🇻🇪",
    lat: 6.4,
    lng: -66.6,
    region: "Americas",
    tier: "MIA",
    headlines: [
      "OFAC issues fresh guidance on humanitarian channels",
      "Caracas–Doral remittance volume holds steady",
    ],
  },
  {
    code: "CU",
    name: "Cuba",
    flag: "🇨🇺",
    lat: 21.5,
    lng: -77.8,
    region: "Americas",
    tier: "MIA",
    headlines: [
      "Power grid restoration enters 14th consecutive day",
      "Havana–Miami charters resume after 3-month pause",
    ],
  },
  {
    code: "DO",
    name: "Dominican Republic",
    flag: "🇩🇴",
    lat: 18.7,
    lng: -70.2,
    region: "Americas",
    tier: "MIA",
    headlines: [
      "Punta Cana hotel pipeline tops $2.4B",
      "Central bank holds rate; tourism Q1 +9%",
    ],
  },
  {
    code: "HT",
    name: "Haiti",
    flag: "🇭🇹",
    lat: 18.9,
    lng: -72.3,
    region: "Americas",
    tier: "MIA",
    headlines: [
      "Multinational mission rotates command in Port-au-Prince",
      "Diaspora remittances via Miami corridor down 4% MoM",
    ],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    lat: 56.1,
    lng: -106.3,
    region: "Americas",
    headlines: [
      "BoC holds at 4.25%; housing prints soften",
      "Toronto fintech delegation visits Brickell next week",
    ],
  },

  // === Europe ===
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    lat: 55.4,
    lng: -3.4,
    region: "Europe",
    tier: "MAJOR",
    headlines: [
      "BoE pauses; gilt curve steepens at long end",
      "FCA opens consultation on tokenized money market funds",
      "London–Miami premium-cabin demand at 5-year high",
    ],
  },
  {
    code: "ES",
    name: "Spain",
    flag: "🇪🇸",
    lat: 40.5,
    lng: -3.7,
    region: "Europe",
    tier: "MIA",
    headlines: [
      "Madrid VC fund opens Miami-LATAM bridge office",
      "Iberia reinstates third daily MIA frequency",
      "Spanish property buyers in Brickell condo market +22% YoY",
    ],
  },
  {
    code: "DE",
    name: "Germany",
    flag: "🇩🇪",
    lat: 51.2,
    lng: 10.5,
    region: "Europe",
    headlines: [
      "ECB minutes hint at faster QT taper",
      "Frankfurt-MIA cargo throughput at decade high",
    ],
  },
  {
    code: "FR",
    name: "France",
    flag: "🇫🇷",
    lat: 46.2,
    lng: 2.2,
    region: "Europe",
    headlines: [
      "Paris Bourse hits ATH on luxury rebound",
      "Air France-KLM adds MIA premium economy",
    ],
  },
  {
    code: "IT",
    name: "Italy",
    flag: "🇮🇹",
    lat: 42.5,
    lng: 12.6,
    region: "Europe",
    headlines: [
      "Italy 10y spread to bunds tightest in 2 years",
      "Milan fashion delegation tours Miami Design District",
    ],
  },
  {
    code: "PT",
    name: "Portugal",
    flag: "🇵🇹",
    lat: 39.4,
    lng: -8.2,
    region: "Europe",
    headlines: [
      "Lisbon golden-visa wind-down enters final phase",
      "TAP confirms summer MIA frequency boost",
    ],
  },

  // === Middle East / Africa ===
  {
    code: "IL",
    name: "Israel",
    flag: "🇮🇱",
    lat: 31.0,
    lng: 34.9,
    region: "Asia",
    headlines: [
      "Shekel firms after BoI hawkish hold",
      "Tel Aviv cyber unicorn opens Miami HQ",
    ],
  },
  {
    code: "AE",
    name: "UAE",
    flag: "🇦🇪",
    lat: 23.4,
    lng: 53.8,
    region: "Asia",
    headlines: [
      "ADNOC IPO order book oversubscribed 24x",
      "Dubai-Miami direct service announced for Q4",
    ],
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    flag: "🇸🇦",
    lat: 23.9,
    lng: 45.1,
    region: "Asia",
    headlines: [
      "PIF allocates $2B to LATAM-focused fund",
      "Riyadh-Miami premium-cabin demand surges",
    ],
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    lat: -30.6,
    lng: 22.9,
    region: "Africa",
    headlines: [
      "Rand weakens after surprise SARB dissent",
      "JSE listings pipeline thinnest since 2019",
    ],
  },
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    lat: 9.1,
    lng: 8.7,
    region: "Africa",
    headlines: [
      "CBN holds rate at 26.75% in split decision",
      "Lagos fintech corridor with Miami formalized via MoU",
    ],
  },

  // === Asia ===
  {
    code: "CN",
    name: "China",
    flag: "🇨🇳",
    lat: 35.9,
    lng: 104.2,
    region: "Asia",
    tier: "MAJOR",
    headlines: [
      "PBoC injects RMB 500B via 7-day reverse repo",
      "Shanghai exports to LATAM up 11% YoY",
      "BYD Mexico plant ribbon-cutting set for July",
    ],
  },
  {
    code: "JP",
    name: "Japan",
    flag: "🇯🇵",
    lat: 36.2,
    lng: 138.3,
    region: "Asia",
    tier: "MAJOR",
    headlines: [
      "BoJ holds; yen probes 158 line",
      "Nikkei tests 41,000 on chip rally",
      "Sumitomo opens Miami trade-finance desk",
    ],
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    lat: 20.6,
    lng: 78.9,
    region: "Asia",
    tier: "MAJOR",
    headlines: [
      "RBI holds repo at 6.5%; INR steady",
      "Bengaluru SaaS firms eye Miami LATAM gateway",
      "Mumbai-MIA direct lift announced for 2027",
    ],
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    lat: 1.3,
    lng: 103.8,
    region: "Asia",
    headlines: [
      "MAS reaffirms FX-policy band at quarterly review",
      "Temasek opens family-office desk targeting Brickell wealth",
    ],
  },
  {
    code: "KR",
    name: "South Korea",
    flag: "🇰🇷",
    lat: 35.9,
    lng: 127.8,
    region: "Asia",
    headlines: [
      "KOSPI hits 18-month high on chip and biotech rally",
      "K-content delegation tours Miami studios",
    ],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    lat: -25.3,
    lng: 133.8,
    region: "Oceania",
    headlines: [
      "RBA on-hold; AUD eases vs USD",
      "Sydney–LA–MIA cargo route adds capacity",
    ],
  },
];

export function countriesByRegion() {
  const map: Record<Country["region"], Country[]> = {
    Americas: [],
    Europe: [],
    Asia: [],
    Africa: [],
    Oceania: [],
  };
  for (const c of COUNTRIES) map[c.region].push(c);
  return map;
}
