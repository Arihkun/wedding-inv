"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

// Single scroll lock manager to avoid conflicts between gate, dialogs, etc.
const activeLocks = new Set<string>();
let lenisInstance: Lenis | null = null;

function applyScrollLockState() {
  const shouldLock = activeLocks.size > 0;
  if (typeof document !== "undefined") {
    if (shouldLock) {
      document.body.style.overflow = "hidden";
      if (lenisInstance) {
        lenisInstance.stop();
      }
    } else {
      document.body.style.overflow = "";
      if (lenisInstance) {
        lenisInstance.start();
      }
    }
  }
}

export function acquireScrollLock(key: string) {
  activeLocks.add(key);
  applyScrollLockState();
}

export function releaseScrollLock(key: string) {
  activeLocks.delete(key);
  applyScrollLockState();
}

export function isScrollLocked() {
  return activeLocks.size > 0;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = mediaQuery.matches;

    let rafId: number | null = null;

    function initLenis() {
      if (isReducedMotion) {
        const instance = lenisRef.current;
        if (instance) {
          instance.destroy();
          if (lenisInstance === instance) {
            lenisInstance = null;
          }
          lenisRef.current = null;
        }
        applyScrollLockState();
        return;
      }

      const lenis = new Lenis({
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        gestureOrientation: "vertical",
        smoothWheel: true,
        syncTouch: false, // Maintain native mobile touch momentum
        touchMultiplier: 1.8,
      });

      lenisRef.current = lenis;
      lenisInstance = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }

      rafId = requestAnimationFrame(raf);
      applyScrollLockState();
    }

    initLenis();

    function handlePreferenceChange(e: MediaQueryListEvent) {
      isReducedMotion = e.matches;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      initLenis();
    }

    mediaQuery.addEventListener("change", handlePreferenceChange);

    return () => {
      mediaQuery.removeEventListener("change", handlePreferenceChange);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      const instance = lenisRef.current;
      if (instance) {
        instance.destroy();
        if (lenisInstance === instance) {
          lenisInstance = null;
        }
        lenisRef.current = null;
      }
    };
  }, []);

  return <>{children}</>;
}
