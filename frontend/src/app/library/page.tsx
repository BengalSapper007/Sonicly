'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi, artworkUrl } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import Link from 'next/link';

type FilterTab = 'Playlists' | 'Artists' | 'Albums' | 'Podcasts & Shows';

export default function LibraryPage() {
  const { isAuthenticated, isLoading, logout } = useAuthStore();
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<any[]>([]);
  const [followedArtists, setFollowedArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('Playlists');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      Promise.all([
        libraryApi.likedSongs(),
        libraryApi.savedAlbums(),
        libraryApi.followedArtists(),
      ])
        .then(([songs, albums, artists]) => {
          setLikedSongs(songs.data || []);
          setSavedAlbums(albums.data || []);
          setFollowedArtists(artists.data || []);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated && !isLoading) return null;

  const TABS: FilterTab[] = ['Playlists', 'Artists', 'Albums', 'Podcasts & Shows'];

  return (
    <div className="min-h-full pb-24 md:pb-32 bg-background text-on-background">
      {/* ── TopNavBar (Desktop) ──────────────────────────────────────────────── */}
      <header className="hidden md:flex bg-prussian-blue w-full h-16 px-margin-desktop justify-between items-center z-30 sticky top-0 border-b-2 border-midnight-blue">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-headline-md text-headline-md font-black text-vibrant-saffron">
            Sonicly
          </Link>
        </div>
        <nav className="flex items-center gap-8 font-label-md text-label-md">
          <Link href="/search" className="text-on-primary-container hover:text-vibrant-saffron transition-colors">
            Podcasts
          </Link>
          <Link href="/search" className="text-on-primary-container hover:text-vibrant-saffron transition-colors">
            Audiobooks
          </Link>
          <Link href="/search" className="text-on-primary-container hover:text-vibrant-saffron transition-colors">
            Live
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-vibrant-saffron">
          <button className="hover:text-white transition-colors p-1" title="Notifications">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <button className="hover:text-white transition-colors p-1" title="Settings">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button
            onClick={() => logout()}
            className="font-label-md text-xs border-2 border-vibrant-saffron px-3 py-1 hover:bg-vibrant-saffron hover:text-prussian-blue transition-colors font-bold"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* ── Canvas ──────────────────────────────────────────────────────────── */}
      <div className="px-margin-mobile md:px-margin-desktop py-stack-lg flex-1">
        {/* Header Section */}
        <div className="mb-stack-lg border-l-8 border-vibrant-saffron pl-4">
          <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-prussian-blue">
            Your Library
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-stack-lg border-b-2 border-surface-variant pb-2 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`font-label-md text-label-md pb-2 border-b-4 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-vibrant-saffron text-prussian-blue font-bold'
                    : 'border-transparent text-outline hover:text-prussian-blue'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* ── Bento Grid Library Layout ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-stack-xl">
          {/* Liked Songs Special Card (2 cols on md+) */}
          <Link
            href="/library/liked"
            className="col-span-1 md:col-span-2 bg-crisp-green text-white p-6 relative overflow-hidden group border-2 border-prussian-blue hard-shadow shadow-prussian-blue h-64 flex flex-col justify-end hover:-translate-y-1 transition-transform duration-200"
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
            <div className="absolute top-4 right-4">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
            </div>
            <div className="relative z-10">
              <h3 className="font-headline-md text-headline-md font-bold mb-1 text-white">
                Liked Songs
              </h3>
              <p className="font-body-md text-body-md opacity-90">
                {likedSongs.length} tracks saved
              </p>
            </div>
          </Link>

          {/* Saved Album Cards */}
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded border-2 border-prussian-blue/20 shimmer" />
            ))
          ) : (
            <>
              {savedAlbums.map((album: any, idx: number) => {
                const borderStyles = [
                  'border-t-vibrant-saffron',
                  'border-t-prussian-blue',
                  'border-t-crisp-green',
                ];
                const topBorder = borderStyles[idx % borderStyles.length];
                const cover = artworkUrl(album.imageKey);

                return (
                  <Link
                    key={album.id}
                    href={`/album/${album.id}`}
                    className={`bg-surface border-t-4 ${topBorder} border-x-2 border-b-2 border-prussian-blue p-4 hover:-translate-y-1 transition-transform duration-200 h-64 flex flex-col hard-shadow shadow-prussian-blue`}
                  >
                    <div className="flex-1 w-full bg-surface-variant mb-3 overflow-hidden border-2 border-prussian-blue">
                      <ArtworkImage
                        src={cover}
                        alt={album.title}
                        type="album"
                        id={album.id}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-label-md text-label-md text-prussian-blue truncate font-bold">
                      {album.title}
                    </h4>
                    <p className="font-caption text-caption text-outline truncate mt-0.5">
                      {album.artist?.name || 'By Sonicly'}
                    </p>
                  </Link>
                );
              })}

              {/* Create Playlist Action Card */}
              <div className="bg-surface border-t-4 border-vibrant-saffron border-x-2 border-b-2 border-prussian-blue p-4 hover:-translate-y-1 transition-transform duration-200 h-64 flex flex-col items-center justify-center text-center cursor-pointer hard-shadow shadow-prussian-blue group">
                <div className="w-14 h-14 rounded-full border-2 border-prussian-blue bg-vibrant-saffron flex items-center justify-center text-prussian-blue mb-3 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-2xl font-bold">add</span>
                </div>
                <h4 className="font-label-md text-label-md text-prussian-blue font-bold">
                  Create Playlist
                </h4>
                <p className="font-caption text-caption text-outline mt-1">
                  Custom collections
                </p>
              </div>
            </>
          )}
        </div>

        {/* ── Recent Liked Tracks ──────────────────────────────────────────────── */}
        {likedSongs.length > 0 && (
          <section className="pt-stack-md border-t-2 border-surface-variant">
            <div className="mb-4 border-l-4 border-crisp-green pl-3">
              <h3 className="font-headline-md text-headline-md font-bold text-prussian-blue">
                Recently Liked Tracks
              </h3>
            </div>
            <div className="space-y-1">
              {likedSongs.slice(0, 10).map((song: any, i: number) => (
                <SongRow key={song.id} song={song} index={i} queue={likedSongs} />
              ))}
            </div>
          </section>
        )}

        {/* ── Followed Artists ────────────────────────────────────────────────── */}
        {followedArtists.length > 0 && (
          <section className="mt-stack-lg pt-stack-md border-t-2 border-surface-variant">
            <div className="mb-4 border-l-4 border-prussian-blue pl-3">
              <h3 className="font-headline-md text-headline-md font-bold text-prussian-blue">
                Artists You Follow
              </h3>
            </div>
            <div className="flex gap-5 flex-wrap">
              {followedArtists.map((artist: any) => (
                <Link
                  key={artist.id}
                  href={`/artist/${artist.id}`}
                  className="group text-center block w-28"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 border-prussian-blue shadow-md bg-midnight-blue group-hover:border-vibrant-saffron transition-colors">
                    <ArtworkImage
                      src={artworkUrl(artist.imageKey)}
                      alt={artist.name}
                      type="artist"
                      id={artist.id}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <h4 className="font-label-md text-xs text-prussian-blue truncate font-bold group-hover:text-vibrant-saffron transition-colors">
                    {artist.name}
                  </h4>
                  <p className="font-caption text-[10px] text-outline">Artist</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
