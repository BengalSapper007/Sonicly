import { Injectable } from '@nestjs/common';
import { R2MediaProvider } from './providers/r2-media.provider';

/**
 * MediaService — thin facade that delegates all storage operations to
 * R2MediaProvider. The catalog and songs layers interact exclusively with
 * this service; they never touch the SDK directly.
 *
 * Architecture:
 *   AdminCatalogService / SongsService
 *          │
 *          ▼
 *     MediaService        ← this file
 *          │
 *          ▼
 *    R2MediaProvider
 *          │
 *          ▼
 *    Cloudflare R2
 */
@Injectable()
export class MediaService {
  constructor(private readonly r2: R2MediaProvider) {}

  /**
   * Upload an audio file to R2.
   * @returns  The R2 object key, e.g. "audio/tr_abc123.mp3"
   */
  uploadAudio(songId: string, ext: string, buffer: Buffer): Promise<string> {
    return this.r2.uploadAudio(songId, ext, buffer);
  }

  /**
   * Upload artist artwork to R2.
   * @returns  The R2 object key, e.g. "artists/ar_xyz.webp"
   */
  uploadArtistArtwork(
    artistId: string,
    ext: string,
    buffer: Buffer,
  ): Promise<string> {
    return this.r2.uploadArtistArtwork(artistId, ext, buffer);
  }

  /**
   * Upload album artwork to R2.
   * @returns  The R2 object key, e.g. "albums/al_xyz.webp"
   */
  uploadAlbumArtwork(
    albumId: string,
    ext: string,
    buffer: Buffer,
  ): Promise<string> {
    return this.r2.uploadAlbumArtwork(albumId, ext, buffer);
  }

  /** Delete an object from R2 by its key. */
  deleteObject(key: string): Promise<void> {
    return this.r2.deleteObject(key);
  }

  /** Check whether an object exists in R2. */
  objectExists(key: string): Promise<boolean> {
    return this.r2.objectExists(key);
  }

  /**
   * Generate a temporary presigned GET URL for a private R2 object.
   * The URL is safe to send to the browser — it does not expose credentials.
   *
   * @param key        R2 object key (e.g. "audio/tr_abc123.mp3")
   * @param expiresIn  URL lifetime in seconds (default: 3600 / 1 hour)
   */
  getPresignedUrl(key: string, expiresIn?: number): Promise<string> {
    return this.r2.getPresignedUrl(key, expiresIn);
  }
}
