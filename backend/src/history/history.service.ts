import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { nanoid } from 'nanoid';

@Injectable()
export class HistoryService {
  constructor(private prisma: PrismaService) {}

  async getHistory(userId: string) {
    const history = await this.prisma.listeningHistory.findMany({
      where: { userId },
      orderBy: { playedAt: 'desc' },
      take: 50,
      distinct: ['songId'],
      include: {
        song: {
          include: {
            album: {
              include: {
                artist: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
    return history.map((h) => ({ ...h.song, playedAt: h.playedAt }));
  }

  async recordPlay(userId: string, songId: string) {
    await this.prisma.listeningHistory.create({
      data: {
        id: nanoid(),
        userId,
        songId,
      },
    });

    const song = await this.prisma.song.update({
      where: { id: songId },
      data: { playCount: { increment: 1 } },
      include: { album: { select: { artistId: true } } },
    }).catch(() => null);

    if (song?.album?.artistId) {
      const twentyEightDaysAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);
      const distinctUsers = await this.prisma.listeningHistory.findMany({
        where: {
          playedAt: { gte: twentyEightDaysAgo },
          song: { album: { artistId: song.album.artistId } },
        },
        distinct: ['userId'],
        select: { userId: true },
      });

      await this.prisma.artist.update({
        where: { id: song.album.artistId },
        data: { monthlyListeners: distinctUsers.length },
      }).catch(() => null);
    }

    return { recorded: true, playCount: song?.playCount };
  }
}
