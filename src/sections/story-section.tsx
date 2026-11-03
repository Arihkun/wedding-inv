import Image from "next/image";
import { weddingConfig } from "@/config/wedding.config";

export function StorySection() {
  const stories = weddingConfig.story;

  return (
    <section
      id="story"
      aria-label="Kisah Cinta"
      className="py-20 px-6 bg-ivory text-forest border-t border-border-subtle"
    >
      <div className="max-w-2xl mx-auto text-center space-y-4 mb-14">
        <p className="text-xs uppercase tracking-[0.25em] text-secondary font-medium">
          PERJALANAN KAMI
        </p>
        <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal">
          Untaian Kisah Bersama
        </h2>
        <p className="text-base text-secondary max-w-md mx-auto leading-relaxed">
          Setiap langkah dan babak perjalanan yang membawa kami pada titik indah ini.
        </p>
      </div>

      <div className="relative max-w-xl mx-auto">
        {/* Vertical timeline line */}
        <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 w-px bg-border-strong -translate-x-1/2 hidden sm:block" />

        <div className="space-y-10 sm:space-y-12">
          {stories.map((item, index) => {
            const isEven = index % 2 === 0;

            return (
              <div
                key={item.id}
                className={`relative flex flex-col sm:flex-row items-start ${
                  isEven ? "sm:flex-row-reverse" : ""
                } gap-6 sm:gap-10`}
              >
                {/* Center marker dot */}
                <div className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-2 w-3.5 h-3.5 rounded-full border-2 border-forest bg-gold z-10" />

                {/* Content card */}
                <div
                  className={`w-full sm:w-[calc(50%-1.5rem)] p-6 rounded-2xl bg-surface border border-border-strong shadow-xs text-left ${
                    isEven ? "sm:text-left" : "sm:text-right"
                  }`}
                >
                  {item.date && (
                    <span className="inline-block text-xs font-semibold tracking-wider text-forest uppercase mb-1">
                      {item.date}
                    </span>
                  )}

                  <h3 className="editorial-title text-2xl font-normal text-forest mb-2">
                    {item.title}
                  </h3>

                  {item.description ? (
                    <p className="text-sm text-secondary leading-relaxed">
                      {item.description}
                    </p>
                  ) : (
                    <p className="text-sm text-secondary italic leading-relaxed">
                      Cerita pada bagian ini akan ditambahkan oleh Kinar dan Oki.
                    </p>
                  )}

                  {item.photo && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-border-strong">
                      <Image
                        src={item.photo.src}
                        alt={item.photo.alt}
                        width={item.photo.width}
                        height={item.photo.height}
                        loading="lazy"
                        className="w-full h-auto object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
