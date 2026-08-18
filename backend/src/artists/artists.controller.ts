import {
  Controller, Get, Post, Delete, Param, UseGuards
} from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('artists')
@UseGuards(JwtAuthGuard)
export class ArtistsController {
  constructor(private artistsService: ArtistsService) {}

  @Public()
  @Get()
  findAll() {
    return this.artistsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.artistsService.findOne(id, user?.sub);
  }

  @Post(':id/follow')
  follow(@Param('id') id: string, @CurrentUser() user: any) {
    return this.artistsService.follow(id, user.sub);
  }

  @Delete(':id/follow')
  unfollow(@Param('id') id: string, @CurrentUser() user: any) {
    return this.artistsService.unfollow(id, user.sub);
  }
}
