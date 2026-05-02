"use client";

import { useRef, useState } from "react";

type Entry = {
  id: number;
  q: string;
  a: string;
  streaming: boolean;
};

type Props = {
  datasetId: string;
  chips: string[];
  // Live data context the user is currently looking at — passed straight
  // to the API so the model can reference what's on screen.
  context: { rows: unknown[]; query?: Record<string, unknown> };
};

export default function MakeSenseOfThis({ datasetId, chips, context }: Props) {
  const [input, setInput] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

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
      const res = await fetch("/api/records", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          datasetId,
          context,
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
              ? {
                  ...e,
                  a: `[error: ${msg || res.statusText}]`,
                  streaming: false,
                }
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

  return (
    <section className="rounded-2xl border border-terminal-amber/30 bg-black/40 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 font-terminal text-[10px] uppercase tracking-widest">
        <span className="text-terminal-amber">
          <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
          Make sense of this
        </span>
        <span className="text-foreground/40">
          editorial commentary · streams from the desk
        </span>
      </div>

      {/* Chips */}
      <ul className="mt-4 flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip}>
            <button
              disabled={streaming}
              onClick={() => void ask(chip)}
              className="rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-left text-xs leading-5 text-foreground/85 transition hover:border-terminal-amber/60 hover:bg-white/[0.07] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
            >
              {chip}
            </button>
          </li>
        ))}
      </ul>

      {/* Free-text follow-up */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
        className="mt-4 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Or ask your own question…"
          className="flex-1 rounded-md border border-white/10 bg-black/60 px-3 py-2 font-terminal text-sm text-foreground placeholder:text-foreground/30 focus:border-terminal-amber/60 focus:outline-none"
        />
        {streaming ? (
          <button
            type="button"
            onClick={stop}
            className="rounded-md border border-terminal-red/40 bg-terminal-red/15 px-4 font-terminal text-xs uppercase tracking-widest text-terminal-red transition hover:bg-terminal-red/25"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-md border border-terminal-amber/50 bg-terminal-amber/15 px-4 font-terminal text-xs uppercase tracking-widest text-terminal-amber transition hover:bg-terminal-amber/25 disabled:opacity-40"
          >
            Ask →
          </button>
        )}
      </form>

      {/* Streaming answers */}
      {entries.length > 0 && (
        <div className="mt-5 flex flex-col gap-4">
          {entries.map((e) => (
            <article
              key={e.id}
              className="rounded-md border border-white/10 bg-white/[0.02] p-4"
            >
              <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
                Q
              </div>
              <p className="mt-1 text-sm leading-6 text-foreground">{e.q}</p>
              <div className="mt-3 font-terminal text-[10px] uppercase tracking-widest text-terminal-green">
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
      )}
    </section>
  );
}
