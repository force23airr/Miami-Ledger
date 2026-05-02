"use client";

import { useEffect, useMemo, useState } from "react";
import type { Cam } from "@/lib/cams";

export default function CamTile({
  cam,
  large = false,
  onExpand,
}: {
  cam: Cam;
  large?: boolean;
  onExpand?: () => void;
}) {
  const [bust, setBust] = useState(0);

  // Refresh snapshot cams on a timer
  useEffect(() => {
    if (cam.source.type !== "snapshot") return;
    const sec = cam.source.refreshSeconds ?? 5;
    const id = setInterval(() => setBust((b) => b + 1), sec * 1000);
    return () => clearInterval(id);
  }, [cam]);

  const inner = useMemo(() => {
    if (!cam.verified) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-3 text-center">
          <span className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
            placeholder
          </span>
          <span className="font-terminal text-[11px] text-foreground/60">
            Swap source URL in <code>lib/cams.ts</code>
          </span>
        </div>
      );
    }

    if (cam.source.type === "youtube") {
      const id = cam.source.videoId;
      return (
        <iframe
          title={cam.name}
          src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&loop=1&playlist=${id}&modestbranding=1&rel=0`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      );
    }

    if (cam.source.type === "iframe") {
      return (
        <iframe
          title={cam.name}
          src={cam.source.url}
          allow="autoplay; fullscreen"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      );
    }

    // snapshot
    const sep = cam.source.url.includes("?") ? "&" : "?";
    return (
      <img
        src={`${cam.source.url}${sep}b=${bust}`}
        alt={cam.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }, [cam, bust]);

  return (
    <div
      onClick={onExpand}
      className={`group relative overflow-hidden rounded-md border border-white/10 bg-black ${
        onExpand ? "cursor-pointer hover:border-terminal-amber/50" : ""
      }`}
    >
      <div className={`relative ${large ? "aspect-video" : "aspect-[16/10]"}`}>
        {inner}

        {/* Scanlines overlay */}
        <div className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(255,255,255,0.04)_0px,rgba(255,255,255,0.04)_1px,transparent_1px,transparent_3px)]" />

        {/* LIVE badge */}
        <div className="absolute left-2 top-2 flex items-center gap-1.5 rounded-sm bg-black/70 px-1.5 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-red">
          <span className="h-1.5 w-1.5 rounded-full bg-terminal-red animate-blink" />
          live
        </div>

        {/* Channel marker */}
        <div className="absolute right-2 top-2 rounded-sm bg-black/70 px-1.5 py-0.5 font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
          ch · {cam.slug.split("-")[0]}
        </div>

        {/* Title bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent px-2 py-2">
          <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/60">
            {cam.neighborhood} · {cam.category}
          </div>
          <div className="font-editorial text-sm font-bold text-foreground">
            {cam.name}
          </div>
        </div>
      </div>
    </div>
  );
}
