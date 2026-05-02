import Link from "next/link";
import { DATASETS, type DatasetMeta } from "./datasets";

export const metadata = {
  title: "The Records Desk — Miami Ledger",
  description:
    "Public-records data, made make sense of. Medicare payments, federal contracts, DOGE cuts, FEC donations, indictments, nonprofit filings — searchable, contextualized.",
};

function DatasetCard({ d }: { d: DatasetMeta }) {
  const live = d.status === "live";
  const Wrapper: React.ElementType = live ? Link : "div";
  const wrapperProps = live ? { href: `/records/${d.slug}` } : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-black/40 transition ${
        live
          ? "border-white/10 hover:border-terminal-amber/60 hover:shadow-[0_30px_80px_-30px_rgba(255,176,0,0.4)]"
          : "border-white/5 opacity-70"
      }`}
    >
      {/* Cover */}
      <div
        className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br ${d.cover}`}
      >
        <div className="absolute inset-0 terminal-grid-bg opacity-40" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-terminal text-[10px] uppercase tracking-widest">
          <span
            className={`rounded-sm px-2 py-0.5 ${
              live
                ? "bg-terminal-green/15 text-terminal-green"
                : "bg-white/10 text-foreground/60"
            }`}
          >
            {live ? "● live" : "queued"}
          </span>
          <span className="rounded-sm bg-black/40 px-2 py-0.5 text-foreground/70">
            {d.source.split(" · ")[0]}
          </span>
        </div>
        {d.hookStat && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
              {d.hookStat}
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h2
          className={`font-editorial text-2xl font-bold leading-tight transition ${
            live
              ? "text-foreground group-hover:text-terminal-amber"
              : "text-foreground/70"
          }`}
        >
          {d.title}
        </h2>
        <p className="mt-2 flex-1 text-sm leading-6 text-foreground/65">
          {d.oneLiner}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-terminal text-[10px] uppercase tracking-widest">
          <span className="text-foreground/40">{d.source}</span>
          <span
            className={live ? "text-terminal-amber" : "text-foreground/40"}
          >
            {live ? "Open dataset →" : "soon"}
          </span>
        </div>
      </div>
    </Wrapper>
  );
}

export default function RecordsPage() {
  const live = DATASETS.filter((d) => d.status === "live");
  const queued = DATASETS.filter((d) => d.status === "queued");

  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-white/10 pb-10">
        <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
          The Records Desk
        </div>
        <h1 className="mt-3 font-editorial text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-7xl">
          Public data. <span className="text-terminal-amber">Finally</span>{" "}
          legible.
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground/70">
          The federal government dumps an absurd amount of public data onto its
          own servers. Medicare payments, federal contracts, political
          donations, indictments, lobbying disclosures. Most of it is
          searchable in theory and unreadable in practice. The Records Desk
          fixes that.
        </p>
        <p className="mt-3 max-w-3xl text-foreground/60">
          Search the dataset. Click a chip. Get the desk&apos;s read on what
          you&apos;re looking at — streamed from the AI, anchored to your
          actual results, sourced from the federal docs.
        </p>
      </header>

      {live.length > 0 && (
        <section className="mt-10">
          <div className="mb-5 border-b border-white/10 pb-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
            Live · search now
          </div>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {live.map((d) => (
              <li key={d.slug}>
                <DatasetCard d={d} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {queued.length > 0 && (
        <section className="mt-14">
          <div className="mb-5 border-b border-white/10 pb-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
            Queued · shipping next
          </div>
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {queued.map((d) => (
              <li key={d.slug}>
                <DatasetCard d={d} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-16 border-t border-white/10 pt-6 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
        All datasets are public records under federal law. Editorial commentary
        is generated, anchored to the rows on screen, and not a substitute for
        verifying with the original source.
      </footer>
    </div>
  );
}
