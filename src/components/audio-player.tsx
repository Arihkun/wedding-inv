"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Volume2, VolumeX, Play, Pause, Music, AlertCircle } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";

export interface AudioPlayerHandle {
  playAudio: () => void;
}

export const AudioPlayer = forwardRef<AudioPlayerHandle>((_, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [playFeedback, setPlayFeedback] = useState<string | null>(null);

  const music = weddingConfig.music;

  const playAudio = () => {
    if (!music || hasError) return;
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setPlayFeedback(null);
        })
        .catch(() => {
          // Autoplay rejection by browser policy
          setIsPlaying(false);
          setPlayFeedback("Klik putar untuk mendengarkan musik");
        });
    }
  };

  useImperativeHandle(ref, () => ({
    playAudio,
  }));

  const togglePlay = () => {
    if (!audioRef.current || !music || hasError) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      playAudio();
    }
  };

  const toggleMute = () => {
    if (!audioRef.current || !music || hasError) return;
    const nextMuted = !isMuted;
    audioRef.current.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  if (!music) {
    return (
      <aside
        aria-label="Pemutar Audio"
        className="fixed top-5 right-5 z-40 bg-forest-dark/80 backdrop-blur-md border border-gold/30 text-gold-muted text-xs px-3.5 py-2 rounded-full shadow-lg flex items-center gap-2 min-h-[44px]"
        role="status"
      >
        <Music className="w-4 h-4 text-gold shrink-0" aria-hidden="true" />
        <span className="hidden sm:inline">Musik latar belum tersedia</span>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Pemutar Audio Latar"
      className="fixed top-5 right-5 z-40 flex items-center gap-2 bg-forest-dark/90 backdrop-blur-md border border-gold/40 text-ivory px-3.5 py-2 rounded-full shadow-xl"
    >
      <audio
        ref={audioRef}
        src={music.src}
        loop
        preload="none"
        onPlay={() => {
          setIsPlaying(true);
          setPlayFeedback(null);
        }}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
          setPlayFeedback("Gagal memuat berkas audio");
        }}
      />

      {hasError ? (
        <div className="flex items-center gap-1.5 px-2 py-1 text-xs text-rose-300">
          <AlertCircle className="w-4 h-4" />
          <span>Musik latar tidak dapat dimuat</span>
        </div>
      ) : (
        <>
          {/* Spinning Gold Disc Icon */}
          <div
            className={`w-7 h-7 rounded-full bg-forest border-2 border-gold flex items-center justify-center text-gold shadow-xs ${
              isPlaying ? "animate-spin [animation-duration:5s]" : ""
            }`}
          >
            <Music className="w-3.5 h-3.5" aria-hidden="true" />
          </div>

          <div className="flex flex-col text-left pr-1">
            <span className="text-xs font-serif font-medium text-ivory max-w-[120px] truncate">
              {music.title || "Wedding Song"}
            </span>
          </div>

          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? "Jeda musik" : "Putar musik"}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ivory hover:text-gold transition-colors cursor-pointer"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-current" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4 fill-current" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Bunyikan audio" : "Bisukan audio"}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center text-ivory hover:text-gold transition-colors cursor-pointer"
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-rose-400" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          {playFeedback && (
            <span className="text-[11px] text-amber-300 pl-1" role="status">
              {playFeedback}
            </span>
          )}
        </>
      )}
    </aside>
  );
});

AudioPlayer.displayName = "AudioPlayer";
