'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { libraryApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth.store';
import { useLibraryStore } from '@/stores/library.store';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { Disc } from 'lucide-react';

export default function SavedAlbumsPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();
  const [savedAlbums, setSavedAlbums] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const registerAlbum = useLibraryStore((s) => s.registerAlbum);
  const savedAlbumIds = useLibraryStore((s) => s.savedAlbumIds);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (isAuthenticated) {
      libraryApi.savedAlbums()
        .then((res) => {
          const list = res.data ?? [];
          setSavedAlbums(list);
          list.forEach((a: any) => registerAlbum(a.id, true));
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, isLoading, router, registerAlbum]);

  if (!isAuthenticated && !isLoading) return null;

  const displayAlbums = savedAlbums.filter((a) => savedAlbumIds.has(a.id));

  return (
    <div className="min-h-full pb-24 p-8" style={{ background: '#F6F1E4' }}>
      <div className="flex items-center gap-3 mb-8">
        <Disc className="w-8 h-8 text-saffron" />
        <div>
          <h1 className="text-3xl font-black text-ink tracking-tight">
            Saved Albums
          </h1>
          <p className="text-sm text-on-surface-muted mt-0.5">
            {loading ? '—' : `${displayAlbums.length} albums`}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-2xl shimmer" />
          ))}
        </div>
      ) : displayAlbums.length === 0 ? (
        <div className="py-16 text-center">
          <Disc className="w-16 h-16 mx-auto text-border-light mb-4" />
          <h2 className="text-xl font-bold text-on-surface-muted mb-2">No saved albums yet</h2>
          <p className="text-sm text-on-surface-muted">Save albums by clicking the bookmark icon on any album.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {displayAlbums.map((album: any) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      )}
    </div>
  );
}
