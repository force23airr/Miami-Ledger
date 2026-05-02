"use client";

import { useEffect, useMemo, useState } from "react";

type Band = {
  id: string;
  label: string;
  desc: string;
  path: string; // path under SECTOR/<sector>/
};

const BANDS: Band[] = [
  {
    id: "GEOCOLOR",
    label: "GeoColor",
    desc: "True color daytime, IR-blended nighttime",
    path: "GEOCOLOR",
  },
  {
    id: "02",
    label: "Visible",
    desc: "Daytime visible (band 2)",
    path: "02",
  },
  {
    id: "13",
    label: "Clean IR",
    desc: "Cloud tops, longwave IR (band 13)",
    path: "13",
  },
  {
    id: "08",
    label: "Water Vapor",
    desc: "Upper-level moisture (band 8)",
    path: "08",
  },
  {
    id: "AirMass",
    label: "Air Mass",
    desc: "RGB composite — jet streams, dry intrusions",
    path: "AirMass",
  },
  {
    id: "DayCloudPhase",
    label: "Cloud Phase",
    desc: "Ice vs. liquid cloud tops, daytime",
    path: "DayCloudPhase",
  },
];

type Sector = {
  id: string;
  label: string;
  blurb: string;
  code: string; // NOAA sector code
};

const SIDE_SECTORS: Sector[] = [
  {
    id: "fd",
    label: "Full Disk",
    blurb: "Western Hemisphere from 22,236 mi up",
    code: "FD",
  },
  {
    id: "gm",
    label: "Gulf of Mexico",
    blurb: "GoM + the Florida peninsula",
    code: "gm",
  },
  {
    id: "taw",
    label: "Tropical Atlantic",
    blurb: "Hurricane alley · West Africa to Caribbean",
    code: "taw",
  },
];

const REFRESH_MS = 60_000;

function noaaUrl(sectorCode: string, bandPath: string, bust: number): string {
  // FD (Full Disk) lives at /ABI/FD/<band>/latest.jpg, sectors at
  // /ABI/SECTOR/<sector>/<band>/latest.jpg
  const base =
    sectorCode === "FD"
      ? `https://cdn.star.nesdis.noaa.gov/GOES19/ABI/FD/${bandPath}`
      : `https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/${sectorCode}/${bandPath}`;
  return `${base}/latest.jpg?t=${bust}`;
}

