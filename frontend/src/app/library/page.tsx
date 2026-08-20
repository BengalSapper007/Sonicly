'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi, artworkUrl } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { Heart, Play, Plus, Music, User, Disc, ListMusic } from 'lucide-react';
import Link from 'next/link';

type FilterTab = 'Playlists' | 'Artists' | 'Albums';

export default function LibraryPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
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

  const TABS: FilterTab[] = ['Playlists', 'Artists', 'Albums'];

  return (
    <div className="min-h-full pb-16">
      {/* ── Sticky Header ──────────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 px-8 pt-6 pb-4"
        style={{
          background: 'rgba(19, 19, 22, 0.85)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        }}
      >
        <h1
          className="font-black text-3xl md:text-4xl text-white mb-4 tracking-tight"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Your Library
        </h1>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-purple-300 text-purple-950 shadow-md'
                    : 'bg-zinc-800/60 text-zinc-300 border border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-8 py-6">
        {/* ── Library Grid ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mb-8">
          {/* Liked Songs Special Card — spans 2 cols */}
          <div
            className="col-span-2 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group cursor-pointer shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{
              aspectRatio: '2/1',
              background: 'linear-gradient(135deg, #a078ff 0%, #d0bcff 50%, #4cd7f6 100%)',
            }}
          >
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="flex items-start justify-between">
                <Heart className="w-8 h-8 text-white fill-current drop-shadow-md" />
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-cyan-950 text-cyan-400 shadow-xl"
                  style={{ boxShadow: '0 0 20px rgba(76,215,246,0.6)' }}
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>
              <div>
                {likedSongs.length > 0 && (
                  <p className="text-xs text-white/80 mb-1 line-clamp-1">
                    {likedSongs.slice(0, 3).map((s: any) => s.title).join(', ')}
                    {likedSongs.length > 3 && '…'}
                  </p>
                )}
                <h3
                  className="text-2xl font-black text-white tracking-tight"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Liked Songs
                </h3>
                <p className="text-xs font-semibold text-white/70 mt-0.5">
                  {likedSongs.length} tracks
                </p>
              </div>
            </div>
          </div>

          {/* Saved Album Cards */}
          {loading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-2xl shimmer" />
              ))}
            </>
          ) : (
            <>
              {savedAlbums.slice(0, 3).map((album: any) => (
                <LibraryCard
                  key={album.id}
                  title={album.title}
                  subtitle="Album"
                  imageKey={album.imageKey}
                  href={`/album/${album.id}`}
                  id={album.id}
                />
              ))}

              {/* Create Playlist Card */}
              <div className="rounded-2xl p-4 flex flex-col items-center justify-center gap-3 cursor-pointer border-2 border-dashed border-white/10 hover:border-purple-400/50 hover:bg-purple-500/5 transition-all group min-h-[160px]">
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-800 text-zinc-300 group-hover:text-purple-300 group-hover:scale-110 transition-all shadow-md">
                  <Plus className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-zinc-300 group-hover:text-purple-300 transition-colors">
                  Create Playlist
                </span>
              </div>
            </>
          )}
        </div>

        {/* ── Recently Added ─────────────────────────────────────────────────── */}
        <div className="pt-8 border-t border-white/5">
          <div className="flex items-center justify-between mb-4">
            <h3
              className="text-lg font-bold text-zinc-100"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Recently Liked
            </h3>
          </div>

          {/* Liked Songs List */}
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 rounded-xl shimmer" />
              ))}
            </div>
          ) : likedSongs.length === 0 ? (
            <div className="py-12 text-center text-zinc-400">
              <Heart className="w-12 h-12 mx-auto text-zinc-600 mb-2" />
              <p className="text-sm">No liked songs yet.</p>
            </div>
          ) : (
            <div className="space-y-1">
              {likedSongs.slice(0, 10).map((song: any, i: number) => (
                <SongRow key={song.id} song={song} index={i} queue={likedSongs} />
              ))}
            </div>
          )}
        </div>

        {/* ── Following Artists ──────────────────────────────────────────────── */}
        {followedArtists.length > 0 && (
          <div className="mt-10 pt-8 border-t border-white/5">
            <h3
              className="text-lg font-bold text-zinc-100 mb-4"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Artists You Follow
            </h3>
            <div className="flex gap-5 flex-wrap">
              {followedArtists.map((artist: any) => (
                <Link
                  key={artist.id}
                  href={`/artist/${artist.id}`}
                  className="group text-center block flex-shrink-0 w-24"
                >
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-2 shadow-lg ring-2 ring-transparent group-hover:ring-purple-400/50 transition-all bg-zinc-950">
                    <ArtworkImage
                      src={artworkUrl(artist.imageKey)}
                      alt={artist.name}
                      type="artist"
                      id={artist.id}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="text-sm font-semibold text-zinc-100 truncate group-hover:text-purple-300 transition-colors">
                    {artist.name}
                  </p>
                  <p className="text-xs text-zinc-400">Artist</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function LibraryCard({
  title,
  subtitle,
  imageKey,
  href,
  id,
}: {
  title: string;
  subtitle: string;
  imageKey?: string;
  href: string;
  id: string;
}) {
  const cover = artworkUrl(imageKey);
  return (
    <Link
      href={href}
      className="group cursor-pointer block rounded-2xl p-3 flex flex-col gap-2.5 bg-zinc-900/60 border border-white/5 hover:border-white/10 hover:bg-zinc-900/90 transition-all duration-300 shadow-lg hover:-translate-y-1"
    >
      <div className="relative aspect-square rounded-xl overflow-hidden bg-zinc-950">
        <ArtworkImage
          src={cover}
          alt={title}
          type="album"
          id={id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Hover play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div
            className="w-11 h-11 rounded-full flex items-center justify-center bg-cyan-400 text-cyan-950 shadow-lg group-hover:scale-110 transition-transform"
            style={{ boxShadow: '0 0 20px rgba(76,215,246,0.6)' }}
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>
      <div>
        <h4 className="text-sm font-semibold text-zinc-100 truncate group-hover:text-purple-300 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>
      </div>
    </Link>
  );
}
