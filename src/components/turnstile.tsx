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
    onloadTurnstileCallback?: () => void;
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

export const TurnstileWidget = forwardRef<TurnstileHandle, TurnstileWidgetProps>(
  ({ action, onSuccess, onError, onExpire }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [unavailable, setUnavailable] = useState(!SITE_KEY);

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
        setUnavailable(true);
        return;
      }

      // Check if turnstile script already loaded
      if (window.turnstile) {
        setScriptLoaded(true);
        return;
      }

      const existingScript = document.getElementById("cf-turnstile-script");
      if (!existingScript) {
        const script = document.createElement("script");
        script.id = "cf-turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = () => setScriptLoaded(true);
        script.onerror = () => {
          setUnavailable(true);
          onError?.();
        };
        document.head.appendChild(script);
      } else {
        existingScript.addEventListener("load", () => setScriptLoaded(true));
      }
    }, [onError]);

    useEffect(() => {
      if (!scriptLoaded || !containerRef.current || !window.turnstile || !SITE_KEY) return;

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: SITE_KEY,
          action,
          theme: "light",
          callback: (token: string) => {
            onSuccess(token);
          },
          "error-callback": () => {
            onError?.();
          },
          "expired-callback": () => {
            onExpire?.();
          },
        });
        widgetIdRef.current = id;
      } catch {
        setUnavailable(true);
        onError?.();
      }

      return () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            // ignore
          }
          widgetIdRef.current = null;
        }
      };
    }, [scriptLoaded, action, onSuccess, onError, onExpire]);

    if (unavailable) {
      return (
        <div
          className="rounded-lg border border-amber-300 bg-amber-50 p-3.5 text-xs text-amber-900 flex items-start gap-2.5 my-3"
          role="alert"
        >
          <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Sistem verifikasi keamanan sedang tidak tersedia</p>
            <p className="text-amber-800/90 mt-0.5">
              Kunci Turnstile belum dikonfigurasi pada environment ini. Pengiriman formulir dinonaktifkan sementara demi keamanan.
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
