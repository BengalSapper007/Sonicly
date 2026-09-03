'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi, artworkUrl } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { useLibraryStore } from '@/stores/library.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtworkImage } from '@/components/ui/ArtworkImage';
import { Heart, Play, Plus } from 'lucide-react';
import Link from 'next/link';

type FilterTab = 'Playlists' | 'Artists' | 'Albums';

export default function LibraryPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<any[]>([]);
  const [followedArtists, setFollowedArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>('Albums');

  const likedSongIds = useLibraryStore((s) => s.likedSongIds);
  const savedAlbumIds = useLibraryStore((s) => s.savedAlbumIds);
  const followedArtistIds = useLibraryStore((s) => s.followedArtistIds);
  const registerSong = useLibraryStore((s) => s.registerSong);
  const registerAlbum = useLibraryStore((s) => s.registerAlbum);
  const registerArtist = useLibraryStore((s) => s.registerArtist);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) { router.push('/login'); return; }
    if (isAuthenticated) {
      Promise.all([
        libraryApi.likedSongs(),
        libraryApi.savedAlbums(),
        libraryApi.followedArtists(),
      ])
        .then(([songs, albums, artists]) => {
          const sList = songs.data || [];
          const aList = albums.data || [];
          const arList = artists.data || [];
          setLikedSongs(sList);
          setSavedAlbums(aList);
          setFollowedArtists(arList);
          sList.forEach((s: any) => registerSong(s.id, true));
          aList.forEach((a: any) => registerAlbum(a.id, true));
          arList.forEach((ar: any) => registerArtist(ar.id, true));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, router, registerSong, registerAlbum, registerArtist]);

  if (!isAuthenticated && !isLoading) return null;

  const activeLikedSongs = likedSongs.filter((s) => likedSongIds.has(s.id));
  const activeSavedAlbums = savedAlbums.filter((a) => savedAlbumIds.has(a.id));
  const activeFollowedArtists = followedArtists.filter((a) => followedArtistIds.has(a.id));
  const TABS: FilterTab[] = ['Albums', 'Artists', 'Playlists'];

  return (
    <div className="min-h-full pb-24 bg-background">

      {/* ── Sticky Header ────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-prussian-blue border-b-2 border-midnight-blue px-4 md:px-8 pt-5 pb-4">
        <h1 className="font-black text-2xl md:text-3xl text-white mb-4">Your Library</h1>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded text-xs font-bold transition-all whitespace-nowrap border-2 ${
                activeTab === tab
                  ? 'bg-vibrant-saffron text-prussian-blue border-prussian-blue'
                  : 'bg-transparent text-on-primary-muted border-prussian-blue/50 hover:border-vibrant-saffron hover:text-vibrant-saffron'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 md:px-8 py-6">
        {/* ── Liked Songs Hero Card ───────────────────────────────────────────── */}
        <div
          className="rounded-xl overflow-hidden mb-6 relative flex items-end"
          style={{
            background: 'linear-gradient(135deg, #0F6B45 0%, #1B2447 100%)',
            minHeight: '160px',
          }}
        >
          <div className="p-5 w-full flex justify-between items-end">
            <div>
              <Heart className="w-8 h-8 text-vibrant-saffron fill-current mb-2" />
              {activeLikedSongs.length > 0 && (
                <p className="text-xs text-white/70 mb-1 line-clamp-1">
                  {activeLikedSongs.slice(0, 3).map((s: any) => s.title).join(', ')}
                  {activeLikedSongs.length > 3 && '…'}
                </p>
              )}
              <h2 className="text-2xl font-bold text-white">Liked Songs</h2>
              <p className="text-xs font-medium text-white/70 mt-1">{activeLikedSongs.length} tracks</p>
            </div>
            <Link
              href="/library/liked"
              className="w-14 h-14 rounded-full bg-vibrant-saffron text-white flex items-center justify-center hover:bg-deep-saffron transition-colors flex-shrink-0"
            >
              <Play className="w-6 h-6 fill-current ml-0.5" />
            </Link>
          </div>
        </div>

        {/* ── Grid (Albums/Artists) ────────────────────────────────────────────── */}
        {activeTab === 'Albums' && (
          <div>
            <div className="border-l-4 border-vibrant-saffron pl-3 mb-4">
              <h3 className="font-bold text-lg text-prussian-blue">Saved Albums</h3>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded shimmer" />
                ))}
              </div>
            ) : activeSavedAlbums.length === 0 ? (
              <EmptyState message="No saved albums yet. Browse albums to save them." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {activeSavedAlbums.map((album: any) => (
                  <LibraryCard
                    key={album.id}
                    title={album.title}
                    subtitle={album.artist?.name || 'Album'}
                    imageKey={album.imageKey}
                    href={`/album/${album.id}`}
                    id={album.id}
                    type="album"
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Artists' && (
          <div>
            <div className="border-l-4 border-crisp-green pl-3 mb-4">
              <h3 className="font-bold text-lg text-prussian-blue">Artists You Follow</h3>
            </div>
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <Skeleton className="w-24 h-24 rounded-full shimmer" />
                    <Skeleton className="w-20 h-3 rounded shimmer" />
                  </div>
                ))}
              </div>
            ) : activeFollowedArtists.length === 0 ? (
              <EmptyState message="You're not following any artists yet." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                {activeFollowedArtists.map((artist: any) => (
                  <Link
                    key={artist.id}
                    href={`/artist/${artist.id}`}
                    className="group text-center block"
                  >
                    <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden mx-auto mb-2 border-2 border-prussian-blue shadow-hard-sm group-hover:shadow-hard-saffron transition-all">
                      <ArtworkImage
                        src={artworkUrl(artist.imageKey)}
                        alt={artist.name}
                        type="artist"
                        id={artist.id}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <p className="text-sm font-bold text-prussian-blue truncate group-hover:text-vibrant-saffron transition-colors">
                      {artist.name}
                    </p>
                    <p className="text-xs text-on-surface-muted font-medium">Artist</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'Playlists' && (
          <div>
            <div className="border-l-4 border-vibrant-saffron pl-3 mb-4">
              <h3 className="font-bold text-lg text-prussian-blue">Playlists</h3>
            </div>
            <EmptyState message="No playlists yet." />
          </div>
        )}

        {/* ── Recently Liked Songs ──────────────────────────────────────────────── */}
        <div className="mt-8 pt-6 border-t-2 border-prussian-blue/10">
          <div className="border-l-4 border-vibrant-saffron pl-3 mb-4">
            <h3 className="font-bold text-lg text-prussian-blue">Recently Liked</h3>
          </div>
          {loading ? (
            <div className="divide-y divide-prussian-blue/5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-14 shimmer my-1" />
              ))}
            </div>
          ) : activeLikedSongs.length === 0 ? (
            <EmptyState message="No liked songs yet. Like a song to see it here." />
          ) : (
            <div className="divide-y divide-prussian-blue/5">
              {activeLikedSongs.slice(0, 10).map((song: any, i: number) => (
                <SongRow key={song.id} song={song} index={i} queue={activeLikedSongs} />
              ))}
              {activeLikedSongs.length > 10 && (
                <Link
                  href="/library/liked"
                  className="block text-center py-3 text-sm font-bold text-prussian-blue hover:text-vibrant-saffron transition-colors"
                >
                  See all {activeLikedSongs.length} liked songs →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-10 text-center border-2 border-dashed border-prussian-blue/20 rounded">
      <p className="text-sm text-on-surface-muted font-semibold">{message}</p>
    </div>
  );
}

function LibraryCard({ title, subtitle, imageKey, href, id, type }: {
  title: string; subtitle: string; imageKey?: string;
  href: string; id: string; type: 'album' | 'artist';
}) {
  const cover = artworkUrl(imageKey);
  return (
    <Link
      href={href}
      className="group cursor-pointer block bg-white border-2 border-prussian-blue rounded overflow-hidden shadow-hard-sm hover:shadow-hard-saffron transition-all hover:-translate-y-0.5"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-raised">
        <ArtworkImage
          src={cover}
          alt={title}
          type={type}
          id={id}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-prussian-blue/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-11 h-11 rounded-full bg-vibrant-saffron text-prussian-blue border-2 border-prussian-blue flex items-center justify-center">
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-2.5 border-t border-prussian-blue/10">
        <p className="text-sm font-bold text-prussian-blue truncate group-hover:text-vibrant-saffron transition-colors">{title}</p>
        <p className="text-xs text-on-surface-muted truncate mt-0.5 font-medium">{subtitle}</p>
      </div>
    </Link>
  );
}
