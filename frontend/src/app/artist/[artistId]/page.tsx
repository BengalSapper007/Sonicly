'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { PlayIcon, UserPlusIcon, UserCheckIcon } from 'lucide-react';
import { artistsApi } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatNumber } from '@/lib/utils';

export default function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = use(params);
  const [artist, setArtist] = useState<any>(null);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { playQueue } = usePlayerStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    artistsApi.get(artistId)
      .then(r => {
        setArtist(r.data);
        setFollowing(r.data.isFollowing || false);
      })
      .finally(() => setLoading(false));
  }, [artistId]);

  if (loading) return <ArtistSkeleton />;
  if (!artist) return <div className="p-8 text-ink-dim">Artist not found.</div>;

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
    <div className="min-h-full pb-8">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="relative h-64 overflow-hidden">
        {artist.imageUrl ? (
          <img src={artist.imageUrl} alt={artist.name} className="w-full h-full object-cover object-top" />
        ) : (
          <div className="w-full h-full bg-gradient-sonic" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-void via-void/60 to-transparent" />

        {/* Verified */}
        {artist.isVerified && (
          <div className="absolute top-6 left-8 flex items-center gap-1.5 bg-sonic/20 backdrop-blur-sm
            border border-sonic/30 rounded-full px-3 py-1">
            <span className="text-sonic text-xs">✓</span>
            <span className="text-xs font-medium text-sonic">Verified Artist</span>
          </div>
        )}

        {/* Name */}
        <div className="absolute bottom-0 left-0 right-0 px-8 pb-6">
          <h1 className="font-display font-bold text-5xl text-white drop-shadow-lg">{artist.name}</h1>
          {artist.monthlyListeners && (
            <p className="text-sm text-white/70 mt-1">
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
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-sonic hover:bg-sonic-light
              text-white font-semibold text-sm transition-all shadow-sonic hover:scale-105"
          >
            <PlayIcon size={18} fill="currentColor" />
            Play
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={handleFollow}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
              following
                ? 'border-sonic text-sonic hover:border-rim hover:text-ink-dim'
                : 'border-rim text-ink-dim hover:border-muted hover:text-ink'
            }`}
          >
            {following ? <UserCheckIcon size={16} /> : <UserPlusIcon size={16} />}
            {following ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {/* ── Top Songs ────────────────────────────────────────────────────── */}
      {topSongs.length > 0 && (
        <section className="px-8 mb-8">
          <h2 className="font-display font-semibold text-lg text-ink mb-4">Popular</h2>
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
          <h2 className="font-display font-semibold text-lg text-ink mb-4">Discography</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {albums.map((album: any) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* ── Bio ──────────────────────────────────────────────────────────── */}
      {artist.bio && (
        <section className="px-8">
          <h2 className="font-display font-semibold text-lg text-ink mb-3">About</h2>
          <p className="text-ink-dim text-sm leading-relaxed max-w-2xl">{artist.bio}</p>
        </section>
      )}
    </div>
  );
}

function ArtistSkeleton() {
  return (
    <div className="animate-fade-in">
      <Skeleton className="h-64 rounded-none" />
      <div className="px-8 py-5 space-y-4">
        <Skeleton className="h-10 w-48" />
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
      </div>
    </div>
  );
}
