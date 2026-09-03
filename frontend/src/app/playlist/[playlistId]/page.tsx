import type { Metadata } from 'next';
import { playlistsApi, artworkUrl } from '@/lib/api';
import { JsonLd } from '@/components/seo/JsonLd';
import { PlaylistView } from './PlaylistView';

interface PageProps {
  params: Promise<{ playlistId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { playlistId } = await params;
  try {
    const res = await playlistsApi.get(playlistId);
    const playlist = res.data;
    if (!playlist) {
      return { title: 'Playlist Not Found' };
    }

    const title = `${playlist.name} — Playlist`;
    const songCount = playlist.songs?.length || 0;
    const description =
      playlist.description ||
      `Listen to ${playlist.name} on Sonicly. Handpicked playlist with ${songCount} tracks.`;
    const image = playlist.coverUrl || artworkUrl(playlist.imageKey);

    return {
      title,
      description,
      alternates: {
        canonical: `/playlist/${playlist.id}`,
      },
      openGraph: {
        title,
        description,
        type: 'music.playlist',
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
    return { title: 'Playlist' };
  }
}

export default async function PlaylistPage({ params }: PageProps) {
  const { playlistId } = await params;
  let playlist: any = null;

  try {
    const res = await playlistsApi.get(playlistId);
    playlist = res.data ?? null;
  } catch (err) {
    console.error(`Failed to pre-fetch playlist ${playlistId} on server:`, err);
  }

  const songs = playlist?.songs?.map((ps: any) => ps.song).filter(Boolean) || [];
  const playlistSchema = playlist
    ? {
        '@context': 'https://schema.org',
        '@type': 'MusicPlaylist',
        name: playlist.name,
        description: playlist.description || undefined,
        numTracks: songs.length,
        image: playlist.coverUrl || artworkUrl(playlist.imageKey),
        track: songs.map((song: any, i: number) => ({
          '@type': 'MusicRecording',
          position: i + 1,
          name: song.title,
          duration: song.duration ? `PT${Math.floor(song.duration)}S` : undefined,
        })),
      }
    : null;

  return (
    <>
      {playlistSchema && <JsonLd data={playlistSchema} />}
      <PlaylistView playlistId={playlistId} initialPlaylist={playlist} />
    </>
  );
}
