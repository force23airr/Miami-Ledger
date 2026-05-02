import Link from "next/link";
import WireRoom from "@/components/wire/WireRoom";

export const metadata = {
  title: "The Wire — Miami Ledger",
  description:
    "Live tape, ticker, and on-chain USDC flow. Streaming from Coinbase and Ethereum mainnet, in the Ledger Terminal aesthetic.",
};

export default function WirePage() {
  return (
    <div className="terminal-scanlines relative min-h-screen overflow-hidden bg-terminal-bg text-foreground">
      <div className="terminal-grid-bg absolute inset-0 opacity-60" />
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-terminal-amber/20 pb-2 font-terminal text-[11px]">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 uppercase tracking-widest text-foreground/70 hover:border-accent hover:text-accent"
            >
              ← Exit Wire
            </Link>
            <span className="font-editorial text-lg font-black uppercase tracking-tight text-foreground">
              Ledger<span className="text-terminal-amber">::Wire</span>
            </span>
            <span className="text-foreground/40">
              v0.1 · markets + on-chain
            </span>
          </div>
          <div className="flex items-center gap-4 text-foreground/40">
            <span>src: coinbase · ethereum</span>
            <span className="text-terminal-green glow-green">● online</span>
            <Link
              href="/terminal"
              className="rounded-sm border border-terminal-amber/40 bg-terminal-amber/10 px-2 py-1 uppercase tracking-widest text-terminal-amber hover:bg-terminal-amber/20"
            >
              → Terminal
            </Link>
          </div>
        </div>

        <div className="my-4">
          <h1 className="font-editorial text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            The Wire
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-foreground/60">
            Live tape from Coinbase. On-chain USDC transfers from Ethereum
            mainnet, refreshed every block. No keys, no caching — just the
            stream.
          </p>
        </div>

        <WireRoom />

        <footer className="mt-8 border-t border-terminal-amber/20 pt-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          Data: Coinbase Exchange WebSocket (public) · Ethereum mainnet via
          public RPC. Trades color-coded by aggressor side. Transfers ≥ $1M
          highlighted; ≥ $10M flash.
        </footer>
      </div>
    </div>
  );
}
