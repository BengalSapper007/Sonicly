import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

const SONG_SELECT = {
  id: true,
  title: true,
  duration: true,
  audioUrl: true,
  trackNum: true,
  album: {
    select: {
      id: true,
      title: true,
      imageUrl: true,
      artist: { select: { id: true, name: true } },
    },
  },
};

@Injectable()
export class LibraryService {
  constructor(private prisma: PrismaService) {}

  async getLikedSongs(userId: string) {
    const likes = await this.prisma.like.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        song: { select: { ...SONG_SELECT, likes: { where: { userId } } } },
      },
    });
    return likes.map((l) => l.song);
  }

  async getSavedAlbums(userId: string) {
    const saved = await this.prisma.savedAlbum.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        album: {
          include: {
            artist: { select: { id: true, name: true, imageUrl: true } },
            _count: { select: { songs: true } },
          },
        },
      },
    });
    return saved.map((s) => s.album);
  }

  async getFollowedArtists(userId: string) {
    const follows = await this.prisma.follow.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        artist: {
          include: {
            _count: { select: { followers: true, albums: true } },
          },
        },
      },
    });
    return follows.map((f) => f.artist);
  }
}
