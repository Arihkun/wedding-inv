import Image from "next/image";
import { weddingConfig } from "@/config/wedding.config";
import type { Profile } from "@/types/wedding";
import { Reveal } from "@/components/reveal";

function ProfileCard({ profile, role }: { profile: Profile; role: string }) {
  return (
    <div className="flex flex-col items-center text-center p-6 sm:p-8 rounded-2xl bg-ivory border border-border-strong shadow-sm max-w-sm w-full">
      {/* Portrait Photo */}
      <div className="relative aspect-[3/4] w-48 sm:w-56 rounded-xl overflow-hidden border border-border-strong mb-6 shadow-inner">
        <Image
          src={profile.photo.src}
          alt={profile.photo.alt}
          width={profile.photo.width}
          height={profile.photo.height}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {profile.photo.placeholder && (
          <div className="absolute bottom-2 inset-x-2 bg-surface/90 backdrop-blur-xs py-1 px-2 rounded text-[10px] text-secondary font-medium text-center">
            Foto Representasi Botanical
          </div>
        )}
      </div>

      <p className="text-xs uppercase tracking-[0.2em] text-secondary font-medium mb-1">
        {role}
      </p>

      <h3 className="editorial-title text-3xl font-medium text-forest mb-2">
        {profile.nickname}
      </h3>

      {profile.fullName && (
        <p className="text-sm font-medium text-secondary mb-3">{profile.fullName}</p>
      )}

      {(profile.father || profile.mother) && (
        <div className="text-xs text-secondary/90 space-y-0.5 mt-2 pt-2 border-t border-border-subtle w-full">
          <p className="font-medium text-forest">Putra/Putri dari:</p>
          {profile.father && <p>Bapak {profile.father}</p>}
          {profile.mother && <p>Ibu {profile.mother}</p>}
        </div>
      )}

      {profile.instagram && (
        <a
          href={`https://instagram.com/${profile.instagram.replace(/^@/, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 min-h-[44px] inline-flex items-center gap-2 text-sm text-forest hover:text-forest transition-colors font-medium border border-border-strong px-4 py-2.5 rounded-full hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest"
        >
          <span>@{profile.instagram.replace(/^@/, "")}</span>
        </a>
      )}
    </div>
  );
}

export function CoupleSection() {
  const { bride, groom } = weddingConfig.couple;

  return (
    <section
      id="couple"
      aria-label="Profil Mempelai"
      className="py-20 px-6 bg-surface text-forest"
    >
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <Reveal y={16} className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-secondary font-medium">
            MEMPELAI
          </p>
          <h2 className="editorial-title text-3xl sm:text-4xl text-forest font-normal">
            Dua Insan, Satu Janji
          </h2>
          <p className="text-base text-secondary max-w-lg mx-auto leading-relaxed">
            Dengan penuh rasa syukur, kami mengundang Anda untuk menyaksikan perayaan pernikahan kami berdua.
          </p>
        </Reveal>

        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-8 xl:gap-12">
          <Reveal delay={0.1} y={24} className="w-full flex justify-center">
            <ProfileCard profile={bride} role="Mempelai Wanita" />
          </Reveal>

          <Reveal delay={0.2} scale={0.8} y={0} className="flex items-center justify-center">
            <span className="editorial-title text-4xl text-gold font-light italic px-4">
              &amp;
            </span>
          </Reveal>

          <Reveal delay={0.3} y={24} className="w-full flex justify-center">
            <ProfileCard profile={groom} role="Mempelai Pria" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
