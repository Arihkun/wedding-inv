"use client";

import { useEffect, useCallback, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Photo } from "@/types/wedding";
import { acquireScrollLock, releaseScrollLock } from "@/components/smooth-scroll";

interface LightboxDialogProps {
  photos: Photo[];
  currentIndex: number | null;
  onClose: () => void;
  onSelectIndex: (index: number) => void;
}

export function LightboxDialog({
  photos,
  currentIndex,
  onClose,
  onSelectIndex,
}: LightboxDialogProps) {
  const isOpen = currentIndex !== null;
  const currentPhoto = currentIndex !== null ? photos[currentIndex] : null;
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const handlePrev = useCallback(() => {
    if (currentIndex === null) return;
    const prev = (currentIndex - 1 + photos.length) % photos.length;
    onSelectIndex(prev);
  }, [currentIndex, photos.length, onSelectIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex === null) return;
    const next = (currentIndex + 1) % photos.length;
    onSelectIndex(next);
  }, [currentIndex, photos.length, onSelectIndex]);

  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      acquireScrollLock("lightbox");
    } else {
      releaseScrollLock("lightbox");
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }

    return () => {
      releaseScrollLock("lightbox");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handlePrev, handleNext]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-forest/90 backdrop-blur-md transition-opacity animate-in fade-in duration-200" />
        <Dialog.Content
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 focus:outline-none"
          aria-describedby="lightbox-description"
        >
          <Dialog.Title className="sr-only">Pratinjau Foto Galeri</Dialog.Title>
          <Dialog.Description id="lightbox-description" className="sr-only">
            Gunakan tombol panah kiri atau kanan pada keyboard untuk melihat foto sebelum atau selanjutnya, dan tombol Escape untuk menutup.
          </Dialog.Description>

          {/* Close button */}
          <Dialog.Close asChild>
            <button
              type="button"
              className="absolute top-4 right-4 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 hover:border-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              aria-label="Tutup pratinjau foto"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </Dialog.Close>

          {/* Prev button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 hover:border-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              aria-label="Foto sebelumnya"
            >
              <ChevronLeft className="w-6 h-6" aria-hidden="true" />
            </button>
          )}

          {/* Next button */}
          {photos.length > 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-12 h-12 flex items-center justify-center rounded-full bg-forest-dark/90 text-ivory hover:text-gold border border-gold/40 hover:border-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
              aria-label="Foto selanjutnya"
            >
              <ChevronRight className="w-6 h-6" aria-hidden="true" />
            </button>
          )}

          {/* Image display */}
          {currentPhoto && (
            <div className="relative max-w-4xl max-h-[85vh] w-full flex flex-col items-center justify-center">
              <div className="relative w-full max-h-[75vh] flex items-center justify-center overflow-hidden rounded-lg border border-gold/20 shadow-2xl">
                <Image
                  src={currentPhoto.src}
                  alt={currentPhoto.alt}
                  width={currentPhoto.width || 1200}
                  height={currentPhoto.height || 1600}
                  className="max-h-[75vh] w-auto object-contain rounded-lg"
                  priority
                />
              </div>

              <div className="mt-3 text-center text-ivory/90 text-sm">
                <p className="font-serif italic">{currentPhoto.alt}</p>
                <p className="text-xs text-ivory/60 mt-1">
                  {currentIndex !== null ? currentIndex + 1 : 1} dari {photos.length}
                </p>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
