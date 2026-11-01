import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { AppCacheService } from '../common/cache/app-cache.service';
import { nanoid } from 'nanoid';

@Injectable()
export class SongsService {
  private readonly hmacSecret: string;

  constructor(
    private prisma: PrismaService,
    private media: MediaService,
    private cache: AppCacheService,
    private config: ConfigService,
  ) {
    this.hmacSecret = this.config.get<string>('JWT_SECRET') ?? 'sonicly_stream_secret_2026';
  }

  /**
   * Generates a signed, short-lived streaming token valid for 90 seconds.
   */
  generateStreamToken(songId: string): string {
    const expiresAt = Math.floor(Date.now() / 1000) + 90; // 90 seconds
    const data = `${songId}:${expiresAt}`;
    const hash = createHmac('sha256', this.hmacSecret).update(data).digest('hex').slice(0, 32);
    return `${expiresAt}.${hash}`;
  }

  /**
   * Validates a stream token against the song ID and expiration timestamp.
   */
  validateStreamToken(songId: string, token: string): boolean {
    if (!token || !token.includes('.')) return false;
    const [expiresAtStr, hash] = token.split('.');
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Math.floor(Date.now() / 1000) > expiresAt) {
      return false; // Token expired
    }

    const expectedHash = createHmac('sha256', this.hmacSecret)
      .update(`${songId}:${expiresAt}`)
      .digest('hex')
      .slice(0, 32);

    return hash === expectedHash;
  }


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
          collaborations: {
            where: { status: 'ACCEPTED' },
            include: {
              collaborator: { select: { id: true, name: true, imageKey: true } },
            },
          },
          genre: { select: { id: true, name: true } },
          _count: { select: { likes: true } },
        },
      });

      if (!song) return null;
      if (song.album?.isArchived) return null;
      if (song.album?.scheduledPublishAt && song.album.scheduledPublishAt > new Date()) return null;
      return song;
    }, 600);

    if (!baseSong) throw new NotFoundException('Track not found or unavailable');

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
   * Returns song metadata plus the secure backend stream URL with an HMAC token.
   * Note: The raw R2 storage URL is NEVER sent to the client.
   *
   * @param id      Sonicly song ID
   * @param userId  Optional — used to populate the `likes` field
   */
  async getStreamUrl(id: string, userId?: string) {
    const song = await this.findOne(id, userId);
    const token = this.generateStreamToken(id);
    const streamUrl = `/api/songs/${id}/audio?token=${token}`;
    return { ...song, streamUrl };
  }

  /**
   * Proxies audio bytes from R2 directly to the response with HTTP Range support.
   * Requires a valid, unexpired HMAC token to prevent direct downloading/scraping.
   */
  async getAudioStream(id: string, token: string, range?: string) {
    if (!this.validateStreamToken(id, token)) {
      throw new ForbiddenException('Invalid or expired stream token');
    }

    const song = await this.prisma.song.findUnique({
      where: { id },
      select: { id: true, audioKey: true },
    });
    if (!song || !song.audioKey) {
      throw new NotFoundException('Track audio not found');
    }

    return this.media.getObjectStream(song.audioKey, range);
  }

  async like(songId: string, userId: string) {
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    if (!song) throw new NotFoundException('Track not found');

    await this.prisma.like.upsert({
      where: { userId_songId: { userId, songId } },
      create: { id: nanoid(), userId, songId },
      update: {},
    });

    const likeCount = await this.prisma.like.count({ where: { songId } });

    await this.cache.del(`catalog:song:${songId}`);
    if (song.albumId) {
      await this.cache.del(`catalog:album:${song.albumId}`);
    }

    return { liked: true, likeCount };
  }

  async unlike(songId: string, userId: string) {
    const song = await this.prisma.song.findUnique({ where: { id: songId } });
    await this.prisma.like.deleteMany({ where: { userId, songId } });

    const likeCount = await this.prisma.like.count({ where: { songId } });

    await this.cache.del(`catalog:song:${songId}`);
    if (song?.albumId) {
      await this.cache.del(`catalog:album:${song.albumId}`);
    }

    return { liked: false, likeCount };
  }

  async recordPlay(songId: string, userId?: string) {
    const song = await this.prisma.song.findUnique({
      where: { id: songId },
      include: { album: { select: { artistId: true } } },
    });
    if (!song) throw new NotFoundException('Track not found');

    const updatedSong = await this.prisma.song.update({
      where: { id: songId },
      data: { playCount: { increment: 1 } },
      select: { id: true, playCount: true },
    });

    if (userId) {
      await this.prisma.listeningHistory.create({
        data: {
          id: nanoid(),
          userId,
          songId,
        },
      });
    }

    if (song.album?.artistId) {
      const distinctUsers = await this.prisma.listeningHistory.findMany({
        where: {
          song: { album: { artistId: song.album.artistId } },
        },
        distinct: ['userId'],
        select: { userId: true },
      });

      await this.prisma.artist.update({
        where: { id: song.album.artistId },
        data: { monthlyListeners: distinctUsers.length },
      }).catch(() => null);

      await this.cache.del(`catalog:artist:${song.album.artistId}`);
    }

    await this.cache.del(`catalog:song:${songId}`);
    if (song.albumId) {
      await this.cache.del(`catalog:album:${song.albumId}`);
    }

    return { recorded: true, playCount: updatedSong.playCount };
  }
}