function modisMiamiUrl(date: string): string {
  // NASA Worldview Snapshots — open, no auth.
  // Bbox roughly Miami metro: 25.4°N–26.0°N, 80.6°W–80.0°W.
  const params = new URLSearchParams({
    REQUEST: "GetSnapshot",
    LAYERS: "MODIS_Terra_CorrectedReflectance_TrueColor",
    CRS: "EPSG:4326",
    TIME: date,
    WRAP: "DAY",
    BBOX: "25.3,-80.7,26.1,-79.9",
    FORMAT: "image/jpeg",
    WIDTH: "1200",
    HEIGHT: "1200",
  });
  return `https://wvs.earthdata.nasa.gov/api/v1/snapshot?${params.toString()}`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function SkyView() {
  const [band, setBand] = useState<Band>(BANDS[0]);
  const [tick, setTick] = useState(0);
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [secondsAgo, setSecondsAgo] = useState(0);

  // Refresh imagery on a timer.
  useEffect(() => {
    const id = setInterval(() => {
      setTick((x) => x + 1);
      setLastRefresh(Date.now());
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, []);

  // Tick the "X seconds ago" label every second.
  useEffect(() => {
    const id = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastRefresh) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [lastRefresh]);

  const heroUrl = useMemo(() => noaaUrl("se", band.path, tick), [band, tick]);
  const today = useMemo(() => todayIso(), []);

  return (
    <div className="flex flex-col gap-6">
      {/* Band tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-terminal-amber/20 pb-2">
        <div className="flex flex-wrap gap-1.5">
          {BANDS.map((b) => (
            <button
              key={b.id}
              onClick={() => setBand(b)}
              className={`rounded-md px-3 py-1.5 font-terminal text-[11px] uppercase tracking-widest transition ${
                band.id === b.id
                  ? "bg-terminal-amber text-ink"
                  : "border border-white/10 bg-white/5 text-foreground/70 hover:border-accent hover:text-accent"
              }`}
              title={b.desc}
            >
              {b.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
          <span>refresh · {Math.max(0, REFRESH_MS / 1000 - secondsAgo)}s</span>
          <span className="flex items-center gap-1.5 text-terminal-green">
            <span className="h-1.5 w-1.5 rounded-full bg-terminal-green animate-blink" />
            live
          </span>
        </div>
      </div>

      {/* Hero — Southeast sector */}
      <section>
        <div className="mb-2 flex items-baseline justify-between font-terminal text-[10px] uppercase tracking-widest">
          <span className="text-terminal-amber">
            GOES-19 :: Southeast US sector
          </span>
          <span className="text-foreground/40">
            {band.label} · {band.desc}
          </span>
        </div>
        <div className="overflow-hidden rounded-md border border-terminal-amber/30 bg-black">
          {/* Use a plain img — NOAA images are public, no Next/Image config needed. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={`${band.id}-${tick}`}
            src={heroUrl}
            alt={`GOES-19 ${band.label} imagery, Southeast US sector`}
            className="h-auto w-full"
          />
        </div>
      </section>

      {/* Side sectors */}
      <section>
        <div className="mb-2 border-b border-white/10 pb-1.5 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
          Other angles · same satellite
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SIDE_SECTORS.map((s) => (
            <figure
              key={s.id}
              className="overflow-hidden rounded-md border border-white/10 bg-black/60"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                key={`${s.id}-${tick}`}
                src={noaaUrl(s.code, "GEOCOLOR", tick)}
                alt={`GOES-19 ${s.label}`}
                className="h-auto w-full"
              />
              <figcaption className="border-t border-white/10 px-3 py-2 font-terminal text-[10px] uppercase tracking-widest">
                <span className="text-terminal-amber">{s.label}</span>
                <span className="ml-2 text-foreground/50">{s.blurb}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* High-res Miami via MODIS / NASA Worldview */}
      <section>
        <div className="mb-2 border-b border-white/10 pb-1.5 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
          High-res :: Miami metro · MODIS Terra · today
        </div>
        <div className="grid gap-4 md:grid-cols-5">
          <figure className="overflow-hidden rounded-md border border-white/10 bg-black/60 md:col-span-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={modisMiamiUrl(today)}
              alt="MODIS true color, Miami metro"
              className="h-auto w-full"
            />
            <figcaption className="border-t border-white/10 px-3 py-2 font-terminal text-[10px] uppercase tracking-widest">
              <span className="text-terminal-amber">Miami metro</span>
              <span className="ml-2 text-foreground/50">
                NASA Worldview · {today}
              </span>
            </figcaption>
          </figure>
          <div className="md:col-span-2">
            <div className="rounded-md border border-white/10 bg-black/60 p-4 font-terminal text-[11px] leading-relaxed text-foreground/70">
              <p className="text-terminal-amber">how this works</p>
              <p className="mt-2">
                The hero pane is GOES-19 — a NOAA satellite parked 22,236 mi
                above the equator, staring at the Western Hemisphere
                continuously. New frame every five minutes. Resolution is
                ~500m–2km — good for clouds, storms, and big-picture weather.
              </p>
              <p className="mt-2">
                The Miami pane uses NASA&apos;s MODIS instrument from polar-orbit
                sats (Terra/Aqua) — sharper at ~250m but only one daylight pass
                per day.
              </p>
              <p className="mt-2 text-foreground/50">
                Both feeds: free, public domain, no API keys.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
