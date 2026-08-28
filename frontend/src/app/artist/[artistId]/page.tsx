'use client';
import { useEffect, useState, use } from 'react';
import { Play, UserPlus, UserCheck, Check } from 'lucide-react';
import { artistsApi, artworkUrl } from '@/lib/api';
import { usePlayerStore } from '@/stores/player.store';
import { useAuthStore } from '@/stores/auth.store';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';

export default function ArtistPage({ params }: { params: Promise<{ artistId: string }> }) {
  const { artistId } = use(params);
  const [artist, setArtist] = useState<any>(null);
  const [following, setFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { playQueue } = usePlayerStore();
  const { isAuthenticated, logout } = useAuthStore();

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
  if (!artist) return <div className="p-8 text-prussian-blue font-bold">Artist not found.</div>;

  const topSongs = artist.popularSongs?.slice(0, 5) || [];
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
    <div className="min-h-full pb-24 md:pb-32 bg-background text-on-surface">
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

      {/* ── Hero (Saffron full bleed) ─────────────────────────────────────────── */}
      <section className="bg-vibrant-saffron px-margin-desktop py-stack-xl flex flex-col md:flex-row items-end gap-8 border-b-2 border-prussian-blue">
        <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-prussian-blue bg-midnight-blue flex-shrink-0 shadow-lg">
          <ArtworkImage
            src={artworkUrl(artist.imageKey)}
            alt={artist.name}
            type="artist"
            id={artist.id}
            size="hero"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-prussian-blue">
          {artist.isVerified && (
            <span className="inline-block px-3 py-1 bg-prussian-blue text-white font-label-md text-xs rounded-full mb-3">
              Verified Artist
            </span>
          )}
          <h1 className="font-display-lg text-display-lg font-black mb-2">
            {artist.name}
          </h1>
          {artist.monthlyListeners !== undefined && (
            <p className="font-body-md text-sm font-semibold mb-6">
              {formatNumber(artist.monthlyListeners)} monthly listeners
            </p>
          )}

          <div className="flex items-center gap-4">
            {topSongs.length > 0 && (
              <button
                onClick={() => playQueue(topSongs, 0, 'artist', artistId)}
                className="bg-prussian-blue text-white w-14 h-14 rounded-full flex items-center justify-center hover:bg-midnight-blue transition-all shadow-lg active:scale-95 group"
                title="Play Artist"
              >
                <span
                  className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_arrow
                </span>
              </button>
            )}

            {isAuthenticated && (
              <button
                onClick={handleFollow}
                className="border-2 border-prussian-blue text-prussian-blue font-label-md text-sm py-2.5 px-6 rounded hover:bg-prussian-blue hover:text-white transition-colors font-bold"
              >
                {following ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Popular Tracks ───────────────────────────────────────────────────── */}
      {topSongs.length > 0 && (
        <section className="px-margin-desktop py-stack-md">
          <div className="mb-4 border-l-4 border-vibrant-saffron pl-3">
            <h2 className="font-headline-md text-headline-md font-bold text-prussian-blue">
              Popular Tracks
            </h2>
          </div>
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

      {/* ── Albums ───────────────────────────────────────────────────────────── */}
      {albums.length > 0 && (
        <section className="px-margin-desktop py-stack-md">
          <div className="mb-4 border-l-4 border-crisp-green pl-3">
            <h2 className="font-headline-md text-headline-md font-bold text-prussian-blue">
              Discography
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {albums.map((album: any) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}

      {/* ── Bio ──────────────────────────────────────────────────────────────── */}
      {artist.bio && (
        <section className="px-margin-desktop py-stack-md">
          <div className="mb-3 border-l-4 border-prussian-blue pl-3">
            <h2 className="font-headline-md text-headline-md font-bold text-prussian-blue">
              About
            </h2>
          </div>
          <p className="font-body-md text-sm text-on-surface-variant max-w-2xl bg-surface border-2 border-prussian-blue p-5 rounded hard-shadow shadow-prussian-blue leading-relaxed">
            {artist.bio}
          </p>
        </section>
      )}
    </div>
  );
}

function ArtistSkeleton() {
  return (
    <div className="min-h-full pb-32 animate-fade-in">
      <div className="bg-vibrant-saffron/40 px-margin-desktop py-stack-xl flex flex-col md:flex-row items-end gap-8 border-b-2 border-prussian-blue">
        <Skeleton className="w-48 h-48 rounded-full border-2 border-prussian-blue/20 shimmer" />
        <div className="flex-1 space-y-3">
          <Skeleton className="w-24 h-4 rounded shimmer" />
          <Skeleton className="w-80 h-10 rounded shimmer" />
          <Skeleton className="w-48 h-4 rounded shimmer" />
        </div>
      </div>
      <div className="px-margin-desktop py-stack-md space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded border border-prussian-blue/10 shimmer" />
        ))}
      </div>
    </div>
  );
}
