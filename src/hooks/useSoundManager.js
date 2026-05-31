// ============================================================
// SOUND MANAGER HOOK
// Manages all game audio with mute support
// ============================================================

import { useRef, useCallback, useEffect } from "react";

const SOUNDS = {
  flap:        "/audio/flap.mp3",
  collision:   "/audio/collision.mp3",
  milestone:   "/audio/milestone.mp3",
  celebration: "/audio/celebration.mp3",
  point:       "/audio/point.mp3",
  bgMusic:     "/audio/bgmusic.mp3",
};

export function useSoundManager() {
  const muted = useRef(false);
  const bgMusicRef = useRef(null);
  const audioPool = useRef({});

  useEffect(() => {
    // Preload all sounds
    Object.entries(SOUNDS).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = "auto";
      audioPool.current[key] = audio;
    });

    return () => {
      // Stop bg music on unmount
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  const play = useCallback((key, volume = 0.5) => {
    if (muted.current) return;
    try {
      const original = audioPool.current[key];
      if (!original) return;
      // Clone to allow overlapping sounds
      const clone = original.cloneNode();
      clone.volume = volume;
      clone.play().catch(() => {});
    } catch {
      // Audio failed silently
    }
  }, []);

  const startBgMusic = useCallback(() => {
    if (muted.current) return;
    try {
      const audio = audioPool.current["bgMusic"];
      if (!audio) return;
      audio.loop = true;
      audio.volume = 0.2;
      audio.play().catch(() => {});
      bgMusicRef.current = audio;
    } catch {}
  }, []);

  const stopBgMusic = useCallback(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.pause();
      bgMusicRef.current.currentTime = 0;
    }
  }, []);

  const toggleMute = useCallback(() => {
    muted.current = !muted.current;
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = muted.current;
    }
    return muted.current;
  }, []);

  const isMuted = useCallback(() => muted.current, []);

  return {
    play,
    startBgMusic,
    stopBgMusic,
    toggleMute,
    isMuted,
  };
}
