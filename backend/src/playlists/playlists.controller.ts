import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Query,
} from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { CreatePlaylistDto, UpdatePlaylistDto, AddSongDto, ReorderSongsDto } from './dto/playlist.dto';

@Controller('playlists')
@UseGuards(JwtAuthGuard)
export class PlaylistsController {
  constructor(private playlistsService: PlaylistsService) {}

  @Public()
  @Get()
  getUserPlaylists(@CurrentUser() user: any, @Query('curated') curated?: string) {
    if (curated === 'true') return this.playlistsService.getCuratedPlaylists();
    if (!user) return this.playlistsService.getCuratedPlaylists();
    return this.playlistsService.getUserPlaylists(user.sub);
  }

  @Public()
  @Get('curated')
  getCurated() {
    return this.playlistsService.getCuratedPlaylists();
  }

  @Post()
  create(@Body() dto: CreatePlaylistDto, @CurrentUser() user: any) {
    return this.playlistsService.create(dto, user.sub);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.playlistsService.findOne(id, user?.sub);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdatePlaylistDto, @CurrentUser() user: any) {
    return this.playlistsService.update(id, dto, user.id);
  }

  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.playlistsService.delete(id, user.sub);
  }

  @Post(':id/songs')
  addSong(@Param('id') id: string, @Body() dto: AddSongDto, @CurrentUser() user: any) {
    return this.playlistsService.addSong(id, dto, user.id);
  }

  @Delete(':id/songs/:songId')
  removeSong(@Param('id') id: string, @Param('songId') songId: string, @CurrentUser() user: any) {
    return this.playlistsService.removeSong(id, songId, user.sub);
  }

  @Patch(':id/songs/reorder')
  reorderSongs(@Param('id') id: string, @Body() dto: ReorderSongsDto, @CurrentUser() user: any) {
    return this.playlistsService.reorderSongs(id, dto, user.id);
  }
}
