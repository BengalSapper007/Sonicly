'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlayIcon, TrendingUpIcon, SparklesIcon } from 'lucide-react';
import { albumsApi, playlistsApi, artistsApi } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { SongRow } from '@/components/catalog/SongRow';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { ArtistCard } from '@/components/catalog/ArtistCard';
import { PlaylistCard } from '@/components/catalog/PlaylistCard';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';

export default function HomePage() {
  const { user } = useAuthStore();
  const [albums, setAlbums] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      albumsApi.list(),
      playlistsApi.curated(),
      artistsApi.list(),
    ]).then(([albumsRes, playlistsRes, artistsRes]) => {
      setAlbums(albumsRes.data.slice(0, 12));
      setPlaylists(playlistsRes.data.slice(0, 8));
      setArtists(artistsRes.data.slice(0, 10));
    }).finally(() => setLoading(false));
  }, []);

  const greeting = getGreeting();

  return (
    <div className="min-h-full pb-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden px-8 pt-10 pb-8">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-glow opacity-60 pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-purple/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative">
          <p className="text-sm font-medium text-sonic mb-1 animate-fade-in">
            {user ? `Welcome back, ${user.displayName}` : 'Welcome to Sonicly'}
          </p>
          <h1 className="font-display text-4xl font-bold text-ink mb-3 animate-slide-up">
            {greeting}
          </h1>
          <p className="text-ink-dim max-w-lg animate-slide-up" style={{ animationDelay: '0.05s' }}>
            Discover music that moves you. Curated collections, new releases, and your personal soundtrack — all in one place.
          </p>
        </div>
      </div>

      {/* ── Featured Playlists ───────────────────────────────────────────── */}
      <Section
        title="Curated Playlists"
        icon={<SparklesIcon size={16} className="text-sonic" />}
        href="/playlists"
        loading={loading}
      >
        {loading ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-44 h-44 rounded-2xl flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {playlists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        )}
      </Section>

      {/* ── New Albums ───────────────────────────────────────────────────── */}
      <Section
        title="New Releases"
        icon={<TrendingUpIcon size={16} className="text-neon-orange" />}
        href="/albums"
        loading={loading}
      >
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.slice(0, 6).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </Section>

      {/* ── Artists ──────────────────────────────────────────────────────── */}
      <Section
        title="Artists"
        href="/artists"
        loading={loading}
      >
        {loading ? (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-32 h-40 rounded-xl flex-shrink-0" />
            ))}
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        )}
      </Section>

      {/* ── More Albums ──────────────────────────────────────────────────── */}
      <Section title="Browse Albums" href="/albums">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {albums.slice(6, 12).map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning.';
  if (h < 17) return 'Good afternoon.';
  if (h < 21) return 'Good evening.';
  return 'Good night.';
}
