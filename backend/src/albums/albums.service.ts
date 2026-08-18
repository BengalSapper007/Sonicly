import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlbumsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.album.findMany({
      orderBy: { releaseYear: 'desc' },
      include: {
        artist: { select: { id: true, name: true, imageUrl: true } },
        _count: { select: { songs: true } },
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const album = await this.prisma.album.findUnique({
      where: { id },
      include: {
        artist: { select: { id: true, name: true, imageUrl: true, isVerified: true } },
        songs: {
          orderBy: { trackNum: 'asc' },
          include: {
            genre: { select: { id: true, name: true } },
            _count: { select: { likes: true } },
            ...(userId ? { likes: { where: { userId } } } : {}),
          },
        },
      },
    });

    if (!album) throw new NotFoundException('Album not found');

    let isSaved = false;
    if (userId) {
      const saved = await this.prisma.savedAlbum.findUnique({
        where: { userId_albumId: { userId, albumId: id } },
      });
      isSaved = !!saved;
    }

    // Calculate total duration
    const totalDuration = album.songs.reduce((sum, s) => sum + s.duration, 0);

    return { ...album, totalDuration, isSaved };
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
