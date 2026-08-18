'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { HeartIcon, DiscIcon, MicIcon } from 'lucide-react';
import { libraryApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { SongRow } from '@/components/catalog/SongRow';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { ArtistCard } from '@/components/catalog/ArtistCard';
import { Section } from '@/components/ui/Section';
import { Skeleton } from '@/components/ui/Skeleton';

export default function LibraryPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [savedAlbums, setSavedAlbums] = useState<any[]>([]);
  const [followedArtists, setFollowedArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
      ]).then(([songs, albums, artists]) => {
        setLikedSongs(songs.data || []);
        setSavedAlbums(albums.data || []);
        setFollowedArtists(artists.data || []);
      }).finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated && !isLoading) return null;

  return (
    <div className="min-h-full pb-8">
      {/* Header */}
      <div className="px-8 pt-10 pb-6">
        <h1 className="font-display font-bold text-3xl text-ink">Your Library</h1>
        <p className="text-ink-dim text-sm mt-1">Your saved music, all in one place.</p>
      </div>

      {/* Liked Songs */}
      <Section
        title="Liked Songs"
        icon={<HeartIcon size={16} className="text-neon-pink" />}
      >
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}
          </div>
        ) : likedSongs.length === 0 ? (
          <p className="text-ink-ghost text-sm py-4">No liked songs yet. Like a song to see it here.</p>
        ) : (
          <div className="space-y-1">
            {likedSongs.map((song: any, i: number) => (
              <SongRow key={song.id} song={song} index={i} queue={likedSongs} />
            ))}
          </div>
        )}
      </Section>

      {/* Saved Albums */}
      <Section
        title="Saved Albums"
        icon={<DiscIcon size={16} className="text-sonic" />}
      >
        {loading ? (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="aspect-square rounded-xl" />)}
          </div>
        ) : savedAlbums.length === 0 ? (
          <p className="text-ink-ghost text-sm py-4">No saved albums yet.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {savedAlbums.map((album: any) => <AlbumCard key={album.id} album={album} />)}
          </div>
        )}
      </Section>

      {/* Following */}
      <Section
        title="Artists You Follow"
        icon={<MicIcon size={16} className="text-neon-green" />}
      >
        {loading ? (
          <div className="flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="w-36 h-40 rounded-xl" />)}
          </div>
        ) : followedArtists.length === 0 ? (
          <p className="text-ink-ghost text-sm py-4">Not following anyone yet.</p>
        ) : (
          <div className="flex gap-4 flex-wrap">
            {followedArtists.map((artist: any) => <ArtistCard key={artist.id} artist={artist} />)}
          </div>
        )}
      </Section>
    </div>
  );
}
