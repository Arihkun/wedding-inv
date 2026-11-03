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
    setSelectedPhotoIndex(null);
  };

  // Curated editorial layout classes for varied visual rhythm
  const getLayoutClasses = (index: number) => {
    switch (index) {
      case 0:
        return "col-span-1 sm:col-span-2 row-span-2 aspect-[4/5] sm:aspect-[3/4]";
      case 1:
        return "col-span-1 row-span-1 aspect-[3/4] sm:aspect-square";
      case 2:
        return "col-span-1 row-span-1 aspect-[3/4] sm:aspect-square";
      case 3:
        return "col-span-1 sm:col-span-2 row-span-1 aspect-[16/10] sm:aspect-[16/9]";
      default:
        return "col-span-1 aspect-[3/4]";
    }
  };

  const getOriginatingElement = () =>
    selectedPhotoIndex !== null ? triggerRefs.current[selectedPhotoIndex] ?? null : null;

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
        <p className="text-base text-secondary max-w-md mx-auto leading-relaxed">
          Potret kebahagiaan dan kehangatan kebersamaan kami dalam menyambut hari bahagia pernikahan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto auto-rows-auto">
        {photos.map((photo, index) => (
          <button
            key={index}
            ref={(el) => {
              triggerRefs.current[index] = el;
            }}
            type="button"
            onClick={() => handleOpenPhoto(index)}
            className={`group relative w-full rounded-2xl overflow-hidden border border-border-strong bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest transition-transform hover:-translate-y-1 shadow-xs ${getLayoutClasses(
              index
            )}`}
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
              <div className="p-3 rounded-full bg-forest-dark/80 border border-gold/40 text-gold shadow-md">
                <ZoomIn className="w-5 h-5" aria-hidden="true" />
              </div>
            </div>
            {photo.placeholder && (
              <span className="absolute bottom-2 left-2 right-2 bg-surface/90 text-secondary text-[11px] py-1 px-2 rounded-md text-center truncate font-medium">
                Botanical Placeholder
              </span>
            )}
          </button>
        ))}
      </div>

      <LightboxDialog
        photos={photos}
        currentIndex={selectedPhotoIndex}
        getOriginatingElement={getOriginatingElement}
        onClose={handleClose}
        onSelectIndex={(index) => setSelectedPhotoIndex(index)}
      />
    </section>
  );
}
