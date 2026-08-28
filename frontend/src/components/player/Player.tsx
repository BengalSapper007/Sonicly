'use client';
import { useCallback } from 'react';
import Link from 'next/link';
import { usePlayerStore } from '@/stores/player.store';
import { formatDuration } from '@/lib/utils';
import { artworkUrl } from '@/lib/api';
import { ArtworkImage } from '@/components/ui/ArtworkImage';

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
    <div className="h-20 flex items-center justify-between px-margin-desktop bg-vibrant-saffron border-t-2 border-prussian-blue shadow-lg pl-72 select-none">
      {/* ── Left: Now Playing ────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3.5 w-1/3 min-w-0">
        <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0 border-2 border-prussian-blue bg-white">
          <ArtworkImage
            src={albumArt}
            alt={currentSong.album?.title || currentSong.title}
            type="album"
            id={currentSong.album?.id || currentSong.id}
            size="sm"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/song/${currentSong.id}`}
            className="block font-label-md text-sm text-prussian-blue font-bold truncate hover:underline"
          >
            {currentSong.title}
          </Link>
          {currentSong.album?.artist && (
            <Link
              href={`/artist/${currentSong.album.artist.id}`}
              className="block font-caption text-xs text-prussian-blue/80 truncate hover:underline"
            >
              {currentSong.album.artist.name}
            </Link>
          )}
        </div>
        <button
          className="text-prussian-blue hover:scale-110 transition-transform p-1"
          aria-label={isLiked ? 'Unlike' : 'Like'}
        >
          <span
            className="material-symbols-outlined text-[20px]"
            style={isLiked ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            {isLiked ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>

      {/* ── Center: Controls & Scrubber ─────────────────────────────────────── */}
      <div className="flex flex-col items-center w-1/3">
        <div className="flex items-center gap-5 mb-1 text-prussian-blue">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`hover:scale-110 transition-transform ${shuffle ? 'text-midnight-blue font-bold scale-110' : 'text-prussian-blue/80'}`}
            title="Shuffle"
          >
            <span className="material-symbols-outlined text-[18px]">shuffle</span>
          </button>

          {/* Previous */}
          <button
            onClick={prev}
            className="hover:scale-110 transition-transform text-prussian-blue"
            title="Previous Track"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              skip_previous
            </span>
          </button>

          {/* Play / Pause */}
          <button
            onClick={togglePlay}
            className="text-white bg-prussian-blue rounded-full p-1.5 hover:scale-105 active:scale-95 transition-transform shadow-md"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {isPlaying ? 'pause' : 'play_arrow'}
            </span>
          </button>

          {/* Next */}
          <button
            onClick={next}
            className="hover:scale-110 transition-transform text-prussian-blue"
            title="Next Track"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              skip_next
            </span>
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`hover:scale-110 transition-transform ${repeat !== 'none' ? 'text-midnight-blue font-bold scale-110' : 'text-prussian-blue/80'}`}
            title="Repeat"
          >
            <span className="material-symbols-outlined text-[18px]">
              {repeat === 'one' ? 'repeat_one' : 'repeat'}
            </span>
          </button>
        </div>

        {/* Scrubber */}
        <div className="flex items-center gap-2 w-full max-w-md">
          <span className="font-caption text-[11px] text-prussian-blue font-semibold tabular-nums w-8 text-right">
            {formatDuration(currentTime)}
          </span>
          <div className="relative flex-1 h-1 bg-deep-saffron rounded-full overflow-hidden cursor-pointer group">
            <div
              className="h-full bg-prussian-blue absolute left-0 top-0 transition-all rounded-full"
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
              aria-label="Seek track position"
            />
          </div>
          <span className="font-caption text-[11px] text-prussian-blue font-semibold tabular-nums w-8">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* ── Right: Extra Controls & Volume ──────────────────────────────────── */}
      <div className="flex items-center justify-end gap-3 w-1/3 text-prussian-blue">
        <button
          className="hover:scale-105 active:scale-95 transition-transform p-1"
          title="Queue"
        >
          <span className="material-symbols-outlined text-[20px]">queue_music</span>
        </button>
        <button
          className="hover:scale-105 active:scale-95 transition-transform p-1"
          title="Devices"
        >
          <span className="material-symbols-outlined text-[20px]">devices</span>
        </button>

        {/* Volume Scrubber */}
        <div className="flex items-center gap-2 ml-1">
          <button
            onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
            className="text-prussian-blue hover:scale-110 transition-transform"
            title={volume === 0 ? 'Unmute' : 'Mute'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
            </span>
          </button>
          <div className="w-20 h-1 bg-deep-saffron rounded-full relative cursor-pointer group">
            <div
              className="h-full bg-prussian-blue absolute left-0 top-0 rounded-full"
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
              aria-label="Adjust volume"
            />
          </div>
        </div>

        <button
          className="hover:scale-105 active:scale-95 transition-transform p-1 ml-1"
          title="Lyrics"
        >
          <span className="material-symbols-outlined text-[20px]">subtitles</span>
        </button>
      </div>
    </div>
  );
}

function EmptyPlayer() {
  return (
    <div className="h-20 flex items-center justify-center px-margin-desktop bg-vibrant-saffron border-t-2 border-prussian-blue shadow-lg pl-72 select-none text-prussian-blue">
      <div className="flex items-center gap-3">
        <div className="flex items-end gap-1" style={{ height: '14px' }}>
          <div className="w-1 rounded-sm eq-bar-1 bg-prussian-blue" />
          <div className="w-1 rounded-sm eq-bar-2 bg-prussian-blue" />
          <div className="w-1 rounded-sm eq-bar-3 bg-prussian-blue" />
        </div>
        <span className="font-label-md text-xs font-bold text-prussian-blue">
          Select a track from the catalog to begin listening
        </span>
      </div>
    </div>
  );
}
