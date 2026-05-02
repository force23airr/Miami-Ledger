import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProduct,
  products,
  subscriberPrice,
  SUBSCRIBER_DISCOUNT_PERCENT,
  SUBSCRIBER_PROMO_CODE,
} from "../products";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/store/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return { title: "Product not found — Miami Ledger" };
  return {
    title: `${product.name} — Miami Ledger Store`,
    description: product.tagline,
  };
}

export default async function ProductPage(props: PageProps<"/store/[slug]">) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const subPrice = subscriberPrice(product.price);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <Link
        href="/store"
        className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50 hover:text-foreground"
      >
        ← Back to store
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="rounded-sm bg-white/10 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-foreground/70">
          {product.category}
        </span>
        {product.audience === "Subscriber" && (
          <span className="rounded-sm bg-accent/15 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-accent">
            Subscriber only
          </span>
        )}
        {product.researchOnly && (
          <span className="rounded-sm bg-terminal-amber/10 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
            Research use only
          </span>
        )}
        {!product.inStock && (
          <span className="rounded-sm bg-terminal-red/15 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-red">
            Sold out
          </span>
        )}
      </div>

      <h1 className="mt-4 font-editorial text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
        {product.name}
      </h1>
      <p className="mt-3 text-lg text-foreground/70">{product.tagline}</p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
        <div className="flex items-baseline gap-4">
          <span className="font-editorial text-4xl font-bold text-foreground">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="mt-2 font-terminal text-xs uppercase tracking-widest text-accent">
          Subscribers pay ${subPrice.toFixed(2)} — save{" "}
          {SUBSCRIBER_DISCOUNT_PERCENT}% with code{" "}
          <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 text-accent">
            {SUBSCRIBER_PROMO_CODE}
          </span>
        </p>

        <form action="/api/checkout" method="post" className="mt-6">
          <input type="hidden" name="slug" value={product.slug} />
          <button
            type="submit"
            disabled={!product.inStock}
            className="group flex h-12 w-full items-center justify-center gap-2 rounded-md border border-accent/50 bg-accent/15 px-5 font-terminal text-sm uppercase tracking-widest text-accent transition hover:bg-accent hover:text-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-accent/15 disabled:hover:text-accent"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-accent group-hover:bg-ink" />
            {product.inStock ? "Buy now" : "Sold out"}
          </button>
        </form>

        <p className="mt-3 text-center font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          Secure checkout · ships within 2 business days
        </p>
      </div>

      <section className="mt-10">
        <h2 className="font-editorial text-2xl font-bold tracking-tight text-foreground">
          About this product
        </h2>
        <p className="mt-3 leading-7 text-foreground/75">
          {product.description}
        </p>
      </section>

      {product.researchOnly && (
        <section className="mt-10 rounded-xl border border-terminal-amber/30 bg-terminal-amber/5 p-5 text-sm leading-6 text-foreground/80">
          <p className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
            Research use only
          </p>
          <p className="mt-2">
            Sold strictly for laboratory and research purposes. Not for human
            consumption, diagnosis, or treatment of any condition. By
            purchasing, you confirm you are 21+ and a qualified researcher.
          </p>
        </section>
      )}
    </div>
  );
}
