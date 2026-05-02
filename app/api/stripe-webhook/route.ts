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
// Successful sponsorships are logged to the Vercel function logs with the
// full application metadata so you can manually review and add the partner
// to lib/startups.ts. Future versions can plug in email/Slack/DB.

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
        console.log(
          "[stripe-webhook] NEW SPONSORSHIP:",
          JSON.stringify(
            {
              session_id: session.id,
              customer_email: session.customer_email ?? meta.contact_email,
              amount_total: session.amount_total,
              currency: session.currency,
              tier: meta.tier,
              startup_name: meta.startup_name,
              one_liner: meta.one_liner,
              description: meta.description,
              category: meta.category,
              url: meta.url,
              founders: meta.founders,
              hq: meta.hq,
            },
            null,
            2,
          ),
        );
      }
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const meta = sub.metadata ?? {};
      if (meta.kind === "miami_ledger_startup_sponsorship") {
        console.log("[stripe-webhook] CANCELLED SPONSORSHIP:", {
          subscription_id: sub.id,
          tier: meta.tier,
          startup_name: meta.startup_name,
          contact_email: meta.contact_email,
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
