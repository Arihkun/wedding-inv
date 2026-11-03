import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";

export function ClosingSection() {
  return (
    <footer
      id="closing"
      aria-label="Penutup Undangan"
      className="relative py-24 px-6 bg-forest text-ivory text-center overflow-hidden border-t border-gold/30"
    >
      {/* Background botanical pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none botanical-pattern" />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        <div className="flex justify-center">
          <div className="w-10 h-10 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-forest-dark/50">
            <Heart className="w-4 h-4 fill-gold text-gold" aria-hidden="true" />
          </div>
        </div>

        <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
          UNGKAPAN TERIMA KASIH
        </p>

        <h2 className="editorial-title text-4xl sm:text-5xl font-normal text-ivory tracking-tight">
          Sampai Jumpa di Hari Bahagia
        </h2>

        <p className="text-sm text-ivory/80 leading-relaxed font-sans max-w-md mx-auto">
          Kehadiran, doa restu, serta kehangatan kasih dari Bapak/Ibu/Saudara/i sekalian merupakan anugerah terindah yang senantiasa kami syukuri.
        </p>

        <div className="pt-6 border-t border-gold/20 max-w-xs mx-auto">
          <p className="text-xs uppercase tracking-widest text-gold-muted mb-2 font-medium">
            KAMI YANG BERBAHAGIA
          </p>
          <p className="editorial-title text-3xl font-normal text-ivory">
            {weddingConfig.couple.title}
          </p>
          <p className="text-xs text-ivory/50 mt-1">
            Beserta Seluruh Keluarga Besar
          </p>
        </div>
      </div>
    </footer>
  );
}
