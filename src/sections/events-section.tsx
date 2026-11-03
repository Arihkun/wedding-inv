import { Calendar, Clock, MapPin, Navigation } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";
import { formatEventDate, formatEventTime, getMapLinks } from "@/lib/wedding";
import type { WeddingEvent } from "@/types/wedding";

function EventCard({ event }: { event: WeddingEvent }) {
  const formattedDate = formatEventDate(
    event.startsAt,
    weddingConfig.timezone,
    weddingConfig.locale
  );
  const formattedTime = formatEventTime(
    event.startsAt,
    weddingConfig.timezone,
    weddingConfig.locale
  );
  const mapLinks = getMapLinks(event);

  return (
    <div className="flex flex-col justify-between p-6 sm:p-8 rounded-2xl bg-ivory border border-border-strong shadow-sm max-w-md w-full text-left">
      <div className="space-y-4">
        <div className="inline-block px-3 py-1 rounded-full bg-surface border border-border-strong text-xs font-semibold uppercase tracking-wider text-secondary">
          {event.title}
        </div>

        <h3 className="editorial-title text-3xl font-medium text-forest">
          {event.title}
        </h3>

        {/* Date & Time */}
        <div className="space-y-2 pt-3 border-t border-border-subtle text-base">
          <div className="flex items-center gap-3 text-forest">
            <Calendar className="w-5 h-5 text-forest shrink-0" aria-hidden="true" />
            <span>{formattedDate}</span>
          </div>

          <div className="flex items-center gap-3 text-forest">
            <Clock className="w-5 h-5 text-forest shrink-0" aria-hidden="true" />
            <span>{formattedTime}</span>
          </div>
        </div>

        {/* Venue & Address */}
        <div className="pt-3 border-t border-border-subtle space-y-1">
          <div className="flex items-start gap-3 text-base">
            <MapPin className="w-5 h-5 text-forest shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <p className="font-semibold text-forest">
                {event.venue ?? "Lokasi akan diumumkan"}
              </p>
              <p className="text-sm text-secondary mt-1 leading-relaxed">
                {event.address ?? "Alamat lengkap prosesi akan diinformasikan kemudian."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Action Button (min-h-[44px]) */}
      <div className="mt-8 pt-4 border-t border-border-subtle">
        {mapLinks ? (
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href={mapLinks.location}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-forest text-ivory text-sm font-medium hover:bg-forest-light transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
            >
              <MapPin className="w-4 h-4 text-gold" aria-hidden="true" />
              <span>Buka Google Maps</span>
            </a>
            <a
              href={mapLinks.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-border-strong text-forest text-sm font-medium hover:bg-surface transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
            >
              <Navigation className="w-4 h-4 text-secondary" aria-hidden="true" />
              <span>Petunjuk Arah</span>
            </a>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-surface border border-border-strong text-xs text-secondary leading-relaxed">
            Peta penunjuk lokasi Google Maps akan tersedia setelah koordinat resmi terverifikasi.
          </div>
        )}
      </div>
    </div>
  );
}

export function EventsSection() {
  const events = weddingConfig.events;

  return (
    <section
      id="events"
      aria-label="Waktu dan Lokasi Acara"
      className="py-20 px-6 bg-surface text-forest border-t border-border-subtle"
    >
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary font-medium">
            AGENDA PERAYAAN
          </p>
          <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal">
            Waktu &amp; Tempat
          </h2>
          <p className="text-base text-secondary max-w-md mx-auto leading-relaxed">
            Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Anda berkenan hadir dan memberikan doa restu.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-stretch justify-center gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </div>
    </section>
  );
}
