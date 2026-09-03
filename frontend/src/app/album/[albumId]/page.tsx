import type { Metadata } from 'next';
import { albumsApi, artworkUrl } from '@/lib/api';
import { JsonLd } from '@/components/seo/JsonLd';
import { AlbumView } from './AlbumView';

interface PageProps {
  params: Promise<{ albumId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { albumId } = await params;
  try {
    const res = await albumsApi.get(albumId);
    const album = res.data;
    if (!album) {
      return { title: 'Album Not Found' };
    }

    const title = `${album.title} — ${album.artist?.name || 'Album'}`;
    const songCount = album.songs?.length || 0;
    const year = album.releaseYear ? ` (${album.releaseYear})` : '';
    const description = `Stream "${album.title}"${year} by ${album.artist?.name || 'Unknown Artist'} on Sonicly. High-fidelity audio with ${songCount} tracks.`;
    const image = artworkUrl(album.imageKey);

    return {
      title,
      description,
      alternates: {
        canonical: `/album/${album.id}`,
      },
      openGraph: {
        title,
        description,
        type: 'music.album',
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
    return { title: 'Album' };
  }
}

export default async function AlbumPage({ params }: PageProps) {
  const { albumId } = await params;
  let album: any = null;

  try {
    const res = await albumsApi.get(albumId);
    album = res.data ?? null;
  } catch (err) {
    console.error(`Failed to pre-fetch album ${albumId} on server:`, err);
  }

  const albumSchema = album
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicAlbum',
        name: album.title,
        byArtist: album.artist
          ? {
              '@type': 'MusicGroup',
              name: album.artist.name,
              url: `/artist/${album.artist.id}`,
            }
          : undefined,
        image: artworkUrl(album.imageKey),
        numTracks: album.songs?.length || 0,
        datePublished: album.releaseYear ? `${album.releaseYear}` : undefined,
        track: (album.songs || []).map((song: any, i: number) => ({
          '@type': 'MusicRecording',
          position: i + 1,
          name: song.title,
          duration: song.duration ? `PT${Math.floor(song.duration)}S` : undefined,
        })),
      }
    : null;

  return (
    <>
      {albumSchema && <JsonLd data={albumSchema} />}
      <AlbumView albumId={albumId} initialAlbum={album} />
    </>
  );
}
