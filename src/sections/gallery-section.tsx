"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";
import { LightboxDialog } from "@/components/lightbox-dialog";

export function GallerySection() {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const photos = weddingConfig.gallery;

  const handleOpenPhoto = (index: number) => {
    setSelectedPhotoIndex(index);
  };

  const handleClose = () => {
    const lastIndex = selectedPhotoIndex;
    setSelectedPhotoIndex(null);
    if (lastIndex !== null && triggerRefs.current[lastIndex]) {
      triggerRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <section
      id="gallery"
      aria-label="Galeri Foto"
      className="py-20 px-6 bg-ivory text-forest border-t border-border-subtle"
    >
      <div className="max-w-4xl mx-auto text-center space-y-4 mb-12">
        <p className="text-xs uppercase tracking-[0.25em] text-secondary font-medium">
          MOMEN INDAH
        </p>
        <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal">
          Galeri Potret
        </h2>
        <p className="text-sm text-secondary max-w-md mx-auto">
          Potret kebahagiaan dan kehangatan kebersamaan kami dalam menyambut hari suci.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        {photos.map((photo, index) => (
          <button
            key={index}
            ref={(el) => {
              triggerRefs.current[index] = el;
            }}
            type="button"
            onClick={() => handleOpenPhoto(index)}
            className="group relative aspect-[3/4] w-full rounded-xl overflow-hidden border border-border-strong bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold transition-transform hover:-translate-y-1 shadow-xs"
            aria-label={`Buka pratinjau: ${photo.alt}`}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Hover icon indicator */}
            <div className="absolute inset-0 bg-forest-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-ivory">
              <div className="p-2 rounded-full bg-forest/80 border border-gold/40 text-gold">
                <ZoomIn className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            {photo.placeholder && (
              <span className="absolute bottom-2 left-2 right-2 bg-surface/90 text-secondary text-[10px] py-0.5 px-1.5 rounded text-center truncate">
                Botanical Placeholder
              </span>
            )}
          </button>
        ))}
      </div>

      <LightboxDialog
        photos={photos}
        currentIndex={selectedPhotoIndex}
        onClose={handleClose}
        onSelectIndex={(index) => setSelectedPhotoIndex(index)}
      />
    </section>
  );
}
