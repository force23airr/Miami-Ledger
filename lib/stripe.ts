import Stripe from "stripe";

let cached: Stripe | null = null;

export function getStripe(): Stripe {
  if (cached) return cached;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }
  // No apiVersion pin — let the SDK use its bundled default. The Stripe
  // dashboard pins your account's API version separately.
  cached = new Stripe(key, { typescript: true });
  return cached;
}

// Tier → env var holding the Stripe Price ID for that tier's subscription.
// Set these in Vercel env: STRIPE_PRICE_FEATURED, STRIPE_PRICE_SPOTLIGHT,
// STRIPE_PRICE_LISTING (each is a recurring monthly price you create in
// the Stripe dashboard).
export const TIER_PRICE_ENV: Record<"featured" | "spotlight" | "listing", string> = {
  featured: "STRIPE_PRICE_FEATURED",
  spotlight: "STRIPE_PRICE_SPOTLIGHT",
  listing: "STRIPE_PRICE_LISTING",
};

export function getTierPriceId(tier: keyof typeof TIER_PRICE_ENV): string | null {
  const envVar = TIER_PRICE_ENV[tier];
  return process.env[envVar] ?? null;
}
