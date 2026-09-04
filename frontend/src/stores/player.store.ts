import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getStreamUrl, evictStreamUrl } from '@/lib/stream-cache';
import { toast } from '@/stores/toast.store';

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
  // Queues
  queue: Song[];              // Context playback queue (album, playlist, artist, search)
  currentIndex: number;       // Current index in context queue
  currentSong: Song | null;
  userQueue: Song[];          // Priority queue explicitly added by user ("Play Next" / "Add to Queue")
  history: Song[];            // Recently played tracks for backward navigation
  isQueueOpen: boolean;       // Whether the queue side-panel is open

  // Playback state (NOT persisted — reset on page load)
  isPlaying: boolean;
  progress: number;           // 0..1
  duration: number;           // seconds
  currentTime: number;        // seconds

  // Persisted preferences
  volume: number;             // 0..1
  shuffle: boolean;
  repeat: RepeatMode;

  // Source context
  contextType: ContextType;
  contextId: string | null;
  contextTitle: string | null;

  // Actions
  playSong: (
    song: Song,
    queue?: Song[],
    contextType?: ContextType,
    contextId?: string | null,
    contextTitle?: string | null
  ) => void;
  playQueue: (
    songs: Song[],
    startIndex: number,
    contextType?: ContextType,
    contextId?: string | null,
    contextTitle?: string | null
  ) => void;
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

  // Queue actions
  playNext: (songs: Song | Song[]) => void;
  addToQueue: (songs: Song | Song[]) => void;
  removeFromUserQueue: (index: number) => void;
  removeFromContextQueue: (index: number) => void;
  clearUserQueue: () => void;
  clearContextQueue: () => void;
  clearAllUpcoming: () => void;
  reorderUserQueue: (fromIndex: number, toIndex: number) => void;
  reorderContextQueue: (fromIndex: number, toIndex: number) => void;
  playFromUserQueue: (index: number) => void;
  playFromContextQueue: (index: number) => void;
  toggleQueue: () => void;
  setQueueOpen: (open: boolean) => void;
  setContextTitle: (title: string | null) => void;
}

