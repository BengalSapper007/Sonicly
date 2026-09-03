import type { Metadata } from 'next';
import { artistsApi, artworkUrl } from '@/lib/api';
import { JsonLd } from '@/components/seo/JsonLd';
import { ArtistView } from './ArtistView';

interface PageProps {
  params: Promise<{ artistId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { artistId } = await params;
  try {
    const res = await artistsApi.get(artistId);
    const artist = res.data;
    if (!artist) {
      return { title: 'Artist Not Found' };
    }

    const title = `${artist.name} — Discography, Tracks & Bio`;
    const albumCount = artist.albums?.length || 0;
    const description = `Listen to ${artist.name} on Sonicly. Discover popular songs, explore ${albumCount} albums, and stream high-fidelity audio.`;
    const image = artworkUrl(artist.imageKey);

    return {
      title,
      description,
      alternates: {
        canonical: `/artist/${artist.id}`,
      },
      openGraph: {
        title,
        description,
        type: 'profile',
        images: image ? [image] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: image ? [image] : [],
      },
    };
  } catch {
    return { title: 'Artist' };
  }
}

export default async function ArtistPage({ params }: PageProps) {
  const { artistId } = await params;
  let artist: any = null;

  try {
    const res = await artistsApi.get(artistId);
    artist = res.data ?? null;
  } catch (err) {
    console.error(`Failed to pre-fetch artist ${artistId} on server:`, err);
  }

  const artistSchema = artist
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicGroup',
        name: artist.name,
        description: artist.bio || undefined,
        image: artworkUrl(artist.imageKey),
        album: (artist.albums || []).map((album: any) => ({
          '@type': 'MusicAlbum',
          name: album.title,
          url: `/album/${album.id}`,
        })),
        track: (artist.popularSongs || []).map((song: any) => ({
          '@type': 'MusicRecording',
          name: song.title,
        })),
      }
    : null;

  return (
    <>
      {artistSchema && <JsonLd data={artistSchema} />}
      <ArtistView artistId={artistId} initialArtist={artist} />
    </>
  );
}
