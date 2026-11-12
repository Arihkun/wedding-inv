"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { weddingConfig } from "@/config/wedding.config";
import { formatEventDate } from "@/lib/wedding";
import { MonogramCrest } from "@/components/botanical-ornaments";
import { useInvitation } from "@/components/invitation-provider";

export function HeroSection() {
  const { isGateOpen } = useInvitation();
  const shouldReduceMotion = useReducedMotion();

  const formattedDate = formatEventDate(
    weddingConfig.weddingDate,
    weddingConfig.timezone,
    weddingConfig.locale
  );

  return (
    <section
      id="hero"
      aria-label="Sampul Undangan"
      className="relative min-h-[95vh] flex flex-col justify-between items-center text-center px-6 py-14 bg-forest text-ivory overflow-hidden"
    >
      {/* Background Decorative Radial Glow with subtle breathing pulse */}
      <motion.div
        animate={
          shouldReduceMotion
            ? undefined
            : {
                scale: [1, 1.12, 1],
                opacity: [0.15, 0.28, 0.15],
              }
        }
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/15 blur-3xl pointer-events-none"
      />

      {/* Top Header with Monogram Crest */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={
          isGateOpen || shouldReduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
        }
        transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-xl mx-auto space-y-2 mt-2"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  rotate: [0, 4, -4, 0],
                }
          }
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <MonogramCrest className="mb-1" />
        </motion.div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
          THE WEDDING CELEBRATION OF
        </p>
        <h1 className="editorial-title text-5xl sm:text-7xl font-normal text-ivory tracking-tight">
          {weddingConfig.couple.title}
        </h1>
      </motion.div>

      {/* Centerpiece Arched Portrait Photo with Grand Zoom & Float Entrance */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.88, y: 30 }}
        animate={
          isGateOpen || shouldReduceMotion
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.88, y: 30 }
        }
        transition={{ duration: 0.95, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 my-6 w-full max-w-sm mx-auto"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  y: [0, -6, 0],
                }
          }
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative mx-auto aspect-[3/4] w-64 sm:w-72 arch-frame overflow-hidden border-2 border-gold/45 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-1 bg-gradient-to-b from-gold/40 via-transparent to-gold/40"
        >
          <div className="w-full h-full arch-frame overflow-hidden relative">
            <Image
              src={weddingConfig.hero.src}
              alt={weddingConfig.hero.alt}
              width={weddingConfig.hero.width}
              height={weddingConfig.hero.height}
              priority
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {/* Subtle vignette overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/60 via-transparent to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </motion.div>

      {/* Bottom Date and Scroll Prompt */}
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
        animate={
          isGateOpen || shouldReduceMotion
            ? { opacity: 1, y: 0 }
            : { opacity: 0, y: 24 }
        }
        transition={{ duration: 0.85, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-md mx-auto space-y-4 mb-2"
      >
        <div className="inline-block px-5 py-2 rounded-full border border-gold/40 bg-forest-dark/80 text-gold-muted text-xs tracking-wider uppercase font-medium shadow-md">
          {formattedDate}
        </div>
        <p className="text-base text-ivory/85 font-sans tracking-wide leading-relaxed italic font-light">
          &ldquo;Bersama merayakan komitmen, cinta, dan awal perjalanan hidup baru&rdquo;
        </p>

        {/* Floating Scroll Down Cue with pulse & bounce */}
        <div className="pt-2 flex flex-col items-center justify-center text-gold animate-bounce">
          <span className="text-[10px] uppercase tracking-widest text-gold-muted">Gulir ke Bawah</span>
          <ChevronDown className="w-4 h-4 mt-1 text-gold" />
        </div>
      </motion.div>
    </section>
  );
}
