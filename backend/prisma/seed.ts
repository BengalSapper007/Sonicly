// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { genres } from './seed-data/genres';
import { artists } from './seed-data/artists';
import { albums } from './seed-data/albums';
import { songs } from './seed-data/songs';
import { playlists } from './seed-data/playlists';

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50));

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter } as any);

  console.log('🌱 Seeding Sonicly database...');

  // ── Genres ────────────────────────────────────────────────────────────────
  console.log('  → Genres');
  for (const genre of genres) {
    await prisma.genre.upsert({
      where: { id: genre.id },
      create: genre,
      update: genre,
    });
  }

  // ── Artists ───────────────────────────────────────────────────────────────
  console.log('  → Artists');
  for (const artist of artists) {
    await prisma.artist.upsert({
      where: { id: artist.id },
      create: artist,
      update: artist,
    });
  }

  // ── Albums ────────────────────────────────────────────────────────────────
  console.log('  → Albums');
  for (const album of albums) {
    await prisma.album.upsert({
      where: { id: album.id },
      create: album,
      update: album,
    });
  }

  // ── Songs ─────────────────────────────────────────────────────────────────
  console.log('  → Songs');
  for (const song of songs) {
    const songData = {
      id: song.id,
      title: song.title,
      duration: song.duration,
      trackNum: song.trackNum,
      albumId: song.albumId,
      genreId: song.genreId,
      audioKey: (song as any).audioKey ?? (song as any).audioUrl ?? `songs/${song.id}.mp3`,
    };
    await prisma.song.upsert({
      where: { id: song.id },
      create: songData,
      update: songData,
    });
  }

  // ── Curated Playlists ─────────────────────────────────────────────────────
  console.log('  → Playlists');
  for (const playlist of playlists) {
    const { songIds, ...playlistData } = playlist;

    await prisma.playlist.upsert({
      where: { id: playlistData.id },
      create: { ...playlistData, userId: null },
      update: { ...playlistData },
    });

    // Delete existing entries to avoid conflicts on re-seed
    await prisma.playlistSong.deleteMany({
      where: { playlistId: playlistData.id },
    });

    // Add songs to playlist
    for (let i = 0; i < songIds.length; i++) {
      const songId = songIds[i];
      const songExists = await prisma.song.findUnique({ where: { id: songId } });
      if (!songExists) {
        console.warn(`    ⚠ Song ${songId} not found — skipping`);
        continue;
      }
      await prisma.playlistSong.create({
        data: {
          id: `ps_${playlistData.id}_${i}`,
          playlistId: playlistData.id,
          songId,
          position: i + 1,
        },
      });
    }
  }

  console.log('✅ Seed complete!');
  console.log(`   ${genres.length} genres`);
  console.log(`   ${artists.length} artists`);
  console.log(`   ${albums.length} albums`);
  console.log(`   ${songs.length} songs`);
  console.log(`   ${playlists.length} curated playlists`);

  await prisma.$disconnect();
  await pool.end();
}

main().catch((e) => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
