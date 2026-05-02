import Link from "next/link";

const SECTIONS = [
  { slug: "local", label: "Local" },
  { slug: "fintech", label: "Fintech" },
  { slug: "engineering", label: "Engineering" },
  { slug: "academics", label: "Academics" },
  { slug: "video", label: "Video" },
  { slug: "wire", label: "Wire" },
  { slug: "facts", label: "Facts" },
  { slug: "whats-going-on", label: "What's Going On" },
  { slug: "store", label: "Store" },
];

export default function Masthead() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-editorial text-2xl font-black tracking-tight text-foreground">
            Miami<span className="text-accent">Ledger</span>
          </span>
          <span className="font-terminal text-[10px] uppercase tracking-[0.2em] text-foreground/50">
            est. 2026
          </span>
        </Link>

        <nav className="hidden flex-1 items-center gap-1 md:flex">
          {SECTIONS.map((s) => (
            <Link
              key={s.slug}
              href={`/${s.slug}`}
              className="rounded-full px-3 py-1.5 text-sm text-foreground/70 transition hover:bg-white/5 hover:text-foreground"
            >
              {s.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden font-terminal text-[10px] uppercase tracking-widest text-foreground/40 md:block">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-green animate-blink" />
            Live
          </span>
          <Link
            href="/terminal"
            className="group inline-flex items-center gap-2 rounded-md border border-terminal-amber/40 bg-terminal-amber/10 px-3 py-1.5 font-terminal text-xs uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/20 hover:shadow-[0_0_20px_rgba(255,176,0,0.25)]"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-terminal-amber glow-amber" />
            Go to Terminal
            <span className="opacity-50 transition group-hover:translate-x-0.5 group-hover:opacity-100">
              →
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
