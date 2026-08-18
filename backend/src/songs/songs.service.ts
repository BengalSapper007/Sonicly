import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { nanoid } from 'nanoid';

@Injectable()
export class SongsService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string, userId?: string) {
    const song = await this.prisma.song.findUnique({
      where: { id },
      include: {
        album: {
          include: {
            artist: { select: { id: true, name: true, imageUrl: true } },
          },
        },
        genre: { select: { id: true, name: true } },
        _count: { select: { likes: true } },
        ...(userId ? { likes: { where: { userId } } } : {}),
      },
    });

    if (!song) throw new NotFoundException('Track not found');
    return song;
  }

  async like(songId: string, userId: string) {
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException('Track not found');

    await this.prisma.like.upsert({
      where: { userId_songId: { userId, songId } },
      create: { id: nanoid(), userId, songId },
      update: {},
    });

    return { liked: true };
  }

  async unlike(songId: string, userId: string) {
    await this.prisma.like.deleteMany({ where: { userId, songId } });
    return { liked: false };
  }
}
