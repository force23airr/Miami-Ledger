import type { Article } from "@/lib/articles";

const LOCALITY_BY_ZIP: Record<string, string> = {
  "33127": "Little Haiti",
  "33129": "Brickell",
  "33130": "Brickell",
  "33131": "Brickell",
  "33133": "Coconut Grove",
  "33134": "Coral Gables",
  "33146": "Coral Gables",
  "33149": "Key Biscayne",
  "33156": "Pinecrest",
  "33157": "Palmetto Bay / Cutler Bay",
  "33158": "Pinecrest / Palmetto Bay",
  "33176": "Palmetto Bay",
  "33189": "Cutler Bay",
  "33190": "Cutler Bay",
};

export const LOCALITY_SUGGESTIONS = [
  "Palmetto Bay",
  "Cutler Bay",
  "Pinecrest",
  "Brickell",
  "Coral Gables",
  "Coconut Grove",
  "Little Haiti",
  "Key Biscayne",
];

export function locationLabel(value: string): string {
  const clean = value.trim().slice(0, 80);
  if (!clean) return "Miami-Dade";

  const zip = clean.match(/\b\d{5}\b/)?.[0];
  if (zip && LOCALITY_BY_ZIP[zip]) {
    return `${LOCALITY_BY_ZIP[zip]} · ${zip}`;
  }

  const known = LOCALITY_SUGGESTIONS.find(
    (locality) => locality.toLowerCase() === clean.toLowerCase(),
  );
  if (known) return known;

  return clean
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function articlesForLocation(articles: Article[], value: string): Article[] {
  const needle = value.trim().toLowerCase();
  const zip = needle.match(/\b\d{5}\b/)?.[0];
  const label = locationLabel(value).split(" · ")[0].toLowerCase();

  return articles.filter((article) =>
    article.locations?.some((location) => {
      const candidate = location.toLowerCase();
      return candidate === needle || candidate === label || candidate === zip;
    }),
  );
}
