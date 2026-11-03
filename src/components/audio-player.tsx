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
        className="fixed bottom-5 left-5 z-40 bg-surface border border-border-strong text-secondary text-xs px-4 py-2.5 rounded-full shadow-sm flex items-center gap-2 min-h-[44px]"
        role="status"
      >
        <Music className="w-4 h-4 text-secondary" aria-hidden="true" />
        <span>Musik latar tidak tersedia</span>
      </aside>
    );
  }

  return (
    <aside
      aria-label="Pemutar Audio Latar"
      className="fixed bottom-5 left-5 z-40 flex items-center gap-2 bg-forest border border-gold/40 text-ivory px-3.5 py-2 rounded-full shadow-lg"
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
          <button
            type="button"
            onClick={togglePlay}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-forest-dark hover:bg-forest-light text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
            title={isPlaying ? "Jeda musik" : "Putar musik"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="w-11 h-11 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full bg-forest-dark hover:bg-forest-light text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label={isMuted ? "Bunyikan musik latar" : "Bisukan musik latar"}
            title={isMuted ? "Bunyikan" : "Bisukan"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            )}
          </button>

          <div className="hidden sm:flex flex-col pr-2 text-left">
            <span className="text-xs font-medium text-ivory truncate max-w-[140px]">
              {music.title}
            </span>
            <span className="text-[10px] text-ivory/70">
              {playFeedback ? playFeedback : isPlaying ? "Memutar" : "Berhenti"}
            </span>
          </div>
        </>
      )}
    </aside>
  );
});

AudioPlayer.displayName = "AudioPlayer";
