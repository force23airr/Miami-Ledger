import Link from "next/link";
import {
  ARTICLES,
  CATEGORY_META,
  FEATURED_SLUG,
  articlesByCategory,
  getArticle,
  latest,
} from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";
import ArticleCover from "@/components/ArticleCover";
import Ticker from "@/components/Ticker";
import ProjectsRail from "@/components/ProjectsRail";
import StartupsRail from "@/components/StartupsRail";
import LocalNewsFinder from "@/components/LocalNewsFinder";

export default function Home() {
  const featured = getArticle(FEATURED_SLUG)!;
  const recent = latest(7).filter((a) => a.slug !== FEATURED_SLUG).slice(0, 5);
  const beats: ("local" | "fintech" | "engineering" | "academics")[] = [
    "local",
    "fintech",
    "engineering",
    "academics",
  ];

  return (
    <div>
      <Ticker tone="amber" />

      <LocalNewsFinder />

      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <Link
            href={`/${featured.category}#${featured.slug}`}
            className="group relative col-span-12 block lg:col-span-8"
          >
            <ArticleCover category={featured.category} size="xl" label={featured.tag ?? "Cover Story"} />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-6 sm:p-8">
              <div className="mb-2 flex items-center gap-3 font-terminal text-[11px] uppercase tracking-widest text-white/70">
                <span className="rounded-sm bg-accent px-1.5 py-0.5 text-ink">{featured.tag ?? "Cover"}</span>
                <span>{featured.category}</span>
                <span>·</span>
                <span>{featured.readMinutes} min read</span>
              </div>
              <h1 className="font-editorial text-4xl font-bold leading-[1.05] text-white sm:text-5xl md:text-6xl">
                {featured.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">{featured.dek}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-xs text-white/70">
                <span className="font-medium text-white">{featured.author}</span>
                <span>·</span>
                <span>{new Date(featured.publishedAt).toLocaleDateString("en-US", { month: "long", day: "numeric" })}</span>
              </div>
            </div>
          </Link>

          <aside className="col-span-12 lg:col-span-4">
            <div className="flex items-baseline justify-between border-b border-white/10 pb-2">
              <span className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50">
                The latest
              </span>
              <Link href="/local" className="font-terminal text-[11px] uppercase tracking-widest text-accent hover:underline">
                More →
              </Link>
            </div>
            <div className="mt-2">
              {recent.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>

            <div className="mt-8 overflow-hidden rounded-md border border-white/10 bg-black">
              <div className="relative aspect-video bg-gradient-to-br from-amber-500/30 via-orange-700/20 to-zinc-900">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    aria-label="Play"
                    className="group inline-flex h-16 w-16 items-center justify-center rounded-full bg-white/10 backdrop-blur transition hover:bg-accent"
                  >
                    <svg viewBox="0 0 24 24" className="h-7 w-7 translate-x-0.5 fill-white">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-sm bg-black/60 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-red">
                  <span className="h-1.5 w-1.5 rounded-full bg-terminal-red animate-blink" /> On Air
                </div>
                <div className="absolute bottom-3 left-3 right-3 font-terminal text-[10px] uppercase tracking-widest text-white/70">
                  Ledger Live · Brickell skyline w/ A. Fernandez
                </div>
              </div>
              <div className="flex items-center justify-between p-3 text-xs text-foreground/60">
                <span>Watch the desk</span>
                <Link href="/video" className="text-terminal-amber hover:underline">
                  Open video desk →
                </Link>
              </div>
            </div>
          </aside>
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
                A weekly drop. Honest takes on Miami, peptides, training, and
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
                Research-grade peptides, supplements, and Ledger gear. Direct
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
          const items = articlesByCategory(beat).slice(0, 3);
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
          ["Stories filed", String(ARTICLES.length)],
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
