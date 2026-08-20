import {
  Controller,
  Get,
  Query,
  Redirect,
  BadRequestException,
  Logger,
} from '@nestjs/common';
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
  @Get('artwork')
  @Redirect()
  async getArtworkUrl(@Query('key') key: string) {
    if (!key) {
      throw new BadRequestException('key query parameter is required');
    }

    // Only allow artwork keys — never expose audio through this endpoint
    if (!key.startsWith('artists/') && !key.startsWith('albums/')) {
      throw new BadRequestException(
        'Only artists/ and albums/ keys are allowed on this endpoint',
      );
    }

    const url = await this.media.getPresignedUrl(key, 3600);
    this.logger.debug(`Artwork redirect: ${key}`);
    return { url, statusCode: 302 };
  }
}
