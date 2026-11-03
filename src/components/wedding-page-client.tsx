"use client";

import { useRef, useSyncExternalStore } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { weddingConfig } from "@/config/wedding.config";
import { formatEventDate } from "@/lib/wedding";
import { SmoothScroll } from "@/components/smooth-scroll";
import { InvitationProvider, useInvitation } from "@/components/invitation-provider";
import { OpeningGate } from "@/components/opening-gate";
import { AudioPlayer, type AudioPlayerHandle } from "@/components/audio-player";
import { Reveal } from "@/components/reveal";

// Sections
import { HeroSection } from "@/sections/hero-section";
import { CountdownSection } from "@/sections/countdown-section";
import { CoupleSection } from "@/sections/couple-section";
import { StorySection } from "@/sections/story-section";
import { EventsSection } from "@/sections/events-section";
import { GallerySection } from "@/sections/gallery-section";
import { GiftSection } from "@/sections/gift-section";
import { RsvpSection } from "@/sections/rsvp-section";
import { WishesSection } from "@/sections/wishes-section";
import { ClosingSection } from "@/sections/closing-section";

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

function useIsMounted() {
  return useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);
}

function WeddingPageContent() {
  const { isGateOpen } = useInvitation();
  const audioPlayerRef = useRef<AudioPlayerHandle | null>(null);
  const isMounted = useIsMounted();

  const handleOpenGate = () => {
    // Attempt audio playback upon user interaction
    audioPlayerRef.current?.playAudio();
  };

  const formattedDate = formatEventDate(
    weddingConfig.weddingDate,
    weddingConfig.timezone,
    weddingConfig.locale
  );

  // In SSR markup, main must not be inert so static/no-JS visitors can read it immediately.
  // Inert is only applied on the client once mounted while gate is active.
  const shouldContainInert = isMounted && !isGateOpen;

  return (
    <SmoothScroll>
      {/* Opening Gate Modal with Focus Containment */}
      <OpeningGate onOpen={handleOpenGate} />

      {/* Floating Audio Controller */}
      <div
        inert={shouldContainInert ? true : undefined}
        aria-hidden={shouldContainInert ? true : undefined}
        className={shouldContainInert ? "opacity-0 pointer-events-none" : "opacity-100 transition-opacity duration-300"}
      >
        <AudioPlayer ref={audioPlayerRef} />
      </div>

      {/* Main Single Document Layout */}
      <main
        id="main-content"
        tabIndex={-1}
        inert={shouldContainInert ? true : undefined}
        aria-hidden={shouldContainInert ? true : undefined}
        className="focus:outline-none"
      >
        <div className="flex flex-col lg:flex-row min-h-screen">
          {/* Desktop Left Column: Sticky Editorial Portrait */}
          <aside
            aria-label="Profil Utama Mempelai"
            className="hidden lg:flex lg:w-5/12 lg:h-screen lg:sticky lg:top-0 flex-col justify-between items-center text-center p-10 bg-forest text-ivory border-r border-gold/30 z-20 overflow-hidden"
          >
            <Reveal delay={0.1} y={16} className="relative z-10 space-y-2 mt-4">
              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium">
                UNDANGAN PERNIKAHAN
              </p>
              <h1 className="editorial-title text-5xl xl:text-6xl font-normal text-ivory tracking-tight">
                {weddingConfig.couple.title}
              </h1>
            </Reveal>

            <Reveal delay={0.25} y={20} scale={0.97} className="relative z-10 my-auto w-full max-w-xs">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border-2 border-gold/40 shadow-2xl">
                <Image
                  src={weddingConfig.hero.src}
                  alt={weddingConfig.hero.alt}
                  width={weddingConfig.hero.width}
                  height={weddingConfig.hero.height}
                  priority
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/40 via-transparent to-transparent pointer-events-none" />
              </div>
            </Reveal>

            <Reveal delay={0.4} y={16} className="relative z-10 space-y-2 mb-4">
              <div className="inline-block px-4 py-1.5 rounded-full border border-gold/40 bg-forest-dark/70 text-gold-muted text-xs tracking-wider uppercase font-medium">
                {formattedDate}
              </div>
              <p className="text-xs text-ivory/70 font-sans tracking-wide">
                Menuju Hari Bahagia Kinar &amp; Oki
              </p>
            </Reveal>
          </aside>

          {/* Right Column (and Mobile Flow): Editorial Content Stream with restrained Motion */}
          <motion.div
            initial={false}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full lg:w-7/12 flex flex-col"
          >
            {/* Mobile Hero (rendered on viewports below lg) */}
            <div className="block lg:hidden">
              <HeroSection />
            </div>

            <CountdownSection />
            <CoupleSection />
            <StorySection />
            <EventsSection />
            <GallerySection />
            <GiftSection />
            <RsvpSection />
            <WishesSection />
            <ClosingSection />
          </motion.div>
        </div>
      </main>
    </SmoothScroll>
  );
}

export function WeddingPageClient() {
  return (
    <InvitationProvider>
      <WeddingPageContent />
    </InvitationProvider>
  );
}
