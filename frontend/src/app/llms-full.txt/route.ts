import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || 'http://localhost:3002';

  const content = `# Sonicly — Full Context & Machine Documentation

Sonicly is a modern audio streaming platform and music listening application built for people who care about sound. Available at ${siteUrl}.

## Catalog Structure
1. **Albums (\`/album/[albumId]\`)**:
   - Represents a musical release containing one or more audio tracks.
   - Contains album title, release year, album type (Album, Single, EP), artwork image, artist reference, and ordered track list.
   - Microdata: Schema.org \`MusicAlbum\` and \`MusicRecording\`.
   - OpenGraph: Dynamic OG images generated per album with artwork, title, and artist name.

2. **Artists (\`/artist/[artistId]\`)**:
   - Represents the creator/performer.
   - Contains artist name, profile artwork, biography, verified badge, monthly listener counts, top 5 popular tracks, and full discography.
   - Microdata: Schema.org \`MusicGroup\`.
   - OpenGraph: Dynamic OG images generated per artist with profile artwork and name.

3. **Playlists (\`/playlist/[playlistId]\`)**:
   - Curated and user-generated collections of tracks.
   - Curated playlists are publicly discoverable at \`/playlists\`.
   - Microdata: Schema.org \`MusicPlaylist\`.

4. **Search (\`/search\`)**:
   - Instant search supporting queries across artists, albums, songs, and playlists.
   - Supports filter tabs: All, Songs, Artists, Albums, Playlists.

## Streaming & Audio Architecture
- Audio streaming uses byte-range requests from Cloudflare R2 object storage via secure presigned streaming endpoints.
- Audio formats supported: High-bitrate MP3, AAC, and lossless master FLAC.
- Player engine: Persistent non-blocking HTML5 audio player supporting seamless gapless track advancement, shuffle, and queue management.

## Authentication & Library
- Stateless JWT authentication delivered via HTTP-only same-origin cookies and Authorization Bearer fallback.
- User library persists liked songs, saved albums, followed artists, and custom user playlists.
- Private routes: \`/library\`, \`/login\`, \`/register\` (not indexed by search engines).

## SEO & Structured Data
- Root structured data: Organization, WebSite (with SearchAction), and WebApplication schemas.
- Per-page structured data: MusicAlbum, MusicRecording, MusicGroup, MusicPlaylist with full property coverage.
- OpenGraph: Dynamic \`og:image\` generation using \`next/og\` ImageResponse for the root page, albums, artists, and playlists.
- Canonical URLs: Self-referencing canonical links on all public pages.
- Favicon: SVG favicon with ICO fallback and Apple Touch Icon support.

## Static Pages
- \`/privacy\` — Privacy Policy
- \`/terms\` — Terms of Service
- \`/cookies\` — Cookie Policy

## Sitemaps & Feeds
- Dynamic Sitemap: ${siteUrl}/sitemap.xml (includes all public static routes and dynamically generated album, artist, and playlist entries)
- Robots Specification: ${siteUrl}/robots.txt
- LLM Context: ${siteUrl}/llms.txt
- LLM Full Context: ${siteUrl}/llms-full.txt
- Core Entry Point: ${siteUrl}/

## Related Products
- Sonicly Studio: ${studioUrl} — Creator portal for artists.
- Studio LLM Context: ${studioUrl}/llms.txt
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
