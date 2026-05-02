import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Put the Ledger on your TV — Miami Ledger",
  description:
    "Free wallpaper for your bar, gym, office, or living room. How to cast Miami Ledger TV mode to Chromecast, Apple TV, Fire Stick, and Smart TVs.",
};

const STEPS: {
  device: string;
  tag: string;
  steps: string[];
  note?: string;
}[] = [
  {
    device: "Chromecast / Google TV",
    tag: "easiest",
    steps: [
      "Open Chrome on a laptop or desktop on the same Wi-Fi as your TV.",
      "Go to miamiledger.org/tv and press F to enter fullscreen.",
      "Click the three-dot menu in Chrome → Cast… → choose your TV.",
      "From the Sources dropdown, pick Cast tab. Hit Cast.",
    ],
    note: "Leave the laptop running. The cast continues until you close the tab or stop sharing.",
  },
  {
    device: "Apple TV (AirPlay)",
    tag: "iPhone or Mac",
    steps: [
      "From an iPhone: open miamiledger.org/tv in Safari, tap the share icon, then AirPlay → choose your Apple TV.",
      "From a Mac: open Control Center in the menu bar → Screen Mirroring → choose your Apple TV.",
      "Open Safari, navigate to miamiledger.org/tv, then enter fullscreen with View → Enter Full Screen.",
    ],
    note: "AirPlay mirrors your screen, so anything else you do on the device shows up on the TV. Dedicate the device or use a Chromecast tab cast instead.",
  },
  {
    device: "Fire TV Stick",
    tag: "the cheap reliable option",
    steps: [
      "From the Fire TV home screen, search and install the Silk Browser (free, Amazon's browser).",
      "Open Silk and type miamiledger.org/tv.",
      "Bookmark the page. Optionally, set it as the homepage so it loads automatically when you power on the stick.",
    ],
    note: "$30 hardware turns any HDMI TV into a Ledger display.",
  },
  {
    device: "Smart TV browser",
    tag: "Samsung, LG, Hisense",
    steps: [
      "Open the built-in browser app (Internet on Samsung, Web Browser on LG, etc.).",
      "Go to miamiledger.org/tv and bookmark it.",
      "If your TV has an auto-launch setting, point it at the bookmark.",
    ],
    note: "Smart TV browsers can be slow or buggy. If panels stutter, switch to a Chromecast or Fire Stick — they'll always perform better.",
  },
  {
    device: "HDMI from a laptop",
    tag: "no extra hardware",
    steps: [
      "Plug an HDMI cable from your laptop into the TV.",
      "Open Chrome (or any modern browser), go to miamiledger.org/tv.",
      "Press F to enter fullscreen. On macOS, also auto-hide the dock so it doesn't cover the bottom ticker (System Settings → Desktop & Dock → Automatically hide).",
    ],
    note: "Best if the laptop is permanently parked nearby. Use the lid-closed clamshell mode and an external power supply.",
  },
];

const TIPS = [
  {
    key: "F",
    body: "Toggle fullscreen on the /tv page itself.",
  },
  {
    key: "← →",
    body: "Manually rotate panels. Otherwise the page advances every 22 seconds on its own.",
  },
  {
    key: "no input needed",
    body: "The page never requires interaction. It refreshes data over the live connection and rotates panels indefinitely.",
  },
  {
    key: "no API keys",
    body: "Markets data uses Coinbase's public WebSocket. Headlines, beats, and ticker pull from the Ledger directly. No accounts, no logins, no fees.",
  },
  {
    key: "16:9 native",
    body: "Designed for 1080p and 4K landscape displays. Scales down to a laptop preview cleanly.",
  },
];

export default function TvGuidePage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 lg:py-24">
      <div className="font-terminal text-xs uppercase tracking-[0.4em] text-terminal-amber">
        Cast · Guide
      </div>
      <h1 className="mt-4 font-editorial text-5xl font-black leading-[1.05] tracking-tight md:text-7xl">
        Put the Ledger on your TV.
      </h1>
      <p className="mt-6 max-w-3xl font-editorial text-2xl leading-snug text-foreground/70">
        Free ambient signal for your bar, gym, office, or living room. Live
        markets, headlines, and beats — auto-rotating, never needs interaction,
        designed to leave running for weeks.
      </p>

      <div className="mt-10 rounded-md border border-terminal-amber/30 bg-black/60 p-6">
        <div className="font-terminal text-xs uppercase tracking-[0.4em] text-terminal-amber">
          The URL
        </div>
        <div className="mt-2 flex flex-wrap items-baseline gap-4">
          <code className="font-terminal text-3xl text-foreground md:text-4xl">
            miamiledger.org/tv
          </code>
          <Link
            href="/tv"
            className="font-terminal text-xs uppercase tracking-[0.3em] text-accent underline-offset-4 hover:underline"
          >
            Open it now →
          </Link>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">
          Five ways to cast it
        </h2>
        <p className="mt-2 font-terminal text-sm uppercase tracking-[0.3em] text-foreground/50">
          Pick whichever matches the hardware you already own.
        </p>

        <ol className="mt-10 flex flex-col gap-12">
          {STEPS.map((s, i) => (
            <li key={s.device} className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <div className="font-terminal text-sm uppercase tracking-[0.4em] text-terminal-amber">
                  Method · {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-2 font-editorial text-2xl font-bold leading-tight">
                  {s.device}
                </div>
                <div className="mt-1 font-terminal text-xs uppercase tracking-widest text-foreground/40">
                  {s.tag}
                </div>
              </div>
              <div className="md:col-span-9">
                <ol className="flex flex-col gap-3 font-editorial text-lg leading-relaxed text-foreground/85">
                  {s.steps.map((step, j) => (
                    <li key={j} className="flex gap-4">
                      <span className="shrink-0 font-terminal text-sm text-terminal-amber">
                        {String(j + 1).padStart(2, "0")}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                {s.note && (
                  <p className="mt-4 border-l-2 border-terminal-amber/40 pl-4 font-terminal text-sm leading-relaxed text-foreground/55">
                    {s.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-20 border-t border-white/10 pt-12">
        <h2 className="font-editorial text-3xl font-bold tracking-tight md:text-4xl">
          Notes from the desk
        </h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2">
          {TIPS.map((t) => (
            <li
              key={t.key}
              className="rounded-md border border-white/10 bg-black/40 p-5"
            >
              <div className="font-terminal text-xs uppercase tracking-[0.4em] text-terminal-amber">
                {t.key}
              </div>
              <p className="mt-2 font-editorial text-lg leading-snug text-foreground/85">
                {t.body}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-20 rounded-md border border-accent/30 bg-accent/5 p-8">
        <h2 className="font-editorial text-3xl font-bold tracking-tight">
          Hung the Ledger somewhere cool?
        </h2>
        <p className="mt-3 max-w-2xl font-editorial text-lg leading-snug text-foreground/80">
          Tag{" "}
          <a
            href="https://x.com/miamiledger"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline-offset-4 hover:underline"
          >
            @miamiledger
          </a>{" "}
          on X with a photo of where you put it — coffee shops, trading desks,
          gyms, garages, dorms. We'll repost the best ones.
        </p>
      </section>

      <div className="mt-16 flex flex-wrap items-center gap-6 border-t border-white/10 pt-8 font-terminal text-sm uppercase tracking-[0.3em] text-foreground/50">
        <Link href="/tv" className="text-accent hover:underline">
          → Launch /tv
        </Link>
        <Link href="/" className="hover:text-foreground">
          ← Back to the Ledger
        </Link>
      </div>
    </div>
  );
}
