import { Controller, Get, Query } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { SearchService } from './search.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Public()
  @Throttle({ default: { ttl: 60_000, limit: 30 } }) // 30 searches / min per IP
  @Get()
  search(
    @Query('q') q: string,
    @Query('type') type: 'all' | 'songs' | 'artists' | 'albums' | 'playlists' = 'all',
  ) {
    return this.searchService.search(q, type);
  }
}
