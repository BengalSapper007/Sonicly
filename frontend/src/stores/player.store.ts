'use client';
import { create } from 'zustand';
import { historyApi } from '@/lib/api';

export interface Song {
  id: string;
  title: string;
  duration: number;
  audioUrl: string;
  trackNum?: number;
  album: {
    id: string;
    title: string;
    imageUrl: string;
    artist: { id: string; name: string };
  };
  genre?: { id: string; name: string };
  likes?: { userId: string }[];
  _count?: { likes: number };
}

export type RepeatMode = 'none' | 'one' | 'all';

interface PlayerState {
  // Queue
  queue: Song[];
  currentIndex: number;
  currentSong: Song | null;

  // Playback state
  isPlaying: boolean;
  progress: number;      // 0..1
  volume: number;        // 0..1
  duration: number;      // seconds
  currentTime: number;   // seconds

  // Mode
  shuffle: boolean;
  repeat: RepeatMode;
  
  // Source context
  contextType: 'album' | 'playlist' | 'artist' | 'search' | null;
  contextId: string | null;

  // Audio element ref
  audioRef: HTMLAudioElement | null;

  // Actions
  setAudioRef: (el: HTMLAudioElement | null) => void;
  playSong: (song: Song, queue?: Song[], contextType?: PlayerState['contextType'], contextId?: string) => void;
  playQueue: (songs: Song[], startIndex: number, contextType?: PlayerState['contextType'], contextId?: string) => void;
  togglePlay: () => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  prev: () => void;
  seek: (progress: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  setProgress: (progress: number) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  setIsPlaying: (playing: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()((set, get) => ({
  queue: [],
  currentIndex: 0,
  currentSong: null,
  isPlaying: false,
  progress: 0,
  volume: 0.8,
  duration: 0,
  currentTime: 0,
  shuffle: false,
  repeat: 'none',
  contextType: null,
  contextId: null,
  audioRef: null,

  setAudioRef: (el) => set({ audioRef: el }),

  playSong: (song, queue, contextType = null, contextId = null) => {
    const newQueue = queue || [song];
    const index = newQueue.findIndex((s) => s.id === song.id);
    set({
      queue: newQueue,
      currentIndex: index >= 0 ? index : 0,
      currentSong: song,
      isPlaying: true,
      contextType,
      contextId,
    });
    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = song.audioUrl;
      audioRef.play().catch(() => {});
    }
    // Record play history
    historyApi.record(song.id).catch(() => {});
  },

  playQueue: (songs, startIndex, contextType = null, contextId = null) => {
    if (!songs.length) return;
    const song = songs[startIndex] || songs[0];
    set({
      queue: songs,
      currentIndex: startIndex,
      currentSong: song,
      isPlaying: true,
      contextType,
      contextId,
    });
    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = song.audioUrl;
      audioRef.play().catch(() => {});
    }
    historyApi.record(song.id).catch(() => {});
  },

  togglePlay: () => {
    const { isPlaying, audioRef } = get();
    if (isPlaying) {
      audioRef?.pause();
    } else {
      audioRef?.play().catch(() => {});
    }
    set({ isPlaying: !isPlaying });
  },

  pause: () => {
    get().audioRef?.pause();
    set({ isPlaying: false });
  },

  resume: () => {
    get().audioRef?.play().catch(() => {});
    set({ isPlaying: true });
  },

  next: () => {
    const { queue, currentIndex, shuffle, repeat } = get();
    if (!queue.length) return;

    let nextIndex: number;
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * queue.length);
      } while (nextIndex === currentIndex && queue.length > 1);
    } else if (currentIndex < queue.length - 1) {
      nextIndex = currentIndex + 1;
    } else if (repeat === 'all') {
      nextIndex = 0;
    } else {
      set({ isPlaying: false });
      return;
    }

    const song = queue[nextIndex];
    set({ currentIndex: nextIndex, currentSong: song, isPlaying: true });
    const { audioRef } = get();
    if (audioRef) {
      audioRef.src = song.audioUrl;
      audioRef.play().catch(() => {});
    }
    historyApi.record(song.id).catch(() => {});
  },

  prev: () => {
    const { queue, currentIndex, audioRef, currentTime } = get();
    // If past 3s, restart current song
    if (currentTime > 3 && audioRef) {
      audioRef.currentTime = 0;
      return;
    }
    if (!queue.length) return;
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
    const song = queue[prevIndex];
    set({ currentIndex: prevIndex, currentSong: song, isPlaying: true });
    if (audioRef) {
      audioRef.src = song.audioUrl;
      audioRef.play().catch(() => {});
    }
  },

  seek: (progress) => {
    const { audioRef, duration } = get();
    if (audioRef && duration) {
      audioRef.currentTime = progress * duration;
    }
    set({ progress });
  },

  setVolume: (vol) => {
    const { audioRef } = get();
    if (audioRef) audioRef.volume = vol;
    set({ volume: vol });
  },

  toggleShuffle: () => set((s) => ({ shuffle: !s.shuffle })),

  toggleRepeat: () =>
    set((s) => ({
      repeat: s.repeat === 'none' ? 'all' : s.repeat === 'all' ? 'one' : 'none',
    })),

  setProgress: (progress) => set({ progress }),
  setCurrentTime: (currentTime) => set({ currentTime }),
  setDuration: (duration) => set({ duration }),
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));
