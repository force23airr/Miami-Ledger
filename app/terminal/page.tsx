import Link from "next/link";
import Ticker from "@/components/Ticker";
import Clock from "@/components/terminal/Clock";
import BeatPanel from "@/components/terminal/BeatPanel";
import MarketPanel from "@/components/terminal/MarketPanel";
import HeadlinePulse from "@/components/terminal/HeadlinePulse";
import { FEED_BY_BEAT } from "@/lib/feed";

export const metadata = {
  title: "The Ledger Terminal — Stay in the loop",
};

export default function TerminalPage() {
  return (
    <div className="terminal-scanlines relative min-h-screen overflow-hidden bg-terminal-bg text-foreground">
      <div className="terminal-grid-bg absolute inset-0 opacity-60" />
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-4 sm:px-6">

        {/* System bar */}
        <div className="flex items-center justify-between border-b border-terminal-amber/20 pb-2 font-terminal text-[11px]">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 uppercase tracking-widest text-foreground/70 hover:border-accent hover:text-accent"
            >
              ← Exit Terminal
            </Link>
            <span className="font-editorial text-lg font-black uppercase tracking-tight text-foreground">
              Ledger<span className="text-terminal-amber">::Terminal</span>
            </span>
            <span className="text-foreground/40">v0.1 · operator: guest</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-foreground/40">node MIA-01</span>
            <span className="text-terminal-green glow-green">● online</span>
            <Clock />
          </div>
        </div>

        {/* Wire */}
        <div className="mt-3">
          <Ticker tone="green" />
        </div>

        {/* Pulse + video */}
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <HeadlinePulse />
          </div>
          <div className="lg:col-span-4">
            <div className="relative aspect-video overflow-hidden rounded-md border border-white/10 bg-black">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,176,0,0.18),transparent_60%)]" />
              <div className="absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(255,176,0,0.06)_0px,rgba(255,176,0,0.06)_1px,transparent_1px,transparent_3px)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-terminal-amber/20 backdrop-blur">
                    <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-0.5 fill-terminal-amber">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <div className="mt-2 font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
                    Ledger Live
                  </div>
                </div>
              </div>
              <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-sm bg-black/70 px-1.5 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-red">
                <span className="h-1.5 w-1.5 rounded-full bg-terminal-red animate-blink" /> live
              </div>
              <div className="absolute bottom-2 right-2 font-terminal text-[10px] text-white/60">
                CH 1 · 1080p
              </div>
            </div>
          </div>
        </div>

        {/* Beats grid */}
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="h-[420px]">
            <BeatPanel beat="LCL" initial={FEED_BY_BEAT.LCL} />
          </div>
          <div className="h-[420px]">
            <BeatPanel beat="FIN" initial={FEED_BY_BEAT.FIN} />
          </div>
          <div className="h-[420px]">
            <BeatPanel beat="ENG" initial={FEED_BY_BEAT.ENG} />
          </div>
          <div className="h-[420px]">
            <BeatPanel beat="ACA" initial={FEED_BY_BEAT.ACA} />
          </div>
        </div>

        {/* Bottom row: markets + alerts + commands */}
        <div className="mt-4 grid gap-4 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <MarketPanel />
          </div>

          <div className="lg:col-span-4 rounded-md border border-white/10 bg-black/50">
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
              <div className="flex items-center gap-2 font-terminal text-[11px] uppercase tracking-widest text-terminal-red">
                <span className="h-1.5 w-1.5 rounded-full bg-terminal-red animate-blink" /> Alerts
              </div>
              <span className="font-terminal text-[10px] text-foreground/40">prio ≥ medium</span>
            </div>
            <ul className="font-terminal text-[12px]">
              {[
                { t: "08:42", txt: "FIN — OFAC issues fresh KYC guidance, LATAM corridors", lvl: "HIGH" },
                { t: "08:19", txt: "LCL — Beach commission greenlights resilience bonds II", lvl: "MED" },
                { t: "07:58", txt: "ENG — PortMiami crane firmware regression, cert delayed", lvl: "MED" },
                { t: "07:21", txt: "WX — NOAA outlook above-normal, 19 named storms forecast", lvl: "INFO" },
              ].map((a) => (
                <li key={a.t} className="flex items-start gap-2 border-b border-white/5 px-3 py-1.5">
                  <span className="text-terminal-dim">{a.t}</span>
                  <span
                    className={`shrink-0 rounded-sm px-1 text-[9px] ${
                      a.lvl === "HIGH"
                        ? "bg-terminal-red/20 text-terminal-red"
                        : a.lvl === "MED"
                          ? "bg-terminal-amber/20 text-terminal-amber"
                          : "bg-white/10 text-foreground/60"
                    }`}
                  >
                    {a.lvl}
                  </span>
                  <span className="text-foreground/85">{a.txt}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3 rounded-md border border-terminal-green/30 bg-black/70 p-3 font-terminal text-[12px] text-terminal-green">
            <div className="mb-2 flex items-center justify-between text-terminal-green/70">
              <span>cmd · operator</span>
              <span className="text-foreground/40">F1 help</span>
            </div>
            <div>› <span className="text-foreground/80">subscribe</span> LCL FIN</div>
            <div>› <span className="text-foreground/80">filter</span> priority &gt;= med</div>
            <div>› <span className="text-foreground/80">video</span> ch 1</div>
            <div>› <span className="text-foreground/80">pulse</span> on</div>
            <div className="mt-3 flex items-center">
              <span>› </span>
              <span className="ml-1 animate-blink">▮</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          <span>Miami Ledger · Terminal · miamiledger.org</span>
          <span>renderer ok · feeds 4/4 · uplink 1.0gb</span>
        </div>
      </div>
    </div>
  );
}
