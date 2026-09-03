import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppCacheService } from '../../common/cache/app-cache.service';

@Injectable()
export class AnalyticsProcessor {
  private readonly logger = new Logger(AnalyticsProcessor.name);

  constructor(
    private prisma: PrismaService,
    private cache: AppCacheService,
  ) {}

  /**
   * Calculate rolling 28-day monthly listeners for an artist.
   */
  async computeMonthlyListeners(payload: { artistId?: string }) {
    const { artistId } = payload;
    this.logger.log(`Computing monthly listeners for artist: ${artistId || 'ALL'}`);

    const twentyEightDaysAgo = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000);

    try {
      if (artistId) {
        // Count distinct users who played songs by this artist in past 28 days
        const distinctUsers = await this.prisma.listeningHistory.findMany({
          where: {
            playedAt: { gte: twentyEightDaysAgo },
            song: { album: { artistId } },
          },
          distinct: ['userId'],
          select: { userId: true },
        });

        const count = distinctUsers.length;
        await this.prisma.artist.update({
          where: { id: artistId },
          data: { monthlyListeners: count },
        });
        this.logger.log(`Updated artist ${artistId} monthly listeners: ${count}`);
      } else {
        // Compute for all artists
        const artists = await this.prisma.artist.findMany({ select: { id: true } });
        for (const artist of artists) {
          await this.computeMonthlyListeners({ artistId: artist.id });
        }
      }
    } catch (err: any) {
      this.logger.error(`Error computing monthly listeners: ${err.message}`);
    }
  }

  /**
   * Compute top trending songs (most played in past 7 days).
   */
  async computeTopCharts() {
    this.logger.log('Computing top trending charts...');
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    try {
      const topPlays = await this.prisma.listeningHistory.groupBy({
        by: ['songId'],
        where: { playedAt: { gte: sevenDaysAgo } },
        _count: { songId: true },
        orderBy: { _count: { songId: 'desc' } },
        take: 50,
      });

      const songIds = topPlays.map((p) => p.songId);
      const topSongs = await this.prisma.song.findMany({
        where: { id: { in: songIds } },
        include: {
          album: {
            include: { artist: { select: { id: true, name: true } } },
          },
          _count: { select: { likes: true } },
        },
      });

      // Cache top charts in Redis / memory for 24h
      await this.cache.set('charts:top-trending', topSongs, 86400);
      this.logger.log(`Top trending chart computed with ${topSongs.length} tracks.`);
      return topSongs;
    } catch (err: any) {
      this.logger.error(`Error computing top charts: ${err.message}`);
    }
  }
}
