'use client';
import { useEffect, useCallback } from 'react';
import { usePlayerStore, getAudioElement } from '@/stores/player.store';
import { useLibraryStore } from '@/stores/library.store';
import { artworkUrl } from '@/lib/api';
import { toast } from '@/stores/toast.store';

/**
 * useMusicControls
 * ----------------
 * Provides global keyboard shortcuts and Media Session API support.
 *
 * Supported Keyboard Shortcuts (when not inside inputs/textareas):
 * - Space: Play / Pause
 * - Shift + → / Ctrl + → / Alt + → / N: Next Track
 * - Shift + ← / Ctrl + ← / Alt + ← / P: Previous Track
 * - →: Seek forward 5s
 * - ←: Seek backward 5s
 * - ↑: Volume up 5%
 * - ↓: Volume down 5%
 * - M: Mute / Unmute
 * - L: Like / Unlike current track
 * - Q: Toggle Play Queue panel
 * - S: Toggle Shuffle
 * - R: Cycle Repeat mode
 * - ?: Show Keyboard Shortcuts cheat sheet
 */
export function useMusicControls() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    togglePlay,
    pause,
    resume,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleQueue,
  } = usePlayerStore();

  const toggleLikeSong = useLibraryStore((s) => s.toggleLikeSong);

  // ── 1. Global Keyboard Shortcuts ──────────────────────────────────────────
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Ignore when user is typing in form inputs, textareas, contenteditable, or search fields
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Ignore if modifier keys other than Shift are pressed for standard keys
      const hasCtrlOrMeta = e.ctrlKey || e.metaKey;
      const hasAlt = e.altKey;

      // ── Spacebar: Play / Pause
      if (e.code === 'Space' || e.key === ' ') {
        e.preventDefault();
        togglePlay();
        return;
      }

      // ── Next Track: Shift + Right, Ctrl + Right, Alt + Right, or 'N'
      if (
        (e.key === 'ArrowRight' && (e.shiftKey || hasCtrlOrMeta || hasAlt)) ||
        (!hasCtrlOrMeta && !hasAlt && (e.key === 'n' || e.key === 'N'))
      ) {
        e.preventDefault();
        next();
        return;
      }

      // ── Previous Track: Shift + Left, Ctrl + Left, Alt + Left, or 'P'
      if (
        (e.key === 'ArrowLeft' && (e.shiftKey || hasCtrlOrMeta || hasAlt)) ||
        (!hasCtrlOrMeta && !hasAlt && (e.key === 'p' || e.key === 'P'))
      ) {
        e.preventDefault();
        prev();
        return;
      }

      // ── Seek Forward 5s: Plain ArrowRight (or 'l'/'L')
      if (e.key === 'ArrowRight' && !e.shiftKey && !hasCtrlOrMeta && !hasAlt) {
        e.preventDefault();
        const audio = getAudioElement();
        if (audio && duration > 0) {
          const newTime = Math.min(duration, (audio.currentTime || currentTime) + 5);
          seek(newTime / duration);
        }
        return;
      }

      // ── Seek Backward 5s: Plain ArrowLeft (or 'j'/'J')
      if (e.key === 'ArrowLeft' && !e.shiftKey && !hasCtrlOrMeta && !hasAlt) {
        e.preventDefault();
        const audio = getAudioElement();
        if (audio && duration > 0) {
          const newTime = Math.max(0, (audio.currentTime || currentTime) - 5);
          seek(newTime / duration);
        }
        return;
      }

      // ── Volume Up 5%: ArrowUp
      if (e.key === 'ArrowUp' && !hasCtrlOrMeta && !hasAlt) {
        e.preventDefault();
        const newVol = Math.min(1, Math.round((volume + 0.05) * 100) / 100);
        setVolume(newVol);
        return;
      }

      // ── Volume Down 5%: ArrowDown
      if (e.key === 'ArrowDown' && !hasCtrlOrMeta && !hasAlt) {
        e.preventDefault();
        const newVol = Math.max(0, Math.round((volume - 0.05) * 100) / 100);
        setVolume(newVol);
        return;
      }

      // ── Mute / Unmute: 'm' / 'M'
      if (!hasCtrlOrMeta && !hasAlt && (e.key === 'm' || e.key === 'M')) {
        e.preventDefault();
        setVolume(volume === 0 ? 0.5 : 0);
        return;
      }

      // ── Toggle Queue Panel: 'q' / 'Q'
      if (!hasCtrlOrMeta && !hasAlt && (e.key === 'q' || e.key === 'Q')) {
        e.preventDefault();
        toggleQueue();
        return;
      }

      // ── Like / Save Track: 'l' / 'L' (without arrow)
      if (!hasCtrlOrMeta && !hasAlt && (e.key === 'l' || e.key === 'L')) {
        if (currentSong) {
          e.preventDefault();
          toggleLikeSong(currentSong);
        }
        return;
      }

      // ── Toggle Shuffle: 's' / 'S'
      if (!hasCtrlOrMeta && !hasAlt && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        toggleShuffle();
        return;
      }

      // ── Cycle Repeat: 'r' / 'R'
      if (!hasCtrlOrMeta && !hasAlt && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        toggleRepeat();
        return;
      }

      // ── Keyboard Shortcuts Help: '?'
      if (e.key === '?' && e.shiftKey) {
        e.preventDefault();
        toast.info(
          'Shortcuts: Space (Play/Pause), Shift+→/N (Next), Shift+←/P (Prev), ←/→ (Seek 5s), ↑/↓ (Volume), M (Mute), Q (Queue), L (Like)'
        );
        return;
      }
    },
    [
      togglePlay,
      next,
      prev,
      seek,
      duration,
      currentTime,
      volume,
      setVolume,
      toggleQueue,
      toggleLikeSong,
      currentSong,
      toggleShuffle,
      toggleRepeat,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ── 2. Media Session API (Hardware media keys & OS Notification / Lock Screen) ─
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) {
      return;
    }

    if (currentSong) {
      const artUrl = currentSong.album?.imageKey
        ? artworkUrl(currentSong.album.imageKey)
        : '';

      navigator.mediaSession.metadata = new MediaMetadata({
        title: currentSong.title,
        artist: currentSong.album?.artist?.name || 'Unknown Artist',
        album: currentSong.album?.title || '',
        artwork: artUrl
          ? [
              { src: artUrl, sizes: '96x96', type: 'image/jpeg' },
              { src: artUrl, sizes: '128x128', type: 'image/jpeg' },
              { src: artUrl, sizes: '256x256', type: 'image/jpeg' },
              { src: artUrl, sizes: '512x512', type: 'image/jpeg' },
            ]
          : [],
      });
    }

    // Set action handlers
    const actionHandlers: [MediaSessionAction, MediaSessionActionHandler | null][] = [
      ['play', () => resume()],
      ['pause', () => pause()],
      ['nexttrack', () => next()],
      ['previoustrack', () => prev()],
      [
        'seekto',
        (details) => {
          if (details.seekTime != null && duration > 0) {
            seek(details.seekTime / duration);
          }
        },
      ],
      [
        'seekbackward',
        (details) => {
          const offset = details.seekOffset || 10;
          if (duration > 0) {
            seek(Math.max(0, currentTime - offset) / duration);
          }
        },
      ],
      [
        'seekforward',
        (details) => {
          const offset = details.seekOffset || 10;
          if (duration > 0) {
            seek(Math.min(duration, currentTime + offset) / duration);
          }
        },
      ],
    ];

    for (const [action, handler] of actionHandlers) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some browsers may not support all actions
      }
    }

    return () => {
      for (const [action] of actionHandlers) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {}
      }
    };
  }, [currentSong, resume, pause, next, prev, seek, duration, currentTime]);

  // Sync playbackState (playing / paused)
  useEffect(() => {
    if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
      navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
    }
  }, [isPlaying]);

  // Sync position state
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'mediaSession' in navigator &&
      'setPositionState' in navigator.mediaSession &&
      duration > 0
    ) {
      try {
        navigator.mediaSession.setPositionState({
          duration: Math.max(0, duration),
          playbackRate: 1,
          position: Math.min(Math.max(0, currentTime), duration),
        });
      } catch {
        // Ignore edge conditions where position > duration
      }
    }
  }, [currentTime, duration]);
}
