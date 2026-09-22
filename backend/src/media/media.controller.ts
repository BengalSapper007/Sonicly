import {
  Controller,
  Get,
  Query,
  Redirect,
  BadRequestException,
  Logger,
  Header,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { MediaService } from './media.service';
import { Public } from '../common/decorators/public.decorator';

/**
 * MediaController — lightweight controller for media URL resolution.
 *
 * GET /api/media/artwork?key=artists/ar_abc.webp
 *   → 302 redirect to a short-lived presigned R2 URL
 *
 * This lets the frontend display artwork using standard <img src="...">
 * without embedding R2 credentials or knowing anything about storage.
 *
 * The redirect URL is a presigned R2 GET URL valid for 1 hour.
 * Browsers and CDNs can cache the redirect response but the actual
 * R2 signed URL will stop working after expiry.
 */
@Public()
@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);

  constructor(private readonly media: MediaService) {}

  /**
   * GET /api/media/artwork?key=<r2-object-key>
   *
   * Allowed key prefixes: artists/ | albums/
   * Audio keys (audio/) are NOT served here — use GET /api/songs/:id/stream.
   */
  @Throttle({ default: { ttl: 60_000, limit: 300 } }) // 300 artwork requests / min per IP to support dense image grids
  @Header('Cache-Control', 'public, max-age=3600, s-maxage=3600')
  @Get('artwork')
  @Redirect()
  async getArtworkUrl(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('key query parameter is required');
    }

    const cleanKey = key.replace(/^\/+/, '').replace(/^images\//, '');

    // Disallow path traversal, null bytes, and non-artwork key prefixes
    if (
      cleanKey.includes('..') ||
      cleanKey.includes('\0') ||
      (!cleanKey.startsWith('artists/') && !cleanKey.startsWith('albums/'))
    ) {
      throw new BadRequestException(
        'Invalid artwork key. Key must be prefixed with artists/ or albums/ and must not contain path traversal.',
      );
    }

    const url = await this.media.getPresignedUrl(cleanKey, 3600);
    this.logger.debug(`Artwork redirect: ${cleanKey}`);
    return { url, statusCode: 302 };
  }
}
