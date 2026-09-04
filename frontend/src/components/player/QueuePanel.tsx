'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  X,
  Trash2,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  ListMusic,
  Heart,
  Music2,
  Disc,
} from 'lucide-react';
import { usePlayerStore, type Song } from '@/stores/player.store';
import { useLibraryStore } from '@/stores/library.store';
import { artworkUrl } from '@/lib/api';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatDuration } from '@/lib/utils';
import { TrackOptionsMenu } from '@/components/catalog/TrackOptionsMenu';

export function QueuePanel() {
  const {
    currentSong,
    isPlaying,
    togglePlay,
    queue,
    currentIndex,
    userQueue,
    isQueueOpen,
    setQueueOpen,
    contextType,
    contextId,
    contextTitle,
    removeFromUserQueue,
    removeFromContextQueue,
    clearUserQueue,
    clearAllUpcoming,
    reorderUserQueue,
    reorderContextQueue,
    playFromUserQueue,
    playFromContextQueue,
  } = usePlayerStore();

  const isSongLiked = useLibraryStore((s) => s.isSongLiked);
  const toggleLikeSong = useLibraryStore((s) => s.toggleLikeSong);

  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isQueueOpen) {
        setQueueOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isQueueOpen, setQueueOpen]);

  // Context remaining songs
  const upcomingContextSongs = queue.slice(currentIndex + 1);
  const totalUpcomingCount = userQueue.length + upcomingContextSongs.length;

  const getContextLabel = () => {
    if (contextTitle) return contextTitle;
    if (contextType === 'album') return 'Current Album';
    if (contextType === 'playlist') return 'Current Playlist';
    if (contextType === 'artist') return 'Artist Popular Tracks';
    if (contextType === 'search') return 'Search Results';
    return 'Context';
  };

  const getContextHref = () => {
    if (!contextId) return null;
    if (contextType === 'album') return `/album/${contextId}`;
    if (contextType === 'playlist') return `/playlist/${contextId}`;
    if (contextType === 'artist') return `/artist/${contextId}`;
    return null;
  };

  const contextHref = getContextHref();

  return (
    <>
      {/* Mobile backdrop */}
      {isQueueOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={() => setQueueOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Slide-over Queue Panel */}
      <aside
        ref={panelRef}
        className={`fixed md:absolute right-0 top-0 bottom-[calc(var(--player-height)+56px)] md:bottom-0 w-full sm:w-96 md:w-[400px] z-50 flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl border-l border-white/10 ${
          isQueueOpen
            ? 'translate-x-0 pointer-events-auto'
            : 'translate-x-full pointer-events-none'
        }`}
        style={{
          background: '#0E1528',
          color: '#E2E8F0',
        }}
        aria-label="Playback Queue"
      >
        {/* ── Top Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#121B33]">
          <div className="flex items-center gap-2.5">
            <ListMusic className="w-5 h-5 text-vibrant-saffron" />
            <div>
              <h2 className="text-base font-bold text-white leading-none">Play Queue</h2>
              <p className="text-xs text-slate-400 mt-1">
                {totalUpcomingCount === 0
                  ? 'No tracks up next'
                  : `${totalUpcomingCount} upcoming track${totalUpcomingCount === 1 ? '' : 's'}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {totalUpcomingCount > 0 && (
              <button
                type="button"
                onClick={clearAllUpcoming}
                className="p-1.5 rounded text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                title="Clear upcoming tracks"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setQueueOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close queue panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Scrollable Queue Content ────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 select-none scrollbar-thin">

          {/* 1. NOW PLAYING */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-2.5">
              Now Playing
            </h3>

            {currentSong ? (
              <div className="group relative flex items-center gap-3.5 p-3 rounded-xl bg-white/6 border border-white/10 hover:border-white/20 transition-all shadow-md">
                {/* Artwork with play/pause overlay */}
                <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-slate-800">
                  <ArtworkImage
                    src={artworkUrl(currentSong.album?.imageKey)}
                    alt={currentSong.album?.title || currentSong.title}
                    type="album"
                    id={currentSong.album?.id || currentSong.id}
                    size="sm"
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={togglePlay}
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="w-5 h-5 fill-white text-white" />
                    ) : (
                      <Play className="w-5 h-5 fill-white text-white ml-0.5" />
                    )}
                  </button>
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/song/${currentSong.id}`}
                      className="text-sm font-bold text-white truncate hover:underline hover:text-vibrant-saffron transition-colors"
                    >
                      {currentSong.title}
                    </Link>
                    {isPlaying && (
                      <div className="flex gap-0.5 items-end h-3 flex-shrink-0">
                        <span className="w-0.5 bg-crisp-green rounded-full eq-bar eq-bar-1" />
                        <span className="w-0.5 bg-crisp-green rounded-full eq-bar eq-bar-2" />
                        <span className="w-0.5 bg-crisp-green rounded-full eq-bar eq-bar-3" />
                      </div>
                    )}
                  </div>

                  {currentSong.album?.artist && (
                    <Link
                      href={`/artist/${currentSong.album.artist.id}`}
                      className="block text-xs text-slate-400 truncate mt-0.5 hover:underline hover:text-white transition-colors"
                    >
                      {currentSong.album.artist.name}
                    </Link>
                  )}

                  {currentSong.album?.title && (
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {currentSong.album.title}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleLikeSong(currentSong)}
                    className="p-1.5 rounded text-slate-400 hover:text-vibrant-saffron transition-colors cursor-pointer"
                    aria-label={isSongLiked(currentSong.id) ? 'Unlike' : 'Like'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        isSongLiked(currentSong.id)
                          ? 'fill-current text-vibrant-saffron'
                          : ''
                      }`}
                    />
                  </button>
                  <TrackOptionsMenu song={currentSong} />
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-white/5 border border-dashed border-white/10 text-center text-slate-400 text-xs">
                No track currently playing. Pick a song to start listening.
              </div>
            )}
          </div>

          {/* 2. NEXT IN QUEUE (User Queue) */}
          {userQueue.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-1 mb-2.5">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Next In Queue
                  </h3>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-vibrant-saffron/20 text-vibrant-saffron border border-vibrant-saffron/30">
                    Queued by you ({userQueue.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={clearUserQueue}
                  className="text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-1">
                {userQueue.map((song, index) => (
                  <QueueItemRow
                    key={`${song.id}-user-${index}`}
                    song={song}
                    index={index}
                    isUserQueue={true}
                    canMoveUp={index > 0}
                    canMoveDown={index < userQueue.length - 1}
                    onPlay={() => playFromUserQueue(index)}
                    onRemove={() => removeFromUserQueue(index)}
                    onMoveUp={() => reorderUserQueue(index, index - 1)}
                    onMoveDown={() => reorderUserQueue(index, index + 1)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 3. NEXT UP FROM CONTEXT */}
          {upcomingContextSongs.length > 0 && (
            <div>
              <div className="flex items-center justify-between px-1 mb-2.5">
                <div className="min-w-0">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Next Up From
                  </h3>
                  {contextHref ? (
                    <Link
                      href={contextHref}
                      className="text-xs font-semibold text-crisp-green hover:underline truncate block"
                    >
                      {getContextLabel()}
                    </Link>
                  ) : (
                    <span className="text-xs font-semibold text-slate-300 truncate block">
                      {getContextLabel()}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 flex-shrink-0">
                  {upcomingContextSongs.length} track{upcomingContextSongs.length === 1 ? '' : 's'}
                </span>
              </div>

              <div className="space-y-1">
                {upcomingContextSongs.map((song, offset) => {
                  const actualContextIndex = currentIndex + 1 + offset;
                  return (
                    <QueueItemRow
                      key={`${song.id}-ctx-${actualContextIndex}`}
                      song={song}
                      index={offset}
                      isUserQueue={false}
                      canMoveUp={offset > 0}
                      canMoveDown={offset < upcomingContextSongs.length - 1}
                      onPlay={() => playFromContextQueue(actualContextIndex)}
                      onRemove={() => removeFromContextQueue(actualContextIndex)}
                      onMoveUp={() => reorderContextQueue(actualContextIndex, actualContextIndex - 1)}
                      onMoveDown={() => reorderContextQueue(actualContextIndex, actualContextIndex + 1)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. EMPTY QUEUE STATE */}
          {totalUpcomingCount === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3">
                <Music2 className="w-7 h-7 text-vibrant-saffron/70" />
              </div>
              <h4 className="text-sm font-bold text-white">Your queue is empty</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
                Click <span className="text-slate-300 font-semibold">...</span> on any song to choose{' '}
                <span className="text-vibrant-saffron font-medium">Play Next</span> or{' '}
                <span className="text-crisp-green font-medium">Add to Queue</span>.
              </p>
            </div>
          )}

        </div>

        {/* ── Footer Info ────────────────────────────────────────────────────── */}
        <div className="px-5 py-3 border-t border-white/10 bg-[#121B33] flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <Disc className="w-3.5 h-3.5 text-vibrant-saffron" />
            <span>Sonicly Audio Queue</span>
          </div>
          <span>
            {totalUpcomingCount > 0 &&
              formatDuration(
                (userQueue.reduce((acc, s) => acc + (s.duration || 0), 0) +
                  upcomingContextSongs.reduce((acc, s) => acc + (s.duration || 0), 0))
              )}
          </span>
        </div>
      </aside>
    </>
  );
}

interface QueueItemRowProps {
  song: Song;
  index: number;
  isUserQueue: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onPlay: () => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

function QueueItemRow({
  song,
  index,
  isUserQueue,
  canMoveUp,
  canMoveDown,
  onPlay,
  onRemove,
  onMoveUp,
  onMoveDown,
}: QueueItemRowProps) {
  return (
    <div
      onClick={onPlay}
      className="group flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/8 transition-colors cursor-pointer border border-transparent hover:border-white/5"
    >
      {/* Reorder buttons */}
      <div
        className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          disabled={!canMoveUp}
          onClick={onMoveUp}
          aria-label="Move track up"
          className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
        >
          <ChevronUp className="w-3 h-3" />
        </button>
        <button
          type="button"
          disabled={!canMoveDown}
          onClick={onMoveDown}
          aria-label="Move track down"
          className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 transition-colors cursor-pointer"
        >
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Track Art & Play button */}
      <div className="relative w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-slate-800">
        <ArtworkImage
          src={artworkUrl(song.album?.imageKey)}
          alt={song.album?.title || song.title}
          type="album"
          id={song.album?.id || song.id}
          size="sm"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
        </div>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-slate-200 truncate group-hover:text-white transition-colors">
          {song.title}
        </p>
        <p className="text-[11px] text-slate-400 truncate mt-0.5">
          {song.album?.artist?.name || 'Unknown Artist'}
        </p>
      </div>

      {/* Duration */}
      <span className="text-[11px] text-slate-400 tabular-nums flex-shrink-0">
        {formatDuration(song.duration)}
      </span>

      {/* Quick remove button */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1 rounded text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 cursor-pointer"
        title="Remove from queue"
        aria-label="Remove from queue"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {/* Options menu */}
      <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <TrackOptionsMenu song={song} />
      </div>
    </div>
  );
}
