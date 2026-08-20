'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { Play, UserPlus, UserCheck, Check } from 'lucide-react';
import { artistsApi, artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatNumber } from '@/lib/utils';

export default function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = use(params);
  const [artist, setArtist] = useState<any>(null);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { playQueue } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    artistsApi
      .get(artistId)
      .then((r) => {
        setArtist(r.data);
        setFollowing(r.data.isFollowing || false);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [artistId]);

  if (loading) return <ArtistSkeleton />;
  if (!artist) return <div className="p-8 text-zinc-400">Artist not found.</div>;

  const topSongs = artist.songs?.slice(0, 5) || [];
  const albums = artist.albums || [];

  const handleFollow = async () => {
    if (!isAuthenticated) return;
    if (following) {
      await artistsApi.unfollow(artistId);
    } else {
      await artistsApi.follow(artistId);
    }
    setFollowing(!following);
  };

  return (
    <div className="min-h-full pb-16">
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
              'linear-gradient(to top, #131316 0%, rgba(19,19,22,0.6) 50%, rgba(19,19,22,0.2) 100%)',
          }}
        />

        {/* Verified Badge */}
        {artist.isVerified && (
          <div className="absolute top-6 left-8 flex items-center gap-1.5 bg-purple-500/20 backdrop-blur-md border border-purple-400/30 rounded-full px-3 py-1 text-purple-300 text-xs font-semibold shadow-md">
            <Check className="w-3.5 h-3.5 text-purple-300" />
            <span>Verified Artist</span>
          </div>
        )}

        {/* Name */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
          <h1
            className="font-black text-4xl md:text-6xl text-white tracking-tight drop-shadow-lg"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {artist.name}
          </h1>
          {artist.monthlyListeners !== undefined && (
            <p className="text-sm text-zinc-300 mt-1 font-medium">
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
            className="btn-primary flex items-center gap-2 px-6 py-2.5 font-bold shadow-lg"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Play</span>
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={handleFollow}
            className={`btn-glass flex items-center gap-2 px-5 py-2.5 text-sm font-semibold ${
              following ? 'border-purple-400/50 text-purple-300 bg-purple-500/10' : ''
            }`}
          >
            {following ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{following ? 'Following' : 'Follow'}</span>
          </button>
        )}
      </div>

      {/* ── Top Songs ────────────────────────────────────────────────────── */}
      {topSongs.length > 0 && (
        <section className="px-8 mb-8">
          <h2
            className="text-xl font-bold text-zinc-100 mb-4 tracking-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
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
          <h2
            className="text-xl font-bold text-zinc-100 mb-4 tracking-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
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
          <h2
            className="text-xl font-bold text-zinc-100 mb-3 tracking-tight"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            About
          </h2>
          <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl bg-zinc-900/40 p-5 rounded-2xl border border-white/5">
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
