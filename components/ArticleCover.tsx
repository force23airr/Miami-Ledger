import type { Category } from "@/lib/articles";

const PALETTES: Record<Category, { from: string; to: string; ring: string }> = {
  local:       { from: "from-orange-500/40", to: "to-rose-900/60",  ring: "ring-orange-400/30" },
  fintech:     { from: "from-emerald-400/30", to: "to-emerald-900/70", ring: "ring-emerald-400/30" },
  engineering: { from: "from-cyan-400/30",   to: "to-blue-950/80", ring: "ring-cyan-400/30" },
  academics:   { from: "from-amber-300/30",  to: "to-fuchsia-900/60", ring: "ring-amber-300/30" },
  video:       { from: "from-yellow-400/30", to: "to-zinc-900/80", ring: "ring-yellow-400/30" },
};

export default function ArticleCover({
  category,
  size = "md",
  label,
}: {
  category: Category;
  size?: "sm" | "md" | "lg" | "xl";
  label?: string;
}) {
  const p = PALETTES[category];
  const heightClass = {
    sm: "h-28",
    md: "h-40",
    lg: "h-64",
    xl: "h-[28rem]",
  }[size];

  return (
    <div
      className={`relative w-full overflow-hidden rounded-md bg-gradient-to-br ${p.from} ${p.to} ring-1 ${p.ring} ${heightClass}`}
    >
      <div className="absolute inset-0 opacity-40 mix-blend-overlay [background-image:radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.6),transparent_45%)]" />
      <div className="absolute inset-0 [background-image:repeating-linear-gradient(135deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_8px)]" />
      <div className="absolute bottom-2 left-3 font-terminal text-[10px] uppercase tracking-[0.25em] text-white/70">
        {label ?? category}
      </div>
    </div>
  );
}
