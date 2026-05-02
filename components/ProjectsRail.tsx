import Link from "next/link";
import { PROJECTS, type Project } from "@/lib/projects";

const ACCENT: Record<
  Project["accent"],
  { ring: string; chip: string; chipText: string; bg: string; ctaBg: string; ctaText: string; dot: string }
> = {
  amber: {
    ring: "ring-terminal-amber/30",
    chip: "bg-terminal-amber/15",
    chipText: "text-terminal-amber",
    bg: "from-amber-500/10 via-orange-700/10 to-zinc-900/40",
    ctaBg: "bg-terminal-amber",
    ctaText: "text-ink",
    dot: "bg-terminal-amber",
  },
  orange: {
    ring: "ring-accent/30",
    chip: "bg-accent/15",
    chipText: "text-accent",
    bg: "from-orange-500/15 via-rose-800/10 to-zinc-900/40",
    ctaBg: "bg-accent",
    ctaText: "text-ink",
    dot: "bg-accent",
  },
  green: {
    ring: "ring-terminal-green/30",
    chip: "bg-terminal-green/15",
    chipText: "text-terminal-green",
    bg: "from-emerald-500/10 via-teal-900/10 to-zinc-900/40",
    ctaBg: "bg-terminal-green",
    ctaText: "text-ink",
    dot: "bg-terminal-green",
  },
  cyan: {
    ring: "ring-terminal-cyan/30",
    chip: "bg-terminal-cyan/15",
    chipText: "text-terminal-cyan",
    bg: "from-cyan-500/10 via-blue-950/30 to-zinc-900/40",
    ctaBg: "bg-terminal-cyan",
    ctaText: "text-ink",
    dot: "bg-terminal-cyan",
  },
  fuchsia: {
    ring: "ring-fuchsia-400/30",
    chip: "bg-fuchsia-400/15",
    chipText: "text-fuchsia-300",
    bg: "from-fuchsia-500/10 via-purple-900/10 to-zinc-900/40",
    ctaBg: "bg-fuchsia-400",
    ctaText: "text-ink",
    dot: "bg-fuchsia-400",
  },
};

const KIND_LABEL: Record<Project["kind"], string> = {
  ios: "iOS app",
  web: "Web app",
  research: "Research",
  product: "Product",
};

const STATUS_LABEL: Record<Project["status"], string> = {
  live: "Live",
  beta: "Beta",
  soon: "Coming soon",
};

export default function ProjectsRail({ hideHeader = false }: { hideHeader?: boolean }) {
  if (PROJECTS.length === 0) return null;

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6">
      {!hideHeader && (
        <div className="mb-6 flex items-end justify-between border-b border-white/10 pb-3">
          <div>
            <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
              Built by the desk
            </div>
            <h2 className="mt-1 font-editorial text-3xl font-bold tracking-tight">
              The Ledger ships things, too.
            </h2>
          </div>
          <span className="font-terminal text-[11px] uppercase tracking-widest text-foreground/40">
            {PROJECTS.length} project{PROJECTS.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      <div
        className={`grid gap-6 ${
          PROJECTS.length === 1
            ? "md:grid-cols-1"
            : PROJECTS.length === 2
              ? "md:grid-cols-2"
              : "md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {PROJECTS.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const a = ACCENT[project.accent];
  return (
    <article
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-7 ring-1 ${a.bg} ${a.ring}`}
    >
      <div className="absolute inset-0 [background:radial-gradient(circle_at_85%_15%,rgba(255,176,0,0.12),transparent_55%)]" />
      <div className="absolute inset-0 terminal-grid-bg opacity-25" />

      <div className="relative">
        <div className="flex flex-wrap items-center gap-2 font-terminal text-[10px] uppercase tracking-widest">
          <span className={`inline-flex items-center gap-1.5 ${a.chipText}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${a.dot} animate-blink`} />
            {STATUS_LABEL[project.status]}
          </span>
          <span className={`rounded-sm px-1.5 py-0.5 ${a.chip} ${a.chipText}`}>
            {KIND_LABEL[project.kind]}
          </span>
        </div>

        <h3 className="mt-3 font-editorial text-3xl font-bold leading-tight text-foreground">
          {project.name}
        </h3>
        <div className={`mt-1 font-editorial text-base italic ${a.chipText}`}>
          {project.tagline}
        </div>

        <p className="mt-3 max-w-md text-sm text-foreground/75">
          {project.description}
        </p>

        {project.features && project.features.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-foreground/80">
            {project.features.map((f) => (
              <li key={f} className="flex items-center gap-1.5">
                <span className={a.chipText}>›</span> {f}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          {project.primaryHref.startsWith("http") ? (
            <a
              href={project.primaryHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-terminal text-xs uppercase tracking-widest ${a.ctaBg} ${a.ctaText} hover:opacity-90`}
            >
              {project.primaryLabel}
              <span className="opacity-60">↗</span>
            </a>
          ) : (
            <Link
              href={project.primaryHref}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 font-terminal text-xs uppercase tracking-widest ${a.ctaBg} ${a.ctaText} hover:opacity-90`}
            >
              {project.primaryLabel} <span>→</span>
            </Link>
          )}
          {project.secondaryHref && project.secondaryLabel && (
            project.secondaryHref.startsWith("http") ? (
              <a
                href={project.secondaryHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 font-terminal text-xs uppercase tracking-widest text-foreground/80 hover:border-foreground/40 hover:text-foreground"
              >
                {project.secondaryLabel}
                <span className="opacity-60">↗</span>
              </a>
            ) : (
              <Link
                href={project.secondaryHref}
                className="inline-flex items-center gap-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 font-terminal text-xs uppercase tracking-widest text-foreground/80 hover:border-foreground/40 hover:text-foreground"
              >
                {project.secondaryLabel} <span>→</span>
              </Link>
            )
          )}
        </div>

        {project.caption && (
          <div className="mt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
            {project.caption}
          </div>
        )}
      </div>
    </article>
  );
}
