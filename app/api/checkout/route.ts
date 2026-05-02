import { NextResponse } from "next/server";
import { getProduct } from "@/app/store/products";

export async function POST(request: Request) {
  const formData = await request.formData();
  const slug = formData.get("slug");

  if (typeof slug !== "string") {
    return NextResponse.json({ error: "Missing product" }, { status: 400 });
  }

  const product = getProduct(slug);
  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }
  if (!product.inStock) {
    return NextResponse.json({ error: "Sold out" }, { status: 409 });
  }

  // TODO: integrate Stripe Checkout. Set STRIPE_SECRET_KEY in env, then create
  // a Checkout Session here and redirect the customer to session.url.
  // For now, send them to a confirmation page so the flow doesn't dead-end.
  const url = new URL("/store/checkout", request.url);
  url.searchParams.set("slug", product.slug);
  return NextResponse.redirect(url, { status: 303 });
}
