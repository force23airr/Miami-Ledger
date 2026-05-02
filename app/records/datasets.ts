// Public-facing dataset metadata for /records.
// IMPORTANT: This file is imported by client components.
// Never put DeepSeek system prompts here — those live in
// /app/api/records/prompts.ts and are server-only.

export type DatasetStatus = "live" | "queued";

export type DatasetMeta = {
  slug: string;
  title: string;
  source: string; // e.g. "CMS Open Payments · annual release"
  status: DatasetStatus;
  oneLiner: string;
  hookStat?: string; // e.g. "$13.4B in payments tracked"
  cover: string; // tailwind gradient classes
  // Chips users see and click. Server prompts are keyed on slug.
  chips: string[];
};

export const DATASETS: DatasetMeta[] = [
  {
    slug: "doctor-money-map",
    title: "Doctor Money Map",
    source: "CMS Open Payments · 2023 release",
    status: "live",
    oneLiner:
      "Every dollar pharma and device makers paid every U.S. doctor. Search any name.",
    hookStat: "$13B+ paid · 1.2M doctors · all public",
    cover: "from-rose-500/25 via-fuchsia-700/15 to-zinc-950",
    chips: [
      "What do payments to doctors actually pay for?",
      "How big are these compared to a doctor's salary?",
      "Which drug company shows up most here, and what do they make?",
      "Does receiving these payments change how doctors prescribe?",
      "How do I check if my own doctor is in this database?",
    ],
  },
  {
    slug: "spend-wire",
    title: "The Spend Wire",
    source: "USAspending.gov · live federal contracts",
    status: "queued",
    oneLiner:
      "Every federal contract award $1M+ as it hits. Agency, recipient, dollar amount, what it's for.",
    hookStat: "Live feed · Florida-filtered",
    cover: "from-amber-500/25 via-orange-700/15 to-zinc-950",
    chips: [],
  },
  {
    slug: "doge-cuts",
    title: "DOGE Cut Tracker",
    source: "DOGE.gov public releases",
    status: "queued",
    oneLiner:
      "What got cut today, by which agency, dollar amount, justification. Running total since launch.",
    hookStat: "Daily · running total · sortable by agency",
    cover: "from-red-500/25 via-orange-700/15 to-zinc-950",
    chips: [],
  },
  {
    slug: "donor-dashboard",
    title: "The Donor Dashboard",
    source: "FEC · individual contributions",
    status: "queued",
    oneLiner:
      "Every $200+ political donation. Type a Miami zip → see who's funding what. Type a name → see their giving history.",
    hookStat: "All federal cycles · searchable",
    cover: "from-blue-500/25 via-violet-700/15 to-zinc-950",
    chips: [],
  },
  {
    slug: "indictment-wire",
    title: "The Indictment Wire",
    source: "DOJ press releases · all 94 districts",
    status: "queued",
    oneLiner:
      "Federal indictments as they drop, filtered to FL districts. Date, defendant, agency, charges.",
    hookStat: "Daily · FL-filtered · auto-summarized",
    cover: "from-zinc-500/25 via-zinc-700/15 to-zinc-950",
    chips: [],
  },
  {
    slug: "nonprofit-x-ray",
    title: "The Nonprofit X-Ray",
    source: "IRS · Form 990 bulk data",
    status: "queued",
    oneLiner:
      "Every 501(c)(3)'s books. Type a charity → CEO comp, top vendors, conflicts of interest.",
    hookStat: "1.7M nonprofits · CEO comp searchable",
    cover: "from-emerald-500/25 via-teal-700/15 to-zinc-950",
    chips: [],
  },
  {
    slug: "lobby-tracker",
    title: "The Lobby Tracker",
    source: "Senate LDA · quarterly disclosures",
    status: "queued",
    oneLiner:
      "Every $5K+ federal lobbying disclosure. Search a company → see what they're paying to influence.",
    hookStat: "$4.4B+ in 2024 disclosures · searchable",
    cover: "from-yellow-500/25 via-amber-700/15 to-zinc-950",
    chips: [],
  },
];

export function getDataset(slug: string): DatasetMeta | undefined {
  return DATASETS.find((d) => d.slug === slug);
}
