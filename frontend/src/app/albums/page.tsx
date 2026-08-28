'use client';
import { useEffect, useState } from 'react';
import { albumsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { AlbumCard } from '@/components/catalog/AlbumCard';

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
    <div className="p-margin-mobile md:p-margin-desktop pb-32 min-h-full bg-background text-on-surface">
      <div className="flex items-center gap-3 mb-8 border-l-8 border-vibrant-saffron pl-4">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-prussian-blue">
          Browse Albums
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded border-2 border-prussian-blue/20 shimmer" />
          ))}
        </div>
      ) : albums.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      ) : (
        <div className="text-outline font-medium">No albums found.</div>
      )}
    </div>
  );
}
