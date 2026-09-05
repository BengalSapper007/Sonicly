import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppCacheService } from '../common/cache/app-cache.service';

@Injectable()
export class AlbumsService {
  constructor(
    private prisma: PrismaService,
    private cache: AppCacheService,
  ) {}

  async findAll() {
    return this.cache.wrap('catalog:albums:all', () => {
      return this.prisma.album.findMany({
        orderBy: { releaseYear: 'desc' },
        include: {
          artist: { select: { id: true, name: true, imageKey: true } },
          _count: { select: { songs: true } },
        },
      });
    }, 300);
  }

  async findOne(id: string, userId?: string) {
    const baseAlbum = await this.cache.wrap(`catalog:album:${id}`, async () => {
      const album = await this.prisma.album.findUnique({
        where: { id },
        include: {
          artist: { select: { id: true, name: true, imageKey: true, isVerified: true } },
          songs: {
            orderBy: { trackNum: 'asc' },
            include: {
              genre: { select: { id: true, name: true } },
              _count: { select: { likes: true } },
            },
          },
        },
      });

      if (!album) return null;

      // Calculate total duration
      const totalDuration = album.songs.reduce((sum, s) => sum + s.duration, 0);

      // Ensure album artwork and metadata are attached to every song on the album
      const songs = album.songs.map((s) => ({
        ...s,
        album: {
          id: album.id,
          title: album.title,
          imageKey: album.imageKey,
          artist: {
            id: album.artist.id,
            name: album.artist.name,
          },
        },
      }));

      return { ...album, songs, totalDuration };
    }, 300);

    if (!baseAlbum) throw new NotFoundException('Album not found');

    let isSaved = false;
    if (userId) {
      const saved = await this.prisma.savedAlbum.findUnique({
        where: { userId_albumId: { userId, albumId: id } },
      });
      isSaved = !!saved;
    }

    return { ...baseAlbum, isSaved };
  }

  async save(albumId: string, userId: string) {
    const album = await this.prisma.album.findUnique({ where: { id: albumId } });
    if (!album) throw new NotFoundException('Album not found');
    const { nanoid } = await import('nanoid');
    await this.prisma.savedAlbum.upsert({
      where: { userId_albumId: { userId, albumId } },
      create: { id: nanoid(), userId, albumId },
      update: {},
    });
    return { saved: true };
  }

  async unsave(albumId: string, userId: string) {
    await this.prisma.savedAlbum.deleteMany({ where: { userId, albumId } });
    return { saved: false };
  }
}
