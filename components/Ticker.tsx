import { TICKER_ITEMS } from "@/lib/feed";

export default function Ticker({ tone = "amber" }: { tone?: "amber" | "green" }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  const color =
    tone === "amber"
      ? "text-terminal-amber border-terminal-amber/30"
      : "text-terminal-green border-terminal-green/30";

  return (
    <div className={`relative flex items-center gap-4 overflow-hidden border-y bg-black/60 py-2 font-terminal text-xs ${color}`}>
      <div className="z-10 flex shrink-0 items-center gap-2 border-r border-current/30 pr-3 pl-3 uppercase tracking-widest">
        <span className="h-1.5 w-1.5 rounded-full bg-current animate-blink" />
        Wire
      </div>
      <div className="flex min-w-max animate-ticker gap-10 whitespace-nowrap pr-10">
        {items.map((t, i) => (
          <span key={i} className="opacity-90">
            <span className="opacity-50">▎</span> {t}
          </span>
        ))}
      </div>
    </div>
  );
}
