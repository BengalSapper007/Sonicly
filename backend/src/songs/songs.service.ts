import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { AppCacheService } from '../common/cache/app-cache.service';
import { nanoid } from 'nanoid';

@Injectable()
export class SongsService {
  constructor(
    private prisma: PrismaService,
    private media: MediaService,
    private cache: AppCacheService,
  ) {}

  async findOne(id: string, userId?: string) {
    const baseSong = await this.cache.wrap(`catalog:song:${id}`, async () => {
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
        },
      });

      if (!song) return null;
      return song;
    }, 600);

    if (!baseSong) throw new NotFoundException('Track not found');

    if (!userId) {
      return baseSong;
    }

    const userLike = await this.prisma.like.findUnique({
      where: { userId_songId: { userId, songId: id } },
    });

    return {
      ...baseSong,
      likes: userLike ? [userLike] : [],
    };
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
    // Presigned R2 URLs last 1 hour; cache for 30 minutes
    const streamUrl = await this.cache.wrap(
      `stream:url:${song.audioKey}`,
      () => this.media.getPresignedUrl(song.audioKey, 3600),
      1800,
    );
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

    await this.cache.del(`catalog:song:${songId}`);
    return { liked: true };
  }

  async unlike(songId: string, userId: string) {
    await this.prisma.like.deleteMany({ where: { userId, songId } });
    await this.cache.del(`catalog:song:${songId}`);
    return { liked: false };
  }
}
