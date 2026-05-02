"use client";

import { useEffect, useRef, useState } from "react";
import { TICKER_ITEMS, FEED_BY_BEAT, type FeedItem } from "@/lib/feed";
import { latest } from "@/lib/articles";

type ProductId = "BTC-USD" | "ETH-USD" | "SOL-USD";
type Ticker = { price: number; open24h: number; volume_24h: number };
type Trade = {
  id: number;
  product: ProductId;
  side: "buy" | "sell";
  price: number;
  size: number;
  notional: number;
  time: number;
};

const PRODUCTS: ProductId[] = ["BTC-USD", "ETH-USD", "SOL-USD"];

type PanelKey = "front" | "markets" | "tape" | "beats";
const PANELS: { key: PanelKey; label: string; durationMs: number }[] = [
  { key: "front", label: "Front · Page", durationMs: 22000 },
  { key: "markets", label: "Pulse · Markets", durationMs: 22000 },
  { key: "tape", label: "Wire · Tape", durationMs: 22000 },
  { key: "beats", label: "Beat · Wall", durationMs: 22000 },
];

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

const fmtUSD = (n: number, max = 2) =>
  n.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: max,
    maximumFractionDigits: max,
  });

const fmtCompact = (n: number) =>
  n.toLocaleString("en-US", { notation: "compact", maximumFractionDigits: 2 });

function isoDateLabel(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${MONTHS[Number(m) - 1] ?? ""} ${d ?? ""} ${y ?? ""}`.trim();
}

export default function TvPage() {
  const [panelIdx, setPanelIdx] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  const [tickers, setTickers] = useState<Record<ProductId, Ticker | undefined>>({
    "BTC-USD": undefined,
    "ETH-USD": undefined,
    "SOL-USD": undefined,
  });
  const [trades, setTrades] = useState<Trade[]>([]);
  const [wsStatus, setWsStatus] = useState<"connecting" | "live" | "down">("connecting");

  const [beats, setBeats] = useState<Record<string, FeedItem[]>>({
    LCL: FEED_BY_BEAT.LCL.slice(0, 4),
    FIN: FEED_BY_BEAT.FIN.slice(0, 4),
    ENG: FEED_BY_BEAT.ENG.slice(0, 4),
    ACA: FEED_BY_BEAT.ACA.slice(0, 4),
  });

  const [, forceTick] = useState(0);
  const [showHint, setShowHint] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const headlines = latest(7);

  // Clock + age recomputation tick.
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => {
      setNow(new Date());
      forceTick((x) => x + 1);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Panel rotation.
  useEffect(() => {
    const id = setTimeout(() => {
      setPanelIdx((i) => (i + 1) % PANELS.length);
    }, PANELS[panelIdx].durationMs);
    return () => clearTimeout(id);
  }, [panelIdx]);

  // Fade out the keyboard hint after the room has had time to settle.
  useEffect(() => {
    const id = setTimeout(() => setShowHint(false), 5000);
    return () => clearTimeout(id);
  }, []);

  // Keyboard: F toggles fullscreen, ArrowRight/Space advances panel,
  // ArrowLeft goes back, ? re-shows the hint.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === "f" || k === "F") {
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen?.().catch(() => {});
        } else {
          document.exitFullscreen?.().catch(() => {});
        }
      } else if (k === "ArrowRight" || k === " ") {
        e.preventDefault();
        setPanelIdx((i) => (i + 1) % PANELS.length);
      } else if (k === "ArrowLeft") {
        e.preventDefault();
        setPanelIdx((i) => (i - 1 + PANELS.length) % PANELS.length);
      } else if (k === "?" || k === "h" || k === "H") {
        e.preventDefault();
        setShowHint(true);
      }
    };
    const onFs = () => setIsFullscreen(!!document.fullscreenElement);
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFs);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFs);
    };
  }, []);

  // Coinbase public WS — same playbook as /wire, kept alive across panel rotations.
  useEffect(() => {
    let closed = false;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      setWsStatus("connecting");
      const ws = new WebSocket("wss://ws-feed.exchange.coinbase.com");

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
          const volume_24h = parseFloat(String(m.volume_24h));
          if (Number.isNaN(price)) return;
          setTickers((prev) => ({
            ...prev,
            [product]: { price, open24h, volume_24h },
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
            side: m.side === "sell" ? "buy" : "sell",
            price,
            size,
            notional: price * size,
            time: Date.parse(String(m.time)) || Date.now(),
          };
          setTrades((prev) => [trade, ...prev].slice(0, 30));
        }
      };

      ws.onerror = () => setWsStatus("down");
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
    };
  }, []);

  // Rolling beat ticker — keep the wall feeling alive even when nobody's looking.
  const beatCounter = useRef(0);
  useEffect(() => {
    const id = setInterval(() => {
      beatCounter.current += 1;
      const t = new Date();
      const time = `${String(t.getHours()).padStart(2, "0")}:${String(t.getMinutes()).padStart(2, "0")}:${String(t.getSeconds()).padStart(2, "0")}`;
      setBeats((prev) => {
        const next: Record<string, FeedItem[]> = { ...prev };
        for (const b of ["LCL", "FIN", "ENG", "ACA"] as const) {
          const pool = FEED_BY_BEAT[b];
          const item = pool[(beatCounter.current + b.charCodeAt(0)) % pool.length];
          const fresh: FeedItem = {
            id: `${b}-tv-${beatCounter.current}`,
            time,
            beat: b,
            text: item.text,
          };
          next[b] = [fresh, ...prev[b]].slice(0, 4);
        }
        return next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const activeKey = PANELS[panelIdx].key;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black text-foreground cursor-none terminal-scanlines">
      <Header
        now={now}
        panelLabel={PANELS[panelIdx].label}
        panelIdx={panelIdx}
        wsStatus={wsStatus}
      />

      <main key={activeKey} className="relative z-10 flex-1 animate-feed-in overflow-hidden p-10">
        {activeKey === "front" && <FrontPanel headlines={headlines} />}
        {activeKey === "markets" && <MarketsPanel tickers={tickers} />}
        {activeKey === "tape" && <TapePanel trades={trades} />}
        {activeKey === "beats" && <BeatsPanel beats={beats} />}
      </main>

      <KeyboardHint visible={showHint} isFullscreen={isFullscreen} />

      <FooterTicker />
    </div>
  );
}

function Header({
  now,
  panelLabel,
  panelIdx,
  wsStatus,
}: {
  now: Date | null;
  panelLabel: string;
  panelIdx: number;
  wsStatus: "connecting" | "live" | "down";
}) {
  return (
    <header className="relative z-10 flex items-baseline justify-between border-b border-terminal-amber/30 bg-black px-10 py-5">
      <div className="flex items-baseline gap-5">
        <span className="font-editorial text-4xl font-black tracking-tight">
          MIAMI LEDGER
        </span>
        <span className="font-terminal text-xs uppercase tracking-[0.4em] text-terminal-amber">
          · TV ·
        </span>
      </div>
      <div className="flex items-center gap-6 font-terminal text-base">
        <span className="uppercase tracking-[0.3em] text-terminal-amber glow-amber">
          {panelLabel}
        </span>
        <Sep />
        <span className="text-foreground/50 tabular-nums">
          {String(panelIdx + 1).padStart(2, "0")} / {String(PANELS.length).padStart(2, "0")}
        </span>
        <Sep />
        <ClockText now={now} />
        <Sep />
        <span className="flex items-center gap-2">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              wsStatus === "live"
                ? "bg-terminal-green animate-blink"
                : wsStatus === "down"
                  ? "bg-terminal-red"
                  : "bg-terminal-amber animate-blink"
            }`}
          />
          <span className="text-foreground/70 uppercase tracking-widest text-sm">
            {wsStatus}
          </span>
        </span>
      </div>
    </header>
  );
}

