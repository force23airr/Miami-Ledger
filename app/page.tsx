import Link from "next/link";
import {
  CATEGORY_META,
  articleHref,
  hasPlacement,
} from "@/lib/articles";
import { getAllArticles } from "@/sanity/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import Ticker from "@/components/Ticker";
import ProjectsRail from "@/components/ProjectsRail";
import StartupsRail from "@/components/StartupsRail";
import LocalNewsFinder from "@/components/LocalNewsFinder";

export default async function Home() {
  const articles = await getAllArticles();
  if (articles.length === 0) {
    return (
      <div>
        <Ticker tone="amber" headlines={[]} />
        <LocalNewsFinder />
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="rounded-2xl border border-accent/25 bg-white/[0.02] p-8 text-center sm:p-12">
            <div className="font-terminal text-[10px] uppercase tracking-[0.24em] text-accent">
              Miami Ledger newsroom
            </div>
            <h1 className="mt-3 font-editorial text-4xl font-bold tracking-tight">
              The next story starts here.
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-foreground/60">
              No stories are published yet. Open the Studio to file the first
              verified report.
            </p>
            <Link
              href="/studio"
              className="mt-6 inline-flex rounded-md bg-accent px-5 py-3 font-terminal text-xs font-bold uppercase tracking-widest text-ink transition hover:bg-accent-soft"
            >
              Open the Studio →
            </Link>
          </div>
        </section>
      </div>
    );
  }
  const featured = articles.find((article) => hasPlacement(article, "homepageFeatured"))
    ?? articles.find((article) => article.source !== "cms" && article.tag?.toLowerCase() === "cover")
    ?? articles[0];
  const recent = articles
    .filter((article) =>
      article.slug !== featured.slug &&
      (article.source !== "cms" || hasPlacement(article, "homepageLatest")),
    )
    .slice(0, 5);
  const leadStories = [featured, ...recent].slice(0, 3);
  const tickerHeadlines = articles
    .filter((article) => hasPlacement(article, "ticker"))
    .map((article) => `${article.category.toUpperCase()} — ${article.title}`);
  const beats: ("local" | "fintech" | "engineering" | "academics")[] = [
    "local",
    "fintech",
    "engineering",
    "academics",
  ];

  return (
    <div>
      <Ticker tone="amber" headlines={tickerHeadlines} />

      <LocalNewsFinder />

      <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl border border-accent/25 bg-[linear-gradient(120deg,rgba(255,91,31,0.14),rgba(255,176,0,0.06)_45%,rgba(255,255,255,0.02))] px-6 py-7 sm:px-8">
          <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-terminal text-[10px] uppercase tracking-[0.28em] text-accent">
                The Ledger Network · Founded in Miami
              </div>
              <h1 className="mt-2 font-editorial text-4xl font-bold leading-none tracking-tight text-foreground sm:text-5xl">
                America&apos;s <span className="text-accent">Ledger</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/65 sm:text-base">
                Independent reporting built city by city. Miami is chapter one.
              </p>
            </div>
            <div className="shrink-0 border-l-2 border-accent pl-4 font-terminal text-[10px] uppercase leading-relaxed tracking-widest text-foreground/45">
              One network<br />
              Every city has a ledger
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-end justify-between border-b border-white/10 pb-3">
          <div>
            <div className="font-terminal text-[10px] uppercase tracking-[0.24em] text-accent">
              The front page
            </div>
            <h2 className="mt-1 font-editorial text-3xl font-bold tracking-tight sm:text-4xl">
              Stories that move Miami.
            </h2>
          </div>
          <Link
            href="/local"
            className="hidden font-terminal text-[11px] uppercase tracking-widest text-foreground/50 transition hover:text-accent sm:block"
          >
            All local news →
          </Link>
        </div>

        <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {leadStories.map((article) => (
            <ArticleCard key={article.slug} article={article} variant="stack" />
          ))}
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
        <div className="grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/5 md:grid-cols-2">
          <Link
            href="/whats-going-on"
            className="group relative flex flex-col justify-between bg-background p-8 transition hover:bg-white/[0.03] sm:p-10"
          >
            <div>
              <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
                New series · weekly
              </div>
              <h2 className="mt-3 font-editorial text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                What&apos;s Going On
              </h2>
              <p className="mt-3 max-w-md text-foreground/70">
                A weekly drop. Honest takes on Miami, training, culture, and
                the culture — straight from me, no filter.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 font-terminal text-xs uppercase tracking-widest text-terminal-amber">
              Watch the series
              <span className="opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                →
              </span>
            </span>
          </Link>
          <Link
            href="/store"
            className="group relative flex flex-col justify-between bg-background p-8 transition hover:bg-white/[0.03] sm:p-10"
          >
            <div>
              <div className="font-terminal text-[11px] uppercase tracking-widest text-accent">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent" />
                The store · subscribers save 50%
              </div>
              <h2 className="mt-3 font-editorial text-4xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-5xl">
                Shop the Ledger
              </h2>
              <p className="mt-3 max-w-md text-foreground/70">
                Supplements, Ledger gear, and subscriber releases. Direct
                from us. Subscribers get half off everything.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-2 font-terminal text-xs uppercase tracking-widest text-accent">
              Enter the store
              <span className="opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100">
                →
              </span>
            </span>
          </Link>
        </div>
      </section>

      <ProjectsRail />

      <StartupsRail />

      <section className="mx-auto mt-20 max-w-7xl px-4 sm:px-6">
        {beats.map((beat) => {
          const items = articles
            .filter((article) =>
              article.category === beat &&
              (article.source !== "cms" || hasPlacement(article, "homepageSection")),
            )
            .slice(0, 3);
          if (items.length === 0) return null;
          const meta = CATEGORY_META[beat];
          return (
            <div key={beat} className="mb-16">
              <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-3">
                <div>
                  <Link
                    href={`/${beat}`}
                    className={`font-editorial text-3xl font-bold tracking-tight ${meta.accent} hover:underline`}
                  >
                    {meta.label}
                  </Link>
                  <p className="mt-1 max-w-xl text-sm text-foreground/55">{meta.blurb}</p>
                </div>
                <Link
                  href={`/${beat}`}
                  className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50 hover:text-foreground"
                >
                  See all →
                </Link>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((a) => (
                  <ArticleCard key={a.slug} article={a} variant="stack" />
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <section className="relative mx-auto mt-12 max-w-7xl overflow-hidden px-4 sm:px-6">
        <div className="terminal-grid-bg relative overflow-hidden rounded-2xl border border-terminal-amber/30 bg-terminal-bg p-8 sm:p-12">
          <div className="absolute inset-0 [background:radial-gradient(circle_at_85%_15%,rgba(255,176,0,0.18),transparent_55%)]" />
          <div className="relative grid gap-8 md:grid-cols-12">
            <div className="md:col-span-7">
              <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
                The Ledger Terminal · v0.1
              </div>
              <h2 className="mt-3 font-editorial text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Stay in the loop.
              </h2>
              <p className="mt-3 max-w-xl text-foreground/70">
                A live, multi-panel newsroom view. Every beat — Local, Fintech, Engineering,
                Academics — streaming as it happens, with video on the side and the wire across the
                top. Built for the people who can&apos;t look away.
              </p>
              <Link
                href="/terminal"
                className="mt-6 inline-flex items-center gap-3 rounded-md border border-terminal-amber/50 bg-terminal-amber/10 px-5 py-3 font-terminal text-sm uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/20 hover:shadow-[0_0_30px_rgba(255,176,0,0.3)]"
              >
                <span className="h-2 w-2 rounded-full bg-terminal-amber glow-amber" />
                Enter the Terminal
                <span>→</span>
              </Link>
            </div>
            <div className="font-terminal text-[11px] leading-relaxed text-terminal-green md:col-span-5">
              <div className="rounded-md border border-terminal-green/20 bg-black/60 p-3">
                <div className="mb-2 flex items-center justify-between text-terminal-amber">
                  <span>FIN · feed</span>
                  <span className="opacity-60">08:44:01</span>
                </div>
                {[
                  "Citadel adds 80k sqft to Brickell footprint",
                  "Bitso Miami desk hits record stablecoin throughput",
                  "OFAC issues fresh guidance on LATAM remittance KYC",
                  "Crypto.com Miami arena renewal terms leaked",
                ].map((t, i) => (
                  <div key={i} className="flex gap-2 py-0.5">
                    <span className="text-terminal-dim">›</span>
                    <span>{t}</span>
                  </div>
                ))}
                <div className="mt-2 inline-flex items-center text-terminal-green">
                  <span className="animate-blink">▮</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-md border border-white/10 bg-white/5 md:grid-cols-4">
        {[
          ["Stories filed", String(articles.length)],
          ["Active beats", "4"],
          ["Hours of video", "37"],
          ["Tips received", "212"],
        ].map(([label, value]) => (
          <div key={label} className="bg-background p-6">
            <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
              {label}
            </div>
            <div className="mt-1 font-editorial text-3xl font-bold">{value}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
