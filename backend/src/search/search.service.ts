import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type SearchType = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  async search(query: string, type: SearchType = 'all') {
    if (!query || query.trim().length === 0) {
      return { songs: [], artists: [], albums: [], playlists: [] };
    }

    const q = { contains: query, mode: 'insensitive' as const };

    const [songs, artists, albums, playlists] = await Promise.all([
      type === 'all' || type === 'songs'
        ? this.prisma.song.findMany({
            where: { title: q },
            take: 20,
            include: {
              album: {
                include: { artist: { select: { id: true, name: true } } },
              },
            },
          })
        : [],

      type === 'all' || type === 'artists'
        ? this.prisma.artist.findMany({
            where: { name: q },
            take: 10,
          })
        : [],

      type === 'all' || type === 'albums'
        ? this.prisma.album.findMany({
            where: { title: q },
            take: 10,
            include: { artist: { select: { id: true, name: true } } },
          })
        : [],

      type === 'all' || type === 'playlists'
        ? this.prisma.playlist.findMany({
            where: { name: q },
            take: 10,
            include: { _count: { select: { songs: true } } },
          })
        : [],
    ]);

    return { songs, artists, albums, playlists };
  }
}
