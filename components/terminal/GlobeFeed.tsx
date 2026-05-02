"use client";

import { useEffect, useMemo, useState } from "react";
import { COUNTRIES, type Country } from "@/lib/globe";
import { openAskLedger } from "@/components/AskLedger";

const VB_W = 1000;
const VB_H = 500;
const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * VB_W,
  y: ((90 - lat) / 180) * VB_H,
});

const CONTINENT_PATH =
  "M 150 100 L 230 90 L 290 110 L 320 150 L 340 200 L 320 240 L 290 250 L 270 270 L 250 280 L 230 270 L 210 250 L 200 220 L 195 200 L 180 180 L 165 160 L 155 130 Z " +
  "M 270 270 L 285 290 L 300 305 L 310 320 L 295 315 Z " +
  "M 320 320 L 345 320 L 360 350 L 365 380 L 360 410 L 345 440 L 330 455 L 315 455 L 305 430 L 305 400 L 310 370 L 315 345 Z " +
  "M 480 130 L 530 120 L 560 130 L 575 145 L 565 165 L 540 175 L 510 175 L 490 165 L 478 150 Z " +
  "M 510 200 L 555 195 L 580 215 L 595 245 L 600 280 L 590 320 L 570 350 L 550 365 L 530 360 L 515 340 L 505 310 L 500 275 L 502 240 Z " +
  "M 580 175 L 615 175 L 635 190 L 640 215 L 625 230 L 605 230 L 590 215 Z " +
  "M 600 130 L 700 110 L 780 115 L 830 130 L 860 155 L 875 185 L 870 215 L 845 235 L 810 245 L 780 245 L 760 240 L 740 235 L 720 230 L 700 230 L 680 220 L 660 205 L 645 180 L 625 160 L 605 145 Z " +
  "M 720 235 L 745 240 L 760 255 L 760 280 L 745 295 L 730 295 L 720 280 L 715 260 Z " +
  "M 800 250 L 840 255 L 855 270 L 850 290 L 825 295 L 805 285 Z " +
  "M 820 360 L 880 355 L 900 375 L 895 400 L 870 415 L 840 415 L 820 400 L 810 380 Z " +
  "M 870 175 L 885 175 L 890 195 L 880 210 L 870 200 Z " +
  "M 470 135 L 480 130 L 482 150 L 470 152 Z " +
  "M 380 70 L 420 65 L 435 90 L 425 120 L 400 130 L 385 110 Z";

type LiveItem = { headline: string; source?: string; when?: string; url?: string };

