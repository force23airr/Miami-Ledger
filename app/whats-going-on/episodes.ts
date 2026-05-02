export type Episode = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  publishedAt: string; // ISO date
  durationMinutes?: number;
  status: "published" | "upcoming";
  body?: string;
  videoUrl?: string;
};

export const episodes: Episode[] = [
  {
    slug: "ep-01-pilot",
    number: 1,
    title: "Pilot — Why I'm Starting This",
    summary:
      "Kicking off the series. What this is, who it's for, and what to expect each week.",
    publishedAt: "2026-05-08",
    durationMinutes: 12,
    status: "upcoming",
    body: "First episode of What's Going On. I'll lay out the format, the topics I want to cover, and how often new episodes will drop.",
  },
  {
    slug: "ep-02-the-real-miami",
    number: 2,
    title: "The Real Miami",
    summary:
      "What the city actually feels like right now — through people who live it, not headlines.",
    publishedAt: "2026-05-15",
    status: "upcoming",
  },
  {
    slug: "ep-03-peptide-101",
    number: 3,
    title: "Peptides 101 — Cutting Through the Hype",
    summary:
      "An honest look at what peptides are, what the research actually shows, and what to ignore.",
    publishedAt: "2026-05-22",
    status: "upcoming",
  },
];

export function getEpisode(slug: string): Episode | undefined {
  return episodes.find((e) => e.slug === slug);
}
