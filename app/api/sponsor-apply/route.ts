import { getStripe, getTierPriceId } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Tier = "featured" | "spotlight" | "listing";
const VALID_TIERS: Tier[] = ["featured", "spotlight", "listing"];

const VALID_CATEGORIES = [
  "fintech",
  "ai",
  "climate",
  "health",
  "real-estate",
  "consumer",
  "logistics",
  "media",
] as const;

type Body = {
  name?: string;
  oneLiner?: string;
  description?: string;
  category?: string;
  url?: string;
  founders?: string;
  hq?: string;
  contactEmail?: string;
  tier?: string;
};

function err(message: string, status = 400) {
  return Response.json({ error: message }, { status });
}

function trunc(s: string, n: number) {
  return s.length > n ? s.slice(0, n) : s;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON");
  }

  const name = body.name?.trim() ?? "";
  const oneLiner = body.oneLiner?.trim() ?? "";
  const description = body.description?.trim() ?? "";
  const category = body.category?.trim() ?? "";
  const url = body.url?.trim() ?? "";
  const founders = body.founders?.trim() ?? "";
  const hq = body.hq?.trim() ?? "";
  const contactEmail = body.contactEmail?.trim() ?? "";
  const tier = body.tier?.trim() as Tier;

  if (!name || name.length > 80) return err("name required (≤80 chars)");
  if (!oneLiner || oneLiner.length > 140) return err("oneLiner required (≤140 chars)");
  if (!description || description.length > 600) return err("description required (≤600 chars)");
  if (!VALID_CATEGORIES.includes(category as (typeof VALID_CATEGORIES)[number])) {
    return err("invalid category");
  }
  if (!url || !/^https?:\/\//i.test(url)) return err("url must start with http(s)://");
  if (!hq) return err("hq required");
  if (!contactEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail)) {
    return err("valid contactEmail required");
  }
  if (!VALID_TIERS.includes(tier)) return err("invalid tier");

  const priceId = getTierPriceId(tier);
  if (!priceId) {
    return err(
      `Stripe price for tier "${tier}" is not configured. Set the matching STRIPE_PRICE_${tier.toUpperCase()} env var to a recurring Price ID from the Stripe dashboard.`,
      500,
    );
  }

  let stripe;
  try {
    stripe = getStripe();
  } catch (e) {
    return err((e as Error).message, 500);
  }

  // Build the absolute URLs Stripe needs to redirect back to. Honor the
  // request's host so this works locally and in preview deployments.
  const origin = new URL(req.url).origin;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: contactEmail,
      success_url: `${origin}/sponsor/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/sponsor?cancelled=1`,
      // Application data rides along on the session and the resulting
      // subscription so it surfaces in the Stripe dashboard for review.
      metadata: {
        kind: "miami_ledger_startup_sponsorship",
        tier,
        startup_name: trunc(name, 500),
        one_liner: trunc(oneLiner, 500),
        description: trunc(description, 500),
        category,
        url,
        founders: trunc(founders, 500),
        hq,
        contact_email: contactEmail,
      },
      subscription_data: {
        metadata: {
          kind: "miami_ledger_startup_sponsorship",
          tier,
          startup_name: trunc(name, 500),
          one_liner: trunc(oneLiner, 500),
          category,
          url,
          contact_email: contactEmail,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "auto",
    });

    if (!session.url) {
      return err("Stripe did not return a checkout URL", 500);
    }

    return Response.json({ url: session.url });
  } catch (e) {
    return err((e as Error).message, 500);
  }
}
