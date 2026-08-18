import { Controller, Get, UseGuards } from '@nestjs/common';
import { LibraryService } from './library.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('library')
@UseGuards(JwtAuthGuard)
export class LibraryController {
  constructor(private libraryService: LibraryService) {}

  @Get('liked-songs')
  getLikedSongs(@CurrentUser() user: any) {
    return this.libraryService.getLikedSongs(user.sub);
  }

  @Get('saved-albums')
  getSavedAlbums(@CurrentUser() user: any) {
    return this.libraryService.getSavedAlbums(user.sub);
  }

  @Get('followed-artists')
  getFollowedArtists(@CurrentUser() user: any) {
    return this.libraryService.getFollowedArtists(user.sub);
  }
}
