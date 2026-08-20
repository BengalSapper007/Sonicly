import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MediaService } from '../media/media.service';
import { nanoid } from 'nanoid';
import * as path from 'path';
import { parseBuffer } from 'music-metadata';

export interface CreateSongDto {
  title: string;
  trackNum: number;
  albumId: string;
  genreId: string;
}

export interface CreateArtistDto {
  name: string;
  bio?: string;
  monthlyListeners?: number;
}

export interface CreateAlbumDto {
  title: string;
  artistId: string;
  releaseYear: number;
  type?: 'ALBUM' | 'EP' | 'SINGLE' | 'COMPILATION';
}

const ALLOWED_AUDIO_EXTENSIONS = ['.mp3', '.wav'];
const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];

@Injectable()
export class AdminCatalogService {
  private readonly logger = new Logger(AdminCatalogService.name);

  constructor(
    private prisma: PrismaService,
    private media: MediaService,
  ) {}

  // ── Artists ──────────────────────────────────────────────────────────────

  async createArtist(dto: CreateArtistDto) {
    const id = `ar_${nanoid(10)}`;
    return this.prisma.artist.create({
      data: {
        id,
        name: dto.name,
        bio: dto.bio ?? null,
        monthlyListeners: dto.monthlyListeners ?? 0,
      },
    });
  }

  async uploadArtistArtwork(artistId: string, file: Express.Multer.File) {
    const artist = await this.prisma.artist.findUnique({ where: { id: artistId } });
    if (!artist) throw new NotFoundException(`Artist ${artistId} not found`);

    const ext = this.validateImageExtension(file.originalname);

    // Delete old artwork from R2 if it exists
    if (artist.imageKey) {
      await this.media.deleteObject(artist.imageKey).catch((e) =>
        this.logger.warn(`Could not delete old artist artwork ${artist.imageKey}: ${e}`),
      );
    }

    const imageKey = await this.media.uploadArtistArtwork(artistId, ext, file.buffer);

    return this.prisma.artist.update({
      where: { id: artistId },
      data: { imageKey },
    });
  }

  // ── Albums ────────────────────────────────────────────────────────────────

  async createAlbum(dto: CreateAlbumDto) {
    const artistExists = await this.prisma.artist.findUnique({ where: { id: dto.artistId } });
    if (!artistExists) throw new NotFoundException(`Artist ${dto.artistId} not found`);

    const id = `al_${nanoid(10)}`;
    return this.prisma.album.create({
      data: {
        id,
        title: dto.title,
        artistId: dto.artistId,
        releaseYear: dto.releaseYear,
        type: (dto.type as any) ?? 'ALBUM',
      },
    });
  }

  async uploadAlbumArtwork(albumId: string, file: Express.Multer.File) {
    const album = await this.prisma.album.findUnique({ where: { id: albumId } });
    if (!album) throw new NotFoundException(`Album ${albumId} not found`);

    const ext = this.validateImageExtension(file.originalname);

    // Delete old artwork from R2 if it exists
    if (album.imageKey) {
      await this.media.deleteObject(album.imageKey).catch((e) =>
        this.logger.warn(`Could not delete old album artwork ${album.imageKey}: ${e}`),
      );
    }

    const imageKey = await this.media.uploadAlbumArtwork(albumId, ext, file.buffer);

    return this.prisma.album.update({
      where: { id: albumId },
      data: { imageKey },
    });
  }

  // ── Songs ─────────────────────────────────────────────────────────────────

  async uploadSong(dto: CreateSongDto, file: Express.Multer.File) {
    // Validate album and genre exist
    const [album, genre] = await Promise.all([
      this.prisma.album.findUnique({ where: { id: dto.albumId } }),
      this.prisma.genre.findUnique({ where: { id: dto.genreId } }),
    ]);
    if (!album) throw new NotFoundException(`Album ${dto.albumId} not found`);
    if (!genre) throw new NotFoundException(`Genre ${dto.genreId} not found`);

    // Validate extension
    const ext = this.validateAudioExtension(file.originalname);

    // Extract duration from audio metadata
    let duration = 0;
    try {
      const metadata = await parseBuffer(file.buffer, { mimeType: file.mimetype });
      duration = Math.round(metadata.format.duration ?? 0);
    } catch (e) {
      this.logger.warn(`Could not extract duration from ${file.originalname}: ${e}`);
    }

    // Generate Sonicly song ID and upload to R2
    const id = `tr_${nanoid(12)}`;
    const audioKey = await this.media.uploadAudio(id, ext, file.buffer);

    this.logger.log(`Ingested song: "${dto.title}" → ${audioKey} (${duration}s)`);

    return this.prisma.song.create({
      data: {
        id,
        title: dto.title,
        duration,
        trackNum: dto.trackNum,
        audioKey,
        albumId: dto.albumId,
        genreId: dto.genreId,
      },
      include: {
        album: {
          include: { artist: true },
        },
        genre: true,
      },
    });
  }

  // ── Listing helpers ───────────────────────────────────────────────────────

  async listArtists() {
    return this.prisma.artist.findMany({ orderBy: { name: 'asc' } });
  }

  async listAlbums(artistId?: string) {
    return this.prisma.album.findMany({
      where: artistId ? { artistId } : undefined,
      include: { artist: true },
      orderBy: { releaseYear: 'desc' },
    });
  }

  async listGenres() {
    return this.prisma.genre.findMany({ orderBy: { name: 'asc' } });
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private validateAudioExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    if (!ALLOWED_AUDIO_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(
        `Unsupported audio format "${ext}". Allowed: ${ALLOWED_AUDIO_EXTENSIONS.join(', ')}`
      );
    }
    return ext;
  }

  private validateImageExtension(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      throw new BadRequestException(
        `Unsupported image format "${ext}". Allowed: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`
      );
    }
    return ext;
  }
}
