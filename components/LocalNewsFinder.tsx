"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { LOCALITY_SUGGESTIONS } from "@/lib/local-news";

type Props = {
  defaultLocation?: string;
  openByDefault?: boolean;
};

export default function LocalNewsFinder({
  defaultLocation = "",
  openByDefault = false,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(openByDefault);
  const [location, setLocation] = useState(defaultLocation);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = location.trim();
    if (!clean) return;
    router.push(`/local?location=${encodeURIComponent(clean)}`);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6" aria-label="Local news finder">
      <div className="overflow-hidden rounded-xl border border-accent/30 bg-[linear-gradient(110deg,rgba(255,91,31,0.14),rgba(255,176,0,0.04),transparent)]">
        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <div className="font-terminal text-[10px] uppercase tracking-[0.22em] text-accent">
              Your corner of the 305
            </div>
            <h2 className="mt-1 font-editorial text-2xl font-bold sm:text-3xl">
              News closer to home.
            </h2>
            <p className="mt-1 text-sm text-foreground/60">
              Pick your city, neighborhood, or ZIP code for a more local Ledger.
            </p>
          </div>
          {!open && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="shrink-0 rounded-md bg-accent px-5 py-3 font-terminal text-xs font-bold uppercase tracking-widest text-ink transition hover:bg-accent-soft"
            >
              Get local news →
            </button>
          )}
        </div>

        {open && (
          <form onSubmit={submit} className="border-t border-white/10 p-5 sm:p-6">
            <label htmlFor="local-news-location" className="font-terminal text-[11px] uppercase tracking-widest text-foreground/60">
              City, neighborhood, or ZIP code
            </label>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
              <input
                id="local-news-location"
                name="location"
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                list="miami-dade-localities"
                autoFocus={!openByDefault}
                autoComplete="postal-code"
                placeholder="Try Palmetto Bay or 33157"
                maxLength={80}
                required
                className="min-w-0 flex-1 rounded-md border border-white/15 bg-black/30 px-4 py-3 text-sm text-foreground outline-none placeholder:text-foreground/35 focus:border-accent"
              />
              <datalist id="miami-dade-localities">
                {LOCALITY_SUGGESTIONS.map((locality) => (
                  <option key={locality} value={locality} />
                ))}
              </datalist>
              <button
                type="submit"
                className="rounded-md bg-accent px-5 py-3 font-terminal text-xs font-bold uppercase tracking-widest text-ink transition hover:bg-accent-soft"
              >
                Show my news →
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2" aria-label="Popular locations">
              {LOCALITY_SUGGESTIONS.slice(0, 4).map((locality) => (
                <button
                  key={locality}
                  type="button"
                  onClick={() => setLocation(locality)}
                  className="rounded-full border border-white/10 px-3 py-1 text-xs text-foreground/55 transition hover:border-accent/50 hover:text-foreground"
                >
                  {locality}
                </button>
              ))}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
