"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StartupCard from "@/components/StartupCard";
import {
  CATEGORY_LABEL,
  STARTUPS,
  TIER_META,
  type StartupCategory,
} from "@/lib/startups";

const CATEGORIES: ("all" | StartupCategory)[] = [
  "all",
  "fintech",
  "ai",
  "climate",
  "health",
  "real-estate",
  "consumer",
  "logistics",
  "media",
];

export default function StartupsPage() {
  const [filter, setFilter] = useState<"all" | StartupCategory>("all");

  const visible = useMemo(
    () =>
      filter === "all" ? STARTUPS : STARTUPS.filter((s) => s.category === filter),
    [filter],
  );

  const featured = visible.filter((s) => s.tier === "featured");
  const spotlight = visible.filter((s) => s.tier === "spotlight");
  const listings = visible.filter((s) => s.tier === "listing");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      {/* Header */}
      <div className="border-b border-white/10 pb-8">
        <Link
          href="/"
          className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40 hover:text-foreground"
        >
          ← Miami Ledger
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-terminal text-[11px] uppercase tracking-widest text-accent">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
              Sponsored directory
            </div>
            <h1 className="mt-2 font-editorial text-5xl font-bold tracking-tight sm:text-6xl">
              Miami Startups
            </h1>
            <p className="mt-2 max-w-2xl text-foreground/65">
              The companies building in the 305. Listings on this page are
              sponsored by the companies themselves. Editorial coverage in the
              newsroom is independent and never paid.
            </p>
          </div>
          <Link
            href="/sponsor"
            className="rounded-md border border-terminal-amber/40 bg-terminal-amber/10 px-4 py-2 font-terminal text-xs uppercase tracking-widest text-terminal-amber hover:bg-terminal-amber/20"
          >
            Become featured →
          </Link>
        </div>
      </div>

      {/* Filter chips */}
      <div className="mt-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => {
          const label = c === "all" ? "All" : CATEGORY_LABEL[c];
          const count =
            c === "all"
              ? STARTUPS.length
              : STARTUPS.filter((x) => x.category === c).length;
          const active = filter === c;
          return (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full border px-3 py-1 font-terminal text-[10px] uppercase tracking-widest transition ${
                active
                  ? "border-terminal-amber bg-terminal-amber/15 text-terminal-amber"
                  : "border-white/15 bg-white/5 text-foreground/70 hover:border-terminal-amber/40 hover:text-terminal-amber"
              }`}
            >
              {label} <span className="opacity-60">· {count}</span>
            </button>
          );
        })}
      </div>

      {/* Featured */}
      {featured.length > 0 && (
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between border-b border-white/10 pb-3">
            <h2 className="font-editorial text-2xl font-bold tracking-tight">
              Featured
            </h2>
            <span className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
              {featured.length}
            </span>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            {featured.map((s) => (
              <StartupCard key={s.slug} startup={s} size="lg" />
            ))}
          </div>
        </section>
      )}

      {/* Spotlight */}
      {spotlight.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between border-b border-white/10 pb-3">
            <h2 className="font-editorial text-2xl font-bold tracking-tight">
              Spotlight
            </h2>
            <span className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
              {spotlight.length}
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {spotlight.map((s) => (
              <StartupCard key={s.slug} startup={s} size="md" />
            ))}
          </div>
        </section>
      )}

      {/* Listings */}
      {listings.length > 0 && (
        <section className="mt-12">
          <div className="mb-4 flex items-end justify-between border-b border-white/10 pb-3">
            <h2 className="font-editorial text-2xl font-bold tracking-tight">
              Directory
            </h2>
            <span className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
              {listings.length}
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {listings.map((s) => (
              <StartupCard key={s.slug} startup={s} size="sm" />
            ))}
          </div>
        </section>
      )}

      {/* Sponsor CTA */}
      <section
        id="sponsor"
        className="relative mt-16 overflow-hidden rounded-2xl border border-terminal-amber/30 bg-gradient-to-br from-amber-500/10 via-orange-700/10 to-zinc-900/40 p-8 sm:p-12"
      >
        <div className="absolute inset-0 [background:radial-gradient(circle_at_85%_15%,rgba(255,176,0,0.18),transparent_55%)]" />
        <div className="absolute inset-0 terminal-grid-bg opacity-30" />

        <div className="relative">
          <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
            Become a featured startup
          </div>
          <h2 className="mt-2 font-editorial text-4xl font-bold tracking-tight sm:text-5xl">
            Get in front of Miami operators.
          </h2>
          <p className="mt-3 max-w-2xl text-foreground/75">
            The Ledger is read by founders, operators, capital, and city policy
            folks across the 305. Three placement tiers — pick what fits the
            stage you&apos;re at.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {(["featured", "spotlight", "listing"] as const).map((tier) => {
              const meta = TIER_META[tier];
              return (
                <div
                  key={tier}
                  className="rounded-xl border border-white/10 bg-black/40 p-5"
                >
                  <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
                    {meta.label}
                  </div>
                  <div className="mt-1 font-editorial text-2xl font-bold">
                    {meta.price}
                  </div>
                  <p className="mt-2 text-sm text-foreground/65">{meta.blurb}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/sponsor"
              className="inline-flex items-center gap-2 rounded-md bg-terminal-amber px-5 py-3 font-terminal text-xs uppercase tracking-widest text-ink hover:opacity-90"
            >
              Apply &amp; pay · self-serve
              <span>→</span>
            </Link>
            <a
              href="mailto:partnerships@miamiledger.org?subject=Media%20kit"
              className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-3 font-terminal text-xs uppercase tracking-widest text-foreground/85 hover:border-foreground/40 hover:text-foreground"
            >
              Request media kit
            </a>
            <span className="font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
              Stripe-secured · cancel anytime
            </span>
          </div>

          <div className="mt-8 rounded-md border border-white/5 bg-black/40 p-4 font-terminal text-[11px] leading-relaxed text-foreground/55">
            <span className="text-terminal-amber">Editorial firewall:</span>{" "}
            Sponsored placements appear only on this page and the homepage rail,
            and are clearly labeled. Newsroom coverage (Local, Fintech,
            Engineering, Academics) is independent and cannot be purchased.
          </div>
        </div>
      </section>
    </div>
  );
}