export const usePlayerStore = create<PlayerState>()(
  persist(
    (set, get) => ({
      queue: [],
      currentIndex: 0,
      currentSong: null,
      userQueue: [],
      history: [],
      isQueueOpen: false,

      isPlaying: false,
      progress: 0,
      volume: 0.8,
      duration: 0,
      currentTime: 0,
      shuffle: false,
      repeat: 'none',
      contextType: null,
      contextId: null,
      contextTitle: null,

      playSong: (song, queue, contextType = null, contextId = null, contextTitle = null) => {
        const { currentSong, history } = get();
        const newQueue = queue ?? [song];
        const index = newQueue.findIndex((s) => s.id === song.id);
        const updatedHistory =
          currentSong && currentSong.id !== song.id
            ? [...history.slice(-49), currentSong]
            : history;

        set({
          queue: newQueue,
          currentIndex: index >= 0 ? index : 0,
          currentSong: song,
          isPlaying: true,
          contextType,
          contextId,
          contextTitle,
          history: updatedHistory,
        });
        loadAndPlay(song);
        recordHistory(song.id);
      },

      playQueue: (songs, startIndex, contextType = null, contextId = null, contextTitle = null) => {
        if (!songs.length) return;
        const { currentSong, history } = get();
        const song = songs[startIndex] ?? songs[0];
        const updatedHistory =
          currentSong && currentSong.id !== song.id
            ? [...history.slice(-49), currentSong]
            : history;

        set({
          queue: songs,
          currentIndex: startIndex,
          currentSong: song,
          isPlaying: true,
          contextType,
          contextId,
          contextTitle,
          history: updatedHistory,
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
        const { queue, currentIndex, userQueue, history, shuffle, repeat, currentSong } = get();

        // 1. If user queue has songs, play the first one next!
        if (userQueue.length > 0) {
          const nextSong = userQueue[0];
          const updatedUserQueue = userQueue.slice(1);
          const updatedHistory =
            currentSong ? [...history.slice(-49), currentSong] : history;

          set({
            userQueue: updatedUserQueue,
            currentSong: nextSong,
            isPlaying: true,
            history: updatedHistory,
          });
          loadAndPlay(nextSong);
          recordHistory(nextSong.id);
          return;
        }

        // 2. Otherwise advance in context queue
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

        const nextSong = queue[nextIndex];
        const updatedHistory =
          currentSong ? [...history.slice(-49), currentSong] : history;

        set({
          currentIndex: nextIndex,
          currentSong: nextSong,
          isPlaying: true,
          history: updatedHistory,
        });
        loadAndPlay(nextSong);
        recordHistory(nextSong.id);
      },

      prev: () => {
        const { queue, currentIndex, currentTime, history } = get();
        const audio = getAudioElement();
        // If past 3 seconds, restart current song
        if (currentTime > 3 && audio) {
          audio.currentTime = 0;
          return;
        }

        // If we have history tracks (e.g. from user queue or previous songs)
        if (history.length > 0) {
          const prevSong = history[history.length - 1];
          const updatedHistory = history.slice(0, -1);
          const indexInQueue = queue.findIndex((s) => s.id === prevSong.id);
          set({
            history: updatedHistory,
            currentSong: prevSong,
            currentIndex: indexInQueue >= 0 ? indexInQueue : currentIndex,
            isPlaying: true,
          });
          loadAndPlay(prevSong);
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
        const { currentSong, queue, userQueue } = get();
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

        const updatedUserQueue = userQueue.map((s) =>
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

        set({
          currentSong: updatedCurrentSong,
          queue: updatedQueue,
          userQueue: updatedUserQueue,
        });
      },

      // ── Track Queue Operations ─────────────────────────────────────────────
      playNext: (songs) => {
        const songArr = Array.isArray(songs) ? songs : [songs];
        if (!songArr.length) return;

        const { currentSong, userQueue } = get();

        // If nothing is playing, play immediately
        if (!currentSong) {
          get().playSong(songArr[0], songArr);
          toast.success(
            songArr.length === 1
              ? `Playing "${songArr[0].title}"`
              : `Playing ${songArr.length} tracks`
          );
          return;
        }

        // Filter out duplicate consecutive or add to front of userQueue
        set({
          userQueue: [...songArr, ...userQueue],
        });

        toast.success(
          songArr.length === 1
            ? `Playing next: "${songArr[0].title}"`
            : `${songArr.length} tracks will play next`
        );
      },

      addToQueue: (songs) => {
        const songArr = Array.isArray(songs) ? songs : [songs];
        if (!songArr.length) return;

        const { currentSong, userQueue } = get();

        // If nothing is playing, play immediately
        if (!currentSong) {
          get().playSong(songArr[0], songArr);
          toast.success(
            songArr.length === 1
              ? `Playing "${songArr[0].title}"`
              : `Playing ${songArr.length} tracks`
          );
          return;
        }

        set({
          userQueue: [...userQueue, ...songArr],
        });

        toast.success(
          songArr.length === 1
            ? `Added to queue: "${songArr[0].title}"`
            : `Added ${songArr.length} tracks to queue`
        );
      },

      removeFromUserQueue: (index) => {
        const { userQueue } = get();
        if (index < 0 || index >= userQueue.length) return;
        const updated = [...userQueue];
        const [removed] = updated.splice(index, 1);
        set({ userQueue: updated });
        if (removed) {
          toast.info(`Removed "${removed.title}" from queue`);
        }
      },

      removeFromContextQueue: (index) => {
        const { queue, currentIndex } = get();
        if (index < 0 || index >= queue.length) return;
        const updated = [...queue];
        const [removed] = updated.splice(index, 1);
        const newIndex =
          index < currentIndex ? Math.max(0, currentIndex - 1) : currentIndex;
        set({ queue: updated, currentIndex: newIndex });
        if (removed) {
          toast.info(`Removed "${removed.title}" from upcoming`);
        }
      },

      clearUserQueue: () => {
        set({ userQueue: [] });
        toast.info('Cleared user queue');
      },

      clearContextQueue: () => {
        const { queue, currentIndex } = get();
        set({ queue: queue.slice(0, currentIndex + 1) });
        toast.info('Cleared upcoming tracks');
      },

      clearAllUpcoming: () => {
        const { queue, currentIndex } = get();
        set({
          userQueue: [],
          queue: queue.slice(0, currentIndex + 1),
        });
        toast.info('Queue cleared');
      },

      reorderUserQueue: (fromIndex, toIndex) => {
        const { userQueue } = get();
        if (
          fromIndex < 0 ||
          fromIndex >= userQueue.length ||
          toIndex < 0 ||
          toIndex >= userQueue.length ||
          fromIndex === toIndex
        ) {
          return;
        }
        const updated = [...userQueue];
        const [item] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, item);
        set({ userQueue: updated });
      },

      reorderContextQueue: (fromIndex, toIndex) => {
        const { queue } = get();
        if (
          fromIndex < 0 ||
          fromIndex >= queue.length ||
          toIndex < 0 ||
          toIndex >= queue.length ||
          fromIndex === toIndex
        ) {
          return;
        }
        const updated = [...queue];
        const [item] = updated.splice(fromIndex, 1);
        updated.splice(toIndex, 0, item);
        set({ queue: updated });
      },

      playFromUserQueue: (index) => {
        const { userQueue, currentSong, history } = get();
        if (index < 0 || index >= userQueue.length) return;
        const song = userQueue[index];
        // Consume up to this index
        const remainingUserQueue = userQueue.slice(index + 1);
        const updatedHistory =
          currentSong ? [...history.slice(-49), currentSong] : history;

        set({
          userQueue: remainingUserQueue,
          currentSong: song,
          isPlaying: true,
          history: updatedHistory,
        });
        loadAndPlay(song);
        recordHistory(song.id);
      },

      playFromContextQueue: (index) => {
        const { queue, currentSong, history } = get();
        if (index < 0 || index >= queue.length) return;
        const song = queue[index];
        const updatedHistory =
          currentSong ? [...history.slice(-49), currentSong] : history;

        set({
          currentIndex: index,
          currentSong: song,
          isPlaying: true,
          history: updatedHistory,
        });
        loadAndPlay(song);
        recordHistory(song.id);
      },

      toggleQueue: () => set((s) => ({ isQueueOpen: !s.isQueueOpen })),
      setQueueOpen: (open) => set({ isQueueOpen: open }),
      setContextTitle: (title) => set({ contextTitle: title }),
    }),
    {
      name: 'sonicly-player',
      /**
       * Persist user preferences, context queue, and user-queued items.
       * Ephemeral playback state (isPlaying, progress, currentTime, duration)
       * is intentionally excluded — the audio element resets on page reload.
       */
      partialize: (state) => ({
        queue: state.queue,
        userQueue: state.userQueue,
        currentIndex: state.currentIndex,
        currentSong: state.currentSong,
        volume: state.volume,
        shuffle: state.shuffle,
        repeat: state.repeat,
        contextType: state.contextType,
        contextId: state.contextId,
        contextTitle: state.contextTitle,
      }),
    }
  )
);
