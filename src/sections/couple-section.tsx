"use client";

import Image from "next/image";
import { weddingConfig } from "@/config/wedding.config";
import type { Profile } from "@/types/wedding";
import { Reveal } from "@/components/reveal";
import { CornerFlourish, BotanicalDivider } from "@/components/botanical-ornaments";
import { CardSpotlight } from "@/components/card-spotlight";

function ProfileCard({ profile, role }: { profile: Profile; role: string }) {
  return (
    <CardSpotlight
      spotlightColor="rgba(197, 160, 89, 0.22)"
      className="relative flex flex-col items-center text-center p-6 sm:p-8 rounded-3xl bg-ivory border-2 border-gold/30 shadow-lg hover:shadow-xl transition-all max-w-sm w-full overflow-hidden"
    >
      {/* Corner Flourishes */}
      <CornerFlourish position="top-left" className="top-1.5 left-1.5 opacity-60" />
      <CornerFlourish position="top-right" className="top-1.5 right-1.5 opacity-60" />
      <CornerFlourish position="bottom-left" className="bottom-1.5 left-1.5 opacity-60" />
      <CornerFlourish position="bottom-right" className="bottom-1.5 right-1.5 opacity-60" />

      {/* Arched Portrait Photo */}
      <div className="relative aspect-[3/4] w-48 sm:w-56 arch-frame-sm overflow-hidden border-2 border-gold/40 mb-6 shadow-md p-1 bg-gradient-to-b from-gold/30 via-transparent to-gold/30 group">
        <div className="w-full h-full arch-frame-sm overflow-hidden relative">
          <Image
            src={profile.photo.src}
            alt={profile.photo.alt}
            width={profile.photo.width}
            height={profile.photo.height}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {profile.photo.placeholder && (
            <div className="absolute bottom-2 inset-x-2 bg-surface/90 backdrop-blur-xs py-1 px-2 rounded text-[10px] text-secondary font-medium text-center">
              Foto Representasi Botanical
            </div>
          )}
        </div>
      </div>

      <p className="text-xs uppercase tracking-[0.25em] text-gold font-medium mb-1">
        {role}
      </p>

      <h3 className="editorial-title text-3xl sm:text-4xl font-normal text-forest mb-1 italic">
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
          className="mt-4 min-h-[44px] inline-flex items-center gap-2 text-sm text-forest hover:text-gold transition-colors font-medium border border-gold/40 px-5 py-2.5 rounded-full hover:bg-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-forest shadow-xs"
        >
          <span>@{profile.instagram.replace(/^@/, "")}</span>
        </a>
      )}
    </CardSpotlight>
  );
}

export function CoupleSection() {
  const { bride, groom } = weddingConfig.couple;

  return (
    <section
      id="couple"
      aria-label="Profil Mempelai"
      className="py-20 px-6 bg-surface text-forest relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto text-center space-y-10">
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
          <BotanicalDivider className="my-4" />
        </Reveal>

        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-center gap-8 xl:gap-12">
          <Reveal delay={0.1} y={24} className="w-full flex justify-center">
            <ProfileCard profile={bride} role="Mempelai Wanita" />
          </Reveal>

          <Reveal delay={0.2} scale={0.8} y={0} className="flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-gold/40 bg-ivory flex items-center justify-center shadow-xs">
              <span className="editorial-title text-3xl text-gold font-light italic">
                &amp;
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.3} y={24} className="w-full flex justify-center">
            <ProfileCard profile={groom} role="Mempelai Pria" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
