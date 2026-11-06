import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateJamDto } from './dto/create-jam.dto';
import { UpdateJamDto } from './dto/update-jam.dto';

@Injectable()
export class JamService {
  private readonly logger = new Logger(JamService.name);

  constructor(private readonly prisma: PrismaService) {}

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'JAM-';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  async createJam(hostId: string, dto: CreateJamDto) {
    // End any existing active jams hosted by this user
    await this.prisma.jamSession.updateMany({
      where: { hostId, isActive: true },
      data: { isActive: false, endedAt: new Date() },
    });

    let code = this.generateCode();
    // Ensure code uniqueness
    let exists = await this.prisma.jamSession.findUnique({ where: { code } });
    let attempts = 0;
    while (exists && attempts < 10) {
      code = this.generateCode();
      exists = await this.prisma.jamSession.findUnique({ where: { code } });
      attempts++;
    }

    const jam = await this.prisma.jamSession.create({
      data: {
        code,
        hostId,
        hostControlsOnly: dto.hostControlsOnly ?? false,
        currentSongId: dto.initialSongId ?? null,
        isPlaying: Boolean(dto.initialSongId),
        participants: {
          create: {
            userId: hostId,
            role: 'HOST',
          },
        },
      },
      include: {
        host: {
          select: { id: true, username: true, displayName: true, imageUrl: true },
        },
        participants: {
          include: {
            user: {
              select: { id: true, username: true, displayName: true, imageUrl: true },
            },
          },
        },
        currentSong: {
          include: {
            album: {
              select: { id: true, title: true, imageKey: true, artist: { select: { id: true, name: true } } },
            },
          },
        },
      },
    });

    return jam;
  }

