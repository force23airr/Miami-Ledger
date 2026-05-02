"use client";

import { useEffect, useMemo, useState } from "react";
import { geoEqualEarth, geoPath, type GeoProjection } from "d3-geo";
import { feature } from "topojson-client";
import type { Feature, FeatureCollection, Geometry } from "geojson";
import { COUNTRIES, type Country } from "@/lib/globe";
import { openAskLedger } from "@/components/AskLedger";
import { safeHttpUrl } from "@/lib/validation";

const VB_W = 1000;
const VB_H = 520;
const TOPO_URL =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// Map ISO-2 (our internal) → ISO-3166-1 numeric (used in world-atlas TopoJSON)
const ISO2_TO_NUMERIC: Record<string, string> = {
  US: "840", MX: "484", BR: "076", CO: "170", AR: "032", CL: "152",
  PE: "604", VE: "862", CU: "192", DO: "214", HT: "332", CA: "124",
  GB: "826", ES: "724", DE: "276", FR: "250", IT: "380", PT: "620",
  IL: "376", AE: "784", SA: "682", ZA: "710", NG: "566",
  CN: "156", JP: "392", IN: "356", SG: "702", KR: "410", AU: "036",
};

const NUMERIC_TO_ISO2: Record<string, string> = Object.fromEntries(
  Object.entries(ISO2_TO_NUMERIC).map(([a, n]) => [n, a]),
);

type LiveItem = { headline: string; source?: string; when?: string; url?: string };

type CountryFeature = Feature<Geometry, { name?: string }>;

