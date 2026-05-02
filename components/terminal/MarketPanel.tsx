"use client";

import { useEffect, useState } from "react";

type Row = { sym: string; label: string; price: number; pct: number };

const SEED: Row[] = [
  { sym: "BTC",  label: "Bitcoin",       price: 71420.12, pct: 0.81 },
  { sym: "ETH",  label: "Ether",         price: 3812.44,  pct: 1.42 },
  { sym: "USDC", label: "USDC mcap (B)", price: 38.12,    pct: 0.41 },
  { sym: "DXY",  label: "Dollar idx",    price: 104.21,   pct: -0.08 },
  { sym: "SPY",  label: "S&P 500 ETF",   price: 537.81,   pct: 0.22 },
  { sym: "MIA",  label: "MIA traffic*",  price: 122.0,    pct: 1.10 },
];

function jitter(prev: Row): Row {
  const drift = (Math.random() - 0.5) * 0.004;
  const newPrice = +(prev.price * (1 + drift)).toFixed(2);
  const newPct = +(prev.pct + drift * 100).toFixed(2);
  return { ...prev, price: newPrice, pct: newPct };
}

export default function MarketPanel() {
  const [rows, setRows] = useState<Row[]>(SEED);

  useEffect(() => {
    const id = setInterval(() => {
      setRows((prev) => prev.map(jitter));
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="rounded-md border border-white/10 bg-black/50">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
          <span className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
            Pulse · markets
          </span>
        </div>
        <span className="font-terminal text-[10px] text-foreground/40">delayed 15s</span>
      </div>
      <table className="w-full font-terminal text-[12px]">
        <tbody>
          {rows.map((r) => {
            const up = r.pct >= 0;
            return (
              <tr key={r.sym} className="border-b border-white/5">
                <td className="px-3 py-1.5 text-foreground/90">{r.sym}</td>
                <td className="px-2 py-1.5 text-foreground/55">{r.label}</td>
                <td className="px-3 py-1.5 text-right tabular-nums text-foreground/90">
                  {r.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td
                  className={`px-3 py-1.5 text-right tabular-nums ${
                    up ? "text-terminal-green" : "text-terminal-red"
                  }`}
                >
                  {up ? "▲" : "▼"} {Math.abs(r.pct).toFixed(2)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="px-3 py-1.5 font-terminal text-[10px] text-foreground/40">
        * MIA traffic = composite Placer.ai signal, normalized 100 = Jan 2024
      </div>
    </div>
  );
}
