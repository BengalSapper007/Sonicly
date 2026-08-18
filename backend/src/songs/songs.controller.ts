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

  @Post(':id/like')
  like(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.like(id, user.sub);
  }

  @Delete(':id/like')
  unlike(@Param('id') id: string, @CurrentUser() user: any) {
    return this.songsService.unlike(id, user.sub);
  }
}
