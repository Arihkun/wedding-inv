"use client";

import { useCountdown } from "@/hooks/use-countdown";
import { weddingConfig } from "@/config/wedding.config";
import { Clock } from "lucide-react";
import { motion } from "motion/react";
import { Reveal } from "@/components/reveal";
import { BotanicalDivider } from "@/components/botanical-ornaments";

export function CountdownSection() {
  const countdown = useCountdown(weddingConfig.weddingDate);

  return (
    <section
      id="countdown"
      aria-label="Hitung Mundur Acara"
      className="py-16 px-6 bg-surface text-forest border-y border-border-subtle relative overflow-hidden"
    >
      <div className="max-w-xl mx-auto text-center space-y-6">
        <Reveal y={16}>
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-secondary font-medium">
            <Clock className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
            <span>MENGHITUNG HARI</span>
          </div>

          <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal mt-3">
            Menuju Hari Bahagia
          </h2>

          <BotanicalDivider className="my-4" />
        </Reveal>

        <Reveal delay={0.15} y={20}>
          {!countdown ? (
            <div className="p-8 rounded-3xl bg-ivory border-2 border-gold/30 text-forest text-base leading-relaxed shadow-md">
              <p className="font-serif text-lg font-medium text-forest">Tanggal dan waktu pernikahan akan diumumkan segera.</p>
              <p className="text-sm text-secondary mt-1.5">
                Nantikan pembaruan jadwal prosesi pernikahan kami.
              </p>
            </div>
          ) : countdown.arrived ? (
            <div className="p-8 rounded-3xl bg-forest text-ivory border-2 border-gold/40 shadow-xl">
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
              {[
                { val: countdown.days, label: "Hari" },
                { val: countdown.hours, label: "Jam" },
                { val: countdown.minutes, label: "Menit" },
                { val: countdown.seconds, label: "Detik" },
              ].map((unit, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3, scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                  className="flex flex-col items-center justify-center p-3.5 sm:p-5 rounded-2xl bg-ivory border-2 border-gold/30 shadow-md hover:border-gold hover:shadow-lg transition-all"
                >
                  <span className={`editorial-title text-2xl sm:text-4xl font-normal ${unit.label === "Detik" ? "text-gold font-medium" : "text-forest"}`}>
                    {String(unit.val).padStart(2, "0")}
                  </span>
                  <span className="text-[10px] sm:text-xs uppercase tracking-wider text-secondary mt-1 font-medium">
                    {unit.label}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