  async getJamByCode(code: string) {
    const jam = await this.prisma.jamSession.findUnique({
      where: { code },
      include: {
        host: {
          select: { id: true, username: true, displayName: true, imageUrl: true },
        },
        participants: {
          include: {
            user: {
              select: { id: true, username: true, displayName: true, imageUrl: true },
            },
          },
          orderBy: { joinedAt: 'asc' },
        },
        currentSong: {
          include: {
            album: {
              select: { id: true, title: true, imageKey: true, artist: { select: { id: true, name: true } } },
            },
          },
        },
        queueItems: {
          include: {
            song: {
              include: {
                album: {
                  select: { id: true, title: true, imageKey: true, artist: { select: { id: true, name: true } } },
                },
              },
            },
            addedBy: {
              select: { id: true, username: true, displayName: true, imageUrl: true },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!jam || !jam.isActive) {
      throw new NotFoundException(`Jam session '${code}' was not found or has ended.`);
    }

    return jam;
  }

  async joinJam(userId: string, code: string) {
    const jam = await this.prisma.jamSession.findUnique({
      where: { code },
    });

    if (!jam || !jam.isActive) {
      throw new NotFoundException(`Jam session '${code}' is inactive or does not exist.`);
    }

    // Upsert participant
    await this.prisma.jamParticipant.upsert({
      where: {
        jamId_userId: {
          jamId: jam.id,
          userId,
        },
      },
      create: {
        jamId: jam.id,
        userId,
        role: jam.hostId === userId ? 'HOST' : 'GUEST',
      },
      update: {},
    });

    return this.getJamByCode(code);
  }

  async leaveJam(userId: string, code: string) {
    const jam = await this.prisma.jamSession.findUnique({
      where: { code },
      include: {
        participants: {
          orderBy: { joinedAt: 'asc' },
        },
      },
    });

    if (!jam || !jam.isActive) {
      return { success: true };
    }

    await this.prisma.jamParticipant.deleteMany({
      where: {
        jamId: jam.id,
        userId,
      },
    });

    // If host left
    if (jam.hostId === userId) {
      const remaining = jam.participants.filter((p) => p.userId !== userId);
      if (remaining.length > 0) {
        // Promote next participant to host
        const newHost = remaining[0];
        await this.prisma.jamSession.update({
          where: { id: jam.id },
          data: { hostId: newHost.userId },
        });
        await this.prisma.jamParticipant.update({
          where: { id: newHost.id },
          data: { role: 'HOST' },
        });
      } else {
        // End the jam
        await this.prisma.jamSession.update({
          where: { id: jam.id },
          data: { isActive: false, endedAt: new Date() },
        });
      }
    }

    return { success: true };
  }

  async updateJam(userId: string, code: string, dto: UpdateJamDto) {
    const jam = await this.getJamByCode(code);

    const isHost = jam.hostId === userId;
    if (jam.hostControlsOnly && !isHost) {
      throw new ForbiddenException('Only the host can modify playback or settings for this Jam.');
    }

    const updated = await this.prisma.jamSession.update({
      where: { id: jam.id },
      data: {
        ...(dto.hostControlsOnly !== undefined && isHost ? { hostControlsOnly: dto.hostControlsOnly } : {}),
        ...(dto.currentSongId !== undefined ? { currentSongId: dto.currentSongId } : {}),
        ...(dto.currentPositionMs !== undefined ? { currentPositionMs: dto.currentPositionMs } : {}),
        ...(dto.isPlaying !== undefined ? { isPlaying: dto.isPlaying } : {}),
        ...(dto.isActive !== undefined && isHost ? { isActive: dto.isActive, endedAt: dto.isActive ? null : new Date() } : {}),
        lastSyncAt: new Date(),
      },
    });

    return this.getJamByCode(code);
  }

  async addToQueue(userId: string, code: string, songId: string) {
    const jam = await this.getJamByCode(code);

    // Verify user is a participant
    const isParticipant = jam.participants.some((p) => p.userId === userId);
    if (!isParticipant) {
      throw new ForbiddenException('You must join the Jam to add songs to the queue.');
    }

    const lastItem = await this.prisma.jamQueueItem.findFirst({
      where: { jamId: jam.id },
      orderBy: { order: 'desc' },
    });

    const newOrder = (lastItem?.order ?? -1) + 1;

    const item = await this.prisma.jamQueueItem.create({
      data: {
        jamId: jam.id,
        songId,
        addedById: userId,
        order: newOrder,
      },
      include: {
        song: {
          include: {
            album: {
              select: { id: true, title: true, imageKey: true, artist: { select: { id: true, name: true } } },
            },
          },
        },
        addedBy: {
          select: { id: true, username: true, displayName: true, imageUrl: true },
        },
      },
    });

    return item;
  }

  async removeFromQueue(userId: string, code: string, queueItemId: string) {
    const jam = await this.getJamByCode(code);

    const item = await this.prisma.jamQueueItem.findUnique({
      where: { id: queueItemId },
    });

    if (!item || item.jamId !== jam.id) {
      throw new NotFoundException('Queue item not found in this Jam.');
    }

    const isHost = jam.hostId === userId;
    const isAdder = item.addedById === userId;

    if (!isHost && !isAdder && jam.hostControlsOnly) {
      throw new ForbiddenException('You do not have permission to remove this track.');
    }

    await this.prisma.jamQueueItem.delete({
      where: { id: queueItemId },
    });

    return { success: true };
  }

  async popNextQueueSong(code: string) {
    const jam = await this.getJamByCode(code);

    const nextItem = await this.prisma.jamQueueItem.findFirst({
      where: { jamId: jam.id },
      orderBy: { order: 'asc' },
      include: {
        song: {
          include: {
            album: {
              select: { id: true, title: true, imageKey: true, artist: { select: { id: true, name: true } } },
            },
          },
        },
      },
    });

    if (!nextItem) {
      return null;
    }

    // Remove from queue and set as current
    await this.prisma.$transaction([
      this.prisma.jamQueueItem.delete({ where: { id: nextItem.id } }),
      this.prisma.jamSession.update({
        where: { id: jam.id },
        data: {
          currentSongId: nextItem.songId,
          currentPositionMs: 0,
          isPlaying: true,
          lastSyncAt: new Date(),
        },
      }),
    ]);

    return nextItem.song;
  }
}

