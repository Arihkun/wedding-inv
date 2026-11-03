"use client";

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { ShieldAlert } from "lucide-react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
          "error-callback"?: (error: unknown) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export interface TurnstileHandle {
  reset: () => void;
}

interface TurnstileWidgetProps {
  action: "rsvp" | "wish";
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Shared script loading singleton
let scriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window undefined"));
  }
  if (window.turnstile) {
    return Promise.resolve();
  }
  if (scriptPromise) {
    return scriptPromise;
  }

  scriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.getElementById("cf-turnstile-script") as HTMLScriptElement | null;
    if (existing) {
      if (window.turnstile) {
        resolve();
        return;
      }
      const onLoad = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        scriptPromise = null;
        reject(new Error("Turnstile script load error"));
      };
      const cleanup = () => {
        existing.removeEventListener("load", onLoad);
        existing.removeEventListener("error", onError);
      };
      existing.addEventListener("load", onLoad);
      existing.addEventListener("error", onError);
      return;
    }

    const script = document.createElement("script");
    script.id = "cf-turnstile-script";
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;

    const onLoad = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      scriptPromise = null;
      reject(new Error("Turnstile script load error"));
    };
    const cleanup = () => {
      script.removeEventListener("load", onLoad);
      script.removeEventListener("error", onError);
    };

    script.addEventListener("load", onLoad);
    script.addEventListener("error", onError);
    document.head.appendChild(script);
  });

  return scriptPromise;
}

export const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  ({ action, onSuccess, onError, onExpire }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "unavailable">(() =>
      SITE_KEY ? "loading" : "unavailable"
    );

    // Keep callbacks in ref to prevent inline callbacks from re-triggering widget render
    const callbacksRef = useRef({ onSuccess, onError, onExpire });
    useEffect(() => {
      callbacksRef.current = { onSuccess, onError, onExpire };
    });

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch {
            // ignore
          }
        }
      },
    }));

    useEffect(() => {
      if (!SITE_KEY) {
        return;
      }

      let isMounted = true;

      loadTurnstileScript()
        .then(() => {
          if (isMounted) {
            setStatus("ready");
          }
        })
        .catch(() => {
          if (isMounted) {
            setStatus("unavailable");
            callbacksRef.current.onError?.();
          }
        });

      return () => {
        isMounted = false;
      };
    }, []);

    // Render widget once script is ready and container is mounted
    useEffect(() => {
      if (status !== "ready" || !containerRef.current || !window.turnstile || !SITE_KEY) {
        return;
      }

      let widgetId: string | null = null;

      try {
        widgetId = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          action,
          theme: "light",
          callback: (token: string) => {
            callbacksRef.current.onSuccess(token);
          },
          "error-callback": () => {
            callbacksRef.current.onError?.();
          },
          "expired-callback": () => {
            callbacksRef.current.onExpire?.();
          },
        });
        widgetIdRef.current = widgetId;
      } catch {
        setStatus("unavailable");
        callbacksRef.current.onError?.();
      }

      return () => {
        if (widgetId && window.turnstile) {
          try {
            window.turnstile.remove(widgetId);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }
      };
    }, [status, action]);

    if (status === "unavailable") {
      return (
        <div
          className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-xs text-amber-900 flex items-start gap-2.5 my-3"
          role="alert"
        >
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Verifikasi keamanan belum dapat dimuat</p>
            <p className="text-amber-800/90 mt-1 leading-relaxed">
              Layanan keamanan sedang tidak tersedia pada saat ini. Silakan muat ulang halaman atau coba beberapa saat lagi.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="my-3 min-h-[65px] flex items-center justify-center">
        <div ref={containerRef} />
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
