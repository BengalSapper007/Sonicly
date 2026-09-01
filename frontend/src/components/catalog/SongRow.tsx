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
        'group flex items-center gap-3.5 px-3 py-2.5 rounded transition-all cursor-pointer select-none border-b border-prussian-blue/10',
        'hover:bg-prussian-blue/6',
        isCurrent && 'bg-vibrant-saffron/10 border-l-4 border-l-crisp-green'
      )}
      onClick={handlePlay}
    >
      {/* Index / Equalizer / Play */}
      <div className="w-6 flex-shrink-0 flex items-center justify-center relative">
        {isCurrentlyPlaying ? (
          <div className="flex gap-0.5 items-end h-3.5">
            <span className="w-0.5 bg-crisp-green rounded-full eq-bar eq-bar-1" />
            <span className="w-0.5 bg-crisp-green rounded-full eq-bar eq-bar-2" />
            <span className="w-0.5 bg-crisp-green rounded-full eq-bar eq-bar-3" />
          </div>
        ) : (
          <>
            <span
              className={cn(
                'text-xs tabular-nums transition-opacity group-hover:opacity-0',
                isCurrent ? 'text-crisp-green font-bold' : 'text-on-surface-muted font-medium'
              )}
            >
              {index !== undefined ? index + 1 : ''}
            </span>
            <Play className="w-4 h-4 absolute opacity-0 group-hover:opacity-100 transition-opacity text-prussian-blue fill-current" />
          </>
        )}
      </div>

      {/* Album art */}
      {showAlbum && song.album && (
        <div className="w-10 h-10 rounded border border-prussian-blue/20 overflow-hidden flex-shrink-0 bg-[#F2EBDB]">
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
            'text-sm font-bold truncate transition-colors',
            isCurrent ? 'text-crisp-green' : 'text-prussian-blue group-hover:text-midnight-blue'
          )}
        >
          {song.title}
        </p>
        <p className="text-xs text-on-surface-muted truncate mt-0.5">
          {song.album?.artist?.name}
          {showAlbum && song.album && (
            <span>{song.album?.artist?.name ? ', ' : ''}{song.album.title}</span>
          )}
        </p>
      </div>

      {/* Like button */}
      {isAuthenticated && (
        <button
          className={cn(
            'p-1.5 transition-all flex-shrink-0',
            liked
              ? 'opacity-100 text-vibrant-saffron hover:text-deep-saffron'
              : 'opacity-0 group-hover:opacity-100 text-on-surface-muted hover:text-vibrant-saffron'
          )}
          onClick={(e) => { e.stopPropagation(); toggleLike(e as any); }}
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
      <span className="text-xs text-on-surface-muted tabular-nums w-10 text-right flex-shrink-0 font-medium">
        {formatDuration(song.duration)}
      </span>

      {/* More */}
      <button
        className="p-1.5 text-on-surface-muted hover:text-prussian-blue opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
        aria-label="More options"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
    </div>
  );
}
