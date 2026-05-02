import Link from "next/link";
import { getProduct } from "../products";

export const metadata = {
  title: "Order placed — Miami Ledger Store",
};

export default async function CheckoutPage(
  props: PageProps<"/store/checkout">,
) {
  const params = await props.searchParams;
  const slugParam = params.slug;
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const product = slug ? getProduct(slug) : undefined;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-green">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-green animate-blink" />
        Order received
      </div>
      <h1 className="mt-3 font-editorial text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Thanks — we&apos;ve got your order.
      </h1>
      <p className="mt-3 text-foreground/70">
        {product
          ? `Your ${product.name} is on the way. We'll email a confirmation shortly.`
          : "We'll email a confirmation shortly."}
      </p>
      <p className="mt-6 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
        Note: payments are not yet wired up. Placeholder until Stripe Checkout
        is connected.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/store"
          className="inline-flex h-11 items-center justify-center rounded-md border border-accent/50 bg-accent/15 px-5 font-terminal text-xs uppercase tracking-widest text-accent transition hover:bg-accent hover:text-ink"
        >
          Keep shopping
        </Link>
        <Link
          href="/"
          className="inline-flex h-11 items-center justify-center rounded-md border border-white/15 px-5 font-terminal text-xs uppercase tracking-widest text-foreground/70 transition hover:bg-white/5 hover:text-foreground"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
