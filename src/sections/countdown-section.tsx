"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { weddingConfig } from "@/config/wedding.config";
import { Clock } from "lucide-react";

export function CountdownSection() {
  const countdown = useCountdown(weddingConfig.weddingDate);

  return (
    <section
      id="countdown"
      aria-label="Hitung Mundur Acara"
      className="py-16 px-6 bg-surface text-forest border-y border-border-subtle"
    >
      <div className="max-w-xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-secondary font-medium">
          <Clock className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
          <span>MENGHITUNG HARI</span>
        </div>

        <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal">
          Menuju Hari Bahagia
        </h2>

        {!countdown ? (
          <div className="p-6 rounded-2xl bg-ivory border border-border-strong text-secondary text-sm">
            <p>Tanggal dan waktu pernikahan akan diumumkan segera.</p>
            <p className="text-xs text-secondary/80 mt-1">
              Nantikan pembaruan jadwal prosesi pernikahan kami.
            </p>
          </div>
        ) : countdown.arrived ? (
          <div className="p-6 rounded-2xl bg-forest text-ivory border border-gold/30">
            <p className="editorial-title text-2xl sm:text-3xl font-medium text-gold">
              Hari Bahagia Telah Tiba
            </p>
            <p className="text-sm text-ivory/80 mt-2">
              Terima kasih atas segala doa dan kehadiran para tamu undangan terkasih.
            </p>
          </div>
        ) : (
          <div
            className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto"
            role="timer"
            aria-live="off"
          >
            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-ivory border border-border-strong shadow-sm">
              <span className="editorial-title text-2xl sm:text-4xl font-normal text-forest">
                {String(countdown.days).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-secondary mt-1 font-medium">
                Hari
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-ivory border border-border-strong shadow-sm">
              <span className="editorial-title text-2xl sm:text-4xl font-normal text-forest">
                {String(countdown.hours).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-secondary mt-1 font-medium">
                Jam
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-ivory border border-border-strong shadow-sm">
              <span className="editorial-title text-2xl sm:text-4xl font-normal text-forest">
                {String(countdown.minutes).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-secondary mt-1 font-medium">
                Menit
              </span>
            </div>

            <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl bg-ivory border border-border-strong shadow-sm">
              <span className="editorial-title text-2xl sm:text-4xl font-normal text-forest">
                {String(countdown.seconds).padStart(2, "0")}
              </span>
              <span className="text-[11px] sm:text-xs uppercase tracking-wider text-secondary mt-1 font-medium">
                Detik
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
