'use client';
import { useCallback } from 'react';
import Link from 'next/link';
import { usePlayerStore } from '@/stores/player.store';
import { formatDuration } from '@/lib/utils';
import { artworkUrl } from '@/lib/api';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Repeat1,
  Volume2,
  Volume1,
  VolumeX,
  Heart,
  Mic2,
  ListMusic,
} from 'lucide-react';

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

  if (!currentSong) {
    return <EmptyPlayer />;
  }

  const isLiked = (currentSong.likes?.length ?? 0) > 0;
  const albumArt = artworkUrl(currentSong.album?.imageKey);

  return (
    <div
      className="h-full flex items-center justify-between px-6 gap-4 select-none"
      style={{
        background: 'rgba(25, 25, 29, 0.85)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* ── Now Playing ──────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3.5 w-72 min-w-0 flex-shrink-0">
        {/* Album Art */}
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
          <ArtworkImage
            src={albumArt}
            alt={currentSong.album?.title || currentSong.title}
            type="album"
            id={currentSong.album?.id || currentSong.id}
            size="sm"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Track Info */}
        <div className="min-w-0 flex-1">
          <Link
            href={`/song/${currentSong.id}`}
            className="block text-sm font-semibold text-zinc-100 truncate hover:underline hover:text-purple-300 transition-colors"
          >
            {currentSong.title}
          </Link>
          {currentSong.album?.artist && (
            <Link
              href={`/artist/${currentSong.album.artist.id}`}
              className="block text-xs text-zinc-400 truncate mt-0.5 hover:underline hover:text-zinc-200 transition-colors"
            >
              {currentSong.album.artist.name}
            </Link>
          )}
        </div>

        {/* Like */}
        <button
          className="p-2 rounded-full transition-all flex-shrink-0 hover:scale-110"
          style={{ color: isLiked ? '#ffb0cd' : '#9ca3af' }}
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* ── Controls (center) ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center gap-2 max-w-xl">
        {/* Control Buttons */}
        <div className="flex items-center gap-5">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className="p-2 rounded-full relative transition-all hover:scale-105"
            style={{ color: shuffle ? '#d0bcff' : '#9ca3af' }}
            aria-label="Shuffle"
          >
            <Shuffle className="w-4 h-4" />
            {shuffle && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400" />
            )}
          </button>

          {/* Previous */}
          <button
            onClick={prev}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors hover:scale-105"
            aria-label="Previous"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white text-zinc-950 shadow-lg hover:scale-105"
            style={{
              boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)',
            }}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={next}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors hover:scale-105"
            aria-label="Next"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className="p-2 rounded-full relative transition-all hover:scale-105"
            style={{ color: repeat !== 'none' ? '#d0bcff' : '#9ca3af' }}
            aria-label="Repeat"
          >
            {repeat === 'one' ? (
              <Repeat1 className="w-4 h-4" />
            ) : (
              <Repeat className="w-4 h-4" />
            )}
            {repeat !== 'none' && (
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-purple-400" />
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-3">
          <span className="text-xs tabular-nums text-zinc-400 w-9 text-right font-mono">
            {formatDuration(currentTime)}
          </span>
          <div className="relative flex-1 h-1.5 rounded-full overflow-hidden group cursor-pointer bg-white/10">
            {/* Fill */}
            <div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{
                width: `${progress * 100}%`,
                background: 'linear-gradient(90deg, #d0bcff, #ffb0cd)',
              }}
            />
            {/* Playhead */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
              style={{
                left: `${progress * 100}%`,
                transform: 'translateY(-50%) translateX(-50%)',
              }}
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
          <span className="text-xs tabular-nums text-zinc-400 w-9 font-mono">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* ── Volume & Extra ────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 w-64 flex-shrink-0">
        <button className="p-1.5 text-zinc-400 hover:text-white transition-colors" title="Lyrics">
          <Mic2 className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-zinc-400 hover:text-white transition-colors" title="Queue">
          <ListMusic className="w-4 h-4" />
        </button>

        {/* Volume */}
        <div className="flex items-center gap-2 w-28">
          <button
            onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            className="text-zinc-400 hover:text-white transition-colors flex-shrink-0"
            title="Mute/Unmute"
          >
            {volume === 0 ? (
              <VolumeX className="w-4 h-4" />
            ) : volume < 0.5 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>
          <div className="relative flex-1 h-1.5 rounded-full overflow-hidden group cursor-pointer bg-white/10">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-zinc-300 group-hover:bg-purple-300 transition-colors"
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
    </div>
  );
}

function EmptyPlayer() {
  return (
    <div
      className="h-full flex items-center justify-center select-none"
      style={{
        background: 'rgba(25, 25, 29, 0.85)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      <div className="flex items-center gap-3 text-zinc-400">
        {/* Animated equalizer dots */}
        <div className="flex items-end gap-1" style={{ height: '14px' }}>
          <div className="w-0.5 rounded-sm eq-bar-1" style={{ background: '#d0bcff', opacity: 0.6 }} />
          <div className="w-0.5 rounded-sm eq-bar-2" style={{ background: '#d0bcff', opacity: 0.6 }} />
          <div className="w-0.5 rounded-sm eq-bar-3" style={{ background: '#d0bcff', opacity: 0.6 }} />
        </div>
        <span className="text-sm font-medium text-zinc-400">
          Choose a song to start listening
        </span>
      </div>
    </div>
  );
}
