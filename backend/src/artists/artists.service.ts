import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ArtistsService {
  constructor(private prisma: PrismaService) {}

  async findAll(genreId?: string) {
    return this.prisma.artist.findMany({
      orderBy: { monthlyListeners: 'desc' },
      include: {
        _count: { select: { albums: true, followers: true } },
      },
    });
  }

  async findOne(id: string, userId?: string) {
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

    if (!artist) throw new NotFoundException('Artist not found');

    // Get popular songs (top 10 by play count approximation via likes)
    const popularSongs = await this.prisma.song.findMany({
      where: { album: { artistId: id } },
      include: {
        album: { select: { id: true, title: true, imageUrl: true } },
        _count: { select: { likes: true } },
        ...(userId ? { likes: { where: { userId } } } : {}),
      },
      orderBy: { likes: { _count: 'desc' } },
      take: 10,
    });

    let isFollowing = false;
    if (userId) {
      const follow = await this.prisma.follow.findUnique({
        where: { userId_artistId: { userId, artistId: id } },
      });
      isFollowing = !!follow;
    }

    return { ...artist, popularSongs, isFollowing };
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
