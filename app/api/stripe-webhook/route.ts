import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Stripe webhook endpoint.
//
// In the Stripe dashboard, point a webhook at:
//   https://miamiledger.org/api/stripe-webhook
// Subscribe at minimum to:
//   - checkout.session.completed
//   - customer.subscription.deleted (cancellations)
//
// Then set STRIPE_WEBHOOK_SECRET to the signing secret Stripe gives you.
//
// We log a SUMMARY only — no email addresses, no free-text application
// fields — to avoid leaking PII into Vercel logs. Full application data
// stays in the Stripe dashboard (Customer + Subscription metadata) where
// access is gated by your Stripe login. Review new sponsorships there.

function maskEmail(email: string | null | undefined): string {
  if (!email || typeof email !== "string") return "[no email]";
  const [user, domain] = email.split("@");
  if (!user || !domain) return "[malformed]";
  const head = user.slice(0, 2);
  return `${head}***@${domain}`;
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET not configured");
    return new Response("missing webhook secret", { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) {
    return new Response("missing stripe-signature header", { status: 400 });
  }

  const rawBody = await req.text();

  let event: Stripe.Event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (e) {
    console.error("[stripe-webhook] signature verification failed:", (e as Error).message);
    return new Response("bad signature", { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = session.metadata ?? {};
      if (meta.kind === "miami_ledger_startup_sponsorship") {
        // Summary log only. Full data is in Stripe dashboard metadata.
        console.log("[stripe-webhook] new sponsorship", {
          session_id: session.id,
          tier: meta.tier,
          category: meta.category,
          email: maskEmail(session.customer_email ?? meta.contact_email),
          amount_total: session.amount_total,
          currency: session.currency,
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const meta = sub.metadata ?? {};
      if (meta.kind === "miami_ledger_startup_sponsorship") {
        console.log("[stripe-webhook] sponsorship cancelled", {
          subscription_id: sub.id,
          tier: meta.tier,
          email: maskEmail(meta.contact_email),
        });
      }
      break;
    }

    default:
      // ignore other event types
      break;
  }

  return new Response("ok", { status: 200 });
}
