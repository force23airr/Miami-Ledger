function value(input: string | undefined, fallback: string): string {
  return input?.trim() || fallback;
}

// Project IDs and dataset names are public identifiers. Tokens never belong here.
export const projectId = value(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  "xxj6luk5",
);
export const dataset = value(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  "production",
);
export const apiVersion = value(
  process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  "2026-08-25",
);
