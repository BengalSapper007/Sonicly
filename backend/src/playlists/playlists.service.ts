import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppCacheService } from '../common/cache/app-cache.service';
import { nanoid } from 'nanoid';
import { CreatePlaylistDto, UpdatePlaylistDto, AddSongDto, ReorderSongsDto } from './dto/playlist.dto';

const SONG_INCLUDE = {
  song: {
    include: {
      album: {
        include: {
          artist: { select: { id: true, name: true } },
        },
      },
      genre: { select: { id: true, name: true } },
      _count: { select: { likes: true } },
    },
  },
};

@Injectable()
export class PlaylistsService {
  constructor(
    private prisma: PrismaService,
    private cache: AppCacheService,
  ) {}

  async getUserPlaylists(userId: string) {
    return this.prisma.playlist.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { songs: true } },
      },
    });
  }

  async getCuratedPlaylists() {
    return this.cache.wrap('catalog:playlists:curated', () => {
      return this.prisma.playlist.findMany({
        where: { isCurated: true },
        orderBy: { name: 'asc' },
        include: { _count: { select: { songs: true } } },
      });
    }, 300);
  }

  async create(dto: CreatePlaylistDto, userId: string) {
    return this.prisma.playlist.create({
      data: {
        id: nanoid(),
        name: dto.name,
        description: dto.description,
        userId,
      },
    });
  }

  async findOne(id: string, userId?: string) {
    if (!userId) {
      const cached = await this.cache.wrap(`catalog:playlist:${id}`, async () => {
        const playlist = await this.prisma.playlist.findUnique({
          where: { id },
          include: {
            user: { select: { id: true, username: true, displayName: true } },
            songs: {
              orderBy: { position: 'asc' },
              include: {
                ...SONG_INCLUDE,
              },
            },
            _count: { select: { songs: true } },
          },
        });
        return playlist;
      }, 300);

      if (!cached) throw new NotFoundException('Playlist not found');
      return cached;
    }

    const playlist = await this.prisma.playlist.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, username: true, displayName: true } },
        songs: {
          orderBy: { position: 'asc' },
          include: {
            ...SONG_INCLUDE,
            ...(userId
              ? {
                  song: {
                    include: {
                      album: {
                        include: { artist: { select: { id: true, name: true } } },
                      },
                      genre: { select: { id: true, name: true } },
                      _count: { select: { likes: true } },
                      likes: { where: { userId } },
                    },
                  },
                }
              : {}),
          },
        },
        _count: { select: { songs: true } },
      },
    });

    if (!playlist) throw new NotFoundException('Playlist not found');
    return playlist;
  }

  async update(id: string, dto: UpdatePlaylistDto, userId: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    if (playlist.userId !== userId) throw new ForbiddenException('Not your playlist');
    if (playlist.isCurated) throw new ForbiddenException('Cannot edit curated playlists');

    return this.prisma.playlist.update({
      where: { id },
      data: { ...dto },
    });
  }

  async delete(id: string, userId: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    if (playlist.userId !== userId) throw new ForbiddenException('Not your playlist');
    if (playlist.isCurated) throw new ForbiddenException('Cannot delete curated playlists');

    await this.prisma.playlist.delete({ where: { id } });
    return { deleted: true };
  }

  async addSong(playlistId: string, dto: AddSongDto, userId: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    if (playlist.userId !== userId) throw new ForbiddenException('Not your playlist');

    const song = await this.prisma.song.findUnique({ where: { id: dto.songId } });
    if (!song) throw new NotFoundException('Track not found');

    const lastEntry = await this.prisma.playlistSong.findFirst({
      where: { playlistId },
      orderBy: { position: 'desc' },
    });

    await this.prisma.playlistSong.upsert({
      where: { playlistId_songId: { playlistId, songId: dto.songId } },
      create: {
        id: nanoid(),
        playlistId,
        songId: dto.songId,
        position: (lastEntry?.position ?? 0) + 1,
      },
      update: {},
    });

    return { added: true };
  }

  async removeSong(playlistId: string, songId: string, userId: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    if (playlist.userId !== userId) throw new ForbiddenException('Not your playlist');

    await this.prisma.playlistSong.deleteMany({ where: { playlistId, songId } });
    return { removed: true };
  }

  async reorderSongs(playlistId: string, dto: ReorderSongsDto, userId: string) {
    const playlist = await this.prisma.playlist.findUnique({ where: { id: playlistId } });
    if (!playlist) throw new NotFoundException('Playlist not found');
    if (playlist.userId !== userId) throw new ForbiddenException('Not your playlist');

    await Promise.all(
      dto.songIds.map((songId, index) =>
        this.prisma.playlistSong.updateMany({
          where: { playlistId, songId },
          data: { position: index + 1 },
        }),
      ),
    );

    return { reordered: true };
  }
}
