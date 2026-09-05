'use client';
import { useEffect, useRef } from 'react';
import { usePlayerStore, setAudioElement } from '@/stores/player.store';
import { getStreamUrl } from '@/lib/stream-cache';
import { useMusicControls } from '@/hooks/useMusicControls';

/**
 * AudioEngine
 * -----------
 * Renders a hidden <audio> element and wires it to the player store.
 * Also activates global music controls (keyboard shortcuts + Media Session API).
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
  useMusicControls();

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

    const onTimeUpdate = () => {
      const savedTime = usePlayerStore.getState().currentTime;
      // Prevent resetting saved currentTime to 0 on initial load before playback or seek
      if (el.paused && el.currentTime === 0 && savedTime > 0) {
        return;
      }
      const dur = el.duration || 0;
      const cur = el.currentTime;
      setCurrentTime(cur);
      setProgress(dur > 0 ? cur / dur : 0);
    };

    const onDurationChange = () => {
      if (el.duration && el.duration > 0) {
        setDuration(el.duration);
      }
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      const {
        repeat: r,
        userQueue,
        next,
        setIsPlaying,
        setProgress,
        setCurrentTime,
      } = usePlayerStore.getState();

      if (r === 'one') {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else if (r === 'all' || userQueue.length > 0) {
        next();
      } else {
        // Repeat is 'none' (Off): stop playback when current track finishes
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
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

  // Sync audio element src and seek position with currentSong (handles initial hydration & page refresh)
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !currentSong) return;

    getStreamUrl(currentSong.id)
      .then((url) => {
        if (el.src !== url) {
          el.src = url;
          el.preload = 'metadata';
          const { currentTime, duration } = usePlayerStore.getState();
          const targetTime = duration > 0 && currentTime >= duration - 2 ? 0 : currentTime;
          if (targetTime > 0) {
            const applySeek = () => {
              try {
                el.currentTime = targetTime;
              } catch {}
            };
            if (el.readyState >= 1) {
              applySeek();
            } else {
              el.addEventListener('loadedmetadata', applySeek, { once: true });
            }
          }
        }
      })
      .catch(() => {
        // Non-fatal — user can still press play to trigger a fresh fetch
      });
  }, [currentSong?.id]);

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
