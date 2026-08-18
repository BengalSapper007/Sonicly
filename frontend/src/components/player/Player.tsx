'use client';
import { useCallback } from 'react';
import Link from 'next/link';
import {
  PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon,
  Repeat1Icon, RepeatIcon, ShuffleIcon, Volume2Icon,
  Volume1Icon, VolumeXIcon, HeartIcon,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/player.store';
import { cn } from '@/lib/utils';
import { formatDuration } from '@/lib/utils';

export function Player() {
  const {
    currentSong,
    isPlaying,
    progress,
    volume,
    currentTime,
    duration,
    shuffle,
    repeat,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
  } = usePlayerStore();

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => seek(Number(e.target.value) / 100),
    [seek]
  );

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setVolume(Number(e.target.value) / 100),
    [setVolume]
  );

  const VolumeIcon = volume === 0 ? VolumeXIcon : volume < 0.5 ? Volume1Icon : Volume2Icon;

  if (!currentSong) {
    return <EmptyPlayer />;
  }

  const isLiked = (currentSong.likes?.length ?? 0) > 0;

  return (
    <div className="h-full glass-dark player-glow flex items-center gap-4 px-5">
      {/* ── Track Info ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 w-64 min-w-0 flex-shrink-0">
        {/* Album Art */}
        <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-card">
          {currentSong.album?.imageUrl ? (
            <img
              src={currentSong.album.imageUrl}
              alt={currentSong.album.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <AlbumArtFallback />
          )}
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <Link
            href={`/song/${currentSong.id}`}
            className="block text-sm font-medium text-ink hover:text-sonic transition-colors line-clamp-1"
          >
            {currentSong.title}
          </Link>
          {currentSong.album?.artist && (
            <Link
              href={`/artist/${currentSong.album.artist.id}`}
              className="block text-xs text-ink-dim hover:text-ink transition-colors line-clamp-1 mt-0.5"
            >
              {currentSong.album.artist.name}
            </Link>
          )}
        </div>

        {/* Like */}
        <button
          className={cn(
            'p-1.5 rounded-full transition-all flex-shrink-0',
            isLiked ? 'text-sonic' : 'text-ink-ghost hover:text-ink'
          )}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <HeartIcon size={16} fill={isLiked ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* ── Controls ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-2xl mx-auto">
        {/* Buttons */}
        <div className="flex items-center gap-5">
          <button
            onClick={toggleShuffle}
            className={cn(
              'p-1.5 rounded-full transition-all',
              shuffle ? 'text-sonic' : 'text-ink-ghost hover:text-ink'
            )}
            aria-label="Shuffle"
          >
            <ShuffleIcon size={16} />
          </button>

          <button
            onClick={prev}
            className="p-1.5 text-ink-dim hover:text-ink transition-colors"
            aria-label="Previous"
          >
            <SkipBackIcon size={20} />
          </button>

          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-sonic hover:bg-sonic-light transition-all
              flex items-center justify-center shadow-sonic hover:shadow-glow-sm hover:scale-105"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <PauseIcon size={18} className="text-white" fill="currentColor" />
            ) : (
              <PlayIcon size={18} className="text-white ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            onClick={next}
            className="p-1.5 text-ink-dim hover:text-ink transition-colors"
            aria-label="Next"
          >
            <SkipForwardIcon size={20} />
          </button>

          <button
            onClick={toggleRepeat}
            className={cn(
              'p-1.5 rounded-full transition-all',
              repeat !== 'none' ? 'text-sonic' : 'text-ink-ghost hover:text-ink'
            )}
            aria-label="Repeat"
          >
            {repeat === 'one' ? <Repeat1Icon size={16} /> : <RepeatIcon size={16} />}
          </button>
        </div>

        {/* Progress */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs text-ink-ghost tabular-nums w-9 text-right">
            {formatDuration(currentTime)}
          </span>
          <div className="relative flex-1 h-1 group">
            <div className="absolute inset-0 rounded-full bg-rim" />
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-sonic transition-all"
              style={{ width: `${progress * 100}%` }}
            />
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={progress * 100}
              onChange={handleSeek}
              className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              aria-label="Seek"
            />
          </div>
          <span className="text-xs text-ink-ghost tabular-nums w-9">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* ── Volume ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 w-40 flex-shrink-0 justify-end">
        <button
          onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
          className="text-ink-ghost hover:text-ink transition-colors"
        >
          <VolumeIcon size={18} />
        </button>
        <div className="relative flex-1 h-1 group">
          <div className="absolute inset-0 rounded-full bg-rim" />
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-sonic"
            style={{ width: `${volume * 100}%` }}
          />
          <input
            type="range"
            min="0"
            max="100"
            step="1"
            value={volume * 100}
            onChange={handleVolume}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
}

function EmptyPlayer() {
  return (
    <div className="h-full glass-dark player-glow flex items-center justify-center gap-4 px-8">
      <div className="flex items-center gap-3 text-ink-ghost">
        <div className="w-2 h-2 rounded-full bg-sonic/40 animate-pulse" />
        <span className="text-sm">Choose something to play</span>
      </div>
    </div>
  );
}

function AlbumArtFallback() {
  return (
    <div className="w-full h-full bg-gradient-sonic flex items-center justify-center">
      <span className="text-white text-lg font-bold opacity-60">♪</span>
    </div>
  );
}
