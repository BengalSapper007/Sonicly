import type { Metadata } from 'next';
import { playlistsApi } from '@/lib/api';
import { PlaylistCard } from '@/components/catalog/PlaylistCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Featured Playlists',
  description: 'Listen to handpicked playlists, curated mixes, and mood collections on Sonicly.',
  alternates: {
    canonical: '/playlists',
  },
};

export default async function PlaylistsPage() {
  let playlists: any[] = [];
  try {
    const res = await playlistsApi.curated();
    playlists = res.data ?? [];
  } catch (err) {
    console.error('Failed to fetch playlists on server:', err);
  }

  return (
    <div className="p-8 pb-24 min-h-full" style={{ background: '#F6F1E4' }}>
      <div className="mb-6">
        <Breadcrumbs items={[{ label: 'Home', href: '/' }, { label: 'Playlists' }]} />
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Sparkles className="w-8 h-8 text-saffron" />
        <h1 className="text-3xl font-bold tracking-tight text-on-surface">
          Discover Playlists
        </h1>
      </div>

      {playlists.length > 0 ? (
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
