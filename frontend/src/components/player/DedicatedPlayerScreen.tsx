'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ChevronDown,
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
  Mic2,
  BadgeCheck,
  ExternalLink,
  Music,
  UserPlus,
  UserCheck,
  Disc,
} from 'lucide-react';
import { usePlayerStore } from '@/stores/player.store';
import { useLibraryStore } from '@/stores/library.store';
import { artistsApi, artworkUrl } from '@/lib/api';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatDuration, formatNumber } from '@/lib/utils';

interface DedicatedPlayerScreenProps {
  mode?: 'overlay' | 'page';
  onClose?: () => void;
}

export function DedicatedPlayerScreen({
  mode = 'overlay',
  onClose,
}: DedicatedPlayerScreenProps) {
  const router = useRouter();
  const {
    currentSong,
    isPlaying,
    progress,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    userQueue,
    isQueueOpen,
    contextTitle,
    contextType,
    contextId,
    isNowPlayingOpen,
    closeNowPlaying,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    toggleQueue,
  } = usePlayerStore();

  const isSongLiked = useLibraryStore((s) => s.isSongLiked);
  const toggleLikeSong = useLibraryStore((s) => s.toggleLikeSong);
  const isArtistFollowed = useLibraryStore((s) => s.isArtistFollowed);
  const toggleFollowArtist = useLibraryStore((s) => s.toggleFollowArtist);
  const registerArtist = useLibraryStore((s) => s.registerArtist);
  const loadingArtists = useLibraryStore((s) => s.loadingArtists);

  const [artistData, setArtistData] = useState<any | null>(null);
  const [artistLoading, setArtistLoading] = useState(false);
  const [bioExpanded, setBioExpanded] = useState(false);

  const artistId = currentSong?.album?.artist?.id;
  const isLiked = currentSong ? isSongLiked(currentSong.id) : false;
  const isFollowing = artistId ? isArtistFollowed(artistId) : false;
  const followLoading = artistId ? !!loadingArtists[artistId] : false;

  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    } else if (mode === 'overlay') {
      closeNowPlaying();
    } else {
      router.back();
    }
  }, [closeNowPlaying, mode, onClose, router]);

  // Fetch full artist information (bio, listeners, verified status, image)
  useEffect(() => {
    if (!artistId) {
      setArtistData(null);
      return;
    }

    let isMounted = true;
    setArtistLoading(true);

    artistsApi
      .get(artistId)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data;
        setArtistData(data);
        if (data?.isFollowing !== undefined) {
          registerArtist(artistId, data.isFollowing);
        }
      })
      .catch((err) => {
        console.error('[DedicatedPlayerScreen] Failed to fetch artist data:', err);
      })
      .finally(() => {
        if (isMounted) setArtistLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [artistId, registerArtist]);

  // Keyboard controls when open
  useEffect(() => {
    if (mode === 'overlay' && !isNowPlayingOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'Escape') {
        handleClose();
      } else if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        prev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isNowPlayingOpen, mode, next, prev, togglePlay]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(Number(e.target.value) / 100);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(Number(e.target.value) / 100);
  };

  if (mode === 'overlay' && !isNowPlayingOpen) {
    return null;
  }

  const albumArt = currentSong ? artworkUrl(currentSong.album?.imageKey) : '';
  const artistName = currentSong?.album?.artist?.name || artistData?.name || 'Unknown Artist';
  const albumTitle = currentSong?.album?.title || 'Unknown Album';

  return (
    <div
      className={`${
        mode === 'overlay'
          ? 'fixed inset-0 z-[100] flex flex-col animate-fade-in'
          : 'relative w-full h-full flex flex-col'
      } overflow-hidden select-none`}
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1c274c 0%, #12192F 70%, #0c1122 100%)',
        color: '#FFFFFF',
      }}
    >
      {/* ── Ambient Background Glow ────────────────────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35">
        <div
          className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(226,114,10,0.28) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/3 -right-24 w-[500px] h-[500px] rounded-full blur-[130px]"
          style={{ background: 'radial-gradient(circle, rgba(15,107,69,0.22) 0%, transparent 70%)' }}
        />
      </div>

      {/* ── Top Header Navigation Bar ─────────────────────────────────────── */}
      <header className="relative z-10 flex items-center justify-between px-5 md:px-8 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleClose}
            className="p-2 -ml-2 rounded-full hover:bg-white/10 active:scale-95 transition-all text-white/80 hover:text-white cursor-pointer"
            aria-label="Collapse dedicated player"
            title="Collapse (Esc)"
          >
            <ChevronDown className="w-6 h-6" />
          </button>

          <div className="flex flex-col">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-on-primary-muted">
              {contextTitle
                ? `Playing from ${contextType ? contextType.toUpperCase() : 'CONTEXT'}`
                : 'Now Playing on Sonicly'}
            </span>
            {contextTitle && contextId && contextType ? (
              <Link
                href={`/${contextType}/${contextId}`}
                onClick={mode === 'overlay' ? handleClose : undefined}
                className="text-sm font-semibold text-white/90 hover:text-white truncate max-w-xs md:max-w-md hover:underline transition-colors"
              >
                {contextTitle}
              </Link>
            ) : contextTitle ? (
              <span className="text-sm font-semibold text-white/90 truncate max-w-xs md:max-w-md">
                {contextTitle}
              </span>
            ) : (
              <span className="text-sm font-semibold text-white/90">
                High-Fidelity Stream
              </span>
            )}
          </div>
        </div>

        {/* Right header actions */}
        <div className="flex items-center gap-2">
          {currentSong && (
            <button
              onClick={() => toggleLikeSong(currentSong)}
              className="p-2.5 rounded-full hover:bg-white/10 transition-all cursor-pointer"
              style={{ color: isLiked ? '#E2720A' : 'rgba(255,255,255,0.7)' }}
              aria-label={isLiked ? 'Unlike track' : 'Like track'}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current text-vibrant-saffron' : ''}`} />
            </button>
          )}

          <button
            onClick={toggleQueue}
            data-queue-toggle="true"
            className={`relative p-2.5 rounded-full transition-all cursor-pointer ${
              isQueueOpen
                ? 'text-vibrant-saffron bg-vibrant-saffron/20 ring-1 ring-vibrant-saffron/50'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
            aria-label="Queue"
            title="Queue"
          >
            <ListMusic className="w-5 h-5" />
            {userQueue.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-vibrant-saffron ring-2 ring-indigo-deep" />
            )}
          </button>
        </div>
      </header>

      {/* ── Main Content Area: 3-Panel Layout ─────────────────────────────── */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 md:px-8 py-6 lg:py-8">
        {!currentSong ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <Disc className="w-16 h-16 text-white/20 animate-spin mb-4" style={{ animationDuration: '8s' }} />
            <h2 className="text-xl font-bold text-white mb-2">No Track Playing</h2>
            <p className="text-sm text-on-primary-muted max-w-sm mb-6">
              Choose an album, playlist, or song from your library or search to begin listening.
            </p>
            <button
              onClick={handleClose}
              className="btn-primary"
            >
              Browse Catalog
            </button>
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

            {/* ════════════ PANEL 1: TRACK & ARTWORK & PLAYBACK (Cols 1-4) ════════════ */}
            <section className="lg:col-span-4 flex flex-col justify-between bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-7 shadow-2xl shadow-black/40">
              {/* Artwork Box */}
              <div>
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60 group">
                  <ArtworkImage
                    src={albumArt}
                    alt={albumTitle}
                    type="album"
                    id={currentSong.album?.id || currentSong.id}
                    size="lg"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Title & Artist & Album details */}
                <div className="mt-5 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white font-serif tracking-tight leading-tight line-clamp-2">
                      {currentSong.title}
                    </h1>

                    <div className="mt-1.5 flex items-center gap-2 text-sm text-on-primary-muted">
                      {artistId ? (
                        <Link
                          href={`/artist/${artistId}`}
                          onClick={mode === 'overlay' ? handleClose : undefined}
                          className="font-medium text-white/90 hover:text-vibrant-saffron hover:underline transition-colors truncate"
                        >
                          {artistName}
                        </Link>
                      ) : (
                        <span className="font-medium text-white/90 truncate">{artistName}</span>
                      )}
                      <span>•</span>
                      {currentSong.album?.id ? (
                        <Link
                          href={`/album/${currentSong.album.id}`}
                          onClick={mode === 'overlay' ? handleClose : undefined}
                          className="hover:underline truncate"
                        >
                          {albumTitle}
                        </Link>
                      ) : (
                        <span className="truncate">{albumTitle}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleLikeSong(currentSong)}
                    className="p-2 rounded-full hover:bg-white/10 transition-all flex-shrink-0 cursor-pointer mt-1"
                    style={{ color: isLiked ? '#E2720A' : 'rgba(255,255,255,0.5)' }}
                    aria-label={isLiked ? 'Unlike' : 'Like'}
                  >
                    <Heart className={`w-6 h-6 ${isLiked ? 'fill-current text-vibrant-saffron scale-110' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Playback Controls & Scrubber */}
              <div className="mt-6 pt-6 border-t border-white/10">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="relative h-2 w-full rounded-full bg-white/15 overflow-hidden group cursor-pointer">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-vibrant-saffron to-[#f59e0b] transition-all"
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
                  <div className="flex items-center justify-between text-xs tabular-nums text-white/60 font-medium px-0.5">
                    <span>{formatDuration(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                  </div>
                </div>

                {/* Center Buttons: Shuffle, Prev, Play/Pause, Next, Repeat */}
                <div className="mt-5 flex items-center justify-between px-2">
                  <button
                    onClick={toggleShuffle}
                    className="p-2 rounded-full hover:bg-white/10 transition-all relative cursor-pointer"
                    style={{ color: shuffle ? '#E2720A' : 'rgba(255,255,255,0.6)' }}
                    title={`Shuffle ${shuffle ? '• On' : '• Off'}`}
                  >
                    <Shuffle className="w-5 h-5" />
                    {shuffle && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibrant-saffron" />
                    )}
                  </button>

                  <button
                    onClick={prev}
                    className="p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    title="Previous Track"
                  >
                    <SkipBack className="w-6 h-6 fill-current" />
                  </button>

                  {/* Big Play / Pause Button */}
                  <button
                    onClick={togglePlay}
                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-vibrant-saffron to-deep-saffron text-white flex items-center justify-center shadow-lg shadow-vibrant-saffron/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 fill-current" />
                    ) : (
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    )}
                  </button>

                  <button
                    onClick={next}
                    className="p-2.5 rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
                    title="Next Track"
                  >
                    <SkipForward className="w-6 h-6 fill-current" />
                  </button>

                  <button
                    onClick={toggleRepeat}
                    className="p-2 rounded-full hover:bg-white/10 transition-all relative cursor-pointer"
                    style={{ color: repeat !== 'none' ? '#E2720A' : 'rgba(255,255,255,0.6)' }}
                    title={`Repeat • ${repeat === 'one' ? 'Repeat track' : repeat === 'all' ? 'Repeat all' : 'Off'}`}
                  >
                    {repeat === 'one' ? (
                      <Repeat1 className="w-5 h-5" />
                    ) : (
                      <Repeat className="w-5 h-5" />
                    )}
                    {repeat !== 'none' && (
                      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-vibrant-saffron" />
                    )}
                  </button>
                </div>

                {/* Volume Slider Bar */}
                <div className="mt-5 flex items-center gap-3 px-2">
                  <button
                    onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
                    className="text-white/60 hover:text-white transition-colors cursor-pointer"
                    title={volume === 0 ? 'Unmute' : 'Mute'}
                  >
                    {volume === 0 ? (
                      <VolumeX className="w-4 h-4" />
                    ) : volume < 0.5 ? (
                      <Volume1 className="w-4 h-4" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <div className="relative flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 bg-white/80 rounded-full"
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
                  <span className="text-[11px] tabular-nums text-white/50 w-7 text-right">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </section>

            {/* ════════════ PANEL 2: LYRICS PANEL (BLANK / PLACEHOLDER) (Cols 5-8) ════════════ */}
            <section className="lg:col-span-4 flex flex-col bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-7 shadow-2xl shadow-black/40 min-h-[420px] justify-between">
              {/* Lyrics Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-vibrant-saffron/15 text-vibrant-saffron">
                    <Mic2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">
                      Lyrics
                    </h2>
                    <p className="text-xs text-on-primary-muted">
                      Synchronized lyric stream
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 text-white/70 tracking-wide uppercase">
                  Preview
                </span>
              </div>

              {/* Blank / Placeholder Lyrics Display Area */}
              <div className="flex-1 my-6 flex flex-col justify-center items-center text-center px-4 py-8 rounded-2xl bg-black/20 border border-white/5 relative overflow-hidden">
                {/* Decorative background note glow */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
                  <Music className="w-48 h-48" />
                </div>

                <div className="relative z-10 max-w-sm flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-3">
                    <Mic2 className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-semibold text-white/90 mb-1.5">
                    Lyrics not available yet
                  </h3>
                  <p className="text-xs text-on-primary-muted leading-relaxed mb-6">
                    We're preparing synchronized, real-time lyrics for this track. When ready, lyrics will stream seamlessly in this dedicated panel.
                  </p>

                  {/* Stylized lyrical line placeholders indicating future karaoke lyrics */}
                  <div className="w-full space-y-2.5 opacity-30">
                    <div className="h-3.5 bg-gradient-to-r from-white/10 via-white/30 to-white/10 rounded-full w-4/5 mx-auto" />
                    <div className="h-4 bg-gradient-to-r from-vibrant-saffron/20 via-vibrant-saffron/40 to-vibrant-saffron/20 rounded-full w-3/5 mx-auto" />
                    <div className="h-3.5 bg-gradient-to-r from-white/10 via-white/20 to-white/10 rounded-full w-4/6 mx-auto" />
                  </div>
                </div>
              </div>

              {/* Lyrics Footer Info */}
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                <span>Audio synced with master stream</span>
                <span>Sonicly Acoustics</span>
              </div>
            </section>

            {/* ════════════ PANEL 3: ABOUT THE ARTIST (Cols 9-12) ════════════ */}
            <section className="lg:col-span-4 flex flex-col justify-between bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-7 shadow-2xl shadow-black/40 min-h-[420px]">
              <div>
                {/* Artist Panel Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    About the Artist
                  </h2>
                  {artistId && (
                    <Link
                      href={`/artist/${artistId}`}
                      onClick={mode === 'overlay' ? handleClose : undefined}
                      className="text-xs font-semibold text-vibrant-saffron hover:underline flex items-center gap-1"
                    >
                      <span>Profile</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  )}
                </div>

                {/* Artist Banner / Avatar Card */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden border border-white/10 group shadow-lg shadow-black/40">
                  <ArtworkImage
                    src={artworkUrl(artistData?.imageKey)}
                    alt={artistName}
                    type="artist"
                    id={artistId || currentSong.id}
                    size="hero"
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Floating Info on Banner */}
                  <div className="absolute bottom-3.5 left-4 right-4 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-lg font-bold text-white leading-tight">
                          {artistName}
                        </span>
                        {(artistData?.isVerified ?? true) && (
                          <span title="Verified Artist">
                            <BadgeCheck className="w-5 h-5 text-vibrant-saffron fill-vibrant-saffron/20" />
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/80 font-medium">
                        {artistLoading ? (
                          <span className="opacity-60">Loading stats...</span>
                        ) : (
                          `${formatNumber(artistData?.monthlyListeners ?? 42800)} monthly listeners`
                        )}
                      </p>
                    </div>

                    {artistId && (
                      <button
                        onClick={() => toggleFollowArtist(artistId)}
                        disabled={followLoading}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm ${
                          isFollowing
                            ? 'bg-white/20 text-white hover:bg-white/30 border border-white/30'
                            : 'bg-vibrant-saffron text-white hover:bg-deep-saffron'
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3.5 h-3.5" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Artist Biography Card */}
                <div className="mt-5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">
                    Biography
                  </h3>
                  <div className="bg-black/20 border border-white/5 rounded-2xl p-4">
                    {artistLoading ? (
                      <div className="space-y-2 py-2">
                        <div className="h-3 bg-white/10 rounded w-full animate-pulse" />
                        <div className="h-3 bg-white/10 rounded w-5/6 animate-pulse" />
                        <div className="h-3 bg-white/10 rounded w-4/6 animate-pulse" />
                      </div>
                    ) : artistData?.bio ? (
                      <div>
                        <p
                          className={`text-sm text-white/80 leading-relaxed ${
                            !bioExpanded ? 'line-clamp-4' : 'max-h-56 overflow-y-auto pr-1'
                          }`}
                        >
                          {artistData.bio}
                        </p>
                        {artistData.bio.length > 200 && (
                          <button
                            onClick={() => setBioExpanded(!bioExpanded)}
                            className="mt-2 text-xs font-semibold text-vibrant-saffron hover:underline cursor-pointer"
                          >
                            {bioExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-white/60 italic">
                        Biography for {artistName} is currently being curated. Check back soon.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom Card Action: Link to full artist discography */}
              {artistId && (
                <div className="mt-6 pt-4 border-t border-white/10">
                  <Link
                    href={`/artist/${artistId}`}
                    onClick={mode === 'overlay' ? handleClose : undefined}
                    className="w-full py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>View Full Discography & Tracks</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
