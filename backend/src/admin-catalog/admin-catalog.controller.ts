import {
  Controller, Get, Post, Param, Body,
  UseGuards, UseInterceptors, UploadedFile,
  ParseIntPipe, ParseFilePipe, MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AdminKeyGuard } from '../common/guards/admin-key.guard';
import { Public } from '../common/decorators/public.decorator';
import { AdminCatalogService } from './admin-catalog.service';
import type { CreateSongDto, CreateArtistDto, CreateAlbumDto } from './admin-catalog.service';

// 200 MB limit for audio files
const AUDIO_MAX_BYTES = 200 * 1024 * 1024;
// 10 MB limit for images
const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

/**
 * Internal admin catalog ingestion endpoints.
 * All routes require x-admin-key header (AdminKeyGuard).
 * @Public() skips JwtAuthGuard; AdminKeyGuard provides its own auth.
 */
@Public()
@UseGuards(AdminKeyGuard)
@Controller('admin/catalog')
export class AdminCatalogController {
  constructor(private service: AdminCatalogService) {}

  // ── Reference data ──────────────────────────────────────────────────────

  @Get('artists')
  listArtists() {
    return this.service.listArtists();
  }

  @Get('albums')
  listAlbums() {
    return this.service.listAlbums();
  }

  @Get('genres')
  listGenres() {
    return this.service.listGenres();
  }

  // ── Artist ingestion ─────────────────────────────────────────────────────

  @Post('artists')
  createArtist(@Body() dto: CreateArtistDto) {
    return this.service.createArtist(dto);
  }

  @Post('artists/:id/artwork')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadArtistArtwork(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: IMAGE_MAX_BYTES })],
      })
    ) file: Express.Multer.File,
  ) {
    return this.service.uploadArtistArtwork(id, file);
  }

  // ── Album ingestion ───────────────────────────────────────────────────────

  @Post('albums')
  createAlbum(@Body() dto: CreateAlbumDto) {
    return this.service.createAlbum(dto);
  }

  @Post('albums/:id/artwork')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadAlbumArtwork(
    @Param('id') id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: IMAGE_MAX_BYTES })],
      })
    ) file: Express.Multer.File,
  ) {
    return this.service.uploadAlbumArtwork(id, file);
  }

  // ── Song ingestion ─────────────────────────────────────────────────────────

  /**
   * POST /api/admin/catalog/songs
   *
   * multipart/form-data fields:
   *   file      — audio file (mp3 or wav)
   *   title     — song title
   *   trackNum  — track number
   *   albumId   — Sonicly album ID
   *   genreId   — Sonicly genre ID
   */
  @Post('songs')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  uploadSong(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: AUDIO_MAX_BYTES })],
      })
    ) file: Express.Multer.File,
    @Body('title') title: string,
    @Body('trackNum', ParseIntPipe) trackNum: number,
    @Body('albumId') albumId: string,
    @Body('genreId') genreId: string,
  ) {
    return this.service.uploadSong({ title, trackNum, albumId, genreId }, file);
  }
}
