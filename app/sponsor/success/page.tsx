import Link from "next/link";

export const metadata = {
  title: "Welcome to the Ledger — Sponsorship confirmed",
};

export default function SponsorSuccessPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-green">
        <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-green animate-blink" />
        Payment confirmed · welcome aboard
      </div>
      <h1 className="mt-3 font-editorial text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
        You&apos;re in. We&apos;ll publish you within 24 hours.
      </h1>
      <p className="mt-4 max-w-2xl text-foreground/70">
        Stripe just emailed you a receipt and your subscription is active. The
        Ledger team reviews each application end-to-end (we test the link,
        confirm the category, and make sure nothing&apos;s sketchy) and your card
        goes live on miamiledger.org within one business day. Featured-tier
        sponsors also get rotated into the homepage rail.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Tile
          title="Manage subscription"
          body="Update card, change tier, or cancel anytime from your Stripe receipt link."
        />
        <Tile
          title="Edit your card"
          body="Email partnerships@miamiledger.org with any updates to your copy or assets."
        />
        <Tile
          title="Want a takeover?"
          body="Featured-tier sponsors can opt into a quarterly newsletter mention. Reply to your receipt to claim it."
        />
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          href="/startups"
          className="inline-flex items-center gap-2 rounded-md bg-terminal-amber px-5 py-3 font-terminal text-xs uppercase tracking-widest text-ink hover:opacity-90"
        >
          See the directory
          <span>→</span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-3 font-terminal text-xs uppercase tracking-widest text-foreground/85 hover:border-foreground/40 hover:text-foreground"
        >
          Miami Ledger home
        </Link>
      </div>
    </div>
  );
}

function Tile({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
        {title}
      </div>
      <p className="mt-2 text-sm text-foreground/70">{body}</p>
    </div>
  );
}
