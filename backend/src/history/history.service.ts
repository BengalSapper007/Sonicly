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
    return { recorded: true };
  }
}
