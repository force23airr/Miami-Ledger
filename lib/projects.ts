// "Built by the Desk" — apps, products, and side projects shipped under
// the Miami Ledger umbrella. Add new entries here; the homepage rail
// renders them automatically.

export type ProjectKind = "ios" | "web" | "research" | "product";

export type Project = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  kind: ProjectKind;
  status: "live" | "beta" | "soon";
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  // Visual styling for the card
  accent: "amber" | "orange" | "green" | "cyan" | "fuchsia";
  // Short bullet capabilities to render under the dek
  features?: string[];
  // Optional caption beneath the card title (e.g. ratings, version)
  caption?: string;
};

export const PROJECTS: Project[] = [
  {
    slug: "swiftshopr",
    name: "SwiftShopr",
    tagline: "Skip the line. Scan. Pay. Go.",
    description:
      "AI-powered checkout for modern retail. Scan items with your phone, pay instantly, walk out. Plus a nutrition + allergen scanner.",
    kind: "ios",
    status: "live",
    primaryHref: "https://apps.apple.com/us/app/swiftshopr/id6751731104",
    primaryLabel: "App Store",
    secondaryHref: "https://swiftshopr.shop",
    secondaryLabel: "swiftshopr.shop",
    accent: "amber",
    features: ["Scan & Go", "Nutrition scanner", "Swifty AI", "Up to 4% cashback"],
    caption: "★ 5.0 · iOS",
  },
];
