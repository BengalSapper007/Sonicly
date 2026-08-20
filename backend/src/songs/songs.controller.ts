import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
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
   * Returns song metadata plus a short-lived presigned R2 URL for audio
   * playback. The URL is safe to expose to authenticated browsers —
   * it carries no server-side credentials.
   *
   * The presigned URL expires after R2_SIGNED_URL_EXPIRY seconds (default 1h).
   * R2 supports HTTP Range requests on signed URLs, enabling seeking.
   */
  @Public()
  @Get(':id/stream')
  getStreamUrl(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.getStreamUrl(id, user?.sub);
  }

  @Post(':id/like')
  like(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.like(id, user.sub);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.unlike(id, user.sub);
  }
}
