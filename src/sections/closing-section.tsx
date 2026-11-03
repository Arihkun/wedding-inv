import { weddingConfig } from "@/config/wedding.config";
import { Reveal } from "@/components/reveal";
import { BotanicalDivider, MonogramCrest } from "@/components/botanical-ornaments";

export function ClosingSection() {
  return (
    <footer
      id="closing"
      aria-label="Penutup Undangan"
      className="relative py-24 px-6 bg-forest text-ivory text-center overflow-hidden border-t border-gold/30"
    >
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        <Reveal y={16}>
          <div className="flex justify-center mb-4">
            <MonogramCrest />
          </div>

          <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium">
            UNGKAPAN TERIMA KASIH
          </p>

          <h2 className="editorial-title text-4xl sm:text-5xl font-normal text-ivory tracking-tight mt-3">
            Sampai Jumpa di Hari Bahagia
          </h2>

          <p className="text-base text-ivory/85 leading-relaxed font-sans max-w-md mx-auto mt-4 font-light italic">
            &ldquo;Kehadiran, doa restu, serta kehangatan kasih dari Bapak/Ibu/Saudara/i sekalian merupakan kehormatan yang senantiasa kami hargai.&rdquo;
          </p>

          <BotanicalDivider className="my-6" />
        </Reveal>

        <Reveal delay={0.2} y={16} className="pt-2 max-w-xs mx-auto">
          <p className="text-xs uppercase tracking-widest text-gold-muted mb-2 font-medium">
            KAMI YANG BERBAHAGIA
          </p>
          <p className="editorial-title text-3xl font-normal text-ivory italic">
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
