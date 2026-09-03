import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppCacheService } from '../common/cache/app-cache.service';
import { nanoid } from 'nanoid';
import { RecordRecentSearchDto, SearchHistoryType } from './dto/recent-search.dto';

type SearchType = 'all' | 'songs' | 'artists' | 'albums' | 'playlists';

const RECENT_SEARCH_INCLUDE = (userId?: string) => ({
  song: {
    include: {
      album: {
        include: { artist: { select: { id: true, name: true } } },
      },
      _count: { select: { likes: true } },
      ...(userId ? { likes: { where: { userId } } } : {}),
    },
  },
  artist: true,
  album: {
    include: { artist: { select: { id: true, name: true } } },
  },
  playlist: {
    include: { _count: { select: { songs: true } } },
  },
});

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);

  constructor(
    private prisma: PrismaService,
    private cache: AppCacheService,
  ) {}

  async search(query: string, type: SearchType = 'all', userId?: string) {
    const trimmed = query?.trim();
    if (!trimmed) {
      return { songs: [], artists: [], albums: [], playlists: [] };
    }

    const cacheKey = `search:${type}:${trimmed.toLowerCase()}${userId ? `:${userId}` : ''}`;
    return this.cache.wrap(
      cacheKey,
      async () => {
        const [songs, artists, albums, playlists] = await Promise.all([
          type === 'all' || type === 'songs' ? this.searchSongsFuzzy(trimmed, userId) : [],
          type === 'all' || type === 'artists' ? this.searchArtistsFuzzy(trimmed) : [],
          type === 'all' || type === 'albums' ? this.searchAlbumsFuzzy(trimmed) : [],
          type === 'all' || type === 'playlists' ? this.searchPlaylistsFuzzy(trimmed) : [],
        ]);

        return { songs, artists, albums, playlists };
      },
      60, // 60 seconds TTL
    );
  }

  // ── Fuzzy Song Search ───────────────────────────────────────────────────

  private async searchSongsFuzzy(query: string, userId?: string) {
    try {
      const raw = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id,
          CASE
            WHEN LOWER(title) = LOWER(${query}) THEN 1.0
            WHEN LOWER(title) LIKE LOWER(${query}) || '%' THEN 0.8
            WHEN LOWER(title) LIKE '%' || LOWER(${query}) || '%' THEN 0.5
            ELSE similarity(title, ${query})
          END as rank_score
        FROM songs
        WHERE title ILIKE '%' || ${query} || '%' OR similarity(title, ${query}) > 0.2
        ORDER BY rank_score DESC
        LIMIT 20;
      `;

      if (raw.length === 0) return [];

      const ids = raw.map((r) => r.id);
      const hydrated = await this.prisma.song.findMany({
        where: { id: { in: ids } },
        include: {
          album: {
            include: { artist: { select: { id: true, name: true } } },
          },
          _count: { select: { likes: true } },
          ...(userId ? { likes: { where: { userId } } } : {}),
        },
      });

      const map = new Map(hydrated.map((s) => [s.id, s]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    } catch (err: any) {
      this.logger.warn(`Trigram song search fallback triggered: ${err.message}`);
      return this.prisma.song.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 20,
        include: {
          album: {
            include: { artist: { select: { id: true, name: true } } },
          },
          _count: { select: { likes: true } },
          ...(userId ? { likes: { where: { userId } } } : {}),
        },
      });
    }
  }

  // ── Fuzzy Artist Search ─────────────────────────────────────────────────

  private async searchArtistsFuzzy(query: string) {
    try {
      const raw = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id,
          CASE
            WHEN LOWER(name) = LOWER(${query}) THEN 1.0
            WHEN LOWER(name) LIKE LOWER(${query}) || '%' THEN 0.8
            WHEN LOWER(name) LIKE '%' || LOWER(${query}) || '%' THEN 0.5
            ELSE similarity(name, ${query})
          END as rank_score
        FROM artists
        WHERE name ILIKE '%' || ${query} || '%' OR similarity(name, ${query}) > 0.2
        ORDER BY rank_score DESC
        LIMIT 10;
      `;

      if (raw.length === 0) return [];

      const ids = raw.map((r) => r.id);
      const hydrated = await this.prisma.artist.findMany({
        where: { id: { in: ids } },
      });

      const map = new Map(hydrated.map((a) => [a.id, a]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    } catch (err: any) {
      this.logger.warn(`Trigram artist search fallback triggered: ${err.message}`);
      return this.prisma.artist.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 10,
      });
    }
  }

  // ── Fuzzy Album Search ──────────────────────────────────────────────────

  private async searchAlbumsFuzzy(query: string) {
    try {
      const raw = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id,
          CASE
            WHEN LOWER(title) = LOWER(${query}) THEN 1.0
            WHEN LOWER(title) LIKE LOWER(${query}) || '%' THEN 0.8
            WHEN LOWER(title) LIKE '%' || LOWER(${query}) || '%' THEN 0.5
            ELSE similarity(title, ${query})
          END as rank_score
        FROM albums
        WHERE title ILIKE '%' || ${query} || '%' OR similarity(title, ${query}) > 0.2
        ORDER BY rank_score DESC
        LIMIT 10;
      `;

      if (raw.length === 0) return [];

      const ids = raw.map((r) => r.id);
      const hydrated = await this.prisma.album.findMany({
        where: { id: { in: ids } },
        include: { artist: { select: { id: true, name: true } } },
      });

      const map = new Map(hydrated.map((al) => [al.id, al]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    } catch (err: any) {
      this.logger.warn(`Trigram album search fallback triggered: ${err.message}`);
      return this.prisma.album.findMany({
        where: { title: { contains: query, mode: 'insensitive' } },
        take: 10,
        include: { artist: { select: { id: true, name: true } } },
      });
    }
  }

  // ── Fuzzy Playlist Search ───────────────────────────────────────────────

  private async searchPlaylistsFuzzy(query: string) {
    try {
      const raw = await this.prisma.$queryRaw<{ id: string }[]>`
        SELECT id,
          CASE
            WHEN LOWER(name) = LOWER(${query}) THEN 1.0
            WHEN LOWER(name) LIKE LOWER(${query}) || '%' THEN 0.8
            ELSE similarity(name, ${query})
          END as rank_score
        FROM playlists
        WHERE name ILIKE '%' || ${query} || '%' OR similarity(name, ${query}) > 0.2
        ORDER BY rank_score DESC
        LIMIT 10;
      `;

      if (raw.length === 0) return [];

      const ids = raw.map((r) => r.id);
      const hydrated = await this.prisma.playlist.findMany({
        where: { id: { in: ids } },
        include: { _count: { select: { songs: true } } },
      });

      const map = new Map(hydrated.map((pl) => [pl.id, pl]));
      return ids.map((id) => map.get(id)).filter(Boolean);
    } catch (err: any) {
      this.logger.warn(`Trigram playlist search fallback triggered: ${err.message}`);
      return this.prisma.playlist.findMany({
        where: { name: { contains: query, mode: 'insensitive' } },
        take: 10,
        include: { _count: { select: { songs: true } } },
      });
    }
  }

  // ── Recent Searches Management ──────────────────────────────────────────

  async getRecentSearches(userId: string, limit = 10) {
    const raw = await this.prisma.searchHistory.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      include: RECENT_SEARCH_INCLUDE(userId),
    });

    return raw.filter((entry) => {
      if (entry.type === 'SONG' && !entry.song) return false;
      if (entry.type === 'ARTIST' && !entry.artist) return false;
      if (entry.type === 'ALBUM' && !entry.album) return false;
      if (entry.type === 'PLAYLIST' && !entry.playlist) return false;
      return true;
    });
  }

  async recordRecentSearch(userId: string, dto: RecordRecentSearchDto) {
    let existing;

    if (dto.type === SearchHistoryType.QUERY && dto.query) {
      existing = await this.prisma.searchHistory.findFirst({
        where: {
          userId,
          type: 'QUERY',
          query: { equals: dto.query.trim(), mode: 'insensitive' },
        },
      });
    } else if (dto.type === SearchHistoryType.SONG && dto.songId) {
      existing = await this.prisma.searchHistory.findFirst({
        where: { userId, type: 'SONG', songId: dto.songId },
      });
    } else if (dto.type === SearchHistoryType.ARTIST && dto.artistId) {
      existing = await this.prisma.searchHistory.findFirst({
        where: { userId, type: 'ARTIST', artistId: dto.artistId },
      });
    } else if (dto.type === SearchHistoryType.ALBUM && dto.albumId) {
      existing = await this.prisma.searchHistory.findFirst({
        where: { userId, type: 'ALBUM', albumId: dto.albumId },
      });
    } else if (dto.type === SearchHistoryType.PLAYLIST && dto.playlistId) {
      existing = await this.prisma.searchHistory.findFirst({
        where: { userId, type: 'PLAYLIST', playlistId: dto.playlistId },
      });
    }

    if (existing) {
      return this.prisma.searchHistory.update({
        where: { id: existing.id },
        data: { updatedAt: new Date() },
        include: RECENT_SEARCH_INCLUDE(userId),
      });
    }

    const id = `sh_${nanoid(10)}`;
    const created = await this.prisma.searchHistory.create({
      data: {
        id,
        userId,
        type: dto.type,
        query: dto.query?.trim() ?? null,
        songId: dto.songId ?? null,
        artistId: dto.artistId ?? null,
        albumId: dto.albumId ?? null,
        playlistId: dto.playlistId ?? null,
      },
      include: RECENT_SEARCH_INCLUDE(userId),
    });

    // Prune older records beyond 20
    const count = await this.prisma.searchHistory.count({ where: { userId } });
    if (count > 20) {
      const oldItems = await this.prisma.searchHistory.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
        skip: 20,
        select: { id: true },
      });
      if (oldItems.length > 0) {
        await this.prisma.searchHistory.deleteMany({
          where: { id: { in: oldItems.map((item) => item.id) } },
        });
      }
    }

    return created;
  }

  async removeRecentSearch(userId: string, id: string) {
    return this.prisma.searchHistory.deleteMany({
      where: { id, userId },
    });
  }

  async clearRecentSearches(userId: string) {
    return this.prisma.searchHistory.deleteMany({
      where: { userId },
    });
  }
}