export default function GlobeFeed() {
  const [active, setActive] = useState<Country | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [features, setFeatures] = useState<CountryFeature[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [liveByCode, setLiveByCode] = useState<Record<string, LiveItem[]>>({});
  const [loadingCode, setLoadingCode] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<{ code: string; msg: string } | null>(null);

  // Fetch world TopoJSON once
  useEffect(() => {
    let cancelled = false;
    fetch(TOPO_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`world-atlas ${r.status}`);
        return r.json();
      })
      .then((topo) => {
        if (cancelled) return;
        const obj = topo?.objects?.countries;
        if (!obj) throw new Error("no countries object in topojson");
        // topojson-client's typings are loose; cast to our feature shape
        const fc = feature(topo, obj) as unknown as FeatureCollection<
          Geometry,
          { name?: string }
        >;
        setFeatures(fc.features);
      })
      .catch((e) => {
        if (!cancelled) setLoadError((e as Error).message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Projection — Equal Earth, fit to viewBox
  const projection: GeoProjection = useMemo(() => {
    return geoEqualEarth()
      .scale(180)
      .translate([VB_W / 2, VB_H / 2 + 8]);
  }, []);

  const pathGen = useMemo(() => geoPath(projection), [projection]);

  // Project country pin coordinates
  const projected = useMemo(
    () =>
      COUNTRIES.map((c) => {
        const p = projection([c.lng, c.lat]);
        return { country: c, x: p?.[0] ?? 0, y: p?.[1] ?? 0 };
      }),
    [projection],
  );

  // Auto-fetch live news on country selection
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

  function handleCountryClick(numericId: string) {
    const iso2 = NUMERIC_TO_ISO2[numericId];
    if (!iso2) return;
    const country = COUNTRIES.find((c) => c.code === iso2);
    if (country) setActive(country);
  }

  // Compute fill/highlight for each feature based on tier + active
  function fillForFeature(numericId: string): string {
    const iso2 = NUMERIC_TO_ISO2[numericId];
    if (!iso2) return "rgba(255,176,0,0.04)"; // unknown country: very faint
    const c = COUNTRIES.find((x) => x.code === iso2);
    if (!c) return "rgba(255,176,0,0.04)";
    if (active?.code === c.code) return "rgba(255,176,0,0.35)";
    if (hover === c.code) return "rgba(255,176,0,0.22)";
    if (c.tier === "MIA") return "rgba(255,91,31,0.18)";
    if (c.tier === "MAJOR") return "rgba(255,176,0,0.13)";
    return "rgba(0,255,156,0.07)";
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
          <span className="hidden sm:inline">click any country to drill in</span>
        </div>
      </div>

      <div className="grid gap-0 lg:grid-cols-12">
        {/* Map */}
        <div className="relative lg:col-span-8">
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            className="block w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background grid */}
            <defs>
              <pattern id="gf-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,176,0,0.05)" strokeWidth="1" />
              </pattern>
              <radialGradient id="gf-glow" cx="50%" cy="50%" r="60%">
                <stop offset="0%" stopColor="rgba(255,176,0,0.10)" />
                <stop offset="100%" stopColor="rgba(255,176,0,0)" />
              </radialGradient>
            </defs>
            <rect width={VB_W} height={VB_H} fill="url(#gf-grid)" />
            <rect width={VB_W} height={VB_H} fill="url(#gf-glow)" />

            {/* Graticule (lat/lng grid lines) using projection */}
            {[-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lng) => {
              const top = projection([lng, 80]);
              const bot = projection([lng, -80]);
              if (!top || !bot) return null;
              return (
                <line
                  key={`mer-${lng}`}
                  x1={top[0]}
                  y1={top[1]}
                  x2={bot[0]}
                  y2={bot[1]}
                  stroke="rgba(0,255,156,0.07)"
                  strokeDasharray="2 6"
                />
              );
            })}
            {[-60, -30, 0, 30, 60].map((lat) => {
              // approximate parallel as a line across visible width via samples
              const samples: [number, number][] = [];
              for (let lng = -180; lng <= 180; lng += 10) {
                const p = projection([lng, lat]);
                if (p) samples.push(p as [number, number]);
              }
              if (samples.length < 2) return null;
              const d =
                "M " +
                samples.map((s) => `${s[0]} ${s[1]}`).join(" L ");
              return (
                <path
                  key={`par-${lat}`}
                  d={d}
                  fill="none"
                  stroke={lat === 0 ? "rgba(255,176,0,0.18)" : "rgba(0,255,156,0.07)"}
                  strokeDasharray={lat === 0 ? "4 6" : "2 6"}
                />
              );
            })}

            {/* Countries */}
            {features ? (
              <g>
                {features.map((f) => {
                  const numericId = String(f.id ?? "");
                  const iso2 = NUMERIC_TO_ISO2[numericId];
                  const isInteractive = Boolean(iso2);
                  const d = pathGen(f);
                  if (!d) return null;
                  return (
                    <path
                      key={numericId || f.properties?.name}
                      d={d}
                      fill={fillForFeature(numericId)}
                      stroke="rgba(255,176,0,0.35)"
                      strokeWidth={0.5}
                      onMouseEnter={() => iso2 && setHover(iso2)}
                      onMouseLeave={() => iso2 && setHover((h) => (h === iso2 ? null : h))}
                      onClick={() => isInteractive && handleCountryClick(numericId)}
                      className={isInteractive ? "cursor-pointer" : undefined}
                    >
                      {iso2 && (
                        <title>
                          {COUNTRIES.find((c) => c.code === iso2)?.name ?? iso2}
                        </title>
                      )}
                    </path>
                  );
                })}
              </g>
            ) : (
              <text
                x={VB_W / 2}
                y={VB_H / 2}
                textAnchor="middle"
                fontFamily="ui-monospace, monospace"
                fontSize="14"
                fill="rgba(255,176,0,0.6)"
              >
                {loadError ? `[map load error: ${loadError}]` : "loading world atlas…"}
              </text>
            )}

            {/* Country pin nodes */}
            {projected.map(({ country, x, y }) => {
              const isActive = active?.code === country.code;
              const isHover = hover === country.code;
              const isMia = country.tier === "MIA";
              const isMajor = country.tier === "MAJOR";
              const baseR = isMia ? 4 : isMajor ? 3.5 : 2.5;
              const r = isActive || isHover ? baseR + 2 : baseR;
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
                    <circle cx={x} cy={y} r={r + 4} fill="none" stroke={fill} strokeOpacity="0.5" strokeWidth="1">
                      <animate attributeName="r" from={r + 1} to={r + 12} dur="2s" repeatCount="indefinite" />
                      <animate attributeName="stroke-opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={r}
                    fill={fill}
                    stroke="black"
                    strokeWidth={0.5}
                    style={{
                      filter: isActive
                        ? `drop-shadow(0 0 6px ${fill})`
                        : isHover
                          ? `drop-shadow(0 0 4px ${fill})`
                          : undefined,
                    }}
                  />
                  {(isHover || isActive) && (
                    <g style={{ pointerEvents: "none" }}>
                      <rect
                        x={x + r + 4}
                        y={y - 9}
                        rx={2}
                        ry={2}
                        height={14}
                        width={(country.code.length + country.name.length) * 5.5 + 14}
                        fill="rgba(0,0,0,0.85)"
                        stroke="rgba(255,176,0,0.4)"
                        strokeWidth={0.5}
                      />
                      <text
                        x={x + r + 10}
                        y={y + 1}
                        fontFamily="ui-monospace, monospace"
                        fontSize="10"
                        fill="#f5f1e8"
                      >
                        {country.code} · {country.name}
                      </text>
                    </g>
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
                select a country
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

      {/* Wire section header */}
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
        {error && <li className="px-3 py-2 text-terminal-red">[error] {error}</li>}
        {(live ?? c.headlines.map((h) => ({ headline: h }))).map((it, i) => {
          const item = it as LiveItem;
          // Defense-in-depth: validate URLs again at render time. The API
          // route also sanitizes, but never trust model-supplied content.
          const safeUrl = safeHttpUrl(item.url);
          return (
            <li key={i} className="px-3 py-2 leading-snug text-foreground/85">
              <div className="flex gap-2">
                <span className="text-terminal-dim">›</span>
                <div className="min-w-0">
                  {safeUrl ? (
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
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
            onClick={() => onAsk(`Tell me about ${c.name} — `, false)}
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
