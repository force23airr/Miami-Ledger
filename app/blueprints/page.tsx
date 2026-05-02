import Link from "next/link";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { BLUEPRINTS, type Blueprint } from "./blueprints";

export const metadata = {
  title: "The Blueprints — Miami Ledger",
  description:
    "Speculative designs for Miami's next 25 years. Monorails, floating parks, climate-resilient promenades, vertical farms — visions of the city as it could be.",
};

const CATEGORIES: Blueprint["category"][] = [
  "Transit",
  "Towers",
  "Climate",
  "Public Space",
  "Mixed-use",
  "Infrastructure",
];

function statusTone(status: Blueprint["status"]) {
  switch (status) {
    case "Concept":
      return "bg-white/10 text-foreground/70";
    case "Dream":
      return "bg-fuchsia-500/15 text-fuchsia-300";
    case "Proposed":
      return "bg-terminal-amber/15 text-terminal-amber";
    case "Under study":
      return "bg-terminal-green/15 text-terminal-green";
    case "Shelved":
      return "bg-terminal-red/15 text-terminal-red";
  }
}

function imagePathFor(slug: string): string | undefined {
  // Auto-detect a real rendering at /public/blueprints/<slug>.{jpg,jpeg,png,webp}
  const exts = ["jpg", "jpeg", "png", "webp"];
  for (const ext of exts) {
    const fp = join(process.cwd(), "public", "blueprints", `${slug}.${ext}`);
    if (existsSync(fp)) return `/blueprints/${slug}.${ext}`;
  }
  return undefined;
}

export default function BlueprintsPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
      <header className="border-b border-white/10 pb-10">
        <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
          The Blueprints · speculative Miami
        </div>
        <h1 className="mt-3 font-editorial text-5xl font-bold leading-[1.02] tracking-tight text-foreground sm:text-7xl">
          What if the city <span className="text-terminal-amber">actually</span>{" "}
          built the cool thing?
        </h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-foreground/70">
          Renderings, ideas, and unbuilt proposals for Miami&apos;s next
          twenty-five years. Some are concept work from the Ledger desk. Some
          are real proposals that got shelved. All of them are here to provoke
          a better conversation about what this city could be.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-terminal text-[10px] uppercase tracking-widest">
          <span className="text-foreground/40">Categories:</span>
          {CATEGORIES.map((c) => {
            const count = BLUEPRINTS.filter((b) => b.category === c).length;
            if (count === 0) return null;
            return (
              <span
                key={c}
                className="rounded-sm bg-white/5 px-2 py-0.5 text-foreground/70"
              >
                {c} <span className="text-foreground/40">· {count}</span>
              </span>
            );
          })}
        </div>
      </header>

      <ul className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {BLUEPRINTS.map((b) => {
          const img = imagePathFor(b.slug);
          return (
            <li key={b.slug}>
              <Link
                href={`/blueprints/${b.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/40 transition hover:border-terminal-amber/60 hover:shadow-[0_30px_80px_-30px_rgba(255,176,0,0.4)]"
              >
                {/* Cover */}
                <div
                  className={`relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br ${b.cover}`}
                >
                  {img && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={img}
                      alt={b.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 terminal-grid-bg opacity-40" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <div className="flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest">
                      <span
                        className={`rounded-sm px-2 py-0.5 ${statusTone(b.status)}`}
                      >
                        {b.status}
                      </span>
                      <span className="text-white/60">
                        target · {b.yearTarget}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
                    <span>{b.category}</span>
                    <span>·</span>
                    <span>{b.location}</span>
                  </div>
                  <h2 className="mt-3 font-editorial text-2xl font-bold leading-tight text-foreground transition group-hover:text-terminal-amber">
                    {b.title}
                  </h2>
                  <p className="mt-2 flex-1 text-sm leading-6 text-foreground/65">
                    {b.tagline}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3 font-terminal text-[10px] uppercase tracking-widest">
                    <span className="text-foreground/40">{b.architect}</span>
                    <span className="text-terminal-amber">
                      Read the brief →
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Submit your vision */}
      <section className="mt-16 rounded-2xl border border-terminal-amber/30 bg-gradient-to-br from-amber-500/10 via-orange-700/5 to-zinc-950 p-8 sm:p-12">
        <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          You build it, we run it.
        </div>
        <h2 className="mt-2 font-editorial text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Got a vision for Miami? Send it to the desk.
        </h2>
        <p className="mt-3 max-w-2xl text-foreground/70">
          Architects, urbanists, students, hobbyists — if you&apos;ve sketched
          something the city should see, send it over. Best submissions get
          their own brief on the Ledger and a card on this page.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="mailto:desk@miamiledger.org?subject=Blueprint%20Submission"
            className="inline-flex items-center gap-2 rounded-md border border-terminal-amber/50 bg-terminal-amber/15 px-4 py-2.5 font-terminal text-xs uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/25"
          >
            Email the desk
            <span className="opacity-60">→</span>
          </a>
          <span className="font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
            include: title · 1 paragraph · ≥1 image · contact
          </span>
        </div>
      </section>

      <footer className="mt-16 border-t border-white/10 pt-6 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
        Speculative entries marked &quot;Ledger Desk&quot; are conceptual
        provocations, not architectural commitments. Real proposals reference
        their public sources where applicable.
      </footer>
    </div>
  );
}
