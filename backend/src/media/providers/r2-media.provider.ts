import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import type { IMediaProvider } from '../media.interface';

@Injectable()
export class R2MediaProvider implements IMediaProvider {
  private readonly logger = new Logger(R2MediaProvider.name);
  private readonly client: S3Client;
  private readonly bucket: string;
  private readonly defaultExpiry: number;

  constructor(private config: ConfigService) {
    const accountId = this.config.getOrThrow<string>('R2_ACCOUNT_ID');
    const endpoint =
      this.config.get<string>('R2_ENDPOINT') ??
      `https://${accountId}.r2.cloudflarestorage.com`;

    this.bucket = this.config.getOrThrow<string>('R2_BUCKET_NAME');
    this.defaultExpiry = parseInt(
      this.config.get<string>('R2_SIGNED_URL_EXPIRY') ?? '3600',
      10,
    );

    this.client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: this.config.getOrThrow<string>('R2_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow<string>('R2_SECRET_ACCESS_KEY'),
      },
    });

    this.logger.log(
      `R2MediaProvider ready — bucket: ${this.bucket}, endpoint: ${endpoint}`,
    );
  }

  // ── Audio ────────────────────────────────────────────────────────────────

  async uploadAudio(
    songId: string,
    ext: string,
    buffer: Buffer,
  ): Promise<string> {
    const key = `audio/${songId}${ext}`;
    await this.put(key, buffer, this.mimeForExt(ext));
    this.logger.log(`Uploaded audio → ${key}`);
    return key;
  }

  // ── Artwork ───────────────────────────────────────────────────────────────

  async uploadArtistArtwork(
    artistId: string,
    ext: string,
    buffer: Buffer,
  ): Promise<string> {
    const key = `artists/${artistId}${ext}`;
    await this.put(key, buffer, this.mimeForExt(ext));
    this.logger.log(`Uploaded artist artwork → ${key}`);
    return key;
  }

  async uploadAlbumArtwork(
    albumId: string,
    ext: string,
    buffer: Buffer,
  ): Promise<string> {
    const key = `albums/${albumId}${ext}`;
    await this.put(key, buffer, this.mimeForExt(ext));
    this.logger.log(`Uploaded album artwork → ${key}`);
    return key;
  }

  // ── Object management ─────────────────────────────────────────────────────

  async deleteObject(key: string): Promise<void> {
    await this.client.send(
      new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
    );
    this.logger.log(`Deleted object → ${key}`);
  }

  async objectExists(key: string): Promise<boolean> {
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      return true;
    } catch {
      return false;
    }
  }

  // ── Presigned URL ─────────────────────────────────────────────────────────

  async getPresignedUrl(
    key: string,
    expiresIn: number = this.defaultExpiry,
  ): Promise<string> {
    const command = new GetObjectCommand({ Bucket: this.bucket, Key: key });
    const url = await getSignedUrl(this.client, command, { expiresIn });
    this.logger.debug(`Presigned URL for ${key} (expires ${expiresIn}s)`);
    return url;
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private async put(
    key: string,
    buffer: Buffer,
    contentType: string,
  ): Promise<void> {
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        ContentLength: buffer.byteLength,
      }),
    );
  }

  private mimeForExt(ext: string): string {
    const map: Record<string, string> = {
      '.mp3': 'audio/mpeg',
      '.wav': 'audio/wav',
      '.webp': 'image/webp',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.avif': 'image/avif',
    };
    return map[ext.toLowerCase()] ?? 'application/octet-stream';
  }
}
