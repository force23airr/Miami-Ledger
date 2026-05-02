"use client";

import { useEffect, useRef, useState } from "react";

type Message = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "ml.ask.history.v1";

declare global {
  interface WindowEventMap {
    "askledger:open": CustomEvent<{ prefill?: string; autoSend?: boolean }>;
  }
}

export default function AskLedger() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [streaming, setStreaming] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Restore history
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
  }, []);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: scrollerRef.current.scrollHeight });
  }, [messages, streaming]);

  // Listen for global open events (from Profit Angles buttons, etc.)
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<{ prefill?: string; autoSend?: boolean }>;
      setOpen(true);
      const prefill = ce.detail?.prefill ?? "";
      if (prefill) {
        if (ce.detail?.autoSend) {
          void send(prefill);
        } else {
          setInput(prefill);
        }
      }
    };
    window.addEventListener("askledger:open", handler);
    return () => window.removeEventListener("askledger:open", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || streaming) return;
    setInput("");
    const next: Message[] = [
      ...messages,
      { role: "user", content: trimmed },
      { role: "assistant", content: "" },
    ];
    setMessages(next);
    setStreaming(true);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
        signal: ctrl.signal,
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "Request failed");
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: `[error] ${errText}`,
          };
          return updated;
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: acc };
          return updated;
        });
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: `[error] ${(err as Error).message}`,
          };
          return updated;
        });
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  function clearChat() {
    if (streaming) abortRef.current?.abort();
    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  }

  return (
    <>
      {/* Floating launcher */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Ask the Ledger"
        className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-2 rounded-full border border-terminal-amber/40 bg-terminal-bg/95 px-4 py-2.5 font-terminal text-xs uppercase tracking-widest text-terminal-amber shadow-[0_0_30px_rgba(255,176,0,0.25)] backdrop-blur transition hover:bg-terminal-amber/10 hover:shadow-[0_0_40px_rgba(255,176,0,0.45)]"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
        Ask the Ledger
      </button>

      {/* Drawer */}
      <div
        className={`fixed inset-0 z-50 transition ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop */}
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/50 transition-opacity ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        {/* Panel */}
        <aside
          role="dialog"
          aria-label="Ask the Ledger"
          className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-white/10 bg-terminal-bg shadow-[0_0_60px_rgba(255,176,0,0.15)] transition-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
            <div>
              <div className="font-terminal text-[10px] uppercase tracking-widest text-terminal-amber">
                <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-terminal-amber animate-blink" />
                Ask the Ledger
              </div>
              <div className="font-editorial text-lg font-bold leading-tight text-foreground">
                Your 305 desk assistant
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={clearChat}
                className="rounded-md px-2 py-1 font-terminal text-[10px] uppercase tracking-widest text-foreground/50 hover:bg-white/5 hover:text-foreground"
              >
                Clear
              </button>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-md px-2 py-1 text-foreground/60 hover:bg-white/5 hover:text-foreground"
              >
                ✕
              </button>
            </div>
          </header>

          {/* Messages */}
          <div
            ref={scrollerRef}
            className="flex-1 overflow-y-auto px-4 py-5 font-sans text-sm"
          >
            {messages.length === 0 && (
              <div className="space-y-4">
                <p className="text-foreground/70">
                  Ask anything about Miami — news, fintech, neighborhoods,
                  what&apos;s happening this week. Or click <span className="text-terminal-amber">Profit angles →</span> on any story to see how to act on it.
                </p>
                <div className="space-y-2">
                  <div className="font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
                    Try
                  </div>
                  {[
                    "What's the deal with Brickell right now?",
                    "Best Cuban breakfast in Coral Gables",
                    "Summarize this week's biggest story for me",
                    "What's a fintech opportunity nobody's working on in Miami?",
                  ].map((q) => (
                    <button
                      key={q}
                      onClick={() => void send(q)}
                      className="block w-full rounded-md border border-white/10 bg-white/[0.02] px-3 py-2 text-left text-foreground/80 transition hover:border-terminal-amber/40 hover:bg-white/[0.05]"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <ul className="space-y-4">
              {messages.map((m, i) => (
                <li key={i}>
                  <div className="mb-1 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
                    {m.role === "user" ? "You" : "Ledger"}
                  </div>
                  <div
                    className={`whitespace-pre-wrap rounded-md px-3 py-2 leading-relaxed ${
                      m.role === "user"
                        ? "bg-white/[0.05] text-foreground"
                        : "bg-terminal-amber/5 text-foreground/90"
                    }`}
                  >
                    {m.content || (
                      <span className="inline-flex items-center text-foreground/40">
                        <span className="animate-blink">▮</span>
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="border-t border-white/10 bg-black/40 p-3"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void send(input);
                  }
                }}
                rows={1}
                placeholder="Ask the Ledger anything…"
                className="min-h-[40px] max-h-32 flex-1 resize-none rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm placeholder:text-foreground/30 focus:border-terminal-amber focus:outline-none"
              />
              {streaming ? (
                <button
                  type="button"
                  onClick={stop}
                  className="rounded-md border border-terminal-red/40 bg-terminal-red/10 px-3 py-2 font-terminal text-[11px] uppercase tracking-widest text-terminal-red hover:bg-terminal-red/20"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-md bg-terminal-amber px-3 py-2 font-terminal text-[11px] uppercase tracking-widest text-ink hover:bg-accent-soft disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Send
                </button>
              )}
            </div>
            <div className="mt-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/30">
              Powered by DeepSeek · educational, not financial advice
            </div>
          </form>
        </aside>
      </div>
    </>
  );
}

// Helper exported so other components can open the panel pre-filled
export function openAskLedger(prefill?: string, autoSend = false) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent("askledger:open", { detail: { prefill, autoSend } }),
  );
}
