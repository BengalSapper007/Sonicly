import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdatePlaybackStateDto } from './dto/update-playback.dto';

@Injectable()
export class PlayerService {
  constructor(private prisma: PrismaService) {}

  async getState(userId: string) {
    const state = await this.prisma.playbackState.findUnique({
      where: { userId },
      include: {
        song: {
          include: {
            album: {
              include: {
                artist: { select: { id: true, name: true, imageKey: true } },
              },
            },
            genre: { select: { id: true, name: true } },
            _count: { select: { likes: true } },
            likes: { where: { userId } },
          },
        },
      },
    });

    if (!state) return null;

    let queue: any[] = [];
    let userQueue: any[] = [];

    if (state.queueJson) {
      try {
        queue = JSON.parse(state.queueJson);
      } catch {
        queue = [];
      }
    }

    if (state.userQueueJson) {
      try {
        userQueue = JSON.parse(state.userQueueJson);
      } catch {
        userQueue = [];
      }
    }

    return {
      userId: state.userId,
      currentSong: state.song,
      currentTime: state.currentTime,
      duration: state.duration,
      progress: state.progress,
      contextType: state.contextType,
      contextId: state.contextId,
      contextTitle: state.contextTitle,
      currentIndex: state.currentIndex,
      queue,
      userQueue,
      volume: state.volume,
      shuffle: state.shuffle,
      repeat: state.repeat,
      activeDeviceId: state.activeDeviceId,
      updatedAt: state.updatedAt,
    };
  }

  async updateState(userId: string, dto: UpdatePlaybackStateDto) {
    const queueJson = dto.queue !== undefined ? JSON.stringify(dto.queue) : undefined;
    const userQueueJson = dto.userQueue !== undefined ? JSON.stringify(dto.userQueue) : undefined;

    const data: any = {
      currentTime: dto.currentTime,
      duration: dto.duration,
      progress: dto.progress,
      contextType: dto.contextType,
      contextId: dto.contextId,
      contextTitle: dto.contextTitle,
      currentIndex: dto.currentIndex,
      volume: dto.volume,
      shuffle: dto.shuffle,
      repeat: dto.repeat,
      activeDeviceId: dto.activeDeviceId,
    };

    if (dto.songId !== undefined) {
      data.songId = dto.songId;
    }
    if (queueJson !== undefined) {
      data.queueJson = queueJson;
    }
    if (userQueueJson !== undefined) {
      data.userQueueJson = userQueueJson;
    }

    // Clean undefined fields
    Object.keys(data).forEach((key) => data[key] === undefined && delete data[key]);

    const state = await this.prisma.playbackState.upsert({
      where: { userId },
      create: {
        userId,
        ...data,
      },
      update: {
        ...data,
      },
      include: {
        song: {
          include: {
            album: {
              include: {
                artist: { select: { id: true, name: true, imageKey: true } },
              },
            },
            genre: { select: { id: true, name: true } },
            _count: { select: { likes: true } },
            likes: { where: { userId } },
          },
        },
      },
    });

    return {
      success: true,
      updatedAt: state.updatedAt,
    };
  }
}
