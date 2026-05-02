export type Category = "local" | "fintech" | "engineering" | "academics" | "video";

export type Article = {
  slug: string;
  title: string;
  dek: string;
  category: Category;
  author: string;
  publishedAt: string;
  readMinutes: number;
  hero?: string;
  tag?: string;
};

export const CATEGORY_META: Record<Category, { label: string; blurb: string; accent: string }> = {
  local: {
    label: "Local",
    blurb: "Miami-Dade, the Beach, the Gables, the Grove — the city block by block.",
    accent: "text-accent",
  },
  fintech: {
    label: "Fintech",
    blurb: "The capital flows reshaping South Florida's banking, crypto, and payments rails.",
    accent: "text-terminal-green",
  },
  engineering: {
    label: "Engineering",
    blurb: "Builders, infrastructure, and the technical fabric of a growing metropolis.",
    accent: "text-terminal-cyan",
  },
  academics: {
    label: "Academics",
    blurb: "From UM to FIU to MDC — research, policy, and student journalism.",
    accent: "text-accent-soft",
  },
  video: {
    label: "Video",
    blurb: "Documentaries, interviews, and dispatches from the Ledger's video desk.",
    accent: "text-terminal-amber",
  },
};

export const ARTICLES: Article[] = [
  {
    slug: "brickell-skyline-shifts",
    title: "How Brickell's skyline became a balance sheet",
    dek: "A decade of foreign capital has rewritten downtown's geometry. The next decade will be written by interest rates.",
    category: "local",
    author: "A. Fernandez",
    publishedAt: "2026-04-29",
    readMinutes: 11,
    tag: "Cover",
  },
  {
    slug: "stablecoin-corridor-miami-bogota",
    title: "Inside the Miami–Bogotá stablecoin corridor",
    dek: "Remittance startups are quietly routing billions through Wynwood servers. Regulators are starting to notice.",
    category: "fintech",
    author: "M. Carrillo",
    publishedAt: "2026-04-28",
    readMinutes: 9,
    tag: "Investigation",
  },
  {
    slug: "metromover-software-rewrite",
    title: "The 40-year-old codebase keeping Metromover alive",
    dek: "An aging control system, a small team of engineers, and the politics of replacing infrastructure that mostly works.",
    category: "engineering",
    author: "J. Patel",
    publishedAt: "2026-04-27",
    readMinutes: 14,
  },
  {
    slug: "fiu-climate-lab",
    title: "FIU's basement climate lab is quietly rewriting hurricane models",
    dek: "Inside the wind tunnel where graduate students simulate Category 6 storms that don't officially exist yet.",
    category: "academics",
    author: "L. Okafor",
    publishedAt: "2026-04-26",
    readMinutes: 8,
  },
  {
    slug: "little-haiti-rezoning",
    title: "Little Haiti's rezoning fight enters its fifth year",
    dek: "Developers, residents, and a planning board that keeps deferring the question that won't go away.",
    category: "local",
    author: "C. Joseph",
    publishedAt: "2026-04-25",
    readMinutes: 7,
  },
  {
    slug: "miami-vc-q1",
    title: "Miami VC, Q1 2026: down rounds, but up belief",
    dek: "Funding shrank 18% YoY. Founders we surveyed say they're staying anyway.",
    category: "fintech",
    author: "R. Singh",
    publishedAt: "2026-04-24",
    readMinutes: 6,
  },
  {
    slug: "port-miami-cranes",
    title: "Why PortMiami's new cranes can't dock yet",
    dek: "Three super-post-Panamax cranes arrived in March. A software cert delay has them sitting idle.",
    category: "engineering",
    author: "J. Patel",
    publishedAt: "2026-04-22",
    readMinutes: 5,
  },
  {
    slug: "um-medical-ai",
    title: "UM Miller's AI triage tool faces its first audit",
    dek: "An internal review obtained by the Ledger raises questions about training data provenance.",
    category: "academics",
    author: "L. Okafor",
    publishedAt: "2026-04-21",
    readMinutes: 10,
  },
];

export const FEATURED_SLUG = "brickell-skyline-shifts";

export function articlesByCategory(cat: Category) {
  return ARTICLES.filter((a) => a.category === cat).sort(
    (a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt),
  );
}

export function getArticle(slug: string) {
  return ARTICLES.find((a) => a.slug === slug);
}

export function latest(n = 6) {
  return [...ARTICLES]
    .sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt))
    .slice(0, n);
}
