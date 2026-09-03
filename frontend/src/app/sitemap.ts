import type { MetadataRoute } from 'next';
import { albumsApi, artistsApi, playlistsApi } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/albums`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/artists`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/playlists`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/search`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  let albumEntries: MetadataRoute.Sitemap = [];
  let artistEntries: MetadataRoute.Sitemap = [];
  let playlistEntries: MetadataRoute.Sitemap = [];

  try {
    const [albumsRes, artistsRes, playlistsRes] = await Promise.all([
      albumsApi.list(),
      artistsApi.list(),
      playlistsApi.curated(),
    ]);

    albumEntries = (albumsRes.data || []).map((album: any) => ({
      url: `${siteUrl}/album/${album.id}`,
      lastModified: album.updatedAt ? new Date(album.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    artistEntries = (artistsRes.data || []).map((artist: any) => ({
      url: `${siteUrl}/artist/${artist.id}`,
      lastModified: artist.updatedAt ? new Date(artist.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    playlistEntries = (playlistsRes.data || []).map((pl: any) => ({
      url: `${siteUrl}/playlist/${pl.id}`,
      lastModified: pl.updatedAt ? new Date(pl.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (err) {
    console.error('Failed to generate dynamic sitemap entries:', err);
  }

  return [...staticRoutes, ...albumEntries, ...artistEntries, ...playlistEntries];
}
