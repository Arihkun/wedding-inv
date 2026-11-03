"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MailOpen, RefreshCw, Sparkles } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";
import { useInvitation } from "@/components/invitation-provider";
import { formatEventDate } from "@/lib/wedding";

interface OpeningGateProps {
  onOpen: () => void;
}

export function OpeningGate({ onOpen }: OpeningGateProps) {
  const { token, invitation, isLoading, error, isGateOpen, openGate, retryResolve } =
    useInvitation();
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Focus CTA button on mount for keyboard accessibility
    if (!isGateOpen && buttonRef.current) {
      buttonRef.current.focus();
    }
  }, [isGateOpen]);

  if (isGateOpen) {
    return null;
  }

  const handleOpen = () => {
    openGate();
    onOpen();
    // Move focus to main content container
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
    }
  };

  const formattedDate = formatEventDate(
    weddingConfig.weddingDate,
    weddingConfig.timezone,
    weddingConfig.locale
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Pintu Pembuka Undangan Pernikahan"
      className="fixed inset-0 z-50 flex items-center justify-center bg-forest text-ivory overflow-y-auto px-4 py-8"
    >
      {/* Background botanical decorative motifs */}
      <div className="absolute inset-0 opacity-10 pointer-events-none botanical-pattern" />

      {/* Decorative inner frame */}
      <div className="relative max-w-md w-full my-auto mx-auto bg-forest-dark/70 border border-gold/30 rounded-2xl p-6 sm:p-10 text-center shadow-2xl backdrop-blur-sm">
        {/* Top botanical leaf emblem */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-forest/50">
            <Sparkles className="w-5 h-5" aria-hidden="true" />
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-3">
          WALIMATUL &apos;URS
        </p>

        <h1 className="editorial-title text-4xl sm:text-5xl font-normal text-ivory tracking-tight mb-2">
          {weddingConfig.couple.title}
        </h1>

        <p className="text-xs text-secondary-light text-ivory/70 tracking-widest uppercase mb-8">
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
        <div className="bg-forest/80 border border-gold/20 rounded-xl p-4 mb-8">
          <p className="text-xs text-ivory/60 mb-1">Kepada Yth.</p>

          {isLoading ? (
            <div className="flex items-center justify-center gap-2 py-2 text-sm text-ivory/80">
              <RefreshCw className="w-4 h-4 animate-spin text-gold" />
              <span>Memuat nama undangan...</span>
            </div>
          ) : invitation ? (
            <div>
              <p className="text-lg sm:text-xl font-serif text-ivory font-medium">
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
              <p className="text-lg sm:text-xl font-serif text-ivory font-medium">
                {weddingConfig.invitation.defaultGreeting}
              </p>
              {error && token && (
                <div className="mt-2 text-xs text-amber-300">
                  <p>Tautan tidak dapat diverifikasi secara otomatis.</p>
                  <button
                    type="button"
                    onClick={retryResolve}
                    className="mt-1 inline-flex items-center gap-1 underline hover:text-gold text-[11px]"
                  >
                    <RefreshCw className="w-3 h-3" /> Coba verifikasi ulang
                  </button>
                </div>
              )}
            </div>
          )}

          <p className="text-[11px] text-ivory/50 mt-2 italic">
            Mohon maaf apabila ada kesalahan penulisan nama atau gelar
          </p>
        </div>

        {/* Buka Undangan Action */}
        <button
          ref={buttonRef}
          type="button"
          onClick={handleOpen}
          className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gold text-forest font-semibold text-sm tracking-wide shadow-md hover:bg-gold-muted active:scale-[0.98] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
        >
          <MailOpen className="w-4 h-4" aria-hidden="true" />
          <span>Buka Undangan</span>
        </button>
      </div>
    </div>
  );
}