function Sep() {
  return <span className="text-foreground/30">·</span>;
}

function ClockText({ now }: { now: Date | null }) {
  if (!now) {
    return <span className="font-terminal text-terminal-amber">--:--:--</span>;
  }
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const date = now
    .toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit" })
    .toUpperCase();
  return (
    <span className="font-terminal">
      <span className="text-foreground/60">{date}</span>{" "}
      <span className="text-terminal-amber glow-amber tabular-nums">
        {hh}:{mm}:{ss}
      </span>{" "}
      <span className="text-foreground/40">EDT</span>
    </span>
  );
}

function FrontPanel({ headlines }: { headlines: ReturnType<typeof latest> }) {
  const [hero, ...rest] = headlines;
  if (!hero) return null;
  return (
    <div className="grid h-full grid-cols-12 gap-12">
      <div className="col-span-8 flex flex-col justify-between">
        <div className="font-terminal text-sm uppercase tracking-[0.4em] text-terminal-amber">
          Cover · Story · {isoDateLabel(hero.publishedAt)}
        </div>
        <h1 className="font-editorial text-[6.5vw] font-black leading-[0.95] tracking-tight">
          {hero.title}
        </h1>
        <p className="max-w-5xl font-editorial text-3xl leading-snug text-foreground/70">
          {hero.dek}
        </p>
        <div className="font-terminal text-base uppercase tracking-[0.3em] text-foreground/50">
          By {hero.author} · {hero.readMinutes} min · {hero.category}
        </div>
      </div>
      <div className="col-span-4 flex flex-col gap-6 border-l border-terminal-amber/20 pl-10">
        <div className="font-terminal text-xs uppercase tracking-[0.4em] text-terminal-amber">
          Also · Today
        </div>
        <ul className="flex flex-col gap-5">
          {rest.slice(0, 5).map((a) => (
            <li key={a.slug} className="border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
              <div className="font-terminal text-[10px] uppercase tracking-[0.4em] text-terminal-amber">
                {a.category}
              </div>
              <div className="mt-1 font-editorial text-2xl leading-tight">
                {a.title}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function MarketsPanel({
  tickers,
}: {
  tickers: Record<ProductId, Ticker | undefined>;
}) {
  return (
    <div className="grid h-full grid-cols-3 gap-10">
      {PRODUCTS.map((p) => {
        const t = tickers[p];
        const symbol = p.replace("-USD", "");
        if (!t) {
          return (
            <div
              key={p}
              className="flex flex-col justify-between rounded-lg border border-terminal-amber/30 bg-black/60 p-10"
            >
              <div className="font-terminal text-base uppercase tracking-[0.4em] text-foreground/40">
                {symbol} · USD
              </div>
              <div className="font-editorial text-[9vw] font-black leading-none text-foreground/20">
                —
              </div>
              <div className="font-terminal text-base text-foreground/40">
                subscribing
              </div>
            </div>
          );
        }
        const change = t.price - t.open24h;
        const changePct = (change / t.open24h) * 100;
        const up = change >= 0;
        const colorClass = up ? "text-terminal-green glow-green" : "text-terminal-red";
        return (
          <div
            key={p}
            className="flex flex-col justify-between rounded-lg border border-terminal-amber/30 bg-black/60 p-10"
          >
            <div className="flex items-baseline justify-between">
              <span className="font-terminal text-base uppercase tracking-[0.4em] text-terminal-amber">
                {symbol} · USD
              </span>
              <span className="font-terminal text-sm text-foreground/40">
                {fmtCompact(t.volume_24h)} 24h
              </span>
            </div>
            <div
              className={`font-editorial text-[6.5vw] font-black tabular-nums leading-none ${colorClass}`}
            >
              {fmtUSD(t.price)}
            </div>
            <div
              className={`flex items-baseline justify-between font-terminal text-2xl tabular-nums ${colorClass}`}
            >
              <span>
                {up ? "▲" : "▼"} {fmtUSD(Math.abs(change))}
              </span>
              <span>
                {changePct >= 0 ? "+" : ""}
                {changePct.toFixed(2)}%
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TapePanel({ trades }: { trades: Trade[] }) {
  return (
    <div className="flex h-full flex-col">
      <div className="grid grid-cols-12 gap-4 border-b border-terminal-amber/30 pb-3 font-terminal text-base uppercase tracking-[0.4em] text-terminal-amber">
        <span className="col-span-2">Pair</span>
        <span className="col-span-2">Side</span>
        <span className="col-span-3 text-right">Price</span>
        <span className="col-span-2 text-right">Size</span>
        <span className="col-span-2 text-right">Notional</span>
        <span className="col-span-1 text-right">Age</span>
      </div>
      {trades.length === 0 ? (
        <div className="grid flex-1 place-items-center font-editorial text-3xl text-foreground/30">
          subscribing to coinbase tape…
        </div>
      ) : (
        <ul className="flex-1 overflow-hidden font-terminal">
          {trades.slice(0, 14).map((t, i) => {
            const big = t.notional >= 100_000;
            const colorClass =
              t.side === "buy" ? "text-terminal-green" : "text-terminal-red";
            const ageS = Math.max(0, Math.round((Date.now() - t.time) / 1000));
            return (
              <li
                key={`${t.product}-${t.id}`}
                className={`grid grid-cols-12 items-center gap-4 border-b border-white/5 py-4 text-3xl tabular-nums ${
                  i === 0 ? "animate-feed-in bg-white/[0.04]" : ""
                } ${big ? "bg-terminal-amber/[0.06]" : ""}`}
              >
                <span className="col-span-2 text-foreground/85">
                  {t.product.replace("-USD", "")}
                </span>
                <span className={`col-span-2 uppercase ${colorClass}`}>
                  {t.side === "buy" ? "▲ buy" : "▼ sell"}
                </span>
                <span className={`col-span-3 text-right ${colorClass}`}>
                  {fmtUSD(t.price)}
                </span>
                <span className="col-span-2 text-right text-foreground/85">
                  {t.size.toFixed(4)}
                </span>
                <span
                  className={`col-span-2 text-right ${
                    big ? "text-terminal-amber" : "text-foreground/85"
                  }`}
                >
                  {fmtCompact(t.notional)}
                </span>
                <span className="col-span-1 text-right text-foreground/40">
                  {ageS}s
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function BeatsPanel({ beats }: { beats: Record<string, FeedItem[]> }) {
  const beatOrder = ["LCL", "FIN", "ENG", "ACA"] as const;
  const tone: Record<string, string> = {
    LCL: "border-accent/40 [--beat:var(--color-accent)]",
    FIN: "border-terminal-green/40 [--beat:var(--color-terminal-green)]",
    ENG: "border-terminal-cyan/40 [--beat:var(--color-terminal-cyan)]",
    ACA: "border-accent-soft/40 [--beat:var(--color-accent-soft)]",
  };
  const headColor: Record<string, string> = {
    LCL: "text-accent",
    FIN: "text-terminal-green",
    ENG: "text-terminal-cyan",
    ACA: "text-accent-soft",
  };
  const dot: Record<string, string> = {
    LCL: "bg-accent",
    FIN: "bg-terminal-green",
    ENG: "bg-terminal-cyan",
    ACA: "bg-accent-soft",
  };
  const labels: Record<string, string> = {
    LCL: "Local",
    FIN: "Fintech",
    ENG: "Engineering",
    ACA: "Academics",
  };
  return (
    <div className="grid h-full grid-cols-2 grid-rows-2 gap-8">
      {beatOrder.map((b) => (
        <div
          key={b}
          className={`flex flex-col rounded-lg border bg-black/60 p-6 ${tone[b]}`}
        >
          <div
            className={`flex items-center justify-between border-b border-white/10 pb-3 font-terminal text-base uppercase tracking-[0.4em] ${headColor[b]}`}
          >
            <span className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full animate-blink ${dot[b]}`} />
              {b} · {labels[b]}
            </span>
            <span className="text-foreground/40 text-sm">
              {beats[b].length} live
            </span>
          </div>
          <ul className="flex flex-1 flex-col justify-around font-terminal">
            {beats[b].slice(0, 4).map((it, i) => (
              <li
                key={it.id}
                className={`border-b border-white/5 py-3 last:border-b-0 ${
                  i === 0 ? "animate-feed-in" : ""
                }`}
              >
                <div className="flex items-baseline gap-4 text-2xl">
                  <span className="text-foreground/40 tabular-nums">
                    {it.time}
                  </span>
                  <span className="leading-snug text-foreground/90">
                    {it.text}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function KeyboardHint({
  visible,
  isFullscreen,
}: {
  visible: boolean;
  isFullscreen: boolean;
}) {
  return (
    <div
      className={`pointer-events-none absolute right-10 top-24 z-20 flex flex-col items-end gap-2 font-terminal text-xs uppercase tracking-[0.3em] transition-opacity duration-1000 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="rounded-sm border border-terminal-amber/30 bg-black/70 px-3 py-2 text-foreground/70 backdrop-blur">
        Press{" "}
        <kbd className="mx-1 rounded-sm border border-terminal-amber/40 bg-black px-1.5 py-0.5 text-terminal-amber">
          F
        </kbd>{" "}
        for {isFullscreen ? "windowed" : "fullscreen"}
      </div>
      <div className="rounded-sm border border-white/10 bg-black/70 px-3 py-2 text-foreground/50 backdrop-blur">
        <kbd className="mx-1 rounded-sm border border-white/20 bg-black px-1.5 py-0.5">
          ←
        </kbd>{" "}
        <kbd className="mx-1 rounded-sm border border-white/20 bg-black px-1.5 py-0.5">
          →
        </kbd>{" "}
        rotate panels ·{" "}
        <kbd className="mx-1 rounded-sm border border-white/20 bg-black px-1.5 py-0.5">
          ?
        </kbd>{" "}
        hints
      </div>
    </div>
  );
}

function FooterTicker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <footer className="relative z-10 flex items-center gap-4 border-t border-terminal-amber/30 bg-black py-3">
      <div className="flex shrink-0 items-center gap-2 border-r border-terminal-amber/30 px-6 font-terminal text-base uppercase tracking-[0.4em] text-terminal-amber">
        <span className="h-2.5 w-2.5 rounded-full bg-terminal-amber animate-blink" />
        Wire
      </div>
      <div className="flex min-w-max animate-ticker gap-12 whitespace-nowrap pr-12 font-terminal text-lg text-terminal-amber">
        {items.map((t, i) => (
          <span key={i}>
            <span className="opacity-50">▎</span> {t}
          </span>
        ))}
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-4 border-l border-terminal-amber/30 px-6 font-terminal text-xs uppercase tracking-[0.4em] text-foreground/60">
        <span className="hidden md:inline">Scan · Read</span>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://api.qrserver.com/v1/create-qr-code/?data=https%3A%2F%2Fmiamiledger.org&size=120x120&bgcolor=000000&color=ffb000&qzone=1"
          alt=""
          width={56}
          height={56}
          className="rounded-sm"
        />
        <span className="text-terminal-amber">miamiledger.org</span>
      </div>
    </footer>
  );
}
