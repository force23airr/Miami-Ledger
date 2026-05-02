// SPONSORED STARTUP DIRECTORY
//
// This is a paid placement directory. Startups apply via
// partnerships@miamiledger.org and pay to be featured here.
// Editorial coverage in the newsroom is independent and never paid.
//
// Tiers (visual prominence and price):
//   - featured  — top of /startups, large card, homepage rail eligible
//   - spotlight — prominent listing, medium card
//   - listing   — directory entry, compact card
//
// All entries below are EXAMPLE PLACEHOLDERS for design purposes.
// Replace with real partner data once the program is live.

export type StartupTier = "featured" | "spotlight" | "listing";
export type StartupCategory =
  | "fintech"
  | "ai"
  | "climate"
  | "health"
  | "real-estate"
  | "consumer"
  | "logistics"
  | "media";

export type Startup = {
  slug: string;
  name: string;
  oneLiner: string;
  description: string;
  category: StartupCategory;
  tier: StartupTier;
  url: string;
  founded?: number;
  hq: string; // city
  // Visual: emoji or single character used as a logo placeholder
  mark: string;
  accent: "amber" | "orange" | "green" | "cyan" | "fuchsia";
  // Sponsored window. Renders an "active sponsor" badge while live.
  sponsoredUntil?: string; // ISO date
  // Optional founder names / team blurb
  founders?: string;
  // Editorial seal flag — when true, the desk has ALSO covered them in
  // the newsroom (independent of payment). Helpful for credibility.
  alsoCovered?: boolean;
  // Example placeholder flag — set false once it's a real partner
  placeholder?: boolean;
};

export const STARTUPS: Startup[] = [
  {
    slug: "novel-payments",
    name: "Novel Payments",
    oneLiner: "Stablecoin rails for LATAM payroll.",
    description:
      "Pays workers in Mexico, Colombia, and Argentina from a US-based USDC float. Compliance handled in-house. Used by 80+ Miami operators.",
    category: "fintech",
    tier: "featured",
    url: "https://example.com/novel-payments",
    founded: 2024,
    hq: "Miami / Brickell",
    mark: "◇",
    accent: "amber",
    founders: "M. Carrillo, R. Singh",
    alsoCovered: true,
    placeholder: true,
  },
  {
    slug: "tropic-grid",
    name: "TropicGrid",
    oneLiner: "Grid-edge resilience for hurricane country.",
    description:
      "Drop-in microgrid kits for SoFlo small businesses. Solar + storage + smart islanding, monitored remotely. Sold as a service, not a unit.",
    category: "climate",
    tier: "featured",
    url: "https://example.com/tropicgrid",
    founded: 2023,
    hq: "Miami / Wynwood",
    mark: "⚡",
    accent: "green",
    founders: "L. Okafor, J. Patel",
    placeholder: true,
  },
  {
    slug: "swiftshopr",
    name: "SwiftShopr",
    oneLiner: "Skip the line. Scan. Pay. Go.",
    description:
      "AI-powered Scan & Go checkout + nutrition scanner. Built by the Ledger desk; listed here so partners can find it.",
    category: "consumer",
    tier: "spotlight",
    url: "https://swiftshopr.shop",
    founded: 2025,
    hq: "Miami",
    mark: "▲",
    accent: "amber",
    alsoCovered: true,
    placeholder: false,
  },
  {
    slug: "miller-lab",
    name: "Miller Lab",
    oneLiner: "Clinical-grade AI triage for community clinics.",
    description:
      "Spun out of UM Miller, now serving 12 South Florida clinics. Open audit policy.",
    category: "health",
    tier: "spotlight",
    url: "https://example.com/miller-lab",
    founded: 2024,
    hq: "Miami / Coral Gables",
    mark: "✚",
    accent: "cyan",
    placeholder: true,
  },
  {
    slug: "cargonet-mia",
    name: "CargoNet MIA",
    oneLiner: "Real-time cargo visibility from PortMiami to LATAM.",
    description:
      "Sensor-on-container + dashboard for shippers moving between MIA, Cartagena, and Santos. Customs APIs included.",
    category: "logistics",
    tier: "spotlight",
    url: "https://example.com/cargonet-mia",
    founded: 2022,
    hq: "Miami / Doral",
    mark: "⛯",
    accent: "cyan",
    placeholder: true,
  },
  {
    slug: "casa-stack",
    name: "Casa Stack",
    oneLiner: "Tokenized fractional ownership for SoFlo condos.",
    description:
      "Buy a slice of a Brickell unit on-chain, get the rental yield. Onboarded $14M GMV in Q1.",
    category: "real-estate",
    tier: "listing",
    url: "https://example.com/casa-stack",
    founded: 2024,
    hq: "Miami / Brickell",
    mark: "▣",
    accent: "fuchsia",
    placeholder: true,
  },
  {
    slug: "calle-ai",
    name: "Calle AI",
    oneLiner: "Bilingual customer ops AI for Miami SMBs.",
    description:
      "Spanglish-fluent agent that handles WhatsApp, IG DMs, and SMS for restaurants, salons, dental clinics.",
    category: "ai",
    tier: "listing",
    url: "https://example.com/calle-ai",
    founded: 2025,
    hq: "Miami / Little Havana",
    mark: "◢",
    accent: "orange",
    placeholder: true,
  },
  {
    slug: "publi-press",
    name: "Publi-Press",
    oneLiner: "AI newsroom infra for hyperlocal LATAM publishers.",
    description:
      "What the Ledger uses internally, productized. Translation, summarization, archive search.",
    category: "media",
    tier: "listing",
    url: "https://example.com/publi-press",
    founded: 2025,
    hq: "Miami",
    mark: "≡",
    accent: "amber",
    placeholder: true,
  },
];

export const CATEGORY_LABEL: Record<StartupCategory, string> = {
  fintech: "Fintech",
  ai: "AI",
  climate: "Climate",
  health: "Health",
  "real-estate": "Real Estate",
  consumer: "Consumer",
  logistics: "Logistics",
  media: "Media",
};

export const TIER_META: Record<
  StartupTier,
  { label: string; price: string; blurb: string }
> = {
  featured: {
    label: "Featured",
    price: "$2,500 / month",
    blurb:
      "Top of /startups, large card, eligible for the homepage rail and the Terminal global feed annotation.",
  },
  spotlight: {
    label: "Spotlight",
    price: "$900 / month",
    blurb:
      "Mid-size card on /startups, included in newsletter mentions, indexed on category landing pages.",
  },
  listing: {
    label: "Listing",
    price: "$200 / month",
    blurb:
      "Directory listing on /startups with logo, one-liner, and link. Filterable by category.",
  },
};

export function startupsByTier() {
  const out: Record<StartupTier, Startup[]> = {
    featured: [],
    spotlight: [],
    listing: [],
  };
  for (const s of STARTUPS) out[s.tier].push(s);
  return out;
}

export function topFeatured(n = 3) {
  return STARTUPS.filter((s) => s.tier === "featured").slice(0, n);
}
