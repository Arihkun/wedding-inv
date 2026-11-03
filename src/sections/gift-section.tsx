"use client";

import { useState } from "react";
import { Gift, Copy, Check, AlertCircle } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";
import { Reveal } from "@/components/reveal";
import { BotanicalDivider } from "@/components/botanical-ornaments";

export function GiftSection() {
  const gifts = weddingConfig.gifts;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyErrorIndex, setCopyErrorIndex] = useState<number | null>(null);

  const handleCopy = async (accountNumber: string, index: number) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(accountNumber);
        setCopiedIndex(index);
        setCopyErrorIndex(null);
        setTimeout(() => setCopiedIndex(null), 3000);
      } else {
        throw new Error("Clipboard API not supported");
      }
    } catch {
      setCopyErrorIndex(index);
      setCopiedIndex(null);
      setTimeout(() => setCopyErrorIndex(null), 3000);
    }
  };

  return (
    <section
      id="gift"
      aria-label="Tanda Kasih / Hadiah Pernikahan"
      className="py-20 px-6 bg-surface text-forest border-t border-border-subtle relative overflow-hidden"
    >
      <div className="max-w-xl mx-auto text-center space-y-8">
        <Reveal y={16} className="space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-forest text-gold mb-2 shadow-md">
            <Gift className="w-5 h-5" aria-hidden="true" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-secondary font-medium">
            TANDA KASIH
          </p>
          <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal">
            Amplop Digital &amp; Hadiah
          </h2>
          <p className="text-sm text-secondary leading-relaxed">
            Kehadiran serta doa restu Bapak/Ibu/Saudara/i sekalian merupakan anugerah dan kado terindah bagi kami.
          </p>
          <BotanicalDivider className="my-4" />
        </Reveal>

        {gifts.length === 0 ? (
          <Reveal delay={0.15} y={20} className="p-8 rounded-3xl bg-ivory border-2 border-gold/30 text-center space-y-3 shadow-md">
            <p className="text-base font-serif font-medium text-forest">
              Informasi Rekening Belum Tersedia
            </p>
            <p className="text-sm text-secondary leading-relaxed max-w-md mx-auto">
              Informasi detail mengenai tanda kasih atau nomor rekening akan diumumkan kemudian. Doa restu Anda merupakan kehormatan terbesar bagi kami.
            </p>
          </Reveal>
        ) : (
          <div className="space-y-6">
            {gifts.map((item, index) => (
              <Reveal
                key={index}
                delay={index * 0.12}
                y={20}
                className="relative rounded-3xl bg-gradient-to-br from-forest via-forest-dark to-[#0F1B14] p-6 sm:p-8 text-ivory border-2 border-gold/40 shadow-xl overflow-hidden text-left"
              >
                {/* Background Card Shine */}
                <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

                {/* Card Top: Bank & Chip */}
                <div className="flex justify-between items-start mb-6">
                  {/* Metallic Chip SVG */}
                  <div className="w-11 h-8 rounded-md bg-gradient-to-br from-gold-muted via-gold to-amber-600 border border-gold/60 p-1 flex items-center justify-center shadow-inner">
                    <div className="w-full h-full border border-forest-dark/40 rounded-xs flex flex-col justify-around py-0.5">
                      <div className="h-px bg-forest-dark/40 w-full" />
                      <div className="h-px bg-forest-dark/40 w-full" />
                    </div>
                  </div>

                  <span className="font-serif text-lg font-semibold tracking-widest text-gold">
                    {item.bank}
                  </span>
                </div>

                {/* Card Number */}
                <div className="my-4">
                  <p className="text-[10px] uppercase tracking-widest text-ivory/60 mb-1">
                    Nomor Rekening
                  </p>
                  <p className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-gold-muted">
                    {item.accountNumber}
                  </p>
                </div>

                {/* Card Holder & Copy Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gold/20">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-ivory/60">
                      Atas Nama
                    </p>
                    <p className="text-sm font-serif font-medium text-ivory">
                      {item.holder}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.accountNumber, index)}
                    className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-gold via-gold-muted to-gold text-forest text-xs font-semibold hover:shadow-gold/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    aria-label={`Salin nomor rekening ${item.bank}`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-4 h-4 text-forest" aria-hidden="true" />
                        <span>Tersalin ke Papan Klip</span>
                      </>
                    ) : copyErrorIndex === index ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-700" aria-hidden="true" />
                        <span>Gagal Salin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 text-forest" aria-hidden="true" />
                        <span>Salin No. Rekening</span>
                      </>
                    )}
                  </button>
                </div>

                {copiedIndex === index && (
                  <p className="text-xs text-gold-muted font-medium mt-3" role="status">
                    Nomor rekening berhasil disalin!
                  </p>
                )}
                {copyErrorIndex === index && (
                  <p className="text-xs text-rose-300 font-medium mt-3" role="alert">
                    Gagal menyalin secara otomatis. Silakan salin nomor secara manual.
                  </p>
                )}
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
