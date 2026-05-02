import Link from "next/link";
import { episodes } from "./episodes";

export const metadata = {
  title: "What's Going On — Miami Ledger",
  description:
    "A new weekly series from Miami Ledger. Honest takes on Miami, peptides, training, and the culture.",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

export default function WhatsGoingOnPage() {
  const sorted = [...episodes].sort((a, b) => a.number - b.number);
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-white/10 pb-8">
        <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
          New series · weekly drop
        </div>
        <h1 className="mt-2 font-editorial text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
          What&apos;s Going On
        </h1>
        <p className="mt-3 max-w-2xl text-foreground/70">
          Honest takes on Miami, peptides, training, and the culture — straight
          from me, no filter. New episodes every week.
        </p>
      </header>

      <ul className="mt-10 flex flex-col">
        {sorted.map((ep) => (
          <li key={ep.slug}>
            <Link
              href={`/whats-going-on/${ep.slug}`}
              className="group flex flex-col gap-2 border-b border-white/10 py-6 transition hover:bg-white/[0.02] sm:flex-row sm:items-baseline sm:gap-6"
            >
              <div className="flex w-24 shrink-0 items-baseline gap-2 font-terminal text-xs uppercase tracking-widest text-foreground/40">
                <span>EP</span>
                <span className="font-editorial text-2xl font-bold normal-case tracking-normal text-foreground">
                  {String(ep.number).padStart(2, "0")}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
                  <span>{dateFormatter.format(new Date(ep.publishedAt))}</span>
                  {ep.durationMinutes && (
                    <>
                      <span>·</span>
                      <span>{ep.durationMinutes} min</span>
                    </>
                  )}
                  {ep.status === "upcoming" && (
                    <span className="rounded-sm bg-terminal-amber/10 px-2 py-0.5 text-terminal-amber">
                      Upcoming
                    </span>
                  )}
                </div>
                <h2 className="mt-1 font-editorial text-2xl font-bold leading-tight text-foreground transition group-hover:text-accent">
                  {ep.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-foreground/65">
                  {ep.summary}
                </p>
              </div>
              <span className="shrink-0 font-terminal text-[11px] uppercase tracking-widest text-foreground/40 transition group-hover:text-accent">
                Watch →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
