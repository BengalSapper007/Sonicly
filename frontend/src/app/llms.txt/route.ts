import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const studioUrl = process.env.NEXT_PUBLIC_STUDIO_URL || 'http://localhost:3002';

  const content = `# Sonicly

> High-fidelity music streaming and catalog exploration built for sound enthusiasts.

## Overview
Sonicly is an independent, premium music streaming platform focused on high-quality sound, artist discographies, curated playlists, and distraction-free audio exploration. Available at ${siteUrl}.

## Public Navigation & Catalog
- [Home](${siteUrl}/): Featured releases, jump-back-in queues, new releases, and artist spotlights.
- [Albums Directory](${siteUrl}/albums): Complete catalog of full-length albums, EPs, and singles across genres.
- [Artists Directory](${siteUrl}/artists): Independent and verified artist profiles, bios, popular tracks, and discographies.
- [Playlists Directory](${siteUrl}/playlists): Handpicked thematic playlists, mood mixes, and curated collections.
- [Search](${siteUrl}/search): Global instant search across songs, artists, albums, and playlists.
- [Privacy Policy](${siteUrl}/privacy): Privacy policy and data handling practices.
- [Terms of Service](${siteUrl}/terms): Terms and conditions for using Sonicly.
- [Cookie Policy](${siteUrl}/cookies): Cookie usage and consent information.

## Core Features
- **High-Fidelity Audio**: Low-latency master audio streaming with Cloudflare R2 object storage. Supports MP3, AAC, and lossless FLAC.
- **Liner-Notes Experience**: Warm editorial aesthetic inspired by vintage liner notes and vinyl typography.
- **Personal Library**: Liked tracks, saved albums, followed artists, and customizable playlist queueing.
- **Full SEO & Semantic Metadata**: OpenGraph media cards, JSON-LD MusicAlbum and MusicGroup schemas, and self-referencing canonical links.
- **Gapless Playback**: Persistent HTML5 audio player with seamless track advancement, shuffle, and queue management.

## Technical Details
- Architecture: Next.js 16 (App Router) + NestJS + PostgreSQL (Prisma ORM) + BullMQ + Redis + Cloudflare R2
- Structured Data: Schema.org \`MusicAlbum\`, \`MusicRecording\`, \`MusicGroup\`, \`MusicPlaylist\`, \`Organization\`, \`WebSite\`, \`WebApplication\`
- Sitemaps: ${siteUrl}/sitemap.xml
- Robots: ${siteUrl}/robots.txt
- Comprehensive Details: ${siteUrl}/llms-full.txt

## Related Products
- [Sonicly Studio](${studioUrl}): Creator portal for artists to self-publish music, inspect streaming analytics, and manage collaborations.
- Sonicly Studio Details: ${studioUrl}/llms.txt
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}
