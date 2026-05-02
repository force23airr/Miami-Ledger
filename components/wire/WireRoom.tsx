"use client";

import { useEffect, useRef, useState } from "react";

type ProductId = "BTC-USD" | "ETH-USD" | "SOL-USD";

type Ticker = {
  price: number;
  open24h: number;
  best_bid: number;
  best_ask: number;
  volume_24h: number;
};

type Trade = {
  id: number;
  product: ProductId;
  side: "buy" | "sell";
  price: number;
  size: number;
  notional: number;
  time: number;
};

type Transfer = {
  from: string;
  to: string;
  amount: number;
  block: number;
  tx: string;
  logIndex: number;
};

const PRODUCTS: ProductId[] = ["BTC-USD", "ETH-USD", "SOL-USD"];

const fmtUSD = (n: number, max = 2) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: max,
    minimumFractionDigits: max,
  });

const fmtCompact = (n: number) =>
  n.toLocaleString("en-US", {
    notation: "compact",
    maximumFractionDigits: 2,
  });

const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;

const timeAgo = (ms: number) => {
  const s = Math.max(0, Math.round((Date.now() - ms) / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h`;
};

export default function WireRoom() {
  const [tickers, setTickers] = useState<Record<ProductId, Ticker | undefined>>(
    { "BTC-USD": undefined, "ETH-USD": undefined, "SOL-USD": undefined },
  );
  const [trades, setTrades] = useState<Trade[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [wsStatus, setWsStatus] = useState<"connecting" | "live" | "down">(
    "connecting",
  );
  const [chainStatus, setChainStatus] = useState<"polling" | "live" | "down">(
    "polling",
  );
  const [latestBlock, setLatestBlock] = useState<number | null>(null);
  // Force-rerender for time-ago labels.
  const [, setTick] = useState(0);

  const wsRef = useRef<WebSocket | null>(null);
  const seenTxRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  // Coinbase Exchange public WebSocket (no auth) — matches + ticker.
  useEffect(() => {
    let closed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      setWsStatus("connecting");
      const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify({
            type: "subscribe",
            product_ids: PRODUCTS,
            channels: ["matches", "ticker"],
          }),
        );
      };

      ws.onmessage = (evt) => {
        let msg: unknown;
        try {
          msg = JSON.parse(evt.data);
        } catch {
          return;
        }
        if (!msg || typeof msg !== "object") return;
        const m = msg as Record<string, unknown>;

        if (m.type === "subscriptions") {
          setWsStatus("live");
          return;
        }

        if (m.type === "ticker" && typeof m.product_id === "string") {
          const product = m.product_id as ProductId;
          if (!PRODUCTS.includes(product)) return;
          const price = parseFloat(String(m.price));
          const open24h = parseFloat(String(m.open_24h));
          const best_bid = parseFloat(String(m.best_bid));
          const best_ask = parseFloat(String(m.best_ask));
          const volume_24h = parseFloat(String(m.volume_24h));
          if (Number.isNaN(price)) return;
          setTickers((prev) => ({
            ...prev,
            [product]: { price, open24h, best_bid, best_ask, volume_24h },
          }));
          return;
        }

        if (
          (m.type === "match" || m.type === "last_match") &&
          typeof m.product_id === "string"
        ) {
          const product = m.product_id as ProductId;
          if (!PRODUCTS.includes(product)) return;
          const price = parseFloat(String(m.price));
          const size = parseFloat(String(m.size));
          if (Number.isNaN(price) || Number.isNaN(size)) return;
          const trade: Trade = {
            id: typeof m.trade_id === "number" ? m.trade_id : Date.now(),
            product,
            // Coinbase's "side" reports the maker's side; the taker did the opposite.
            side: m.side === "sell" ? "buy" : "sell",
            price,
            size,
            notional: price * size,
            time: Date.parse(String(m.time)) || Date.now(),
          };
          setTrades((prev) => [trade, ...prev].slice(0, 60));
        }
      };

      ws.onerror = () => {
        setWsStatus("down");
      };

      ws.onclose = () => {
        if (closed) return;
        setWsStatus("down");
        reconnectTimer = setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      closed = true;
      if (reconnectTimer) clearTimeout(reconnectTimer);
      wsRef.current?.close();
    };
  }, []);

  // USDC transfers — poll the API route every 8s.
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch("/api/usdc", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as {
          block: number;
          transfers: Transfer[];
        };
        if (cancelled) return;
        setLatestBlock(data.block);
        setChainStatus("live");
        setTransfers((prev) => {
          const fresh = data.transfers.filter(
            (t) => !seenTxRef.current.has(`${t.tx}-${t.logIndex}`),
          );
          for (const t of fresh) seenTxRef.current.add(`${t.tx}-${t.logIndex}`);
          // Keep the last ~60 unique transfers, newest first.
          const merged = [...fresh, ...prev].slice(0, 60);
          // Cap the seen set so it doesn't grow forever.
          if (seenTxRef.current.size > 500) {
            seenTxRef.current = new Set(
              merged.map((t) => `${t.tx}-${t.logIndex}`),
            );
          }
          return merged;
        });
      } catch {
        if (!cancelled) setChainStatus("down");
      }
    };

    poll();
    const interval = setInterval(poll, 8000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      {/* Tickers */}
      <section className="lg:col-span-12">
        <div className="grid gap-3 sm:grid-cols-3">
          {PRODUCTS.map((p) => (
            <TickerCard key={p} product={p} ticker={tickers[p]} />
          ))}
        </div>
      </section>

      {/* USDC on-chain */}
      <section className="lg:col-span-5">
        <PanelHeader
          title="USDC :: on-chain"
          subtitle={
            latestBlock
              ? `block ${latestBlock.toLocaleString()}`
              : "subscribing"
          }
          status={chainStatus}
        />
        <div className="rounded-md border border-terminal-amber/20 bg-black/60 font-terminal text-[11px]">
          <div className="grid grid-cols-12 gap-2 border-b border-white/5 px-3 py-1.5 text-[10px] uppercase tracking-widest text-foreground/40">
            <span className="col-span-3">From</span>
            <span className="col-span-3">To</span>
            <span className="col-span-3 text-right">USDC</span>
            <span className="col-span-3 text-right">Block</span>
          </div>
          <ul className="max-h-[480px] divide-y divide-white/5 overflow-y-auto">
            {transfers.length === 0 && (
              <li className="px-3 py-6 text-center text-foreground/40">
                {chainStatus === "down"
                  ? "RPC unreachable — retrying"
                  : "waiting for the next block…"}
              </li>
            )}
            {transfers.map((t) => {
              const big = t.amount >= 1_000_000;
              const huge = t.amount >= 10_000_000;
              return (
                <li
                  key={`${t.tx}-${t.logIndex}`}
                  className={`grid grid-cols-12 items-center gap-2 px-3 py-1.5 ${
                    huge
                      ? "bg-terminal-amber/15 text-terminal-amber"
                      : big
                        ? "bg-terminal-amber/5 text-terminal-amber/90"
                        : "text-foreground/80"
                  }`}
                >
                  <a
                    href={`https://etherscan.io/address/${t.from}`}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-3 truncate text-foreground/60 hover:text-accent"
                  >
                    {shortAddr(t.from)}
                  </a>
                  <a
                    href={`https://etherscan.io/address/${t.to}`}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-3 truncate text-foreground/60 hover:text-accent"
                  >
                    {shortAddr(t.to)}
                  </a>
                  <a
                    href={`https://etherscan.io/tx/${t.tx}`}
                    target="_blank"
                    rel="noreferrer"
                    className="col-span-3 text-right hover:text-accent"
                  >
                    {fmtCompact(t.amount)}
                  </a>
                  <span className="col-span-3 text-right text-foreground/40">
                    {t.block.toLocaleString()}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Tape */}
      <section className="lg:col-span-7">
        <PanelHeader
          title="Tape :: cross-pair"
          subtitle="coinbase · BTC + ETH + SOL"
          status={wsStatus}
        />
        <div className="rounded-md border border-terminal-amber/20 bg-black/60 font-terminal text-[11px]">
          <div className="grid grid-cols-12 gap-2 border-b border-white/5 px-3 py-1.5 text-[10px] uppercase tracking-widest text-foreground/40">
            <span className="col-span-2">Pair</span>
            <span className="col-span-2">Side</span>
            <span className="col-span-3 text-right">Price</span>
            <span className="col-span-2 text-right">Size</span>
            <span className="col-span-2 text-right">Notional</span>
            <span className="col-span-1 text-right">Age</span>
          </div>
          <ul className="max-h-[480px] divide-y divide-white/5 overflow-y-auto">
            {trades.length === 0 && (
              <li className="px-3 py-6 text-center text-foreground/40">
                {wsStatus === "down"
                  ? "feed dropped — reconnecting"
                  : "subscribing to feed…"}
              </li>
            )}
            {trades.map((t) => {
              const big = t.notional >= 100_000;
              const colorClass =
                t.side === "buy" ? "text-terminal-green" : "text-terminal-red";
              return (
                <li
                  key={`${t.product}-${t.id}`}
                  className={`grid grid-cols-12 items-center gap-2 px-3 py-1.5 animate-feed-in ${
                    big ? "bg-white/[0.04]" : ""
                  }`}
                >
                  <span className="col-span-2 text-foreground/70">
                    {t.product.replace("-USD", "")}
                  </span>
                  <span className={`col-span-2 uppercase ${colorClass}`}>
                    {t.side === "buy" ? "▲ buy" : "▼ sell"}
                  </span>
                  <span className={`col-span-3 text-right ${colorClass}`}>
                    {fmtUSD(t.price)}
                  </span>
                  <span className="col-span-2 text-right text-foreground/70">
                    {t.size.toFixed(4)}
                  </span>
                  <span
                    className={`col-span-2 text-right ${
                      big ? "text-terminal-amber" : "text-foreground/70"
                    }`}
                  >
                    {fmtCompact(t.notional)}
                  </span>
                  <span className="col-span-1 text-right text-foreground/40">
                    {timeAgo(t.time)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}

function PanelHeader({
  title,
  subtitle,
  status,
}: {
  title: string;
  subtitle: string;
  status: "live" | "connecting" | "polling" | "down";
}) {
  const dotClass =
    status === "live"
      ? "bg-terminal-green animate-blink"
      : status === "down"
        ? "bg-terminal-red"
        : "bg-terminal-amber animate-blink";
  const label =
    status === "live"
      ? "live"
      : status === "down"
        ? "down"
        : status === "polling"
          ? "polling"
          : "connecting";
  return (
    <div className="mb-2 flex items-baseline justify-between border-b border-terminal-amber/20 pb-1.5 font-terminal text-[11px] uppercase tracking-widest">
      <div className="flex items-baseline gap-3">
        <span className="text-terminal-amber">{title}</span>
        <span className="text-foreground/40">{subtitle}</span>
      </div>
      <span className="flex items-center gap-1.5 text-foreground/60">
        <span className={`h-1.5 w-1.5 rounded-full ${dotClass}`} />
        {label}
      </span>
    </div>
  );
}

function TickerCard({
  product,
  ticker,
}: {
  product: ProductId;
  ticker: Ticker | undefined;
}) {
  const symbol = product.replace("-USD", "");
  if (!ticker) {
    return (
      <div className="rounded-md border border-white/10 bg-black/60 p-4">
        <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          {symbol} · USD
        </div>
        <div className="mt-2 font-editorial text-3xl font-bold text-foreground/30">
          —
        </div>
      </div>
    );
  }
  const change = ticker.price - ticker.open24h;
  const changePct = (change / ticker.open24h) * 100;
  const up = change >= 0;
  const colorClass = up ? "text-terminal-green" : "text-terminal-red";
  const spread = ticker.best_ask - ticker.best_bid;
  return (
    <div className="rounded-md border border-white/10 bg-black/60 p-4">
      <div className="flex items-baseline justify-between font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
        <span>{symbol} · USD</span>
        <span>{fmtCompact(ticker.volume_24h)} 24h vol</span>
      </div>
      <div
        className={`mt-2 font-editorial text-3xl font-bold tabular-nums ${colorClass}`}
      >
        {fmtUSD(ticker.price)}
      </div>
      <div className="mt-1 flex items-baseline justify-between font-terminal text-[11px]">
        <span className={colorClass}>
          {up ? "▲" : "▼"} {fmtUSD(Math.abs(change))} (
          {changePct.toFixed(2)}%)
        </span>
        <span className="text-foreground/40">
          spread {fmtUSD(spread, spread < 1 ? 4 : 2)}
        </span>
      </div>
    </div>
  );
}
