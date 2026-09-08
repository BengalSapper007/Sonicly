'use client';
import { useEffect, useRef } from 'react';
import { usePlayerStore, setAudioElement, scheduleServerSync } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { playerApi } from '@/lib/api';
import { evictStreamUrl } from '@/lib/stream-cache';
import { useMusicControls } from '@/hooks/useMusicControls';
import { useDeviceStore } from '@/stores/device.store';
import { useDeviceSocket, broadcastLocalPlaybackState } from '@/hooks/useDeviceSocket';

/**
 * AudioEngine
 * -----------
 * Renders a hidden <audio> element and wires it to the player store.
 * Also activates global music controls (keyboard shortcuts + Media Session API)
 * and the Spotify Connect real-time device socket.
 * This is the ONLY component that touches HTMLAudioElement.
 */
export function AudioEngine() {
  const audioRef = useRef<HTMLAudioElement>(null);
  useMusicControls();
  useDeviceSocket();

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const currentSong = usePlayerStore((s) => s.currentSong);
  const {
    setProgress,
    setCurrentTime,
    setDuration,
    setIsPlaying,
    next,
    volume,
    restoreServerState,
  } = usePlayerStore();

  // Restore cross-device player state from server on login / app load
  useEffect(() => {
    if (!isAuthenticated) return;

    playerApi
      .getState()
      .then((res) => {
        if (res.data) {
          restoreServerState(res.data);
        }
      })
      .catch(() => {});
  }, [isAuthenticated, restoreServerState]);

  // Broadcast song changes immediately so remote controller devices switch tracks in real-time
  useEffect(() => {
    if (!currentSong) return;
    const { activeDeviceId, myDeviceId } = useDeviceStore.getState();
    // Only broadcast if this device is the active playback device
    if (activeDeviceId && activeDeviceId !== myDeviceId) return;

    broadcastLocalPlaybackState({ currentSong });
  }, [currentSong?.id]);

  const tabIdRef = useRef<string>('');
  if (!tabIdRef.current) {
    tabIdRef.current = Math.random().toString(36).substring(2, 10);
  }

  // ── Multi-Tab Coordination (BroadcastChannel) ───────────────────────────
  // Pauses this tab immediately if another tab in the same browser starts playing
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('sonicly_tab_playback');
    channel.onmessage = (event) => {
      // ONLY pause if the play event originated from a DIFFERENT tab/window
      if (event.data?.type === 'PLAY_STARTED' && event.data?.tabId && event.data.tabId !== tabIdRef.current) {
        const el = audioRef.current;
        if (el && !el.paused) {
          el.pause();
        }
      }
    };

    return () => {
      channel.close();
    };
  }, []);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    // Register the element in the module-level variable
    setAudioElement(el);

    // Sync initial volume
    el.volume = volume;

    let lastSyncTime = 0;
    let lastBroadcastTime = 0;

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

      const now = Date.now();
      // Periodically sync position to server (every 5 seconds while playing)
      if (!el.paused && now - lastSyncTime > 5000) {
        lastSyncTime = now;
        scheduleServerSync(false);
      }

      // Real-time broadcast to remote controller devices (every 1 second while playing)
      if (!el.paused && now - lastBroadcastTime > 1000) {
        lastBroadcastTime = now;
        broadcastLocalPlaybackState({
          currentTime: cur,
          duration: dur,
          progress: dur > 0 ? cur / dur : 0,
          isPlaying: true,
        });
      }
    };

    const onDurationChange = () => {
      if (el.duration && el.duration > 0) {
        setDuration(el.duration);
      }
    };

    const onPlay = () => {
      setIsPlaying(true);
      // Notify other local browser tabs to pause audio
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        try {
          const channel = new BroadcastChannel('sonicly_tab_playback');
          channel.postMessage({ type: 'PLAY_STARTED', tabId: tabIdRef.current });
          channel.close();
        } catch {}
      }
      broadcastLocalPlaybackState({
        currentTime: el.currentTime,
        duration: el.duration || 0,
        progress: el.duration > 0 ? el.currentTime / el.duration : 0,
        isPlaying: true,
      });
    };

    const onPause = () => {
      setIsPlaying(false);
      broadcastLocalPlaybackState({
        currentTime: el.currentTime,
        duration: el.duration || 0,
        progress: el.duration > 0 ? el.currentTime / el.duration : 0,
        isPlaying: false,
      });
    };

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
      const state = usePlayerStore.getState();
      // If the audio element errors while paused, do nothing!
      // NEVER advance or wipe out the user's persisted track/progress while paused.
      if (!state.isPlaying || !state.currentSong) return;

      console.warn('[AudioEngine] Playback error on', state.currentSong.title, '— refreshing stream');
      evictStreamUrl(state.currentSong.id);
      state.resume();
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
