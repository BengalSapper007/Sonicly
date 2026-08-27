'use client';
import { Play, Heart, MoreHorizontal, Loader2 } from 'lucide-react';
import { usePlayerStore, type Song } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { cn, formatDuration } from '@/lib/utils';
import { artworkUrl } from '@/lib/api';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { useLike } from '@/hooks/useLike';

interface SongRowProps {
  song: Song;
  index?: number;
  queue?: Song[];
  contextType?: 'album' | 'playlist' | 'artist' | 'search' | null;
  contextId?: string;
  showAlbum?: boolean;
}

export function SongRow({
  song,
  index,
  queue,
  contextType,
  contextId,
  showAlbum = true,
}: SongRowProps) {
  const { currentSong, isPlaying, playSong, togglePlay } = usePlayerStore();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const isCurrent = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

  // Determine initial liked state from the song data (backend returns `likes: [...]` when userId is passed)
  const initialLiked = Array.isArray((song as any).likes) && (song as any).likes.length > 0;
  const { liked, isLoading: likeLoading, toggle: toggleLike } = useLike(song.id, initialLiked);

  const handlePlay = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, queue, contextType, contextId);
    }
  };

  return (
    <div
      className={cn(
        'group flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl transition-all cursor-pointer select-none',
        'hover:bg-white/5',
        isCurrent && 'bg-white/10'
      )}
      onClick={handlePlay}
    >
      {/* Index / Play button */}
      <div className="w-6 flex-shrink-0 flex items-center justify-center relative">
        {isCurrentlyPlaying ? (
          <div className="flex gap-0.5 items-end h-3.5">
            <span className="w-0.5 bg-purple-300 rounded-full eq-bar-1" />
            <span className="w-0.5 bg-purple-300 rounded-full eq-bar-2" />
            <span className="w-0.5 bg-purple-300 rounded-full eq-bar-3" />
          </div>
        ) : (
          <>
            <span
              className={cn(
                'text-xs tabular-nums transition-opacity group-hover:opacity-0',
                isCurrent ? 'text-purple-300 font-bold' : 'text-zinc-400 font-mono'
              )}
            >
              {index !== undefined ? index + 1 : ''}
            </span>
            <Play className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 transition-opacity text-white fill-current" />
          </>
        )}
      </div>

      {/* Album art */}
      {showAlbum && song.album && (
        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 shadow-sm bg-zinc-950">
          <ArtworkImage
            src={artworkUrl(song.album.imageKey)}
            alt={song.album.title || song.title}
            type="album"
            id={song.album.id || song.id}
            size="sm"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-semibold truncate transition-colors',
            isCurrent ? 'text-purple-300' : 'text-zinc-100 group-hover:text-white'
          )}
        >
          {song.title}
        </p>
        <p className="text-xs text-zinc-400 truncate mt-0.5">
          {song.album?.artist?.name}
          {showAlbum && song.album && (
            <span className="text-zinc-400"> · {song.album.title}</span>
          )}
        </p>
      </div>

      {/* Like button — only for authenticated users */}
      {isAuthenticated && (
        <button
          className={cn(
            'p-1.5 transition-all flex-shrink-0',
            liked
              ? 'opacity-100 text-rose-400 hover:text-rose-300'
              : 'opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-rose-400'
          )}
          onClick={toggleLike}
          aria-label={liked ? 'Unlike song' : 'Like song'}
          title={liked ? 'Unlike' : 'Like'}
        >
          {likeLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Heart className={cn('w-4 h-4', liked && 'fill-current')} />
          )}
        </button>
      )}

      {/* Duration */}
      <span className="text-xs text-zinc-400 tabular-nums font-mono w-10 text-right flex-shrink-0">
        {formatDuration(song.duration)}
      </span>

      {/* More */}
      <button
        className="p-1.5 text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
        aria-label="More options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
