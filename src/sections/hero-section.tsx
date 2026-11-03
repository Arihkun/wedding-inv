import Image from "next/image";
import { weddingConfig } from "@/config/wedding.config";
import { formatEventDate } from "@/lib/wedding";
import { Reveal } from "@/components/reveal";

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
      className="relative min-h-[90vh] flex flex-col justify-between items-center text-center px-6 py-16 bg-forest text-ivory overflow-hidden"
    >
      {/* Top Header */}
      <Reveal delay={0.1} y={16} className="relative z-10 max-w-xl mx-auto space-y-3">
        <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
          THE WEDDING CELEBRATION OF
        </p>
        <h1 className="editorial-title text-5xl sm:text-7xl font-normal text-ivory tracking-tight">
          {weddingConfig.couple.title}
        </h1>
      </Reveal>

      {/* Centerpiece Portrait Photo */}
      <Reveal delay={0.25} y={24} scale={0.97} className="relative z-10 my-8 w-full max-w-sm mx-auto">
        <div className="relative mx-auto aspect-[3/4] w-64 sm:w-72 rounded-2xl overflow-hidden border-2 border-gold/40 shadow-2xl">
          <Image
            src={weddingConfig.hero.src}
            alt={weddingConfig.hero.alt}
            width={weddingConfig.hero.width}
            height={weddingConfig.hero.height}
            priority
            className="w-full h-full object-cover"
          />
          {/* Subtle vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/50 via-transparent to-transparent pointer-events-none" />
        </div>
      </Reveal>

      {/* Bottom Date and Notice */}
      <Reveal delay={0.4} y={16} className="relative z-10 max-w-md mx-auto space-y-3">
        <div className="inline-block px-5 py-2 rounded-full border border-gold/40 bg-forest-dark/80 text-gold-muted text-xs tracking-wider uppercase font-medium">
          {formattedDate}
        </div>
        <p className="text-base text-ivory/80 font-sans tracking-wide leading-relaxed">
          Bersama merayakan komitmen, cinta, dan awal perjalanan hidup baru
        </p>
      </Reveal>
    </section>
  );
}
