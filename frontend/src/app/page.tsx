import type { Metadata } from 'next';
import { albumsApi, playlistsApi, artistsApi } from '@/lib/api';
import { HomeView } from './HomeView';

export const metadata: Metadata = {
  title: 'Sonicly — High-Fidelity Music Streaming',
  description:
    'A premium music listening experience built for sound enthusiasts. Stream albums, discover curated playlists, and explore artists.',
};

export default async function HomePage() {
  let albums: any[] = [];
  let playlists: any[] = [];
  let artists: any[] = [];

  try {
    const [albumsRes, playlistsRes, artistsRes] = await Promise.all([
      albumsApi.list(),
      playlistsApi.curated(),
      artistsApi.list(),
    ]);

    albums = albumsRes.data?.slice(0, 12) ?? [];
    playlists = playlistsRes.data?.slice(0, 8) ?? [];
    artists = artistsRes.data?.slice(0, 10) ?? [];
  } catch (err) {
    console.error('Failed to pre-fetch home catalog data on server:', err);
  }

  return (
    <HomeView
      initialAlbums={albums}
      initialPlaylists={playlists}
      initialArtists={artists}
    />
  );
}
