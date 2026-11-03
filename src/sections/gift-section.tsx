"use client";

import { useState } from "react";
import { Gift, Copy, Check, AlertCircle } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";

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
      className="py-20 px-6 bg-surface text-forest border-t border-border-subtle"
    >
      <div className="max-w-xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-forest text-gold mb-2">
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
        </div>

        {gifts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-ivory border border-border-strong text-center space-y-3 shadow-xs">
            <p className="text-base font-serif font-medium text-forest">
              Amplop Digital Sedang Tidak Tersedia
            </p>
            <p className="text-xs text-secondary leading-relaxed max-w-md mx-auto">
              Bagi keluarga dan sahabat yang ingin memberikan tanda kasih secara langsung, dapat menyampaikannya pada kotak amplop di lokasi acara perayaan.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {gifts.map((item, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-ivory border border-border-strong text-left space-y-3 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-forest">
                    {item.bank}
                  </span>
                  <span className="text-xs text-secondary">Atas Nama: {item.holder}</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-surface border border-border-strong">
                  <span className="font-mono text-base font-semibold text-forest tracking-wider">
                    {item.accountNumber}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleCopy(item.accountNumber, index)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-forest text-ivory text-xs font-medium hover:bg-forest-light transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
                    aria-label={`Salin nomor rekening ${item.bank}`}
                  >
                    {copiedIndex === index ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-gold" aria-hidden="true" />
                        <span>Tersalin</span>
                      </>
                    ) : copyErrorIndex === index ? (
                      <>
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400" aria-hidden="true" />
                        <span>Gagal Salin</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>Salin Rekening</span>
                      </>
                    )}
                  </button>
                </div>

                {copiedIndex === index && (
                  <p className="text-xs text-emerald-800 font-medium" role="status">
                    Nomor rekening berhasil disalin ke papan klip.
                  </p>
                )}
                {copyErrorIndex === index && (
                  <p className="text-xs text-rose-700 font-medium" role="alert">
                    Gagal menyalin secara otomatis. Silakan salin nomor secara manual.
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
