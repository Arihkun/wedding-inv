"use client";

import { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";
import { weddingConfig } from "@/config/wedding.config";

export interface AudioPlayerHandle {
  playAudio: () => void;
}

export const AudioPlayer = forwardRef<AudioPlayerHandle>((_, ref) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);

  const music = weddingConfig.music;

  const playAudio = () => {
    if (!music || hasError) return;
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          // Browser prevented autoplay or network error
          setIsPlaying(false);
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
      setIsPlaying(false);
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
      <div
        className="fixed bottom-5 left-5 z-40 bg-surface/90 border border-border-strong text-secondary text-xs px-3 py-2 rounded-full shadow-sm flex items-center gap-2"
        role="status"
        aria-live="polite"
      >
        <Music className="w-3.5 h-3.5 text-secondary" aria-hidden="true" />
        <span>Musik latar tidak tersedia</span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-1.5 bg-forest/95 backdrop-blur-sm border border-gold/40 text-ivory px-3 py-2 rounded-full shadow-lg">
      <audio
        ref={audioRef}
        src={music.src}
        loop
        preload="none"
        onEnded={() => setIsPlaying(false)}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
      />

      {hasError ? (
        <span className="text-xs text-ivory/80 px-2 py-1">Musik latar gagal dimuat</span>
      ) : (
        <>
          <button
            type="button"
            onClick={togglePlay}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-forest-light text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label={isPlaying ? "Jeda musik latar" : "Putar musik latar"}
            title={isPlaying ? "Jeda musik" : "Putar musik"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            onClick={toggleMute}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-forest-light text-gold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold"
            aria-label={isMuted ? "Bunyikan musik latar" : "Bisukan musik latar"}
            title={isMuted ? "Bunyikan" : "Bisukan"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Volume2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>

          <div className="hidden sm:flex flex-col pr-2 text-left">
            <span className="text-[11px] font-medium text-ivory truncate max-w-[120px]">
              {music.title}
            </span>
            <span className="text-[9px] text-ivory/60">
              {isPlaying ? "Memutar" : "Berhenti"}
            </span>
          </div>
        </>
      )}
    </div>
  );
});

AudioPlayer.displayName = "AudioPlayer";
