import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppCacheService } from '../common/cache/app-cache.service';

@Injectable()
export class ArtistsService {
  constructor(
    private prisma: PrismaService,
    private cache: AppCacheService,
  ) {}

  async findAll(genreId?: string) {
    const cacheKey = genreId ? `catalog:artists:genre:${genreId}` : 'catalog:artists:all';
    return this.cache.wrap(cacheKey, () => {
      return this.prisma.artist.findMany({
        orderBy: { monthlyListeners: 'desc' },
        include: {
          _count: { select: { albums: true, followers: true } },
        },
      });
    }, 300);
  }

  async findOne(id: string, userId?: string) {
    const baseArtist = await this.cache.wrap(`catalog:artist:${id}`, async () => {
      const artist = await this.prisma.artist.findUnique({
        where: { id },
        include: {
          albums: {
            orderBy: { releaseYear: 'desc' },
            include: { _count: { select: { songs: true } } },
          },
          _count: { select: { followers: true } },
        },
      });

      if (!artist) return null;

      // Get popular songs (top 10 by play count approximation via likes)
      const popularSongs = await this.prisma.song.findMany({
        where: { album: { artistId: id } },
        include: {
          album: {
            select: {
              id: true,
              title: true,
              imageKey: true,
              artist: { select: { id: true, name: true } },
            },
          },
          _count: { select: { likes: true } },
        },
        orderBy: { likes: { _count: 'desc' } },
        take: 10,
      });

      return { ...artist, popularSongs };
    }, 300);

    if (!baseArtist) throw new NotFoundException('Artist not found');

    let isFollowing = false;
    if (userId) {
      const follow = await this.prisma.follow.findUnique({
        where: { userId_artistId: { userId, artistId: id } },
      });
      isFollowing = !!follow;
    }

    return { ...baseArtist, isFollowing };
  }

  async follow(artistId: string, userId: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) throw new NotFoundException('Artist not found');

    const { nanoid } = await import('nanoid');
    await this.prisma.follow.upsert({
      where: { userId_artistId: { userId, artistId } },
      create: { id: nanoid(), userId, artistId },
      update: {},
    });

    return { following: true };
  }

  async unfollow(artistId: string, userId: string) {
    await this.prisma.follow.deleteMany({
      where: { userId, artistId },
    });
    return { following: false };
  }
}
