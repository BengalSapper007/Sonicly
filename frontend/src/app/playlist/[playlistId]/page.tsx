'use client';
import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { playlistsApi, artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';

export default function PlaylistPage({ params }: { params: Promise<{ playlistId: string }> }) {
  const { playlistId } = use(params);
  const [playlist, setPlaylist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { playQueue, currentSong, isPlaying } = usePlayerStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    playlistsApi
      .get(playlistId)
      .then((r) => setPlaylist(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [playlistId]);

  if (loading) return <PlaylistSkeleton />;
  if (!playlist) {
    return (
      <div className="p-12 text-center text-prussian-blue font-bold">
        Playlist not found.
      </div>
    );
  }

  const songs = playlist.songs?.map((ps: any) => ps.song || ps).filter(Boolean) || [];
  const cover = playlist.coverUrl || artworkUrl(playlist.imageKey);

  return (
    <div className="min-h-full flex flex-col pb-24 md:pb-32 bg-background text-on-surface">
      {/* ── TopNavBar (Desktop) ──────────────────────────────────────────────── */}
      <header className="hidden md:flex justify-between items-center h-16 px-margin-desktop bg-prussian-blue sticky top-0 z-30 border-b-2 border-midnight-blue transition-all duration-200">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-headline-md text-headline-md font-black text-vibrant-saffron">
            Sonicly
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/search" className="font-label-md text-label-md text-on-primary-container hover:text-vibrant-saffron transition-colors">
              Podcasts
            </Link>
            <Link href="/search" className="font-label-md text-label-md text-on-primary-container hover:text-vibrant-saffron transition-colors">
              Audiobooks
            </Link>
            <Link href="/search" className="font-label-md text-label-md text-on-primary-container hover:text-vibrant-saffron transition-colors">
              Live
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-on-primary-container hover:text-vibrant-saffron transition-colors p-1" title="Settings">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button className="text-on-primary-container hover:text-vibrant-saffron transition-colors p-1" title="Notifications">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button
            onClick={() => logout()}
            className="font-label-md text-xs text-white hover:text-vibrant-saffron transition-colors border border-on-primary-container px-3 py-1 rounded"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Playlist Header (Saffron full bleed) ──────────────────────────────── */}
      <section className="bg-vibrant-saffron px-margin-desktop py-stack-xl flex flex-col md:flex-row items-end gap-8 border-b-2 border-prussian-blue">
        <div className="w-48 h-48 md:w-64 md:h-64 shrink-0 shadow-lg border-2 border-prussian-blue bg-white overflow-hidden">
          <ArtworkImage
            src={cover}
            alt={playlist.name}
            type="playlist"
            id={playlist.id}
            size="lg"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-prussian-blue">
          <p className="font-label-md text-label-md uppercase tracking-widest mb-2 font-bold">
            Playlist
          </p>
          <h1 className="font-display-lg text-display-lg font-black mb-3">
            {playlist.name}
          </h1>
          <p className="font-body-lg text-body-lg mb-6 opacity-90 max-w-2xl font-medium">
            {playlist.description || 'A curated music collection in high fidelity with spatial audio.'}
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() => playQueue(songs, 0, 'playlist', playlistId)}
              disabled={!songs.length}
              className="bg-prussian-blue text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-midnight-blue transition-all shadow-lg active:scale-95 group disabled:opacity-50"
              title="Play Playlist"
            >
              <span
                className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                play_arrow
              </span>
            </button>

            <button
              className="w-12 h-12 rounded-full border-2 border-prussian-blue flex items-center justify-center text-prussian-blue hover:bg-prussian-blue hover:text-white transition-colors"
              title="Favorite"
            >
              <span className="material-symbols-outlined text-[22px]">favorite_border</span>
            </button>

            <button
              className="w-12 h-12 rounded-full border-2 border-prussian-blue flex items-center justify-center text-prussian-blue hover:bg-prussian-blue hover:text-white transition-colors"
              title="More"
            >
              <span className="material-symbols-outlined text-[22px]">more_horiz</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Tracklist Area ────────────────────────────────────────────────────── */}
      <section className="px-margin-desktop py-stack-md bg-background flex-1">
        {/* List Header */}
        <div className="grid grid-cols-[auto_1fr_auto_auto] gap-4 py-2 border-b-2 border-prussian-blue mb-4 text-prussian-blue font-label-md text-label-md px-4">
          <div className="w-8 text-center">#</div>
          <div>Title</div>
          <div className="hidden md:block w-36">Album</div>
          <div className="w-16 text-right flex justify-end">
            <span className="material-symbols-outlined text-sm">schedule</span>
          </div>
        </div>

        {/* Tracks */}
        {songs.length === 0 ? (
          <div className="py-16 text-center text-outline">
            <span className="material-symbols-outlined text-5xl mb-2 text-outline">library_music</span>
            <p className="font-body-md">No songs in this playlist yet.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {songs.map((song: any, i: number) => (
              <SongRow
                key={song.id}
                song={song}
                index={i}
                queue={songs}
                contextType="playlist"
                contextId={playlistId}
                showAlbum={true}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function PlaylistSkeleton() {
  return (
    <div className="min-h-full pb-32 animate-fade-in">
      <div className="bg-vibrant-saffron/40 px-margin-desktop py-stack-xl flex flex-col md:flex-row items-end gap-8 border-b-2 border-prussian-blue">
        <Skeleton className="w-48 h-48 md:w-64 md:h-64 rounded border-2 border-prussian-blue/20 shimmer" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-24 h-4 rounded shimmer" />
          <Skeleton className="w-80 h-10 rounded shimmer" />
          <Skeleton className="w-full max-w-md h-4 rounded shimmer" />
        </div>
      </div>
      <div className="px-margin-desktop py-stack-md space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded border border-prussian-blue/10 shimmer" />
        ))}
      </div>
    </div>
  );
}
