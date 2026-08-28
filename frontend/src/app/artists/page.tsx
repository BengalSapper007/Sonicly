'use client';
import { useEffect, useState } from 'react';
import { artistsApi } from '@/lib/api';
import { Skeleton } from '@/components/ui/Skeleton';
import { ArtistCard } from '@/components/catalog/ArtistCard';

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
    <div className="p-margin-mobile md:p-margin-desktop pb-32 min-h-full bg-background text-on-surface">
      <div className="flex items-center gap-3 mb-8 border-l-8 border-crisp-green pl-4">
        <h1 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-prussian-blue">
          Artists
        </h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-28 h-28 rounded-full border-2 border-prussian-blue/20 shimmer mb-3" />
              <Skeleton className="w-20 h-4 rounded shimmer" />
            </div>
          ))}
        </div>
      ) : artists.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {artists.map((artist) => (
            <div key={artist.id} className="flex justify-center w-full">
              <ArtistCard artist={artist} className="w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-outline font-medium">No artists found.</div>
      )}
    </div>
  );
}
