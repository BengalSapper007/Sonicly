'use client';
import { useEffect, useState } from 'react';
import { albumsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { Compass } from 'lucide-react';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    albumsApi.list()
      .then((res) => {
        setAlbums(res.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 pb-24 min-h-full" style={{ background: '#F6F1E4' }}>
      <div className="flex items-center gap-3 mb-8">
        <Compass className="w-8 h-8 text-saffron" />
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Browse Albums
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl shimmer" />
          ))}
        </div>
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <div className="text-on-surface-muted">No albums found.</div>
      )}
    </div>
  );
}
