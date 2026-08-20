import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { nanoid } from 'nanoid';

@Injectable()
export class SongsService {
  constructor(
    private prisma: PrismaService,
    private media: MediaService,
  ) {}

  async findOne(id: string, userId?: string) {
    const song = await this.prisma.song.findUnique({
      where: { id },
      include: {
        album: {
          include: {
            artist: { select: { id: true, name: true, imageKey: true } },
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

  /**
   * Returns song metadata plus a short-lived presigned R2 stream URL.
   * The URL is safe to send to the browser — it carries no credentials.
   *
   * @param id      Sonicly song ID
   * @param userId  Optional — used to populate the `likes` field
   */
  async getStreamUrl(id: string, userId?: string) {
    const song = await this.findOne(id, userId);
    const streamUrl = await this.media.getPresignedUrl(song.audioKey);
    return { ...song, streamUrl };
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
