import Link from "next/link";
import {
  products,
  subscriberPrice,
  SUBSCRIBER_DISCOUNT_PERCENT,
  SUBSCRIBER_PROMO_CODE,
  type Product,
} from "./products";

export const metadata = {
  title: "Store — Miami Ledger",
  description:
    "Shop Miami Ledger gear, research peptides, supplements, and subscriber-only releases. Subscribers get 50% off everything.",
};

const categories: Product["category"][] = [
  "Peptides",
  "Supplements",
  "Gear",
  "Print",
];

export default function StorePage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-white/10 pb-8">
        <div className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50">
          The Ledger Store
        </div>
        <h1 className="mt-2 font-editorial text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          Direct from us to you.
        </h1>
        <p className="mt-3 max-w-2xl text-foreground/70">
          Research-grade peptides, supplements, gear, and subscriber-only
          releases. No middlemen.
        </p>
      </header>

      <section
        aria-label="Subscriber discount"
        className="terminal-grid-bg mt-10 overflow-hidden rounded-2xl border border-accent/40 bg-accent/[0.06] p-8 sm:p-10"
      >
        <div className="font-terminal text-[11px] uppercase tracking-widest text-accent">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
          Subscribers save {SUBSCRIBER_DISCOUNT_PERCENT}%
        </div>
        <h2 className="mt-3 font-editorial text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Half off everything in the store.
        </h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          Active Ledger subscribers use code{" "}
          <span className="rounded-sm bg-accent/15 px-1.5 py-0.5 font-terminal text-sm text-accent">
            {SUBSCRIBER_PROMO_CODE}
          </span>{" "}
          at checkout. Not a subscriber yet?{" "}
          <Link href="/" className="text-accent underline underline-offset-4">
            Subscribe and save instantly.
          </Link>
        </p>
      </section>

      {categories.map((category) => {
        const items = products.filter((p) => p.category === category);
        if (items.length === 0) return null;
        return (
          <section key={category} className="mt-16">
            <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-3">
              <h2 className="font-editorial text-3xl font-bold tracking-tight text-foreground">
                {category}
              </h2>
              <span className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((product) => (
                <li key={product.slug}>
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <footer className="mt-20 border-t border-white/10 pt-8 font-terminal text-[11px] leading-6 uppercase tracking-widest text-foreground/40">
        Research peptides are sold for laboratory and research purposes only.
        Not intended for human consumption, diagnosis, or treatment of any
        condition. By purchasing you confirm you are 21+ and a qualified
        researcher.
      </footer>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const subPrice = subscriberPrice(product.price);
  return (
    <Link
      href={`/store/${product.slug}`}
      className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.02] p-6 transition hover:border-accent/50 hover:bg-white/[0.05]"
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-sm bg-white/10 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-foreground/70">
          {product.category}
        </span>
        {product.audience === "Subscriber" && (
          <span className="rounded-sm bg-accent/15 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-accent">
            Subscriber
          </span>
        )}
        {product.researchOnly && (
          <span className="rounded-sm bg-terminal-amber/10 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
            Research
          </span>
        )}
        {!product.inStock && (
          <span className="rounded-sm bg-terminal-red/15 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-red">
            Sold out
          </span>
        )}
      </div>
      <h3 className="mt-4 font-editorial text-xl leading-snug text-foreground transition group-hover:text-accent">
        {product.name}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-6 text-foreground/60">
        {product.tagline}
      </p>
      <div className="mt-6 flex items-baseline gap-3 border-t border-white/10 pt-4">
        <span className="font-editorial text-2xl font-bold text-foreground">
          ${product.price.toFixed(2)}
        </span>
        <span className="font-terminal text-[11px] uppercase tracking-widest text-accent">
          ${subPrice.toFixed(2)} subscriber
        </span>
      </div>
    </Link>
  );
}
