import type { Startup } from "@/lib/startups";

const ACCENT: Record<
  Startup["accent"],
  { ring: string; bg: string; text: string; markBg: string; chip: string }
> = {
  amber: {
    ring: "ring-terminal-amber/30",
    bg: "from-amber-500/10 via-orange-700/10 to-zinc-900/40",
    text: "text-terminal-amber",
    markBg: "bg-terminal-amber/15 text-terminal-amber",
    chip: "bg-terminal-amber/15 text-terminal-amber",
  },
  orange: {
    ring: "ring-accent/30",
    bg: "from-orange-500/15 via-rose-800/10 to-zinc-900/40",
    text: "text-accent",
    markBg: "bg-accent/15 text-accent",
    chip: "bg-accent/15 text-accent",
  },
  green: {
    ring: "ring-terminal-green/30",
    bg: "from-emerald-500/10 via-teal-900/10 to-zinc-900/40",
    text: "text-terminal-green",
    markBg: "bg-terminal-green/15 text-terminal-green",
    chip: "bg-terminal-green/15 text-terminal-green",
  },
  cyan: {
    ring: "ring-terminal-cyan/30",
    bg: "from-cyan-500/10 via-blue-950/30 to-zinc-900/40",
    text: "text-terminal-cyan",
    markBg: "bg-terminal-cyan/15 text-terminal-cyan",
    chip: "bg-terminal-cyan/15 text-terminal-cyan",
  },
  fuchsia: {
    ring: "ring-fuchsia-400/30",
    bg: "from-fuchsia-500/10 via-purple-900/10 to-zinc-900/40",
    text: "text-fuchsia-300",
    markBg: "bg-fuchsia-400/15 text-fuchsia-300",
    chip: "bg-fuchsia-400/15 text-fuchsia-300",
  },
};

export default function StartupCard({
  startup,
  size = "md",
}: {
  startup: Startup;
  size?: "lg" | "md" | "sm";
}) {
  const a = ACCENT[startup.accent];

  if (size === "sm") {
    return (
      <a
        href={startup.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-terminal-amber/40 hover:bg-white/[0.05]`}
      >
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${a.markBg} font-editorial text-lg font-bold`}
        >
          {startup.mark}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate font-editorial text-base font-bold text-foreground group-hover:text-terminal-amber">
              {startup.name}
            </h3>
            <span className="font-terminal text-[9px] uppercase tracking-widest text-foreground/40">
              · {startup.hq}
            </span>
          </div>
          <p className="truncate text-sm text-foreground/65">{startup.oneLiner}</p>
        </div>
        <span className="font-terminal text-[10px] uppercase tracking-widest text-foreground/40 group-hover:text-terminal-amber">
          ↗
        </span>
      </a>
    );
  }

  // medium / large
  const isLarge = size === "lg";
  return (
    <article
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 ring-1 ${a.bg} ${a.ring} ${
        isLarge ? "sm:p-8" : ""
      }`}
    >
      <div className="absolute inset-0 [background:radial-gradient(circle_at_85%_15%,rgba(255,176,0,0.10),transparent_55%)]" />
      <div className="absolute inset-0 terminal-grid-bg opacity-25" />

      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-lg font-editorial text-xl font-bold ${a.markBg}`}
          >
            {startup.mark}
          </div>
          <div className="flex flex-wrap items-center gap-1">
            {startup.alsoCovered && (
              <span className="rounded-sm bg-white/10 px-1.5 py-0.5 font-terminal text-[9px] uppercase tracking-widest text-foreground/70">
                Editorial coverage
              </span>
            )}
            <span className={`rounded-sm px-1.5 py-0.5 font-terminal text-[9px] uppercase tracking-widest ${a.chip}`}>
              Sponsor
            </span>
          </div>
        </div>

        <h3
          className={`mt-3 font-editorial font-bold leading-tight text-foreground ${
            isLarge ? "text-3xl" : "text-2xl"
          }`}
        >
          {startup.name}
        </h3>
        <div className={`mt-1 italic ${a.text}`}>{startup.oneLiner}</div>

        <p className="mt-3 text-sm text-foreground/75">{startup.description}</p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
          <span>{startup.hq}</span>
          {startup.founded && <span>est. {startup.founded}</span>}
          {startup.founders && <span>{startup.founders}</span>}
        </div>

        <div className="mt-5">
          <a
            href={startup.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-4 py-2 font-terminal text-xs uppercase tracking-widest text-foreground/85 transition hover:border-terminal-amber/40 hover:text-terminal-amber"
          >
            Visit {startup.name}
            <span className="opacity-60">↗</span>
          </a>
        </div>

        {startup.placeholder && (
          <div className="mt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/30">
            example placeholder · replace with real partner data
          </div>
        )}
      </div>
    </article>
  );
}
