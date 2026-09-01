'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { ArtistCard } from '@/components/catalog/ArtistCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Users } from 'lucide-react';

export default function FollowingPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [followedArtists, setFollowedArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      libraryApi.followedArtists()
        .then((res) => setFollowedArtists(res.data ?? []))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, router]);

  if (!isAuthenticated && !isLoading) return null;

  return (
    <div className="min-h-full pb-24 p-8" style={{ background: '#FAF6EF' }}>
      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-vibrant-saffron" />
        <div>
          <h1
            className="text-3xl font-black text-white tracking-tight"
           
          >
            Following
          </h1>
          <p className="text-sm text-on-surface-muted mt-0.5">
            {loading ? '—' : `${followedArtists.length} artists`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8 text-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <Skeleton className="w-28 h-28 rounded-full shimmer mb-3" />
              <Skeleton className="w-20 h-4 rounded shimmer" />
            </div>
          ))}
        </div>
      ) : followedArtists.length === 0 ? (
        <div className="py-16 text-center">
          <Users className="w-16 h-16 mx-auto text-border-light mb-4" />
          <h2 className="text-xl font-bold text-on-surface-muted mb-2">Not following any artists yet</h2>
          <p className="text-sm text-on-surface-muted">Follow artists to see them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {followedArtists.map((artist: any) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      )}
    </div>
  );
}
