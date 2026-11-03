"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";
import { formatEventDate } from "@/lib/wedding";
import { Reveal } from "@/components/reveal";
import { MonogramCrest } from "@/components/botanical-ornaments";

export function HeroSection() {
  const formattedDate = formatEventDate(
    weddingConfig.weddingDate,
    weddingConfig.timezone,
    weddingConfig.locale
  );

  return (
    <section
      id="hero"
      aria-label="Sampul Undangan"
      className="relative min-h-[95vh] flex flex-col justify-between items-center text-center px-6 py-16 bg-forest text-ivory overflow-hidden"
    >
      {/* Background Decorative Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      {/* Top Header with Monogram Crest */}
      <Reveal delay={0.1} y={16} className="relative z-10 max-w-xl mx-auto space-y-2">
        <MonogramCrest className="mb-1" />
        <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
          THE WEDDING CELEBRATION OF
        </p>
        <h1 className="editorial-title text-5xl sm:text-7xl font-normal text-ivory tracking-tight">
          {weddingConfig.couple.title}
        </h1>
      </Reveal>

      {/* Centerpiece Arched Portrait Photo */}
      <Reveal delay={0.25} y={24} scale={0.97} className="relative z-10 my-6 w-full max-w-sm mx-auto">
        <div className="relative mx-auto aspect-[3/4] w-64 sm:w-72 arch-frame overflow-hidden border-2 border-gold/45 shadow-[0_15px_40px_rgba(0,0,0,0.5)] p-1 bg-gradient-to-b from-gold/30 via-transparent to-gold/30">
          <div className="w-full h-full arch-frame overflow-hidden relative">
            <Image
              src={weddingConfig.hero.src}
              alt={weddingConfig.hero.alt}
              width={weddingConfig.hero.width}
              height={weddingConfig.hero.height}
              priority
              className="w-full h-full object-cover"
            />
            {/* Subtle vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </div>
      </Reveal>

      {/* Bottom Date and Scroll Prompt */}
      <Reveal delay={0.4} y={16} className="relative z-10 max-w-md mx-auto space-y-4">
        <div className="inline-block px-5 py-2 rounded-full border border-gold/40 bg-forest-dark/80 text-gold-muted text-xs tracking-wider uppercase font-medium shadow-md">
          {formattedDate}
        </div>
        <p className="text-base text-ivory/85 font-sans tracking-wide leading-relaxed italic font-light">
          &ldquo;Bersama merayakan komitmen, cinta, dan awal perjalanan hidup baru&rdquo;
        </p>

        {/* Floating Scroll Down Cue */}
        <div className="pt-2 flex flex-col items-center justify-center text-gold/70 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-gold-muted">Gulir ke Bawah</span>
          <ChevronDown className="w-4 h-4 mt-1 text-gold" />
        </div>
      </Reveal>
    </section>
  );
}
