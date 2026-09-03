import { Controller, Get, Post, Delete, Param, UseGuards } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@Controller('albums')
@UseGuards(JwtAuthGuard)
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Public()
  @Get()
  findAll() {
    return this.albumsService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.albumsService.findOne(id, user?.sub);
  }

  @Post(':id/save')
  save(@Param('id') id: string, @CurrentUser() user: any) {
    return this.albumsService.save(id, user.sub);
  }

  @Delete(':id/save')
  unsave(@Param('id') id: string, @CurrentUser() user: any) {
    return this.albumsService.unsave(id, user.sub);
  }
}
