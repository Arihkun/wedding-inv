"use client";

import { useReducedMotion } from "motion/react";

/**
 * Magic UI & Refero inspired Editorial Marquee:
 * An infinite luxury ribbon running slowly between sections with gold floral stars
 */
export function EditorialMarquee({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();

  const phrase = (
    <>
      <span className="font-serif italic tracking-wide text-ivory">
        The Wedding Celebration of Kinar &amp; Oki
      </span>
      <span className="text-gold text-xs">✦</span>
      <span className="tracking-widest uppercase text-[11px] font-medium text-gold-muted">
        Dua Insan, Satu Janji
      </span>
      <span className="text-gold text-xs">✦</span>
      <span className="font-serif italic tracking-wide text-ivory">
        Awal Perjalanan Hidup Baru
      </span>
      <span className="text-gold text-xs">✦</span>
      <span className="tracking-widest uppercase text-[11px] font-medium text-gold-muted">
        Menuju Hari Bahagia
      </span>
      <span className="text-gold text-xs">✦</span>
    </>
  );

  return (
    <div
      className={`relative w-full overflow-hidden bg-forest-dark border-y border-gold/30 py-3 select-none pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <div
        className={`flex whitespace-nowrap gap-6 w-max ${
          shouldReduceMotion ? "justify-center" : "animate-marquee"
        }`}
      >
        <div className="flex items-center gap-6">{phrase}</div>
        <div className="flex items-center gap-6">{phrase}</div>
        <div className="flex items-center gap-6">{phrase}</div>
        <div className="flex items-center gap-6">{phrase}</div>
      </div>
    </div>
  );
}
