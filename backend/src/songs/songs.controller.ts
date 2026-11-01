import { Controller, Get, Post, Delete, Param, UseGuards, Req, Res, Headers } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { SongsService } from './songs.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('songs')
@UseGuards(JwtAuthGuard)
export class SongsController {
  constructor(private songsService: SongsService) {}

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.findOne(id, user?.sub);
  }

  /**
   * GET /api/songs/:id/stream
   *
   * Returns song metadata plus the streaming endpoint.
   * R2 bucket keys and AWS credentials remain entirely concealed from the client.
   */
  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 120 } })
  @Get(':id/stream')
  getStreamUrl(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.getStreamUrl(id, user?.sub);
  }

  /**
   * GET /api/songs/:id/audio
   *
   * Secure audio streaming proxy directly from R2 to the browser with HTTP Range
   * chunking support. Raw R2 URLs are never exposed in JSON or browser Network tabs.
   */
  @Public()
  @Get(':id/audio')
  async streamAudio(
    @Param('id') id: string,
    @Headers('range') range: string | undefined,
    @Res() res: Response,
  ) {
    const { stream, contentLength, contentRange, contentType, acceptRanges } =
      await this.songsService.getAudioStream(id, range);

    res.setHeader('Content-Type', contentType || 'audio/mpeg');
    res.setHeader('Accept-Ranges', acceptRanges || 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400, no-transform');

    if (contentRange) {
      res.status(206);
      res.setHeader('Content-Range', contentRange);
      if (contentLength !== undefined) {
        res.setHeader('Content-Length', contentLength);
      }
    } else if (contentLength !== undefined) {
      res.status(200);
      res.setHeader('Content-Length', contentLength);
    }

    // Pipe the S3 readable stream to express response
    (stream as any).pipe(res);
  }

  @Post(':id/like')
  like(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.like(id, user.sub);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.unlike(id, user.sub);
  }

  @Public()
  @Post(':id/play')
  recordPlay(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.recordPlay(id, user?.sub);
  }
}
