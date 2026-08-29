'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { albumsApi, playlistsApi, artistsApi, artworkUrl } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { usePlayerStore } from '@/stores/player.store';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import {
  Search,
  Bell,
  Settings,
  Play,
  History,
  Sparkles,
  TrendingUp,
  Users,
  Compass,
  ChevronRight,
  UserPlus,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuthStore();
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

  const featured = playlists[0] ?? albums[0];
  const featuredCover = featured ? artworkUrl(featured.imageKey) : null;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-full pb-16">
      {/* ── Top Header ──────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-8 h-16"
        style={{
          background: 'rgba(19, 19, 22, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className="relative group max-w-md w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none transition-colors group-focus-within:text-purple-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search artists, songs, albums…"
            className="w-full rounded-full py-2 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-400 outline-none transition-all"
            style={{
              background: 'rgba(42, 42, 45, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(53, 52, 56, 0.9)';
              e.currentTarget.style.borderColor = 'rgba(208, 188, 255, 0.4)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(42, 42, 45, 0.65)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          />
        </form>

        {/* Right action icons */}
        <div className="flex items-center gap-2 ml-4">
          <button
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-white/5 transition-all"
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
          {user ? (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ml-1 flex-shrink-0 text-purple-950 shadow-md"
              style={{
                background: 'linear-gradient(135deg, #d0bcff 0%, #ffb0cd 100%)',
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              {user.displayName?.[0]?.toUpperCase() || 'U'}
            </div>
          ) : (
            <Link href="/login" className="btn-primary ml-2 py-1.5 px-4 text-xs font-semibold">
              Log in
            </Link>
          )}
        </div>
      </header>

      {/* ── Hero Banner ────────────────────────────────────────────────────── */}
      <section className="relative mx-8 mt-6 h-[340px] rounded-3xl overflow-hidden group shadow-2xl">
        {/* Background Image / Fallback */}
        <div className="absolute inset-0">
          <ArtworkImage
            src={featuredCover}
            alt={featured?.name ?? featured?.title ?? 'Discover Music'}
            type={featured?.name ? 'playlist' : 'album'}
            id={featured?.id ?? 'featured'}
            size="hero"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>

        {/* Dynamic Gradient Overlays */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to top, #131316 0%, rgba(19, 19, 22, 0.7) 45%, rgba(19, 19, 22, 0.2) 100%)',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-25"
          style={{
            background: 'radial-gradient(ellipse at bottom left, rgba(208, 188, 255, 0.4) 0%, transparent 60%)',
          }}
        />

        {/* Content */}
        <div className="absolute bottom-0 left-0 p-8 z-10 w-full max-w-2xl">
          <span className="inline-block mb-2 text-xs font-bold uppercase tracking-widest text-cyan-400">
            Featured
          </span>
          <h1
            className="mb-4 font-black tracking-tight drop-shadow-xl line-clamp-2 text-white"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontSize: 'clamp(28px, 4.5vw, 48px)',
              lineHeight: 1.15,
            }}
          >
            {featured?.name ?? featured?.title ?? 'Discover Music'}
          </h1>
          <div className="flex items-center gap-3">
            <button
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm font-bold shadow-lg"
              onClick={() => {
                if (featured?.songs?.length) {
                  playQueue(
                    featured.songs.map((s: any) => s.song || s),
                    0,
                    'playlist',
                    featured.id
                  );
                }
              }}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Listen Now</span>
            </button>
            <button className="btn-glass flex items-center gap-2 px-5 py-2.5 text-sm font-semibold">
              <UserPlus className="w-4 h-4 text-zinc-300" />
              <span>Follow</span>
            </button>
          </div>
        </div>
      </section>

      {/* ── Jump Back In ───────────────────────────────────────────────────── */}
      <ShelfSection title="Jump Back In" icon={History}>
        {loading ? (
          <div className="flex gap-5 pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-[180px] h-[230px] rounded-2xl flex-shrink-0 shimmer" />
            ))}
          </div>
        ) : albums.length > 0 ? (
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2 -mx-8 px-8">
            {albums.slice(0, 6).map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={() => {
                  if (album.songs?.length) playQueue(album.songs, 0, 'album', album.id);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyShelfState message="No albums available yet." />
        )}
      </ShelfSection>

      {/* ── Curated Playlists ──────────────────────────────────────────────── */}
      <ShelfSection title="Curated Playlists" icon={Sparkles} href="/playlists" iconColor="#ffb0cd">
        {loading ? (
          <div className="flex gap-5 pb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-[180px] h-[230px] rounded-2xl flex-shrink-0 shimmer" />
            ))}
          </div>
        ) : playlists.length > 0 ? (
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2 -mx-8 px-8">
            {playlists.map((pl) => (
              <PlaylistCard key={pl.id} playlist={pl} />
            ))}
          </div>
        ) : (
          <EmptyShelfState message="No playlists found." />
        )}
      </ShelfSection>

      {/* ── New Releases ───────────────────────────────────────────────────── */}
      <ShelfSection title="New Releases" icon={TrendingUp} href="/albums" iconColor="#4cd7f6">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl shimmer" />
            ))}
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {albums.slice(0, 6).map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={() => {
                  if (album.songs?.length) playQueue(album.songs, 0, 'album', album.id);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyShelfState message="No new releases found." />
        )}
      </ShelfSection>

      {/* ── Artists ────────────────────────────────────────────────────────── */}
      <ShelfSection title="Artists" icon={Users} href="/artists">
        {loading ? (
          <div className="flex gap-5 pb-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="w-32 h-44 rounded-2xl flex-shrink-0 shimmer" />
            ))}
          </div>
        ) : artists.length > 0 ? (
          <div className="flex gap-5 overflow-x-auto no-scrollbar pb-2 -mx-8 px-8">
            {artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        ) : (
          <EmptyShelfState message="No artists found." />
        )}
      </ShelfSection>

      {/* ── Browse Albums ──────────────────────────────────────────────────── */}
      <ShelfSection title="Browse Albums" icon={Compass} href="/albums">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-2xl shimmer" />
            ))}
          </div>
        ) : albums.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
            {albums.slice(6, 12).map((album) => (
              <AlbumCard
                key={album.id}
                album={album}
                onPlay={() => {
                  if (album.songs?.length) playQueue(album.songs, 0, 'album', album.id);
                }}
              />
            ))}
          </div>
        ) : (
          <EmptyShelfState message="No albums available." />
        )}
      </ShelfSection>
    </div>
  );
}

