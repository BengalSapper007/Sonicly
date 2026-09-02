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
      className="h-full flex flex-col justify-center select-none"
      style={{ background: '#12192F' }}
    >
      {/* ════════════ MOBILE LAYOUT (< md) ════════════ */}
      <div className="flex md:hidden flex-col w-full">

        {/* Row 1: art · info · like · controls */}
        <div className="flex items-center gap-2.5 px-3 py-2">
          {/* Album Art */}
          <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0">
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
              className="block text-sm font-semibold text-white truncate hover:underline transition-colors leading-tight"
            >
              {currentSong.title}
            </Link>
            {currentSong.album?.artist && (
              <Link
                href={`/artist/${currentSong.album.artist.id}`}
                className="block text-xs text-on-primary-muted truncate mt-0.5 hover:underline hover:text-white transition-colors"
              >
                {currentSong.album.artist.name}
              </Link>
            )}
          </div>

          {/* Like */}
          <button
            className="p-1.5 rounded transition-all flex-shrink-0 hover:scale-110"
            style={{ color: isLiked ? '#E2720A' : 'rgba(154,166,194,0.6)' }}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>

          {/* Prev / Play / Next */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={prev}
              className="p-1.5 text-on-primary-muted hover:text-white transition-colors"
              aria-label="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={togglePlay}
              className="w-9 h-9 rounded-full bg-vibrant-saffron text-white flex items-center justify-center transition-all hover:bg-deep-saffron hover:scale-105"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={next}
              className="p-1.5 text-on-primary-muted hover:text-white transition-colors"
              aria-label="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
          </div>
        </div>

        {/* Row 2: slim progress bar flush to bottom edge */}
        <div className="relative h-1 w-full bg-white/15">
          <div
            className="absolute inset-y-0 left-0 bg-vibrant-saffron transition-all"
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
      </div>

      {/* ════════════ DESKTOP LAYOUT (md+) ════════════ */}
      <div className="hidden md:flex items-center px-6 gap-4 h-full">

        {/* Now Playing */}
        <div className="flex items-center gap-3.5 w-72 min-w-0 flex-shrink-0">
          {/* Album Art */}
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
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
              className="block text-sm font-semibold text-white truncate hover:underline transition-colors"
            >
              {currentSong.title}
            </Link>
            {currentSong.album?.artist && (
              <Link
                href={`/artist/${currentSong.album.artist.id}`}
                className="block text-xs text-on-primary-muted truncate mt-0.5 hover:underline hover:text-white transition-colors"
              >
                {currentSong.album.artist.name}
              </Link>
            )}
          </div>

          {/* Like */}
          <button
            className="p-2 rounded transition-all flex-shrink-0 hover:scale-110"
            style={{ color: isLiked ? '#E2720A' : 'rgba(154,166,194,0.6)' }}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Center controls */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-xl">
          {/* Buttons */}
          <div className="flex items-center gap-5">
            <button
              onClick={toggleShuffle}
              className="p-2 rounded transition-all hover:scale-105 relative"
              style={{ color: shuffle ? '#E2720A' : 'rgba(154,166,194,0.65)' }}
              aria-label="Shuffle"
            >
              <Shuffle className="w-4 h-4" />
              {shuffle && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibrant-saffron" />
              )}
            </button>

            <button
              onClick={prev}
              className="p-1.5 text-on-primary-muted hover:text-white transition-colors hover:scale-105"
              aria-label="Previous"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play/Pause with progress ring */}
            <div
              className="progress-ring"
              style={{ ['--progress' as any]: `${progress * 360}deg` }}
            >
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-vibrant-saffron text-white flex items-center justify-center transition-all hover:bg-deep-saffron hover:scale-105"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
            </div>

            <button
              onClick={next}
              className="p-1.5 text-on-primary-muted hover:text-white transition-colors hover:scale-105"
              aria-label="Next"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={toggleRepeat}
              className="p-2 rounded transition-all hover:scale-105 relative"
              style={{ color: repeat !== 'none' ? '#E2720A' : 'rgba(154,166,194,0.65)' }}
              aria-label="Repeat"
            >
              {repeat === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
              {repeat !== 'none' && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibrant-saffron" />
              )}
            </button>
          </div>

          {/* Progress bar */}
          <div className="w-full flex items-center gap-3">
            <span className="text-[11px] tabular-nums text-on-primary-muted w-9 text-right">
              {formatDuration(currentTime)}
            </span>
            <div className="relative flex-1 h-1.5 rounded-full overflow-hidden group cursor-pointer bg-white/15">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-vibrant-saffron transition-all"
                style={{ width: `${progress * 100}%` }}
              />
              <div
                className="absolute top-1/2 w-3 h-3 rounded-full bg-vibrant-saffron border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity"
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
            <span className="text-[11px] tabular-nums text-on-primary-muted w-9">
              {formatDuration(duration)}
            </span>
          </div>
        </div>

        {/* Volume & extras */}
        <div className="flex items-center justify-end gap-3 w-64 flex-shrink-0">
          <button
            className="p-1.5 text-on-primary-muted hover:text-white transition-colors"
            title="Queue"
          >
            <ListMusic className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 w-28">
            <button
              onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
              className="text-on-primary-muted hover:text-white transition-colors flex-shrink-0"
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
            <div className="relative flex-1 h-1.5 rounded-full overflow-hidden cursor-pointer bg-white/15">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-crisp-green transition-colors"
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
    </div>
  );
}

function EmptyPlayer() {
  return (
    <div
      className="h-full flex items-center justify-center select-none"
      style={{ background: '#12192F' }}
    >
      <div className="flex items-center gap-3 text-on-primary-muted">
        <div className="flex items-end gap-1" style={{ height: '14px' }}>
          <div className="w-0.5 rounded-sm eq-bar eq-bar-1" />
          <div className="w-0.5 rounded-sm eq-bar eq-bar-2" />
          <div className="w-0.5 rounded-sm eq-bar eq-bar-3" />
        </div>
        <span className="text-sm font-medium text-on-primary-muted">
          Choose a song to start listening
        </span>
      </div>
    </div>
  );
}
