"use client";

import Link from "next/link";
import { useState } from "react";
import CamTile from "@/components/CamTile";
import { CAMS, CATEGORY_LABEL, type Cam, type CamCategory } from "@/lib/cams";

const CATEGORIES: ("all" | CamCategory)[] = [
  "all",
  "traffic",
  "beach",
  "port",
  "skyline",
  "transit",
];

export default function StreetsPage() {
  const [filter, setFilter] = useState<"all" | CamCategory>("all");
  const [expanded, setExpanded] = useState<Cam | null>(null);

  const visible =
    filter === "all" ? CAMS : CAMS.filter((c) => c.category === filter);

  return (
    <div className="terminal-scanlines relative min-h-screen overflow-hidden bg-terminal-bg text-foreground">
      <div className="terminal-grid-bg absolute inset-0 opacity-50" />
      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-6 sm:px-6">
        {/* System bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-terminal-amber/20 pb-3 font-terminal text-[11px]">
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="rounded-sm border border-white/10 bg-white/5 px-2 py-1 uppercase tracking-widest text-foreground/70 hover:border-accent hover:text-accent"
            >
              ← Miami Ledger
            </Link>
            <span className="font-editorial text-lg font-black uppercase tracking-tight text-foreground">
              Ledger<span className="text-terminal-amber">::Streets</span>
            </span>
            <span className="text-foreground/40">v0.1 · public feeds only</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-foreground/40">{visible.length} channels</span>
            <span className="text-terminal-green glow-green">● online</span>
          </div>
        </div>

        {/* Hero */}
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="font-terminal text-[11px] uppercase tracking-widest text-terminal-amber">
              <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
              Live · public street feeds
            </div>
            <h1 className="mt-2 font-editorial text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              The 305, in motion.
            </h1>
            <p className="mt-2 max-w-2xl text-foreground/65">
              A wall of public Miami camera feeds — traffic, beach, port,
              skyline, transit — all from sources that publish openly. Click any
              channel to expand.
            </p>
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const label = c === "all" ? "All" : CATEGORY_LABEL[c];
            const active = filter === c;
            const count =
              c === "all" ? CAMS.length : CAMS.filter((x) => x.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-3 py-1 font-terminal text-[10px] uppercase tracking-widest transition ${
                  active
                    ? "border-terminal-amber bg-terminal-amber/15 text-terminal-amber"
                    : "border-white/15 bg-white/5 text-foreground/70 hover:border-terminal-amber/40 hover:text-terminal-amber"
                }`}
              >
                {label} <span className="opacity-60">· {count}</span>
              </button>
            );
          })}
        </div>

        {/* Wall */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {visible.map((c) => (
            <CamTile key={c.slug} cam={c} onExpand={() => setExpanded(c)} />
          ))}
        </div>

        {/* Footer notes */}
        <div className="mt-10 grid gap-4 rounded-md border border-white/10 bg-black/40 p-4 font-terminal text-[11px] leading-relaxed text-foreground/60 md:grid-cols-3">
          <div>
            <div className="mb-1 font-bold uppercase tracking-widest text-terminal-amber">
              Public sources only
            </div>
            <p>
              Every feed comes from a camera the operator has chosen to publish
              publicly — FDOT 511, EarthCam, hotel webcams, Surfline, port and
              airport publics. We do not access private cameras.
            </p>
          </div>
          <div>
            <div className="mb-1 font-bold uppercase tracking-widest text-terminal-amber">
              Configuration
            </div>
            <p>
              Feeds shipped as <code className="text-foreground/80">verified: false</code>{" "}
              are placeholders. Edit{" "}
              <code className="text-foreground/80">lib/cams.ts</code> to plug in
              real public URLs (FDOT snapshot or YouTube video ID).
            </p>
          </div>
          <div>
            <div className="mb-1 font-bold uppercase tracking-widest text-terminal-amber">
              Take down
            </div>
            <p>
              Operator wants their feed removed?{" "}
              <a href="mailto:streets@miamiledger.org" className="underline">
                streets@miamiledger.org
              </a>
              . We act same day.
            </p>
          </div>
        </div>
      </div>

      {/* Expanded modal */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setExpanded(null)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex items-center justify-between">
              <div>
                <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
                  expanded view
                </div>
                <div className="font-editorial text-2xl font-bold">
                  {expanded.name}
                </div>
                <div className="font-terminal text-[11px] uppercase tracking-widest text-foreground/50">
                  {expanded.neighborhood} · {expanded.category}
                  {expanded.credit ? ` · ${expanded.credit}` : ""}
                </div>
              </div>
              <button
                onClick={() => setExpanded(null)}
                aria-label="Close"
                className="rounded-md border border-white/15 px-3 py-1.5 font-terminal text-[11px] uppercase tracking-widest text-foreground/70 hover:border-foreground/40 hover:text-foreground"
              >
                ✕ Close
              </button>
            </div>
            <CamTile cam={expanded} large />
            {expanded.creditUrl && (
              <div className="mt-2 text-right font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
                source ·{" "}
                <a
                  href={expanded.creditUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-terminal-amber hover:underline"
                >
                  {expanded.creditUrl.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
