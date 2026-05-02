"use client";

import { useEffect, useRef, useState } from "react";
import { STARTERS, type FactStarter } from "./starters";

type Entry = {
  id: number;
  q: string;
  a: string;
  streaming: boolean;
};

const STORAGE_KEY = "ml.facts.history.v1";
const MAX_HISTORY = 12;

const CATEGORIES: FactStarter["category"][] = [
  "Miami",
  "Florida",
  "Markets",
  "World",
  "Weird",
];

export default function FactsDesk() {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [filter, setFilter] = useState<"All" | FactStarter["category"]>("All");
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Entry[];
        setEntries(
          parsed.map((e) => ({ ...e, streaming: false })).slice(0, MAX_HISTORY),
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {}
  }, [entries]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || streaming) return;
    const id = Date.now();
    setInput("");
    setEntries((prev) => [{ id, q: trimmed, a: "", streaming: true }, ...prev]);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/facts", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: trimmed }],
        }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const err = await res.text().catch(() => "");
        let msg = err;
        try {
          msg = JSON.parse(err).error ?? err;
        } catch {}
        setEntries((prev) =>
          prev.map((e) =>
            e.id === id
              ? { ...e, a: `[error: ${msg || res.statusText}]`, streaming: false }
              : e,
          ),
        );
        setStreaming(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        setEntries((prev) =>
          prev.map((e) => (e.id === id ? { ...e, a: buf } : e)),
        );
      }
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, streaming: false } : e)),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "unknown";
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, a: `[error: ${msg}]`, streaming: false } : e,
        ),
      );
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
    setEntries((prev) => prev.map((e) => ({ ...e, streaming: false })));
    setStreaming(false);
  }

  function clearHistory() {
    setEntries([]);
  }

  function shuffle() {
    const pool = STARTERS.filter(
      (s) => filter === "All" || s.category === filter,
    );
    const pick = pool[Math.floor(Math.random() * pool.length)];
    if (pick) {
      void ask(pick.q);
    }
  }

  const visibleStarters = STARTERS.filter(
    (s) => filter === "All" || s.category === filter,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      {/* Left: prompt + answers */}
      <section className="lg:col-span-7">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void ask(input);
          }}
          className="rounded-2xl border border-terminal-amber/30 bg-black/60 p-4"
        >
          <label className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
            Ask the Facts Desk
          </label>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void ask(input);
              }
            }}
            rows={3}
            placeholder="How many arrests in Miami-Dade last year? How fast is Miami sinking? How heavy is a blue whale?"
            className="mt-3 w-full resize-none rounded-md border border-white/10 bg-black/80 p-3 font-terminal text-sm text-foreground placeholder:text-foreground/30 focus:border-terminal-amber/60 focus:outline-none"
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-terminal text-[10px] uppercase tracking-widest">
            <span className="text-foreground/40">
              ⌘ + return to send · streams live
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={shuffle}
                disabled={streaming}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-foreground/70 transition hover:border-accent hover:text-accent disabled:opacity-40"
              >
                Surprise me
              </button>
              {streaming ? (
                <button
                  type="button"
                  onClick={stop}
                  className="rounded-md border border-terminal-red/40 bg-terminal-red/15 px-3 py-1.5 text-terminal-red transition hover:bg-terminal-red/25"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-md border border-terminal-amber/50 bg-terminal-amber/15 px-3 py-1.5 text-terminal-amber transition hover:bg-terminal-amber/25 disabled:opacity-40"
                >
                  Look it up →
                </button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-6 flex items-baseline justify-between border-b border-white/10 pb-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
          <span>Recent lookups</span>
          {entries.length > 0 && (
            <button
              type="button"
              onClick={clearHistory}
              className="text-foreground/50 hover:text-accent"
            >
              Clear
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-6">
          {entries.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 font-terminal text-sm text-foreground/50">
              Empty desk. Type a question or click a starter on the right.
            </div>
          )}
          {entries.map((e) => (
            <article
              key={e.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
            >
              <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
                Q
              </div>
              <p className="mt-1 font-editorial text-xl leading-snug text-foreground">
                {e.q}
              </p>
              <div className="mt-4 font-terminal text-[10px] uppercase tracking-widest text-terminal-green">
                A
              </div>
              <div className="mt-1 whitespace-pre-wrap text-sm leading-7 text-foreground/85">
                {e.a || (e.streaming ? "…" : "")}
                {e.streaming && (
                  <span className="ml-1 inline-block h-3 w-1.5 translate-y-0.5 bg-terminal-amber animate-blink" />
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Right: starters */}
      <aside className="lg:col-span-5">
        <div className="flex items-baseline justify-between border-b border-white/10 pb-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/50">
          <span>Starters · click any</span>
          <span>{visibleStarters.length}</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`rounded-full px-3 py-1 font-terminal text-[10px] uppercase tracking-widest transition ${
                filter === c
                  ? "bg-terminal-amber text-ink"
                  : "border border-white/10 bg-white/5 text-foreground/60 hover:border-accent hover:text-accent"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="mt-5 grid gap-2">
          {visibleStarters.map((s) => (
            <li key={s.q}>
              <button
                disabled={streaming}
                onClick={() => void ask(s.q)}
                className="group flex w-full items-start gap-3 rounded-md border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-accent hover:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="mt-0.5 rounded-sm bg-white/10 px-1.5 py-0.5 font-terminal text-[9px] uppercase tracking-widest text-foreground/60 group-hover:bg-accent/20 group-hover:text-accent">
                  {s.category}
                </span>
                <span className="text-sm leading-6 text-foreground/85 group-hover:text-foreground">
                  {s.q}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
