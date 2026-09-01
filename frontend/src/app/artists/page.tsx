'use client';
import { useEffect, useState } from 'react';
import { artistsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtistCard } from '@/components/catalog/ArtistCard';
import { Users } from 'lucide-react';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    artistsApi.list()
      .then((res) => {
        setArtists(res.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8 pb-24 min-h-full" style={{ background: '#FAF6EF' }}>
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-vibrant-saffron" />
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Artists
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 text-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-32 h-32 rounded-full shimmer mb-3" />
              <Skeleton className="w-24 h-4 rounded shimmer" />
            </div>
          ))}
        </div>
      ) : artists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
          {artists.map((artist) => (
            <div key={artist.id} className="flex justify-center w-full">
              <ArtistCard artist={artist} className="w-full max-w-[160px]" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-on-surface-muted">No artists found.</div>
      )}
    </div>
  );
}
