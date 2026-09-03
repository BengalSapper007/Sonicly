'use client';
import { useEffect, useRef } from 'react';
import { usePlayerStore, setAudioElement } from '@/stores/player.store';
import { getStreamUrl } from '@/lib/stream-cache';

/**
 * AudioEngine
 * -----------
 * Renders a hidden <audio> element and wires it to the player store.
 * This is the ONLY component that touches HTMLAudioElement.
 * It is completely decoupled from any UI.
 *
 * The audio element reference is stored in a module-level variable
 * (not Zustand state) to avoid SSR/serialization issues.
 *
 * On mount it also restores the persisted song (from localStorage via the
 * player store) by priming the audio src WITHOUT autoplaying, so the user
 * sees their previous song in the player bar after a page reload.
 */
export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    setProgress,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    next,
    volume,
    currentSong,
  } = usePlayerStore();

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    // Register the element in the module-level variable
    setAudioElement(el);

    // Sync initial volume
    el.volume = volume;

    // ── Restore persisted song without autoplaying ────────────────────────
    // The player store rehydrates from localStorage on startup.  If a song
    // was playing when the user last closed the tab, prime the audio element
    // so the player bar shows the correct song/thumbnail immediately.
    if (currentSong) {
      getStreamUrl(currentSong.id)
        .then((url) => {
          if (el.src !== url) {
            el.src = url;
            el.preload = 'metadata';
            // Explicitly do NOT call el.play() here
          }
        })
        .catch(() => {
          // Non-fatal — user can still press play to trigger a fresh fetch
        });
    }

    const onTimeUpdate = () => {
      const dur = el.duration || 0;
      const cur = el.currentTime;
      setCurrentTime(cur);
      setProgress(dur > 0 ? cur / dur : 0);
    };

    const onDurationChange = () => setDuration(el.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      const { repeat: r } = usePlayerStore.getState();
      if (r === 'one') {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        next();
      }
    };
    const onError = () => {
      // Audio failed to load (missing file or expired URL) — log and auto-advance
      console.warn('[AudioEngine] Error loading audio, advancing to next track');
      setTimeout(() => next(), 1500);
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('durationchange', onDurationChange);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnded);
    el.addEventListener('error', onError);

    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('durationchange', onDurationChange);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('error', onError);
      // Unregister on unmount
      setAudioElement(null);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync volume changes from store → audio element
  useEffect(() => {
    const el = audioRef.current;
    if (el) el.volume = volume;
  }, [volume]);

  return (
    <audio
      ref={audioRef}
      preload="metadata"
      className="hidden"
      aria-hidden="true"
    />
  );
}
