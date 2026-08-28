'use client';
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
        'group grid grid-cols-[auto_1fr_auto_auto] items-center gap-4 py-2.5 px-4 rounded border border-transparent transition-colors cursor-pointer select-none',
        'hover:bg-surface-container hover:border-prussian-blue/20',
        isCurrent ? 'bg-surface-container-high border-prussian-blue/30' : 'bg-surface'
      )}
      onClick={handlePlay}
    >
      {/* Index or Equalizer / Play button */}
      <div className="w-8 flex justify-center text-center">
        {isCurrentlyPlaying ? (
          <div className="flex items-end gap-0.5 h-3.5 text-crisp-green">
            <span className="w-0.5 bg-crisp-green rounded-full eq-bar-1" />
            <span className="w-0.5 bg-crisp-green rounded-full eq-bar-2" />
            <span className="w-0.5 bg-crisp-green rounded-full eq-bar-3" />
          </div>
        ) : (
          <>
            <span
              className={cn(
                'text-xs tabular-nums group-hover:hidden',
                isCurrent ? 'text-crisp-green font-bold' : 'text-on-surface-variant font-medium'
              )}
            >
              {index !== undefined ? index + 1 : ''}
            </span>
            <span className="material-symbols-outlined text-[20px] hidden group-hover:block text-prussian-blue" style={{ fontVariationSettings: "'FILL' 1" }}>
              play_arrow
            </span>
          </>
        )}
      </div>

      {/* Album artwork + Track info */}
      <div className="flex items-center gap-3 min-w-0">
        {showAlbum && song.album && (
          <div className="w-10 h-10 rounded-sm border border-outline-variant overflow-hidden flex-shrink-0 bg-surface-variant">
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
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              'font-label-md text-sm truncate font-bold',
              isCurrent ? 'text-crisp-green' : 'text-prussian-blue group-hover:text-midnight-blue'
            )}
          >
            {song.title}
          </p>
          <p className="font-caption text-xs text-on-surface-variant truncate">
            {song.album?.artist?.name || 'Various Artists'}
          </p>
        </div>
      </div>

      {/* Album title (hidden on small) */}
      <div className="hidden md:block w-36 font-body-md text-xs text-on-surface-variant truncate">
        {song.album?.title || '—'}
      </div>

      {/* Like & Duration */}
      <div className="flex items-center gap-3 justify-end">
        {isAuthenticated && (
          <button
            className={cn(
              'p-1 transition-all flex-shrink-0',
              liked
                ? 'opacity-100 text-crisp-green'
                : 'opacity-0 group-hover:opacity-100 text-outline hover:text-prussian-blue'
            )}
            onClick={(e) => {
              e.stopPropagation();
              toggleLike(e);
            }}
            title={liked ? 'Unlike' : 'Like'}
          >
            <span
              className="material-symbols-outlined text-[18px]"
              style={liked ? { fontVariationSettings: "'FILL' 1" } : {}}
            >
              {liked ? 'favorite' : 'favorite_border'}
            </span>
          </button>
        )}

        <span className="font-body-md text-xs text-prussian-blue font-medium tabular-nums w-12 text-right">
          {formatDuration(song.duration)}
        </span>
      </div>
    </div>
  );
}
