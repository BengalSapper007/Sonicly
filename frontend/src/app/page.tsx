'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { albumsApi, playlistsApi, artistsApi, artworkUrl } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { usePlayerStore } from '@/stores/player.store';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';

export default function HomePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { playQueue } = usePlayerStore();
  const [albums, setAlbums] = useState<any[]>([]);
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    Promise.all([
      albumsApi.list(),
      playlistsApi.curated(),
      artistsApi.list(),
    ])
      .then(([albumsRes, playlistsRes, artistsRes]) => {
        setAlbums(albumsRes.data?.slice(0, 12) ?? []);
        setPlaylists(playlistsRes.data?.slice(0, 8) ?? []);
        setArtists(artistsRes.data?.slice(0, 10) ?? []);
      })
      .catch((err) => {
        console.error('Failed to load home page catalog data:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  const featured = albums[0] || playlists[0];
  const featuredCover = featured ? artworkUrl(featured.imageKey) : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-full pb-24 md:pb-32 bg-background text-on-surface">
      {/* ── TopNavBar (Desktop) ──────────────────────────────────────────────── */}
      <header className="hidden md:flex justify-between items-center h-16 px-margin-desktop bg-prussian-blue border-b-2 border-midnight-blue sticky top-0 z-30 transition-all duration-200">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-headline-md text-headline-md font-black text-vibrant-saffron">
            Sonicly
          </Link>
          <nav className="flex gap-4">
            <Link
              href="/search"
              className="text-on-primary-container font-label-md text-label-md hover:text-vibrant-saffron transition-colors"
            >
              Podcasts
            </Link>
            <Link
              href="/search"
              className="text-on-primary-container font-label-md text-label-md hover:text-vibrant-saffron transition-colors"
            >
              Audiobooks
            </Link>
            <Link
              href="/search"
              className="text-on-primary-container font-label-md text-label-md hover:text-vibrant-saffron transition-colors"
            >
              Live
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-primary-container text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-midnight-blue border-none rounded-full py-1.5 pl-10 pr-4 text-white placeholder-on-primary-container focus:ring-2 focus:ring-vibrant-saffron text-body-md font-body-md w-64 text-sm outline-none"
            />
          </form>

          <button className="text-vibrant-saffron hover:text-white transition-colors p-2 rounded-full hover:bg-midnight-blue" title="Settings">
            <span className="material-symbols-outlined text-[20px]">settings</span>
          </button>
          <button className="text-vibrant-saffron hover:text-white transition-colors p-2 rounded-full hover:bg-midnight-blue" title="Notifications">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 border-l border-on-primary-container pl-4 ml-2">
              <div className="w-8 h-8 rounded-full border-2 border-vibrant-saffron bg-midnight-blue flex items-center justify-center text-vibrant-saffron text-xs font-bold">
                {user?.displayName ? user.displayName.slice(0, 1).toUpperCase() : 'U'}
              </div>
              <button
                onClick={() => logout()}
                className="font-label-md text-xs text-vibrant-saffron hover:text-white transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-label-md text-xs border-2 border-vibrant-saffron text-vibrant-saffron px-3 py-1 rounded hover:bg-vibrant-saffron hover:text-prussian-blue transition-colors font-bold"
            >
              Sign In
            </Link>
          )}
        </div>
      </header>

      {/* ── Main Canvas ──────────────────────────────────────────────────────── */}
      <div className="px-margin-mobile md:px-margin-desktop py-stack-md">
        {/* Mobile Header (small screens) */}
        <div className="md:hidden flex justify-between items-center mb-6 pt-2">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile font-bold text-prussian-blue">
            Sonicly
          </h1>
          <div className="w-8 h-8 rounded-full border-2 border-prussian-blue bg-vibrant-saffron flex items-center justify-center text-prussian-blue font-bold text-xs">
            {user?.displayName ? user.displayName.slice(0, 1).toUpperCase() : 'U'}
          </div>
        </div>

        {/* Featured Release Hero */}
        <section className="mb-stack-xl relative overflow-hidden rounded-xl bg-vibrant-saffron border-2 border-prussian-blue shadow-[4px_4px_0px_0px_rgba(0,49,83,1)]">
          <div className="absolute inset-0 z-0">
            <div className="w-full h-full bg-gradient-to-r from-vibrant-saffron via-vibrant-saffron/90 to-transparent absolute z-10" />
            {featuredCover && (
              <img
                src={featuredCover}
                alt={featured?.title || featured?.name || 'Featured'}
                className="w-full h-full object-cover object-right"
              />
            )}
          </div>

          <div className="relative z-10 p-6 md:p-10 md:w-2/3">
            <span className="inline-block px-3 py-1 bg-prussian-blue text-white font-label-md text-xs rounded-full mb-4">
              Featured Release
            </span>
            <h2 className="font-display-lg text-prussian-blue mb-4">
              {featured?.title || featured?.name || 'Midnight Syndicate'}
            </h2>
            <p className="font-body-lg text-body-lg text-prussian-blue mb-6 font-medium max-w-xl">
              {featured?.artist?.name
                ? `Experience the latest release by ${featured.artist.name}. High-fidelity sound and immersive spatial audio.`
                : 'Experience the new album combining retro synths with modern basslines. Available now in spatial audio.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  if (featured?.songs?.length) {
                    playQueue(featured.songs, 0, 'album', featured.id);
                  }
                }}
                className="bg-prussian-blue text-white font-label-md text-sm py-3 px-7 rounded flex items-center gap-2 hover:bg-midnight-blue transition-colors shadow-md active:translate-y-0.5"
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_arrow
                </span>
                Play Album
              </button>
              <Link
                href={featured ? `/album/${featured.id}` : '#'}
                className="bg-transparent border-2 border-prussian-blue text-prussian-blue font-label-md text-sm py-3 px-7 rounded hover:bg-prussian-blue hover:text-white transition-colors"
              >
                Details
              </Link>
            </div>
          </div>
        </section>

        {/* ── New Releases Section ────────────────────────────────────────────── */}
        <section className="mb-stack-xl">
          <div className="flex items-center justify-between mb-4 border-l-4 border-vibrant-saffron pl-3">
            <h3 className="font-headline-md text-headline-md font-bold text-prussian-blue">
              New Releases
            </h3>
            <Link
              href="/albums"
              className="text-xs font-bold text-prussian-blue hover:text-vibrant-saffron transition-colors"
            >
              See All &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded border-2 border-prussian-blue/20 shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {albums.slice(0, 6).map((album) => {
                const cover = artworkUrl(album.imageKey);
                return (
                  <Link
                    key={album.id}
                    href={`/album/${album.id}`}
                    className="group bg-surface border-2 border-prussian-blue p-3 rounded hover:-translate-y-1 transition-transform hard-shadow shadow-prussian-blue flex flex-col"
                  >
                    <div className="relative aspect-square mb-2.5 overflow-hidden border border-prussian-blue bg-surface-variant">
                      <ArtworkImage
                        src={cover}
                        alt={album.title}
                        type="album"
                        id={album.id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <h4 className="font-label-md text-xs text-prussian-blue truncate font-bold group-hover:text-vibrant-saffron transition-colors">
                      {album.title}
                    </h4>
                    <p className="font-caption text-[11px] text-outline truncate mt-0.5">
                      {album.artist?.name || 'Various Artists'}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Curated Playlists Section ───────────────────────────────────────── */}
        <section className="mb-stack-xl">
          <div className="flex items-center justify-between mb-4 border-l-4 border-prussian-blue pl-3">
            <h3 className="font-headline-md text-headline-md font-bold text-prussian-blue">
              Curated Playlists
            </h3>
            <Link
              href="/playlists"
              className="text-xs font-bold text-prussian-blue hover:text-vibrant-saffron transition-colors"
            >
              Browse Playlists &rarr;
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-44 rounded border-2 border-prussian-blue/20 shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {playlists.map((playlist, idx) => {
                const colors = ['border-t-vibrant-saffron', 'border-t-prussian-blue', 'border-t-crisp-green'];
                const topBorder = colors[idx % colors.length];
                const cover = artworkUrl(playlist.imageKey);

                return (
                  <Link
                    key={playlist.id}
                    href={`/playlist/${playlist.id}`}
                    className={`bg-surface border-t-4 ${topBorder} border-x-2 border-b-2 border-prussian-blue p-4 hover:-translate-y-1 transition-transform hard-shadow shadow-prussian-blue flex flex-col justify-between`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-14 h-14 border border-prussian-blue overflow-hidden flex-shrink-0 bg-surface-variant">
                        <ArtworkImage
                          src={cover}
                          alt={playlist.name}
                          type="playlist"
                          id={playlist.id}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-label-md text-sm text-prussian-blue truncate font-bold">
                          {playlist.name}
                        </h4>
                        <p className="font-caption text-xs text-outline line-clamp-1 mt-0.5">
                          {playlist.description || 'Curated by Sonicly'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-prussian-blue/80 pt-2 border-t border-surface-variant">
                      <span>{playlist.songs?.length || 0} tracks</span>
                      <span className="font-bold text-vibrant-saffron group-hover:translate-x-1 transition-transform">Play &rarr;</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Featured Artists ────────────────────────────────────────────────── */}
        {artists.length > 0 && (
          <section className="mb-stack-lg">
            <div className="flex items-center justify-between mb-4 border-l-4 border-crisp-green pl-3">
              <h3 className="font-headline-md text-headline-md font-bold text-prussian-blue">
                Popular Artists
              </h3>
              <Link
                href="/artists"
                className="text-xs font-bold text-prussian-blue hover:text-vibrant-saffron transition-colors"
              >
                See All &rarr;
              </Link>
            </div>

            <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2">
              {artists.map((artist) => {
                const photo = artworkUrl(artist.imageKey);
                return (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.id}`}
                    className="flex-none w-28 text-center group"
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 border-2 border-prussian-blue shadow-md bg-midnight-blue group-hover:border-vibrant-saffron transition-colors">
                      <ArtworkImage
                        src={photo}
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
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