export default function GlobeFeed() {
  const [active, setActive] = useState<Country | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [liveByCode, setLiveByCode] = useState<Record<string, LiveItem[]>>({});
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<{ code: string; msg: string } | null>(null);

  const projected = useMemo(
    () =>
      COUNTRIES.map((c) => ({
        country: c,
        ...project(c.lat, c.lng),
      })),
    [],
  );

  const meridians = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];
  const parallels = [-60, -30, 0, 30, 60];

  // Auto-fetch live news the first time a country is selected
  useEffect(() => {
    if (!active) return;
    if (liveByCode[active.code]) return;
    void fetchLive(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  async function fetchLive(c: Country) {
    setLoadingCode(c.code);
    setErrorCode(null);
    try {
      const res = await fetch("/api/country-news", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code: c.code, name: c.name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Failed");
      const items: LiveItem[] = Array.isArray(data?.items) ? data.items : [];
      setLiveByCode((prev) => ({ ...prev, [c.code]: items }));
    } catch (err) {
      setErrorCode({ code: c.code, msg: (err as Error).message });
    } finally {
      setLoadingCode(null);
    }
  }

  function ask(prefill: string, autoSend = true) {
    openAskLedger(prefill, autoSend);
  }

  return (
    <div className="rounded-md border border-terminal-amber/30 bg-black/70">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5">
        <div className="flex items-center gap-2 font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
          <span className="h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
          Global · feed
        </div>
        <div className="flex items-center gap-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          <span>{COUNTRIES.length} markets</span>
          <span className="hidden sm:inline">click any node · live wire on demand</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-12">
        {/* Map */}
        <div className="relative lg:col-span-8">
          <svg viewBox={`0 0 ${VB_W} ${VB_H}`} className="block w-full" preserveAspectRatio="xMidYMid meet">
            <defs>
              <pattern id="globe-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,176,0,0.06)" strokeWidth="1" />
              </pattern>
              <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(255,176,0,0.12)" />
                <stop offset="100%" stopColor="rgba(255,176,0,0)" />
              </radialGradient>
            </defs>
            <rect width={VB_W} height={VB_H} fill="url(#globe-grid)" />
            <rect width={VB_W} height={VB_H} fill="url(#globe-glow)" />

            {meridians.map((m) => {
              const { x } = project(0, m);
              return (
                <line key={`m-${m}`} x1={x} y1={0} x2={x} y2={VB_H} stroke="rgba(0,255,156,0.08)" strokeDasharray="2 6" />
              );
            })}
            {parallels.map((p) => {
              const { y } = project(p, 0);
              return (
                <line key={`p-${p}`} x1={0} y1={y} x2={VB_W} y2={y} stroke="rgba(0,255,156,0.08)" strokeDasharray="2 6" />
              );
            })}
            <line x1={0} y1={VB_H / 2} x2={VB_W} y2={VB_H / 2} stroke="rgba(255,176,0,0.18)" strokeDasharray="4 6" />
            <line x1={VB_W / 2} y1={0} x2={VB_W / 2} y2={VB_H} stroke="rgba(255,176,0,0.18)" strokeDasharray="4 6" />

            <path d={CONTINENT_PATH} fill="rgba(255,176,0,0.05)" stroke="rgba(255,176,0,0.3)" strokeWidth="1" />

            {projected.map(({ country, x, y }) => {
              const isActive = active?.code === country.code;
              const isHover = hover === country.code;
              const isMia = country.tier === "MIA";
              const isMajor = country.tier === "MAJOR";
              const baseR = isMia ? 5 : isMajor ? 4 : 3;
              const r = isActive || isHover ? baseR + 3 : baseR;
              const fill = isMia ? "#ff5b1f" : isMajor ? "#ffb000" : "#00ff9c";
              return (
                <g
                  key={country.code}
                  onMouseEnter={() => setHover(country.code)}
                  onMouseLeave={() => setHover((h) => (h === country.code ? null : h))}
                  onClick={() => setActive(country)}
                  className="cursor-pointer"
                >
                  {(isMia || isActive) && (
                    <circle cx={x} cy={y} r={r + 6} fill="none" stroke={fill} strokeOpacity="0.5" strokeWidth="1">
                      <animate attributeName="r" from={r + 2} to={r + 14} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={fill}
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 6px ${fill})`
                        : isHover
                          ? `drop-shadow(0 0 4px ${fill})`
                          : undefined,
                    }}
                  />
                  {(isHover || isActive) && (
                    <text
                      x={x + r + 6}
                      y={y + 3}
                      fontFamily="ui-monospace, monospace"
                      fontSize="11"
                      fill="#f5f1e8"
                      style={{ pointerEvents: "none" }}
                    >
                      {country.code} · {country.name}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          <div className="absolute bottom-2 left-2 flex flex-wrap items-center gap-3 rounded bg-black/60 px-2 py-1 font-terminal text-[10px] uppercase tracking-widest">
            <span className="flex items-center gap-1.5 text-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 305 corridor
            </span>
            <span className="flex items-center gap-1.5 text-terminal-amber">
              <span className="h-1.5 w-1.5 rounded-full bg-terminal-amber" /> Major
            </span>
            <span className="flex items-center gap-1.5 text-terminal-green">
              <span className="h-1.5 w-1.5 rounded-full bg-terminal-green" /> Wire
            </span>
          </div>
        </div>

        {/* Detail panel */}
        <div className="border-t border-white/10 lg:col-span-4 lg:border-l lg:border-t-0">
          {active ? (
            <CountryPanel
              country={active}
              live={liveByCode[active.code]}
              loading={loadingCode === active.code}
              error={errorCode?.code === active.code ? errorCode.msg : null}
              onRefresh={() => fetchLive(active)}
              onAsk={ask}
              onClose={() => setActive(null)}
            />
          ) : (
            <div className="flex h-full min-h-[180px] flex-col justify-center px-4 py-6 text-center font-terminal text-[12px] text-foreground/50">
              <div className="text-terminal-amber">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
                select a node
              </div>
              <p className="mt-2 leading-relaxed">
                Click any country on the map to drill into its wire.
                Orange = Miami corridor. Amber = major market. Green = wire.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CountryPanel({
  country,
  live,
  loading,
  error,
  onRefresh,
  onAsk,
  onClose,
}: {
  country: Country;
  live?: LiveItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onAsk: (prefill: string, autoSend?: boolean) => void;
  onClose: () => void;
}) {
  const c = country;

  const chips: { label: string; prompt: string }[] = [
    {
      label: "Markets",
      prompt: `How are the financial markets in ${c.name} (${c.code}) doing right now? Cover the main equity index, the currency vs USD, central bank stance, and any moves of the last 24-48 hours. Be concise.`,
    },
    {
      label: "Flights from MIA",
      prompt: `What's the cheapest flight from Miami (MIA) to ${c.name} this month? List the airlines that fly the route and rough flight time. If there's no direct flight, say so.`,
    },
    {
      label: "Miami angle",
      prompt: `What's the Miami connection to ${c.name}? Cover diaspora communities in South Florida, business / capital flows, cultural ties, and notable people.`,
    },
    {
      label: "Visit guide",
      prompt: `If I'm flying from Miami to ${c.name} for a long weekend, give me an honest 4-day itinerary — where to stay, what to eat, what NOT to do, rough budget. Don't recommend tourist traps.`,
    },
    {
      label: "Risk brief",
      prompt: `Give me an honest current risk brief for ${c.name}: political, security, economic, FX, travel. What should a Miami-based operator or traveler actually worry about right now?`,
    },
    {
      label: "Doing business",
      prompt: `If I'm a Miami-based founder thinking about doing business in ${c.name}, what's the realistic playbook? Entity setup, tax, banking, who to know, common mistakes.`,
    },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl leading-none">{c.flag}</span>
          <div>
            <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
              {c.code} · {c.region}
            </div>
            <div className="font-editorial text-base font-bold leading-tight">{c.name}</div>
          </div>
        </div>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded px-1.5 py-0.5 text-foreground/50 hover:bg-white/5 hover:text-foreground"
        >
          ✕
        </button>
      </div>

      {/* Wire section */}
      <div className="border-b border-white/5 px-3 py-2">
        <div className="flex items-center justify-between">
          <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
            {live ? "Live wire" : "Wire"}
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="rounded border border-terminal-amber/40 bg-terminal-amber/5 px-2 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/15 disabled:opacity-50"
          >
            {loading ? "fetching…" : live ? "↻ Refresh" : "↻ Pull live"}
          </button>
        </div>
      </div>

      <ul className="flex-1 divide-y divide-white/5 overflow-y-auto font-terminal text-[12px]">
        {loading && !live && (
          <li className="px-3 py-3 text-foreground/50">
            <span className="animate-blink">▮</span> Searching the wire for {c.name}…
          </li>
        )}
        {error && (
          <li className="px-3 py-2 text-terminal-red">[error] {error}</li>
        )}
        {(live ?? c.headlines.map((h) => ({ headline: h }))).map((it, i) => {
          const item = it as LiveItem;
          return (
            <li key={i} className="px-3 py-2 leading-snug text-foreground/85">
              <div className="flex gap-2">
                <span className="text-terminal-dim">›</span>
                <div className="min-w-0">
                  {item.url ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-terminal-amber"
                    >
                      {item.headline}
                    </a>
                  ) : (
                    <span>{item.headline}</span>
                  )}
                  {(item.source || item.when) && (
                    <div className="mt-0.5 text-[10px] uppercase tracking-widest text-foreground/40">
                      {item.source}
                      {item.source && item.when ? " · " : ""}
                      {item.when}
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Question chips */}
      <div className="border-t border-white/10 bg-black/40 p-3">
        <div className="mb-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
          Ask the Ledger about {c.name}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => onAsk(chip.prompt, true)}
              className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1 font-terminal text-[10px] uppercase tracking-widest text-foreground/80 transition hover:border-terminal-amber/40 hover:bg-terminal-amber/10 hover:text-terminal-amber"
            >
              {chip.label}
            </button>
          ))}
          <button
            onClick={() =>
              onAsk(`Tell me about ${c.name} — `, false)
            }
            className="rounded-full border border-terminal-amber/40 bg-terminal-amber/10 px-2.5 py-1 font-terminal text-[10px] uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/20"
          >
            Ask anything
          </button>
        </div>
        <div className="mt-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/30">
          lat {c.lat.toFixed(1)} · lng {c.lng.toFixed(1)}
        </div>
      </div>
    </div>
  );
}
