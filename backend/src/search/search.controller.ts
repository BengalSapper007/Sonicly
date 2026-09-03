import {
  Controller,
  Get,
  Post,
  Delete,
  Query,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SearchService } from './search.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { RecordRecentSearchDto } from './dto/recent-search.dto';

@Controller('search')
@UseGuards(JwtAuthGuard)
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 120 } }) // 120 searches / min per IP for smooth live typing
  @Get()
  search(
    @Query('q') q: string,
    @Query('type') type: 'all' | 'songs' | 'artists' | 'albums' | 'playlists' = 'all',
    @CurrentUser() user: any,
  ) {
    return this.searchService.search(q, type, user?.sub);
  }

  @Get('recent')
  getRecent(@CurrentUser() user: any) {
    return this.searchService.getRecentSearches(user.sub);
  }

  @Post('recent')
  recordRecent(@Body() dto: RecordRecentSearchDto, @CurrentUser() user: any) {
    return this.searchService.recordRecentSearch(user.sub, dto);
  }

  @Delete('recent/:id')
  removeRecent(@Param('id') id: string, @CurrentUser() user: any) {
    return this.searchService.removeRecentSearch(user.sub, id);
  }

  @Delete('recent')
  clearRecent(@CurrentUser() user: any) {
    return this.searchService.clearRecentSearches(user.sub);
  }
}
