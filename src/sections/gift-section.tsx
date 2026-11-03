"use client";

import { useState } from "react";
import { Gift, Copy, Check, AlertCircle, CreditCard, PackageCheck, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { weddingConfig } from "@/config/wedding.config";
import { Reveal } from "@/components/reveal";
import { BotanicalDivider } from "@/components/botanical-ornaments";
import { BorderBeam } from "@/components/border-beam";

export function GiftSection() {
  const gifts = weddingConfig.gifts;
  const [activeTab, setActiveTab] = useState<"bank" | "gift">("bank");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copyErrorIndex, setCopyErrorIndex] = useState<number | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  const physicalAddress = "Jl. Botanical Garden No. 12, Kebayoran Baru, Jakarta Selatan, DKI Jakarta 12180 (Penerima: Kinar / Oki)";

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

  const handleCopyAddress = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(physicalAddress);
        setCopiedAddress(true);
        setTimeout(() => setCopiedAddress(false), 3000);
      }
    } catch {
      // ignore
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

        {/* Tab Switcher (shadcn / interactive style) */}
        <Reveal delay={0.1} y={12} className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-full bg-ivory border border-gold/30 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("bank")}
              className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "bank"
                  ? "bg-forest text-gold shadow-sm"
                  : "text-secondary hover:text-forest"
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Transfer Bank</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("gift")}
              className={`min-h-[40px] px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === "gift"
                  ? "bg-forest text-gold shadow-sm"
                  : "text-secondary hover:text-forest"
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              <span>Kirim Kado Fisik</span>
            </button>
          </div>
        </Reveal>

        <AnimatePresence mode="wait">
          {activeTab === "bank" ? (
            <motion.div
              key="tab-bank"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {gifts.length === 0 ? (
                <div className="p-8 rounded-3xl bg-ivory border-2 border-gold/30 text-center space-y-3 shadow-md">
                  <p className="text-base font-serif font-medium text-forest">
                    Informasi Rekening Belum Tersedia
                  </p>
                  <p className="text-sm text-secondary leading-relaxed max-w-md mx-auto">
                    Informasi detail mengenai tanda kasih atau nomor rekening akan diumumkan kemudian. Doa restu Anda merupakan kehormatan terbesar bagi kami.
                  </p>
                </div>
              ) : (
                gifts.map((item, index) => (
                  <div
                    key={index}
                    className="relative rounded-3xl bg-gradient-to-br from-forest via-forest-dark to-[#0F1B14] p-6 sm:p-8 text-ivory border-2 border-gold/40 shadow-xl overflow-hidden text-left"
                  >
                    {/* Animated Gold Perimeter Beam */}
                    <BorderBeam size={220} duration={12} colorFrom="#D8BD82" colorTo="#C5A059" />

                    {/* Background Card Shine */}
                    <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-gold/10 blur-2xl pointer-events-none" />

                    {/* Card Top: Bank & Chip */}
                    <div className="flex justify-between items-start mb-6 relative z-10">
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
                    <div className="my-4 relative z-10">
                      <p className="text-[10px] uppercase tracking-widest text-ivory/60 mb-1">
                        Nomor Rekening
                      </p>
                      <p className="font-mono text-xl sm:text-2xl font-bold tracking-widest text-gold-muted">
                        {item.accountNumber}
                      </p>
                    </div>

                    {/* Card Holder & Copy Action */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-gold/20 relative z-10">
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
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="tab-gift"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="p-6 sm:p-8 rounded-3xl bg-ivory border-2 border-gold/30 text-left space-y-4 shadow-md relative overflow-hidden"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-forest text-gold flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="editorial-title text-xl font-normal text-forest">
                    Alamat Pengiriman Kado
                  </h3>
                  <p className="text-xs text-secondary mt-1">
                    Bagi yang ingin mengirimkan tanda kasih berupa kado fisik:
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-surface border border-gold/20 text-xs sm:text-sm text-forest/90 leading-relaxed font-sans">
                {physicalAddress}
              </div>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="min-h-[44px] w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-forest text-gold text-xs font-semibold hover:bg-forest-light transition-all cursor-pointer shadow-sm"
              >
                {copiedAddress ? (
                  <>
                    <Check className="w-4 h-4 text-gold" />
                    <span>Alamat Berhasil Disalin</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-gold" />
                    <span>Salin Alamat Lengkap</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}