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
    "Shop Miami Ledger gear, supplements, and subscriber-only releases. Subscribers get 50% off everything.",
};

const categories: Product["category"][] = [
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
          Supplements, gear, and subscriber-only releases. No middlemen.
        </p>
      </header>

      {/* SwiftShopr — featured app by the Ledger desk */}
      <section
        aria-label="SwiftShopr — featured app"
        className="relative mt-10 overflow-hidden rounded-2xl border border-terminal-amber/40 bg-gradient-to-br from-amber-500/10 via-orange-700/10 to-zinc-900/40 p-8 sm:p-12"
      >
        <div className="absolute inset-0 [background:radial-gradient(circle_at_85%_15%,rgba(255,176,0,0.18),transparent_55%)]" />
        <div className="absolute inset-0 terminal-grid-bg opacity-30" />

        <div className="relative grid gap-10 md:grid-cols-12 md:items-center">
          <div className="md:col-span-7">
            <div className="flex flex-wrap items-center gap-2 font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
              Featured app · built by the desk
              <span className="rounded-sm bg-terminal-amber/15 px-1.5 py-0.5 text-terminal-amber">
                iOS
              </span>
            </div>

            <h2 className="mt-3 font-editorial text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
              SwiftShopr — <span className="text-terminal-amber">skip the line.</span>
            </h2>
            <p className="mt-3 max-w-xl text-foreground/75">
              AI-powered checkout for modern retail. Scan items with your phone,
              pay instantly, walk out — no cashier, no wait. Plus a nutrition
              scanner that flags allergens and banned ingredients in real time.
            </p>

            <ul className="mt-5 grid gap-2 text-sm text-foreground/80 sm:grid-cols-2">
              <li className="flex items-start gap-2">
                <span className="text-terminal-amber">›</span> Scan &amp; Go
                checkout via phone
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-amber">›</span> Nutrition + allergen
                scanner
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-amber">›</span> Swifty AI shopping
                agent
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-amber">›</span> Up to 4% cashback
                rewards
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-amber">›</span> Shared lists,
                real-time sync
              </li>
              <li className="flex items-start gap-2">
                <span className="text-terminal-amber">›</span> Bank-level
                encryption (Stripe)
              </li>
            </ul>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="https://apps.apple.com/us/app/swiftshopr/id6751731104"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-xl border border-white/15 bg-black px-5 py-3 text-foreground transition hover:border-terminal-amber hover:bg-zinc-900"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-7 w-7 fill-foreground"
                  aria-hidden="true"
                >
                  <path d="M17.05 12.04c-.02-2.07 1.69-3.07 1.77-3.12-.97-1.41-2.47-1.6-3-1.62-1.27-.13-2.49.75-3.13.75-.65 0-1.65-.73-2.71-.71-1.39.02-2.69.81-3.41 2.06-1.46 2.53-.37 6.27 1.04 8.32.69.99 1.5 2.11 2.56 2.07 1.04-.04 1.43-.67 2.69-.67 1.25 0 1.6.67 2.7.65 1.12-.02 1.82-1 2.5-2 .79-1.15 1.11-2.27 1.13-2.32-.02-.01-2.16-.83-2.18-3.31zM15.2 5.43c.57-.7.96-1.66.85-2.62-.83.04-1.83.55-2.42 1.24-.53.61-1 1.6-.87 2.54.92.07 1.87-.46 2.44-1.16z" />
                </svg>
                <div className="leading-tight text-left">
                  <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/60">
                    Download on the
                  </div>
                  <div className="font-editorial text-lg font-bold">
                    App Store
                  </div>
                </div>
              </a>
              <a
                href="https://swiftshopr.shop"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-terminal-amber/40 bg-terminal-amber/10 px-4 py-3 font-terminal text-xs uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/20"
              >
                swiftshopr.shop
                <span className="opacity-50">↗</span>
              </a>
            </div>

            <div className="mt-4 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
              ★ 5.0 · App Store · category: business
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative mx-auto md:col-span-5">
            <div className="relative mx-auto h-[420px] w-[210px] rounded-[36px] border-[10px] border-zinc-900 bg-black shadow-[0_30px_80px_-20px_rgba(255,176,0,0.35)]">
              {/* Notch */}
              <div className="absolute left-1/2 top-1.5 h-5 w-20 -translate-x-1/2 rounded-full bg-zinc-900" />
              {/* Screen */}
              <div className="absolute inset-0 m-1 overflow-hidden rounded-[28px] bg-gradient-to-b from-zinc-950 via-black to-zinc-900 p-3">
                {/* Status bar */}
                <div className="flex items-center justify-between font-terminal text-[8px] text-foreground/60">
                  <span>9:41</span>
                  <span>●●● 5G</span>
                </div>
                {/* App header */}
                <div className="mt-4 text-center">
                  <div className="font-terminal text-[8px] uppercase tracking-widest text-terminal-amber">
                    SwiftShopr
                  </div>
                  <div className="mt-0.5 font-editorial text-sm font-bold text-foreground">
                    Skip the line.
                  </div>
                </div>
                {/* Scan target */}
                <div className="relative mt-4 h-32 rounded-xl border border-terminal-amber/40 bg-black/60">
                  <div className="absolute inset-3 rounded-lg border border-dashed border-terminal-amber/60" />
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-terminal text-[9px] uppercase tracking-widest text-terminal-amber">
                    <div>📷</div>
                    <div className="mt-1">scan barcode</div>
                  </div>
                  {/* scan line */}
                  <div className="absolute inset-x-3 top-1/2 h-px bg-terminal-amber/80 shadow-[0_0_8px_rgba(255,176,0,0.7)]" />
                </div>
                {/* Cart row */}
                <div className="mt-3 space-y-2 font-terminal text-[9px]">
                  <div className="flex items-center justify-between rounded bg-white/5 px-2 py-1.5">
                    <span className="text-foreground/80">Oat milk · 1L</span>
                    <span className="text-terminal-green">$4.99</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-white/5 px-2 py-1.5">
                    <span className="text-foreground/80">Bananas · 6ct</span>
                    <span className="text-terminal-green">$2.40</span>
                  </div>
                  <div className="flex items-center justify-between rounded bg-white/5 px-2 py-1.5">
                    <span className="text-foreground/80">Eggs · dozen</span>
                    <span className="text-terminal-green">$5.20</span>
                  </div>
                </div>
                {/* Pay button */}
                <div className="mt-3 rounded-lg bg-terminal-amber py-2 text-center font-terminal text-[10px] uppercase tracking-widest text-ink">
                  Pay &amp; Walk Out · $12.59
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
