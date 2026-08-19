import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'path';
import * as fs from 'fs/promises';
import { createReadStream, existsSync } from 'fs';

export type MediaType = 'audio' | 'albums' | 'artists';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly mediaRoot: string;

  constructor(private config: ConfigService) {
    // media/ is at the monorepo root — two levels above backend/src
    this.mediaRoot = this.config.get<string>('MEDIA_ROOT') ||
      path.resolve(process.cwd(), '..', 'media');
  }

  /** Absolute path to the media root directory */
  get root(): string {
    return this.mediaRoot;
  }

  /** Absolute path for a given media type subdirectory */
  dirFor(type: MediaType): string {
    return path.join(this.mediaRoot, type);
  }

  /** Absolute path for a specific media file */
  pathFor(type: MediaType, filename: string): string {
    return path.join(this.dirFor(type), filename);
  }

  /** Public URL path for a media file (served at /media/*) */
  urlFor(type: MediaType, filename: string): string {
    return `/media/${type}/${filename}`;
  }

  /** Save a buffer to the media filesystem */
  async save(type: MediaType, filename: string, buffer: Buffer): Promise<string> {
    await fs.mkdir(this.dirFor(type), { recursive: true });
    const dest = this.pathFor(type, filename);
    await fs.writeFile(dest, buffer);
    this.logger.log(`Saved media: ${dest}`);
    return this.urlFor(type, filename);
  }

  /** Delete a media file */
  async delete(type: MediaType, filename: string): Promise<void> {
    const target = this.pathFor(type, filename);
    if (existsSync(target)) {
      await fs.unlink(target);
      this.logger.log(`Deleted media: ${target}`);
    }
  }

  /** Replace (delete old, save new) a media file */
  async replace(type: MediaType, oldFilename: string | null, newFilename: string, buffer: Buffer): Promise<string> {
    if (oldFilename) {
      await this.delete(type, oldFilename).catch(() => {});
    }
    return this.save(type, newFilename, buffer);
  }

  /** Extract filename from a stored mediaUrl like /media/audio/abc.mp3 */
  filenameFromUrl(url: string): string {
    return path.basename(url);
  }
}
