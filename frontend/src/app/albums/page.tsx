import type { Metadata } from 'next';
import { albumsApi } from '@/lib/api';
import { AlbumCard } from '@/components/catalog/AlbumCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Compass } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Browse Albums',
  description: 'Explore full-length albums across genres and decades on Sonicly.',
  alternates: {
    canonical: '/albums',
  },
};

export default async function AlbumsPage() {
  let albums: any[] = [];
  try {
    const res = await albumsApi.list();
    albums = res.data ?? [];
  } catch (err) {
    console.error('Failed to fetch albums on server:', err);
  }

  return (
    <div className="p-8 pb-24 min-h-full" style={{ background: '#F6F1E4' }}>
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Albums' }]} />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Compass className="w-8 h-8 text-saffron" />
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Browse Albums
        </h1>
      </div>

      {albums.length > 0 ? (
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
