"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=__ledgerTurnstileOnLoad&render=explicit";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          size?: "normal" | "compact" | "invisible" | "flexible";
          theme?: "light" | "dark" | "auto";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
      execute: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
    __ledgerTurnstileOnLoad?: () => void;
    __ledgerTurnstileReady?: boolean;
    __ledgerTurnstileWaiters?: Array<() => void>;
  }
}

function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.__ledgerTurnstileReady) return Promise.resolve();
  return new Promise((resolve) => {
    if (!window.__ledgerTurnstileWaiters) window.__ledgerTurnstileWaiters = [];
    window.__ledgerTurnstileWaiters.push(resolve);

    if (!document.querySelector(`script[src^="https://challenges.cloudflare.com/turnstile"]`)) {
      window.__ledgerTurnstileOnLoad = () => {
        window.__ledgerTurnstileReady = true;
        for (const w of window.__ledgerTurnstileWaiters ?? []) w();
        window.__ledgerTurnstileWaiters = [];
      };
      const s = document.createElement("script");
      s.src = SCRIPT_SRC;
      s.async = true;
      s.defer = true;
      document.head.appendChild(s);
    }
  });
}

// Visible managed widget. Used on /sponsor.
export function TurnstileWidget({
  onToken,
  onExpire,
}: {
  onToken: (token: string) => void;
  onExpire?: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const [bypassed] = useState(!siteKey);

  useEffect(() => {
    if (!siteKey || !ref.current) return;
    let mounted = true;
    void loadScript().then(() => {
      if (!mounted || !ref.current || !window.turnstile) return;
      widgetIdRef.current = window.turnstile.render(ref.current, {
        sitekey: siteKey,
        theme: "dark",
        callback: (token) => onToken(token),
        "expired-callback": () => onExpire?.(),
      });
    });
    return () => {
      mounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {}
      }
    };
    // We want this to mount once; callbacks are read fresh from closure.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [siteKey]);

  if (bypassed) {
    // Dev mode: no key configured. Render a stub so the form still works.
    return (
      <div className="rounded border border-white/10 bg-white/5 px-3 py-2 font-terminal text-[10px] uppercase tracking-widest text-foreground/40">
        Turnstile disabled (no NEXT_PUBLIC_TURNSTILE_SITE_KEY) — dev mode
      </div>
    );
  }

  return <div ref={ref} className="cf-turnstile" />;
}

// Invisible Turnstile for chat-style flows. Returns an executor that
// resolves to a token (or null if disabled). Each call mounts a one-shot
// invisible widget and waits for the callback.
export function useInvisibleTurnstile() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  const execute = useCallback(async (): Promise<string | null> => {
    if (!siteKey) return null; // disabled in dev
    if (typeof window === "undefined") return null;

    await loadScript();
    if (!window.turnstile) return null;

    return new Promise<string | null>((resolve) => {
      const container = document.createElement("div");
      container.style.display = "none";
      document.body.appendChild(container);

      let widgetId: string | null = null;
      const cleanup = () => {
        try {
          if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
        } catch {}
        try {
          container.remove();
        } catch {}
      };

      // Safety timeout — if Turnstile never returns, resolve null after 8s
      const timeoutId = setTimeout(() => {
        cleanup();
        resolve(null);
      }, 8000);

      try {
        widgetId = window.turnstile!.render(container, {
          sitekey: siteKey,
          size: "invisible",
          callback: (token) => {
            clearTimeout(timeoutId);
            cleanup();
            resolve(token);
          },
          "error-callback": () => {
            clearTimeout(timeoutId);
            cleanup();
            resolve(null);
          },
        });
        // Trigger the challenge
        if (widgetId) window.turnstile!.execute(widgetId);
      } catch {
        clearTimeout(timeoutId);
        cleanup();
        resolve(null);
      }
    });
  }, [siteKey]);

  return { execute, enabled: Boolean(siteKey) };
}
