export const ARTICLE_CATEGORIES = [
  "local",
  "fintech",
  "engineering",
  "academics",
  "video",
  "facts",
  "blueprints",
  "records",
  "startups",
  "projects",
  "whats-going-on",
] as const;

export type Category = (typeof ARTICLE_CATEGORIES)[number];
export type ArticlePlacement =
  | "homepageFeatured"
  | "homepageLatest"
  | "homepageSection"
  | "ticker"
  | "terminal"
  | "video";

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
  locations?: string[];
  body?: Array<{ _type: string; _key?: string; [key: string]: unknown }>;
  coverImageUrl?: string;
  coverImageAlt?: string;
  sources?: Array<{ label: string; url: string }>;
  placements?: ArticlePlacement[];
  source?: "cms";
};

const CUSTOM_SCREEN_CATEGORIES = new Set<Category>([
  "facts",
  "blueprints",
  "records",
  "startups",
  "projects",
  "whats-going-on",
]);

export function articleHref(article: Article) {
  if (CUSTOM_SCREEN_CATEGORIES.has(article.category)) {
    return `/articles/${article.category}/${article.slug}`;
  }
  return `/${article.category}/${article.slug}`;
}

export function hasPlacement(article: Article, placement: ArticlePlacement) {
  return article.placements?.includes(placement) ?? false;
}

export const CATEGORY_META: Record<Category, { label: string; blurb: string; accent: string }> = {
  local: { label: "Local", blurb: "Miami-Dade, the Beach, the Gables, the Grove — the city block by block.", accent: "text-accent" },
  fintech: { label: "Fintech", blurb: "The capital flows reshaping South Florida's banking, crypto, and payments rails.", accent: "text-terminal-green" },
  engineering: { label: "Engineering", blurb: "Builders, infrastructure, and the technical fabric of a growing metropolis.", accent: "text-terminal-cyan" },
  academics: { label: "Academics", blurb: "From UM to FIU to MDC — research, policy, and student journalism.", accent: "text-accent-soft" },
  video: { label: "Video", blurb: "Documentaries, interviews, and dispatches from the Ledger's video desk.", accent: "text-terminal-amber" },
  facts: { label: "Facts", blurb: "Clear answers, useful context, and the facts behind the questions.", accent: "text-terminal-amber" },
  blueprints: { label: "Blueprints", blurb: "Ideas and proposals for building the Miami of tomorrow.", accent: "text-terminal-cyan" },
  records: { label: "Records", blurb: "Public records, primary documents, and data made understandable.", accent: "text-terminal-green" },
  startups: { label: "Startups", blurb: "The companies, founders, and new ventures being built in Miami.", accent: "text-accent" },
  projects: { label: "Projects", blurb: "Apps, tools, research, and experiments built by the Ledger.", accent: "text-accent-soft" },
  "whats-going-on": { label: "What's Going On", blurb: "Conversations and dispatches about Miami, culture, and what matters now.", accent: "text-terminal-amber" },
};

// Bundled demo stories have intentionally been removed. Published content
// comes from Sanity so fictional stories cannot appear in any environment.
export const ARTICLES: Article[] = [];

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
