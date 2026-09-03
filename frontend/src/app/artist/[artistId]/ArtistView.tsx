'use client';
import { useState, useEffect } from 'react';
import { Play, UserPlus, UserCheck, Check } from 'lucide-react';
import { artistsApi, artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { useLibraryStore } from '@/stores/library.store';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatNumber } from '@/lib/utils';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

interface ArtistViewProps {
  artistId: string;
  initialArtist: any | null;
}

export function ArtistView({ artistId, initialArtist }: ArtistViewProps) {
  const [artist, setArtist] = useState<any>(initialArtist);
  const [loading, setLoading] = useState(!initialArtist);
  const { playQueue } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();

  const isArtistFollowed = useLibraryStore((s) => s.isArtistFollowed);
  const toggleFollowArtist = useLibraryStore((s) => s.toggleFollowArtist);
  const registerArtist = useLibraryStore((s) => s.registerArtist);
  const loadingArtists = useLibraryStore((s) => s.loadingArtists);

  useEffect(() => {
    if (initialArtist?.isFollowing !== undefined) {
      registerArtist(artistId, initialArtist.isFollowing);
    }

    if (!initialArtist) {
      setLoading(true);
      artistsApi
        .get(artistId)
        .then((r) => {
          setArtist(r.data);
          if (r.data?.isFollowing !== undefined) {
            registerArtist(artistId, r.data.isFollowing);
          }
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [artistId, initialArtist, registerArtist]);

  if (loading) return <ArtistSkeleton />;
  if (!artist) return <div className="p-8 text-on-surface-muted">Artist not found.</div>;

  const topSongs = artist.popularSongs?.slice(0, 5) || [];
  const albums = artist.albums || [];
  const following = isArtistFollowed(artistId);
  const followLoading = !!loadingArtists[artistId];

  return (
    <div className="min-h-full pb-16">
      {/* ── Breadcrumbs ──────────────────────────────────────────────────── */}
      <div className="px-6 md:px-8 pt-4 pb-3 bg-surface-raised border-b border-border-light">
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: 'Artists', href: '/artists' },
            { label: artist.name },
          ]}
        />
      </div>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute inset-0">
          <ArtworkImage
            src={artworkUrl(artist.imageKey)}
            alt={artist.name}
            type="artist"
            id={artist.id}
            size="hero"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, #12192F 0%, rgba(12,22,38,0.55) 50%, rgba(12,22,38,0.1) 100%)',
          }}
        />

        {/* Verified Badge */}
        {artist.isVerified && (
          <div className="absolute top-6 left-8 flex items-center gap-1.5 bg-vibrant-saffron/20 backdrop-blur-md border border-vibrant-saffron/30 rounded-full px-3 py-1 text-white text-xs font-semibold">
            <Check className="w-3.5 h-3.5 text-vibrant-saffron" />
            <span>Verified Artist</span>
          </div>
        )}

        {/* Name */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
          <h1 className="font-bold text-4xl md:text-6xl text-white tracking-tight">
            {artist.name}
          </h1>
          {artist.monthlyListeners !== undefined && (
            <p className="text-sm text-on-primary-muted mt-1">
              {formatNumber(artist.monthlyListeners)} monthly listeners
            </p>
          )}
        </div>
      </div>

      {/* ── Actions ──────────────────────────────────────────────────────── */}
      <div className="px-8 py-5 flex items-center gap-4">
        {topSongs.length > 0 && (
          <button
            onClick={() => playQueue(topSongs, 0, 'artist', artistId)}
            className="btn-primary flex items-center gap-2 px-6 py-2.5"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Play</span>
          </button>
        )}
        <button
          onClick={() => toggleFollowArtist(artistId, artist.name)}
          disabled={followLoading}
          className={`btn-secondary flex items-center gap-2 px-5 py-2.5 text-sm cursor-pointer transition-all ${
            following
              ? 'border-vibrant-saffron text-vibrant-saffron bg-vibrant-saffron/10 hover:bg-vibrant-saffron/20'
              : 'hover:border-vibrant-saffron hover:text-vibrant-saffron'
          }`}
          aria-label={following ? 'Unfollow artist' : 'Follow artist'}
        >
          {following ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
          <span>{following ? 'Following' : 'Follow'}</span>
        </button>
      </div>

      {/* ── Top Songs ────────────────────────────────────────────────────── */}
      {topSongs.length > 0 && (
        <section className="px-8 mb-8">
          <h2 className="text-xl font-semibold text-on-surface mb-4 tracking-tight">
            Popular Tracks
          </h2>
          <div className="space-y-1">
            {topSongs.map((song: any, i: number) => (
              <SongRow
                key={song.id}
                song={song}
                index={i}
                queue={topSongs}
                contextType="artist"
                contextId={artistId}
                showAlbum={true}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Albums ───────────────────────────────────────────────────────── */}
      {albums.length > 0 && (
        <section className="px-8 mb-8">
          <h2 className="text-xl font-bold text-on-surface mb-4 tracking-tight">
            Discography
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {albums.map((album: any) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* ── Bio ──────────────────────────────────────────────────────────── */}
      {artist.bio && (
        <section className="px-8">
          <h2 className="text-xl font-bold text-on-surface mb-3 tracking-tight">
            About
          </h2>
          <p className="text-on-surface-muted text-sm leading-relaxed max-w-2xl bg-surface-raised p-5 rounded-2xl border border-border-light">
            {artist.bio}
          </p>
        </section>
      )}
    </div>
  );
}

function ArtistSkeleton() {
  return (
    <div className="animate-fade-in">
      <Skeleton className="h-72 rounded-none shimmer" />
      <div className="px-8 py-5 space-y-4">
        <Skeleton className="h-10 w-48 shimmer rounded-full" />
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 rounded-xl shimmer" />
        ))}
      </div>
    </div>
  );
}
