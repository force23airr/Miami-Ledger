import Link from "next/link";
import { PROJECTS } from "@/lib/projects";
import ProjectsRail from "@/components/ProjectsRail";

export const metadata = {
  title: "Projects — Miami Ledger",
  description:
    "Apps, tools, and side projects shipped under the Miami Ledger umbrella.",
};

export default function ProjectsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="border-b border-white/10 pb-8">
        <Link
          href="/"
          className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40 hover:text-foreground"
        >
          ← Miami Ledger
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
              Built by the desk
            </div>
            <h1 className="mt-2 font-editorial text-5xl font-bold tracking-tight sm:text-6xl">
              Projects
            </h1>
            <p className="mt-2 max-w-2xl text-foreground/65">
              The Ledger is also a workshop. Apps, tools, and side products
              shipped under our umbrella — some live, some still cooking.
            </p>
          </div>
          <span className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
            {PROJECTS.length} project{PROJECTS.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Use the same rail component for consistency */}
      <div className="mt-2">
        <ProjectsRail hideHeader />
      </div>

      {/* Pitch your own */}
      <section className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
          Want to collaborate?
        </div>
        <h2 className="mt-2 font-editorial text-2xl font-bold sm:text-3xl">
          We build things at the Ledger. Sometimes with other people.
        </h2>
        <p className="mt-2 max-w-2xl text-foreground/70">
          If you have a Miami-flavored idea — software, hardware, research,
          media — and want a partner with distribution and a newsroom, drop us
          a line.
        </p>
        <a
          href="mailto:hello@miamiledger.org?subject=Project%20collab%20idea"
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-terminal-amber/40 bg-terminal-amber/10 px-4 py-2 font-terminal text-xs uppercase tracking-widest text-terminal-amber hover:bg-terminal-amber/20"
        >
          hello@miamiledger.org
          <span className="opacity-60">↗</span>
        </a>
      </section>
    </div>
  );
}
