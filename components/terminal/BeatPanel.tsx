"use client";

import { useEffect, useRef, useState } from "react";
import type { FeedItem } from "@/lib/feed";

const TONE: Record<string, { dot: string; head: string }> = {
  LCL: { dot: "bg-accent", head: "text-accent" },
  FIN: { dot: "bg-terminal-green", head: "text-terminal-green" },
  ENG: { dot: "bg-terminal-cyan", head: "text-terminal-cyan" },
  ACA: { dot: "bg-accent-soft", head: "text-accent-soft" },
};

const EXTRA_LINES: Record<string, string[]> = {
  LCL: [
    "MDPD scanner: I-95 SB advisory cleared",
    "Miami-Dade school board agenda posted",
    "Beach commission: short-term rental memo",
    "Aventura council greenlights park bond",
    "Hialeah water-main repair complete",
    "Bay Harbor Islands traffic study released",
  ],
  FIN: [
    "DXY 104.21 -0.08",
    "USDC mcap 38.1B +0.4%",
    "MIA fintech hires +9% QoQ",
    "BTC-USD 71,420 +0.8%",
    "Brazilian real corridor spreads tighten",
    "ETH gas median 14 gwei",
  ],
  ENG: [
    "FPL Doral feeder soak Day 12",
    "Brightline ATC patch v2.4 rolling",
    "PortMiami crane #3 firmware regression",
    "Underline backbone fiber lit, end-to-end",
    "MDX wrong-way detection: 3 alerts overnight",
    "WASD pressure stable, district 6",
  ],
  ACA: [
    "UM faculty senate quorum confirmed",
    "FIU climate grant draws DOE attention",
    "MDC cyber AAS opens registration",
    "Barry nursing seats fill 92%",
    "FAU/UM hurricane review cleared NOAA",
    "Miller School audit memo filed w/ HHS",
  ],
};

export default function BeatPanel({
  beat,
  initial,
  intervalMs = 4500,
}: {
  beat: "LCL" | "FIN" | "ENG" | "ACA";
  initial: FeedItem[];
  intervalMs?: number;
}) {
  const [items, setItems] = useState<FeedItem[]>(initial);
  const counter = useRef(0);
  const tone = TONE[beat];

  useEffect(() => {
    const extras = EXTRA_LINES[beat];
    const id = setInterval(() => {
      counter.current += 1;
      const t = new Date();
      const time = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
      const text = extras[counter.current % extras.length];
      const next: FeedItem = { id: `${beat}-rt-${counter.current}`, time, beat, text };
      setItems((prev) => [next, ...prev].slice(0, 12));
    }, intervalMs + Math.random() * 1500);
    return () => clearInterval(id);
  }, [beat, intervalMs]);

  return (
    <div className="flex h-full flex-col rounded-md border border-white/10 bg-black/50">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot} animate-blink`} />
          <span className={`font-terminal text-[11px] uppercase tracking-widest ${tone.head}`}>
            {beat} · feed
          </span>
        </div>
        <span className="font-terminal text-[10px] text-foreground/40">{items.length} live</span>
      </div>
      <ul className="flex-1 overflow-hidden font-terminal text-[12px] leading-relaxed">
        {items.map((it, i) => (
          <li
            key={it.id}
            className={`flex gap-2 border-b border-white/5 px-3 py-1.5 ${
              i === 0 ? "animate-feed-in bg-white/[0.03]" : ""
            }`}
          >
            <span className="text-terminal-dim">{it.time}</span>
            {it.priority && (
              <span
                className={`shrink-0 rounded-sm px-1 text-[9px] ${
                  it.priority === "BREAKING"
                    ? "bg-terminal-red/20 text-terminal-red"
                    : "bg-terminal-amber/20 text-terminal-amber"
                }`}
              >
                {it.priority}
              </span>
            )}
            <span className="text-foreground/85">{it.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
