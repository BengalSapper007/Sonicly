'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi, artworkUrl } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { usePlayerStore } from '@/stores/player.store';
import { SongRow } from '@/components/catalog/SongRow';
import { Skeleton } from '@/components/ui/Skeleton';
import { Heart, Play } from 'lucide-react';

export default function LikedSongsPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const { playQueue } = usePlayerStore();
  const [likedSongs, setLikedSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      libraryApi.likedSongs()
        .then((res) => setLikedSongs(res.data ?? []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated && !isLoading) return null;

  return (
    <div className="min-h-full pb-24" style={{ background: '#FAF6EF' }}>
      {/* Hero Banner */}
      <div
        className="px-8 pt-12 pb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(232,114,12,0.12) 0%, rgba(250,246,239,0) 100%)',
        }}
      >
        <div className="flex items-end gap-6">
          <div
            className="w-48 h-48 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #E8720C 0%, #146B3A 100%)',
            }}
          >
            <Heart className="w-20 h-20 text-white fill-current" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-vibrant-saffron mb-1">Playlist</p>
            <h1 className="text-5xl font-bold text-on-surface tracking-tight mb-3">
              Liked Songs
            </h1>
            <p className="text-sm text-on-surface-muted">
              {loading ? '—' : `${likedSongs.length} tracks`}
            </p>
          </div>
        </div>

        {likedSongs.length > 0 && !loading && (
          <button
            className="mt-6 w-14 h-14 rounded-full flex items-center justify-center bg-vibrant-saffron transition-all hover:scale-105 hover:bg-deep-saffron"
            onClick={() => playQueue(likedSongs, 0, 'search', undefined)}
          >
            <Play className="w-6 h-6 fill-current text-white ml-0.5" />
          </button>
        )}
      </div>

      {/* Song List */}
      <div className="px-8 py-4">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl shimmer" />
            ))}
          </div>
        ) : likedSongs.length === 0 ? (
          <div className="py-16 text-center">
            <Heart className="w-16 h-16 mx-auto text-border-light mb-4" />
            <h2 className="text-xl font-semibold text-on-surface mb-2">Songs you like will appear here</h2>
            <p className="text-sm text-on-surface-muted">Save songs by tapping the heart icon.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {likedSongs.map((song: any, i: number) => (
              <SongRow key={song.id} song={song} index={i} queue={likedSongs} contextType="search" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
