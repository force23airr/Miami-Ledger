"use client";

import { useEffect, useState } from "react";

export default function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!now) {
    return <span className="font-terminal text-terminal-amber">--:--:--</span>;
  }

  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const date = now.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
  }).toUpperCase();

  return (
    <span className="font-terminal">
      <span className="text-foreground/60">{date}</span>{" "}
      <span className="text-terminal-amber glow-amber">{hh}:{mm}:{ss}</span>{" "}
      <span className="text-foreground/40">EDT</span>
    </span>
  );
}
