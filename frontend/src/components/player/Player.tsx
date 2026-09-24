'use client';
import { useCallback, useEffect } from 'react';
import Link from 'next/link';
import { usePlayerStore } from '@/stores/player.store';
import { useLibraryStore } from '@/stores/library.store';
import { useDeviceStore } from '@/stores/device.store';
import { sendRemotePlayerCommand, transferPlaybackTo } from '@/hooks/useDeviceSocket';
import { DevicePickerPopover } from '@/components/player/DevicePickerPopover';
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
  Maximize2,
  MonitorSpeaker,
  Radio,
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
    userQueue,
    isQueueOpen,
    toggleQueue,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    openNowPlaying,
  } = usePlayerStore();

  const {
    myDeviceId,
    availableDevices,
    activeDeviceId,
    isDevicePickerOpen,
    toggleDevicePicker,
  } = useDeviceStore();

  const isPlayingLocally = !activeDeviceId || activeDeviceId === myDeviceId;
  const activeDevice = availableDevices.find((d) => d.deviceId === activeDeviceId);

  const handleTogglePlay = () => {
    if (!isPlayingLocally && activeDevice) {
      if (isPlaying) {
        sendRemotePlayerCommand('PAUSE', undefined, activeDeviceId);
        usePlayerStore.setState({ isPlaying: false });
      } else {
        sendRemotePlayerCommand('RESUME', undefined, activeDeviceId);
        usePlayerStore.setState({ isPlaying: true });
      }
    } else {
      togglePlay();
    }
  };

  const handleNext = () => {
    if (!isPlayingLocally && activeDevice) {
      sendRemotePlayerCommand('NEXT', undefined, activeDeviceId);
    } else {
      next();
    }
  };

  const handlePrev = () => {
    if (!isPlayingLocally && activeDevice) {
      sendRemotePlayerCommand('PREV', undefined, activeDeviceId);
    } else {
      prev();
    }
  };

  const isSongLiked = useLibraryStore((s) => s.isSongLiked);
  const getSongLikeCount = useLibraryStore((s) => s.getSongLikeCount);
  const toggleLikeSong = useLibraryStore((s) => s.toggleLikeSong);
  const registerSong = useLibraryStore((s) => s.registerSong);

  useEffect(() => {
    if (currentSong?.id) {
      const serverLiked = Array.isArray(currentSong.likes) && currentSong.likes.length > 0;
      registerSong(currentSong.id, serverLiked, currentSong._count?.likes);
    }
  }, [currentSong?.id, currentSong?._count?.likes, registerSong]);

  const isLiked = currentSong ? isSongLiked(currentSong.id) : false;
  const currentLikeCount = currentSong ? getSongLikeCount(currentSong.id, currentSong._count?.likes ?? 0) : 0;
  const albumArt = currentSong ? artworkUrl(currentSong.album?.imageKey) : '';

  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const p = Number(e.target.value) / 100;
      if (!isPlayingLocally && activeDevice) {
        sendRemotePlayerCommand('SEEK', { progress: p });
        usePlayerStore.setState({ progress: p, currentTime: p * duration });
      } else {
        seek(p);
      }
    },
    [seek, isPlayingLocally, activeDevice, duration]
  );

  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = Number(e.target.value) / 100;
      if (!isPlayingLocally && activeDevice) {
        sendRemotePlayerCommand('SET_VOLUME', { volume: vol });
        setVolume(vol);
      } else {
        setVolume(vol);
      }
    },
    [setVolume, isPlayingLocally, activeDevice]
  );

  if (!currentSong) {
    return <EmptyPlayer />;
  }

  return (
    <div
      className="h-full flex flex-col justify-center select-none relative"
      style={{ background: '#12192F' }}
    >
      {/* ── Remote Playback Banner (Spotify Style) ── */}
      {!isPlayingLocally && activeDevice && (
        <div className="absolute bottom-full left-0 right-0 z-30 bg-crisp-green text-black px-4 py-1.5 flex items-center justify-between text-xs font-semibold shadow-md select-none animate-in slide-in-from-bottom-2 duration-150">
          <div className="flex items-center gap-2 truncate">
            <MonitorSpeaker className="w-4 h-4 flex-shrink-0 text-black animate-pulse" />
            <span className="truncate">
              Listening on{' '}
              <button
                type="button"
                onClick={toggleDevicePicker}
                data-device-picker-toggle="true"
                className="font-bold underline cursor-pointer hover:opacity-80"
              >
                {activeDevice.deviceName}
              </button>
            </span>
          </div>
          <button
            type="button"
            onClick={() => transferPlaybackTo(myDeviceId)}
            className="ml-3 px-2.5 py-0.5 rounded bg-black/15 hover:bg-black/25 text-black text-[11px] font-bold transition-colors cursor-pointer flex-shrink-0"
          >
            Play here instead
          </button>
        </div>
      )}

      {/* ════════════ MOBILE LAYOUT (< md) ════════════ */}
      <div className="flex md:hidden flex-col w-full">

        {/* Row 1: art · info · controls (Shuffle · Repeat · Play/Pause · Connect · Queue on extreme right) */}
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Album Art - tap to expand */}
          <div
            onClick={openNowPlaying}
            className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 cursor-pointer active:scale-95 transition-transform"
            title="Expand player"
          >
            <ArtworkImage
              src={albumArt}
              alt={currentSong.album?.title || currentSong.title}
              type="album"
              id={currentSong.album?.id || currentSong.id}
              size="sm"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Track Info - tap to expand */}
          <div
            onClick={openNowPlaying}
            className="min-w-0 flex-1 pr-1 cursor-pointer active:opacity-80 transition-opacity"
            title="Open dedicated player screen"
          >
            <span className="block text-sm font-semibold text-white truncate leading-tight">
              {currentSong.title}
            </span>
            {currentSong.album?.artist && (
              <span className="block text-xs text-on-primary-muted truncate mt-0.5">
                {currentSong.album.artist.name}
              </span>
            )}
          </div>

          {/* Controls: Shuffle · Repeat · Play/Pause · Connect · Queue (extreme right) */}
          <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className="p-1.5 sm:p-2 rounded transition-all hover:scale-105 active:scale-95 relative cursor-pointer"
              style={{ color: shuffle ? '#E2720A' : 'rgba(154,166,194,0.7)' }}
              aria-label="Shuffle"
              title={`Shuffle ${shuffle ? '• On' : '• Off'}`}
            >
              <Shuffle className="w-4 h-4" />
              {shuffle && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibrant-saffron" />
              )}
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className="p-1.5 sm:p-2 rounded transition-all hover:scale-105 active:scale-95 relative cursor-pointer"
              style={{ color: repeat !== 'none' ? '#E2720A' : 'rgba(154,166,194,0.7)' }}
              aria-label="Repeat"
              title={`Repeat • ${repeat === 'one' ? 'Repeat track' : repeat === 'all' ? 'Repeat all' : 'Off'}`}
            >
              {repeat === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
              {repeat !== 'none' && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibrant-saffron" />
              )}
            </button>

            {/* Play / Pause */}
            <button
              onClick={handleTogglePlay}
              className="w-9 h-9 rounded-full bg-vibrant-saffron text-white flex items-center justify-center transition-all hover:bg-deep-saffron hover:scale-105 active:scale-95 shadow-sm mx-0.5 cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            {/* Connect to a device (Mobile) */}
            <button
              onClick={toggleDevicePicker}
              data-device-picker-toggle="true"
              className={`p-1.5 sm:p-2 rounded transition-all hover:scale-105 active:scale-95 cursor-pointer relative ${
                !isPlayingLocally && activeDevice
                  ? 'text-crisp-green'
                  : isDevicePickerOpen
                  ? 'text-white'
                  : 'text-on-primary-muted hover:text-white'
              }`}
              aria-label="Connect to a device"
              title={!isPlayingLocally && activeDevice ? `Listening on ${activeDevice.deviceName}` : 'Connect to a device'}
            >
              <div className="relative flex flex-col items-center justify-center">
                <MonitorSpeaker className="w-4 h-4" />
                {(!isPlayingLocally && activeDevice) && (
                  <span className="absolute -bottom-1 w-1 h-1 rounded-full bg-crisp-green shadow-[0_0_4px_#1db954]" />
                )}
              </div>
            </button>

            {/* Queue (extreme right) */}
            <button
              onClick={toggleQueue}
              data-queue-toggle="true"
              className={`relative p-1.5 sm:p-2 rounded transition-all hover:scale-105 active:scale-95 cursor-pointer ${
                isQueueOpen ? 'text-vibrant-saffron' : 'text-on-primary-muted hover:text-white'
              }`}
              aria-label="Queue"
              title="Queue"
            >
              <ListMusic className="w-4 h-4" />
              {userQueue.length > 0 && (
                <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-vibrant-saffron" />
              )}
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
          {/* Album Art - click to expand */}
          <div
            onClick={openNowPlaying}
            className="relative w-12 h-12 rounded-md overflow-hidden flex-shrink-0 cursor-pointer group"
            title="Open dedicated player screen"
          >
            <ArtworkImage
              src={albumArt}
              alt={currentSong.album?.title || currentSong.title}
              type="album"
              id={currentSong.album?.id || currentSong.id}
              size="sm"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <Maximize2 className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Track Info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-sm font-semibold text-white truncate" title={currentSong.title}>
                {currentSong.title}
              </span>
              {currentSong.isExplicit && (
                <span
                  className="text-[9px] font-bold px-1 py-0.2 rounded bg-neutral-600/80 text-white tracking-wider flex-shrink-0 uppercase leading-none"
                  title="Explicit Content"
                >
                  E
                </span>
              )}
            </div>
            {currentSong.album?.artist && (
              <div className="text-xs text-on-primary-muted truncate mt-0.5">
                <Link
                  href={`/artist/${currentSong.album.artist.id}`}
                  className="hover:underline hover:text-white transition-colors"
                >
                  {currentSong.album.artist.name}
                </Link>
                {(() => {
                  const coArtists = (currentSong.collaborations || []).filter(
                    (c: any) => c.status === 'ACCEPTED' && c.collaborator?.name
                  );
                  if (coArtists.length === 0) return null;
                  return (
                    <span className="text-white/80">
                      {', '}
                      {coArtists.map((c: any, i: number) => (
                        <Link
                          key={c.collaborator?.id || i}
                          href={`/artist/${c.collaborator?.id}`}
                          className="hover:underline hover:text-white"
                        >
                          {c.collaborator?.name}{i < coArtists.length - 1 ? ', ' : ''}
                        </Link>
                      ))}
                    </span>
                  );
                })()}
              </div>
            )}
            {!isPlayingLocally && activeDevice && (
              <span className="text-[11px] text-crisp-green flex items-center gap-1 mt-0.5 font-medium">
                <Radio className="w-2.5 h-2.5 animate-pulse" /> Playing on {activeDevice.deviceName}
              </span>
            )}
          </div>

          {/* Like */}
          <button
            onClick={() => currentSong && toggleLikeSong(currentSong)}
            className="p-2 rounded transition-all flex-shrink-0 hover:scale-110 active:scale-95 cursor-pointer flex items-center gap-1"
            style={{ color: isLiked ? '#E2720A' : 'rgba(154,166,194,0.6)' }}
            aria-label={isLiked ? 'Unlike track' : 'Like track'}
            title={isLiked ? 'Unlike (L)' : 'Like (L)'}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current text-[#E2720A]' : ''}`} />
          </button>
        </div>

        {/* Center controls */}
        <div className="flex-1 flex flex-col items-center gap-2 max-w-xl">
          {/* Buttons */}
          <div className="flex items-center gap-5">
            <button
              onClick={toggleShuffle}
              className="p-2 rounded transition-all hover:scale-105 relative cursor-pointer"
              style={{ color: shuffle ? '#E2720A' : 'rgba(154,166,194,0.65)' }}
              aria-label="Shuffle"
              title={`Shuffle (S) ${shuffle ? '• On' : '• Off'}`}
            >
              <Shuffle className="w-4 h-4" />
              {shuffle && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibrant-saffron" />
              )}
            </button>

            <button
              onClick={handlePrev}
              className="p-1.5 text-on-primary-muted hover:text-white transition-colors hover:scale-105 cursor-pointer"
              aria-label="Previous"
              title="Previous track (Shift+← or P)"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>

            {/* Play/Pause Button */}
            <div className="mx-2">
              <button
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-vibrant-saffron text-white flex items-center justify-center transition-all hover:bg-deep-saffron hover:scale-105 active:scale-95 shadow-md shadow-vibrant-saffron/20 cursor-pointer"
                aria-label={isPlaying ? 'Pause' : 'Play'}
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
            </div>

            <button
              onClick={handleNext}
              className="p-1.5 text-on-primary-muted hover:text-white transition-colors hover:scale-105 cursor-pointer"
              aria-label="Next"
              title="Next track (Shift+→ or N)"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>

            <button
              onClick={toggleRepeat}
              className="p-2 rounded transition-all hover:scale-105 relative cursor-pointer"
              style={{ color: repeat !== 'none' ? '#E2720A' : 'rgba(154,166,194,0.65)' }}
              aria-label="Repeat"
              title={`Repeat (R) • ${repeat === 'one' ? 'Repeat track' : repeat === 'all' ? 'Repeat all' : 'Off'}`}
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
        {/* Right side controls */}
        <div className="flex items-center justify-end gap-2.5 w-72 flex-shrink-0 relative">
          {/* Device Picker (Spotify Connect) */}
          <button
            onClick={toggleDevicePicker}
            data-device-picker-toggle="true"
            className={`relative p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
              !isPlayingLocally && activeDevice
                ? 'text-crisp-green bg-crisp-green/15 ring-1 ring-crisp-green/40 font-medium text-xs px-2.5 py-1'
                : isDevicePickerOpen
                ? 'text-white bg-white/10'
                : 'text-on-primary-muted hover:text-white hover:bg-white/5'
            }`}
            title={
              !isPlayingLocally && activeDevice
                ? `Listening on ${activeDevice.deviceName}`
                : 'Connect to a device'
            }
            aria-label="Connect to a device"
          >
            <div className="relative flex flex-col items-center justify-center">
              <MonitorSpeaker className="w-4 h-4" />
              {(!isPlayingLocally && activeDevice) && (
                <span className="absolute -bottom-1.5 w-1 h-1 rounded-full bg-crisp-green shadow-[0_0_4px_#1db954]" />
              )}
            </div>
            {!isPlayingLocally && activeDevice && (
              <span className="hidden xl:inline text-[11px] truncate max-w-[110px] font-semibold">
                {activeDevice.deviceName}
              </span>
            )}
          </button>

          <button
            onClick={toggleQueue}
            data-queue-toggle="true"
            className={`relative p-1.5 rounded-lg transition-all cursor-pointer ${
              isQueueOpen
                ? 'text-vibrant-saffron bg-vibrant-saffron/15 ring-1 ring-vibrant-saffron/40'
                : 'text-on-primary-muted hover:text-white hover:bg-white/5'
            }`}
            title={isQueueOpen ? 'Close queue (Q)' : 'Open queue (Q)'}
            aria-label="Queue"
          >
            <ListMusic className="w-4 h-4" />
            {userQueue.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[15px] h-[15px] px-1 rounded-full bg-vibrant-saffron text-white text-[9px] font-bold flex items-center justify-center leading-none shadow-sm">
                {userQueue.length > 9 ? '9+' : userQueue.length}
              </span>
            )}
          </button>

          {/* Dedicated player screen expand button */}
          <button
            onClick={openNowPlaying}
            className="p-1.5 rounded-lg text-on-primary-muted hover:text-white hover:bg-white/5 transition-all cursor-pointer"
            title="Dedicated player screen"
            aria-label="Dedicated player screen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 w-28">
            <button
              onClick={() => handleVolume({ target: { value: (volume === 0 ? 50 : 0).toString() } } as any)}
              className="text-on-primary-muted hover:text-white transition-colors flex-shrink-0 cursor-pointer"
              title={volume === 0 ? 'Unmute (M)' : 'Mute (M)'}
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
      <DevicePickerPopover />
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
