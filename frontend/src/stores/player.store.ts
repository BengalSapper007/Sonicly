import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getStreamUrl, evictStreamUrl } from '@/lib/stream-cache';

export interface Song {
  id: string;
  title: string;
  duration: number;
  audioKey: string;
  trackNum?: number;
  album: {
    id: string;
    title: string;
    imageKey: string;
    artist: { id: string; name: string };
  };
  genre?: { id: string; name: string };
  likes?: { userId: string }[];
  _count?: { likes: number };
}

export type RepeatMode = 'none' | 'one' | 'all';

export type ContextType = 'album' | 'playlist' | 'artist' | 'search' | null;

/**
 * The HTMLAudioElement lives outside Zustand state.
 * Storing DOM nodes in Zustand causes SSR issues and breaks serialization.
 * Use getAudio() / setAudio() to access it from actions.
 */
let _audioEl: HTMLAudioElement | null = null;

export function setAudioElement(el: HTMLAudioElement | null) {
  _audioEl = el;
}

export function getAudioElement(): HTMLAudioElement | null {
  return _audioEl;
}

/**
 * Fetch a presigned R2 stream URL for a song (with sessionStorage TTL cache),
 * then load and play it.  The cache prevents redundant /stream API hits when
 * revisiting the same song within a tab session.
 * On error, evict the cached URL so a fresh one is fetched next attempt.
 */
async function loadAndPlay(song: Song): Promise<void> {
  const audio = getAudioElement();
  if (!audio) return;

  try {
    const streamUrl = await getStreamUrl(song.id);
    audio.src = streamUrl;
    await audio.play();
  } catch (err) {
    console.error(`[Player] Failed to load stream for ${song.id}:`, err);
    // Evict the cached URL so a fresh presigned URL is fetched next time
    evictStreamUrl(song.id);
  }
}

/** Record play history silently — import historyApi locally to avoid circular refs. */
async function recordHistory(songId: string): Promise<void> {
  try {
    const { historyApi } = await import('@/lib/api');
    await historyApi.record(songId);
  } catch {
    // Non-critical; ignore failures
  }
}

interface PlayerState {
  // Queue
  queue: Song[];
  currentIndex: number;
  currentSong: Song | null;

  // Playback state (NOT persisted — reset on page load)
  isPlaying: boolean;
  progress: number;    // 0..1
  duration: number;    // seconds
  currentTime: number; // seconds

  // Persisted preferences
  volume: number;      // 0..1
  shuffle: boolean;
  repeat: RepeatMode;

  // Source context
  contextType: ContextType;
  contextId: string | null;

  // Actions
  playSong: (song: Song, queue?: Song[], contextType?: ContextType, contextId?: string | null) => void;
  playQueue: (songs: Song[], startIndex: number, contextType?: ContextType, contextId?: string | null) => void;
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
  setSongLiked: (songId: string, liked: boolean) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
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

      playSong: (song, queue, contextType = null, contextId = null) => {
        const newQueue = queue ?? [song];
        const index = newQueue.findIndex((s) => s.id === song.id);
        set({
          queue: newQueue,
          currentIndex: index >= 0 ? index : 0,
          currentSong: song,
          isPlaying: true,
          contextType,
          contextId,
        });
        // Fetch presigned URL via cache, then play — R2 credentials stay server-side
        loadAndPlay(song);
        recordHistory(song.id);
      },

      playQueue: (songs, startIndex, contextType = null, contextId = null) => {
        if (!songs.length) return;
        const song = songs[startIndex] ?? songs[0];
        set({
          queue: songs,
          currentIndex: startIndex,
          currentSong: song,
          isPlaying: true,
          contextType,
          contextId,
        });
        loadAndPlay(song);
        recordHistory(song.id);
      },

      togglePlay: () => {
        const { isPlaying } = get();
        const audio = getAudioElement();
        if (isPlaying) {
          audio?.pause();
        } else {
          audio?.play().catch(() => {});
        }
        set({ isPlaying: !isPlaying });
      },

      pause: () => {
        getAudioElement()?.pause();
        set({ isPlaying: false });
      },

      resume: () => {
        getAudioElement()?.play().catch(() => {});
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
        loadAndPlay(song);
        recordHistory(song.id);
      },

      prev: () => {
        const { queue, currentIndex, currentTime } = get();
        const audio = getAudioElement();
        // If past 3 seconds, restart current song
        if (currentTime > 3 && audio) {
          audio.currentTime = 0;
          return;
        }
        if (!queue.length) return;
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : queue.length - 1;
        const song = queue[prevIndex];
        set({ currentIndex: prevIndex, currentSong: song, isPlaying: true });
        loadAndPlay(song);
      },

      seek: (progress) => {
        const { duration } = get();
        const audio = getAudioElement();
        if (audio && duration) {
          audio.currentTime = progress * duration;
        }
        set({ progress });
      },

      setVolume: (vol) => {
        const audio = getAudioElement();
        if (audio) audio.volume = vol;
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

      setSongLiked: (songId: string, liked: boolean) => {
        const { currentSong, queue } = get();
        const updatedCurrentSong =
          currentSong && currentSong.id === songId
            ? {
                ...currentSong,
                likes: liked ? [{ userId: 'me' }] : [],
                _count: {
                  ...currentSong._count,
                  likes: Math.max(
                    0,
                    (currentSong._count?.likes ?? 0) + (liked ? 1 : -1)
                  ),
                },
              }
            : currentSong;

        const updatedQueue = queue.map((s) =>
          s.id === songId
            ? {
                ...s,
                likes: liked ? [{ userId: 'me' }] : [],
                _count: {
                  ...s._count,
                  likes: Math.max(0, (s._count?.likes ?? 0) + (liked ? 1 : -1)),
                },
              }
            : s
        );

        set({ currentSong: updatedCurrentSong, queue: updatedQueue });
      },
    }),
    {
      name: 'sonicly-player',
      /**
       * Only persist user preferences and queue state.
       * Ephemeral playback state (isPlaying, progress, currentTime, duration)
       * is intentionally excluded — the audio element resets on page reload.
       */
      partialize: (state) => ({
        queue: state.queue,
        currentIndex: state.currentIndex,
        currentSong: state.currentSong,
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        contextType: state.contextType,
        contextId: state.contextId,
      }),
    }
  )
);

