"use client";

import { useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { MailOpen, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { weddingConfig } from "@/config/wedding.config";
import { useInvitation } from "@/components/invitation-provider";
import { formatEventDate } from "@/lib/wedding";
import { acquireScrollLock, releaseScrollLock } from "@/components/smooth-scroll";

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
              y: -40,
              transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-forest text-ivory overflow-y-auto px-4 py-8"
          >
            {/* Decorative inner frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -24 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-md w-full my-auto mx-auto bg-forest-dark border border-gold/30 rounded-2xl p-6 sm:p-10 text-center shadow-2xl"
            >
          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
            UNDANGAN PERNIKAHAN
          </p>

          <h1 className="editorial-title text-4xl sm:text-5xl font-normal text-ivory tracking-tight mb-2">
            {weddingConfig.couple.title}
          </h1>

          <p className="text-xs text-ivory/80 tracking-widest uppercase mb-8">
            {formattedDate}
          </p>

          {/* Botanical portrait placeholder */}
          <div className="relative mx-auto w-36 h-48 rounded-xl overflow-hidden border border-gold/30 mb-8 shadow-inner">
            <Image
              src={weddingConfig.hero.src}
              alt={weddingConfig.hero.alt}
              width={144}
              height={192}
              className="w-full h-full object-cover"
              priority
            />
          </div>

          {/* Personalized Recipient Card */}
          <div className="bg-forest border border-gold/20 rounded-xl p-4 mb-8">
            <p className="text-xs text-ivory/70 mb-1">Kepada Yth.</p>

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
                      className="mt-2 inline-flex items-center gap-1.5 underline hover:text-gold text-xs min-h-[44px] px-2 py-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Coba verifikasi ulang
                    </button>
                  </div>
                )}
              </div>
            )}

            <p className="text-xs text-ivory/60 mt-3 italic">
              Mohon maaf apabila ada kesalahan penulisan nama atau gelar
            </p>
          </div>

          {/* Buka Undangan Action Button (min 44px tap target) */}
          <motion.button
            ref={buttonRef}
            type="button"
            onClick={handleOpen}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 min-h-[48px] rounded-xl bg-gold text-forest font-semibold text-base tracking-wide shadow-md hover:bg-gold-muted transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white cursor-pointer"
          >
            <MailOpen className="w-5 h-5" aria-hidden="true" />
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
