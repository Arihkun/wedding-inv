"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { MailOpen, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { weddingConfig } from "@/config/wedding.config";
import { useInvitation } from "@/components/invitation-provider";
import { formatEventDate } from "@/lib/wedding";
import { acquireScrollLock, releaseScrollLock } from "@/components/smooth-scroll";
import { CornerFlourish } from "@/components/botanical-ornaments";
import { BorderBeam } from "@/components/border-beam";

interface OpeningGateProps {
  onOpen: () => void;
}

export function OpeningGate({ onOpen }: OpeningGateProps) {
  const { token, invitation, isLoading, error, isGateOpen, openGate, retryResolve } =
    useInvitation();
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const handleOpen = useCallback(() => {
    releaseScrollLock("gate");
    openGate();
    onOpen();
    // Focus main content after opening
    setTimeout(() => {
      const mainContent = document.getElementById("main-content");
      if (mainContent) {
        mainContent.focus();
      }
    }, 50);
  }, [openGate, onOpen]);

  // Lock body scroll while gate is open
  useEffect(() => {
    if (!isGateOpen) {
      acquireScrollLock("gate");
    } else {
      releaseScrollLock("gate");
    }
    return () => {
      releaseScrollLock("gate");
    };
  }, [isGateOpen]);

  // Initial focus and key listeners (Focus trap + Escape to open)
  useEffect(() => {
    if (isGateOpen) return;

    if (buttonRef.current) {
      buttonRef.current.focus();
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        handleOpen();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusableElements = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isGateOpen, handleOpen]);

  const formattedDate = formatEventDate(
    weddingConfig.weddingDate,
    weddingConfig.timezone,
    weddingConfig.locale
  );

  return (
    <>
      <noscript>
        <style>{`
          #opening-gate { display: none !important; }
        `}</style>
      </noscript>

      <AnimatePresence>
        {!isGateOpen && (
          <motion.div
            id="opening-gate"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Undangan Pernikahan Kinar dan Oki"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{
              opacity: 0,
              y: "-100%",
              scale: 0.98,
              transition: { duration: 0.9, ease: [0.32, 0.72, 0, 1] },
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest-dark/95 backdrop-blur-md text-ivory overflow-y-auto px-4 py-8"
          >
            {/* Physical Luxury Envelope Envelope Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -40 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-md w-full my-auto mx-auto bg-forest border-2 border-gold/40 rounded-3xl p-6 sm:p-10 text-center shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden"
            >
              {/* Shimmering Animated Perimeter Beam (Magic UI inspired) */}
              <BorderBeam size={280} duration={14} colorFrom="#D8BD82" colorTo="#C5A059" />

              {/* Corner flourishes */}
              <CornerFlourish position="top-left" className="top-2 left-2" />
              <CornerFlourish position="top-right" className="top-2 right-2" />
              <CornerFlourish position="bottom-left" className="bottom-2 left-2" />
              <CornerFlourish position="bottom-right" className="bottom-2 right-2" />

              {/* Decorative Envelope Flap Line */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

              {/* Embossed Wax Seal Badge */}
              <motion.button
                type="button"
                onClick={handleOpen}
                animate={{
                  scale: [1, 1.05, 1],
                  boxShadow: [
                    "0 6px 16px rgba(0, 0, 0, 0.35)",
                    "0 10px 24px rgba(197, 160, 89, 0.45)",
                    "0 6px 16px rgba(0, 0, 0, 0.35)",
                  ],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.1, rotate: 3 }}
                whileTap={{ scale: 0.92 }}
                className="relative mx-auto -mt-2 mb-6 w-16 h-16 rounded-full wax-seal flex items-center justify-center border-2 border-gold/50 cursor-pointer shadow-lg group focus-visible:outline-2 focus-visible:outline-gold"
                title="Buka Segel Undangan"
                aria-label="Buka Segel Undangan"
              >
                <div className="w-13 h-13 rounded-full border border-forest-dark/30 flex items-center justify-center">
                  <span className="font-serif text-sm font-semibold italic text-forest-dark tracking-wider select-none">
                    K &amp; O
                  </span>
                </div>
                {/* Ribbon tails below seal */}
                <div className="absolute -bottom-2 left-3 w-3 h-4 bg-gold/80 -rotate-12 rounded-b-xs shadow-xs pointer-events-none" />
                <div className="absolute -bottom-2 right-3 w-3 h-4 bg-gold/80 rotate-12 rounded-b-xs shadow-xs pointer-events-none" />
              </motion.button>

              <p className="text-xs uppercase tracking-[0.3em] text-gold font-medium mb-1.5">
                UNDANGAN PERNIKAHAN
              </p>

              <h1 className="editorial-title text-4xl sm:text-5xl font-normal text-ivory tracking-tight mb-2">
                {weddingConfig.couple.title}
              </h1>

              <div className="inline-block px-4 py-1 rounded-full border border-gold/30 bg-forest-dark/70 text-xs text-gold-muted tracking-widest uppercase mb-6">
                {formattedDate}
              </div>

              {/* Arched Portrait Window */}
              <div className="relative mx-auto w-36 h-48 arch-frame-sm overflow-hidden border-2 border-gold/40 mb-6 shadow-2xl">
                <Image
                  src={weddingConfig.hero.src}
                  alt={weddingConfig.hero.alt}
                  width={144}
                  height={192}
                  className="w-full h-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-dark/40 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Personalized Recipient Parchment Card */}
              <div className="relative bg-forest-dark/80 border border-gold/30 rounded-2xl p-4 mb-6 shadow-inner">
                <p className="text-xs text-gold-muted uppercase tracking-wider mb-1 font-medium">
                  Kepada Yth.
                </p>

                {isLoading ? (
                  <div className="flex items-center justify-center gap-2 py-2 text-sm text-ivory/80">
                    <RefreshCw className="w-4 h-4 animate-spin text-gold" />
                    <span>Memuat nama undangan...</span>
                  </div>
                ) : invitation ? (
                  <div>
                    <p className="text-xl sm:text-2xl font-serif text-ivory font-medium">
                      {invitation.name}
                    </p>
                    {invitation.maxGuests > 1 && (
                      <p className="text-xs text-gold-muted mt-1">
                        (Undangan berlaku untuk {invitation.maxGuests} tamu)
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-xl sm:text-2xl font-serif text-ivory font-medium">
                      {weddingConfig.invitation.defaultGreeting}
                    </p>
                    {error && token && (
                      <div className="mt-2 text-xs text-amber-300">
                        <p>Tautan tidak dapat diverifikasi secara otomatis.</p>
                        <button
                          type="button"
                          onClick={retryResolve}
                          className="mt-2 inline-flex items-center gap-1.5 underline hover:text-gold text-xs min-h-[44px] px-2 py-1 cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" /> Coba verifikasi ulang
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <p className="text-[11px] text-ivory/60 mt-2 italic">
                  Mohon maaf apabila ada kesalahan penulisan nama atau gelar
                </p>
              </div>

              {/* Buka Undangan Action Button (min 48px tap target) */}
              <motion.button
                ref={buttonRef}
                type="button"
                onClick={handleOpen}
                animate={{
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    "0 12px 30px -4px rgba(197, 160, 89, 0.4)",
                    "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                  ],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 min-h-[48px] rounded-xl bg-gradient-to-r from-gold via-gold-muted to-gold text-forest font-semibold text-base tracking-wide shadow-lg hover:shadow-gold/20 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
              >
                <MailOpen className="w-5 h-5 animate-pulse" aria-hidden="true" />
                <span>Buka Undangan</span>
              </motion.button>

              <p className="text-[11px] text-ivory/50 mt-3">
                Tekan tombol di atas atau tombol Escape pada keyboard untuk membuka
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
