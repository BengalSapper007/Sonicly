'use client';
import { useEffect, useState } from 'react';
import { playlistsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { PlaylistCard } from '@/components/catalog/PlaylistCard';
import { Sparkles } from 'lucide-react';

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    playlistsApi.curated()
      .then((res) => {
        setPlaylists(res.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 pb-24 min-h-full" style={{ background: '#F6F1E4' }}>
      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8" style={{ color: '#E2720A' }} />
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Discover Playlists
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl shimmer" />
          ))}
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      ) : (
        <div className="text-on-surface-muted">No playlists found.</div>
      )}
    </div>
  );
}
