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
    <div className="min-h-full pb-24" style={{ background: '#131316' }}>
      {/* Hero Banner */}
      <div
        className="px-8 pt-12 pb-8 relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(160,120,255,0.25) 0%, rgba(19,19,22,0) 100%)',
        }}
      >
        <div className="flex items-end gap-6">
          <div
            className="w-48 h-48 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #a078ff 0%, #d0bcff 50%, #4cd7f6 100%)',
              boxShadow: '0 16px 48px rgba(160,120,255,0.4)',
            }}
          >
            <Heart className="w-20 h-20 text-white fill-current drop-shadow-xl" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-300 mb-1">Playlist</p>
            <h1
              className="text-5xl font-black text-white tracking-tight mb-3"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Liked Songs
            </h1>
            <p className="text-sm text-zinc-400">
              {loading ? '—' : `${likedSongs.length} tracks`}
            </p>
          </div>
        </div>

        {likedSongs.length > 0 && !loading && (
          <button
            className="mt-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, #d0bcff, #4cd7f6)',
              boxShadow: '0 0 30px rgba(208,188,255,0.5)',
            }}
            onClick={() => playQueue(likedSongs, 0, 'search', undefined)}
          >
            <Play className="w-6 h-6 fill-current text-purple-950 ml-0.5" />
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
            <Heart className="w-16 h-16 mx-auto text-zinc-700 mb-4" />
            <h2 className="text-xl font-bold text-zinc-300 mb-2">Songs you like will appear here</h2>
            <p className="text-sm text-zinc-500">Save songs by tapping the heart icon.</p>
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
