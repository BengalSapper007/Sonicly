'use client';
import { PlayIcon, PauseIcon, HeartIcon, EllipsisIcon } from 'lucide-react';
import Link from 'next/link';
import { usePlayerStore, type Song } from '@/stores/player.store';
import { cn, formatDuration } from '@/lib/utils';

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

  const isCurrent = currentSong?.id === song.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;

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
        'group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer',
        'hover:bg-elevated',
        isCurrent && 'bg-elevated/60'
      )}
      onClick={handlePlay}
    >
      {/* Index / Play button */}
      <div className="w-7 flex-shrink-0 flex items-center justify-center">
        {isCurrentlyPlaying ? (
          <div className="flex gap-0.5 items-end h-4">
            <span className="eq-bar" />
            <span className="eq-bar" />
            <span className="eq-bar" />
          </div>
        ) : (
          <>
            <span className={cn(
              'text-xs tabular-nums transition-opacity group-hover:opacity-0',
              isCurrent ? 'text-sonic' : 'text-ink-ghost'
            )}>
              {index !== undefined ? index + 1 : ''}
            </span>
            <PlayIcon
              size={14}
              className="absolute opacity-0 group-hover:opacity-100 transition-opacity text-ink"
              fill="currentColor"
            />
          </>
        )}
      </div>

      {/* Album art (small) */}
      {!index && showAlbum && (
        <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
          {song.album?.imageUrl ? (
            <img src={song.album.imageUrl} alt={song.album.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-sonic" />
          )}
        </div>
      )}

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          'text-sm font-medium line-clamp-1 transition-colors',
          isCurrent ? 'text-sonic' : 'text-ink'
        )}>
          {song.title}
        </p>
        <p className="text-xs text-ink-dim line-clamp-1">
          {song.album?.artist?.name}
          {showAlbum && song.album && (
            <span className="text-ink-ghost"> · {song.album.title}</span>
          )}
        </p>
      </div>

      {/* Like */}
      <button
        className="p-1.5 text-ink-ghost hover:text-sonic opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        onClick={(e) => { e.stopPropagation(); /* like logic */ }}
        aria-label="Like song"
      >
        <HeartIcon size={15} />
      </button>

      {/* Duration */}
      <span className="text-xs text-ink-ghost tabular-nums w-10 text-right flex-shrink-0">
        {formatDuration(song.duration)}
      </span>

      {/* More */}
      <button
        className="p-1.5 text-ink-ghost hover:text-ink opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
        aria-label="More options"
      >
        <EllipsisIcon size={15} />
      </button>
    </div>
  );
}