// ── Shelf Section wrapper ───────────────────────────────────────────────────
function ShelfSection({
  title,
  icon: Icon,
  href,
  iconColor = '#d0bcff',
  children,
}: {
  title: string;
  icon?: any;
  href?: string;
  iconColor?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="px-8 py-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-5 h-5 flex-shrink-0" style={{ color: iconColor }} />}
          <h2
            className="text-xl font-bold tracking-tight text-zinc-100"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {title}
          </h2>
        </div>
        {href && (
          <Link
            href={href}
            className="text-xs font-semibold text-purple-300 hover:text-purple-200 flex items-center gap-1 transition-colors"
          >
            <span>See all</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

// ── Empty State ─────────────────────────────────────────────────────────────
function EmptyShelfState({ message }: { message: string }) {
  return (
    <div className="p-6 rounded-2xl bg-zinc-900/40 border border-white/5 text-zinc-400 text-sm text-center">
      {message}
    </div>
  );
}

// ── Album Card ──────────────────────────────────────────────────────────────
function AlbumCard({ album, onPlay }: { album: any; onPlay?: () => void }) {
  const cover = artworkUrl(album.imageKey);
  return (
    <Link href={`/album/${album.id}`} className="group cursor-pointer block flex-none w-[180px]">
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg"
        style={{ background: '#1c1c20' }}
      >
        <ArtworkImage
          src={cover}
          alt={album.title}
          type="album"
          id={album.id}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Hover overlay with glowing cyan play button */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              onPlay?.();
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-cyan-400 text-cyan-950 shadow-lg hover:scale-110"
            style={{
              boxShadow: '0 0 24px rgba(76, 215, 246, 0.6)',
            }}
            title="Play Album"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-purple-300 transition-colors">
        {album.title}
      </h3>
      <p className="text-xs text-zinc-400 truncate mt-0.5">
        {album.artist?.name}
        {album.releaseYear && ` · ${album.releaseYear}`}
      </p>
    </Link>
  );
}

// ── Artist Card ─────────────────────────────────────────────────────────────
function ArtistCard({ artist }: { artist: any }) {
  const photo = artworkUrl(artist.imageKey);
  return (
    <Link href={`/artist/${artist.id}`} className="group flex-none w-32 cursor-pointer block text-center">
      <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-2 shadow-lg ring-2 ring-transparent group-hover:ring-purple-400/50 transition-all">
        <ArtworkImage
          src={photo}
          alt={artist.name}
          type="artist"
          id={artist.id}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-purple-300 transition-colors">
        {artist.name}
      </h3>
      <p className="text-xs text-zinc-400">Artist</p>
    </Link>
  );
}

// ── Playlist Card ───────────────────────────────────────────────────────────
function PlaylistCard({ playlist }: { playlist: any }) {
  const cover = artworkUrl(playlist.imageKey);

  return (
    <Link href={`/playlist/${playlist.id}`} className="group flex-none w-[180px] cursor-pointer block">
      <div
        className="relative w-full aspect-square rounded-2xl overflow-hidden mb-3 shadow-lg"
        style={{ background: '#1c1c20' }}
      >
        <ArtworkImage
          src={cover}
          alt={playlist.name}
          type="playlist"
          id={playlist.id}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center bg-cyan-400 text-cyan-950 shadow-lg group-hover:scale-110 transition-transform"
            style={{ boxShadow: '0 0 24px rgba(76, 215, 246, 0.6)' }}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>
      <h3 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-purple-300 transition-colors">
        {playlist.name}
      </h3>
      <p className="text-xs text-zinc-400 line-clamp-2 mt-0.5">
        {playlist.description || `${playlist._count?.songs ?? playlist.songs?.length ?? 0} songs`}
      </p>
    </Link>
  );
}
