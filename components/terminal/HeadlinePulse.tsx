"use client";

import { useEffect, useState } from "react";
import { TICKER_ITEMS } from "@/lib/feed";

export default function HeadlinePulse({ headlines = [] }: { headlines?: string[] }) {
  const items = headlines.length > 0 ? [...headlines, ...TICKER_ITEMS] : TICKER_ITEMS;
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % items.length);
    }, 3500);
    return () => clearInterval(id);
  }, [items.length]);

  const cur = items[idx];

  return (
    <div className="rounded-md border border-terminal-amber/30 bg-black/70 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
          Headline · pulse
        </div>
        <div className="font-terminal text-[10px] text-foreground/40">{idx + 1}/{items.length}</div>
      </div>
      <div
        key={idx}
        className="mt-3 animate-feed-in font-editorial text-2xl leading-tight text-foreground"
      >
        {cur}
      </div>
    </div>
  );
}
