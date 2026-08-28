'use client';
import { useEffect, useState } from 'react';
import { playlistsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { PlaylistCard } from '@/components/catalog/PlaylistCard';

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
    <div className="p-margin-mobile md:p-margin-desktop pb-32 min-h-full bg-background text-on-surface">
      <div className="flex items-center gap-3 mb-8 border-l-8 border-vibrant-saffron pl-4">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-prussian-blue">
          Discover Playlists
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded border-2 border-prussian-blue/20 shimmer" />
          ))}
        </div>
      ) : playlists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {playlists.map((pl) => (
            <PlaylistCard key={pl.id} playlist={pl} />
          ))}
        </div>
      ) : (
        <div className="text-outline font-medium">No playlists found.</div>
      )}
    </div>
  );
}
