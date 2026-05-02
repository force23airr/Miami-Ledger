import Link from "next/link";
import SkyView from "@/components/skyview/SkyView";

export const metadata = {
  title: "Sky View — Miami Ledger",
  description:
    "Live satellite imagery of Florida and the Western Hemisphere, straight from NOAA's GOES-19. Refreshes every minute. Free. No keys.",
};

export default function SkyViewPage() {
  return (
    <div className="terminal-scanlines relative min-h-screen overflow-hidden bg-terminal-bg text-foreground">
      <div className="terminal-grid-bg absolute inset-0 opacity-50" />
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-terminal-amber/20 pb-2 font-terminal text-[11px]">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 uppercase tracking-widest text-foreground/70 hover:border-accent hover:text-accent"
            >
              ← Exit Sky
            </Link>
            <span className="font-editorial text-lg font-black uppercase tracking-tight text-foreground">
              Ledger<span className="text-terminal-amber">::SkyView</span>
            </span>
            <span className="text-foreground/40">
              v0.1 · GOES-19 · 22,236 mi up
            </span>
          </div>
          <div className="flex items-center gap-4 text-foreground/40">
            <span>src: NOAA · NASA Worldview</span>
            <span className="text-terminal-green glow-green">● online</span>
            <Link
              href="/wire"
              className="rounded-sm border border-terminal-amber/40 bg-terminal-amber/10 px-2 py-1 uppercase tracking-widest text-terminal-amber hover:bg-terminal-amber/20"
            >
              → Wire
            </Link>
          </div>
        </div>

        <div className="my-6">
          <h1 className="font-editorial text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Sky View
          </h1>
          <p className="mt-2 max-w-2xl text-foreground/70">
            There is, in fact, a camera in the sky always looking at Florida.
            Live imagery from GOES-19 — NOAA&apos;s geostationary satellite
            parked over the equator. Free. No keys. Auto-refreshing.
          </p>
        </div>

        <SkyView />

        <footer className="mt-10 border-t border-terminal-amber/20 pt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          GOES-19 imagery: NOAA STAR · public domain. MODIS imagery: NASA EOSDIS
          Worldview · public domain. Resolutions and coverage are atmospheric —
          this is the satellite that watches hurricanes spin, not the one that
          reads license plates.
        </footer>
      </div>
    </div>
  );
}
