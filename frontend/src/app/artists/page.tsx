import type { Metadata } from 'next';
import { artistsApi } from '@/lib/api';
import { ArtistCard } from '@/components/catalog/ArtistCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Explore Artists',
  description: 'Discover artists, discographies, and popular tracks on Sonicly.',
  alternates: {
    canonical: '/artists',
  },
};

export default async function ArtistsPage() {
  let artists: any[] = [];
  try {
    const res = await artistsApi.list();
    artists = res.data ?? [];
  } catch (err) {
    console.error('Failed to fetch artists on server:', err);
  }

  return (
    <div className="p-8 pb-24 min-h-full" style={{ background: '#F6F1E4' }}>
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Artists' }]} />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Users className="w-8 h-8 text-vibrant-saffron" />
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Artists
        </h1>
      </div>

      {artists.length > 0 ? (
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
