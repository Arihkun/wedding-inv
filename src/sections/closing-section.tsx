import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";
import { Reveal } from "@/components/reveal";

export function ClosingSection() {
  return (
    <footer
      id="closing"
      aria-label="Penutup Undangan"
      className="relative py-24 px-6 bg-forest text-ivory text-center overflow-hidden border-t border-gold/30"
    >
      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        <Reveal y={16}>
          <div className="flex justify-center mb-6">
            <div className="w-12 h-12 rounded-full border border-gold/40 flex items-center justify-center text-gold bg-forest-dark/80">
              <Heart className="w-5 h-5 fill-gold text-gold" aria-hidden="true" />
            </div>
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            UNGKAPAN TERIMA KASIH
          </p>

          <h2 className="editorial-title text-4xl sm:text-5xl font-normal text-ivory tracking-tight mt-3">
            Sampai Jumpa di Hari Bahagia
          </h2>

          <p className="text-base text-ivory/85 leading-relaxed font-sans max-w-md mx-auto mt-4">
            Kehadiran, doa restu, serta kehangatan kasih dari Bapak/Ibu/Saudara/i sekalian merupakan kehormatan yang senantiasa kami hargai.
          </p>
        </Reveal>

        <Reveal delay={0.2} y={16} className="pt-6 border-t border-gold/20 max-w-xs mx-auto">
          <p className="text-xs uppercase tracking-widest text-gold-muted mb-2 font-medium">
            KAMI YANG BERBAHAGIA
          </p>
          <p className="editorial-title text-3xl font-normal text-ivory">
            {weddingConfig.couple.title}
          </p>
          <p className="text-sm text-ivory/85 mt-1">
            Beserta Seluruh Keluarga Besar
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
